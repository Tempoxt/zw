  <template>
  <ui-table ref="table" 
    :table_column="table_field" 
    :table_query.sync="table_form.query"
    @query="querySubmit"
    >

    <!-- 人员档案的信息预览 -->
    <div>
        <Drawer :closable="false" width="640" v-model="openDrawers">
            <p class="detail">员工档案详情</p>
            <p class="info">个人信息</p>
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
            <p class="info">入职信息</p>
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
                        <span class="labelCon promp">{{profileData.subCompanyShow}}</span>
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
            <p class="info">联系方式</p>
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
            <p class="info" v-if="profileData.contractRecords!=''">合同管理</p>
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
const api_resource = api_common.resource("hrm/quitstaff");
export default {
  mixins: [table_mixin],
  props:['orgid'],
  data() {
    return {
      loading: true,
      form:{},
      api_resource,
      orgCategory:[],
      queryDialogFormVisible:true,
      table_height:window.innerHeight-296,
      profileData:{},
      openDrawers: false,
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
        this.introducerData = await api_common.resource('hrm/quitstaff').get({
          keyword:query,
          pagesize:10
        })
      } 
    },
  },
  async created() {
    const { field, action,table } = await api_common.menuInit("hrm/quitstaff");
    this.table_field = field;
    this.table_actions = action;
    this.table_config = table
    this.fetchTableData();
  }
};
</script>