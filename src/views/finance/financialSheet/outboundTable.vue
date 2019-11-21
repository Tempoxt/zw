  <template>
  <ui-table ref="table" 
	:table_column="table_field" 
	:table_query.sync="table_form.query"
	@query="querySubmit"
  >
	<el-dialog
		title="请选择重置月份"
		:visible.sync="dialogFormVisible"
		class="public-dialog"
		v-el-drag-dialog
		width="520px"
		>
		<el-form ref="form" :model="form">
			<el-row>
				<el-col :span="24" style="padding:20px;">
					<el-date-picker
						v-model="form.dateLap"
						type="month"
						size="small"
						format="yyyy年MM月"
						value-format="yyyy-MM"
						placeholder="选择月份">
					</el-date-picker>
				</el-col>
			</el-row>
		</el-form>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogFormVisible = false">取 消</el-button>
			<el-button type="primary" @click="handleFormSubmit" :disabled="disabled">确 定</el-button>
		</div>
	</el-dialog>


    <table-header
      :table_actions="table_actions"
      :table_selectedRows="table_selectedRows"
      @action="handleAction"
      :table_form.sync="table_form"
      :table_column="table_field"
    >
     	<div style="padding-left:10px">
			<dateLap v-model="table_form.dateLap" :disabled="true" @change="fetch"/>
    	</div>
    </table-header>
    <el-table
        ref="elTable"
      @selection-change="handleChangeSelection"
      :data="table_data"
      border
      style="width: 100%"
      v-loading="table_loading"
      :header-cell-style="headerCellStyle"
      :height="table_height"
      @header-dragend="table_dragend"
      @sort-change="table_sort_change"
    >
		<el-table-column 
		type="selection" 
		width="60" 
		class-name="table-column-disabled"
		:selectable="table_disable_selected"
		>
		</el-table-column>
		<el-table-column type="index" :index="indexMethod" width="70"/>
		<each-table-column :table_field="table_field"/>
    </el-table>
    <table-pagination 
        :total="table_form.total" 
        :pagesize.sync="table_form.pagesize"
        :currentpage.sync="table_form.currentpage"
        @change="fetchTableData"
        :table_config="table_config"
    />
  </ui-table>
</template>
<script>
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";
import OrgSelect from '@/components/Org/OrgSelect'
import dayjs from 'dayjs'
import { MessageBox } from 'element-ui';
let baseUrl = process.env.VUE_APP_STATIC
let baseUri = process.env.VUE_APP_BASEAPI
const download = require('downloadjs')
export default {
	mixins: [table_mixin],
	props:['url','a'],
	components:{
		OrgSelect
	},
	data() {
		return {
			baseUrl,
			baseUri,
			loading: true,
            api_resource:api_common.resource('prodpropelplan/'+this.url),
			orgCategory:[],
			queryDialogFormVisible:true,
			form:{
				dateLap:''
			},
			table_topHeight:276,
			dialogFormVisible:false,
			timer:'',
			statusk:1,
			result:'',
		};
	},
	computed:{
		disabled(){
			if(this.form.dateLap!==''&&this.form.dateLap!==undefined){
                return false
            }
            return true
		},
	},
	watch:{
		url(){
			delete this.table_form.keyword
			this.table_form.query.query = []
            this.table_form.currentpage = 1
            this.api_resource = api_common.resource('prodpropelplan/'+this.url)
            this.fetchMenu()
		}
	},
	methods: {
        fetch(){
            this.table_form.currentpage = 1
            this.fetchTableData()
		},
		async getUrl(){
			if(this.statusk!=0){
				try{
					this.result = await api_common.resource('prodpropelplan/'+this.url+'/exportresult').get({alert:false})
					if(this.result!=''){
						const res = download(baseUri+'/'+this.result)
						this.statusk = 0
					}
				}catch(err){
					// clearInterval(this.timer)
				}
			}else{
				clearInterval(this.timer)
			}
		},
		ab2str(u,f) {
			var b = new Blob([u]);
			var r = new FileReader();
			r.readAsText(b, 'utf-8');
			r.onload = function (){if(f)f.call(null,r.result)}
		},
		async download(){
			this.statusk = 1
			if(this.timer!=''){
				clearInterval(this.timer)
			}
			try{
				const { data,name,contentType} =  await this.api_resource.export(this.table_form,{
					responseType:'arraybuffer'
				})
				var that = this
				this.ab2str(data,function(str){
					that.$message.success({ message: str,duration:5000});
				});
				this.timer = setInterval(()=>{
					this.getUrl()
				}, 10000)
			}catch(err){
				console.log(err)
			}
		},
		async getResult(){
			if(this.statusk!=0){
				if(this.a=='1'){
					this.val = await this.$request.get('prodpropelplan/materialsexware/resetresult')
				}else{
					this.val = await this.$request.get('prodpropelplan/otherexware/resetresult')
				}
				if(this.val=='重置成功'){
					this.statusk = 0
					this.$message.success({ message: this.val})
					this.fetchTableData()
				}
			}else{
				clearInterval(this.timer)
			}
		},
		async handleFormSubmit(){
			this.dialogFormVisible = false
			this.statusk = 1
			if(this.a=='1'){
				const mes = await this.$request.post('prodpropelplan/materialsexware/list/reset',{dateLap:this.form.dateLap})
				this.$message.success({message: mes})
			}else{
				const mes = await this.$request.post('prodpropelplan/otherexware/list/reset',{dateLap:this.form.dateLap})
				this.$message.success({message: mes})
			}
			this.timer = setInterval(()=>{
				this.getResult()
			},10000)
		},
		async reset(){
			this.form={}
			this.dialogFormVisible = true
		},
		async fetchTableData() {
			this.table_loading = true;
			const {rows , total }= await this.api_resource.get(this.table_form);
			this.table_data  = rows
			this.table_form.total = total
			setTimeout(() => {
				this.table_loading = false;
			}, 300);
		},
		async fetchMenu(){
			const { field, action,table } = await api_common.menuInit(this.url);
			this.table_field = field;
			this.table_actions = action;
			this.table_config = table
			this.$set(this.table_form,'dateLap', dayjs().subtract(1,'month').format('YYYY-MM'))
			// this.$set(this.table_form,'dateLap',dayjs().format('YYYY-MM'))
            setTimeout(()=>{  
                this.fetchTableData();
            },500)
		}
	},
	async created() {
		await this.fetchMenu()
	}
};
</script>


