  <template>
  <ui-table ref="table" 
    :table_column="table_field" 
    :table_query.sync="table_form.query"
    @query="querySubmit"
    >

	<div class="shipNumber">
		<p class="paramTitle">发货数量</p>
		<el-form ref="form" :model="form">
			<el-row class="basicParams">
				<el-col :span="24" class="comList">
					<el-row>
						<el-col class="comParam" :span="2">1月</el-col>
						<el-col class="comParam" :span="2">2月</el-col>
						<el-col class="comParam" :span="2">3月</el-col>
						<el-col class="comParam" :span="2">4月</el-col>
						<el-col class="comParam" :span="2">5月</el-col>
						<el-col class="comParam" :span="2">6月</el-col>
						<el-col class="comParam" :span="2">7月</el-col>
						<el-col class="comParam" :span="2">8月</el-col>
						<el-col class="comParam" :span="2">9月</el-col>
						<el-col class="comParam" :span="2">10月</el-col>
						<el-col class="comParam" :span="2">11月</el-col>
						<el-col class="comParam" :span="2">12月</el-col>
					</el-row>
					<el-row>
						<el-col :span="2">
							<form-render :type="`input`" :field="{name:''}" @blur="numberBlur(form.jan,'1月')" v-model="form.jan"/>
						</el-col>
						<el-col :span="2">
							<form-render :type="`input`" :field="{name:''}" @blur="numberBlur(form.feb,'2月')" v-model="form.feb"/>
						</el-col>
						<el-col :span="2">
							<form-render :type="`input`" :field="{name:''}" @blur="numberBlur(form.mar,'3月')" v-model="form.mar"/>
						</el-col>
						<el-col :span="2">
							<form-render :type="`input`" :field="{name:''}" @blur="numberBlur(form.apr,'4月')" v-model="form.apr"/>
						</el-col>
						<el-col :span="2">
							<form-render :type="`input`" :field="{name:''}" @blur="numberBlur(form.may,'5月')" v-model="form.may"/>
						</el-col>
						<el-col :span="2">
							<form-render :type="`input`" :field="{name:''}" @blur="numberBlur(form.june,'6月')" v-model="form.june"/>
						</el-col>
						<el-col :span="2">
							<form-render :type="`input`" :field="{name:''}" @blur="numberBlur(form.july,'7月')" v-model="form.july"/>
						</el-col>
						<el-col :span="2">
							<form-render :type="`input`" :field="{name:''}" @blur="numberBlur(form.agu,'8月')" v-model="form.agu"/>
						</el-col>
						<el-col :span="2">
							<form-render :type="`input`" :field="{name:''}" @blur="numberBlur(form.ste,'9月')" v-model="form.ste"/>
						</el-col>
						<el-col :span="2">
							<form-render :type="`input`" :field="{name:''}" @blur="numberBlur(form.oct,'10月')" v-model="form.oct"/>
						</el-col>
						<el-col :span="2">
							<form-render :type="`input`" :field="{name:''}" @blur="numberBlur(form.des,'11月')" v-model="form.des"/>
						</el-col>
						<el-col :span="2">
							<form-render :type="`input`" :field="{name:''}" @blur="numberBlur(form.nov,'12月')" v-model="form.nov"/>
						</el-col>
					</el-row>
				</el-col>
			</el-row>
		</el-form>
	</div>
    <table-header
      :table_actions="table_actions"
      :table_selectedRows="table_selectedRows"
      @action="handleAction"
      :table_form.sync="table_form"
      :table_column="table_field"
    >
          <div style="padding-left:10px">
            <dateLap v-model="table_form.dateLap" type="3" :disabled="true" @change="fetch"/>
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
		:show-summary="table_config.isShowFooter"
		:summary-method="getSummaries"
    >
    <el-table-column 
      type="selection" 
      width="60" 
      class-name="table-column-disabled"
      :selectable="table_disable_selected"
      >
      </el-table-column>
      <el-table-column type="index" :index="indexMethod" width="70"/>
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
import dayjs from 'dayjs'
const api_resource = api_common.resource("basicwage/award");
export default {
	mixins: [table_mixin],
	data() {
		return {
			loading: true,
			api_resource,
			table_topHeight: 333,
			orgCategory:[],
			queryDialogFormVisible:true,
			importUploadUrl:"/basicwage/award/input",
			downloadUrl:'/basicwage/award/input',
			form: {
				jan: '',
				feb: '',
				mar: '',
				apr: '',
				may: '',
				june: '',
				july: '',
				agu: '',
				ste: '',
				oct: '',
				des: '',
				nov: '',
			}
		};
	},
	methods: {
		async numberBlur(value,month){
			if (value!='' && !(/^[0-9]\d*$/.test(value))) {
				this.$message.error('请输入正整数');
				return 
			}else{
				if(value=='') return;
				await this.$request.put('/basicwage/award',{
					year: this.table_form.dateLap,
					month: month,
					money: Number(value),
				},{alert:false})
				this.fetchTableData()
			}
		},
        fetch(){
            this.table_form.currentpage = 1
            this.fetchTableData()
        },
		async fetchTableData() {
			this.table_loading = true;
			const {rows , total }= await api_resource.get(this.table_form);
			this.table_data  = rows
			this.table_form.total = total
			setTimeout(() => {
				this.table_loading = false;
			}, 300);
		},
		async handleForm1Submit(){
            await this.form_validate()
			
			let form1 = Object.assign({},this.form1)
			await api_resource.update(form1.id,form1)
			
			this.dialogForm1Visible = false
			this.fetchTableData()
		},
	},
	async created() {
		const { field, action,table } = await api_common.menuInit("monthAward");
		this.table_field = field;
		this.table_actions = action;
		this.table_config = table
		this.$set(this.table_form,'dateLap',dayjs().format('YYYY'))
		this.fetchTableData();
	}
};
</script>
<style lang="scss">
	.shipNumber{
		padding-bottom: 20px;
		.paramTitle{
			color: #143040;
			font-size: 16px;
			margin-bottom: 14px;
		}
		.basicParams{
			.el-form-item{
				margin:0 auto;
				width: 80%;
			}
			.el-input__inner{
				height: 26px;
				line-height: 26px;
				border-radius: 4px;
			}
			.el-col{
				box-sizing: border-box;
			}
			.el-row{
				border-right: 1px solid #A3AFB7;
				// background: #F5F5F5;
			}
			.el-col-2{
				border-left: 1px solid #A3AFB7;
				border-top: 1px solid #A3AFB7;
			}
			.comList{
				border: 0;
				.el-row:last-child{
					border-bottom: 1px solid #A3AFB7;
				}
				.comTitle{
					border-right: 0;
					border: 1px solid #A3AFB7;
					border-bottom: 0;
					font-size: 14px;
					font-weight: bold;
					padding: 6px 0;
					text-align: center;
					color: #143040;
					background: #F5F5F5;
				}
				.comParam{
					font-size: 12px;
					font-weight: bold;
					text-align: center;
					padding: 4px 0;
					color: #37474F;
				}
			}
		}
	}
</style>


