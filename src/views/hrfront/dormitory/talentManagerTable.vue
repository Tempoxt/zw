<template>
    <ui-table ref="table" 
        :table_column="table_field" 
        :table_query.sync="table_form.query"
        @query="querySubmit"
        >
        <el-dialog
            :title="this.isCheckIn===true?'添加入住登记':'编辑入住登记'"
            :visible.sync="dialogFormVisible"
            class="public-dialog"
            v-el-drag-dialog
            >
            <div>
                <el-form ref="form" :model="form" label-width="100px" :rules="rules">
                    <div class="line-boxs">
                        <el-row :gutter="40">
                            <el-col :span="12">
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <form-render prop="dorm_name" :type="`input`" :disabled="true" :field="{name:'公寓名称'}" v-model="form.dorm_name"/>
                                    </el-col>
                                    <el-col :span="24">
                                        <form-render prop="building" :type="`input`" :disabled="true" :field="{name:'楼栋号'}" v-model="form.building"/>
                                    </el-col>
                                    <el-col :span="24">
                                        <form-render prop="type" :type="`input`" :disabled="true" :field="{name:'户型'}" v-model="form.type"/>
                                    </el-col>
                                    <el-col :span="24">
                                        <form-render prop="room" :type="`input`" :disabled="true" :field="{name:'房号'}" v-model="form.room"/>
                                    </el-col>
                                    <el-col :span="24">
                                        <form-render prop="area" :type="`input`" :disabled="true" :field="{name:'面积'}" v-model="form.area"/>
                                    </el-col>
                                    <el-col :span="24" v-if="this.isSubsidy==1">
                                        <form-render :type="`input`" prop="subsidy" :required="this.isSubsidy==1" :field="{name:'补助金额/月'}" v-model="form.subsidy"/>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="12">
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <el-form-item label="工号" prop="employee_code">      
                                            <el-select
                                                :disabled="!isCheckIn"
                                                style="width:100%"
                                                v-model="form.employee_code"
                                                filterable
                                                clearable
                                                remote
                                                reserve-keyword
                                                placeholder="请输入关键词"
                                                :remote-method="remoteMethod"
                                                >
                                                <el-option
                                                    v-for="item in introducerData"
                                                    :key="item.value"
                                                    :label="item.employeeCode"
                                                    :value="item.employeeCode">
                                                    <span >{{item.chineseName}} / {{item.employeeCode}} </span>
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="24">
                                        <form-render :type="`input`" :field="{name:'姓名'}" :disabled="true" v-model="form.chinese_name"/>
                                    </el-col>
                                    <el-col :span="24">
                                        <form-render prop="checkin_date" :type="`day`" :disabled="!isCheckIn" :field="{name:'入住日期'}" v-model="form.checkin_date"/>
                                    </el-col>
                                    <el-col :span="24">
                                        <form-render :type="`input`" :field="{name:'车牌号'}" v-model="form.car_num"/>
                                    </el-col>
                                    <el-col :span="24">
                                        <form-render :type="`radio`" prop="checkWorkType" v-model="isSubsidy"
                                            :field="{name:'是否补贴',options:[{
                                                value: 1,
                                                label: '是'
                                            },{
                                                value: 0,
                                                label: '否'
                                            }]}"
                                        />
                                    </el-col>
                                    <el-col :span="24" v-if="this.isSubsidy==1">
                                        <form-render prop="end_date" :required="this.isSubsidy==1" :type="`day`" :field="{name:'截止日期'}" v-model="form.end_date"/>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </div>
                </el-form>
            </div>

            <div slot="footer" class="dialog-footer">
                <div>
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleFormSubmit" :disabled="disabled">确 定</el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog
            title="退宿登记"
            :visible.sync="dialogForm1Visible"
            class="public-dialog"
            v-el-drag-dialog
            >
            <div>
                <el-form ref="form1" :model="form1" label-width="100px" :rules="rules1">
                    <div class="line-boxs">
                        <el-row :gutter="40">
                            <el-col :span="12">
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <form-render :type="`input`" :field="{name:'公寓名称'}" :disabled="true" v-model="form1.dorm_name"/>
                                    </el-col>
                                    <el-col :span="24">
                                        <form-render :type="`input`" :field="{name:'楼栋号'}" :disabled="true" v-model="form1.building"/>
                                    </el-col>
                                    <el-col :span="24">
                                        <form-render :type="`input`" :field="{name:'户型'}" :disabled="true" v-model="form1.type"/>
                                    </el-col>
                                    <el-col :span="24">
                                        <form-render :type="`input`" :field="{name:'房号'}" :disabled="true" v-model="form1.room"/>
                                    </el-col>
                                    <el-col :span="24">
                                        <form-render :type="`input`" :field="{name:'面积'}" :disabled="true" v-model="form1.area"/>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="12">
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <form-render :type="`input`" :field="{name:'工号'}" :disabled="true" v-model="form1.employee_code"/>
                                    </el-col>
                                    <el-col :span="24">
                                        <form-render :type="`input`" :field="{name:'姓名'}" :disabled="true" v-model="form1.chinese_name"/>
                                    </el-col>
                                    <el-col :span="24">
                                        <form-render :type="`day`" :picker-options="pickerOptions" prop="checkout_date" :field="{name:'退宿日期'}" v-model="form1.checkout_date"/>
                                    </el-col>
                                    <el-col :span="24">
                                        <form-render :type="`input`" :field="{name:'未结水费'}" v-model="form1.water_charges"/>
                                    </el-col>
                                    <el-col :span="24">
                                        <form-render :type="`input`" :field="{name:'未结电费'}" v-model="form1.electricity_charges"/>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </div>
                </el-form>
            </div>

            <div slot="footer" class="dialog-footer">
                <div>
                    <el-button @click="dialogForm1Visible = false">取 消</el-button>
                    <el-button type="primary" @click="handleForm1Submit">确 定</el-button>
                </div>
            </div>
        </el-dialog>

        <table-header
            :table_actions="table_actions"
            :table_selectedRows="table_selectedRows"
            @action="handleAction"
            :table_form.sync="table_form"
            :table_column="table_field"
        >
            <!-- <div style="padding-left:10px;display:flex;align-items:center" v-if="m!='1'">
                <span>{{this.m==2 ? '扣费月份：':'入住月份：'}}</span><dateLap v-model="table_form.dateLap" @change="fetch"/>
            </div> -->
            <div style="padding-left:10px;display:flex;align-items:center" v-if="m!='1'">
                <span>{{this.m==2 ? '扣费月份：':'入住月份：'}}</span>
                <div class="flex">
                    <el-select v-model="ctype" :disabled="true" style="width:60px" class="dateLap-select">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    <el-date-picker
                        @change="fetch"
                        v-if="ctype==2"
                        :picker-options="pickerOptions1"
                        style="width:200px"
                        class="dateLap-date"
                        v-model="dateLap"
                        type="month"
                        value-format="yyyy-MM"
                        format="yyyy-MM"
                        :clearable="false"
                        placeholder="选择月">
                    </el-date-picker>
                </div>
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
            <el-table-column type="index" :index="indexMethod"/>
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
let baseUrl = process.env.VUE_APP_STATIC
import dayjs from 'dayjs'
export default {
    mixins: [table_mixin],
    props:['url','m'],
    data() {
        var checkNumber = (rule, value, callback)=>{
            if(value!==''&&value!=undefined){
                if (!(/^\d+(\.\d{1,2})?$/.test(value))) {
                    callback(new Error('请输入精度为2位小数以内的正数'));
                }else{
                    callback();
                }
            }
		}
        return {
            baseUrl,
            loading: false,
            api_resource: api_common.resource(this.url),
            queryDialogFormVisible: true,
            table_topHeight: 285,
            form: {},
            form1: {},
            dialogFormVisible: false,
            dialogForm1Visible: false,
            isSubsidy: 0,
            template:{
                status(row,column){
                    if(column.status=='未扣款'){
                        return <el-tag type="danger">未扣款</el-tag>
                    }else{
                        return <el-tag type="success">已扣款</el-tag>
                    }
                }
            },
            rules:{
                employee_code: [
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                checkin_date: [
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                subsidy: [
                    { validator: checkNumber, trigger: 'blur' }
                ]
            },
            rules1:{
                checkout_date: [
                    { required: true, message: '请选择', trigger: 'change' },
                ],
            },
            introducerData: [],
            isCheckIn: false,
            importUploadUrl:'dormitory/checkinout/v1/apartmentimport',
            downloadUrl:'dormitory/checkinout/v1/apartmentimport',
			pickerOptions: {
                disabledDate:time=> {
                    if (this.form1.checkin_date) {
                        return time.getTime() < new Date(this.form1.checkin_date).getTime() - 8.64e7;
                    }
				}
			},
			options:[{
                value:'2',
                label:'月'
            }],
			ctype:'2',
            pickerOptions1: {
				disabledDate:time=>{
                    let nextMonth = dayjs().add(1,'month').format('YYYY-MM')
					return time.getTime() > new Date(nextMonth).getTime() - 8.64e7;
				}
            },
            dateLap:''
        };
    },
    computed:{
        disabled(){
            if(this.form.employee_code!=null && this.form.checkin_date!=undefined && this.form.employee_code!=''&&this.form.checkin_date!=''){
                if(this.isSubsidy==1){
                    if(this.form.subsidy!=null && this.form.subsidy!='' && this.form.end_date!=''){
                        return false
                    }else {
                        return true
                    }
                }else{
                    return false
                }
            }
            return true
        }
    },
    watch:{
        url(){
            delete this.table_form.keyword
            this.api_resource = api_common.resource(this.url)
            this.table_form.query.query= []
            this.importUploadUrl = this.downloadUrl = this.m==1?'dormitory/checkinout/v1/apartmentimport':'dormitory/accommodationfee/v1/templates'
            this.fetchMenu();
        },
        'form.employee_code'(){
            if(this.isCheckIn==true){
                if(this.form.employee_code!=undefined && this.form.employee_code!=''){
                    let data = this.introducerData.filter(o=>o.employeeCode==this.form.employee_code)
                    this.form.chinese_name = data[0].chineseName
                }else{
                    this.form.chinese_name = ''
                }
            }
        },
    },
    methods: {
        async remoteMethod(query){
            if (query !== '') {
                this.introducerData = await api_common.resource('hrm/partstaff').get({
                    IsDimission:0,
                    keyword:query,
                    pagesize:10
                })
            } 
        },
        checkIn(){
            this.isSubsidy = 0
            this.isCheckIn = true
            let row = this.table_selectedRows[0]
            this.form = {
                room_id: row.room_id,
                employee_code: row.employee_code,
                dorm_name: row.dorm_name,
                building: row.building,
                room: row.room,
                type: row.type,
                area: row.area,
                subsidy: row.subsidy,
                checkin_date: '',
                end_date: ''
            }
            if(this.form.employee_code!='' && this.form.employee_code!=null){
                this.$message.error('当前房间已有入住人')
                return
            }
            this.$nextTick(()=>{
                this.$refs['form'].clearValidate()
            })
            this.dialogFormVisible = true
        },
        edit(){
            this.isCheckIn = false
            let row = this.table_selectedRows[0]
            this.form = {
                room_id: row.room_id,
                employee_code: row.employee_code,
                dorm_name: row.dorm_name,
                building: row.building,
                room: row.room,
                type: row.type,
                area: row.area,
                subsidy: row.subsidy,
                checkin_date: row.checkin_date,
                end_date: row.end_date,
                car_num: row.car_num,
                record_id: row.record_id,
            }
            if(this.form.subsidy!=''&&this.form.end_date!=''&&this.form.end_date!=null){
                this.isSubsidy = 1
            }else{
                this.isSubsidy = 0
            }
            if(this.form.employee_code=='' || this.form.employee_code==null){
                this.$message.error('当前房间没有入住人')
                return
            }
            this.dialogFormVisible = true
        },
        checkOutTalent(){ 
            this.form1 = this.table_selectedRows[0]
            if(this.form1.employee_code=='' || this.form1.employee_code==null){
                this.$message.error('当前房间没有入住人，不能办理退宿')
                return
            }
            this.$nextTick(()=>{
                this.$refs['form1'].clearValidate()
            })
            this.dialogForm1Visible = true
        },
		fetch(){
            this.table_form.dateLap = this.dateLap
			this.table_form.currentpage = 1
			this.fetchTableData()
        },
        async handleFormSubmit(){
            await this.form_validate()
            if(this.isSubsidy==0){
                this.form.subsidy = ''
                this.form.end_date = ''
            }
            let form = Object.assign({},this.form)
            if(this.isCheckIn){
                await this.$request.post('dormitory/checkinout/v1/checkin',form)
            }else{
                await this.$request.put('dormitory/checkinout/v1/checkin',form)
            }
            this.dialogFormVisible = false
            this.fetchTableData()
        },
        async handleForm1Submit(){
            await this.form_validate('form1')
            let form1 = {
                record_id: this.form1.record_id,
                checkout_date: this.form1.checkout_date,
                water_charges: this.form1.water_charges,
                electricity_charges: this.form1.electricity_charges,
                room_id: this.form1.room_id,
                employee_code: this.form1.employee_code
            }
            try{
                await this.$request.put('dormitory/checkinout/v1/checkout',form1)
            }catch(err){
                console.log(err)
            }
            this.dialogForm1Visible = false
            this.fetchTableData()
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
			this.fetchTableData()
		},
    },
    async created() {
        this.fetchMenu();
		this.table_form.dateLap = this.dateLap = dayjs().format('YYYY-MM')
    },
};
</script>
<style lang="scss" scoped>
    .scroll {
        height: calc(100%);
        width: 100%;

        /deep/ .scrollbar-wrapper {
            overflow-x: hidden;
        }
    }
</style>