  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  
  >


	<el-dialog
		:title="dialogStatus==='insert'?'添加月费单':'编辑月费单'"
		:visible.sync="dialogFormVisible"
		class="public-dialog"
		v-el-drag-dialog
		width="600px"
		>
		<el-form ref="form" :model="form" label-width="100px">
			<el-row :gutter="20">
				<el-col :span="20" :offset="2">
					<el-form-item label="房间">
						{{this.data.roomName}}
					</el-form-item>
				</el-col>
				<!-- <el-col :span="24">
					<el-form-item label="日期">
						<el-date-picker
						v-model="form.month"
						type="month"
						format="yyyy年MM月"
						value-format="yyyy-MM"
						@change="changeFormMonth"
						placeholder="选择月">
						</el-date-picker>
					</el-form-item>
				</el-col> -->
				<!-- <el-col :span="24">
					<form-render :type="`input`" :field="{name:'电费单价'}" v-model="form.electricPrice" />
				</el-col> -->
				<!-- <el-col :span="24">
					<form-renderc :type="`input`" :field="{name:'水费-单价'}" v-model="form.waterPrice" />
				</el-col> -->
				<el-col :span="20" :offset="2">
					<el-form-item label="上月电表读数">
						{{this.form.lastElectric}}
					</el-form-item>
				</el-col>
				<el-col :span="20" :offset="2">
					<el-form-item label="上月水表读数">
						{{this.form.lastWater}}
					</el-form-item>
				</el-col>
				<el-col :span="20" :offset="2">
					<form-render :type="`input`" :field="{name:'本月电表读数'}" v-model="form.currentElectric" />
				</el-col>
				<el-col :span="20" :offset="2">
					<form-render :type="`input`" :field="{name:'本月水表读数'}" v-model="form.currentWater" />
				</el-col>
			</el-row>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogFormVisible = false">取 消</el-button>
			<el-button type="primary" @click="handleFormSubmit">确 定</el-button>
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
        <el-date-picker
          v-model="table_form.month"
          type="month"
          size="medium"
          @change="fetch"
          format="yyyy年MM月"
          value-format="yyyy-MM"
          placeholder="选择月份">
        </el-date-picker>
    </div>

    </table-header>
    <el-table
        ref="elTable"
		@selection-change="handleChangeSelection"
		:row-class-name="table_state_className"
		:data="table_data"
		border
		style="width: 100%"
		v-loading="table_loading"
		:header-cell-style="headerCellStyle"
		:height="table_height"
		@header-dragend="table_dragend"
		@sort-change="table_sort_change"
		:show-summary="table_config.isShowFooter"
		:summary-method="getSummaries"
    >
		<el-table-column 
			type="selection" 
			width="60" 
			class-name="table-column-disabled"
			:selectable="table_disable_selected"
		>
		</el-table-column>
		<el-table-column type="index" :index="indexMethod" />
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
const api_resource = api_common.resource("dormitory/roommonthbill");
import dayjs from 'dayjs'
export default {
	mixins: [table_mixin],
	props:['id','data'],
	data() {
		return {
			loading: true,
			month:'',
			form:{},
			checked: [],
			api_resource,
			orgCategory:[],
			queryDialogFormVisible:true,
			roomList:[],
			dialogFormVisible:false,
			template:{
				checkState(column,row){
					return <div>{['待入住','已入住','待搬离','已搬离'][row.checkState]}</div>
				},
			},
            table_topHeight:235,
		};
	},
	watch:{
		id(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		}
	},
	methods: {
		fetch(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
		async fetchTableData() {
			this.table_loading = true;
			this.table_form.room = this.id||6
			const {rows , total }= await api_resource.get(this.table_form);
			this.table_data  = rows
			this.table_form.total = total
			setTimeout(() => {
				this.table_loading = false;
			}, 300);
		},
		// filterMethod(query, item){
		// 	return (item.employeeCode+'').indexOf(query) > -1|| (item.chineseName+'').indexOf(query) > -1;
		// },
		async add(){
			this.dialogFormVisible = true
			this.form = {}
		},
		async edit(){
			this.dialogFormVisible = true;
			let row = this.table_selectedRows[0]
			this.form = await api_resource.find(row.id)
		},
		async handleFormSubmit(){
			delete this.form.month
			this.form.room = this.id
			await this.$request.put('dormitory/roommonthbill/'+this.form.id,this.form)
			this.dialogFormVisible = false
			this.fetchTableData()
		}
	},
	async created() {
		this.$set(this.table_form,'month', dayjs().format('YYYY-MM'))
		const { field, action,table } = await api_common.menuInit("dormitory/roommonthbill");
		this.table_field = field;
		this.table_actions = action;
		this.table_config = table
		this.fetchTableData();
	}
};
</script>


<style lang="scss" scoped>
.transfer-footer {
    display: flex;
    height: 100%;
    align-items: center;
    span {
        padding-left: 6px;
    }
}
.public-dialog {
    /deep/ .el-transfer-panel {
        width: 300px;
    }
    /deep/ .el-transfer-panel__body {
        height: 370px;
    }
    /deep/ .el-transfer-panel__list.is-filterable {
        height: 320px !important;
    }
}
</style>
