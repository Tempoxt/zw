<template>
    <ui-table 
        ref="table" 
        :table_query.sync="table_form.query"
        :table_column="table_field" 
        @query="querySubmit"
    >
         <!-- 人员档案的信息预览 -->
        <div>
            <Drawer title="劳动合同书" :closable="false" width="640" v-model="openDrawers" class="drawerInfo">
                <div class="labor-contract">
                    <h3>劳动合同书</h3>
                    <div class="content">
                        <p>甲方（用人单位） <u>{{contractInfo.company}}</u>，地址： <u>{{contractInfo.city}}</u> </p>
                        <p>乙方（员工）姓名和身份证号码：<u>{{contractInfo.chineseName}} {{contractInfo.idCard}}</u>  &nbsp;&nbsp;联系地址：<u> {{contractInfo.contactAddr}}</u>，  &nbsp;&nbsp;
                            联系方式：电话<u>{{contractInfo.ContactType__contactPhone}}</u> &nbsp;&nbsp; email/QQ号：<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u></p>
                        <p>
                            &nbsp;&nbsp;&nbsp;&nbsp;（双方在此所填写的地址即为送达地址，任何有关劳动人事关系的信息以短信、邮寄或电子邮件方式寄出、发出五个工作日后视为送达。）<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;根据《中华人民共和国劳动法》（以下简称“《劳动法》”）、《中华人民共和国劳动合同法》（以下简称“《劳动合同法》”）等有关法律法规的规定，甲乙双方按照平等自愿、诚信守法、
                            协商一致的原则，签订本合同，共同遵守本合同所列条款：<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;<b>一、合同期限</b><br>
                            &nbsp;&nbsp;&nbsp;&nbsp;（一）、合同期限<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;本合同期限为有固定期限，从<u>{{startDay[0]}}</u>年 <u>{{startDay[1]}}</u>月 <u>{{startDay[2]}}</u>日 起
                            至 <u>{{endDay[0]}}</u>年 <u>{{endDay[1]}}</u>月 <u>{{endDay[2]}}</u>日 止。<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;（二）、试用期限<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;试用期为 <u>{{contractInfo.trialTime}}</u>（试用期包括在合同期内，如无试用期，则填写“无”）。<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;<b>二、工作内容</b> <br>
                            &nbsp;&nbsp;&nbsp;&nbsp;（一）、乙方的工作岗位（工种或职务）为：<u>{{contractInfo.principalship__name}}</u>，乙方同意并服从甲方根据工作需要对乙方的工作岗位作出的安排和调整。<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;（二）、乙方的工作地点为： <u>{{contractInfo.workGroup__officeaddressname}}</u> ，乙方同意并服从甲方根据工作需要，在确保工资收入相同的情况下在深圳市内对乙方的工作地点作出安排和调整。<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;（三）、乙方的工作任务或基本职责是： <u>{{contractInfo.duty}}</u>。<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;（四）、甲方有权根据生产经营需要和乙方的德能勤绩来调整乙方的工作岗位，岗位调整的时间和种类以甲方通知为准。<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;<b>三、工作时间</b> <br>
                            &nbsp;&nbsp;&nbsp;&nbsp;（一）、乙方每日工作不超过 <u>捌</u> 小时（8h/D），每周工作 <u>肆拾</u> 小时（40h/W），乙方每周至少休息壹天。<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;（二）、由于生产经营需要延长工作时间的，按本合同第四条第（一）款第③项的约定并依据《劳动法》第四十一条执行。<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;<b>四、薪酬及福利待遇</b> <br>
                            &nbsp;&nbsp;&nbsp;&nbsp;（一）、工资<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;①、甲方依法制定工资分配制度。甲方支付给乙方的工资不得低于市政府公布的当年度最低工资。<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;②、乙方同意甲方于每月壹拾捌日前发放其根据甲方工资制度计得的上月工资（遇节假日提前发放），甲方至少每月以货币形式向乙方支付一次工资，不得克扣或无故拖欠乙方工资；<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;③、甲方支付给乙方的奖金、津贴、补贴等项目均不属于正常工作时间工资，不作为加班工资的计算基数；<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;④、乙方加班工资、假期工资及特殊情况下的工资支付按法律法规的有关规定执行。<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;⑤、甲方有权根据岗位的调整和考评的结果对乙方的职位进行升、降，其工资及其他收入也可以随升随降；<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;⑥、乙方正常工作时间的工资为： <u> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </u>   元/月，津贴、补贴另计。<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;（二）、休假<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;乙方同意按甲方的《请、休假管理办法》的有关规定享受休假待遇。<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;<b>五、社会保险</b> <br>
                            &nbsp;&nbsp;&nbsp;&nbsp;（一）、甲方按社会保险的有关规定，为乙方办理社会保险，双方同意按规定缴付各自应承担的保险费。<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;（二）、乙方如果自愿放弃办理社会保险的，应当向甲方提交书面申请和相关证明文件，并承诺由此造成的一切不利后果均由乙方自行承担。<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;（三）、如因乙方提供虚假身份证、出借身份证或者因乙方擅自更改姓名，身份证与他人重号等非甲方原因导致无法办理社会保险的，由乙方自行排除妨碍，
                            否则造成的一切不利后果均由乙方自行承担，甲方不承担任何责任。<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;<b> 六、劳动保护、劳动纪律与制度约束</b> <br>
                            &nbsp;&nbsp;&nbsp;&nbsp;（一）、甲方按照法律法规要求，提供乙方工作所需的相关劳保用品、机器设备的安全操作规程；乙方应主动配合佩戴劳保用品，并按照相关安全操作规程文件进行设备操作。<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;（二）、签订本合同前，乙方已经详细阅读并理解甲方制定的各项规章制度，乙方同意严格遵守甲方各项规章制度，包括但不限于《员工手册ZW-H-LAB-001》、
                            《公司奖惩制度ZW-H-LAB-015》、《离职管理规定ZW-H-LAB-008》。如有违反，乙方愿接受甲方据此作出的相应处理。情节严重或造成甲方较大经济损失的，甲方有权单方面解聘乙方，
                            并无须支付经济补偿金和其他补偿费。<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;（三）、乙方应自觉遵守国家、省、市的有关法律法规和甲方依法制定的规章制度，遵守安全操作规程，服从甲方的管理，按时完成工作任务。<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;（四）、乙方在签订本合同时已如实填写婚孕状况，并保证在职期间自觉遵守计划生育政策，否则甲方有权单方面解聘乙方，并无须支付经济补偿金和其他补偿费。<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;<b>七、乙方辞工提前告知责任</b> <br>
                            &nbsp;&nbsp;&nbsp;&nbsp; 乙方若需在劳动合同期满前辞工，应提前30天向甲方提出书面请求，经甲方同意并安排好岗位接替人员后，方可办理离职手续。未经甲方同意或未交接好工作而擅自离职的，
                            双方同意，除按本合同第八条第（二）款执行外，乙方还要赔偿甲方因此而遭受的损失（包括录用和培训费等）。<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;<b>八、合同的变更、终止和解除</b> <br>
                            &nbsp;&nbsp;&nbsp;&nbsp;（一）、合同变更：经甲、乙双方协商同意可以依法变更本劳动合同。<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;（二）、合同终止：甲方规章制度及本合同中所约定（规定）的劳动合同终止条件出现时，则双方的劳动合同自行终止。<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;合同期内，甲方在规章制度及本合同终止条款之外的情况下提前终止与乙方的劳动合同，应一次性发给乙方经济补偿金。<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;合同期内，乙方在规章制度及本合同终止条款之外的情况下提前终止与甲方的劳动合同，应向甲方支付培训费、招聘成本等合理费用，如造成甲方经济损失的应承担相应责任。<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;本合同期满前，甲方应向乙方提出终止或续订劳动合同的书面意向。甲乙双方同意续订劳动合同的，应在本合同期满前叁拾日内办理续订手续。终止劳动合同的，
                            乙方应在结算工资前一日办妥相关交接手续。<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;（三）、合同解除：甲乙双方提前解除劳动合同，应当符合法律法规的有关规定。<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;<b>九、违约责任</b> <br>
                            &nbsp;&nbsp;&nbsp;&nbsp;（一）、甲方的违约情形及违约责任：<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;甲方违反本合同约定时，应当承担违约责任。  <br>                                                        
                            &nbsp;&nbsp;&nbsp;&nbsp;（二）、乙方的违约情形及违约责任：<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;因乙方违反本合同约定造成甲方经济损失，甲方可以从乙方工资中扣除赔偿费，但应当提前书面告知扣除原因及数额，且扣除赔偿费后的月工资余额不得低于当地最低工资标准。<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;<b>十、争议处理</b> <br>
                            甲乙双方发生劳动争议后，应先协商解决。协商不成可以通过法律途径解决。<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;<b> 十一、双方认为需要约定的其他事项：（内容不得违反法律法规及相关规定，可另加双方签名或盖章的附页）：</b> <br>
                            &nbsp;&nbsp;&nbsp;&nbsp;（一）、乙方具备以下情况之一的，甲方可以随时解除与乙方的劳动合同关系，且无需支付经济补偿金及赔偿金：1、乙方在合同期内受到相关机关的行政处罚、刑事处罚者；
                            2一个月内连续旷工3天或累计达5天者，以及一年累计旷工达10天者。迟到、早退一个月内达8次及一年累计25次者；3、员工因违法行为或者严重违反公司规章制度、工作严重失职、
                            营私舞弊给公司造成重大损害的； 4、工作态度恶劣或损害公司形象之行为的；5、故意损坏设备、工具，浪费原材料、能源的；6、在厂区范围内聚赌或斗殴／打架／代人打卡者；
                            7、未经允许私自在外有劳务关系或兼营与公司同类业务者；本人或及其直属家人经营与公司利益冲突之行业未经报备者； 8、向公司提供虚假个人证明、证件、资料、健康状况者；
                            9、一年内受记过处分达5次者或半年内达3次者；10、违反和公司签署《深圳市兆威机电股份有限公司员工廉洁协议》《保密协议书》及其它协议条款规定者。
                            11、法律、法规规定的其他情形的。<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;（二）、乙方具备以下情况之一的，视为乙方自动离职，甲方无需支付经济补偿金及赔偿金，且可以追究乙方单方解除劳动合同关系导致甲方的经济损失：
                            1、乙方连续旷工叁天以上（含叁天）的；2、甲方调整乙方岗位后乙方连续三日不到岗履行职务的；3、法律、法规规定的其他情形的。<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;（三）、甲方以下规章制度作为本合同的附件，乙方在签订本合同时已全部阅读并同意接受，与本合同具有同等法律效力。<br>
                            &nbsp;&nbsp;&nbsp;&nbsp;1、《员工手册》；2、《公司奖惩制度》；3、《离职管理规定》；4、《考勤管理办法》； <br>
                            &nbsp;&nbsp;&nbsp;&nbsp;<b>十二、本合同壹式贰份，自甲乙双方签字盖章之日起生效。</b> <br>
                        </p>
                        <div style="margin-top:30px">
                            <el-row type="flex" justify="space-between" align="center">
                                <el-col :span="12">
                                    甲方盖章：
                                </el-col>
                                <el-col :span="12">
                                    乙方签名：
                                    <img :src="baseUrl+contractInfo.sign" class="imgBtn" style="width:120px"/>
                                </el-col>
                            </el-row>
                            <el-row type="flex" justify="space-between" align="center">
                                <el-col :span="12">
                                    法人代表：{{contractInfo.corporation}}
                                </el-col>
                                <el-col :span="12">
                                    <span>&nbsp;</span>
                                </el-col>
                            </el-row>
                            <el-row type="flex" justify="space-between" align="center">
                                <el-col :span="12">
                                    {{contractDay}}
                                </el-col>
                                <el-col :span="12">
                                    {{contractDay}}
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </div>
            </Drawer>
        </div>

        <table-header
            :table_actions="table_actions"
            :table_selectedRows="table_selectedRows"
            :table_form.sync="table_form"
            :table_column="table_field"
            @action="handleAction"
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
            :row-class-name="table_state_className"
            :header-cell-style="headerCellStyle"
            :height="table_height"
            @header-dragend="table_dragend"
            @sort-change="table_sort_change"
            @cell-click="openDrawer"
            :cell-style="cellStyle"
            v-loading="table_loading">
                <el-table-column 
                    type="selection" 
                    width="60" 
                    class-name="table-column-disabled"
                    :selectable="table_disable_selected"
                ></el-table-column>
                <el-table-column type="index" :index="indexMethod" />
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
const api_resource = api_common.resource("hrm/workwechat/list");
import dayjs from 'dayjs'
let baseUrl = process.env.VUE_APP_STATIC

