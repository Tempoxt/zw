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
            <el-form ref="form" :model="form"  label-width="110px" :rules="rules">
				<el-row >
					<el-col :span="18">
						<form-render :type="`input`" :field="{name:'设备ID',options:deviceData}" v-model="form.id" />
					</el-col>
					<el-col :span="18">
						<form-render :type="`input`" multiple :field="{name:'设备名称',options:nameData}" v-model="form.device" />
					</el-col>
                    <el-col :span="18">
                        <form-render :type="`number`" :field="{name:'顺序'}" v-model="form.sort"/>
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
                    <el-button type="primary" @click="handleFormSubmit" :disabled="disabled">确 定</el-button>
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
import { setTimeout } from 'timers';
import OrgSelect from '@/components/Org/OrgSelect'
const api_resource = api_common.resource("devicemanager/devicelistmanage");
export default {
    mixins: [table_mixin],
    props:['id','changes'],
    components:{
        OrgSelect
    },
    data() {
        return {
            loading: false,
            form:{},
            api_resource,
            queryDialogFormVisible:true,
            table_topHeight:220,
            dialogFormVisible:false,
            deviceData:[],
            nameData:[],
            rules:{
                type:[
                    { required: true, message: '请选择', trigger:  ['blur','change'] },
                ],
                device:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
            }
        };
    },
    computed:{
        disabled(){
            if(this.form.id!==''&&this.form.device!==''&&this.form.sort!==''){
                return false
            }
            return true
        }
    },
    watch:{
        id(){
            this.table_form.currentpage = 1
            this.fetchTableData()
        },
        'form.type'(){
            this.form.device = ''
            if(this.form.type!==''){
                this.getName()
            }
        }
    },
    methods: {
        async fetchTableData() {
            // if(!this.id){
            //     return 
            // }
            this.table_loading = true;
            this.table_form.orgid = this.id
            const {rows , total }= await api_resource.get(this.table_form);
            this.table_data  = rows
            this.table_form.total = total
            setTimeout(() => {
                this.table_loading = false;
            }, 300);
        },
        async delete(){
            let rows = this.table_selectedRows.map(row=>row.id)
            await this.$request.get('devicemanager/devicelistmanage/bluk?ids='+rows.join(','))
            this.$message.success({message:'删除成功'})
            this.fetchTableData();
        },
        async getDevice(){
            this.deviceData = (await this.$request.get('devicemanager/getdevicetype')).map(o=>{return {label:o.name,value:o.value}})
        },
        async getName(){
            this.nameData = (await this.$request.get('devicemanager/getmechinebytype?deviceType='+this.type)).map(o=>{return {label:o.name,value:o.value}})
        },
        add(){
            this.form = {}
            this.getDevice()
            this.dialogFormVisible = true
        },
        async handleFormSubmit(){
            await this.form_validate()
            let form = Object.assign({},this.form)
            if(this.isInsert){
                await api_resource.create(form)
            }else{
                await api_resource.update(form.id,form)
            }
            if(this.isInsert&&this.form_multiple){

            }
            // await this.throwFormError(api_resource.create(this.form))
            // this.dialogFormVisible = _.stubFalse()
            this.dialogFormVisible = true
            this.fetchTableData()
        }
    },
    async created() {
        const { field, action,table } = await api_common.menuInit("devicemanager/devicelistmanage");
        this.table_field = field;
        this.table_actions = action;
        this.table_config = table
        this.fetchTableData();
    },
};
</script>