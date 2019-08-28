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
      <div style="width:500px;margin:0 auto">
        <el-form ref="form" :model="form" label-width="100px">
          <el-row :gutter="20">
            
            <el-col :span="24">
              <form-render :type="`day`" :field="{name:'收款日期'}" v-model="form.effectiveDate"/>
            </el-col>


           <el-col :span="24">
              <form-render :type="`select`" :field="{name:'借方科目',options:formSelect1}" v-model="form.debit"/>
            </el-col>
            <el-col :span="24">
              <form-render :type="`input`" :field="{name:'摘要'}" v-model="form.summary"/>
            </el-col>
            <el-col :span="24">
              <form-render :type="`select`" :field="{name:'贷方科目',options:formSelect2}" v-model="form.credit" />
            </el-col>
            <el-col :span="24">
              <form-render :type="`input`" :field="{name:'金额'}" v-model="form.amount" />
            </el-col>

             <el-col :span="24">
              <form-render :type="`member`" :field="{name:'受助人'}" v-model="form.grantees"/>
            </el-col>

             <el-col :span="24">
              <form-render :type="`member`" :field="{name:'收款人'}" v-model="form.payee"/>
            </el-col>



            <el-col :span="24">
              <form-render :type="`input`" :field="{name:'备注'}" v-model="form.remark" />
            </el-col>
           
          </el-row>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleFormSubmit">确 定</el-button>
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

      style="width: 100%"
      v-loading="table_loading"
      :header-cell-style="headerCellStyle"
      :height="table_height"
      @header-dragend="table_dragend"
      @sort-change="table_sort_change"
      show-summary
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
        <!-- <each-table-column :table_field="table_field"/> -->
        <each-table-column :table_field="table_field.filter(o=>!['expendAttachment'].includes(o.name))" :template="template"/>
        <el-table-column prop="expendAttachment" label="附件">
            <template slot-scope="scope">
              <div v-for="item in scope.row.expendAttachment.split(',')" :key="item">
                <a :href="baseUrl+item" target="_blank" v-if="item!=''">附件链接</a>
              </div>
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
</template>
<script>
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";
import { constants } from 'crypto';
import { setTimeout } from 'timers';
const api_resource = api_common.resource("lovefoundation/debitcredit");
let baseUrl = process.env.VUE_APP_STATIC
const defaultForm = () => {
    return {
        estate:1,
        roomAdmin:''
    }
}
export default {
    mixins: [table_mixin],
    props:['id'],
    data() {
        return {
          baseUrl,
          loading: true,
          form:{},
          api_resource,
          orgCategory:[],
          queryDialogFormVisible:true,
          table_topHeight:236,
          adminList:[],
          defaultForm,
          selectData:[],
          formSelect1:[],
          formSelect2:[],
          putForm:{},
          total_data:[],
          template:{
            signAttachment(row,column){
              if(column.signAttachment!=''&&column.signAttachment!=undefined){
                return <img src={baseUrl+column.signAttachment} width="50" height="50"></img>
              }
            }
          }
        };
    },
    watch:{
    
    },
    methods: {
        async fetchTableData() {
            this.table_loading = true;
            this.table_form.orgid = this.id
            const {rows , total }= await api_resource.get(this.table_form);
            this.table_data  = rows
            this.table_form.total = total
            setTimeout(() => {
                this.table_loading = false;
            }, 300);
        },
        async allocation(){
            let row = this.table_selectedRows[0]
            await this.$request.put('/lovefoundation/debitcredit/'+row.id)
            this.fetchTableData()
            // api_resource.update(row.id)
        },
        async initForm(){
            const optionData = await this.$request.get('/lovefoundation/debitcreditfields');
            this.formSelect1 = optionData.debit.map(o=>({label:o.name,value:o.id}))
            this.formSelect2 = optionData.credit.map(o=>({label:o.name,value:o.id}))
        },
        async add(){
            this.initForm()
            this.dialogFormVisible = true
        },
        async handleFormSubmit(){
            let form = Object.assign({},this.form)
            if(this.isInsert){
                await api_resource.create(form)
            }else{
                this.putForm.debit = form.debit
                this.putForm.summary = form.summary
                this.putForm.credit = form.credit
                this.putForm.amount = form.amount
                this.putForm.remark = form.remark
                
                this.putForm.effectiveDate = form.effectiveDate
                // this.putForm.grantees =  !isNaN(+form.grantees)?form.grantees:''
                if(isNaN(+form.grantees)){
                   delete this.putForm.grantees
                }else{
                  this.putForm.grantees = form.grantees
                }
                if(isNaN(+form.payee)){
                  delete this.putForm.payee
                }else{
                  this.putForm.payee = this.form.payee
                }
               



                await api_resource.update(form.id,this.putForm)
            }
            this.dialogFormVisible = false
            this.fetchTableData()
        },
        async edit(){
            this.initForm()
            // this.$request('/lovefoundation/debitcredit/staff')
            let row = this.table_selectedRows[0]
            this.form = await api_resource.find(row.id);
            this.form = this.form[0];
            console.log(this.form,'this.formthis.form')
            try {
              this.form.credit = this.formSelect2.find(o=>o.label==this.form.credit).value
            } catch (error) {
              this.form.credit = ''
            }
            try {
              this.form.debit = this.formSelect1.find(o=>o.label==this.form.debit).value
            } catch (error) {
              this.form.debit = ''
            }
             this.dialogFormVisible = true;
        },
        getSummaries(param) {
          const { columns, data } = param;
          const sums = [];
          columns.forEach((column, index) => {
          if (index === 2) {
            sums[index] = '基金余款';
            return;
          }
          if(index === 6){
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
              sums[index] = sums[index].toFixed(2);
            } else {
              sums[index] = '';
            }
          }
        });
        return sums;
      } 
    },
    async created() {
        const { field, action,table } = await api_common.menuInit("lovefoundation/debitcredit");
        this.table_field = field;
        this.table_actions = action;
        this.table_config = table
        this.fetchTableData();
        
    }
};
</script>



