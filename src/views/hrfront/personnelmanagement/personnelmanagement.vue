  <template>
  <ui-table ref="table" 
  :table_column="table_field" 
  :table_query.sync="table_form.query"
  @query="querySubmit"
  
  >


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
                


                <el-tab-pane label="薪资信息" v-if="!isInsert">
                  <div class="line-box">
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-row :gutter="20">
                                 <el-col :span="24">
                                     <form-render
                                        :type="`select`"
                                        :field="{name:'工资级别',options:wageTypeData}"
                                        v-model="paydataForm.wageType"
                                    /> 
                                 </el-col>
                                  <el-col :span="24">
                                     <form-render
                                        :type="`select`"
                                        :field="{name:'工资级别',options:wageGradeData}"
                                        v-model="paydataForm.wageGrade"
                                    /> 
                                 </el-col>
                              <el-col :span="24">
                                    <form-render :type="`input`" :field="{name:'基本工资'}" v-model="paydataForm.bondedMoney" />
                              </el-col>
                               <el-col :span="24">
                                    <form-render :type="`input`" :field="{name:'加班津贴'}" v-model="paydataForm.overtimePay" />
                              </el-col>
                              <el-col :span="24">
                                    <form-render :type="`input`" :field="{name:'休息日加班'}" v-model="paydataForm.weekendPay" />
                              </el-col>
                              <el-col :span="24">
                                    <form-render :type="`input`" :field="{name:'生活补助'}" v-model="paydataForm.livingPay" />
                              </el-col>
                                <el-col :span="24">
                                    <form-render :type="`input`" :field="{name:'基础奖金'}" v-model="paydataForm.baseReward" />
                              </el-col>
                             
                             <el-col :span="24">
                                    <form-render :type="`input`" :field="{name:'考核基数'}" v-model="paydataForm.assessmentBase" />
                              </el-col>
                              <el-col :span="24">
                                    <form-render :type="`input`" :field="{name:'全勤奖'}" v-model="paydataForm.totalWorkPay" />
                              </el-col>
                            </el-row>
                        </el-col>
                         <el-col :span="12">
                              <el-row :gutter="20">
                                <el-col :span="24">
                                    <form-render :type="`input`" :field="{name:'银行卡号'}" v-model="paydataForm.bankAccount" />
                                </el-col>
                                 <el-col :span="24">
                                    <form-render :type="`input`" :field="{name:'开户银行'}" v-model="paydataForm.bank" />
                                </el-col>
                                 <el-col :span="24">
                                    <form-render :type="`input`" :field="{name:'社保卡号'}" v-model="paydataForm.socialSecurityNum" />
                                </el-col>
                                 <el-col :span="24">
                                  
                                     <form-render
                                        :type="`select`"
                                        :field="{name:'社保类型',options:socialSecuritiesData}"
                                        v-model="paydataForm.socialSecurities"
                                    /> 
                                  
                                </el-col>
                                 <el-col :span="24">
                                    <form-render :type="`input`" :field="{name:'社保缴费'}" v-model="paydataForm.socialSecurityPay" />
                                </el-col>
                                <el-col :span="24">
                                    <form-render :type="`input`" :field="{name:'公积金卡号'}" v-model="paydataForm.proFundNum" />
                                </el-col>
                                 <el-col :span="24">
                                    <form-render :type="`input`" :field="{name:'公积金缴费'}" v-model="paydataForm.proFundMoney" />
                                </el-col>

                                <el-col :span="24">
                                    <form-render
                                        :type="`radio`"
                                        :field="{name:'记录状态',options:[{
                                        value: 1,
                                        label: '启用'
                                        },{
                                        value: 0,
                                        label: '停用'
                                        }]}"
                                        v-model="paydataForm.estate"
                                    />
                                </el-col>
                    
                            </el-row>
                        </el-col>
                      </el-row>
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
    >
     <el-table-column 
      type="selection" 
      width="60" 
      class-name="table-column-disabled"
      :selectable="table_disable_selected"
      >
      </el-table-column>
    <el-table-column type="index" :index="indexMethod" />
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
      paydataForm:{},
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
     async tabClick(v){
          this.tab_label  = v.label
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
        

         let row = this.table_selectedRows[0]
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
     this.table_loading = true;
     this.table_form.orgid = this.orgid
     const {rows , total }= await api_resource.get(this.table_form);
      this.table_data  = rows
       this.table_form.total = total
      setTimeout(() => {
        this.table_loading = false;
      }, 300);
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


