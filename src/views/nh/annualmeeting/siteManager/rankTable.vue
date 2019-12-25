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
                                <form-render :type="`select`" prop="type_id" :field="{name:'物品类别',options:typeList}" v-model="form.type_id" :disabled="!isInsert"/>
                            </el-col>
                            <el-col :span="16" :offset="4">
                                <form-render :type="`input`" prop="title" :field="{name:'物品名称'}" v-model="form.title" :disabled="!isInsert"/>
                            </el-col>
                            <el-col :span="16" :offset="4">
                                <form-render :type="`input`" prop="unit" :field="{name:'物品单位'}" v-model="form.unit"/>
                            </el-col>
                            <el-col :span="16" :offset="4">
                                <form-render :type="`radio`" prop="is_fee" :field="{name:'是否扣费',options:[
                                    {
                                        value: 1,
                                        label: '是'
                                    },
                                    {
                                        value: 0,
                                        label: '否'
                                    }
                                ]}" v-model="form.is_fee"/>
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
                                        <el-input v-model="suk.size" :disabled="!isInsert&&suk.lock==true"></el-input>
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

        <table-header
            :table_actions="table_actions"
            :table_selectedRows="table_selectedRows"
            @action="handleAction"
            :table_form.sync="table_form"
            :table_column="table_field"
        >
            <div style="padding-left:10px">
                <dateLap type="3" v-model="table_form.dateLap" @change="fetch" :disabled="true"/>
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
// const api_resource = api_common.resource("invitation/sitemanager/rank");
let baseUrl = process.env.VUE_APP_STATIC
let baseUri = process.env.VUE_APP_BASEAPI
const download = require('downloadjs')
import dayjs from 'dayjs'
export default {
    mixins: [table_mixin],
    props:['org_id','url'],
    data() {
        const defaultForm = () => {
            return {
                sku_info: [{
                    size: '',
                    price:'',
                    allStock:''
                }],
                is_fee: 1
            }
        }
        return {
            baseUrl,
            baseUri,
            loading: false,
            form:{},
            defaultForm,
            api_resource: api_common.resource(this.url),
            queryDialogFormVisible:true,
            table_topHeight:280,
            dialogFormVisible:false,
            dialogForm1Visible:false,
            dialogForm2Visible:false,
            form1:{
               add_number:'',
               check_number:''
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
            },
            checkList:[],
            template:{
                image(row,column){
                    if(column.image!=''&&column.image!=undefined){
                        return <img src={baseUrl+column.image} width="30" height="30"></img>
                    }
                }
            },
            typeList:[],
            dialogStatus:'',
            sizeList:[],
			timer:'',
			uri:'',
            statusk:1,
            importUploadUrl:'/toolstationery/inventory/upload',
            downloadUrl:'/toolstationery/inventory/upload',
            type_id:'',
            title:'',
        };
    },
    watch:{
        org_id(){
            this.table_form.currentpage = 1
            this.fetchTableData()
        },
        url(){
            this.api_resource = api_common.resource(this.url)
			delete this.table_form.keyword
			this.table_form.currentpage = 1
			this.table_form.query.query= []
			this.fetchMenu()
        }
    },
    computed:{
        disabled(){
            if((this.dialogStatus=='warehouse'&&this.form1.add_number!=''&&this.form1.add_number!=undefined)||
            (this.dialogStatus=='inventory'&&this.form1.check_number!=''&&this.form1.check_number!=undefined)){
                return false
            }else{
                return true
            }
        }
    },
    methods: {
        async getUrl(){
			if(this.statusk!=0){
                this.url = await this.$request.get('invitation/sitemanager/download',{alert:false})
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
                let mes = await this.$request.post('invitation/sitemanager/download',{dateLap:this.table_form.dateLap})
                this.$message.success(mes);
				this.timer = setInterval(()=>{
					this.getUrl()
				}, 10000)
			}catch(err){
				console.log(err)
			}
		},
        async reset(){
            let mes = await this.$request.post('invitation/sitemanager/reset',{year:this.table_form.dateLap})
            this.$message.success({message:mes});
            this.fetchTableData();
        },
		fetch(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
        async getSize(){
            this.sizeList = (await this.$request.get('toolstationery/inventory/pulldownbytitle?type_id='+this.type_id+'&title='+this.title))
            .map(o=>{return {label:o.size,value:o.id}});
        },
        async getType(){
            this.typeList = (await this.$request.get('toolstationery/type')).map(o=>{return {label:o.title,value:o.id}});
        },
        // add(){
        //     this.getType()
        //     this.form = this.defaultForm()
        //     this.dialogFormVisible = true
        // },
        // async edit(){
        //     this.getType()
        //     let row = this.table_selectedRows[0];
        //     this.form = (await api_resource.find(row.id))[0]
        //     this.dialogFormVisible = true
        // },
        async handleFormSubmit(){
            await this.form_validate()
            let form = Object.assign({},this.form)
            if(this.dialogStatus=='insert'){
                let mess = await this.api_resource.create(form)
                this.$message.success(mess);
                this.fetch()
                this.dialogFormVisible = false
            }else{
                await this.api_resource.update(form.id,form)
                // await this.$request.put('toolstationery/inventory',form)
                this.fetch()
                this.dialogFormVisible = false
            }
        },
        async fetchTableData() {
            this.table_loading = true;
            this.table_form.org_id  = this.org_id
            const {rows , total }= await this.api_resource.get(this.table_form);
            this.table_data  = rows
            this.table_form.total = total
            setTimeout(() => {
                this.table_loading = false;
            }, 300);
        },
		async fetchMenu(){
			const { field, action,table } = await api_common.menuInit(this.url);
			this.table_field = field;
			this.table_actions = action;
			this.table_config = table
			this.fetchTableData()
		}
    },
    async created() {
		this.table_form.dateLap = dayjs().format('YYYY')
		await this.fetchMenu()
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