export default {
    props:['flag'],
    mixins: [table_mixin],
    data(){
        return {
            baseUrl,
            loading: true,
            api_resource,
            table_topHeight: 295,
            openDrawers: false,
            contractInfo: {},
            contractDay: '',
            startDay: '',
            endDay: '',
            signImg: '',
            template: {
                sign(column, row){
                    if(row.sign=='未签名'){
                        return <el-tag type="danger">{row.sign}</el-tag>
                    }else{
                        return <el-tag type="success">{row.sign}</el-tag>
                    }
                }
            }
        }
    },
    watch:{
        flag(){
            this.table_form.keyword = ''
			this.table_form.query.query = []
			this.table_form.currentpage = 1
            this.fetchMenu()
        }
    },
    methods:{
        print(){
            window.print()
            return 
        },
		cellStyle({row, column, rowIndex, columnIndex}){
			if(this.flag==1 && column.label == '工号'){
				return 'color:#0BB2D4;cursor:pointer!important'
			}else{
				return  ''
			}
		},
        async openDrawer(row,column,cell,event){
            if(this.flag==1 && row.employeeCode==event.target.innerText){
                this.openDrawers = true
                this.contractInfo = await this.$request.get('hrm/workwechat/contact?workcode='+row.employeeCode)
                this.startDay = this.contractInfo.ContractRecord__contractStart != null? this.contractInfo.ContractRecord__contractStart.split('-'): ''
                this.endDay = this.contractInfo.ContractRecord__contractEnd != null? this.contractInfo.ContractRecord__contractEnd.split('-'): ''
                let created = this.contractInfo.created
                this.contractDay = created!=''&&created!=undefined? dayjs(created).year()+'年'+  dayjs(created).month()+1+'月'+ dayjs(created).date()+'日':''
                // this.contractDay = new Date(created).getFullYear() +'年'+ (new Date(created).getMonth()+1)+'月'+new Date(created).getDate()+ '日'
            }
        },
        fetch(){
			this.table_form.currentpage = 1
            this.fetchTableData()
        },
        async fetchTableData() {
            this.table_loading = true
            this.table_form.flag = this.flag
            const {rows,total}  =  await api_resource.get(this.table_form);
            this.table_data = rows
            this.table_form.total = total
            setTimeout(()=>{
                this.table_loading = false
            },300)
        },
        async fetchMenu(){
            const { field, action,table } = await api_common.menuInit('hrm/workwechat/list'+this.flag);
            this.table_field = field;
            this.table_actions = action;
            this.table_config = table
            this.fetchTableData()
        }
    },
    
    async created() {
		this.$set(this.table_form,'dateLap',dayjs().format('YYYY-MM'))
        this.fetchMenu()
    }
}
</script>
<style lang="scss" scoped>
    .drawerInfo{
        .ivu-drawer-body{
            padding:0;
        }
        .ivu-drawer-header{
            background: rgba(245,250,251,1)
        }
    }
    .labor-contract{
        background: #fff;
        color: #000;
        h3{
            padding-top: 15px;
            text-align: center;
        }
        .content{
            margin: 15px 15px 0;
            padding-bottom: 30px;
            font-size: 12px;
            .sign{
                height: 27px;
                line-height: 27px;
            }
        }
    }
</style>
