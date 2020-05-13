  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  >
  	<!-- 补休加班明细 -->
	<div>
		<Drawer title="补休明细" :closable="false" width="640" v-model="openDrawers" class="drawerInfo">
			<div style="background: #f8f8f8;">
				<el-row :gutter="20" style="margin:0">
					<el-col :span="3" class="imgFlex">
						<img src="@/assets/avatar.png" alt="" srcset="" class="imgAvatar">
					</el-col>
					<el-col :span="6" class="userInfo">
						<p>姓名: {{shiftData.chineseName}}</p>
						<p>工号: {{shiftData.employeeCode}}</p>
					</el-col>
					<el-col :span="6" class="userInfo">
						<p>部门: {{shiftData.department}}</p>
						<p>职位: {{shiftData.jobtitle}}</p>
					</el-col>
					<el-col :span="6" class="userInfo">
						<p>&nbsp;</p>
						<p>入职日期: {{shiftData.ondutytime}}</p>
					</el-col>
				</el-row>
			</div>
			<div class="infoDetail">
				<p class="info">补休明细</p>
				<el-row :gutter="20" class="fontStyle mt10 ">
					<el-col :span="8">开始时间: {{shiftData.kaissj}}</el-col>
					<el-col :span="8">结束时间: {{shiftData.jiessj}}</el-col>
					<el-col :span="8">加班工时: {{shiftData.tiaoxks}}</el-col>
				</el-row>
				<p class="info">对调明细</p>
				<!-- <el-collapse  v-model="activeNames" @change="handleChange" v-if="shiftData.shiftDetail&&shiftData.shiftDetail.length!=0">
					<el-collapse-item title="对调明细" name="0"> -->
						<div style="margin-left:70px">
								<el-timeline :reverse="reverse">
									<el-timeline-item
										v-for="(activity, idx) in shiftData.shiftDetail"
										:key="idx">
										<span style="color:#808080">{{activity.shij1}} ~ {{activity.shij2}}
											<span style="margin-left:15px">{{activity.tiaoxsc1}}</span>
										</span>
									</el-timeline-item>
							</el-timeline>
						</div>
					<!-- </el-collapse-item>
				</el-collapse> -->
				<!-- <div class="divider"></div> -->
			</div>
		</Drawer>
	</div>

    <table-header
		:table_actions="table_actions"
		:table_selectedRows="table_selectedRows"
		@action="handleAction"
		:table_form.sync="table_form"
		:table_column="table_field"
		>
		<div style="padding-left:10px">
			<dateLap type="2" v-model="table_form.dateLap" @change="fetch"/>
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
		@cell-click="openDrawer"
		:cell-style="cellStyle"
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
export default {
	mixins: [table_mixin],
	props:['id','url','m'],
	data() {
		return {
			loading: true,
			api_resource:api_common.resource(this.url),
			queryDialogFormVisible:true,
			table_topHeight:293,
			visible:false,
			shiftData: {},
			openDrawers: false,
			activeNames: ['0'],
			reverse: true,
			template:{
				payStatus(column,row){
					if(row.payStatus=='未结付'){
						return <el-tag size="mini" type="danger">{row.payStatus}</el-tag>
					}else if(row.payStatus=='已结付'){
						return <el-tag size="mini" type="success">{row.payStatus}</el-tag>
					}else{
						return <span>{row.payStatus}</span>
					}
				},
				dataStatus(column,row){
					if(row.dataStatus=='未处理'){
						return <el-tag size="mini" type="danger">{row.dataStatus}</el-tag>
					}else if(row.dataStatus=='待结付'){
						return <el-tag size="mini" type="warning">{row.dataStatus}</el-tag>
					}else if(row.dataStatus=='已结付'){
						return <el-tag size="mini" type="success">{row.dataStatus}</el-tag>
					}else if(row.dataStatus=='已调休'){
						return <el-tag size="mini">{row.dataStatus}</el-tag>
					}else{
						return <span>{row.dataStatus}</span>
					}
				},
			}
		};
	},
	watch:{
		id(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
		url(){
            this.api_resource = api_common.resource(this.url)
			delete this.table_form.keyword
			delete this.table_form.sortname
			this.table_form.currentpage = 1
			this.table_form.query.query= []
			this.fetchMenu()
		},
	},
	methods: {
		handleChange(val) {
			console.log(val);
		},
		fetch(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
		async openDrawer(row,column,cell,event){
			if(row.duration==event.target.innerText&&this.m==2){
				this.openDrawers = true
				this.shiftData = await this.$request.get('/attendance/shift/'+row.id)
			}
		},
		cellStyle({row, column, rowIndex, columnIndex}){
			if(column.label == '补休工时'&&this.m==2){
				return 'color:#0BB2D4;cursor:pointer'
			}else{
				return  ''
			}
		},
		async fetchTableData() {
			if(!this.id){
				return
			}
			this.table_loading = true;
			this.table_form.org_id = this.id
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
			this.fetchTableData()
		}
	},
	async created() {
		this.table_form.dateLap = dayjs().format('YYYY-MM')
		await this.fetchMenu()
	}
};
</script>
<style lang="scss">
    .drawerInfo .ivu-drawer-body {
        padding:0;
    }
</style>
<style>
    .drawerInfo .ivu-drawer-header{
        background: rgba(245,250,251,1)
    }
    .infoDetail{
        padding: 0 20px ; 
    }
    .imgFlex{
        display: flex;
        align-items: center;
        height: 70px;
        margin-left: 15px;
    }
    .imgAvatar{
        width: 50px;
        height: 50px;
    }
    .userInfo{
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 70px;
        line-height: 26px;
    }
    .info{
        color: #0BB2D4;
        font-size: 16px;
        font-weight: bold;
        margin: 20px 0 10px 2px;
    }
    .el-collapse-item__header{
        position: relative;
    }
    .el-collapse-item__header .el-collapse-item__arrow{
        position: absolute;
        left: 65px;
    }
    .drawerInfo .el-collapse,.drawerInfo .el-collapse-item__wrap,.drawerInfo .el-collapse-item__header{
        border: 0!important;
    }
    .drawerInfo .el-collapse-item__content{
        padding-bottom:0
    }
    .drawerInfo .el-timeline-item__wrapper{
        top: -5px!important;
    }
    .fontStyle{
        color: #37474F;
        font-size: 14px;
    }
    .divider {
        width: 100%;
        border-bottom: 1px dashed #A3AFB7;
        height:1px;
        margin-top: 20px;
    }
    .time{
        color: #A3AFB7;
        font-size: 14px;
    }
    .mt10{margin-top: 10px;}
</style>


