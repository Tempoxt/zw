<template>
    <ui-table ref="table" 
        :table_column="table_field" 
        :table_query.sync="table_form.query"
        @query="querySubmit"
        >
         <el-dialog
            :title="schemeName+' 公式详情'"
            :visible.sync="dialogFormVisible2"
            class="public-dialog"
            v-el-drag-dialog
            fullscreen
            
            >
            <div >
                 <chart 
                    :data="dialogValue"
                    ref="chart" 
                    v-if="dialogFormVisible2"
                />

            </div>
           
        </el-dialog>

         <!-- width="1800px" -->
        <el-dialog
            :title="dialogStatus==='insert'?'添加公式':'编辑公式'"
            :visible.sync="dialogFormVisible"
            class="public-dialog"
            v-el-drag-dialog
           
            fullscreen
            >
            <performanceSchemeForm :row="row" :schemeName="schemeName" @submit="onSubmit" :orgid="orgid" :dialogStatus="dialogStatus"  :id="id" v-if="dialogFormVisible" :formValue="formValue"/>
        </el-dialog>
        <table-header
            :table_actions="table_actions"
            :table_selectedRows="table_selectedRows"
            @action="handleAction"
            :table_form.sync="table_form"
            :table_column="table_field"
        ></table-header>
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
            <el-table-column type="index" :index="indexMethod"/>
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
let baseUrl = process.env.VUE_APP_STATIC
const api_resource = api_common.resource('performance/scheme')
import performanceSchemeForm from './performanceSchemeForm2'
import chart from './chart2.vue'
export default {
    components:{
        performanceSchemeForm,
        chart
    },
    mixins: [table_mixin],
    props:['orgid','id'],
    data() {
        var vm = this
        return {
            baseUrl, 
            api_resource,
            loading: false,
            queryDialogFormVisible:true,
            dialogFormVisible2:false,
            table_topHeight: 235,
            formValue:null,
            schemeName:'',
            dialogValue:[],
            row:{},
            template:{
				version(column,row){
                    return <el-tag size="mini" type="info" style={'cursor: pointer;'} onClick={()=>{vm.showScheme(row)}}>{row.version}</el-tag>
				}
			},
        };
    },
    watch:{
        orgid(){
            this.fetchMenu()
        },
    },
    methods: {
        async showScheme(row){
           const { rows } = await this.$request.get('/performance/scheme/details/'+row.id)
            this.schemeName = row.scheme_name
            // 增加子公式前两个节点
            ~function f(rows){
                rows.forEach((o)=>{
                    if(o.subs){
                        o.subs = [
                            {
                                name:o.name,
                                type:'text',
                                disabled:true
                            },
                            {
                                name:'=',
                                type:'symbol',
                                disabled:true
                            }
                        ].concat(o.subs)

                        f(o.subs)
                    }
                })
            }(rows)

            this.dialogValue =this.format(rows) 
            console.log(this.dialogValue,'this.dialogValue')
            this.dialogFormVisible2 = true
            console.log(this)
        },
        generateID(){
            return parseInt(Math.random()*1000000)
        },
        format(value){
            value.forEach(o=>{
                o.key = this.generateID()
                if(o.subs && o.subs.length){
                    this.format(o.subs)
                }
            })
            return value
        },
        onSubmit(){
            this.dialogFormVisible = false
            this.fetchTableData()
        },
        async copy(){
            let row = this.table_selectedRows[0]
            const { rows } = await this.$request.get('/performance/scheme/details/'+row.id)
            await this.$request.post('/performance/scheme',{
                department:this.id,
                formula:rows,
                scheme_name:row.scheme_name +' 拷贝 '+(+new Date())
            },{
                headers:{
                    "Content-Type":'application/json'
                }
            })
            this.fetchTableData()
        },
        async edit(){
            let row = this.table_selectedRows[0]
            // this.form = (await api_resource.find(row.id))[0]
            const { rows } = await this.$request.get('/performance/scheme/details/'+row.id)
            this.schemeName = row.scheme_name
            // 增加子公式前两个节点
            ~function f(rows){
                rows.forEach((o)=>{
                    if(o.subs){
                        o.subs = [
                            {
                                name:o.name,
                                type:'text',
                                disabled:true
                            },
                            {
                                name:'=',
                                type:'symbol',
                                disabled:true
                            }
                        ].concat(o.subs)

                        f(o.subs)
                    }
                })
            }(rows)
            this.formValue = rows
            this.row = row
            this.dialogFormVisible = true
        },
        add(){
            this.formValue = null
            this.dialogFormVisible = true
        },
		fetch(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
        async fetchTableData() {
            if(this.id==''){
                return 
            } 
            this.table_loading = true;
            this.table_form.department = this.id
            const {rows , total }= await api_resource.get(this.table_form);
            this.table_data  = rows
            this.table_form.total = total
            setTimeout(() => {
                this.table_loading = false;
            }, 300);
        },
		async fetchMenu(){
            const { field, action,table } = await api_common.menuInit('PerformanceScheme');
            this.table_field = field;
            this.table_actions = action;
            this.table_config = table
            this.fetchTableData()
		},
    },
    async created() {
        this.fetchMenu();
    },
};
</script>