<template>
    <div id="applyResume">
        <ui-table ref="table" 
            :table_column="table_field" 
            :table_query.sync="table_form.query"
            @query="querySubmit"
            >

            <el-dialog
                title="请选择"
                :visible.sync="dialogFormVisible"
                class="public-dialog"
                v-el-drag-dialog
                width="520px"
                >

                <el-form ref="form" :model="form" label-width="100px" :rules="rules">
                    <el-row>
                        <el-col :span="24">
                            <form-render
                                :type="`radio`"
                                :field="{name:'是否通过',options:[{
                                    value: 1,
                                    label: '通过'
                                },{
                                    value: 2,
                                    label: '不通过'
                                }]}"
                                v-model="form.audit"
                                prop="audit"
                            />
                        </el-col>
                        <el-col :span="24">
                            <form-render :type="`day`"  v-if="this.form.audit==1" prop="onDutyTime" :field="{name:'入职日期'}" v-model="form.onDutyTime"/>
                        </el-col>
                        <el-col :span="24" v-if="this.form.audit==2">
                            <form-render
                                :type="`textarea`"
                                :autosize="{ minRows: 2, maxRows: 4}"
                                prop="remark"
                                filterable
                                :field="{name:'不通过原因'}"
                                v-model="form.remark"
                            />
                        </el-col>
                    </el-row>
                </el-form>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleFormSubmit" :disabled="disabled">确 定</el-button>
                </div>
            </el-dialog>

            <el-dialog
                title="添加应聘登记"
                :visible.sync="dialogForm2Visible"
                class="public-dialog"
                v-el-drag-dialog
                >
                <div>
                    <el-form ref="form2" :model="form2" label-width="100px" :rules="rules2">
                        <div class="line-boxs">
                            <el-row>
                                <el-col :span="18" :offset="2">
                                    <form-render prop="department" :type="`depart`" :field="{name:'应聘部门'}" v-model="form2.department"/>
                                </el-col>
                                <el-col :span="18" :offset="2">
                                    <form-render
                                        filterable
                                        placeholder="请搜索或选择"
                                        prop="job"
                                        :type="`select`"
                                        :field="{name:'应聘职位',options:needJobs}"
                                        v-model="form2.job"
                                    />
                                </el-col>
                                <el-col :span="18" :offset="2">
                                    <form-render
                                        prop="name"
                                        :type="`input`"
                                        :field="{name:'姓名',options:teamidData}"
                                        v-model="form2.name"
                                    />
                                </el-col>
                                <el-col :span="18" :offset="2">
                                    <form-render 
                                        prop="phone"
                                        :type="`input`"
                                        :field="{name:'手机号码',options:workGroupData}"
                                        v-model="form2.phone"
                                    />
                                </el-col>
                                <el-col :span="18" :offset="2">
                                    <el-form-item label="附件" :required="true">
                                        <el-upload
                                            class="upload-demo"
                                            ref="upload"
                                            action="www"
                                            :file-list="fileList"
                                            :limit="1"
                                            :on-change="changeFormUploadFiles"
                                            :auto-upload="false">
                                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button></el-upload>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>
                    </el-form>
                </div>

                <div slot="footer" class="dialog-footer">
                    <div>
                        <el-button @click="dialogForm2Visible = false">取 消</el-button>
                        <el-button type="primary" @click="handleForm2Submit">确 定</el-button>
                    </div>
                </div>
            </el-dialog>

             <el-dialog
                title="放弃入职的原因"
                :visible.sync="dialogForm3Visible"
                class="public-dialog"
                v-el-drag-dialog
                >
                <div>
                    <el-checkbox-group v-model="result">
                        <div>
                            <el-checkbox v-for="item in this.reasonData" :label="item.id" :key="item.id" style="display:block;margin:6px 0 6px 30px">{{item.title}}</el-checkbox>
                        </div>
                    </el-checkbox-group>
                </div>

                <div slot="footer" class="dialog-footer">
                    <div>
                        <el-button @click="dialogForm3Visible = false">取 消</el-button>
                        <el-button type="primary" @click="handleForm3Submit" :disabled="this.result.length==0">确 定</el-button>
                    </div>
                </div>
            </el-dialog>

            <el-dialog
                title="面试邀请"
                :visible.sync="dialogForm4Visible"
                class="public-dialog"
                v-el-drag-dialog
                >
                <div>
                    <el-form ref="form4" :model="form4" label-width="100px" :rules="rules4">
                        <div class="line-boxs">
                            <el-row>
                                <el-col :span="18" :offset="2">
                                    <form-render
                                        :type="`radio`"
                                        :field="{name:'是否邀请面试',options:[{
                                            value: 1,
                                            label: '邀请'
                                        },{
                                            value: 0,
                                            label: '不邀请'
                                        }]}"
                                        v-model="form4.isInterviewer"
                                        prop="isInterviewer"
                                    />
                                </el-col>
                                <div v-if="this.form4.isInterviewer==1">
                                    <el-col :span="18" :offset="2">
                                        <form-render prop="recordDate" :type="`day`" :field="{name:'面试日期'}" v-model="form4.recordDate"/>
                                    </el-col>
                                    <el-col :span="18" :offset="2">
                                        <form-render prop="recordTime" :type="`time`" class="interviewTime" :field="{name:'面试时间'}" v-model="form4.recordTime"/>
                                    </el-col>
                                    <el-col :span="18" :offset="2">
                                        <form-render
                                            filterable
                                            placeholder="请搜索或选择"
                                            prop="workGroup"
                                            :type="`select`"
                                            :field="{name:'面试地点',options:workGroupData}"
                                            v-model="form4.workGroup"
                                        />
                                    </el-col>
                                    <el-col :span="18" :offset="2">
                                        <el-form-item label="面试官" required>
                                            <el-select
                                                style="width:100%"
                                                v-model="interviewer"
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
                                                    :label="item.chineseName +`(${item.employeeCode})`"
                                                    :value="item.id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>     
                                    </el-col>
                                </div>
                            </el-row>
                        </div>
                    </el-form>
                </div>

                <div slot="footer" class="dialog-footer">
                    <div>
                        <el-button @click="dialogForm4Visible = false">取 消</el-button>
                        <el-button type="primary" @click="handleForm4Submit" :disabled="disabled4">确 定</el-button>
                    </div>
                </div>
            </el-dialog>

            <el-dialog
                title="发送offer"
                :visible.sync="dialogForm5Visible"
                class="public-dialog"
                v-el-drag-dialog
                >
                <div>
                    <el-form ref="form5" :model="form5" label-width="100px" :rules="rules5">
                        <div class="line-boxs">
                            <el-row>
                                <el-col :span="18" :offset="2">
                                    <form-render
                                        :type="`radio`"
                                        :field="{name:'是否发送offer',options:[{
                                            value: 1,
                                            label: '发送'
                                        },{
                                            value: 0,
                                            label: '不发送'
                                        }]}"
                                        v-model="form5.isInterviewer"
                                        prop="isInterviewer"
                                    />
                                </el-col>
                                <div v-if="this.form5.isInterviewer==1">
                                    <el-col :span="18" :offset="2">
                                        <form-render prop="departmentname" :type="`input`" :disabled="true" :field="{name:'部门'}" v-model="form5.departmentname"/>
                                    </el-col>
                                    <el-col :span="18" :offset="2">
                                        <form-render
                                            filterable
                                            placeholder="请搜索或选择"
                                            prop="recruitJob"
                                            :type="`select`"
                                            :field="{name:'职位',options:needJobs}"
                                            v-model="form5.recruitJob"
                                        />
                                    </el-col>
                                    <el-col :span="18" :offset="2">
                                        <form-render prop="principalName" :type="`input`" :disabled="true" :field="{name:'联系人'}" v-model="form5.principalName"/>
                                    </el-col>
                                    <el-col :span="18" :offset="2">
                                        <form-render prop="principalPhone" :type="`input`" :field="{name:'联系人电话'}" v-model="form5.principalPhone"/>
                                    </el-col>
                                    <el-col :span="18" :offset="2">
                                        <form-render prop="onDutyTime" :type="`day`" :field="{name:'入职日期'}" v-model="form5.onDutyTime"/>
                                    </el-col>
                                    <el-col :span="18" :offset="2">
                                        <form-render prop="trialTime"
                                            :type="`select`"
                                            :field="{name:'试用期限',options:trialTimeData}"
                                            v-model="form5.trialTime"
                                        /> 
                                    </el-col>
                                    <el-col :span="18" :offset="2">
                                        <form-render prop="probationSalary" :type="`input`" :field="{name:'试用期薪资'}" v-model="form5.probationSalary"/>
                                    </el-col>
                                </div>
                            </el-row>
                        </div>
                    </el-form>
                </div>

                <div slot="footer" class="dialog-footer">
                    <div>
                        <el-button @click="dialogForm5Visible = false">取 消</el-button>
                        <el-button type="primary" @click="handleForm5Submit">确 定</el-button>
                    </div>
                </div>
            </el-dialog>


            <!-- 人员档案的信息预览 -->
            <div>
                <Drawer title="简历详情" :closable="false" width="640" v-model="openDrawers" class="drawerInfo applyInfo" v-if="profileData.main">
                    <p class="info" style="margin-top:20px">基本信息</p>
                    <div class="drawer-profile">
                        <el-row>
                            <el-col :span="12">
                                <span class="labelCon">姓名：</span>
                                <span class="labelCon promp">{{profileData.main.name}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">性别：</span>
                                <span class="labelCon promp">{{profileData.main.sex}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">出生年月：</span>
                                <span class="labelCon promp">{{profileData.main.birthday}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">年龄：</span>
                                <span class="labelCon promp">{{profileData.main.age}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">薪资要求：</span>
                                <span class="labelCon promp">{{profileData.main.salary}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">身份证号：</span>
                                <span class="labelCon promp">{{profileData.main.idCard}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">婚否：</span>
                                <span class="labelCon promp">{{profileData.main.marriage}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">籍贯：</span> 
                                <span class="labelCon promp">{{profileData.main.census}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">子女情况：</span> 
                                <span class="labelCon promp">{{profileData.main.children}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">联系电话：</span>
                                <span class="labelCon promp">{{profileData.main.telephone}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">最高学历：</span> 
                                <span class="labelCon promp">{{profileData.main.eduction}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">专业：</span> 
                                <span class="labelCon promp">{{profileData.main.discipline}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">毕业院校：</span> 
                                <span class="labelCon promp">{{profileData.main.college}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">爱好：</span> 
                                <span class="labelCon promp">{{profileData.main.hobby}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">所会语言：</span> 
                                <span class="labelCon promp">{{profileData.main.language}}</span>
                            </el-col>
                            <el-col :span="12" class="alignStart">
                                <span class="labelCon">健康状况：</span>
                                <span class="labelCon promp">{{profileData.main.health}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">视力、色盲检测：</span>
                                <span class="labelCon promp">{{profileData.main.colorBlindness}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">职业病、遗传或慢性病史：</span>
                                <span class="labelCon promp">{{profileData.main.medicalHistory}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">户口所在地：</span>
                                <span class="labelCon promp">{{profileData.main.hometown}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">网络/网站名：</span>
                                <span class="labelCon promp">{{profileData.main.applyOption}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">介绍人：</span>
                                <span class="labelCon promp">{{profileData.main.introducer}}</span>
                            </el-col>
                        </el-row>
                    </div>
                    <p class="info">应聘信息</p>
                    <div class="drawer-profile">
                        <el-row>
                            <el-col :span="12">
                                <span class="labelCon">应聘部门：</span>
                                <span class="labelCon promp">{{profileData.main.departmentname}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">应聘职位：</span>
                                <span class="labelCon promp">{{profileData.main.job}}</span>
                            </el-col>
                        </el-row>
                    </div>
                    <p class="info" v-if="profileData.main.Position!=''&&profileData.main.Position!=null">工作经历</p>
                    <div class="drawer-profile">
                        <el-row class="mb20" v-for="item in profileData.main.Position" :key="item.id">
                            <el-col :span="24">
                                <span class="labelCon">最近一个离职日期：</span>
                                <span class="labelCon promp">{{item.departureDate}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">开始日期：</span>
                                <span class="labelCon promp">{{item.startDate}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">职位：</span>
                                <span class="labelCon promp">{{item.job}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">结束日期：</span>
                                <span class="labelCon promp">{{item.endDate}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">工作单位：</span>
                                <span class="labelCon promp">{{item.companyName}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">证明人：</span>
                                <span class="labelCon promp">{{item.witness}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">部门：</span>
                                <span class="labelCon promp">{{item.department}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">证明电话：</span>
                                <span class="labelCon promp">{{item.witnessPhone}}</span>
                            </el-col>
                            <el-col :span="24">
                                <span class="labelCon">主要职责：</span>
                                <span class="labelCon promp">{{item.jobContent}}</span>
                            </el-col>
                        </el-row>
                    </div>
                    <p class="info" v-if="profileData.main.Eduction!=''&&profileData.main.Eduction!=null">教育经历</p>
                    <div class="drawer-profile">
                        <el-row class="mb20" v-for="item in profileData.main.Eduction" :key="item.id">
                            <el-col :span="12">
                                <span class="labelCon">学校：</span>
                                <span class="labelCon promp">{{item.schoolName}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">起止时间：</span>
                                <span class="labelCon promp">{{item.startDate}} &nbsp;- &nbsp;{{item.endDate}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">教育阶段：</span>
                                <span class="labelCon promp">{{item.studyContent}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">专业：</span>
                                <span class="labelCon promp">{{item.discipline}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">证书名称：</span>
                                <span class="labelCon promp">{{item.certificateName}}</span>
                            </el-col>
                        </el-row>
                    </div>
                    <p class="info" v-if="profileData.main.Eduction!=''&&profileData.main.Eduction!=null">简历附件</p>
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
                    <dateLap type="1" v-model="table_form.dateLap" @change="fetch"/>
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
                >
                <el-table-column 
                    type="selection" 
                    width="60" 
                    class-name="table-column-disabled"
                    :selectable="table_disable_selected"
                    >
                </el-table-column>
                <each-table-column :table_field="table_field" :template="template"/>
                <el-table-column
                    v-if="flag==0||flag==1 ||flag==2"
                    fixed="right"
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                        <span class="oprateBtn resume" @click="openDrawer(scope.row)">简历详情</span>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="flag==3"
                    fixed="right"
                    label="操作"
                    width="177">
                    <template slot-scope="scope">
                        <span class="oprateBtn resume" @click="openDrawer(scope.row)">简历详情</span>
                        <span class="oprateBtn giveUp" @click="handleGiveUp(scope.row)">放弃入职</span>
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
    </div>
</template>

<script>
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";
import dayjs from 'dayjs'

export default {
    mixins: [table_mixin],
    name: 'applyResume',
    props:['flag','orgid'],
    data() {
        var checkPhone  = (rule, value, callback)=>{
			if (value==='') {
				return callback(new Error('请输入'));
			}else if (!(/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(value))) {
				callback(new Error('请输入正确的手机号'));
			}else{
				callback();
			}
		}
        const defaultForm  = function(){
            return {
                trialTime: 2,
                contractTime: 1,
                checkWorkType: 0,
                fileType: 400,
                workNature: 1,
                subCompany: 1,
                workGroup: 1,
                department: null,
                onDutyTime: dayjs().add(1,'day').format('YYYY-MM-DD'),
            }
        }
        return {
            defaultForm,
            table_loading: false,
            api_resource: api_common.resource("hrm/applyResume"),
            table_topHeight: 300,
            dialogFormVisible: false,
            dialogForm1Visible: false,
            dialogForm2Visible: false,
            dialogForm3Visible: false,
            dialogForm4Visible: false,
            dialogForm5Visible: false,
            form: {},
            form1: {},
            form2: {},
            form4: {
                isInterviewer: '',
                recordDate: '',
                interviewer: '',
                workGroup: ''
            },
            form5: {
                departmentname: ''
            },
            fileList: [],
            introducerData: [],
			rules:{
				audit:[
					{ required: true, message: '请选择', trigger:  ['blur', 'change'] },
				],
            },
			rules1:{
				onDutyTime:[
					{ required: true, message: '请选择', trigger:  ['blur', 'change'] },
				],
            },
			rules2:{
				department:[
					{ required: true, message: '请选择', trigger:  ['blur', 'change'] },
				],
				job:[
					{ required: true, message: '请选择', trigger:  ['blur', 'change'] },
				],
				name:[
					{ required: true, message: '请选择', trigger:  ['blur', 'change'] },
				],
				phone:[
					{ required: true, message: '请选择', trigger:  ['blur', 'change'] },
				],
            },
			rules4:{
                isInterviewer:[
					{ required: true, message: '请选择', trigger:  ['blur', 'change'] },
				],
				workGroup:[
					{ required: true, message: '请选择', trigger:  ['blur', 'change'] },
				],
                recordDate:[
					{ required: true, message: '请选择', trigger:  ['blur', 'change'] },
				],
            },
			rules5:{
                isInterviewer:[
					{ required: true, message: '请选择', trigger:  ['blur', 'change'] },
				],
                recruitJob:[
					{ required: true, message: '请选择', trigger:  ['blur', 'change'] },
				],
                principalName:[
					{ required: true, message: '请选择', trigger:  ['blur', 'change'] },
				],
				principalPhone:[
					{ required: true, message: '请选择', trigger:  ['blur', 'change'] },
				],
                onDutyTime:[
					{ required: true, message: '请选择', trigger:  ['blur', 'change'] },
                ],
                trialTime:[
					{ required: true, message: '请选择', trigger:  ['blur', 'change'] },
                ],
                probationSalary:[
					{ required: true, message: '请输入', trigger:  ['blur', 'change'] },
                ],
            },
            profileData: {},
            openDrawers: false,
            template: {},
            jobtitlesData: [],
            workGroupData :[],
            teamidData: [],
            needJobs: [],
            allData: [],
            interviewer: '',
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
            reasonData: [],
            result: [],
            refuseId: '',
        }
    },
    watch:{
        flag(){
			this.table_form.query.query = []
			this.table_form.currentpage = 1
            this.fetchMenu()
            this.fetchTableData()
        },
        'form1.recruitJob'(){
            if(this.form1.recruitJob!='' && this.form1.recruitJob!=undefined){
                let f = (this.allData.filter(o=>o.id==this.form1.recruitJob))[0]
                this.form1 = f
                this.form1.recruitJob = f.id
                this.form1.fileType = this.form.fileType==null? 400 :this.form.fileType
            }
        }
    },
    computed: {
        disabled(){
			if(this.form.audit!==''){
				if(this.form.audit==1){
                    if(this.form.onDutyTime && this.form.onDutyTime!=''){
                        return false
                    }
                    return true
				}else if(this.form.audit==2){
					if(this.form.remark&&this.form.remark!==''){
						return false
					}else{
						return true
					}
				}
			}
			return true
        },
        disabled1(){
            if(this.form1.onDutyTime!=''&&this.form1.onDutyTime!=undefined){
                return false
            }
            return true
        },
        disabled4(){
			if(this.form4.isInterviewer!==''){
				if(this.form4.isInterviewer==1){
                    if(this.form4.recordDate!='' && this.form4.workGroup!=''&&this.interviewer!=''){
                        return false
                    }
                    return true
				}else{
                    return false
                }
			}
			return true
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
        async getSelectOption(){
            this.workGroupData = (await api_common.resource('officeaddress').get()).map(o=>{return {label:o.officeaddressname,value:o.id}})
            this.teamidData = (await api_common.resource('hrm/teamid').get()).map(o=>{return {label:o.name,value:o.id}})
            this.jobtitlesData =  (await api_common.resource('basicdata/jobtitles').get()).map(o=>{return {label:o.name,value:o.id}})
        },
        async add(){
            this.form2 = {}
            this.allData = await this.$request.get('recruit/minijobmsg')
            this.needJobs = this.allData.map(o=>{return {label:o.principalshipShow,value:o.id}})
            this.$nextTick(()=>{
                this.$refs['form2'].clearValidate()
            })
            this.dialogForm2Visible = true
        },
        fetch(){
            this.table_form.currentpage = 1
            this.fetchTableData()
        },
        async openDrawer(row){ //查看简历详情
            this.openDrawers = true
            this.profileData = await api_common.resource('hrm/applyResume').find(row.id)
        },
        handleClose(row){ //关闭
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        async handleGiveUp(row){ //放弃入职
            this.refuseId = row.id
            this.reasonData = await this.$request.get('hrm/interquestion?tag=GiveUp')
            this.dialogForm3Visible = true
            this.result = []
        },
        async audit(){
            if(this.flag==0){
                this.dialogFormVisible = true
                this.form = {}
                this.$nextTick(()=>{
                    this.$refs['form'].clearValidate()
                })
            }else if(this.flag==1){
                this.form4 = {}
                this.workGroupData = (await api_common.resource('officeaddress').get()).map(o=>{return {label:o.officeaddressname,value:o.id}})
                this.dialogForm4Visible = true
                let id = this.table_selectedRows[0].id
                let form4 = await this.$request.get('hrm/leader/interviewer/info',{params:{
                    id:id
                }})
                this.introducerData = await api_common.resource('hrm/partstaff').get({
                    IsDimission:0,
                    keyword: form4.workcode,
                    pagesize:10
                })
                this.form4.workGroup = form4.workGroup
                this.interviewer = form4.interviewer
                this.$nextTick(()=>{
                    this.$refs['form4'].clearValidate()
                })
            }else if(this.flag==2){
                this.form5 = {}
                this.dialogForm5Visible = true
                let row = this.table_selectedRows[0]
                this.form5 = await this.$request.get('hrm/leader/interviewer/info',{params:{
                    id: row.id
                }})
                this.allData = await this.$request.get('recruit/minijobmsg')
                this.needJobs = this.allData.map(o=>{return {label:o.principalshipShow,value:o.id}})
                this.form5.departmentname = row.departmentname
                // this.form5.principalName = form5.principalName
                // this
                this.$nextTick(()=>{
                    this.$refs['form5'].clearValidate()
                })
                console.log(this.form5,'rrrrrrr')
            }
        },
		async changeFormUploadFiles(file, fileList){
            var formData = new FormData();
            formData.append("upload_msg", "introduce_doc");
            formData.append('the_file',file.raw,'hello.jpg')
            const { path } = await this.$request.post('/uploadfile',formData)
            this.form2.resume = path
		},
        async handleFormSubmit(){
            let ids = this.table_selectedRows.map(o=>o.id)
            this.form.ids = ids.join(',')
            await this.$request.put('hrm/applyResume/audit',this.form)
            this.dialogFormVisible = false
            this.fetchTableData()
        },
        async handleForm1Submit(){
            await this.form_validate('form1')
            let ids = this.table_selectedRows.map(o=>o.id)
            this.form1.ids = ids.join(',')
            let form = Object.assign({},this.form1)
            await this.$request.put('hrm/applyResume/ensure',this.form1)
            this.dialogForm1Visible = false
            this.fetchTableData()
        },
        async handleForm2Submit(){
            await this.form_validate('form2')
            let form2 = Object.assign({},this.form2)
            await this.$request.put('hrm/applyResume',form2)
            this.dialogForm2Visible = false
            this.fetchTableData()
        },
        async handleForm3Submit(){
            let data ={
                id: [this.refuseId],
                isInterviewer: 0,
                ngReason: this.result.join(','),
                flag: 3
            }
            let mes = await this.$request.put('hrm/leader/interviewer/audit',{data: JSON.stringify(data)})
            this.dialogForm3Visible = false
            this.fetchTableData()
        },
        async handleForm4Submit(){
            await this.form_validate('form4')
            this.form4.id = this.table_selectedRows.map(o=>o.id)
            this.form4.interviewer = this.interviewer
            this.form4.flag = this.flag
            let form4 = JSON.stringify(this.form4)
            await this.$request.put('hrm/leader/interviewer/audit',{data:form4})
            this.dialogForm4Visible = false
            this.fetchTableData()
        },
        async handleForm5Submit(){
            await this.form_validate('form5')
            this.form5.id = this.table_selectedRows.map(o=>o.id)
            this.form5.flag = this.flag
            let form5 = JSON.stringify(this.form5)
            await this.$request.put('hrm/leader/interviewer/audit',{data:form5})
            this.dialogForm5Visible = false
            this.fetchTableData()
        },
        async fetchTableData() {
			this.table_loading = true;
            this.table_form.flag = this.flag
            this.table_form.orgid = this.orgid
			const {rows , total }= await this.api_resource.get(this.table_form);
			this.table_data  = rows
			this.table_form.total = total
			setTimeout(() => {
                this.table_loading = false;
                this.$refs.elTable.doLayout()
            }, 300);
        },
        lookImg(url) {
            let urls = url.split(';')
           
            urls.forEach(o=>{
                window.open(process.env.VUE_APP_STATIC+o.replace('.tencent','.png').replace('.android','.png'))
            })
        },
        async fetchMenu(){
            const { field, action,table } = await api_common.menuInit("applyResume"+this.flag);
            this.table_field = field;
            this.table_actions = action;
            this.table_config = table
        }
    },
    async created() {
        this.fetchMenu()
    },
    mounted() {
		this.$set(this.table_form,'dateLap',dayjs().format('YYYY-MM-DD'))
        this.fetchTableData();
    }
    
    
}
</script>

<style lang="scss">
#applyResume{
    .el-table__fixed-right{
        z-index: 1;
    }
    .oprateBtn{
        border: 1px solid;
        height: 28px;
        line-height: 28px;
        display: inline-block;
        border-radius: 2px;
        margin-right: 10px;
        box-sizing: border-box;
        text-align: center;
        cursor: pointer;
    }
    .resume{
        border-color: #0BB2D4;
        color: #0BB2D4;
        width: 70px;
    }
    .pass{
        border-color: #18CC72;
        color: #18CC72;
        width: 56px;
    }
    .refuse{
        border-color: #FF9100;
        color: #FF9100;
        width: 56px;
    }
    .close{
        border-color: #FF0000;
        color: #FF0000;
        width: 56px;
    }
    .giveUp{
        border-color: #FF0000;
        color: #FF0000;
        width: 70px;
    }
    .mb20{margin-bottom: 20px;}
    .interviewTime{
        .el-date-editor.el-input{
            width: 100%;
        }
    }
}
.applyInfo{
    .info{
        color: #0BB2D4;
        font-size: 14px;
        font-weight: bold;
        margin: 10px 0 15px 10px;
        background: #F5F5F5;
        padding: 8px 20px
    }
    .el-row{
        margin-left: 20px
    }
    .ivu-drawer-body{
        padding:0;
    }
    .ivu-drawer-header{
        background: rgba(245,250,251,1)
    }
    .line-boxs{
        margin-top: 20px;
    }
    .labelCon{
        display: inline-block;
        text-align: left;
        font-size: 12px;
        color: #4C5D66;
    }
    .promp{
        color: #A3AFB7;
        text-align: left;
        width: auto;
    }
    .ivu-col{
        margin-bottom: 8px;
    }
    .addr{
        width: 215px;
        word-wrap:break-word;
    }
    .alignStart{
        display: flex;
        align-items: flex-start
    }
    .ivu-row{
        margin-left: -27px;
        margin-bottom: -8px;
    }
    .drawer-profile{
         .el-col-12,.el-col-24{
            margin-bottom: 15px;
        }
    }
}
</style>