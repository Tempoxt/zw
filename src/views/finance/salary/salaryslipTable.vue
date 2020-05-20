  <template>
  <ui-table ref="table" 
    :table_column="table_field" 
    :table_query.sync="table_form.query"
    @query="querySubmit"
    >


	<el-dialog
		title="导入"
		:visible.sync="importDialog"
		class="public-dialog"
		v-el-drag-dialog
		width="400px"
		>
      		<el-form ref="importForm" :model="importForm"  label-width="100px" v-loading="importloading">
				<el-row >
					<el-col :span="24" :offset="0">
						<el-form-item label="选择月份" prop="month">
							<el-date-picker
								v-model="importForm.dateLap"
								type="month"
								style="width:100%"
								format="yyyy-MM"
								value-format="yyyy-MM"
								placeholder="选择月份">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="24" :offset="0">
						<el-form-item label="选择文件" >
							<el-upload
								class="upload-demo"
								ref="upload"
								action="www"
								:limit="1"
								:file-list="fileList1"
								:on-change="changeFormImportFiles"
								:auto-upload="false">
							<el-button slot="trigger" size="small" type="primary">选择文件</el-button></el-upload>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		<div slot="footer" class="dialog-footer">
		
			<el-button @click="importDialog = false">取 消</el-button>
			<el-button type="primary" @click="handleImportFormSubmit">确 定</el-button>
		</div>
    </el-dialog>



    <el-dialog
        title="调整"
        :visible.sync="dialogForm3Visible"
        class="public-dialog"
        v-el-drag-dialog
        width="800px"
        >

        <el-form ref="form" :model="form" label-width="100px" >
            <el-tabs @tab-click="tabClick">
                <el-tab-pane label="工作资料">
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">姓名</el-col><el-col :span="10"><el-input v-model="form3.basicWage"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">工号</el-col><el-col :span="10"><el-input v-model="form3.overtime"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">部门</el-col><el-col :span="10"><el-input v-model="form3.weekendWelfare"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">职位</el-col><el-col :span="10"><el-input v-model="form3.welfare"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">标准工资</el-col><el-col :span="10"><el-input v-model="form3.fullAtt"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">工作天数</el-col><el-col :span="10"><el-input v-model="form3.minPerformance"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">平时加班</el-col><el-col :span="10"><el-input v-model="form3.performance"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">休息加班</el-col><el-col :span="10"><el-input v-model="form3.performance"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">假日加班</el-col><el-col :span="10"><el-input v-model="form3.performance"></el-input> </el-col></el-row>
                </el-tab-pane>
                <el-tab-pane label="津贴奖金">
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">加班津贴</el-col><el-col :span="10"><el-input v-model="form3.basicWage"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">生活补助</el-col><el-col :span="10"><el-input v-model="form3.overtime"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">高温津贴</el-col><el-col :span="10"><el-input v-model="form3.weekendWelfare"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">夜班津贴</el-col><el-col :span="10"><el-input v-model="form3.welfare"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">工龄奖</el-col><el-col :span="10"><el-input v-model="form3.fullAtt"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">岗位基础奖金</el-col><el-col :span="10"><el-input v-model="form3.minPerformance"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">岗位基础考核奖金</el-col><el-col :span="10"><el-input v-model="form3.performance"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">绩效奖金</el-col><el-col :span="10"><el-input v-model="form3.performance"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">其他奖金</el-col><el-col :span="10"><el-input v-model="form3.performance"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">补其他</el-col><el-col :span="10"><el-input v-model="form3.performance"></el-input> </el-col></el-row>
                </el-tab-pane>
                <el-tab-pane label="扣除项目">
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">无薪假</el-col><el-col :span="10"><el-input v-model="form3.basicWage"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">请假工时</el-col><el-col :span="10"><el-input v-model="form3.overtime"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">请假金额</el-col><el-col :span="10"><el-input v-model="form3.weekendWelfare"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">迟到早退工时</el-col><el-col :span="10"><el-input v-model="form3.welfare"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">迟到早退金额</el-col><el-col :span="10"><el-input v-model="form3.fullAtt"></el-input> </el-col></el-row>
                </el-tab-pane>
                <el-tab-pane label="薪酬纳税">
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">全勤奖</el-col><el-col :span="10"><el-input v-model="form3.basicWage"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">应付合计</el-col><el-col :span="10"><el-input v-model="form3.overtime"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">社保</el-col><el-col :span="10"><el-input v-model="form3.weekendWelfare"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">公积金</el-col><el-col :span="10"><el-input v-model="form3.welfare"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">个税</el-col><el-col :span="10"><el-input v-model="form3.fullAtt"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">伙食费</el-col><el-col :span="10"><el-input v-model="form3.minPerformance"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">住宿费</el-col><el-col :span="10"><el-input v-model="form3.performance"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">借款</el-col><el-col :span="10"><el-input v-model="form3.performance"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">纳税调整项</el-col><el-col :span="10"><el-input v-model="form3.performance"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">应纳税所得额</el-col><el-col :span="10"><el-input v-model="form3.performance"></el-input> </el-col></el-row>
                    <el-row :gutter="20" class="mb10"> <el-col :span="8" class="alignRight">税后实发</el-col><el-col :span="10"><el-input v-model="form3.performance"></el-input> </el-col></el-row>
                </el-tab-pane>
            </el-tabs>
        </el-form>


        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogForm3Visible = false">取 消</el-button>
            <el-button type="primary" @click="handleForm3Submit">确 定</el-button>
        </div>
    </el-dialog>

	<el-dialog
        title="修改"
        :visible.sync="dialogForm4Visible"
        class="public-dialog"
        v-el-drag-dialog
        width="600px"
        >

        <el-form ref="form4" :model="form4" label-width="100px" :rules="rules4">
			<form-render prop="taxEdit" :type="`input`" :field="{name:'个税调整金额'}" v-model="form4.taxEdit"/>
        </el-form>


        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogForm4Visible = false">取 消</el-button>
            <el-button type="primary" @click="handleForm4Submit">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 高温津贴/个税...详情 -->
    <Drawer :title="drawerTitle" :closable="false" width="880" v-model="openDrawers" class="taxInfo">
      	<!-- 个税 -->
      	<div v-if="showInfo=='tax'">
			<div class="flex-title">
				<p class="title-info">个税缴纳累计表</p>
				<div>
					<span style="margin-right: 8px">社保主体: {{taxAcculData[0].socialSecurityMain}}</span>
					<el-date-picker style="width:140px" v-model="taxdateLap" type="month" size="small"
					format="yyyy年MM月" value-format="yyyy-MM" placeholder="选择月份" @change="changeTax">
					</el-date-picker>
				</div>
			</div>
			<el-table
				class="taxTable"
				:data="taxAcculData"
				border
				style="width: 100%">
				<el-table-column prop="month" label="月份" width="70"></el-table-column>
				<el-table-column prop="tSalary" label="累计收入"  width="85">
					<template slot-scope="scope">
						<span v-html="scope.row.tSalary" :title="scope.row.tSalary"></span>
					</template>
				</el-table-column>
				<el-table-column prop="tDeduct" label="累计扣除费用" ></el-table-column>
				<el-table-column prop="tSpec" label="累计专项扣除" ></el-table-column>
				<el-table-column prop="tSpecAdd" label="累计专项附加"  ></el-table-column>
				<el-table-column prop="taxBase" label="累计应缴纳税所得额"  width="85" ></el-table-column>
				<el-table-column prop="tTax" label="累计个税"  width="85"></el-table-column>
				<el-table-column prop="tax" label="应缴个税"  width="85"></el-table-column>
				<el-table-column prop="rTax" label="实缴个税"   width="85"></el-table-column>
				<el-table-column prop="diffTax" label="个税差"  >
					<template slot-scope="scope">
						<span v-html="scope.row.diffTax" :title="scope.row.diffTax" style="color:#F2353C"></span>
					</template>
				</el-table-column>
			</el-table>

			<div class="flex-title mt20">
				<p class="title-info">个税缴纳明细表</p>
			</div>
			<el-table
				class="taxTable"
				:data="taxDetailData"
				border
				show-summary
				:summary-method="getSummarTax"
				style="width: 100%">
				<el-table-column prop="month" label="月份"  width="70"></el-table-column>
				<el-table-column prop="salary" label="工资收入"  width="85">
					<template slot-scope="scope">
						<span v-html="scope.row.salary" :title="scope.row.salary"></span>
					</template>
				</el-table-column>
				<el-table-column prop="deFee" label="扣除费用"  width="85"></el-table-column>
				<el-table-column label="专项扣除">
					<el-table-column prop="social" label="社保"  width="70" ></el-table-column>
					<el-table-column prop="gjj" label="公积金" width="70"></el-table-column>
				</el-table-column>
				<el-table-column label="专项附加扣除">
					<el-table-column prop="childrenEducation" label="子女教育" width="60" ></el-table-column>
					<el-table-column prop="supportOld" label="赡养老人"  width="60"></el-table-column>
					<el-table-column prop="houseRent" label="住房租金"   width="60"></el-table-column>
					<el-table-column prop="continueEducation" label="继续教育"  width="60"></el-table-column>
					<el-table-column prop="houseLoan" label="住房贷款利息"   width="65"></el-table-column>
				</el-table-column>
				<el-table-column prop="taxBase" label="应纳税所得额" width="75"></el-table-column>
				<el-table-column prop="tax" label="实缴个税" width="87">
					<template slot-scope="scope">
						<span v-html="scope.row.tax" :title="scope.row.tax" style="color:#F2353C"></span>
					</template>
				</el-table-column>
			</el-table>
      	</div>

		<!-- 高温津贴-->
		<div class="drawer-profile" v-if="showInfo=='highTempture'">
			<el-table
				border
				:header-cell-style="headerStyle"
				class="dtable"
				:data="hotData"
				style="width: 100%;margin-top:20px" 
				show-summary
				:cellStyle="drawerStyle"
				:summary-method="getSummarHigh"
				>
				<el-table-column prop="CheckDate" label="日期">
					<template slot-scope="scope">
						<span :title="scope.row.CheckDate">{{scope.row.CheckDate.split('-')[2]}}</span>
					</template>
				</el-table-column>
				<el-table-column prop="weekday" label="星期" ></el-table-column>
				<el-table-column prop="OnDutyTime1" label="上班1" ></el-table-column>
				<el-table-column prop="OffDutyTime1" label="下班1" ></el-table-column>
				<el-table-column prop="OnDutyTime2" label="上班2"  ></el-table-column>
				<el-table-column prop="OffDutyTime2" label="下班2" ></el-table-column>
				<el-table-column prop="OnDutyTime3" label="上班3"  ></el-table-column>
				<el-table-column prop="OffDutyTime3" label="下班3" ></el-table-column>
				<el-table-column prop="Remark" label="异常说明"  >
					<template slot-scope="scope">
						<span :title="scope.row.Remark" style="width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:red;cursor:default">{{scope.row.Remark}}</span>
					</template>
				</el-table-column>
			</el-table>
		</div>

		<!-- 餐费详情-->
		<div v-if="showInfo=='mealFee'">
			<div class="flex-title">
				<p class="title-info">餐费详情表</p>
			</div>
			<el-table
				:header-cell-style="headerStyle"
				:data="mealData"
				border
				show-summary
				:summary-method="getSummarMeal"
				style="width: 100%">
				<el-table-column prop="date" label="日期" width="110"></el-table-column>
				<el-table-column prop="week" label="星期" width="110">
					<template slot-scope="scope">
					{{['星期一','星期二','星期三','星期四','星期五','星期六','星期日'][scope.row.week-1]}}
					</template>
				</el-table-column>
				<el-table-column prop="lunch" label="午餐(元)"></el-table-column>
				<el-table-column prop="dinner" label="晚餐(元)"></el-table-column>
				<el-table-column prop="nightingale" label="夜宵(元)"></el-table-column>
				<el-table-column prop="total" label="小计"></el-table-column>
			</el-table>
		</div>

		<!-- 补其他 -->
		<div v-if="showInfo=='otherAdd'">
			<div class="flex-title mt20">
				<p class="title-info">补其他详情表</p>
			</div>
			<el-table
				:data="otherAddData"
				border
				show-summary
				:summary-method="getSummarOther"
				style="width: 100%">
				<el-table-column prop="date" label="日期" width="110"></el-table-column>
				<el-table-column prop="lunch" label="补助项目"></el-table-column>
				<el-table-column prop="dinner" label="补发奖金"></el-table-column>
				<el-table-column prop="total" label="数据来源"></el-table-column>
			</el-table>
		</div>

		<!-- 扣其他 -->
		<div v-if="showInfo=='otherDec'">
			<div class="flex-title mt20">
				<p class="title-info">扣其他详情表</p>
			</div>
			<el-table
				:data="otherDecData"
				border
				show-summary
				:summary-method="getSummarOther"
				style="width: 100%">
				<el-table-column prop="date" label="日期" width="110"></el-table-column>
				<el-table-column prop="lunch" label="扣款项目"></el-table-column>
				<el-table-column prop="dinner" label="扣罚金额"></el-table-column>
				<el-table-column prop="total" label="数据来源"></el-table-column>
			</el-table>
		</div>
    </Drawer>


    <table-header
		:table_actions="table_actions"
		:table_selectedRows="table_selectedRows"
		@action="handleAction"
		:table_form.sync="table_form"
		:table_column="table_field"
		>
		<div style="padding-left:10px">
			<dateLap v-model="table_form.dateLap" @change="fetch"/>
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
		:cell-class-name="cellName"
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
		<el-table-column type="index" :index="indexMethod" width="70" fixed/>
		<el-table-column prop="month" label="月份" fixed/>
		<el-table-column prop="signState" label="签收状态" fixed>
			<template slot-scope="scope">
				<el-tag size="mini" type="danger" v-if="scope.row.signState==1">未签收</el-tag>
				<el-tag size="mini" type="success" v-if="scope.row.signState==2">已签收</el-tag>
				<el-tag size="mini" type="success" v-if="scope.row.signState==3">默认签收</el-tag>
			</template>
		</el-table-column>
		<el-table-column prop="chineseName" label="姓名" fixed>
			<template slot-scope="scope">
				<div v-html="scope.row.staff__chineseName"></div>
			</template>
		</el-table-column>
		<el-table-column prop="staff__employeeCode" label="工号" fixed>
			<template slot-scope="scope">
				<div v-html="scope.row.staff__employeeCode"></div>
			</template>
		</el-table-column>
		<each-table-column :table_field="table_field.filter(o=>!['month','signState','staff__chineseName','staff__employeeCode'].includes(o.name))"/>
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
const api_resource = api_common.resource("salary");
import importForm from '../financialSheet/importForm'
import { MessageBox } from 'element-ui';
export default {
	mixins: [table_mixin],
	props:['id'],
	data() {
		return {
			importDialog:false,
			importForm:{},
			loading: true,
			form:{},
			api_resource,
			orgCategory:[],
			queryDialogFormVisible:true,
			adminList:[],
			roomAdminList:[],
			dormList:[],
			dialogForm2Visible:false,
			dialogForm3Visible:false,
			dialogForm4Visible: false,
			form2:{},
			form3:{
				otWeekday:2
			},
			formData:[],
			showInfo:'',//展示某个模块信息
			drawerTitle:'',//弹框标题
			openDrawers:false,//侧弹框
			taxdateLap:'',//个税月份
			taxAcculData:[],//个税缴纳累计表
			taxDetailData:[],//个税缴纳明细表
			hotData:[],//高温津贴
			mealData:[],//餐费
			roomData:[],//宿舍费用
			otherAddData:[],//补其他
			otherDecData:[],//扣其他
			totalAllo:'',//高温津贴考勤有效天数
			table_topHeight:233,
			importDateLab:new Date(),
			fileList1:[],
			importloading:false,
			form4: {},
			rules4: {
				taxEdit:[
					{ required: true, message: '请输入', trigger: ['blur','change'] },
				],
			},
			importUploadUrl: '/taxEdit/upload'
		};
	},
	watch:{
		id(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
		async 'form3.staff'(staff){
			const result = await this.$request.get('/basicwage',{params:{staff}})
			this.formData = result[0]
			this.form3 = Object.assign({},this.formData,this.form3)
		},
		async 'form3.total'(val){
			if(val>2000){
				const res = await this.$request.get('basicwage/cal',{
					params:{
						wage:val,
						otWeekday:this.form3.otWeekday
					}
				})
				this.form3 =  Object.assign(this.form3,res)
				console.log(this.form3)
			}
		}
	},
	methods: {
		BatchEdit(){
			MessageBox.alert(
				<importForm importUploadUrl={this.importUploadUrl} resourJudge='1'
				on={{fetchData:()=>{this.fetch()}}}/>
				, '选择文件导入', {
				showConfirmButton:false,
				center:true
			});
		},
		changeFormImportFiles(file){
			this.importForm.the_file = file.raw
		},
		upload(){
			this.importForm = {}
			this.fileList1 = []
			this.importDialog = true
		},
		async handleImportFormSubmit(){
			this.importloading = true
			this.importForm.isDimission = 80
			var formData = new FormData();
			Object.keys(this.importForm).forEach(k=>{
				formData.append(k,this.importForm[k])
			})
			try {
				let mes = await this.$request.post('/salary/upload',formData)
				this.importDialog = false
				this.$message({
					message: mes,
					type: 'success'
				});
			} catch (error) {
				
			} finally {
				this.importloading = false
			}
		},
		
		// 高温津贴合计项
		getSummarHigh(param){
			const { columns, data } = param;
			const sums = [];
			columns.forEach((column, index) => {
				if(index === 0){
					sums[index] = this.totalAllo;
				}
			});
			return sums;
		},
		//个税合计项
		getSummarTax(param) {
			const { columns, data } = param;
			const sums = [];
			columns.forEach((column, index) => {
				if (index === 0) {
					sums[index] = '合计';
					return;
				}else{
					const values = data.map(item => Number(item[column.property]));
					if (!values.every(value => isNaN(value))) {
						sums[index] = values.reduce((prev, curr) => {
							const value = Number(curr);
							if (!isNaN(value)) {
								return prev + curr;
							} else {
								return prev;
							}
						}, 0);
						var stand = String(sums[index]).indexOf('.')+1
						var num = String(sums[index]).length - stand
						if(num>2&&stand!=0){
							sums[index] = (sums[index]).toFixed(2);
						}else{
							sums[index] = sums[index];
						}
					} else {
						sums[index] = '';
					}
				}
			});
			return sums;
		},
		//餐费合计项
		getSummarMeal(param) {
			const { columns, data } = param;
			const sums = [];
			columns.forEach((column, index) => {
				if (index === 0) {
					sums[index] = '合计';
					return;
				}else if(index === 1){
					sums[index] = '';
					return;
				}else{
					const values = data.map(item => Number(item[column.property]));
					if (!values.every(value => isNaN(value))) {
						sums[index] = values.reduce((prev, curr) => {
							const value = Number(curr);
							if (!isNaN(value)) {
								return prev + curr;
							} else {
								return prev;
							}
						}, 0);
						var stand = String(sums[index]).indexOf('.')+1
						var num = String(sums[index]).length - stand
						if(num>2&&stand!=0){
							sums[index] = (sums[index]).toFixed(2);
						}else{
							sums[index] = sums[index];
						}
					} else {
						sums[index] = '';
					}
				}
			});
			return sums;
		},
		//补其他/扣其他合计项
		getSummarOther(param) {
			const { columns, data } = param;
			const sums = [];
			columns.forEach((column, index) => {
				if (index === 0) {
					sums[index] = '合计';
					return;
				}else if(index === 2){
					const values = data.map(item => Number(item[column.property]));
					if (!values.every(value => isNaN(value))) {
						sums[index] = values.reduce((prev, curr) => {
							const value = Number(curr);
							if (!isNaN(value)) {
								return prev + curr;
							} else {
								return prev;
							}
						}, 0);
						sums[index] = sums[index];
					} else {
						sums[index] = '';
					}
				}else{
					sums[index] = '';
				}
			});
			return sums;
		},
		drawerStyle({row,column,rowIndex,columnIndex}){
			if(row.Remark!=''&&row.Remark!=null){
				return 'color:red'
			}else if(column.label=="星期"){
				if(row.weekday=='六'){
					return 'background-color:#68f59c;'
				}
				if(row.weekday=='日'){
					return 'background-color:#1cbe57;'
				}
			}else if(column.label=="日期"&&row.hotDetail!=''&&row.hotDetail!=null&&row.hotDetail==1){
				return 'background-color:#0bb2d4;'
			}
		},
		headerStyle(row,rowIndex,column,columnIndex){
			return "background:#F5F5F5;"
		},
		async changeTax(){
			let taxInfo = await this.$request.get('salary/taxDetail',{
				params:{
					staffid:this.staffid,
					month:this.taxdateLap
				}
			})
			this.taxAcculData = taxInfo.stack
			this.taxDetailData = taxInfo.detail
		},
		async openDrawer(row,column,cell,event){
			if(row.tax==event.target.innerText){
				this.openDrawers = true
				this.drawerTitle = '个税详情'
				this.showInfo = 'tax'
				this.taxdateLap = row.month
				this.staffid = row.staff
				let taxInfo = await this.$request.get('salary/taxDetail',{
					params:{
						staffid:row.staff,
						month:row.month
					}
				})
				this.taxAcculData = taxInfo.stack
				this.taxDetailData = taxInfo.detail
			}
			if(row.highTempture==event.target.innerText){
				this.openDrawers = true
				this.drawerTitle = '高温津贴考勤明细'
				this.showInfo = 'highTempture'
				const alloData = await this.$request.get('/hot/hotallowrecord?staff_id='+row.staff+'&month='+row.month)
				this.hotData = alloData.detail
				this.totalAllo = alloData.total
			}
			if(row.mealFee==event.target.innerText){
				this.openDrawers = true
				this.drawerTitle = '餐费明细'
				this.showInfo = 'mealFee'
				let { rows } = await this.$request.get('restaurant/consumedata/detail',{
					params:{
						workcode:row.staff__employeeCode,
						month:row.month
					}
				})
				this.mealData =  rows
			}
			// if(row.otherAdd==event.target.innerText){
			// 	this.openDrawers = true
			// 	this.drawerTitle = '补其他'
			// 	this.showInfo = 'otherAdd'
			// }
			// if(row.otherDec==event.target.innerText){
			// 	this.openDrawers = true
			// 	this.drawerTitle = '扣其他'
			// 	this.showInfo = 'otherDec'
			// }
			// if(row.roomFee==event.target.innerText){
			// 	this.openDrawers = true
			// 	this.drawerTitle = '宿舍费用明细'
			// 	this.showInfo = 'roomFee'
			// }
		},
		cellStyle({row, column, rowIndex, columnIndex}){
			// ||column.label =="住宿费"||column.label =="补其他"
			// else if(column.label =="扣其他"){
			// 	return 'color:#FF0000;cursor:pointer'
			// }
			if(column.label =="高温津贴" ||column.label =="伙食费"||column.label == '个税(实际)'){
				return 'color:#02B708;cursor:pointer'
			}else{
		  		return ''
			}
		},
		cellName({row, column, rowIndex, columnIndex}){
			if(column.label == '个税(实际)'||column.label =="高温津贴" ||column.label =="伙食费"||column.label =="住宿费"||column.label =="补其他"||column.label =="扣其他"){
				return 'pointer'
			}
		},
		fetch(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
		async set(){
			this.form2 = await this.$request.get('/hot/recordbasic')
			this.dialogForm2Visible = true
		},
		async handleForm2Submit(){
			await this.$request.put('/hot/recordbasic',this.form2)
			this.dialogForm2Visible = false
		},
		async handleForm3Submit(){
			await this.$request.post('basicwage/applysheet',this.form3,{
				params:{
					sheetType:2
				}
			})
			this.dialogForm3Visible = false
		},
		add(){
			this.form3 = {
				otWeekday:2
			}
			this.formData = {}
			this.dialogForm3Visible = true
		},
		async edit(){
			this.form4 = {}
			let row = this.table_selectedRows[0]
			let tax_manual = row.tax_manual
			this.form4.taxEdit = tax_manual
			// this.form = await api_resource.find(row.id)
			this.dialogForm4Visible = true;
		},
		async fetchTableData() {
			if(!this.id){
				return
			}
			this.table_loading = true;
			this.table_form.org_id = this.id
			this.table_form.sheetType = 2
			const {rows , total }= await api_resource.get(this.table_form);
			this.table_data  = rows
			this.table_form.total = total
			setTimeout(() => {
				this.table_loading = false;
			}, 300);
		},
		async handleFormSubmit(){
			let form = Object.assign({},this.form)
			form.org_id = this.id
			if(this.isInsert){
				await api_resource.create(form)
			}else{
				await api_resource.update(form.id,form)
			}
			this.dialogFormVisible = false
			this.fetchTableData()
		},
		async handleForm4Submit(){
			await this.form_validate('form4')
			let row = this.table_selectedRows[0]
			let form4 = Object.assign({},this.form4)
			await this.$request.post('/salary/taxEdit/'+row.id,form4)
			this.dialogForm4Visible = false
			this.fetchTableData()
		},
		async tabClick(v){
			this.tab_label  = v.label
		},
  	},
	async created() {
		const { field, action,table } = await api_common.menuInit("salary");
		this.table_field = field;
		this.table_actions = action;
		this.table_config = table
		this.$set(this.table_form,'dateLap',dayjs().format('YYYY-MM'))
		this.fetchTableData();
	}
};
</script>
<style lang="scss" scoped>
	.drawer-profile .el-table--small td,.drawer-profile .el-table--small th{
		color: red;
		padding: 1px 0;
	}
	.dtable{
		/deep/.cell{
			font-size:10px;
		}
		/deep/td{
			padding: 0px!important;
		}
		/deep/th{
			padding: 1px 0!important;
		}
	}
</style>
<style lang="scss">    
	.taxTable .el-table__row .cell{
        cursor: default!important;
	}
	.taxTable.el-table--small td{
		padding: 2px 0!important;
	}
    .taxInfo .ivu-drawer-header{
      background: rgba(245,250,251,1)
    }
    .taxInfo .el-table th div{
      line-height:18px!important;
    }
    .taxTable .has-gutter tr th,.taxTable .el-table thead.is-group th{
      background: #F5F5F5!important;
    }
    
    .alignRight{
      text-align: right;
      margin-top: 8px;
    }
    .mb10{
      margin-bottom: 15px;
    }
    .mt20{
      margin-top: 20px;
    }
    .flex-title{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 20px;
      .title-info{
	  	font-size:12px;
        color: #0BB2D4;
        font-weight: bold;
      }
    }
    .pointer span{
      cursor: pointer!important;
    }
</style>


