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
            width="800px"
            >
            <div style="margin:0 auto">
                <el-form ref="form" :model="form" label-width="55px" :rules="rules">
                    <el-row>
                        <el-col :span="10">
                            <form-render :type="`select`" prop="staffTypeId" :field="{name:'类型',options:typeData}" v-model="form.staffTypeId"/>
                        </el-col>
                        <el-col :span="10" :offset="3">
                            <form-render :type="`select`" prop="deckCode" :field="{name:'桌号',options:deckData}" v-model="form.deckCode" filterable/>
                        </el-col>
                    </el-row>
                    <el-divider></el-divider>
                    <el-row :gutter="20">
                        <el-col :span="24" class="transfer">
                            <el-transfer
                                style="text-align: left; display: inline-block"
                                v-model="checked"
                                filterable
                                :titles="['待排位人员', '已排位人员']"
                                :props="{
                                    key: 'id',
                                }"
                                :format="{
                                    noChecked: '',
                                    hasChecked: ''
                                }"
                                :data="rankData"
                                :filter-method="filterMethod"
                                @left-check-change = "leftCheckChange"
                                @change = "handleChange"
                                >
                                <span slot-scope="{ option }">{{ option.employeeCode }}  {{ option.chineseName }} &nbsp;&nbsp;{{ option.peopleCount }} 人</span>
                                <div slot="right-footer" class="transfer-footer">
                                    <span>已分配</span>
                                    <span>10 - {{peopleCount1}}</span>
                                    <div style="margin-left:8px;color:red;font-size:12px" v-if="peopleCount1>10">超出坐席数</div>
                                </div>
                            </el-transfer>
                        </el-col>
                    </el-row>
                </el-form>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleFormSubmit" :disabled="peopleCount1>10">确 定</el-button>
                <!-- <el-button type="primary" @click="handleFormSubmit" >确 定</el-button> -->
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
        <div v-if="this.url=='invitation/sitemanager/rank'" style="margin:10px 0 0 10px;">
            <span>总到场：{{total_sign}}&nbsp;&nbsp;&nbsp;已到场：{{early_sign}}&nbsp;&nbsp;&nbsp;未到场：{{wait_sign}}</span>
        </div>
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
            table_topHeight:300,
            dialogFormVisible:false,
            rules:{
                staffTypeId:[
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
            rankData:[],
            total_sign:'',
            wait_sign:'',
            early_sign:'',
            al:'0',
            ai:'0',
            peopleCount:[],
            allRank:[],
            all:[],
            peopleCount1:0
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
            delete this.table_form.sortname
			this.table_form.currentpage = 1
			this.table_form.query.query= []
            this.fetchMenu()
        },
        'form.staffTypeId'(){
            if(this.form.staffTypeId!=''&&this.form.staffTypeId!=null&&this.form.deckCode!=''&&this.form.deckCode!=null){
                this.getRankData()
                this.$nextTick(()=>{
                    this.$refs['form'].clearValidate()
                })
            }
        },
        'form.deckCode'(){
            if(this.form.staffTypeId!=''&&this.form.staffTypeId!=null&&this.form.deckCode!=''&&this.form.deckCode!=null){
                this.getRankData()
                this.$nextTick(()=>{
                    this.$refs['form'].clearValidate()
                })
            }
        },
    },
    methods: {
        handleChange(value, direction, movedKeys) {
            this.all = []
            if(this.checked!=[]){
                value.concat(this.checked)
            }
            value.forEach(o=>{
                let curr = this.rankData.filter(k=>k.id==o)
                this.all.push(curr[0])
            })
            let peopleCount = this.all.map(o=>o.peopleCount);
            this.peopleCount1 = peopleCount.reduce((pre,next)=>pre+next)
        },
        leftCheckChange(){

        },
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
            this.typeData = (await this.$request.get('invitation/departdraw/stafftypelist')).map(o=>{return {label:o.staffTypeTitle,value:o.staffTypeId}})
            this.deckData = (await this.$request.get('invitation/departdraw/reservedtable')).map(o=>{return {label:o.deckCodeDesc,value:o.deckCode}})
        },
        async getRankData(){
            let rows  = await this.$request.get('invitation/departdraw/getstaffbytype',{params:{staffTypeId:this.form.staffTypeId}})
            this.allRank = rows
			let rows2 = await this.$request.get('invitation/departdraw/getstaffbytable',{params:{deckCode:this.form.deckCode}})
			rows2.forEach(o=>o.disabled = true)
            this.checked = rows2.map(o=>o.id)
            if(rows2.length!=0){
                this.peopleCount = rows2.map(o=>o.peopleCount)
                this.peopleCount1 = this.peopleCount.reduce((pre,next)=>pre+next)
            }
			this.alRank = rows2
			rows = rows.concat(rows2)
            this.rankData = rows
        },
        async add(){
            this.form = {}
            this.getType()
            this.rankData = []
            this.dialogFormVisible = true
        },
        async edit(){
            this.rankData = []
            let row = this.table_selectedRows[0];
            this.getType()
            this.form = {
                staffTypeId: row.deckType,
                deckCode: row.deckCodeNumber
            }
            this.getRankData()
            this.$nextTick(()=>{
                this.$refs['form'].clearValidate()
            })
            this.dialogFormVisible = true
        },
        async handleFormSubmit(){
            await this.form_validate()
            this.form.ids = this.checked.filter(id=>{
				return  !this.alRank.map(o=>o.id).includes(id)
			}).join(',')
            let form = Object.assign({},this.form)
            let mess = await this.$request.post('invitation/departdraw/reserved',form)
            this.$message.success(mess);
            this.fetch()
            this.dialogFormVisible = false
        },
        async fetchTableData() {
            this.table_topHeight = this.url=='invitation/sitemanager/rank'?300:280
            this.table_loading = true;
            this.table_form.org_id  = this.org_id
            const {rows , total ,total_sign,wait_sign,early_sign }= await this.api_resource.get(this.table_form);
            this.table_data  = rows
            this.table_form.total = total
            this.total_sign = total_sign
            this.wait_sign = wait_sign
            this.early_sign = early_sign
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
<style>
.transfer .el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label span{
    color: transparent;
    display: none;
}
</style>
<style lang="scss" scoped>
.scroll {
  height: calc(100%);
  width: 100%;

 /deep/ .scrollbar-wrapper {
    overflow-x: hidden;
  }
}
.transfer-footer {
    display: flex;
    height: 100%;
    align-items: center;
    span {
        padding-left: 6px;
    }
}
.public-dialog {
    /deep/ .el-transfer-panel {
        width: 330px;
    }
    /deep/ .el-transfer-panel__body {
        height: 370px;
    }
    /deep/ .el-transfer-panel__list.is-filterable {
        height: 320px !important;
    }
}
</style>