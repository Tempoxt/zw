  <template>
  <ui-table ref="table" 
    :table_column="table_field" 
    :table_query.sync="table_form.query"
    @query="querySubmit"
    > 
         

    <!-- 人员档案的信息预览 -->
    <div>
        <Drawer title="员工档案详情" :closable="false" width="640" v-model="openDrawers" class="drawerInfo">
            <p class="info">个人信息</p>
            <div class="drawer-profile">
                <el-row>
                    <el-col :span="12">
                        <span class="labelCon">姓名：</span>
                        <span class="labelCon promp">{{profileData.chineseName}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">签发机关：</span>
                        <span class="labelCon promp">{{profileData.qfjg}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">身份证号：</span>
                        <span class="labelCon promp">{{profileData.idCard}}</span>
                    </el-col>
                    <el-col :span="12" class="alignStart">
                        <span class="labelCon">住址：</span>
                        <span class="labelCon promp addr">{{profileData.contactAddr}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">民族：</span>
                        <span class="labelCon promp">{{profileData.nationShow}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">性别：</span>
                        <span class="labelCon promp">{{profileData.sexShow}}</span>
                    </el-col>
                    <el-col :span="12">
                    <span class="labelCon">籍贯：</span> 
                        <span class="labelCon promp">{{profileData.provinseShow}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">出生年月：</span>
                        <span class="labelCon promp">{{profileData.birthday}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">证件生效：</span>
                        <span class="labelCon promp">{{profileData.stayBegin}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">证件失效：</span>
                        <span class="labelCon promp">{{profileData.stayEnd}}</span>
                    </el-col>
                </el-row>
            </div>
            <Divider />
            <p class="info">入职信息</p>
            <div class="drawer-profile">
                <el-row>
                    <el-col :span="12">
                        <span class="labelCon">员工工号：</span>
                        <span class="labelCon promp">{{profileData.employeeCode}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">入职日期：</span>
                        <span class="labelCon promp">{{profileData.onDutyTime}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">所属主体：</span>
                        <span class="labelCon promp">{{profileData.socialSecurityMain}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">试用期限：</span>
                        <span class="labelCon promp">{{profileData.trialTimeShow}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">所属部门：</span>
                        <span class="labelCon promp">{{profileData.department__name}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">合同年限：</span>
                        <span class="labelCon promp">{{profileData.contractTimeShow}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">所属小组：</span> 
                        <span class="labelCon promp">{{profileData.team__name}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">考勤方案：</span>
                        <span class="labelCon promp">{{profileData.checkWorkTypeShow}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">所任职务：</span>
                        <span class="labelCon promp">{{profileData.principalship__name}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">介绍人：</span>
                        <span class="labelCon promp">{{profileData.introducer}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">智能班组：</span>
                        <span class="labelCon promp">{{profileData.teamIDShow}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">工作状态：</span>
                        <span class="labelCon promp">{{profileData.fileTypeShow}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">工作地点：</span>
                        <span class="labelCon promp">{{profileData.workGroup__name}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">宿舍分配：</span>
                        <span class="labelCon promp">{{profileData.liveDormitoryShow}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">工作性质：</span>
                        <span class="labelCon promp">{{profileData.workNatureShow}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">现住地址：</span>
                        <span class="labelCon promp">{{profileData.nowAddress}}</span>
                    </el-col>
                </el-row>
            </div>
            <Divider />
            <p class="info">联系方式</p>
            <div class="drawer-profile">
                <el-row>
                    <el-col :span="12">
                        <span class="labelCon">电话：</span>
                        <span class="labelCon promp">{{profileData.contactPhone}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">短号：</span>
                        <span class="labelCon promp">{{profileData.shortPhoneNum}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">内部邮箱：</span>
                        <span class="labelCon promp">{{profileData.insideEmail}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">外部邮箱：</span>
                        <span class="labelCon promp">{{profileData.outsideEmail}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">紧急联系人：</span>
                        <span class="labelCon promp">{{profileData.emContactor}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">紧急联系人电话：</span>
                        <span class="labelCon promp">{{profileData.emContact}}</span>
                    </el-col>
                </el-row>
            </div>
            <Divider v-if="profileData.contractRecords!=''"/>
            <p class="info" v-if="profileData.contractRecords!=''">合同管理</p>
            <div class="drawer-profile">
                <el-row class="mb20" v-for="item in profileData.contractRecords" :key="item.id">
                    <el-col :span="12">
                        <span class="labelCon">合同名称：</span>
                        <span class="labelCon promp">{{item.contractName}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">合同开始：</span>
                        <span class="labelCon promp">{{item.contractStart}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">合同类型：</span>
                        <span class="labelCon promp">{{item.contractTypeShow}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">合同结束：</span>
                        <span class="labelCon promp">{{item.contractEnd}}</span>
                    </el-col>
                </el-row>
            </div>
            <Divider v-if="profileData.cardRecords!=''" />
            <p class="info" v-if="profileData.cardRecords!=''">证件管理</p>
            <div class="drawer-profile flexImg">
                <div class="idCard" v-for="item in profileData.cardRecords" :key="item.id">
                    <p class="imgInfo">{{item.cardName}}</p>
                    <img class="posti" v-for="img in item.cardConnects" :key="img" :src="baseUrl+img" :data-img="img" alt="" @click="previewImg(img)">
                </div>
            </div>
            <Divider v-if="profileData.workRecords!=''"/>
            <p class="info" v-if="profileData.workRecords!=''">工作经历</p>
            <div class="drawer-profile">
                <el-row class="mb20" v-for="item in profileData.workRecords" :key="item.id">
                    <el-col :span="12">
                        <span class="labelCon">工作单位：</span>
                        <span class="labelCon promp">{{item.workCompany}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">起止时间：</span>
                        <span class="labelCon promp">{{item.startEndTimeShow}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">工作部门：</span>
                        <span class="labelCon promp">{{item.workDepartment}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">证明人：</span>
                        <span class="labelCon promp">{{item.witness}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">工作职务：</span>
                        <span class="labelCon promp">{{item.workJob}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">证明人电话：</span>
                        <span class="labelCon promp">{{item.witnessPhone}}</span>
                    </el-col>
                </el-row>
            </div>
            <Divider v-if="profileData.educationRecords!=''" />
            <p class="info" v-if="profileData.educationRecords!=''">教育经历</p>
            <div class="drawer-profile">
                <el-row class="mb20" v-for="item in profileData.educationRecords" :key="item.id">
                    <el-col :span="12">
                        <span class="labelCon">学校：</span>
                        <span class="labelCon promp">{{item.enduExp}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">起止时间：</span>
                        <span class="labelCon promp">{{item.startEndTimeShow}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">所学专业：</span>
                        <span class="labelCon promp">{{item.major}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">证书名称：</span>
                        <span class="labelCon promp">{{item.enduCardName}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">教育阶段：</span>
                        <span class="labelCon promp">{{item.enduPeriod}}</span>
                    </el-col>
                </el-row>
            </div>
            <Divider v-if="profileData.familyRecords!=''"/>
            <p class="info" v-if="profileData.familyRecords!=''">家庭成员</p>
            <div class="drawer-profile">
                <el-row class="mb20" v-for="item in profileData.familyRecords" :key="item.id">
                    <el-col :span="12">
                        <span class="labelCon">姓名：</span>
                        <span class="labelCon promp">{{item.familyMemberName}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">联系电话：</span>
                        <span class="labelCon promp">{{item.familyContact}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">关系：</span>
                        <span class="labelCon promp">{{item.relationship}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">联系地址：</span>
                        <span class="labelCon promp">{{item.familyAddress}}</span>
                    </el-col>
                </el-row>
            </div>
            <Divider v-if="profileData.dutyRecords!=''" />
            <p class="info" v-if="profileData.dutyRecords!=''">入职记录</p>
            <div class="drawer-profile">
                <el-row class="mb20" v-for="item in profileData.dutyRecords" :key="item.id">
                    <el-col :span="12">
                        <span class="labelCon">入职日期：</span>
                        <span class="labelCon promp">{{item.onDutyTime}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">离职日期：</span>
                        <span class="labelCon promp">{{item.outDutyTime}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">状态：</span>
                        <span class="labelCon promp">{{item.dutyStatus}}</span>
                    </el-col>
                    <el-col :span="12">
                        <span class="labelCon">原因：</span>
                        <span class="labelCon promp">{{item.outDutyReason}}</span>
                    </el-col>
                </el-row>
            </div>
        </Drawer>
    </div>

     <el-dialog
      :visible.sync="dialogForm3Visible"
      class="public-dialog preview"
      v-el-drag-dialog
      @close="closeBigImg"
      >
        <el-carousel trigger="click" :autoplay="false" :initial-index="index">
            <el-carousel-item v-for="item in list" :key="item">
               <img style="width:100%;height:100%" :src="baseUrl+item">
               <!-- <img style="width:100%;height:100%" src="http://e.hiphotos.baidu.com/image/pic/item/359b033b5bb5c9eac1754f45df39b6003bf3b396.jpg"> -->
            </el-carousel-item>
        </el-carousel>
    </el-dialog>

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
    >
        <el-table-column 
            type="selection" 
            width="60" 
            class-name="table-column-disabled"
            :selectable="table_disable_selected"
            >
        </el-table-column>
        <el-table-column type="index" :index="indexMethod" fixed/>
        <el-table-column prop="employeeCode" sortable label="工号" fixed/>
        <el-table-column prop="chineseName" label="姓名" fixed/>
        <each-table-column :table_field="table_field.filter(o=>!['employeeCode','chineseName'].includes(o.name))"/>
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
const api_resource = api_common.resource("hrm/v2/quitstaff");
import dayjs from 'dayjs'
let baseUrl = process.env.VUE_APP_STATIC
export default {
  mixins: [table_mixin],
  props:['orgid'],
  data() {
    return {
      loading: true,
      baseUrl,
      form:{},
      api_resource,
      orgCategory:[],
      queryDialogFormVisible:true,
      table_topHeight:296,
      profileData:{},
      openDrawers: false,
      dialogForm3Visible:false,
      list:[],
      index:null,
    };
  },
  watch:{
    orgid(){
      this.table_form.currentpage = 1
      this.fetchTableData()
    }
  },
  methods: {
    async fetchTableData() {
      if(!this.orgid){
        return
      }
      this.table_loading = true;
      this.table_form.orgid = this.orgid
      const {rows , total }= await api_resource.get(this.table_form);
      this.table_data  = rows
      this.table_form.total = total
      setTimeout(() => {
        this.table_loading = false;
      }, 300);
    },
    async openDrawer(row,column,cell,event){
      this.staffId = row.id;
      if(row.employeeCode==event.target.innerHTML){
        this.openDrawers = true
        this.fetchProfileData()
      }
    },
    previewImg(img){//图片预览功能
        let allImgs = this.profileData.cardRecords.map(o=>o.cardConnects)
        this.list = allImgs.flat()
        this.index = this.list.indexOf(img)
        this.dialogForm3Visible = true
    },
    closeBigImg() { //关闭图片预览
        this.dialogForm3Visible = false;
        this.index = ""
        this.list = []
    },
    cellStyle({row, column, rowIndex, columnIndex}){
      if(column.label == '工号'){
        return 'color:#0BB2D4;cursor:pointer'
      }else{
        return  ''
      }
    },
    async fetchProfileData() {
      this.profileData =await this.$request.get('hrm/detailmsg/'+this.staffId)
      // this.profileData =await this.$request.get('hrm/detailmsg/16036')
    },
    async remoteMethod(query){
      if (query !== '') {
        this.introducerData = await api_common.resource('hrm/v2/quitstaff').get({
          keyword:query,
          pagesize:10
        })
      } 
    },
  },
  async created() {
    const { field, action,table } = await api_common.menuInit("hrm/quitstaff");
    this.$set(this.table_form,'dateLap','')
    this.table_field = field;
    this.table_actions = action;
    this.table_config = table
    this.fetchTableData();
  }
};
</script>