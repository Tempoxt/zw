  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  
  >
  		<el-dialog
			title="社保注销申请退回"
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
		<div style="padding-left:10px" v-if="insure_status==5">
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
import dateLap from '@/components/Table/DateLap'
import dayjs from 'dayjs'
const api_resource = api_common.resource("staffinsure/socialinsurance");
const download = require('downloadjs')
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
				staff__outDutyTime(column,row){
					if(row.expire){
						if(row.expire==1){
							return <span style="color:#F47A24">{row.staff__outDutyTime}(需要处理)</span>
						}else if(row.expire==2){
							return <span style="color:#F2353C">{row.staff__outDutyTime}(急需处理)</span>
						}else if(row.expire==3){
							return <span style="color:#F2353C">{row.staff__outDutyTime}(逾期)</span>
						}else{
							return <span>{row.staff__outDutyTime}</span>
						}
					}else{
						return <span>{row.staff__outDutyTime}</span>
					}
				}
			},
			form:{
				reason:''
			}
		};
	},
	watch:{
		id(){
			this.fetchTableData()
		},
		insure_status(){
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
		async apply(){
			let rows = this.table_selectedRows.map(row=>row.id)
			const len = rows.length;
			const { data,name,contentType} = await this.$request.put('staffinsure/applycancelinsure',{
				ids: rows.join(','),
				insureType: 1
			},{ responseType:'arraybuffer',alert:false})
			this.$message({
				message: '注销成功,共'+len+'人',
				type: 'success'
			});
			let today = dayjs().format('YYYY-MM-DD')
			let day = today.split('-').join('');
			let namei = '人员批量停交报盘表';
			download(data,namei+day||this.$route.meta.title+day,contentType)
		},
		async pass(){
			let rows = this.table_selectedRows.map(row=>row.id)
			await this.$request.put('staffinsure/outpassinsure',{
				ids :rows.join(','),
				insureType: 1,
			})
			this.fetchTableData();
		},
		back(){
			this.form.reason = ''
			this.dialogFormVisible = true
		},
		async handleFormSubmit(){
			let rows = this.table_selectedRows.map(row=>row.id)
			await this.$request.put('staffinsure/outrejectinsure',{
				ids :rows.join(','),
				insureType: 1,
				remark: this.form.reason
			})
			this.dialogFormVisible = false
			this.fetchTableData();
		},
		async fetchMenu(){
			const { field, action,table } = await api_common.menuInit("SocialIns"+this.insure_status);
			this.table_field = field;
			this.table_actions = action;
			this.table_config = table
		}
	},
	async created() {
		await this.fetchMenu()
		setTimeout(()=>{
			this.fetchTableData();
		},500)
	}
};
</script>


