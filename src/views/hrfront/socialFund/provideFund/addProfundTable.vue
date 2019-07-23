  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  >

  		<el-dialog
			title="公积金设立申请退回"
			:visible.sync="dialogFormVisible"
			class="public-dialog"
			v-el-drag-dialog
			width="520px"
			>

			<el-form ref="form" :model="form" label-width="100px" :inline="true">
				<el-row>
					<el-col :span="24" style="padding:20px;">
						<el-input v-model="form.reason" placeholder="请输入退回原因（必填）"  size="small"></el-input>
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
		<div style="padding-left:10px" v-if="insure_status==11">
				<!-- <span>社保主体:  </span> -->
				<el-select v-model="table_form.socialSecurityMain" clearable @change="fetchTableData" placeholder="请选择社保主体">
					<el-option
					v-for="item in company"
					:key="item.id"
					:label="item.company"
					:value="item.company">
					</el-option>
				</el-select>
			</div>
		<div style="padding-left:10px" v-if="insure_status==12">
          <dateLap v-model="table_form.dateLap" @change="fetchTableData"/>
        </div>
    </table-header>
    <el-table
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
    <each-table-column :table_field="table_field" :template="template"/>
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
const api_resource = api_common.resource("staffinsure/accumulationfund");
const download = require('downloadjs')
import dateLap from '@/components/Table/DateLap'
import dayjs from 'dayjs'
export default {
	mixins: [table_mixin],
	props:['id','insure_status'],	
	components:{
		dateLap
	},
	data() {
		return {
			loading: true,
			api_resource,
			orgCategory:[],
			queryDialogFormVisible:true,
			dialogFormVisible:false,
      		table_topHeight:286,
			template:{
				staff__onDutyTime(column,row){
					if(row.expire){
						if(row.expire==1){
							return <span style="color:#F47A24">{row.staff__onDutyTime}</span>
						}else if(row.expire==2){
							return <span style="color:#F2353C">{row.staff__onDutyTime}</span>
						}else if(row.expire==3){
							return <span style="color:#F2353C">{row.staff__onDutyTime}</span>
						}else{
							return <span>{row.staff__onDutyTime}</span>
						}
					}else{
						return <span>{row.staff__onDutyTime}</span>
					}
				}
			},
			form:{
				reason:''
			},
			company:[],
			table_form:{
				socialSecurityMain:'松岗总公司'
			}
		};
	},
	watch:{
		id(){
			this.fetchTableData()
		},
		insure_status(){
			if(this.insure_status==12){
				this.$set(this.table_form,'dateLap',dayjs().format('YYYY-MM'))
    			this.table_form.socialSecurityMain = ''
			}else if(this.insure_status==13){
    			this.table_form.socialSecurityMain = ''
				this.table_form.dateLap =''
			}else{
				this.getComp()
				this.table_form.dateLap =''
    			this.table_form.socialSecurityMain = '松岗总公司'
			}
			this.fetchMenu()
			this.fetchTableData()
		}
	},
	computed:{
		disabled(){
			let rea = this.form.reason.replace(/(^\s*)|(\s*$)/g, "")
			if(rea.length!==0){
                return false
            }
            return true
		}
	},
	methods: {
		async fetchTableData() {
			if(!this.id){
				return
			}
			this.table_loading = true;
			this.table_form.org_id = this.id
			this.table_form.insureStatus = this.insure_status
			const {rows , total }= await api_resource.get(this.table_form);
			this.table_data  = rows
			this.table_form.total = total
			setTimeout(() => {
				this.table_loading = false;
			}, 300);
		},
		async getComp(){
			this.company = await this.$request.get('staffinsure/getsubcompany')
		},
		ab2str(u,f) {
		   var b = new Blob([u]);
		   var r = new FileReader();
		    r.readAsText(b, 'utf-8');
		    r.onload = function (){if(f)f.call(null,r.result)}
		},
		async apply(){
			let rows = this.table_selectedRows.map(row=>row.staff)
			const len = rows.length;
			try{
				const { data,name,contentType} = await this.$request.put('staffinsure/applyinsure',{
					empIds: rows.join(','),
					insureType: 2
				},{ responseType:'arraybuffer',alert:false})
				this.$message({
					message: '申请成功,共'+len+'人',
					type: 'success'
				});
				let today = dayjs().format('YYYY-MM-DD')
				let day = today.split('-').join('');
				let namei = '公积金个人账户设立';
				download(data,namei+day,contentType)
				this.fetchTableData();
			}catch(err){
				var that = this;
				that.ab2str(err.error.response.data,function(str){
					that.$message.error({ message: str });
				});
			}
		},
		async pass(){
			let rows = this.table_selectedRows.map(row=>row.id)
			await this.$request.put('staffinsure/inpassinsure',{
				ids :rows.join(','),
				insureType: 2,
			})
			this.fetchTableData();
		},
		back(){
			this.form.reason = ''
			this.dialogFormVisible = true
		},
		async handleFormSubmit(){
			let rows = this.table_selectedRows.map(row=>row.id)
			await this.$request.put('staffinsure/inrejectinsure',{
				ids :rows.join(','),
				insureType: 2,
				remark: this.form.reason
			})
			this.dialogFormVisible = false
			this.fetchTableData();
		},
		async fetchMenu(){
			const { field, action,table } = await api_common.menuInit("ReserveFund"+this.insure_status);
			this.table_field = field;
			this.table_actions = action;
			this.table_config = table
		}
	},
	async created() {
		await this.fetchMenu()
		this.getComp()
		setTimeout(()=>{
			this.fetchTableData();
		},500)
	}
};
</script>


