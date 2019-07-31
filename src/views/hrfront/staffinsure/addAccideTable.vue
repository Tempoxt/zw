  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  >

	<el-dialog
		title="请选择加保申请日期"
		:visible.sync="dialogForm1Visible"
		class="public-dialog"
		v-el-drag-dialog
		width="520px"
		>

		<el-form ref="form1" :model="form1" label-width="100px" :inline="true" >
			<el-row>
				<el-col :span="24" style="padding:20px;">
					<form-render :type="`day`" prop="dateLap" :field="{name:''}" v-model="form1.dateLap"/>
					<!-- <el-input v-model="form.reason" placeholder="请输入退回原因（必填）"  size="small"></el-input> -->
				</el-col>
			</el-row>
		</el-form>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogForm1Visible = false">取 消</el-button>
			<el-button type="primary" @click="handleForm1Submit" :disabled="disabled">确 定</el-button>
		</div>
	</el-dialog>

	<el-dialog
		title="请选择扣费开始日期"
		:visible.sync="dialogForm2Visible"
		class="public-dialog"
		v-el-drag-dialog
		width="520px"
		>

		<el-form ref="form2" :model="form2" label-width="100px" :inline="true" >
			<el-row>
				<el-col :span="24" style="padding:20px;">
					<form-render :type="`day`" prop="dateLap" :field="{name:''}" v-model="form2.dateLap"/>
					<!-- <el-input v-model="form.reason" placeholder="请输入退回原因（必填）"  size="small"></el-input> -->
				</el-col>
			</el-row>
		</el-form>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogForm2Visible = false">取 消</el-button>
			<el-button type="primary" @click="handleForm2Submit" :disabled="disabled2">确 定</el-button>
		</div>
	</el-dialog>

    <table-header
		:table_actions="table_actions"
		:table_selectedRows="table_selectedRows"
		@action="handleAction"
		:table_form.sync="table_form"
		:table_column="table_field"
		>
		<div style="padding-left:10px" v-if="insure_status==2">
			<el-select v-model="table_form.serialNumber" placeholder="请选择流水号" clearable filterable @change="fetchTableData">
				<el-option
					v-for="item in serialnumber"
					:key="item.serialNumber"
					:label="item.serialNumber"
					:value="item.serialNumber">
				</el-option>
			</el-select>
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
		v-if="this.insure_status!=2"
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
import dayjs from 'dayjs'
const api_resource = api_common.resource("staffinsure/accidentinsurance");
const download = require('downloadjs')
export default {
	mixins: [table_mixin],
	props:['id','insure_status'],
	data() {
		return {
			loading: true,
			api_resource,
			orgCategory:[],
			queryDialogFormVisible:true,
			serialnumber:[],
			form1:{
				dateLap:''
			},
			form2:{
				dateLap:''
			},
			table_topHeight:286,
			dialogForm1Visible:false,
			dialogForm2Visible:false,
			template:{
				staff__onDutyTime(column,row){
					if(row.expire){
						if(row.expire==1){
							return <span style="color:#F47A24">{row.staff__onDutyTime}</span>
						}else if(row.expire==2||row.expire==3){
							return <span style="color:#F2353C">{row.staff__onDutyTime}</span>
						}else{
							return <span>{row.staff__onDutyTime}</span>
						}
					}else{
						return <span>{row.staff__onDutyTime}</span>
					}
				},
      		}
		};
	},
	watch:{
		id(){
			this.fetchTableData()
		},
		insure_status(){
			this.table_form.currentpage = 1
			this.fetchMenu()
			if(this.insure_status==2){
				this.fetchNum()
			}
		}
	},
	computed:{
		disabled(){
			if(this.form1.dateLap!==''){
                return false
            }
            return true
		},
		disabled2(){
			if(this.form2.dateLap!==''){
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
			this.table_form.insureType = 3
			if(this.insure_status==1){
				this.table_form.serialNumber = ''
				const {rows , total }= await this.$request.get('staffinsure/insurewaitaffirm',{params:this.table_form})
				this.table_data  = rows
				this.table_form.total = total
				setTimeout(() => {
					this.table_loading = false;
				}, 300);
			}else{
				if(this.insure_status==3){
					this.table_form.serialNumber = ''
				}
				this.table_form.insureStatus = this.insure_status
				const {rows , total }= await api_resource.get(this.table_form);
				this.table_data  = rows
				this.table_form.total = total
				setTimeout(() => {
					this.table_loading = false;
				}, 300);
			}
			setTimeout(() => {
				this.table_loading = false;
			}, 300);
		},
		async fetchNum(){
			if(this.insure_status==2){
				this.serialnumber = await this.$request.get('staffinsure/getserialnumber?insureType=3&insureStatus='+this.insure_status)
				if(this.serialnumber==''){
					this.table_form.serialNumber = ''
				}else{
					this.table_form.serialNumber = this.serialnumber[0].serialNumber
				}
			}else{
				this.table_form.serialNumber = ''
			}
		},
		ab2str(u,f) {
		   var b = new Blob([u]);
		   var r = new FileReader();
		    r.readAsText(b, 'utf-8');
		    r.onload = function (){if(f)f.call(null,r.result)}
		},
		apply(){
			this.form1.dateLap = ''
			this.dialogForm1Visible = true
		},
		async handleForm1Submit(){
			let rows = this.table_selectedRows.map(row=>row.staff)
			var len = rows.length;
			try{
				const { data,name,contentType} = await this.$request.put('staffinsure/applyinsure',{
					empIds: rows.join(','),
					insureType: 3,
					dateLap:this.form1.dateLap
				},{ responseType:'arraybuffer',alert:false})
				this.$message({
					message: '申请成功,共'+len+'人',
					type: 'success'
				});
				let today = dayjs().format('YYYY-MM-DD')
				let day = today.split('-').join('');
				let namei = '新增被保险人名单';
				download(data,namei+day,contentType)
				this.fetchTableData();
			}catch(err){
				var that = this;
				that.ab2str(err.error.response.data,function(str){
					that.$message.error({ message: str });
				});
			}finally{
				this.dialogForm1Visible = false
			}
		},
		passAcc(){
			this.form2.dateLap = ''
			this.dialogForm2Visible = true
		},
		async handleForm2Submit(){
			if(this.table_form.serialNumber==''){
				this.$message.error('请选择流水号');
			}else{
				await this.$request.put('staffinsure/inpassinsure',{
					insureType: 3,
					serialNumber: this.table_form.serialNumber,
					dateLap:this.form2.dateLap
				})
				this.fetchNum();
				setTimeout(()=>{
					this.fetchTableData();
				},500)
			}
			this.dialogForm2Visible = false
		},
		async fetchMenu(){
			const { field, action,table } = await api_common.menuInit("AccidentIns"+this.insure_status);
			this.table_field = field;
			this.table_actions = action;
			this.table_config = table
			setTimeout(()=>{
				this.fetchTableData();
			},500)
		},
		async backAcc(){
			if(this.table_form.serialNumber==''){
				this.$message.error('请选择流水号');
			}else{
				await this.$request.put('staffinsure/inrejectinsure',{
					insureType: 3,
					serialNumber: this.table_form.serialNumber
				})
				this.fetchNum();
				
				setTimeout(()=>{
					this.fetchTableData();
				},500)
			}
		},
	},
	async created() {
		await this.fetchMenu()
		await this.fetchNum()
	}
};
</script>


