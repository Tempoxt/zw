<template>
    <ui-table ref="table" 
        :table_column="table_field" 
        :table_query.sync="table_form.query"
        @query="querySubmit"
    >
        <!-- 个人信息的添加和编辑 -->
        <el-dialog
            :title="dialogStatus==='insert'?'添加员工':'编辑员工'"
            :visible.sync="dialogFormVisible"
            class="public-dialog"
            v-el-drag-dialog
            >
            <div>
                <el-form ref="form" :model="form" label-width="100px" v-loading="loading2" :rules="rules">
                    <el-tabs @tab-click="tabClick" v-model="activeName" >
                        <el-tab-pane label="个人信息" name="first">
                            <div class="line-boxs">
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

                        <el-tab-pane label="入职信息" name="second">
                            <div class="line-boxs">
                            <el-row :gutter="40">
                                <el-col :span="12">
                                    <el-row :gutter="20">
                                        <el-col :span="24" v-if="!isInsert">
                                            <form-render :type="`input`" :field="{name:'员工工号'}" :disabled="true" v-model="form.employeeCode" placeholder="自动生成"/>
                                        </el-col>
                                    
                                        <el-col :span="24">
                                            <form-render :type="`branchsubcompany`" :field="{name:'所属公司'}" v-model="form.subCompany"/>
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render prop="department" :type="`department`" :field="{name:'所属部门',id:form.subCompany}" v-model="form.department"/>
                                        </el-col>
                                    
                                        <el-col :span="24">
                                            <form-render :type="`branchteam`" :field="{name:'所属小组',id:form.department}" v-model="form.team"/>
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render
                                                filterable
                                                placeholder="请搜索或选择"
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
                                                label: '实习'
                                                },{
                                                value: 3,
                                                label: '兼职'
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
                                                value: 0,
                                                label: '无试用期'
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
                                                value: 0,
                                                label: '需考勤'
                                                },{
                                                value: 1,
                                                label: '不需考勤'
                                                }]}"
                                                v-model="form.checkWorkType"
                                            />
                                        </el-col>
                                        <el-col :span="24" v-if="isInsert">
                                        <form-render
                                                :type="`select`"
                                                :field="{name:'学历',options:Aledulevels}"
                                                v-model="form.eduLevel"
                                            />
                                        </el-col>
                                        <el-col :span="24" v-if="!isInsert"> 
                                        <form-render
                                                :type="`select`"
                                                :field="{name:'学历',options:alledulevels}"
                                                v-model="form.eduLevel"
                                            />
                                        </el-col>
                                        <el-col :span="24">
                                            <el-form-item label="介绍人">
                                            <el-select
                                                v-model="form.introducer"
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
                                                label: '不分配'
                                                },{
                                                value: 1,
                                                label: '分配'
                                                }]}"
                                                v-model="form.liveDormitory" 
                                            />
                                        </el-col>
                                        
                                        <el-col :span="24" v-if="form.liveDormitory==0">
                                        <form-render :type="`input`" :field="{name:'现住地址'}" v-model="form.nowAddress" placeholder="不分配宿舍请填写"/>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                            </div>
                        </el-tab-pane>

                        <el-tab-pane label="联系方式" v-if="!isInsert" name="third">
                            <div class="line-boxs">
                                <el-row :gutter="40">
                                    <el-col :span="12">
                                        <el-row :gutter="0">
                                            <el-col :span="24">
                                                <form-render :type="`input`" :field="{name:'手机号'}" v-model="connect.contactPhone"/>
                                            </el-col>
                                        
                                            <el-col :span="24">
                                                <form-render :type="`input`" :field="{name:'外部邮箱'}" v-model="connect.outsideEmail"/>
                                            </el-col>
                                        
                                            <el-col :span="24">
                                            <form-render :type="`input`" :field="{name:'紧急联系人'}" v-model="connect.emContactor"/>
                                            </el-col>   
                                        </el-row>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-row :gutter="0">
                                            <el-col :span="24">
                                                <form-render :type="`input`" :field="{name:'短号'}" v-model="connect.shortPhoneNum"/>
                                            </el-col>
                                            <el-col :span="24">
                                                <form-render :type="`input`" :field="{name:'内部邮箱'}" v-model="connect.insideEmail"/>
                                            </el-col>
                                            <el-col :span="24">
                                                <form-render :type="`input`" :field="{name:'紧急联系电话'}" v-model="connect.emContact"/>
                                            </el-col>
                                        </el-row>
                                    </el-col>
                            </el-row>
                            </div>
                        </el-tab-pane>

                        <el-tab-pane label="合同信息" v-if="!isInsert" name="fourth">
                            <div class="line-boxs">
                                <el-button type="button" class="el-button el-button--default el-button--small" @click="handleContract">
                                    <i class="icon iconfont icon-tianjia"></i>
                                    <span>添加</span>
                                </el-button>
                                <!-- <el-button type="button" class="el-button el-button--default el-button--small" @click="editContract" :disabled="!isDisabled">
                                    <i class="icon iconfont icon-bianji"></i>
                                    <span>编辑</span>
                                </el-button> -->

                                <el-table 
                                    @selection-change="handleChangeSelect"
                                    :data="contractData"
                                    height="350px"
                                    :header-cell-style="headerStyle"
                                    style="width: 100%;margin-top:20px;">
                                    <el-table-column 
                                        type="selection" 
                                        width="60" 
                                        class-name="table-column-disabled"
                                        :selectable="table_disable"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        prop="contractName"
                                        label="合同名称">
                                    </el-table-column>
                                    <el-table-column
                                        prop="contractTypeShow"
                                        label="合同类型">
                                    </el-table-column>
                                    <el-table-column
                                        prop="contractStart"
                                        label="合同开始时间">
                                    </el-table-column>
                                    <el-table-column
                                        prop="contractEnd"
                                        label="合同结束时间">
                                    </el-table-column>
                                    <el-table-column
                                        prop="contractTimeShow"
                                        label="年限">
                                    </el-table-column>
                                    <el-table-column
                                        prop="contractStatus"
                                        label="状态">
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-tab-pane>

                        <el-tab-pane label="银行卡信息" name="fifth">
                            <div class="line-boxs">
                                <el-row :gutter="40">
                                    <el-col :span="12">
                                        <el-row :gutter="0">
                                            <el-col :span="24">
                                                <form-render :type="`select`" :field="{name:'银行',options:banks}" v-model="form.bankValue"/>
                                            </el-col> 
                                        </el-row>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-row :gutter="0">
                                            <el-col :span="24">
                                                <form-render :type="`input`" :field="{name:'银行卡号'}" v-model="form.bankAccount"/>
                                            </el-col>
                                        </el-row>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="40" v-if="!isInsert&&cardInfo[4]">
                                    <div style="margin-left:120px;">
                                        <img v-for="item in cardInfo[4].images" :key="item.cardConnect" :src="baseUrl+item.cardConnect" class="bankCard">
                                           <!-- :style="`width:${width}px;height:${height}px`" @click="ampliImg" -->
                                    </div>
                                </el-row>
                            </div>
                        </el-tab-pane>

                        <el-tab-pane label="证件管理" v-if="!isInsert" name="sixth">
                            <div class="line-boxs">
                                <el-button type="button" class="el-button el-button--default el-button--small" @click="handleCard">
                                    <i class="icon iconfont icon-tianjia"></i>
                                    <span>添加</span>
                                </el-button>
                                <el-button type="button" class="el-button el-button--default el-button--small" @click="editCard" :disabled="!Disabled">
                                    <i class="icon iconfont icon-bianji"></i>
                                    <span>编辑</span>
                                </el-button>
                                <el-button type="button" class="el-button el-button--default el-button--small" @click="deleteCard" :disabled="!disabl">
                                    <i class="icon iconfont icon-lajitong"></i>
                                    <span>删除</span>
                                </el-button>
                                <div class="flexImg mt20" style="min-height:200px;">
                                    <div v-show="item.images!=''" v-for="item in cardInfo" :key="item.cardType" >
                                        <el-checkbox-group v-model="checkList">
                                            <div class="imgInfo" style="position:relative"><span>{{item.cardName}}</span>
                                                <el-checkbox style="position:absolute;right:15px;" :label="item.cardType" v-model="checkbox" ></el-checkbox>
                                            </div>
                                            <div>
                                                <img v-for="img in item.images" :key="img.id" class="posti" :src="baseUrl+img.cardConnect" alt="">
                                            </div>
                                        </el-checkbox-group>
                                    </div>
                                </div>
                            </div>
                        </el-tab-pane>

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
                <p class="info mt60">个人信息<i @click="showPersonInfo" class="icon iconfont icon-bianji editIcon"></i></p>
                <div class="demo-drawer-profile">
                    <Row>
                        <Col span="12">
                            <span class="labelCon">姓名：</span>
                            <span class="labelCon promp">{{profileData.chineseName}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">签发机关：</span>
                            <span class="labelCon promp">{{profileData.qfjg}}</span>
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
                            <span class="labelCon">所属小组：</span> 
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
                <p class="info" v-if="profileData.contractRecords!=''">合同管理 <i  @click="showContractInfo" class="icon iconfont icon-bianji editIcon"></i></p>
                <div class="demo-drawer-profile">
                    <Row class="mb20" v-for="item in profileData.contractRecords" :key="item.id">
                        <Col span="12">
                            <span class="labelCon">合同名称：</span>
                            <span class="labelCon promp">{{item.contractName}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">合同开始：</span>
                            <span class="labelCon promp">{{item.contractStart}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">合同类型：</span>
                            <span class="labelCon promp">{{item.contractTypeShow}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">合同结束：</span>
                            <span class="labelCon promp">{{item.contractEnd}}</span>
                        </Col>
                    </Row>
                </div>
                <Divider/>
                <p class="info">银行卡信息 <i @click="showBankInfo" class="icon iconfont icon-bianji editIcon"></i></p>
                <div class="demo-drawer-profile">
                    <Row>
                        <Col span="12">
                            <span class="labelCon">银行：</span>
                            <span class="labelCon promp">{{profileData.bank}}</span>
                        </Col>
                        <Col span="12">
                            <span class="labelCon">卡号：</span>
                            <span class="labelCon promp">{{profileData.bankAccount}}</span>
                        </Col>
                    </Row>
                </div>
                <Divider v-if="profileData.cardRecords!=''" />
                <p class="info" v-if="profileData.cardRecords!=''">证件管理 <i @click="showCardInfo" class="icon iconfont icon-bianji editIcon"></i></p>
                <div class="demo-drawer-profile flexImg">
                    <div class="idCard" v-for="item in profileData.cardRecords" :key="item.id">
                        <p class="imgInfo">{{item.cardName}}</p>
                        <img class="posti" v-for="img in item.cardConnects" :key="img" :src="baseUrl+img" :data-img="img" alt="" @click="previewImg">
                    </div>
                </div>
                <Divider v-if="profileData.workRecords!=''"/>
                <p class="info" v-if="profileData.workRecords!=''">工作经历</p>
                <div class="demo-drawer-profile">
                    <Row class="mb20" v-for="item in profileData.workRecords" :key="item.id">
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
                <div class="demo-drawer-profile">
                    <Row class="mb20" v-for="item in profileData.educationRecords" :key="item.id">
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
                <div class="demo-drawer-profile">
                    <Row class="mb20" v-for="item in profileData.familyRecords" :key="item.id">
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
                <div class="demo-drawer-profile">
                    <Row class="mb20" v-for="item in profileData.dutyRecords" :key="item.id">
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
            :title="dialogContract==='inser'?'添加合同':'编辑合同'"
            :visible.sync="dialogContractFormVisible"
            class="public-dialog"
            v-el-drag-dialog
            >
            <div>
                <el-form ref="contract" :model="contract" label-width="100px" v-loading="loading2" :rules="ruleCon">
                    <div class="line-boxs">
                        <el-row :gutter="40">
                            <el-col :span="12">
                                <el-row :gutter="0">
                                    <el-col :span="24">
                                        <!-- <form-render :type="`input`" :field="{name:'合同名称'}" v-model="contract.contractName" prop="contractName"/> -->
                                        <form-render :type="`select`" :field="{name:'合同名称',options:[{
                                            value: '劳动合同',
                                            label: '劳动合同'
                                        }]}" v-model="contract.contractName" prop="contractName"/>
                                    </el-col>
                                
                                    <el-col :span="24">
                                        <form-render prop="contractType" :type="`select`" :field="{name:'合同类型',options:contrTy}" v-model="contract.contractType"/>
                                    </el-col>
                                
                                    <el-col :span="24">
                                        
                                    <form-render :type="`select`" prop="contractTime"
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
                                        }]}" v-model="contract.contractTime"/>
                                    </el-col>   
                                </el-row>
                            </el-col>
                            <el-col :span="12">
                                <el-row :gutter="0">
                                    <el-col :span="24">
                                        <form-render prop="contractStart" :type="`day`" :field="{name:'开始时间'}" v-model="contract.contractStart"/>
                                    </el-col>
                                    <el-col :span="24">
                                        <form-render prop="contractEnd" placeholder="按照年限自动计算" type="day" :disabled="true" :field="{name:'结束时间'}" v-model="contract.contractEnd"/>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </div>
                </el-form>
            </div>

            <div slot="footer" class="dialog-footer dialog-multiple-footer">
                <div></div>
                <div>
                    <el-button @click="dialogContractFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleContractFormSubmit">确 定</el-button>
                </div>
            </div>
        </el-dialog>

        <!-- 添加/编辑证件 -->
        <el-dialog
            :title="dialogCard==='inser'?'添加证件':'编辑证件'"
            :visible.sync="dialogCardFormVisible"
            class="public-dialog"
            v-el-drag-dialog
            >
            <div>
                <el-form ref="cardPerform" :model="cardPerform" label-width="100px" v-loading="loading2"  :rules="ruleImg">
                    <div class="line-boxs">
                        <el-row>
                            <el-col :span="24">
                                <form-render prop="cardType" :type="`select`" :field="{name:'证件类型',options:cardType}" v-model="cardPerform.cardType"/>
                            </el-col>
                        </el-row>
                         <el-row>
                            <el-col :span="24">
                                <form-render prop="image" :type="`imgMultiple`" :field="{name:'图片'}" :data="{'upload_msg':'employee_card'}" v-model="cardPerform.image"/>
                            </el-col>
                        </el-row>
                    </div>
                </el-form>
            </div>

            <div slot="footer" class="dialog-footer dialog-multiple-footer">
                <div></div>
                <div>
                    <el-button @click="dialogCardFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleCardFormSubmit">确 定</el-button>
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
        >   
        
            <div style="padding-left:10px">
              
                    <DateLapRange v-model="table_form.dateLap" @change="fetchTableData"/>

            <!-- <dateLap v-model="table_form.dateLap" @change="fetchTableData"/> -->
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
            @cell-click="openDrawer"
            :cell-style="cellStyle"
            >
            <el-table-column 
                type="selection" 
                width="60" 
                class-name="table-column-disabled"
                :selectable="table_disable_selected"
                fixed
            >
            </el-table-column>
            <el-table-column type="index" :index="indexMethod" fixed/>
            <el-table-column prop="employeeCode" sortable label="工号" fixed/>
            <el-table-column prop="chineseName" label="姓名" fixed>
                <template slot-scope="scope">
                    <div v-html="scope.row.chineseName"></div>
                </template>
            </el-table-column>
            <each-table-column :table_field="table_field.filter(o=>!['employeeCode','chineseName'].includes(o.name))"/>
                <!-- <each-table-column :table_field="table_field"/> -->
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
const api_resource = api_common.resource("hrm/v2/staff");
import Device from '@/utils/zk_sdk/baseISSOnline.js'
import { constants } from 'crypto';
import dayjs from 'dayjs'
let baseUrl = process.env.VUE_APP_STATIC
export default {
    mixins: [table_mixin],
    props:['orgid'],
    data() {
        const defaultForm  = function(){
            return {
                trialTime:1,
                contractTime:2,
                checkWorkType:0,
                fileType:400,
                liveDormitory:1,
                workNature:1,
                subCompany:'',
                department:'',
                team:'',
                workGroup:'',
                onDutyTime:dayjs().format('YYYY-MM-DD'),
                bankValue:1
            }
        }
        return {
            baseUrl,
            width:'40%',
            height:200,
            openDrawers: false,
            loading: true,
            loading2:false,
            form:{},
            defaultForm,
            api_resource,
            orgCategory:[],
            queryDialogFormVisible:true,
            table_topHeight:296,
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
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                birthday:[
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                stayBegin:[
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                stayEnd:[
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                qfjg:[
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                contactAddr:[
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                sex:[
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                department:[
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                principalship:[
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                teamID:[
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                workGroup:[
                    { required: true, message: '请选择', trigger: 'change' },
                ],
            },
            ruleCon:{
                contractStart:[
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                contractName:[
                    { required: true, message: '请选择', trigger: 'change blur' },
                ],
                contractType:[
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                contractTime:[
                    { required: true, message: '请选择', trigger: 'change' },
                ],
            },
            ruleImg:{
                image:[
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                cardType:[
                    { required: true, message: '请输入', trigger: 'blur' },
                ]
            },
            staffId:'',
            paydataForm:{},
            connect:{},
            profileData:{},
            dialogContractFormVisible:false,
            dialogCardFormVisible:false,
            contract:{},
            maskBtn:false,	
            bigImg:'',
            contractData:[],
            contrTy:[],
            selections:[],
            dialogContract:'inser',
            dialogCard:'inser',
            teamData:{},
            cardInfo:[],
            cardPerform:{
                image:[]
            },
            banks:[],
            bank:{},
            cardType:[],
            checkList:[],
            checkbox:'',
            activeName:'first',
            alledulevels:[],
            Aledulevels:[]
            // pickerOptions1: {:picker-options="pickerOptions1"
            //     disabledDate(time) {
            //         return time.getTime() > Date.now();
            //     },
            // },
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
    computed: {
        isDisabled() {
            let len = this.selections.length;
            if(len!==1){
                return false
            }
            return true
        },
        Disabled() {
            let len = this.checkList.length;
            if(len!==1){
                return false
            }
            return true
        },
        disabl() {
            let len = this.checkList.length;
            if(len>0){
                return true
            }
            return false
        }
    },
    methods: {
        ampliImg(e){
            let height = e.target.height;
            let width = e.target.width;
            // console.log(width,'width')
            // console.log(height,'height')
            if(width>=770||height>400){
                return
            }
            this.$set(e.target,'height',height*2)
            this.$set(e.target,'width',width*2)
            this.width = width*2
            this.height = height*2
            // let imgapli = e.cardConnect;

        },
        contract_validate(){
            return new Promise((resolve,reject)=>{
                this.$refs.contract.validate((valid) => {
                if(valid){
                    resolve()
                }else{
                    reject()
                    return false
                }
                })
            })
        },
        table_disable(row){
            return !row.lockstate
        },
        handleChangeSelect(val) {
            this.selections = val
        },
        handleCard(){
            this.cardPerform = {
                image:[]
            }
            this.dialogCard = "inser"
            this.getCardInfo()
            this.dialogCardFormVisible = true
        },
        async editCard(){
            this.dialogCard = 'inse'
            this.getCardInfo()
            this.dialogCardFormVisible = true
            let row = this.checkList[0];
            this.cardPerform = await api_common.resource("hrm/staff/typecard").get({emID:this.staffId,cardType:row});
            this.checkList = []
        },
        async deleteCard(){
            let rows = this.checkList.map(row=>row)
            await this.$request.delete('/hrm/staff/card/bluk?emID='+this.staffId+'&types='+rows.join(','))
            this.cardInfo = await api_common.resource("hrm/staff/card").get({emID:this.staffId});
            this.checkList = []
        },
        async handleCardFormSubmit(){
            // await this.form_validate()
            this.cardPerform.emID = this.form.id;
            let cardPerform = Object.assign({},this.cardPerform)
            await this.$request.post('/hrm/staff/card',this.cardPerform)
            this.dialogCardFormVisible = false
            this.cardInfo = await api_common.resource("hrm/staff/card").get({emID:this.staffId});
        },
        
        //获取证件类型
        async getCardInfo(){
            this.cardType = (await api_common.resource('basicdata/cardtypes').get()).map(o=>{return {label:o.name,value:o.id}})
        },
        handleContract(){
            this.contract = {
                contractName: '劳动合同'
            }
            this.dialogContract = "inser"
            this.fetchContract()
            this.dialogContractFormVisible = true
        },
        async editContract(){
            this.dialogContract = 'inse'
            this.fetchContract()
            let row = this.selections[0];
            this.contract = await this.$request.get('/hrm/staff/contract/'+row.id)
            this.dialogContractFormVisible = true
        },
        async handleContractFormSubmit(){
            await this.contract_validate()
            this.contract.emID = this.staffId;
            let contract = Object.assign({},this.contract)
            let row = this.selections[0];
            if(this.dialogContract=="inser"){
                await this.$request.post('/hrm/staff/contract',this.contract)
            }else{
                await this.$request.put('/hrm/staff/contract/'+row.id,this.contract)
            }
            this.dialogContractFormVisible = false
            this.contractData = await api_common.resource("hrm/staff/contract").get({emID:this.staffId});
        },
        headerStyle(row,rowIndex,column,columnIndex){
            return "background:rgba(245,250,251,1);box-shadow:0px 1px 0px rgba(228,234,236,1);"
        },
        previewImg(e){//图片预览功能
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
            this.form = await api_common.resource('hrm/staff').find(this.staffId)
            this.dialogFormVisible = true
            this.getSelectOption()
            this.alledulevels = (await api_common.resource('basicdata/alledulevels').get()).map(o=>{return {label:o.name,value:o.id}})
            this.width = 250
            this.height = 200
        },
        showPersonInfo(){
            this.dialogStatus = 'inserts';
            this.activeName = "first"
            this.getDialog()
        },
        showEntryInfo(){
            this.dialogStatus = 'inserts';
            this.activeName = "second"
            this.getDialog()
        },
        showContactInfo(){
            this.dialogStatus = 'inserts';
            this.activeName = "third"
            this.getDialog()
        },
        showContractInfo(){
            this.dialogStatus = 'inserts';
            this.activeName = "fourth"
            this.getDialog()
        },
        showBankInfo(){
            this.dialogStatus = 'inserts';
            this.activeName = "fifth"
            this.getDialog()
        },
        showCardInfo(){
            this.dialogStatus = 'inserts';
            this.activeName = "sixth"
            this.getDialog()
        },
        cellStyle({row, column, rowIndex, columnIndex}){
            if(column.label == '工号'){
                return 'color:#0BB2D4;cursor:pointer'
            }else{
                return  ''
            }
        },
        async openDrawer(row,column,cell,event){
            this.staffId = row.id;
            if(row.employeeCode==event.target.innerText){
                this.openDrawers = true
                this.fetchProfileData()
                this.connect = await api_common.resource('hrm/staff/contact').find(row.id)
                this.contractData = await api_common.resource("hrm/staff/contract").get({emID:this.staffId});
                this.cardInfo = await api_common.resource("hrm/staff/card").get({emID:this.staffId});
            }
        },
        async tabClick(v){
            this.tab_label  = v.label
 
            // console.log(v,'v')
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
            this.activeName = 'first'
            this.$nextTick(()=>{
                this.$refs['form'].clearValidate()
            })
            this.form = this.defaultForm()
            this.dialogFormVisible = true
            this.getSelectOption()
            this.Aledulevels = (await api_common.resource('basicdata/edulevels').get()).map(o=>{return {label:o.name,value:o.id}})
        },
        async getSelectOption(){
            this.nationData = (await api_common.resource('basicdata/nations').get()).map(o=>{return {label:o.name,value:o.id}})
            this.workGroupData = (await api_common.resource('officeaddress').get()).map(o=>{return {label:o.officeaddressname,value:o.id}})
            this.teamidData = (await api_common.resource('hrm/teamid').get()).map(o=>{return {label:o.name,value:o.id}})
            this.jobtitlesData =  (await api_common.resource('basicdata/jobtitles').get()).map(o=>{return {label:o.name,value:o.id}})
            this.cardType = (await api_common.resource('basicdata/cardtypes').get()).map(o=>{return {label:o.name,value:o.id}})
            this.banks = (await api_common.resource('basicdata/banks').get()).map(o=>{return {label:o.name,value:o.id}})
        },
        async edit(){
            this.width = 250
            this.height = 200
            this.activeName = 'first'
            this.form = this.defaultForm()
            // this.$nextTick(()=>{
            //     this.$refs['form'].clearValidate()
            // })
            let row = this.table_selectedRows[0];
            this.staffId = row.id;
            
            // this.form = await api_resource.find(row.id);
            this.form = await api_common.resource('hrm/staff').find(row.id)

            this.dialogFormVisible = true
            this.getSelectOption()
            this.contractData = await api_common.resource("hrm/staff/contract").get({emID:this.staffId});
            this.cardInfo = await api_common.resource("hrm/staff/card").get({emID:this.staffId});
            this.connect = await api_common.resource('hrm/staff/contact').find(this.form.id)
            this.alledulevels = (await api_common.resource('basicdata/alledulevels').get()).map(o=>{return {label:o.name,value:o.id}})
        },
        async fetchDepartment(){
            this.departmentData = await api_common.resource('org/branchdepartment').get({id:this.form.subCompany})
        },
        async fetchContract(){
            this.contrTy = (await api_common.resource('basicdata/contracttypes').get()).map(o=>{return {label:o.name,value:o.id}})
        },
        async handleFormSubmit(){
            await this.form_validate()
            let form = Object.assign({},this.form)
            if(this.isInsert){
                await api_common.resource('hrm/staff').create(form)
                // await api_resource.create(form)
            }else{
                if(this.tab_label ==='联系方式'){
                    await api_common.resource('hrm/staff/contact').update(form.id,this.connect)
                }else{
                    await api_common.resource('hrm/staff').update(form.id,form)
                    // await api_resource.update(form.id,form)
                }
                this.fetchProfileData()
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
            if(!this.orgid){
                return
            }
            this.table_loading = true;
            this.table_form.orgid = this.orgid
            // const {rows , total }= await api_resource.get(this.table_form);
            const {rows , total }= await this.$request.get('/hrm/v2/staff',{params:this.table_form})
            this.table_data  = rows
            this.table_form.total = total
            setTimeout(() => {
                this.table_loading = false;
            }, 300);
        },
        async fetchProfileData() {
           this.profileData =await this.$request.get('hrm/detailmsg/'+this.staffId)
        },
    },
    async created() {
        const { field, action,table } = await api_common.menuInit("hrm/staff");
        this.table_field = field;
        this.table_actions = action;
        this.table_config = table
        this.fetchTableData();
        this.$set(this.table_form,'dateLap','')
 
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
