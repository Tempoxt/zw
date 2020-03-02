<template>
    <div id="backgroundCheck">
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

            <!-- 人员档案的信息预览 -->
            <div>
                <Drawer title="员工档案详情" :closable="false" width="640" v-model="openDrawers" class="drawerInfo" v-if="profileData.main">
                    <p class="info">基本信息</p>
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
                                <span class="labelCon">年龄：</span>
                                <span class="labelCon promp">{{profileData.main.age}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">出生年月：</span>
                                <span class="labelCon promp">{{profileData.main.birthday}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">申请职位：</span>
                                <span class="labelCon promp">{{profileData.main.job}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">要求工资：</span>
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
                            <el-col :span="24">
                                <span class="labelCon">职业病、遗传或慢性病史：</span>
                                <span class="labelCon promp">{{profileData.main.medicalHistory}}</span>
                            </el-col>
                            <el-col :span="24">
                                <span class="labelCon">户口所在地：</span>
                                <span class="labelCon promp">{{profileData.main.hometown}}</span>
                            </el-col>
                        </el-row>
                    </div>
                    <p class="info">应聘途径</p>
                    <div class="drawer-profile">
                        <el-row>
                            <el-col :span="12">
                                <span class="labelCon">网络/网站名：</span>
                                <span class="labelCon promp">{{profileData.main.applyOption}}</span>
                            </el-col>
                        </el-row>
                    </div>
                    <p class="info" v-if="profileData.main.Family!=''&&profileData.main.Family!=null">家庭成员</p>
                    <div class="drawer-profile">
                        <el-row class="mb20" v-for="item in profileData.main.Family" :key="item.id">
                            <el-col :span="12">
                                <span class="labelCon">姓名：</span>
                                <span class="labelCon promp">{{item.name}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">联系方式：</span>
                                <span class="labelCon promp">{{item.contactDetail}}</span>
                            </el-col>
                             <el-col :span="12">
                                <span class="labelCon">年龄：</span>
                                <span class="labelCon promp">{{item.age}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">与本人关系：</span>
                                <span class="labelCon promp">{{item.relation}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">住址或工作单位：</span>
                                <span class="labelCon promp">{{item.address}}</span>
                            </el-col>
                        </el-row>
                    </div>
                    <p class="info" v-if="profileData.main.Company!=''&&profileData.main.Company!=null">内部亲属关系调查</p>
                    <div class="drawer-profile">
                        <el-row class="mb20" v-for="item in profileData.main.Company" :key="item.id">
                            <el-col :span="12">
                                <span class="labelCon">与本人关系：</span>
                                <span class="labelCon promp">{{item.relation}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">部门：</span>
                                <span class="labelCon promp">{{item.department}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">姓名及工号：</span>
                                <span class="labelCon promp">{{item.name}}/{{item.workcode}}</span>
                            </el-col>
                            <el-col :span="12">
                                <span class="labelCon">职位：</span>
                                <span class="labelCon promp">{{item.job}}</span>
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
		        :cell-style="cellStyle"
		        @cell-click="openDrawer"
                >
                <el-table-column 
                    type="selection" 
                    width="60" 
                    class-name="table-column-disabled"
                    :selectable="table_disable_selected"
                    >
                </el-table-column>
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
        
    </div>
</template>

<script>
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";
import dayjs from 'dayjs'

export default {
    mixins: [table_mixin],
    name: 'applyResume',
    props:['flag'],
    data() {
        return {
            table_loading: false,
            api_resource: api_common.resource("hrm/applyResume"),
            table_topHeight: 300,
            dialogFormVisible: false,
            form: {},
			rules:{
				audit:[
					{ required: true, message: '请选择', trigger:  ['blur', 'change'] },
				],
            },
            jobTypes: [
                {
                    value: '0',
                    label: '员工'
                }, {
                    value: '1',
                    label: '职员'
                },
            ],
            profileData: {},
            openDrawers: false,
            template:{
                
            }
        }
    },
    watch:{
        flag(){
			this.table_form.query.query = []
			this.table_form.currentpage = 1
            this.fetchMenu()
            this.fetchTableData()
        }
    },
    computed: {
        disabled(){
			if(this.form.audit!==''){
				if(this.form.audit==1){
					return false
				}else if(this.form.audit==2){
					if(this.form.remark&&this.form.remark!==''){
						return false
					}else{
						return true
					}
				}
			}
			return true
		}
    },
    methods: {
        fetch(){
            this.table_form.currentpage = 1
            this.fetchTableData()
        },
        cellStyle({row, column, rowIndex, columnIndex}){
            if(column.label == '姓名'){
                return 'color:#0BB2D4;cursor:pointer'
            }else{
                return  ''
            }
        },
        async openDrawer(row,column,cell,event){
            if(row.name==event.target.innerText){
                this.openDrawers = true
                this.profileData = await api_common.resource('hrm/applyResume').find(row.id)
            }
        },
        audit(){
            this.dialogFormVisible = true
            this.form = {}
        },
        async handleFormSubmit(){
            let ids = this.table_selectedRows.map(o=>o.id)//hrm/applyResume/id
            this.form.ids = ids.join(',')
            await this.$request.put('hrm/applyResume/audit',this.form)
            this.dialogFormVisible = false
            this.fetchTableData()
        },
        async fetchTableData() {
			this.table_loading = true;
            this.table_form.flag = this.flag
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
    .drawerInfo{
        .ivu-drawer-body{
            padding:0;
        }
        .ivu-drawer-header{
            background: rgba(245,250,251,1)
        }
        .line-boxs{
            margin-top: 20px;
        }
        .info{
            color: #0BB2D4;
            font-size: 14px;
            font-weight: bold;
            margin: 10px 0 10px 10px;
            background: #F5F5F5;
            padding: 8px 20px
        }
        .labelCon{
            display: inline-block;
            width: 112px;
            text-align: right;
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
    }
    .drawer-profile .el-col-12,.el-col-24{
        margin-bottom: 10px;
    }
    .mb20{margin-bottom: 20px;}
</style>