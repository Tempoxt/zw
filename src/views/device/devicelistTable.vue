<template>
    <ui-table ref="table" 
        :table_column="table_field" 
        :table_query.sync="table_form.query"
        @query="querySubmit"
        >
        <el-dialog
            :title="dialogStatus==='insert'?'添加设备':'编辑设备'"
            :visible.sync="dialogFormVisible"
            class="public-dialog"
            v-el-drag-dialog
            >
                 <el-form ref="form" :model="form" label-width="110px" :rules="rules">
                    <el-row :gutter="20">
                        <el-col :span="20" :offset="2">
                            <form-render :type="`select`" prop="deviceType" :disabled="!isInsert" :field="{name:'设备类型',options:deviceData}" v-model="form.deviceType"/>
                        </el-col>
                        <el-col :span="20" :offset="2">
                            <form-render :type="`input`" prop="deviceName" :field="{name:'设备名称'}" v-model="form.deviceName"/>
                        </el-col>
                        <el-col :span="20" :offset="2">
                            <form-render :type="`input`" prop="deviceCode" :field="{name:'设备编号'}" v-model="form.deviceCode"/>
                        </el-col>
                        <el-col :span="20" :offset="2">
                            <form-render :type="`select`" prop="deviceBrand" :field="{name:'设备品牌',options:brandData}" @change="changeModel" v-model="form.deviceBrand"/>
                        </el-col>
                        <el-col :span="20" :offset="2">
                            <form-render :type="`select`" prop="deviceModel" :field="{name:'设备型号',options:modelData}" v-model="form.deviceModel"/>
                        </el-col>
                        <el-col :span="20" :offset="2">
                            <form-render :type="`input`" prop="deviceNumber" :field="{name:'设备机号'}" v-model="form.deviceNumber"/>
                        </el-col>
                        <el-col :span="20" :offset="2">
                            <form-render :type="`input`" prop="deviceIP" :field="{name:'设备IP'}" v-model="form.deviceIP"/>
                        </el-col>
                        <el-col :span="20" :offset="2">
                            <form-render :type="`input`" prop="devicePort" :field="{name:'设备端口'}" v-model="form.devicePort"/>
                        </el-col>
                        <el-col :span="20" :offset="2">
                            <form-render :type="`input`" prop="deviceCapacity" :field="{name:'设备容量'}" v-model="form.deviceCapacity"/>
                        </el-col>
                        <el-col :span="20" :offset="2">
                            <form-render :type="`select`" prop="office" :field="{name:'归属办公地点',options:addressData}" v-model="form.office"/>
                        </el-col>
                        <el-col :span="20" :offset="2">
                            <form-render :type="`radio`" prop="deviceStatus" :field="{name:'设备状态',options:[{'label':'启用','value':1},{'label':'禁用','value':2}]}" v-model="form.deviceStatus"/>
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
const api_resource = api_common.resource("devicemanager/devicemechine");
export default {
    mixins: [table_mixin],
    props:['id'],
    components:{
        OrgSelect
    },
    data() {
        const defaultForm  = function(){
            return {
                office:1,
                deviceStatus:1,
                deviceName:'',
                deviceCode:'',
                deviceModel:'',
                deviceBrand:'',
                deviceNumber:'',
                deviceIP:'',
                devicePort:'',
            }
        }
        return {
            defaultForm,
            loading: false,
            form:{},
            api_resource,
            queryDialogFormVisible:true,
            table_topHeight:220,
            dialogFormVisible:false,
            customId:'',
            deviceData:[],
            addressData:[],
            statusData:[],
            modelData:[],
            brandData:[],
            rules:{
                deviceType:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
                deviceName:[
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                deviceCode:[
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                deviceModel:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
                deviceBrand:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
                deviceNumber:[
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                deviceIP:[
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                devicePort:[
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                office:[
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                deviceStatus:[
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                deviceCapacity:[
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
            }
        };
    },
    watch:{
        id(){
            this.table_form.currentpage = 1
            this.fetchTableData()
        },
        'form.deviceBrand'(){
            if(this.form.deviceBrand!=''){
                this.getModel()
            }
        }
    },
    computed:{
        disabled(){
            if(this.form.deviceType!=''&&this.form.deviceName!=''&&this.form.deviceCode!=''&&this.form.deviceModel!=''&&this.form.deviceBrand!=''
            &&this.form.deviceCapacity!=''&&this.form.deviceNumber!=''&&this.form.deviceIP!=''&&this.form.devicePort!=''&&this.form.office!=''&&this.form.deviceStatus!=''){
                return false
            }
            return true
        }
    },
    methods: {
        changeModel(){
            this.form.deviceModel = ''
        },
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
        async delete(){
            let rows = this.table_selectedRows.map(row=>row.id)
            await this.$request.get('devicemanager/devicemechine/bluk?ids='+rows.join(','))
            this.$message.success({message:'删除成功'})
            this.fetchTableData();
        },
        async getDevice(){
            this.deviceData = (await this.$request.get('devicemanager/getdevicetype')).map(o=>{return {label:o.name,value:o.value}})
        },
        async getModel(){
            this.modelData = (await this.$request.get('devicemanager/getdevicemodel?brand_id='+this.form.deviceBrand)).map(o=>{return {label:o.title,value:o.id}})
        },
        async getBrand(){
            this.brandData = (await this.$request.get('devicemanager/getdevicebrand')).map(o=>{return {label:o.title,value:o.id}})
        },
        async getAddress(){
            this.addressData = (await this.$request.get('devicemanager/getofficeaddress')).map(o=>{return {label:o.name,value:o.value}})
        },
        // async getStatus(){
        //     this.statusData = (await this.$request.get('devicemanager/getdevicestatus')).map(o=>{return {label:o.name,value:o.value}})
        // },
        add(){
            this.getDevice()
            this.getBrand()
            this.getAddress()
            this.dialogFormVisible = true
            this.form = this.defaultForm()
        },
		async edit(){
            this.getDevice()
            this.getBrand()
            this.getAddress()
			this.dialogFormVisible = true
            let row = this.table_selectedRows[0];
			this.form = await api_resource.find(row.id)
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
                this.form.deviceName = ''
                this.form.deviceCode = ''
                this.form.deviceModel = ''
                this.form.deviceBrand = ''
                this.form.deviceNumber = ''
                this.form.deviceIP = ''
                this.form.devicePort = ''
            	this.$nextTick(()=>{
					this.$refs['form'].clearValidate()
				})
				this.fetchTableData()
			}else{
				this.dialogFormVisible = false
				this.fetchTableData()
			}
            // await this.throwFormError(api_resource.create(this.form))
        }
    },
    async created() {
        const { field, action,table } = await api_common.menuInit("devicemanager/devicemechine");
        this.table_field = field;
        this.table_actions = action;
        this.table_config = table
        this.fetchTableData();
    },
};
</script>