  <template>
  <ui-table 
	ref="table" 
	:table_column="table_field" 
	:table_query.sync="table_form.query"
	@query="querySubmit"
  >


  
  	<el-dialog
		:title="dialogStatus==='insert'?'批量分配':'编辑'"
		:visible.sync="dialogFormVisible"
		class="public-dialog"
		v-el-drag-dialog
		width="750px"
		>
		<div style="width:710px;margin:0 auto"    v-loading="dialogLoading">
			<el-form ref="form" :model="form" label-width="100px">
				<el-row :gutter="20">
					<el-col :span="24">
						<el-transfer
							style="text-align: left; display: inline-block"
							v-model="checked"
							filterable
							:titles="['待分配人员', '已入住人员']"
							:props="{
								key: 'id',
							}"
							:format="{
								noChecked: '${total}',
								hasChecked: '${checked}/${total}'
							}"
							:data="distributionData"
							:filter-method="filterMethod"
							>
							<span slot-scope="{ option }">{{ option.employeeCode }}  {{ option.chineseName }} {{ option.department }} </span>
							<!-- <el-button class="transfer-footer" slot="left-footer" size="small">操作</el-button> -->
							<div slot="right-footer" class="transfer-footer">
								<span>房号</span>
								<span>{{data.roomName}}</span>
								<span>{{data.totalBeds}}</span>
								<span>-</span>
								<span>{{data.totalBeds-(data.totalBeds - checked.length)}} </span>
								<div style="color:red;font-size:12px" v-if="checked.length>data.totalBeds">超出床位数</div>

							</div>
							<!-- <el-button class="transfer-footer" size="small">操作</el-button> -->
							<el-button class="transfer-footer" slot="titles" size="small">操作</el-button>
						</el-transfer>
					</el-col>
				</el-row>
			</el-form>
		</div>

		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogFormVisible = false">取 消</el-button>
			<el-button type="primary" @click="handleFormSubmit" :disabled="checked.length>data.totalBeds">确 定</el-button>
		</div>
	</el-dialog>

 	<el-dialog
		title="入住分配"
		:visible.sync="dialogFormVisible2"
		class="public-dialog"
		v-el-drag-dialog
		width="500px"
		>
		<el-form ref="form" :model="form" label-width="100px" v-loading="dialogLoading2">
			<el-row :gutter="20">
				<el-col :span="24">
					<el-form-item label="宿舍">
					{{distributionRow.dormName}}
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="房号">
					{{distributionRow.roomName}}
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<el-form-item label="床位号">
					{{distributionRow.bedName}}
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<form-render :type="`select`" :field="{name:'入住员工',options:memberList}" filterable  v-model="distribution_form.empId"/>
				</el-col>
				<el-col :span="24">
					<form-render :type="`textarea`" autosize :row="1" :field="{name:'备注/说明'}" v-model="distribution_form.remark" placeholder="请输入"/>
				</el-col>
			</el-row>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogFormVisible2 = false">取 消</el-button>
			<el-button type="primary" @click="handleFormSubmit2">确 定</el-button>
		</div>
	</el-dialog>


	<el-dialog
		title="退宿"
		:visible.sync="dialogFormVisible3"
		class="public-dialog"
		v-el-drag-dialog
		width="500px"
		>
		<el-form ref="form" :model="checkinout_form" label-width="100px">
			<el-row :gutter="20">
				<el-col :span="24">
					<el-form-item label="退宿员工">
						<span v-for="(item,i) in checkinoutRows" :key="i">{{item.chineseName}} </span>
					</el-form-item>
				</el-col>
				<el-col :span="24">
					<form-render :type="`day`" :field="{name:'申请退宿时间'}" v-model="checkinout_form.checkoutApplyDate" />
				</el-col>
				<el-col :span="12">
					<form-render
						:type="`select`"
						:field="{name:'退宿原因',options:[{label:'离职',value:0},{label:'其他',value:1}]}"
						v-model="checkinout_form.checkoutReason"
					/>
				</el-col>
			</el-row>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="dialogFormVisible3 = false">取 消</el-button>
			<el-button type="primary" @click="handleFormSubmit3">确 定</el-button>
		</div>
	</el-dialog>


	<el-dialog
		title="选择导出报表"
		:visible.sync="dialogFormVisible5"
		class="public-dialog"
		v-el-drag-dialog
		width="600px"
		>
		<div style="padding:10px 0 40px">
			<el-button style="margin:5px" v-for="list in exportList" :key="list.title" @click="exportFile(list.url)">{{list.title}}</el-button>
		</div>
	</el-dialog>


    <table-header
		:table_actions="table_actions"
		:table_selectedRows="table_selectedRows"
		@action="handleAction"
		:table_form.sync="table_form"
		:table_column="table_field"
    ></table-header>
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
		<el-table-column
			fixed="right"
			label="操作"
			width="100">
			<template slot-scope="scope">
				<el-button @click="distribution(scope.row)" type="text" size="small" v-if="scope.row.checkState===3||scope.row.checkState===4">分配</el-button>
				<el-button @click="checkinout(scope.row)" type="text" size="small" v-if="scope.row.checkState===1">退宿</el-button>
		
			</template>
		</el-table-column>
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
import { setTimeout } from 'timers';
let api_resource = api_common.resource("dormitory/checkinout");
const defaultForm = () => {
    return {
        dormType:1
    }
}
export default {
	inject: ['$side'],
	mixins: [table_mixin],
	props:['id','data','type'],
	data() {
		const generateData = _ => {
			const data = [];
			for (let i = 1; i <= 15; i++) {
			data.push({
				key: i,
				label: `备选项 ${ i }`,
				disabled: i ===1||i===4
			});
			}
			return data;
		};
		return {
			api_resource,
			distributionData: [],
			loading: true,
			form:{
				
			},
			checked: [],
			orgCategory:[],
			queryDialogFormVisible:true,
			defaultForm,
			roomList:[],
			dialogFormVisible2:false,
			dialogFormVisible3:false,
			dialogFormVisible5:false,
			checkinout_form:{},
			checkinoutRows:[],
			dialogLoading:false,
			dialogLoading2:false,
			distributionRow:{},
			distribution_form:{},
			template:{
				checkState(column,row){
					return <div class={['text-danger','','text-danger',''][row.checkState]}>{['待入住','已入住','待搬离','已搬离'][row.checkState]}</div>
				},
			},
			memberList:[],
			rows2:[],
			importUploadUrl:'',
			downloadUrl:'/dormitory/import/checkin',
			exportList:[],
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
		async exportDormSheet(){
			this.dialogFormVisible5 = true
			this.exportList = await this.$request.get('/dormitory/export/index')
		},
		async exportFile(url){
			this.downloadUrl = url
			this.handleDownloadChange()
			this.dialogFormVisible5 = false
		},
		importCheckIn(){
			this.importUploadUrl = '/dormitory/import/checkin'
			this.downloadUrl = "/dormitory/import/checkin"
			this.import()
		},
		importCheckOut(){
			this.importUploadUrl = '/dormitory/import/confirmout'
			this.downloadUrl = "/dormitory/import/confirmout"
			this.import()
		},
		importApplyIn(){
			this.importUploadUrl = '/dormitory/import/applyin'
			this.downloadUrl = "/dormitory/import/applyin"
			this.import()
		},
		importApplyOut(){
			this.importUploadUrl = '/dormitory/import/checkout'
			this.downloadUrl = "/dormitory/import/checkout"
			this.import()
		},
		async fetchTableData() {
			this.table_loading = true;
			if(this.type == 'room'){
				this.table_form.roomId = this.id
				delete this.table_form.dormId
			}else{
				this.table_form.dormId = this.id
				delete this.table_form.roomId
			}
			if(this.type == 'start'||this.type==''){
				delete this.table_form.dormId
				delete this.table_form.roomId
			}
			const {rows , total }= await api_resource.get(this.table_form);
			this.table_data  = rows
			this.table_form.total = total
			setTimeout(() => {
				this.table_loading = false;
			}, 300);
		},
		async distribution(row){
			this.dialogLoading2 = true
			this.distribution_form = {}
			this.distributionRow = row
			this.dialogFormVisible2 = true

			const { rows } = await this.$request.get('/dormitory/checkinemp',{
				params:{
					dormType:this.data.dormType||row.dormType
				}
			})
			this.memberList = rows.map(o=>{
				return {
					label:o.employeeCode +"-" + o.chineseName,
					value:o.id
				}
			})
			this.dialogLoading2 = false
			this.fetchTableData()
		},
		checkout(){
			this.checkinout(this.table_selectedRows)
		},
		checkinout(row){
			this.checkinout_form = {}
			this.checkinoutRows =Array.isArray(row)?row:[row]
			this.dialogFormVisible3 = true
		},
		async handleFormSubmit2(){
			let form = Object.assign({},this.distributionRow,this.distribution_form)
			await this.$request.post('dormitory/checkinout',form)
			this.dialogFormVisible2 = false
			this.fetchTableData()
		},
		handleFormSubmit3(){
			this.$request.put('/dormitory/checkinout/apply_out',this.checkinout_form,{
				params:{ids:this.checkinoutRows.map(o=>o.id).join(',')},
			})
			this.dialogFormVisible3 = false
			this.fetchTableData()
		},
		filterMethod(query, item){
			return (item.employeeCode+'').indexOf(query) > -1|| (item.chineseName+'').indexOf(query) > -1;
		},
		async allocation(){
			// this.roomList = (await api_common.resource('dormitory/room').find(this.id)).rows.map(o=>{
			//     return {
			//         label:o.dormName,
			//         value:o.id
			//     }
			// })
			// this.form.dorm = this.id
			if(this.data.dormType===undefined){
				this.$message('请先选择房间')
				return 
			}
			this.dialogLoading = true
			this.dialogFormVisible = true
			let { rows } = await this.$request.get('dormitory/checkinemp',{params:{dormType:this.data.dormType}})
			let { rows : rows2 } = await this.$request.get('dormitory/alreadycheckinemp',{params:{roomId:this.id}})
			rows2.forEach(o=>o.disabled = true)
			this.checked = rows2.map(o=>o.id)
			this.rows2 = rows2
			rows = rows.concat(rows2)
			this.distributionData = rows
			this.dialogLoading = false
		},
		async handleFormSubmit(){
			await this.$request.post('dormitory/checkinout',{
				dormType:this.data.dormType,
				roomId:this.id,
				empIds:this.checked.filter(id=>{
				return  !this.rows2.map(o=>o.id).includes(id)
				}).join(',')
			})
			// let form = Object.assign({},this.form)
			// if(this.isInsert){
			//     await api_resource.create(form)
			// }else{
			//     await api_resource.update(form.id,form)
			// }
			this.dialogFormVisible = false
			this.fetchTableData()
		},
		async edit(){
			this.roomList = (await api_common.resource('dormitory/room').find(this.id)).rows.map(o=>{
				return {
					label:o.dormName,
					value:o.id
				}
			})
			let row = this.table_selectedRows[0]
			this.form = await api_resource.find(row.id)
			this.dialogFormVisible = true;
		}
	},
	async created() {
		const { field, action,table } = await api_common.menuInit("dormitory/checkinout");
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
