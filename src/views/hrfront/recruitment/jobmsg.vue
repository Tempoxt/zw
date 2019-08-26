<template>
    <div>
        <ui-table 
            ref="table" 
            :table_query.sync="table_form.query"
            :table_column="table_field" 
            @query="querySubmit"
        >
            <el-dialog
                :title="dialogStatus==='insert'?'添加':'编辑'"
                :visible.sync="dialogFormVisible"
                class="public-dialog"
                v-el-drag-dialog
                >
                <div>
                    <el-form ref="form" :model="form" label-width="80px" label-position="left" :rules="rules">
                        <el-tabs v-model="form_activeName" >
                            <el-tab-pane label="岗位信息" name="first">
                            <br />
                            <el-row :gutter="40">
                                <el-col :span="12">
                                    <el-row :gutter="20">
                                        <el-col :span="24">
                                            <form-render
                                                :type="`demand`"
                                                prop="department"
                                                :field="{name:'需求部门',defaultName:form.departmentShow}"
                                                v-model="form.department"
                                            /> 
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render
                                                :type="`select`"
                                                prop="principalship"
                                                filterable
                                                :field="{name:'需求岗位',options:principalshipData}"
                                                v-model="form.principalship"
                                            /> 
                                        </el-col>
                                        <!-- <el-col :span="24">
                                            <form-render
                                                :type="`select`"
                                                filterable
                                                :field="{name:'招聘岗位',options:principalshipData}"
                                                v-model="form.principalship"
                                            /> 
                                        </el-col> --> 
                                        <el-col :span="24">
                                            <form-render
                                                :type="`select`"
                                                prop="needClass"
                                                filterable
                                                :field="{name:'需求等级',options:needClassData}"
                                                v-model="form.needClass"
                                            /> 
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render
                                                :type="`input`"
                                                prop="needNumber"
                                                filterable
                                                :field="{name:'需求人数'}"
                                                v-model="form.needNumber"
                                            /> 
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render
                                                :type="`input`"
                                                prop="needTips"
                                                filterable
                                                :field="{name:'需求说明'}"
                                                v-model="form.needTips"
                                            /> 
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render
                                                :type="`textarea`"
                                                autosize
                                                :rows='1'
                                                prop="jobResponsibility"
                                                filterable
                                                :field="{name:'岗位职责'}"
                                                v-model="form.jobResponsibility"
                                            /> 
                                        </el-col>
                                        
                                       
                                        <!-- <el-col :span="24">
                                            <form-render
                                                :type="`select`"
                                                :field="{name:'工作状态',options:fileTypeData}"
                                                v-model="form.fileType"
                                            /> 
                                        </el-col> -->
                                    </el-row>
                                </el-col>

                                <el-col :span="12">
                                    <el-row :gutter="20">
                                        <el-col :span="24">
                                            <form-render
                                                prop="workNature"
                                                :type="`select`"
                                                :field="{name:'工作性质',options:workNatureData}"
                                                v-model="form.workNature"
                                            /> 
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render
                                                prop="workGroup"
                                                :type="`select`"
                                                :field="{name:'工作地点',options:workGroupData}"
                                                v-model="form.workGroup"
                                            /> 
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render
                                                prop="contractTime"
                                                :type="`select`"
                                                :field="{name:'合同年限',options:contractTimeData}"
                                                v-model="form.contractTime"
                                            /> 
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render
                                                prop="trialTime"
                                                :type="`select`"
                                                :field="{name:'试用期限',options:trialTimeData}"
                                                v-model="form.trialTime"
                                            /> 
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render
                                                prop="checkWorkType"
                                                :type="`select`"
                                                :field="{name:'考勤签到',options:checkWorkTypeData}"
                                                v-model="form.checkWorkType"
                                            /> 
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render
                                                prop="teamID"
                                                :type="`select`"
                                                :field="{name:'智能班组',options:teamIDData}"
                                                v-model="form.teamID"
                                            /> 
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                            </el-tab-pane>
                            <el-tab-pane label="招聘要求" name="second">
                                <br />
                                <el-row :gutter="40">
                                    <el-col :span="12">
                                        <el-row :gutter="20">
                                            <el-col :span="24">
                                                <form-render
                                                    :type="`input`"
                                                    :field="{name:'到岗要求'}"
                                                    v-model="form.dutyRequirement"
                                                /> 
                                            </el-col>
                                            
                                            <el-col :span="24">
                                                <form-render
                                                    :type="`select`"
                                                    :field="{name:'性别要求',options:needSexData}"
                                                    v-model="form.needSex"
                                                /> 
                                            </el-col>
                                            <el-col :span="24">
                                                <!-- <form-render
                                                    :type="`input`"
                                                    :field="{name:'年龄要求'}"
                                                    v-model="form.ageClass"
                                                />  -->
                                                <el-form-item label="年龄要求">
                                                    <el-row :gutter="0">
                                                        <el-col :span="10">
                                                            <el-input v-model="form.minAge" placeholder="最低年龄"></el-input>
                                                        </el-col>
                                                        <el-col :span="4" style="text-align:center">
                                                            -
                                                        </el-col>
                                                        <el-col :span="10">
                                                            <el-input v-model="form.maxAge"  placeholder="最高年龄"></el-input>
                                                        </el-col>
                                                    </el-row>
                                                </el-form-item>
                                            </el-col>
                                           
                                            <el-col :span="24">
                                                <form-render
                                                    :type="`input`"
                                                    :field="{name:'薪资要求'}"
                                                    v-model="form.salaryRange"
                                                /> 
                                            </el-col>
                                            <el-col :span="24">
                                                <form-render
                                                    :type="`select`"
                                                    :field="{name:'渠道要求',options:recruitWayData}"
                                                    v-model="form.recruitWay"
                                                /> 
                                            </el-col>
                                        </el-row>
                                    </el-col>

                                    <el-col :span="12">
                                        <el-row :gutter="20">
                                            <el-col :span="24">
                                                <form-render
                                                    :type="`select`"
                                                    :field="{name:'学历要求',options:needEduLevelData}"
                                                    v-model="form.needEduLevel"
                                                /> 
                                            </el-col>
                                            <el-col :span="24">
                                                <form-render
                                                    :type="`textarea`" autosize
                                                    :rows='1'
                                                    :field="{name:'专业要求'}"
                                                    v-model="form.needMajor"
                                                /> 
                                            </el-col>
                                            <el-col :span="24">
                                                <form-render
                                                    autosize
                                                    :rows='1'
                                                    :type="`textarea`"
                                                    :field="{name:'经验要求'}"
                                                    v-model="form.needWorkExp"
                                                /> 
                                            </el-col>
                                            <el-col :span="24">
                                                <form-render
                                                    autosize
                                                    :rows='1'
                                                    :type="`textarea`"
                                                    :field="{name:'技能要求'}"
                                                    v-model="form.needSkill"
                                                />
                                            </el-col>
                                            <el-col :span="24">
                                                <form-render
                                                    autosize
                                                    :rows='1'
                                                    :type="`textarea`"
                                                    :field="{name:'其它要求'}"
                                                    v-model="form.needElse"
                                                /> 
                                            </el-col>
                                        <!-- <el-col :span="24">
                                            <form-render
                                                :type="`select`"
                                                :field="{name:'征聘方式',options:recruitTypeData}"
                                                v-model="form.recruitType"
                                            /> 
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render
                                                :type="`select`"
                                                :field="{name:'征聘渠道',options:recruitWayData}"
                                                v-model="form.recruitWay"
                                            /> 
                                        </el-col> -->
                                        <!-- <el-col :span="24">
                                            <form-render
                                                :type="`select`"
                                                :field="{name:'招聘类型',options:jobTypeData}"
                                                v-model="form.jobType"
                                            /> 
                                        </el-col> -->

                                        </el-row>
                                    </el-col>
                                </el-row>
                            </el-tab-pane>
                        </el-tabs>
                    </el-form>
                </div>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleFormSubmit">确 定</el-button>
                </div>
            </el-dialog>
            <table-header
            :table_actions="table_actions"
            :table_selectedRows="table_selectedRows"
            :table_form.sync="table_form"
            :table_column="table_field"
            @action="handleAction"
            
            ></table-header>
            <el-table 
                @selection-change="handleChangeSelection"
                :data="table_data"
                border 
                style="width: 100%"
                :row-class-name="table_state_className"
                :header-cell-style="headerCellStyle"
                :height="table_height"
                @header-dragend="table_dragend"
                @sort-change="table_sort_change"
                v-loading="table_loading">
                    <el-table-column 
                    type="selection" 
                    width="60" 
                    class-name="table-column-disabled"
                    :selectable="table_disable_selected"
                    ></el-table-column>
                    <el-table-column type="index" :index="indexMethod" />
                    <each-table-column :table_field="table_field"/>
                     <!-- <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" size="small">应聘名单</el-button>
                    </template>
                    </el-table-column> -->
            </el-table>
            <table-pagination 
            :total="table_form.total" 
            :pagesize.sync="table_form.pagesize"
            :currentpage.sync="table_form.currentpage"
            @change="fetchTableData"
            :table_config="table_config"
            />
        </ui-table>
    </div>
