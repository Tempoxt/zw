<template>
    <ui-table ref="table" 
        :table_column="table_field" 
        :table_query.sync="table_form.query"
        @query="querySubmit"
    >
        <!-- 个人信息的添加和编辑 -->
        <el-dialog
            :title="dialogStatus==='insert'?'添加':'编辑'"
            :visible.sync="dialogFormVisible"
            class="public-dialog"
            v-el-drag-dialog
            >
            <div>
                <el-form ref="form" :model="form" label-width="100px" v-loading="loading2" :rules="rules">
                
                    <el-tabs @tab-click="tabClick">
                        <el-tab-pane label="个人信息">
                            <div class="line-box">
                            <el-row :gutter="40">
                                <el-col :span="12">
                                    <el-row :gutter="0">
                                        <el-col :span="24">
                                            <form-render :type="`input`" :field="{name:'姓名'}" v-model="form.chineseName" prop="chineseName"/>
                                        </el-col>
                                    
                                        <el-col :span="24">
                                            <form-render :type="`input`" :field="{name:'身份证号'}" v-model="form.idCard" @change="fetchProvinse" prop="idCard"/>
                                        </el-col>
                                    
                                        <el-col :span="24">
                                        <form-render
                                                :type="`select`"
                                                :field="{name:'民族',options:nationData}"
                                                v-model="form.nation"
                                                prop="nation"
                                            />
                                        </el-col>
                                    
                                        <!-- <el-col :span="24">
                                        <form-render
                                                :type="`select`"
                                                :field="{name:'籍贯',options:nativeplacesData}"
                                                v-model="form.provinse"
                                            />
                                        </el-col> -->
                                        <el-col :span="24">
                                        <form-render
                                            :type="`day`"
                                            :field="{name:'出生年月'}"
                                            v-model="form.birthday"
                                            prop="birthday"
                                            />
                                        </el-col>
                                        <el-col :span="24">
                                        <form-render
                                            :type="`day`"
                                            :field="{name:'证件生效'}"
                                            v-model="form.stayBegin"
                                            prop="stayBegin"
                                            />
                                        </el-col>
                                        <el-col :span="24">
                                        <form-render
                                            :type="`day`"
                                            :field="{name:'证件失效'}"
                                            v-model="form.stayEnd"
                                            prop="stayEnd"
                                            />
                                        </el-col>


                                        
                                    </el-row>
                                </el-col>
                                <el-col :span="12">
                                    <el-row :gutter="0">
                                        <el-col :span="24">
                                            <form-render :type="`input`" :field="{name:'签发机关'}" v-model="form.qfjg"  prop="qfjg"/>
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render :type="`input`" :field="{name:'住址'}" v-model="form.contactAddr" prop="contactAddr"/>
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render
                                                :type="`radio`"
                                                :field="{name:'性别',options:[{
                                                value: 1,
                                                label: '男'
                                                },{
                                                value: 2,
                                                label: '女'
                                                }]}"
                                                v-model="form.sex"
                                                prop="sex"
                                            />
                                        </el-col>
                                        <el-col :span="24">
                                        <el-form-item label="头像"  >
                                            <img :src="`data:image/jpg;base64,`+form.idCardImage" alt="">
                                            
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="24" style="position: relative;">
                                            <el-button style="position: absolute;right:10px;" @click="ZK_start">读取身份证</el-button>
                                        </el-col>
                                    </el-row>
                                </el-col>

                            </el-row>
                            </div>
                        </el-tab-pane>

                        <el-tab-pane label="入职信息">
                            <div class="line-box">
                            <el-row :gutter="40">
                                <el-col :span="12">
                                    <el-row :gutter="20">
                                        <el-col :span="24">
                                        <form-render :type="`input`" :field="{name:'员工工号'}" v-model="form.employeeCode" placeholder="自动生成"/>
                                        </el-col>
                                    
                                        <el-col :span="24">
                                            <form-render :type="`branchsubcompany`" :field="{name:'所属公司'}" v-model="form.subCompany"/>
                                            <!-- <form-render :type="`input`" :field="{name:'所属公司'}" v-model="form.officeaddressname"/> -->
                                        </el-col>
                                    
                                        <el-col :span="24">
                                            <form-render prop="department" :type="`department`" :field="{name:'所属部门',id:form.subCompany}" v-model="form.department"/>

                                        <!-- <form-render
                                                :type="`select`"
                                                :field="{name:'所属部门',options:departmentData}"
                                                v-model="form.department"
                                            /> -->
                                        </el-col>
                                    
                                        <el-col :span="24">
                                            <form-render :type="`branchteam`" :field="{name:'所属小组',id:form.department}" v-model="form.workShop"/>
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render
                                                prop="principalship"
                                                :type="`select`"
                                                :field="{name:'所任职务',options:jobtitlesData}"
                                                v-model="form.principalship"
                                            />
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render
                                                prop="teamID"
                                                :type="`select`"
                                                :field="{name:'智能班组',options:teamidData}"
                                                v-model="form.teamID"
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
                                                :type="`select`"
                                                :field="{name:'工作性质',options:[{
                                                value: 1,
                                                label: '全职'
                                                },{
                                                value: 2,
                                                label: '兼职'
                                                },{
                                                value: 3,
                                                label: '实习'
                                                },{
                                                value: 4,
                                                label: '返聘'
                                                }]}"
                                                v-model="form.workNature"
                                            />
                                        </el-col>
                                    </el-row>
                                </el-col>
                                <el-col :span="12">
                                    <el-row :gutter="20">
                                        
                                        <el-col :span="24">
                                            <form-render :type="`day`" :field="{name:'入职日期'}" v-model="form.onDutyTime"/>
                                        </el-col>
                                        <el-col :span="24">
                                        <form-render
                                                :type="`select`"
                                                :field="{name:'试用期限',options:[{
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
                                                }]}"
                                                v-model="form.trialTime"
                                            />
                                        </el-col>
                                        <el-col :span="24">
                                        <form-render
                                                :type="`select`"
                                                :field="{name:'合同年限',options:[{
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
                                                }]}"
                                                v-model="form.contractTime"
                                            />
                                        </el-col>
                                        <el-col :span="24">
                                        <form-render
                                                :type="`select`"
                                                :field="{name:'考勤方案',options:[{
                                                value: 1,
                                                label: '需考勤'
                                                },{
                                                value: 2,
                                                label: '不需考勤'
                                                }]}"
                                                v-model="form.checkWorkType"
                                            />
                                        </el-col>
                                        <el-col :span="24">
                                            <el-form-item label="介绍人">
                                            <el-select
                                                v-model="form.introducer"
                                                
                                                filterable
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
                                        <el-col :span="24">
                                            <form-render
                                                :type="`radio`"
                                                :field="{name:'工作状态',options:[{
                                                value: 400,
                                                label: '试用'
                                                },{
                                                value: 401,
                                                label: '正式'
                                                }]}"
                                                v-model="form.fileType"
                                            />
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render
                                                :type="`radio`"
                                                :field="{name:'宿舍分配',options:[{
                                                value: 0,
                                                label: '分配'
                                                },{
                                                value: 1,
                                                label: '不分配'
                                                }]}"
                                                v-model="form.liveDormitory"
                                            />
                                        </el-col>
                                        
                                        <el-col :span="24">
                                        <form-render :type="`input`" :field="{name:'现住地址'}" v-model="form.nowAddress" placeholder="不分配宿舍请填写"/>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                            </div>
                        </el-tab-pane>

                        <!-- <el-tab-pane label="联系方式" v-if="!isInsert">
                            <div class="line-box">
                                <el-row :gutter="40">
                                    <el-col :span="12">
                                        <el-row :gutter="0">
                                            <el-col :span="24">
                                                <form-render :type="`input`" :field="{name:'手机号'}" v-model="connect.phones"/>
                                            </el-col>
                                        
                                            <el-col :span="24">
                                                <form-render :type="`input`" :field="{name:'外部邮箱'}" v-model="connect.outMail"/>
                                            </el-col>
                                        
                                            <el-col :span="24">
                                            <form-render :type="`input`" :field="{name:'紧急联系人'}" v-model="connect.contact"/>
                                            </el-col>   
                                        </el-row>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-row :gutter="0">
                                            <el-col :span="24">
                                                <form-render :type="`input`" :field="{name:'短号'}" v-model="connect.short"/>
                                            </el-col>
                                            <el-col :span="24">
                                                <form-render :type="`input`" :field="{name:'内部邮箱'}" v-model="connect.inMail"/>
                                            </el-col>
                                            <el-col :span="24">
                                                <form-render :type="`input`" :field="{name:'紧急联系电话'}" v-model="connect.contactCall"/>
                                            </el-col>
                                        </el-row>
                                    </el-col>
                            </el-row>
                            </div>
                        </el-tab-pane> -->

                        
                        <!-- <el-tab-pane label="合同信息" v-if="!isInsert&&profileData.contractRecords!=''">
                            <div class="line-box">
                                <el-row :gutter="40">
                                    
                                </el-row>
                            </div>
                        </el-tab-pane> -->

                    </el-tabs>
                </el-form>
            </div>

            <div slot="footer" class="dialog-footer dialog-multiple-footer">
                <div>
                    <el-switch
                        v-if="isInsert"
                        v-model="form_multiple"
                        active-text="连续添加"
                        inactive-text="">
                        
                    </el-switch>
                </div>
                <div>
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleFormSubmit">确 定</el-button>
                </div>
            </div>
        </el-dialog>

        <!-- 人员档案的信息预览 -->
        <div>
            <Drawer :closable="false" width="640" v-model="openDrawers">
                <p class="detail">员工档案详情</p>
                <p class="info">个人信息<i @click="showPersonInfo" class="icon iconfont icon-bianji editIcon"></i></p>
                <div class="demo-drawer-profile">
                    <Row>
                        <Col span="12">
                            <span class="labelCon">姓名：</span>
                            <span class="labelCon promp">{{profileData.chineseName}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">签发机关：</span>
                            <span class="labelCon promp">{{profileData.chineseName}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">身份证号：</span>
                            <span class="labelCon promp">{{profileData.idCard}}</span>
                        </Col>
                        <Col span="12" class="alignStart">
                            <span class="labelCon">住址：</span>
                            <span class="labelCon promp addr">{{profileData.contactAddr}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">民族：</span>
                            <span class="labelCon promp">{{profileData.nationShow}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">性别：</span>
                            <span class="labelCon promp">{{profileData.sexShow}}</span>
                        </Col>
                        <Col span="12">
                        <span class="labelCon">籍贯：</span> 
                            <span class="labelCon promp">{{profileData.provinseShow}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">出生年月：</span>
                            <span class="labelCon promp">{{profileData.birthday}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">证件生效：</span>
                            <span class="labelCon promp">{{profileData.stayBegin}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">证件失效：</span>
                            <span class="labelCon promp">{{profileData.stayEnd}}</span>
                        </Col>
                    </Row>
                </div>
                <Divider />
                <p class="info">入职信息<i @click="showEntryInfo" class="icon iconfont icon-bianji editIcon"></i></p>
                <div class="demo-drawer-profile">
                    <Row>
                        <Col span="12">
                            <span class="labelCon">员工工号：</span>
                            <span class="labelCon promp">{{profileData.employeeCode}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">入职日期：</span>
                            <span class="labelCon promp">{{profileData.onDutyTime}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">所属主体：</span>
                            <span class="labelCon promp">{{profileData.socialSecurityMain}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">试用期限：</span>
                            <span class="labelCon promp">{{profileData.trialTimeShow}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">所属部门：</span>
                            <span class="labelCon promp">{{profileData.department__name}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">合同年限：</span>
                            <span class="labelCon promp">{{profileData.contractTimeShow}}</span>
                        </Col>
                        <Col span="12">
                        <span class="labelCon">所任小组：</span> 
                            <span class="labelCon promp">{{profileData.team__name}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">考勤方案：</span>
                            <span class="labelCon promp">{{profileData.checkWorkTypeShow}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">所任职务：</span>
                            <span class="labelCon promp">{{profileData.principalship__name}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">介绍人：</span>
                            <span class="labelCon promp">{{profileData.introducer}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">智能班组：</span>
                            <span class="labelCon promp">{{profileData.teamIDShow}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">工作状态：</span>
                            <span class="labelCon promp">{{profileData.fileTypeShow}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">工作地点：</span>
                            <span class="labelCon promp">{{profileData.workGroup__name}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">宿舍分配：</span>
                            <span class="labelCon promp">{{profileData.liveDormitoryShow}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">工作性质：</span>
                            <span class="labelCon promp">{{profileData.workNatureShow}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">现住地址：</span>
                            <span class="labelCon promp">{{profileData.nowAddress}}</span>
                        </Col>
                    </Row>
                </div>
                <Divider />
                <p class="info">联系方式 <i @click="showContactInfo" class="icon iconfont icon-bianji editIcon"></i></p>
                <div class="demo-drawer-profile">
                    <Row>
                        <Col span="12">
                            <span class="labelCon">电话：</span>
                            <span class="labelCon promp">{{profileData.contactPhone}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">短号：</span>
                            <span class="labelCon promp">{{profileData.shortPhoneNum}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">内部邮箱：</span>
                            <span class="labelCon promp">{{profileData.insideEmail}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">外部邮箱：</span>
                            <span class="labelCon promp">{{profileData.outsideEmail}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">紧急联系人：</span>
                            <span class="labelCon promp">{{profileData.emContactor}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">紧急联系人电话：</span>
                            <span class="labelCon promp">{{profileData.emContact}}</span>
                        </Col>
                    </Row>
                </div>
                <Divider v-if="profileData.contractRecords!=''"/>
                <p class="info" v-if="profileData.contractRecords!=''">合同管理 <i  @click="showContactInfo" class="icon iconfont icon-bianji editIcon"></i></p>
                <div class="demo-drawer-profile" v-for="item in profileData.contractRecords" :key="item.id">
                    <Row>
                        <Col span="12">
                            <span class="labelCon">合同名称：</span>
                            <span class="labelCon promp">{{item.chineseName}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">合同开始：</span>
                            <span class="labelCon promp">{{item.chineseName}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">合同类型：</span>
                            <span class="labelCon promp">{{item.chineseName}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">合同结束：</span>
                            <span class="labelCon promp">{{item.chineseName}}</span>
                        </Col>
                    </Row>
                </div>
                <Divider v-if="profileData.cardRecords!=''" />
                <p class="info" v-if="profileData.cardRecords!=''">证件管理</p>
                <div class="demo-drawer-profile flexImg">
                    <div class="idCard" v-for="item in profileData.cardRecords" :key="item.id">
                        <p class="imgInfo">{{item.cardName}}</p>
                        <img class="posti" v-for="img in item.cardConnects" :key="img" :src="baseUrl+img" :data-img="img" alt="" @click="previewImg">
                    </div>
                </div>
                <Divider v-if="profileData.workRecords!=''"/>
                <p class="info" v-if="profileData.workRecords!=''">工作经历</p>
                <div class="demo-drawer-profile" v-for="item in profileData.workRecords" :key="item.id">
                    <Row>
                        <Col span="12">
                            <span class="labelCon">工作单位：</span>
                            <span class="labelCon promp">{{item.workCompany}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">起止时间：</span>
                            <span class="labelCon promp">{{item.startEndTimeShow}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">工作部门：</span>
                            <span class="labelCon promp">{{item.workDepartment}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">证明人：</span>
                            <span class="labelCon promp">{{item.witness}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">工作职务：</span>
                            <span class="labelCon promp">{{item.workJob}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">证明人电话：</span>
                            <span class="labelCon promp">{{item.witnessPhone}}</span>
                        </Col>
                    </Row>
                </div>
                <Divider v-if="profileData.educationRecords!=''" />
                <p class="info" v-if="profileData.educationRecords!=''">教育经历</p>
                <div class="demo-drawer-profile" v-for="item in profileData.educationRecords" :key="item.id">
                    <Row>
                        <Col span="12">
                            <span class="labelCon">学校：</span>
                            <span class="labelCon promp">{{item.enduExp}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">起止时间：</span>
                            <span class="labelCon promp">{{item.startEndTimeShow}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">所学专业：</span>
                            <span class="labelCon promp">{{item.major}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">证书名称：</span>
                            <span class="labelCon promp">{{item.enduCardName}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">教育阶段：</span>
                            <span class="labelCon promp">{{item.enduPeriod}}</span>
                        </Col>
                    </Row>
                </div>
                <Divider v-if="profileData.familyRecords!=''"/>
                <p class="info" v-if="profileData.familyRecords!=''">家庭成员</p>
                <div class="demo-drawer-profile" v-for="item in profileData.familyRecords" :key="item.id">
                    <Row>
                        <Col span="12">
                            <span class="labelCon">姓名：</span>
                            <span class="labelCon promp">{{item.familyMemberName}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">联系电话：</span>
                            <span class="labelCon promp">{{item.familyContact}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">关系：</span>
                            <span class="labelCon promp">{{item.relationship}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">联系地址：</span>
                            <span class="labelCon promp">{{item.familyAddress}}</span>
                        </Col>
                    </Row>
                </div>
                <Divider v-if="profileData.dutyRecords!=''" />
                <p class="info" v-if="profileData.dutyRecords!=''">入职记录</p>
                <div class="demo-drawer-profile" v-for="item in profileData.dutyRecords" :key="item.id">
                    <Row>
                        <Col span="12">
                            <span class="labelCon">入职日期：</span>
                            <span class="labelCon promp">{{item.onDutyTime}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">离职日期：</span>
                            <span class="labelCon promp">{{item.outDutyTime}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">状态：</span>
                            <span class="labelCon promp">{{item.dutyStatus}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">原因：</span>
                            <span class="labelCon promp">{{item.outDutyReason}}</span>
                        </Col>
                    </Row>
                </div>
            </Drawer>
        </div>

        <!-- 人员档案的合同模块的添加弹框 -->
        <el-dialog
            title="添加合同"
            :visible.sync="dialogContractFormVisible"
            class="public-dialog"
            v-el-drag-dialog
            >
            <div>
                <el-form ref="form" :model="form" label-width="100px" v-loading="loading2" :rules="rules">
                    <div class="line-box">
                        <el-row :gutter="40">
                            <el-col :span="12">
                                <el-row :gutter="0">
                                    <el-col :span="24">
                                        <form-render :type="`input`" :field="{name:'合同名称'}" v-model="contract.name"/>
                                    </el-col>
                                
                                    <el-col :span="24">
                                        <form-render :type="`input`" :field="{name:'合同类型'}" v-model="contract.ctype"/>
                                    </el-col>
                                
                                    <el-col :span="24">
                                    <form-render :type="`input`" :field="{name:'合同年限'}" v-model="contract.time"/>
                                    </el-col>   
                                </el-row>
                            </el-col>
                            <el-col :span="12">
                                <el-row :gutter="0">
                                    <el-col :span="24">
                                        <form-render :type="`input`" :field="{name:'开始时间'}" v-model="contract.start"/>
                                    </el-col>
                                    <el-col :span="24">
                                        <form-render :type="`input`" :field="{name:'结束时间'}" v-model="contract.end"/>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </div>
                </el-form>
            </div>

            <div slot="footer" class="dialog-footer dialog-multiple-footer">
                <div>
                    <el-switch
                        v-if="isInsert"
                        v-model="form_multiple"
                        active-text="连续添加"
                        inactive-text="">
                        
                    </el-switch>
                </div>
                <div>
                    <el-button @click="dialogContractFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleFormSubmit">确 定</el-button>
                </div>
            </div>
        </el-dialog>

        <div class="img-show-mask" v-show="maskBtn" id="img-show-mask" @click="closeBigImg">
            <img :src="bigImg" class="bigImg" id="bigImg" />
        </div>

        <table-header
            :table_actions="table_actions"
            :table_selectedRows="table_selectedRows"
            @action="handleAction"
            :table_form.sync="table_form"
            :table_column="table_field"
        ></table-header>
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
            @cell-click="openDrawer"
            :cell-style="cellStyle"
            >
            <el-table-column 
                type="selection" 
                width="60" 
                class-name="table-column-disabled"
                :selectable="table_disable_selected"
            >
            </el-table-column>
            <el-table-column type="index" :index="indexMethod"/>
            <each-table-column :table_field="table_field"/>
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
const api_resource = api_common.resource("hrm/staff");
import Device from '@/utils/zk_sdk/baseISSOnline.js'
import dayjs from 'dayjs'
import { constants } from 'crypto';
let baseUrl = process.env.VUE_APP_STATIC
export default {
    mixins: [table_mixin],
    props:['orgid'],
    data() {
        const defaultForm  = function(){
            return {
                trialTime:1,
                contractTime:2,
                checkWorkType:1,
                fileType:400,
                liveDormitory:1,
                workNature:1,
                subCompany:'',
                department:'',
                workShop:'',
                onDutyTime:dayjs().format('YYYY-MM-DD')
            }
        }
        return {
            baseUrl,
            openDrawers: false,
            loading: true,
            loading2:false,
            form:{},
            defaultForm,
            api_resource,
            orgCategory:[],
            queryDialogFormVisible:true,
            table_height:window.innerHeight-296,
            nationData:[],
            nativeplacesData:[],
            workGroupData:[],
            departmentData:[],
            teamidData:[],
            introducerData:[],
            jobtitlesData:[],
            wageTypeData:[],
            wageGradeData:[],
            socialSecuritiesData:[],
            rules:{
                chineseName: [
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                idCard: [
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                nation: [
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                birthday:[
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                stayBegin:[
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                stayEnd:[
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                qfjg:[
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                contactAddr:[
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                sex:[
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                department:[
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                principalship:[
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                teamID:[
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                workGroup:[
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                
            },
            staffId:'',
            paydataForm:{},
            connect:{},
            profileData:{},
            dialogContractFormVisible:false,
            contract:{},
            maskBtn:false,	
            bigImg:''
        };
    },
    watch:{
        orgid(){
            this.table_form.currentpage = 1
            this.fetchTableData()
        },
        'form.subCompany'(){
            if(this.form.subCompany){
                this.fetchDepartment()
            }
        }
    },
    methods: {
        previewImg(e){//图片预览功能
            console.log(e.target.dataset.img,'this url preview');
            this.bigImg = baseUrl+e.target.dataset.img
            this.maskBtn = true;
            this.$nextTick(function() {
                var imgShowMask = document.getElementById('img-show-mask');
                var img = document.getElementById('bigImg');
                var w = document.documentElement.clientWidth || document.body.clientWidth;
                var h = document.documentElement.clientHeight || document.body.clientHeight;
                var offsetY=window.pageYOffset;
                var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
                imgShowMask.style.height=scrollHeight+'px';
                img.style.left=(w/2-250)+'px';
                img.style.top=(h/2-70+offsetY)+'px';
            });
        },
        closeBigImg: function() { //关闭图片预览
            this.maskBtn = false;
        },
        async getDialog(){
            this.form = await api_resource.find(this.staffId)
            this.dialogFormVisible = true
            this.nationData = (await api_common.resource('basicdata/nations').get()).map(o=>{return {label:o.name,value:o.id}})
            this.workGroupData = (await api_common.resource('officeaddress').get()).map(o=>{return {label:o.officeaddressname,value:o.id}})
            this.teamidData = (await api_common.resource('hrm/teamid').get()).map(o=>{return {label:o.name,value:o.id}})
            this.jobtitlesData =  (await api_common.resource('basicdata/jobtitles').get()).map(o=>{return {label:o.name,value:o.id}})
            // console.log(this.form,'form  heihdsdsd')
            // this.connect.phone = this.form
        },
        async showPersonInfo(){
            this.dialogStatus = 'inserts';
            this.tab_label = "个人信息"
            this.getDialog()
        },
        async showEntryInfo(){
            this.dialogStatus = 'inserts';
            this.tab_label = "入职信息"
            this.getDialog()
        },
        async showContactInfo(){
            this.dialogStatus = 'inserts';
            this.tab_label = "联系方式"
            this.getDialog()
        },
        cellStyle({row, column, rowIndex, columnIndex}){
            if(column.label == '工号'){
                return 'color:#0BB2D4;cursor:pointer'
            }else{
                return  ''
            }
        },
        openDrawer(row,column,cell,event){
            this.staffId = row.id;
            if(row.employeeCode==event.target.innerHTML){
                this.openDrawers = true
                this.fetchProfileData()
            }
        },
        async tabClick(v){
            console.log(v.label,'v.label')
            this.tab_label  = v.label
            console.log(this.tab_label,'this.tab_label')
            if(this.tab_label ==='薪资信息'){
                this.paydataForm = await api_common.resource('hrm/staff/paydata').find(this.form.id)
                this.fetchwageTypeData()
                this.fetchsocialSecuritiesData()
            }
            console.log(v,'v')
        },
        selectNation(){
            this.form.nation = this.nationData.find(o=>o.label===this.form._nation+'族').value
        },
        async remoteMethod(query){
            if (query !== '') {
                this.introducerData = await api_common.resource('hrm/partstaff').get({
                    keyword:query,
                    pagesize:10
                })
            } 
        },
        ZK_start(){
            this.loading2 = true
            this.Device.startFun()
        },
        async add(){
            this.$nextTick(()=>{
                this.$refs['form'].clearValidate()
            })
            this.form = this.defaultForm()
            this.dialogFormVisible = true
            this.nationData = (await api_common.resource('basicdata/nations').get()).map(o=>{return {label:o.name,value:o.id}})
            this.workGroupData = (await api_common.resource('officeaddress').get()).map(o=>{return {label:o.officeaddressname,value:o.id}})
            this.teamidData = (await api_common.resource('hrm/teamid').get()).map(o=>{return {label:o.name,value:o.id}})
            this.jobtitlesData =  (await api_common.resource('basicdata/jobtitles').get()).map(o=>{return {label:o.name,value:o.id}})
        },
        async edit(){
            this.$nextTick(()=>{
                this.$refs['form'].clearValidate()
            })
            let row = this.table_selectedRows[0];
            this.form = await api_resource.find(row.id)
            this.dialogFormVisible = true
            this.nationData = (await api_common.resource('basicdata/nations').get()).map(o=>{return {label:o.name,value:o.id}})
            this.workGroupData = (await api_common.resource('officeaddress').get()).map(o=>{return {label:o.officeaddressname,value:o.id}})
            this.teamidData = (await api_common.resource('hrm/teamid').get()).map(o=>{return {label:o.name,value:o.id}})
            this.jobtitlesData =  (await api_common.resource('basicdata/jobtitles').get()).map(o=>{return {label:o.name,value:o.id}})
        },
        async fetchDepartment(){
            this.departmentData = await api_common.resource('org/branchdepartment').get({id:this.form.subCompany})
        },
        async handleFormSubmit(){
            console.log(this.form,'form')
            await this.form_validate()
            let form = Object.assign({},this.form)
            if(this.isInsert){
                await api_resource.create(form)
            }else{
                if(this.tab_label ==='薪资信息'){
                    await api_common.resource('hrm/staff/paydata').update(form.id,this.paydataForm)
                }else if(this.tab_label ==='1'){

                }else{
                    await api_resource.update(form.id,form)
                } 
            }
            if(this.form_multiple){
                this.form.introducer = ''
                this.fetchTableData()
            }else{
                this.dialogFormVisible = false
                this.fetchTableData()
            }  
        },
        async fetchProvinse(val){
            if(val.length!==18) return
            const result = await api_common.resource('basicdata/nativeplaces').find(val)
        },
        async fetchwageGradeData(){
            this.wageGradeData = (await api_common.resource('basicdata/wageclasses').get()).map(o=>({label:o.name,value:o.id}))
        },
        async fetchwageTypeData(){
            this.wageTypeData = (await api_common.resource('basicdata/wagelevels').get()).map(o=>({label:o.name,value:o.id}))
        },
        async fetchsocialSecuritiesData(){
            this.socialSecuritiesData = (await api_common.resource('basicdata/socialsecurities').get()).map(o=>({label:o.name,value:o.id}))
        },
        async fetchTableData() {
            const {rows , total }= await api_resource.get(this.table_form);
            this.table_data  = rows
            this.table_form.total = total
            setTimeout(() => {
                this.table_loading = false;
            }, 300);
        },
        async fetchProfileData() {
           this.profileData =await this.$request.get('hrm/detailmsg/'+this.staffId)
        // this.profileData =await this.$request.get('hrm/detailmsg/16036')
        },
    },
    async created() {
        const { field, action,table } = await api_common.menuInit("hrm/staff");
        this.table_field = field;
        this.table_actions = action;
        this.table_config = table
        this.fetchTableData();
        this.Device = new Device()
        var vm =  this
        Device.createISSonlineDevice({
                Cert : {
                    callBack : function(result){
                        const {
                            Address,
                            Base64Photo,
                            Birthday,
                            CardType,
                            IDIssued,
                            IDNumber,
                            IssuedData,
                            Sex,
                            Name,
                            Nation,
                            ValidDate,
                            VisaTimes
                        } = result.Certificate
                        vm.form.chineseName = Name
                        vm.form.idCard = IDNumber
                        vm.form._nation = Nation
            
                        vm.form.birthday = dayjs(Birthday).format('YYYY-MM-DD') 
                        vm.form.stayBegin = dayjs(IssuedData).format('YYYY-MM-DD')   
                        vm.form.stayEnd = dayjs(ValidDate).format('YYYY-MM-DD')    
                        vm.form.contactAddr = Address
                        vm.form.sex = Sex==='男'?1:2
                        vm.form.idCardImage = Base64Photo
                        vm.form.qfjg = IDIssued
                        vm.selectNation()
                        console.log(result,'result')
                    },
                    select : "#button_readID"
                },
                Methods : {
                    showMessage : function(type,message){
                        vm.loading2 = false
                        vm.$message({
                            message: message,
                            type: type
                        });
                    
                    }
                }
            })
    }
};
</script>
<style >
    .img-show-mask {
        width: 100%;
        height: 100%;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 3000;
        background: rgb(0,0,0,.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .ivu-drawer-body{
        padding-left: 30px;
    }
    .detail{
        color: #37474F;
        font-size: 14px;
        font-weight: bold;
        height: 50px;
        line-height: 50px;
        padding-left: 20px;
        background: #E4EAEC;
        box-shadow: 0px 1px 0px rgba(228,234,236,1);
        margin:-16px -30px 0;
        margin-bottom: 0
    }
    .info{
        color: #0BB2D4;
        font-size: 16px;
        font-weight: bold;
        margin: 17px 0 24px 2px;
    }
    .conStyle{
        margin-left: -20px;
        display: flex;
        align-items: flex-start
    }
    .labelCon{
        display: inline-block;
        width: 112px;
        text-align: right;
        font-size: 14px;
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
    .posti{
        width: 107px;
        height: 65px;
    }
    .mt30{margin-top: 30px;}
    .flexImg{
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
    }
    .flexImg>div{
        width: 140px;
        height: 176px;
        background: #F5FAFB;
        margin-right: 10px;
        text-align: center;
        padding-top: 7px;
    }
    .diploma{
        width: 107px
    }
    .imgInfo{
        font-size: 12px;
        color: #4C5D66;
        margin-bottom: 5px;
    }
    .editIcon{
        color:#CCD5DB;
        width: 16px;
        height: 14px;
        font-weight: normal;
        margin-left: 22px;
    }
</style>



