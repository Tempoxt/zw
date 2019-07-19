  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  >

    <table-header
		:table_actions="table_actions"
		:table_selectedRows="table_selectedRows"
		@action="handleAction"
		:table_form.sync="table_form"
		:table_column="table_field"
		>
		<div style="padding-left:10px" v-if="insure_status==22">
			<el-select v-model="table_form.serialNumber" placeholder="请选择" clearable filterable @change="fetchTableData">
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
			table_topHeight:286,
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
			this.fetchMenu()
			this.fetchTableData()
			this.fetchNum()
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
		async fetchNum(){
			if(this.insure_status==22){
				this.serialnumber = await this.$request.get('staffinsure/getserialnumber?insureType=3&insureStatus='+this.insure_status)
			}
		},
		async apply(){
			let rows = this.table_selectedRows.map(row=>row.staff)
			await this.$request.put('staffinsure/applyinsure',{
				empIds: rows.join(','),
				insureType: 3
			})
			this.fetchTableData();
		},
		async fetchMenu(){
			const { field, action,table } = await api_common.menuInit("AccidentIns"+this.insure_status);
			this.table_field = field;
			this.table_actions = action;
			this.table_config = table
		},
		async pass(){
			let rows = this.table_selectedRows.map(row=>row.id)
			await this.$request.put('staffinsure/inpassinsure',{
				ids :rows.join(','),
				insureType: 3,
				serialNumber: this.table_form.serialNumber
			})
			this.fetchTableData();
		},
		async back(){
			let rows = this.table_selectedRows.map(row=>row.id)
			await this.$request.put('staffinsure/inrejectinsure',{
				ids :rows.join(','),
				insureType: 3,
				serialNumber: this.table_form.serialNumber
			})
			this.fetchTableData();
		},
	},
	async created() {
		this.fetchMenu()
		this.fetchNum()
		this.fetchTableData();
	}
};
</script>


