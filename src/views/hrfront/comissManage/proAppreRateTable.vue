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
		<div style="padding-left:10px" v-if="m==1">
			<dateLap type="2" :disabled="true" v-model="table_form.dateLap" @change="fetch"/>
		</div>
		<div style="padding-left:10px" v-if="m==2">
			<el-select v-model="form.quarter" placeholder="请选择" @change="fetch">
				<el-option
				v-for="item in quarter"
				:key="item.season"
				:label="item.title"
				:value="item.season">
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
		<each-table-column :table_field="table_field"/>
		 <!-- :template="template" -->
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
const api_resource = api_common.resource("commission/valueIncrease");
export default {
	mixins: [table_mixin],
	props:['id','url','m'],
	components:{
		dateLap
	},
	data() {
		return {
			loading: true,
			api_resource,
			orgCategory:[],
			form:{},
			queryDialogFormVisible:true,
			table_topHeight:276,
			dialogForm1Visible:false,
			dialogFormVisible:false,
			quarter:[]
		};
	},
	watch:{
		id(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
		url(){
			this.table_form.keyword = ''
			this.table_form.currentpage = 1
			this.table_form.query.query= []
			this.fetchMenu()
			this.fetchQuarter()
			this.form.quarter = this.quarter[0].season;
			this.$set(this.table_form,'dateLap',dayjs().format('YYYY-MM'))
		}
	},
	methods: {
        fetch(){
            this.table_form.currentpage = 1
            this.fetchTableData()
        },
		async reset(){
			const mes = await this.$request.post('commission/valueIncrease/reset',{dateLap:this.table_form.dateLap})
			this.$message.success({message: mes})
			this.fetchTableData()
		},
		async fetchQuarter(){
			this.quarter = await api_common.resource('commission/seasonValueIncrease/optional').get()
		},
		async fetchTableData() {
			if(!this.id){
				return
			}
			this.table_loading = true;
			this.table_form.org_id = this.id
			if(this.url=="commission/monthDetail"){
				const {rows , total } = await api_resource.get(this.table_form)
				this.table_data  = rows
				this.table_form.total = total
			}else{
				this.table_form.dateLap = this.form.quarter
				const {rows , total }= await api_common.resource('commission/seasonValueIncrease').get(this.table_form)
				this.table_data  = rows
				this.table_form.total = total
			}
			setTimeout(() => {
				this.table_loading = false;
			}, 300);
    	},
		async fetchMenu(){
			const { field, action,table } = await api_common.menuInit(this.url);
			this.table_field = field;
			this.table_actions = action;
			this.table_config = table
			this.fetchTableData();
		}
	},
	async created() {
		this.$set(this.table_form,'dateLap',dayjs().format('YYYY-MM'))
		await this.fetchMenu()
		await this.fetchQuarter()
	}
};
</script>


