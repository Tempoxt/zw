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
            width="800px"
            >
            <el-form ref="form" :model="form" label-width="100px" :rules="rules">
                <el-row>
                    <el-col :span="12">
                        <form-render :type="`input`" :field="{name:'部门'}" v-model="depart_name" :disabled="true"/>
                    </el-col>
                    <el-col :span="12" style="height: 51px">
                        <el-form-item label="目标相同">
                            <el-switch v-model="form.status"></el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <form-render prop="parameter_name" :type="`select`" :field="{name:'年度参数',options:attenData}" v-model="form.parameter_name"/>
                    </el-col>
                    <el-col :span="12">
                        <form-render :type="`input`" :field="{name:'年度平均值'}" v-model="form.avarage" :disabled="true"/>
                    </el-col>
                    <el-col :span="12">
                        <form-render prop="year" :type="`year`" :field="{name:'年份'}" v-model="form.year" :disabled="true"/>
                    </el-col>
                </el-row>
                <el-row style="border-top:1px solid #E4EAEC;padding-top:20px">
                    <el-col :span="12">
                        <el-row>
                            <el-col :span="24">
                                <form-render prop="jan_target" :type="`input`" :field="{name:'1月目标'}" v-model="form.jan_target"/>
                            </el-col>
                            <el-col :span="24">
                                <form-render prop="feb_target" :type="`input`" :field="{name:'2月目标'}" v-model="form.feb_target" :disabled="form.status||form.status==1"/>
                            </el-col>
                            <el-col :span="24">
                                <form-render prop="mar_target" :type="`input`" :field="{name:'3月目标'}" v-model="form.mar_target" :disabled="form.status||form.status==1"/>
                            </el-col>
                            <el-col :span="24">
                                <form-render prop="apr_target" :type="`input`" :field="{name:'4月目标'}" v-model="form.apr_target" :disabled="form.status||form.status==1"/>
                            </el-col>
                            <el-col :span="24">
                                <form-render prop="may_target" :type="`input`" :field="{name:'5月目标'}" v-model="form.may_target" :disabled="form.status||form.status==1"/>
                            </el-col>
                            <el-col :span="24">
                                <form-render prop="june_target" :type="`input`" :field="{name:'6月目标'}" v-model="form.june_target" :disabled="form.status||form.status==1"/>
                            </el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="12">
                        <el-row>
                            <el-col :span="24">
                                <form-render prop="july_target" :type="`input`" :field="{name:'7月目标'}" v-model="form.july_target" :disabled="form.status||form.status==1"/>
                            </el-col>
                            <el-col :span="24">
                                <form-render prop="aug_target" :type="`input`" :field="{name:'8月目标'}" v-model="form.aug_target" :disabled="form.status||form.status==1"/>
                            </el-col>
                            <el-col :span="24">
                                <form-render prop="sept_target" :type="`input`" :field="{name:'9月目标'}" v-model="form.sept_target" :disabled="form.status||form.status==1"/>
                            </el-col>
                            <el-col :span="24">
                                <form-render prop="oct_target" :type="`input`" :field="{name:'10月目标'}" v-model="form.oct_target" :disabled="form.status||form.status==1"/>
                            </el-col>
                            <el-col :span="24">
                                <form-render prop="nov_target" :type="`input`" :field="{name:'11月目标'}" v-model="form.nov_target" :disabled="form.status||form.status==1"/>
                            </el-col>
                            <el-col :span="24">
                                <form-render prop="dec_target" :type="`input`" :field="{name:'12月目标'}" v-model="form.dec_target" :disabled="form.status||form.status==1"/>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </el-form>

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
let baseUrl = process.env.VUE_APP_STATIC
const api_resource = api_common.resource('performance/year/parameter/value')
export default {
    mixins: [table_mixin],
    props:['orgid','id','depart_name'],
    data() {
        var checkNumber = (rule, value, callback)=>{
			if (value==='') {
				return callback(new Error('请输入'));
			}else if (!(/^(100|(([1-9]\d|\d).*))%?$/.test(value))) {
				callback(new Error('请输入数字或者百分比'));
			}else{
				callback();
			}
		}
        return {
            baseUrl, 
            api_resource,
            loading: false,
            queryDialogFormVisible:true,
            table_topHeight: 235,
            form:{
                avarage: '',
            },
            dialogFormVisible: false,
            rules:{
                parameter_name:[
                    { required: true, message: '请选择', trigger: ['blur','change'] }
                ],
                year:[
                    { required: true, message: '请选择', trigger: ['blur','change'] }
                ],
                jan_target:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                    { validator: checkNumber, trigger: 'blur' }
                ],
                feb_target:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                    { validator: checkNumber, trigger: 'blur' }
                ],
                mar_target:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                    { validator: checkNumber, trigger: 'blur' }
                ],
                apr_target:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                    { validator: checkNumber, trigger: 'blur' }
                ],
                may_target:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                    { validator: checkNumber, trigger: 'blur' }
                ],
                june_target:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                    { validator: checkNumber, trigger: 'blur' }
                ],
                july_target:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                    { validator: checkNumber, trigger: 'blur' }
                ],
                aug_target:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                    { validator: checkNumber, trigger: 'blur' }
                ],
                sept_target:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                    { validator: checkNumber, trigger: 'blur' }
                ],
                oct_target:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                    { validator: checkNumber, trigger: 'blur' }
                ],
                nov_target:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                    { validator: checkNumber, trigger: 'blur' }
                ],
                dec_target:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                    { validator: checkNumber, trigger: 'blur' }
                ],
            },
            isSame: false,
            result: [],
            attenData: [],
        };
    },
    computed:{
    },
    watch:{
        orgid(){
            this.fetch()
        },
        'form.status'(){
            if(this.form.status){
                this.form.avarage =this.form.feb_target = this.form.mar_target = this.form.apr_target =this.form.may_target =this.form.june_target =this.form.july_target 
                 =this.form.aug_target =this.form.sept_target =this.form.oct_target =this.form.nov_target =this.form.dec_target = this.form.jan_target
            }
        },
        'form.jan_target'(){
            if(this.form.status){
                this.form.avarage =this.form.feb_target = this.form.mar_target = this.form.apr_target =this.form.may_target =this.form.june_target =this.form.july_target 
                 =this.form.aug_target =this.form.sept_target =this.form.oct_target =this.form.nov_target =this.form.dec_target = this.form.jan_target
            }else{
                this.getAvarage()
            }
        },
        'form.feb_target'(){
            this.getAvarage()
        },
        'form.mar_target'(){
            this.getAvarage()
        },
        'form.apr_target'(){
            this.getAvarage()
        },
        'form.may_target'(){
            this.getAvarage()
        },
        'form.june_target'(){
            this.getAvarage()
        },
        'form.july_target'(){
            this.getAvarage()
        },
        'form.aug_target'(){
            this.getAvarage()
        },
        'form.sept_target'(){
            this.getAvarage()
        },
        'form.oct_target'(){
            this.getAvarage()
        },
        'form.nov_target'(){
            this.getAvarage()
        },
        'form.dec_target'(){
            this.getAvarage()
        }
    },
    methods: {
        getAvarage(){
            if(this.form.status){
                this.form.avarage = this.form.jan_target
            }else{
                if(this.form.jan_target!='' && this.form.feb_target!=''&& this.form.mar_target!=''&& this.form.apr_target!=''&& 
                    this.form.may_target!=''&& this.form.june_target!=''&& this.form.july_target!=''&& this.form.aug_target!=''
                    && this.form.sept_target!=''&& this.form.oct_target!=''&& this.form.nov_target!=''&& this.form.dec_target!=''){
                        if(this.form.jan_target.indexOf('%')==-1 && this.form.feb_target.indexOf('%')==-1&& this.form.mar_target.indexOf('%')==-1
                            && this.form.apr_target.indexOf('%')==-1&& this.form.may_target.indexOf('%')==-1&& this.form.june_target.indexOf('%')==-1
                            && this.form.july_target.indexOf('%')==-1&& this.form.aug_target.indexOf('%')==-1&& this.form.sept_target.indexOf('%')==-1
                            && this.form.oct_target.indexOf('%')==-1&& this.form.nov_target.indexOf('%')==-1&& this.form.dec_target.indexOf('%')==-1){
                                this.form.avarage = ((+this.form.feb_target + +this.form.mar_target+ +this.form.apr_target+ +this.form.may_target+ +this.form.june_target+ 
                                +this.form.july_target+ +this.form.aug_target+ +this.form.sept_target+ +this.form.oct_target+ +this.form.nov_target+ +this.form.dec_target+
                                +this.form.jan_target)/12).toFixed(2)
                        }else{
                            this.form.avarage = ''
                            if(this.form.jan_target.indexOf('%')!=-1 && this.form.feb_target.indexOf('%')!=-1&& this.form.mar_target.indexOf('%')!=-1
                                && this.form.apr_target.indexOf('%')!=-1&& this.form.may_target.indexOf('%')!=-1&& this.form.june_target.indexOf('%')!=-1
                                && this.form.july_target.indexOf('%')!=-1&& this.form.aug_target.indexOf('%')!=-1&& this.form.sept_target.indexOf('%')!=-1
                                && this.form.oct_target.indexOf('%')!=-1&& this.form.nov_target.indexOf('%')!=-1&& this.form.dec_target.indexOf('%')!=-1){
                                    this.form.avarage = (((+(this.form.feb_target.split('%')[0])+ +(this.form.mar_target.split('%')[0])+ 
                                    +(this.form.apr_target.split('%')[0])+ +(this.form.may_target.split('%')[0])+ 
                                    +(this.form.june_target.split('%')[0])+ +(this.form.july_target.split('%')[0])+ 
                                    +(this.form.aug_target.split('%')[0])+ +(this.form.sept_target.split('%')[0])+ +(this.form.oct_target.split('%')[0])+
                                    +(this.form.nov_target.split('%')[0])+ +(this.form.dec_target.split('%')[0])+ +(this.form.jan_target.split('%')[0]))/12).toFixed(2))+'%'
                            }
                        }
                }
            }
        },
        async add(){
            await this.$request.get('performance/parameter/name/add?department='+this.id)
            this.form = {
                avarage: '',
                year:  dayjs().format('YYYY'),
                jan_target: '',
                feb_target: '',
                mar_target: '',
                apr_target: '',
                may_target: '',
                june_target: '',
                july_target: '',
                aug_target: '',
                sept_target: '',
                oct_target: '',
                nov_target: '',
                dec_target: '',
            }
            this.dialogFormVisible = true
            let attenData = await this.$request.get('performance/year/parameter?department='+this.id)
            this.attenData = attenData.map(o=>{return {label:o.parameter_name,value:o.id}})
            this.$nextTick(()=>{
                this.$refs['form'].clearValidate()
            })
        },
        async edit(){
            let attenData = await this.$request.get('performance/year/parameter?department='+this.id)
            this.attenData = attenData.map(o=>{return {label:o.parameter_name,value:o.id}})
            this.dialogFormVisible = true
            let row = this.table_selectedRows[0]
            this.form = (await api_resource.find(row.id))[0]
            this.form.status = Boolean(this.form.status)
            this.getAvarage()
        },
        async handleFormSubmit(){
            await this.form_validate()
            this.form.department = this.id
            this.form.status = +this.form.status
            delete this.form.avarage
            let form = Object.assign({},this.form)
            if(this.isInsert){
                try{
                    await api_resource.create(form)
                    this.dialogFormVisible = false
                    this.fetchTableData()
                }catch(err){
                    this.$message.error(err.field[0]);
                }
            }else{
                await api_resource.update(form.id,form)
                this.dialogFormVisible = false
                this.fetch()
            }
            if(this.form_multiple){
                this.fetchTableData()
            }else{
                this.dialogFormVisible = false
                this.fetchTableData()
            }  
            // await api_resource.create(form)
            // this.fetch()
            // this.dialogFormVisible = false
        },
        async delete(){
            let row = this.table_selectedRows.map(row=>row.id)
            await this.$request.delete('performance/year/parameter/value/destroys?ids='+row.join(','))
            this.fetch()
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
			const { field, action,table } = await api_common.menuInit('YearParameterValue');
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