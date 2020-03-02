  <template>
	<ui-table 
		class="public-table-container"
		ref="table" 
		:table_column="table_field" 
		:table_query.sync="table_form.query"
		@query="querySubmit"
	>

		<!-- 客户档案详情 -->
		<div>
			<Drawer title="客户档案详情" :closable="false" width="640" v-model="openDrawers" class="drawerInfo rowLeft" v-if="profileData.main">
				<p class="info">客户基本信息</p>
				<div class="drawer-profile">
					<el-row>
						<el-col :span="12">
							<span class="labelCon">客户公司名称：</span>
							<span class="labelCon promp">{{profileData.main.name}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">客户简称：</span>
							<span class="labelCon promp">{{profileData.main.sex}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">客户公司地址：</span>
							<span class="labelCon promp">{{profileData.main.age}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">客户收货地址：</span>
							<span class="labelCon promp">{{profileData.main.birthday}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">所属行业：</span>
							<span class="labelCon promp">{{profileData.main.job}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">地区：</span>
							<span class="labelCon promp">{{profileData.main.salary}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">发货方式：</span>
							<span class="labelCon promp">{{profileData.main.idCard}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">结算方式：</span>
							<span class="labelCon promp">{{profileData.main.marriage}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">交易币种：</span> 
							<span class="labelCon promp">{{profileData.main.census}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">法务纠纷数量：</span> 
							<span class="labelCon promp">{{profileData.main.children}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">注册资金：</span>
							<span class="labelCon promp">{{profileData.main.telephone}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">客户级别：</span> 
							<span class="labelCon promp">{{profileData.main.eduction}}</span>
						</el-col>
					</el-row>
				</div>
				<Divider/>
				<p class="info">业务信息</p>
				<div class="drawer-profile">
					<el-row>
						<el-col :span="12">
							<span class="labelCon">客户类型：</span>
							<span class="labelCon promp">{{profileData.main.applyOption}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">客户所在地：</span>
							<span class="labelCon promp">{{profileData.main.applyOption}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">业务员/工号：</span>
							<span class="labelCon promp">{{profileData.main.applyOption}}/{{profileData.main.applyOption}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">跟单员/工号：</span>
							<span class="labelCon promp">{{profileData.main.applyOption}}/{{profileData.main.applyOption}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">客户来源：</span>
							<span class="labelCon promp">{{profileData.main.applyOption}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">业务提成系数：</span>
							<span class="labelCon promp">{{profileData.main.applyOption}}</span>
						</el-col>
					</el-row>
				</div>
				<Divider/>
				<p class="info">客户开票信息</p>
				<div class="drawer-profile">
					<el-row class="mb20">
						<el-col :span="12">
							<span class="labelCon">税号：</span>
							<span class="labelCon promp">{{profileData.relation}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">税率（%）：</span>
							<span class="labelCon promp">{{profileData.department}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">开票地址：</span>
							<span class="labelCon promp">{{profileData.name}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">开票电话：</span>
							<span class="labelCon promp">{{profileData.job}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">开户银行：</span>
							<span class="labelCon promp">{{profileData.address}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">银行账号：</span>
							<span class="labelCon promp">{{profileData.address}}</span>
						</el-col>
					</el-row>
				</div>
				<Divider/>
				<p class="info">客户联系人信息</p>
				<div class="drawer-profile">
					<el-row class="mb20">
						<el-col :span="12">
							<span class="labelCon">姓名：</span>
							<span class="labelCon promp">{{profileData.relation}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">职位：</span>
							<span class="labelCon promp">{{profileData.department}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">手机：</span>
							<span class="labelCon promp">{{profileData.name}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">固定电话：</span>
							<span class="labelCon promp">{{profileData.job}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">电子邮件：</span>
							<span class="labelCon promp">{{profileData.job}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">传真：</span>
							<span class="labelCon promp">{{profileData.name}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">客户财务信息：</span>
							<span class="labelCon promp">{{profileData.job}}</span>
						</el-col>
					</el-row>
				</div>
				<Divider/>
				<p class="info">客户对账信息</p>
				<div class="drawer-profile">
					<el-row class="mb20">
						<el-col :span="12">
							<span class="labelCon">对账区间：</span>
							<span class="labelCon promp">{{profileData.departureDate}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">立账依据：</span>
							<span class="labelCon promp">{{profileData.startDate}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">客户截止收票日期：</span>
							<span class="labelCon promp">{{profileData.job}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">客户每月预计付款时间：</span>
							<span class="labelCon promp">{{profileData.endDate}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">客户每月预计付款时间2：</span>
							<span class="labelCon promp">{{profileData.endDate}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">销售付款协议编码：</span>
							<span class="labelCon promp">{{profileData.companyName}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">销售默认收付款协议名称：</span>
							<span class="labelCon promp">{{profileData.witness}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">其他付款协议编码：</span>
							<span class="labelCon promp">{{profileData.companyName}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">其他应收单收付款协议名称：</span>
							<span class="labelCon promp">{{profileData.witness}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">定金比例（%）：</span>
							<span class="labelCon promp">{{profileData.department}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">国外客户运输天数：</span>
							<span class="labelCon promp">{{profileData.witnessPhone}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">控制额度或期限：</span>
							<span class="labelCon promp">{{profileData.jobContent}}</span>
						</el-col>
						<el-col :span="12">
							<span class="labelCon">以实际发货账期：</span>
							<span class="labelCon promp">{{profileData.jobContent}}</span>
						</el-col>
					</el-row>
				</div>
				<Divider/>
				<p class="info">附件信息</p>
				<div class="drawer-profile">
					<el-row class="mb20">
						<el-col :span="12">
							<span class="labelCon">营业执照（盖章）：</span>
							<span class="labelCon promp">{{profileData.schoolName}}</span>
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
		<el-table-column type="index" :index="indexMethod" width="70"/>
		<each-table-column :table_field="table_field" />
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
const api_resource = api_common.resource("commission/commissionSet");
export default {
	mixins: [table_mixin],
	data() {
		return {
			// form:{},
			// loading: true,
			// api_resource,
			// queryDialogFormVisible:true,
			// table_topHeight:234,
			// dialogFormVisible:false,
			// importUploadUrl:'commission/commissionSet/upload',
			// downloadUrl:'commission/commissionSet/downtemplate',
			// profileData: {
			// 	main: {}
			// },
            // openDrawers: false,
		}
	},
	methods: {
		async fetchTableData() {
			this.table_loading = true;
			const {rows , total }= await api_resource.get(this.table_form);
			this.table_data  = rows
			this.table_form.total = total
			setTimeout(() => {
				this.table_loading = false;
			}, 300);
    	},
	},
	async created() {
		// const { field, action,table } = await api_common.menuInit("commission/commfactor");
		// this.table_field = field;
		// this.table_actions = action;
		// this.table_config = table
		// this.fetchTableData();
	}
};
</script>
<style lang="scss">
    .drawerInfo{
        .ivu-drawer-body{
            padding:0;
        }
        .ivu-drawer-header{
            background: rgba(245,250,251,1)
        }
		.ivu-divider{
			margin: 15px 20px;
		}
        .line-boxs{
            margin-top: 20px;
        }
        .info{
            color: #0BB2D4;
            font-size: 14px;
            font-weight: bold;
            margin: 20px;
        }
        .labelCon{
            display: inline-block;
            text-align: left;
            font-size: 12px;
            color: #000;
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
	.rowLeft{
		.el-row{
			margin: 0 0 0 20px;
		}
	}
    .drawer-profile .el-col-12,.el-col-24{
        margin-bottom: 10px;
    }
    .mb20{margin-bottom: 20px;}
</style>