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
                <el-row v-if="!isInsert">
					<el-col :span="16" :offset="2">
						<form-render :type="`input`" disabled :field="{name:'工号'}" v-model="form.staff__chineseName" />
					</el-col>
					<el-col :span="16" :offset="2">
						<form-render :type="`input`" disabled :field="{name:'姓名'}" v-model="form.staff_employeeCode" />
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<form-render :type="`select`" prop="deviceType" :field="{name:'设备类型',options:deviceData}" placeholder="请选择" v-model="form.deviceType" />
					</el-col>
					<el-col :span="12">
                        <el-form-item label="设备名称">
                            <el-select v-model="form.device" multiple placeholder="请选择" filterable style="width:100%">
                                <el-option
                                    v-for="item in nameData"
                                    :key="item.value"
                                    :label="item.name"
                                    :value="item.value">
                                    <span >{{ item.name }}
                                        <span style="font-size:12px;color:red" v-if="item.deviceCapacity==0">(剩余可用容量:{{ item.deviceCapacity }})</span> 
                                        <span v-else style="font-size:12px">(剩余可用容量:{{ item.deviceCapacity }})</span>
                                    </span>
                                </el-option>
                            </el-select>
                        </el-form-item>
					</el-col>
				</el-row>
			</el-form>

                <OrgSelect :result="result" v-model="form.staff" ref="OrgSelect" v-if="dialogFormVisible&&isInsert"/>

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
        <vxe-table
            class="public-vxe-table"
            ref="elTable"
            resizable
            show-overflow
            highlight-hover-row
            @select-all="handleChangeSelection"
            @select-change="handleChangeSelection"
            :data="table_data"
            border
            style="width: 100%"
            v-loading="table_loading"
            :header-cell-style="vxeHeaderStyle"
            :height="table_height"
            @resizable-change="table_dragend"
            @sort-change="table_sort_change"
		    :seq-config="{seqMethod: VxeIndexMethod}"
            >
            <vxe-table-column 
                type="selection" 
                width="60" 
                class-name="table-column-disabled"
                :selectable="table_disable_selected"
                >
            </vxe-table-column>
            
            <vxe-table-column type="index" :index="indexMethod"/>
            <vxe-table-column v-for="field in table_field.filter(column=>!column.fed_isvisiable).filter(column=>!column.isvisiable)" :key="field.name"
                 :field="field.name" :title="field.showname" :width="field.width=='auto'?'': parseInt(field.width)" :sortable="field.issort" />
            <!-- <each-table-column :table_field="table_field"/> -->
            <vxe-table-column label="指纹索引" width="420px">
                <template slot-scope="scope">
                    <el-checkbox-group v-model="scope.row.list">
                        <el-checkbox v-for="(item,index) in scope.row.finger_info" :key="index" :label="item.finger__tempIndex" :disabled="item.id==0" class="checkbox_finger"></el-checkbox>
                    </el-checkbox-group>
                </template>
            </vxe-table-column>
            <vxe-table-column label="操作" fixed="right" width="74">
                <template slot-scope="scope">
                    <el-button @click="deleteFinger(scope.row)" type="text" size="small" style="padding-top:1px;padding-bottom:1px">删除指纹</el-button>
                </template>
            </vxe-table-column>
        </vxe-table>
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
    props:['id'],
    components:{
        OrgSelect
    },
    data() {
        return {
            vxeHeaderStyle:{background:'#F5FAFB',color:'#37474F'},
            loading: false,
            form:{
                device:[]
            },
            elTableHeight: '',
            api_resource,
            queryDialogFormVisible:true,
            table_topHeight:235,
            dialogFormVisible:false,
            deviceData:[],
            nameData:[],
            typew:'',
            rules:{
                deviceType:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
                device:[
                    { required: true, message: '请选择', trigger: ['blur','change'] },
                ],
            },
            checkList:[],
			result:[],
        };
    },
    computed:{
        disabled(){
            if(this.form.deviceType!=''&&this.form.device!=[]){
                return false
            }
            return true
        }
    }, 
    watch:{
        elTableHeight() {
            this.$refs['elTable'].recalculate()
        },
        id(){
            this.table_form.currentpage = 1
            this.fetchTableData()
        },
        'form.deviceType'(){
            if(this.isInsert){
                this.form.device && this.form.device.length == 0
            }
            if(this.form.deviceType!==''&&this.form.deviceType!=undefined){
                this.getName()
            }
        }
    },
    methods: {
        handleChangeSelection({selection:val}){ // 单选
              this.table_selectedRowsInfo = val
              this.table_selectedRows = val
              this.$emit("update:table_selectedRows",val)
        },
        async deleteFinger(row){
            this.checkList =[]
            row.list.map(o=>{
                let finger = row.finger_info.filter(k=>k.finger__tempIndex==o)
                this.checkList.push(finger[0].id)
            })
            await this.$request.get('devicemanager/devicelistmanage/devicefinger/bluk?ids='+this.checkList.join(','))
            this.$message.success({message:'删除成功'})
            this.fetchTableData();
        },
        async fetchTableData() {
            // if(!this.id){
            //     return 
            // }
            this.table_loading = true;
            this.table_form.orgid = this.id
            const {rows , total }= await api_resource.get(this.table_form);
            this.table_data  = rows
            this.table_form.total = total
            this.table_data.forEach((o)=>{
                this.$set(o,'list',[])
            })
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
            this.nameData = (await this.$request.get('devicemanager/getmechinebytype?deviceType='+this.form.deviceType+'&show_capacity=1'))
        },
        add(){
			this.result = []
            this.form = {}
            this.$nextTick(()=>{
                this.$refs['form'].clearValidate()
            })
            this.getDevice()
            this.dialogFormVisible = true
        },
        async edit(){
            // let row = this.table_selectedRowsInfo[0];
            // this.dialogFormVisible = true
            // this.form  = await this.api_resource.find(row.id) 
            // this.typew = this.form.deviceType
            // this.getDevice()
        },
        async handleFormSubmit(){
            await this.form_validate()
            this.form.staff = this.$refs.OrgSelect.getIdsResult()
            if(this.form.staff==''){
                this.$message.error('请选择人员')
            }else{
                try{
                    let form = Object.assign({},this.form)
                    await api_resource.create(form)
                    this.dialogFormVisible = false
                    this.fetchTableData()
                }catch(err){
                    console.log(err)
                }
            }
        }
    },
    activated(){
       this.$nextTick(()=>{
          this.$refs['elTable'].recalculate()
       })
    },
    async created() {
        const { field, action,table } = await api_common.menuInit("devicemanager/devicelistmanage");
        this.table_field = field;
        this.table_actions = action;
        this.table_config = table
        this.fetchTableData();
        this.elTableHeight = this.$refs['elTable'].height
    },
};
</script>
<style lang="scss">
    .checkbox_finger{
        margin-right: -16px;
        .el-checkbox__label{
            padding-left: 4px
        }
    }
</style>