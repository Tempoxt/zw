<template>
    <ui-table ref="table" 
        :table_column="table_field" 
        :table_query.sync="table_form.query"
        @query="querySubmit"
        >
       
        <el-dialog
            :title="dialogStatus==='insert'?'批量分配':'编辑'"
            :visible.sync="dialogFormVisible"
            class="public-dialog"
            v-el-drag-dialog
            width="750px"
            >
            <div style="width:710px;margin:0 auto">
                <el-form ref="form" :model="form" label-width="100px" :rules="rules">
                    <el-row>
                        <el-col :span="12">
                            <form-render :type="`select`" prop="staffType" :field="{name:'类型',options:typeData}" v-model="form.staffType" :disabled="!isInsert"/>
                        </el-col>
                        <el-col :span="12">
                            <form-render :type="`select`" prop="deckCode" :field="{name:'类型',options:deckData}" v-model="form.deckCode" :disabled="!isInsert"/>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <!-- <el-col :span="24">
                            <el-transfer
                                style="text-align: left; display: inline-block"
                                v-model="checked"
                                filterable
                                :titles="['待排位人员', '已排位人员']"
                                :props="{
                                    key: 'id',
                                }"
                                :format="{
                                    noChecked: '${total}',
                                    hasChecked: '${checked}/${total}'
                                }"
                                :data="rankData"
                                :filter-method="filterMethod"
                                >
                                <span slot-scope="{ option }">{{ option.employeeCode }}  {{ option.chineseName }} {{ option.department }} </span>
                                <div slot="right-footer" class="transfer-footer">
                                    <span>房号</span>
                                    <span>{{data.roomName}}</span>
                                    <span>{{data.totalBeds}}</span>
                                    <span>-</span>
                                    <span>{{data.totalBeds-(data.totalBeds - checked.length)}} </span>
                                    <div style="color:red;font-size:12px" v-if="checked.length>data.totalBeds">超出床位数</div>

                                </div>
                                <el-button class="transfer-footer" slot="titles" size="small">操作</el-button>
                            </el-transfer>
                        </el-col> -->
                    </el-row>
                </el-form>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <!-- <el-button type="primary" @click="handleFormSubmit" :disabled="checked.length>data.totalBeds">确 定</el-button> -->
                <el-button type="primary" @click="handleFormSubmit" >确 定</el-button>
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
let baseUrl = process.env.VUE_APP_STATIC
let baseUri = process.env.VUE_APP_BASEAPI
const download = require('downloadjs')
import dayjs from 'dayjs'
export default {
    mixins: [table_mixin],
    props:['org_id','url'],
    data() {
        return {
            baseUrl,
            baseUri,
            loading: false,
            form:{},
            api_resource: api_common.resource(this.url),
            queryDialogFormVisible:true,
            table_topHeight:280,
            dialogFormVisible:false,
            rules:{
                type_id:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
                deckCode:[
                    { required: true, message: '请输入', trigger: ['blur','change'] },
                ],
            },
			timer:'',
			uri:'',
            statusk:1,
            importUploadUrl:'/toolstationery/inventory/upload',
            downloadUrl:'/toolstationery/inventory/upload',
            type_id:'',
            title:'',
            checked: [],
            template:{
                signDesc(row,column){
                    if(column.signDesc=='未到场'){
                        return <el-tag size="mini" type="warning">{column.signDesc}</el-tag>
                    }else{
                        return <el-tag size="mini" type="success">{column.signDesc}</el-tag>
                    }
                }
            },
            alRank:[],
            deckData:[],
            typeData:[],
            rankData:[]
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
        // disabled(){
            
        // }
    },
    methods: {
		filterMethod(query, item){
			return (item.employeeCode+'').indexOf(query) > -1|| (item.chineseName+'').indexOf(query) > -1;
		},
        async getUrl(){
			if(this.statusk!=0){
                this.uri = await this.$request.get('invitation/sitemanager/download',{alert:false})
                if(this.uri!=''){
                    const res = download(baseUri+'/'+this.uri)
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
		async getType(){
 			this.typeData = (await this.$request.get('invitation/sitemanager/siteset/stafftypelist')).map(o=>{return {label:o.staffTypeDesc,value:o.staffType}})
		},
        async add(){
            // this.getType()
			// let { rows } = await this.$request.get('dormitory/checkinemp',{params:{dormType:1}})
			// let { rows : rows2 } = await this.$request.get('dormitory/alreadycheckinemp',{params:{roomId:8}})
			// rows2.forEach(o=>o.disabled = true)
			// this.checked = rows2.map(o=>o.id)
			// this.alRank = rows2
			// rows = rows.concat(rows2)
			// this.distributionData = rows
			// this.dialogLoading = false
            // this.dialogFormVisible = true
        },
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