</template>
<script>
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";
const defaultForm = function(){
    return {
        selectable:0,
        iconName:{},
        checkWorkType:0,
        needClass:1,
        contractTime:1,
        trialTime:2
        // department:'',
    }
}
export default {
    props:['url','id'],
    mixins: [table_mixin],
    watch:{
        id(){
            this.table_form.currentpage = 1
            this.fetchTableData()
        },
        url(){
			this.table_form.query.query = []
            // this.table_form.keyword = ''
            this.table_form.currentpage = 1
            this.api_resource = api_common.resource(this.url)
            this.fetchMenu()
            this.fetchTableData()
        }
    },
    methods:{
        handleClick(){
           
        },
        async fetchFormData(){
            this.principalshipData =( await api_common.resource('basicdata/jobtitles').get()).map(o=>({label:o.name,value:o.id}))
            this.teamIDData = (await api_common.resource('hrm/teamid').get()).map(o=>({label:o.name,value:o.id}))
            this.workGroupData =( await api_common.resource('officeaddress').get()).map(o=>({label:o.officeaddressname,value:o.id}))
            this.needEduLevelData = ( await api_common.resource('basicdata/edulevels').get()).map(o=>({label:o.name,value:o.id}))
       },
        add(){
            this.$nextTick(()=>{
                this.$refs['form'].clearValidate()
            })
            this.fetchFormData()
            this.dialogFormVisible = true
            this.form_activeName = 'first'
        },
        async finish(){
            let rows = this.table_selectedRows.map(row=>row.id)
            await this.$request.put('recruit/jobmsg/bluk',{action:'finish'},{
                params:{
                    ids:rows.join(',')
                },
                alert:false
            })
			this.$message.success('完成成功')
            this.fetchTableData()
        },
        async edit(){
            this.form = await this.api_resource.find(this.table_selectedRowsInfo[0].id)
            this.fetchFormData()
            const {name,icon} = this.form
            this.form_activeName = 'first'
            this.form.iconName = {
                name,
                icon
            }
            this.dialogFormVisible = true
        },
        async fetchTableData() {
            this.table_loading = true
			this.table_form.orgid = this.id
            const {rows,total}  =  await this.api_resource.get(this.table_form);
            this.table_data = rows
           
            this.table_form.total = total
            setTimeout(()=>{
                this.table_loading = false
            },300)
        },
        async handleFormSubmit(){
            await this.form_validate()
            let form = Object.assign({},this.form)
            if(this.isInsert){
                await this.api_resource.create(form)
            }else{
                await this.api_resource.update(form.id,form)
            }
            this.dialogFormVisible = false
            this.fetchTableData()
        },
        async fetchMenu(){
            const { field, action,table } = await api_common.menuInit(
               this.url,
            );
            this.table_field = field;
            this.table_actions = action;
            this.table_config = table
        }
    },
    data(){
        return {
            activeName:'first',
            form_activeName:'first',
            table_topHeight:286,
            form:defaultForm(),
            defaultForm,
            api_resource:api_common.resource(this.url),
            principalshipData:[],
            teamIDData:[],
            rules:{
                department: [
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                principalship: [
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                needClass: [
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                workNature: [
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                contractTime:[
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                trialTime:[
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                checkWorkType:[
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                teamID:[
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                workGroup:[
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                needNumber:[
                    { required: true, message: '请输入', trigger: 'blur' },
                ], 
                needTips:[
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                jobResponsibility:[
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                dutyRequirement:[
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
            },
            workNatureData:[
                {
                    value: 1,
                    label: '全职'
                },{
                    value: 2,
                    label: '实习'
                },{
                    value: 3,
                    label: '兼职'
                },{
                    value: 4,
                    label: '返聘'
                }
            ],
            fileTypeData:[
                 {
                    value: 400,
                    label: '试用'
                },{
                    value: 401,
                    label: '正式'
                },
            ],
            workGroupData:[],
            trialTimeData:[
                {
                    value: 1,
                    label: '1个月'
                },{
                    value: 2,
                    label: '2个月'
                },{
                    value: 3,
                    label: '3个月'
                },{
                    value: 4,
                    label: '半年'
                },{
                    value: 5,
                    label: '一年'
                },
            ],
            contractTimeData:[
                {
                    value: 1,
                    label: '一年半'
                },{
                    value: 2,
                    label: '两年'
                },{
                    value: 3,
                    label: '三年'
                },{
                    value: 4,
                    label: '四年'
                },{
                    value: 5,
                    label: '五年'
                },{
                    value: 6,
                    label: '无限期'
                },
            ],
            checkWorkTypeData:[
                {
                    value: 0,
                    label: '需考勤'
                },{
                    value: 1,
                    label: '不需考勤'
                },
            ],
            needClassData:[
                {
                    value: 1,
                    label: '一般紧急'
                },{
                    value: 2,
                    label: '紧急'
                },
            ],
            needSexData:[
                {
                    value: 0,
                    label: '无要求'
                },{
                    value: 1,
                    label: '限女性'
                },{
                    value: 2,
                    label: '限男性'
                },
            ],
            needEduLevelData:[],
            recruitTypeData:[
                {
                    value: 0,
                    label: '内部招聘'
                },{
                    value: 1,
                    label: '外部招聘'
                }
            ],recruitWayData:[
                {
                    value: 0,
                    label: '内部招聘'
                },{
                    value: 1,
                    label: '外部招聘'
                }
            ],
            jobTypeData:[
                {
                    value: 0,
                    label: '劳务工'
                },{
                    value: 1,
                    label: '正式工'
                }
            ]
        }
    },
    
    async created() {
        this.fetchMenu()
        this.fetchTableData()
    }
}
</script>
<style lang="scss">

</style>
