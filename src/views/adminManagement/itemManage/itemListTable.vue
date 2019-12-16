<template>
    <ui-table ref="table" 
        :table_column="table_field" 
        :table_query.sync="table_form.query"
        @query="querySubmit"
        >
        <el-dialog
            :title="dialogStatus==='insert'?'添加物品':'编辑物品'"
            :visible.sync="dialogFormVisible"
            class="public-dialog"
            v-el-drag-dialog
		    width="800px"
            >
           	<div>
                <el-form ref="form" :model="form" label-width="70px" :rules="rules">
                        <el-row :gutter="20">
                            <el-col :span="16" :offset="4">
                                <form-render :type="`select`" prop="type_id" :field="{name:'物品类别',options:typeList}" v-model="form.type_id"/>
                            </el-col>
                            <el-col :span="16" :offset="4">
                                <form-render :type="`input`" prop="title" :field="{name:'物品名称'}" v-model="form.title"/>
                            </el-col>
                            <el-col :span="16" :offset="4">
                                <form-render :type="`input`" prop="unit" :field="{name:'物品单位'}" v-model="form.unit"/>
                            </el-col>
                            <el-col :span="16" :offset="4">
                                <form-render :type="`img`" prop="image" :data="{'upload_msg':'article_photo'}" :field="{name:'图片'}" v-model="form.image"/>
                            </el-col>
                        </el-row>
                        <div style="border-top: 1px solid #E4E4E4;padding-top: 30px;">
                            <el-row v-for="(suk,i) in form.sku_info" :key="i" :gutter="10">
                                <el-col :span="7">
                                    <el-form-item
                                        :prop="'sku_info.' + i + '.size'"
                                        label="规格"
                                        :rules="{ required: true, message: '请输入', trigger: 'blur' }"
                                        >
                                        <el-input v-model="suk.size"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="7">
                                    <el-form-item
                                        :prop="'sku_info.' + i + '.price'"
                                        label="单价/元"
                                        :rules="[
                                            { required: true, validator: checkNumber, trigger: 'blur' }
                                        ]"
                                        >
                                        <el-input v-model="suk.price"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="7">
                                    <el-form-item
                                        :prop="'sku_info.' + i + '.allStock'"
                                        label="初始库存"
                                        :rules="[
                                            { required: true, validator: checkNumber1, trigger: 'blur' }
                                        ]"
                                        >
                                        <el-input v-model="suk.allStock" :disabled="!isInsert&&suk.disabled!=false"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="3">
                                    <el-button icon="el-icon-plus" circle @click="addSku" v-if="i==0"></el-button>
                                    <el-button icon="el-icon-minus" circle @click="deleteSku(suk)" v-else></el-button>
                                </el-col>
                            </el-row>
                        </div>
                </el-form>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleFormSubmit">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog
            :title="dialogStatus==='warehouse'?'物品入库':'物品盘点'"
            :visible.sync="dialogForm1Visible"
            class="public-dialog"
            v-el-drag-dialog
		    width="800px"
            >
           	<div>
                <el-form ref="form1" :model="form1" label-width="70px" :rules="rules1">
                    <el-row :gutter="20">
                        <el-col :span="16" :offset="4">
                            <form-render :type="`input`" prop="type_id" :field="{name:'物品名称'}" :disabled="true" v-model="form1.title"/>
                        </el-col>
                        <el-col :span="16" :offset="4">
                            <form-render :type="`input`" prop="title" :field="{name:'仓库库存'}" :disabled="true" v-model="form1.allStock"/>
                        </el-col>
                        <el-col :span="16" :offset="4">
                            <form-render :type="`select`" prop="size" :field="{name:'规格',options:sizeList}" v-model="form1.size"/>
                        </el-col>
                        <el-col :span="16" :offset="4" v-if="dialogStatus=='warehouse'">
                            <form-render :type="`input`" prop="add_number" :field="{name:'入库数量'}" v-model="form1.add_number"/>
                        </el-col>
                        <el-col :span="16" :offset="4" v-if="dialogStatus=='inventory'">
                            <form-render :type="`input`" prop="check_number" :field="{name:'盘点数量'}" v-model="form1.check_number"/>
                        </el-col>
                    </el-row>
                </el-form>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogForm1Visible = false">取 消</el-button>
                <el-button type="primary" @click="handleForm1Submit" :disabled="disabled1">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog
            title="设定标准用量"
            :visible.sync="dialogForm2Visible"
            class="public-dialog"
            v-el-drag-dialog
		    width="800px"
            >
           	<div class="h-full">
                <el-form ref="form2" :model="form2" label-width="110px" class="h-full" style="height:630px;margin:0 10px;">
                    <el-scrollbar wrap-class="scrollbar-wrapper" class="scroll"> 
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <form-render :type="`input`" :field="{name:'名称'}" :disabled="true" v-model="form2.title"/>
                            </el-col>
                            <el-col :span="12">
                                <form-render :type="`select`" :field="{name:'规格',options:sizeList}" v-model="form2.size"/>
                            </el-col>
                        </el-row>
                        <div style="border-top: 1px solid #E4E4E4;padding-top: 30px;">
                            <el-row :gutter="10">
                                <el-col :span="12" v-for="(depart,i) in form2.depart_info" :key="i" >
                                    <el-form-item
                                        :prop="'depart_info.' + i + '.dose'"
                                        :label="depart.depart_name"
                                        >
                                        <el-input v-model="depart.dose"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </div>
                    </el-scrollbar>
                </el-form>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogForm2Visible = false">取 消</el-button>
                <el-button type="primary" @click="handleForm2Submit">确 定</el-button>
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
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button @click="setStandard(scope.row)" type="primary" size="mini">设定标准用量</el-button>
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
const api_resource = api_common.resource("toolstationery/inventory");
let baseUrl = process.env.VUE_APP_STATIC
let baseUri = process.env.VUE_APP_BASEAPI
const download = require('downloadjs')
export default {
    mixins: [table_mixin],
    props:['org_id','changes'],
    data() {
        const defaultForm = () => {
            return {
                sku_info: [{
                    size: '',
                    price:'',
                    allStock:''
                }],
            }
        }
        var checkNumber2 = (rule, value, callback)=>{
			if (!value) {
				return callback(new Error('请输入'));
			}else if (!(/^[0-9]*[1-9][0-9]*$/.test(value))) {
				callback(new Error('请输入正整数'));
			}else{
				callback();
			}
		}
        return {
            baseUrl,
            baseUri,
            loading: false,
            form:{},
            defaultForm,
            api_resource,
            queryDialogFormVisible:true,
            table_topHeight:220,
            dialogFormVisible:false,
            dialogForm1Visible:false,
            dialogForm2Visible:false,
            form1:{
                size:'',
                num:'',
                num1:''
            },
            form2:{},
            deviceData:[],
            nameData:[],
            typew:'',
            rules:{
                type_id:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
                title:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                ],
                unit:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                ],
                image:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
            },
            checkList:[],
            template:{
                image(row,column){
                    if(column.image!=''&&column.image!=undefined){
                        return <img src={baseUrl+column.image} width="50" height="50"></img>
                    }
                }
            },
            typeList:[],
            dialogStatus:'',
            rules1:{
                size:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
                add_number:[
                    { required: true, message: '请输入', trigger: ['blur','change'], },
                    { validator: checkNumber2, trigger: 'blur' }
                ],
                check_number:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                    { validator: checkNumber2, trigger: 'blur' }
                ],
            },
            sizeList:[],
			timer:'',
			url:'',
            statusk:1,
            importUploadUrl:'/toolstationery/inventory/upload',
            downloadUrl:'/toolstationery/inventory/upload',
            type_id:'',
            title:'',
        };
    },
    computed:{
        disabled1(){
            // if(this.dialogStatus=='warehouse'){
            //     if(this.form1.size!=''&&this.form1.add_number!=''){
            //         return false
            //     }
            //     return true
            // }else if(this.dialogStatus=='inventory'){
            //     if(this.form1.size!=''&&this.form1.check_number!=''){
            //         return false
            //     }
            //     return true
            // }
        }
    },
    watch:{
        org_id(){
            this.table_form.currentpage = 1
            this.fetchTableData()
        },
        changes(){
            if(this.changes==true){
                this.table_form.currentpage = 1
                this.fetchTableData()
            }
        }
    },
    methods: {
        async getUrl(){
			if(this.statusk!=0){
                this.url = await this.$request.get('toolstationery/inventory/download',{alert:false})
                if(this.url!=''){
                    const res = download(baseUri+'/'+this.url)
                    this.statusk = 0
                }
			}else{
				clearInterval(this.timer)
			}
		},
		async download(){
			this.statusk = 1
			if(this.timer!=''){
				clearInterval(this.timer)
			}
			try{
                let mes = await this.$request.post('toolstationery/inventory/download')
                this.$message.success(mes);
				this.timer = setInterval(()=>{
					this.getUrl()
				}, 10000)
			}catch(err){
				console.log(err)
			}
		},
        checkNumber(rule, value, callback){
			if (!value) {
				return callback(new Error('请输入'));
			}else if (!(/^\d+(\.\d{1,2})?$/.test(value))) {
				callback(new Error('请输入精度为两位小数以内的正数'));
			}else{
				callback();
			}
		},
        checkNumber1(rule, value, callback){
			if (!value) {
				return callback(new Error('请输入'));
			}else if (!(/^[0-9]*[1-9][0-9]*$/.test(value))) {
				callback(new Error('请输入正整数'));
			}else{
				callback();
			}
        },
		fetch(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
        async getType(){
            this.typeList = (await this.$request.get('toolstationery/type')).map(o=>{return {label:o.title,value:o.id}});
        },
        add(){
            this.getType()
            this.form = this.defaultForm()
            this.dialogFormVisible = true
        },
        async edit(){
            this.getType()
            let row = this.table_selectedRows[0];
            this.form = (await api_resource.find(row.id))[0]
            this.dialogFormVisible = true
        },
        addSku(){
            if(this.dialogStatus=='insert'){
                this.form.sku_info.push({
                    size: '',
                    price:'',
                    allStock:'',
                });
            }else{
                this.form.sku_info.push({
                    size: '',
                    price:'',
                    allStock:'',
                    record_id:null,
                    disabled:false
                });
            }
        },
        deleteSku(item) {
            var index = this.form.sku_info.indexOf(item)
            if (index !== -1) {
                this.form.sku_info.splice(index, 1)
            }
        },
        async delete(){
            let rows = this.table_selectedRows.map(row=>row.id)
            const mes = await this.$request.get('/toolstationery/inventory/bluk?ids='+rows.join(','));
            this.$message.success({message:mes});
            this.fetchTableData();
        },
        async handleFormSubmit(){
            await this.form_validate()
            let form = Object.assign({},this.form)
            if(this.form.image==undefined||this.form.image==''){
                this.$message.error('请上传图片');
                return
            }
            if(this.dialogStatus=='insert'){
                let mess = await api_resource.create(form)
                this.$message.success(mess);
                this.fetch()
                this.dialogFormVisible = false
            }else{
                await this.$request.put('toolstationery/inventory',form)
                this.fetch()
                this.dialogFormVisible = false
            }
        },
        async getSize(){
            this.sizeList = (await this.$request.get('toolstationery/inventory/pulldownbytitle?type_id='+this.type_id+'&title='+this.title))
            .map(o=>{return {label:o.size,value:o.id}});
        },
        async warehouse(){
            let row = this.table_selectedRows[0];
            this.form1 = (await this.$request.get('toolstationery/inventory/detail?article_id='+row.id))[0]
            this.type_id = this.form1.type_id
            this.title = this.form1.title
            this.getSize()
            delete this.form1.add_number
            delete this.form1.check_number
            this.form1.size = ''
			this.$nextTick(()=>{
				this.$refs['form1'].clearValidate()
			})
            this.dialogStatus='warehouse'
            this.dialogForm1Visible = true
        },
        async inventory(){
            let row = this.table_selectedRows[0];
            this.form1 = (await this.$request.get('toolstationery/inventory/detail?article_id='+row.id))[0]
            this.type_id = this.form1.type_id
            this.title = this.form1.title
            this.getSize()
            delete this.form1.add_number
            delete this.form1.check_number
            this.form1.size = ''
			this.$nextTick(()=>{
				this.$refs['form1'].clearValidate()
			})
            this.dialogStatus='inventory'
            this.dialogForm1Visible = true
        },
        async handleForm1Submit(){
            let form1 = Object.assign({},this.form1)
            if(this.dialogStatus=='warehouse'){
                let mess = await this.$request.post('toolstationery/inventory/intowarehouse',form1)
                this.$message.success(mess);
                this.fetch()
                this.dialogForm1Visible = false
            }else if(this.dialogStatus=='inventory'){
                let mess = await this.$request.post('toolstationery/inventory/takestock',form1)
                this.$message.success(mess);
                this.fetch()
                this.dialogForm1Visible = false
            }
        },
        async setStandard(row){
            this.form2 = await this.$request.get('toolstationery/inventory/setstandard?article_id='+row.id)
            this.type_id = this.form2.type_id
            this.title = this.form2.title
            this.getSize()
            this.dialogForm2Visible = true
        },
        async handleForm2Submit(){
            let form2 = Object.assign({},this.form2)
            let mess = await this.$request.post('toolstationery/inventory/setstandard',form2)
            this.$message.success(mess);
            this.fetch()
            this.dialogForm2Visible = false
        },
        async fetchTableData() {
            if(this.org_id==''){
                return 
            }
            this.table_loading = true;
            this.table_form.org_id  = this.org_id
            const {rows , total }= await api_resource.get(this.table_form);
            this.table_data  = rows
            this.table_form.total = total
            setTimeout(() => {
                this.table_loading = false;
            }, 300);
        },
    },
    async created() {
        const { field, action,table } = await api_common.menuInit("toolstationery/inventory");
        this.table_field = field;
        this.table_actions = action;
        this.table_config = table
        this.fetchTableData();
    },
};
</script>
<style lang="scss" scoped>
.scroll {
  height: calc(100%);
  width: 100%;

 /deep/ .scrollbar-wrapper {
    overflow-x: hidden;
  }
}
</style>