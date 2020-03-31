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
            <div>
                 <el-form ref="form" :model="form" label-width="130px" :rules="rules" class="h-full"  style="height:630px;margin:0 10px;">
                    <el-scrollbar wrap-class="scrollbar-wrapper" class="scroll"> 
                        <div class="line-boxs">
                            <el-row :gutter="40">
                                <el-col :span="12">
                                    <el-row :gutter="20">
                                        <el-col :span="24">
                                            <form-render prop="production_date" :type="`day`" :field="{name:'生产日期'}" v-model="form.production_date"/>
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render prop="place" :type="`select`" :field="{name:'厂区',options:workGroupData}" v-model="form.place"/>
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render prop="customer_name" :type="`input`" :field="{name:'客户名称'}" v-model="form.customer_name"/>
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render prop="class_ban" :type="`input`" :field="{name:'班别'}" v-model="form.class_ban"/>
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render prop="shifts" :type="`select`" :field="{name:'班次',options:[{
                                                    value: 1,
                                                    label: '白班'
                                                },{
                                                    value: 2,
                                                    label: '夜班'
                                                }
                                            ]}" v-model="form.shifts"/>
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render :type="`input`" prop="prodiction_order" :field="{name:'生产订单号'}" v-model="form.prodiction_order"/>
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render :type="`input`" prop="line_number"  :field="{name:'行号'}" v-model="form.line_number"/>
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render :type="`input`" prop="product_encoding"  :field="{name:'产品编码'}" v-model="form.product_encoding"/>
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render :type="`input`" prop="product_name"  :field="{name:'产品名称'}" v-model="form.product_name"/>
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render :type="`input`" prop="people_labors"  :field="{name:'劳务工人数'}" v-model="form.people_labors"/>
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render :type="`input`" prop="people_workers"  :field="{name:'正式工人数'}" v-model="form.people_workers"/>
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render :type="`input`" prop="people_number" :disabled="true" :field="{name:'总人数'}" v-model="form.people_number"/>
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render :type="`input`" prop="work_hours" :field="{name:'作业工时（人/分钟)'}" v-model="form.work_hours"/>
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render prop="machine_debug" :type="`input`" :field="{name:'机器调试'}" v-model="form.machine_debug"/>
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render prop="wait_outside_material" :type="`input`" :field="{name:'等外部料'}" v-model="form.wait_outside_material"/>
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render prop="wait_inside_material" :type="`input`" :field="{name:'等内部料'}" v-model="form.wait_inside_material"/>
                                        </el-col>
                                    </el-row>
                                </el-col>
                                <el-col :span="12">
                                    <el-row :gutter="20">
                                        <el-col :span="24">
                                            <form-render :type="`input`" prop="equipment_maintenance" :field="{name:'设备维修'}" v-model="form.equipment_maintenance"/>
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render :type="`input`" prop="other_problem" :field="{name:'其他'}" v-model="form.other_problem"/>
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render :type="`input`" prop="job_hours" :disabled="true" :field="{name:'作业RT'}" v-model="form.job_hours"/>
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render :type="`input`" prop="labors_hours" :disabled="true" :field="{name:'劳务工时（H）'}" v-model="form.labors_hours"/>
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render :type="`input`" prop="workers_hours" :disabled="true" :field="{name:'正式工时（H）'}" v-model="form.workers_hours"/>
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render :type="`input`" prop="working_hours" :disabled="true" :field="{name:'作业工时（H）'}" v-model="form.working_hours"/>
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render :type="`input`" prop="product_loss_time" :disabled="true" :field="{name:'生产损时（H）'}" v-model="form.product_loss_time"/>
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render :type="`input`" prop="sum_working_hours" :disabled="true" :field="{name:'总工时（H）'}" v-model="form.sum_working_hours"/>
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render :type="`input`" prop="production_number" :field="{name:'生产数量'}" v-model="form.production_number"/>
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render :type="`input`" prop="warehousing_number" :field="{name:'入库数量'}" v-model="form.warehousing_number"/>
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render :type="`input`" prop="no_warehousing_number" :disabled="true" :field="{name:'未入库数量'}" v-model="form.no_warehousing_number"/>
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render :type="`input`" prop="warehousing_encoding" :field="{name:'入库编码'}" v-model="form.warehousing_encoding"/>
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render :type="`select`" :required="this.no_warehousing_number>0" prop="no_warehousing_reason" :field="{name:'未入库原因',options:[{
                                                    value: 1,
                                                    label: '待品质检验'
                                                },{
                                                    value: 2,
                                                    label: '待报废'
                                                },{
                                                    value: 3,
                                                    label: '待客户检验'
                                                }
                                            ]}" v-model="form.no_warehousing_reason"/>
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render :type="`select`" :field="{name:'入库类型',options:[{
                                                    value: 1,
                                                    label: '正常入库'
                                                },{
                                                    value: 2,
                                                    label: '返工'
                                                }
                                            ]}" v-model="form.warehousing_type"/>
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render :type="`textarea`" :required="this.form.warehousing_type&&this.form.warehousing_type==2" prop="rework_reason" 
                                            :field="{name:'返工/报废原因'}" v-model="form.rework_reason"/>
                                        </el-col>
                                        <el-col :span="24">
                                            <form-render :type="`textarea`" :field="{name:'备注'}" v-model="form.remarks"/>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </div>
                    </el-scrollbar>
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
                <dateLap v-model="table_form.dateLap" @change="fetch"/>
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
            <el-table-column prop="production_date" label="生产日期" width="120"></el-table-column>
            <el-table-column prop="place_name" label="厂区" width="120"></el-table-column>
            <el-table-column prop="customer_name" label="客户名称" width="120"></el-table-column>
            <el-table-column prop="class_ban" label="班别" width="120"></el-table-column>
            <el-table-column prop="shifts_dis" label="班次" width="120"></el-table-column>
            <el-table-column prop="prodiction_order" label="生产订单号"  width="100"></el-table-column>
            <el-table-column prop="line_number" label="行号" width="80"></el-table-column>
            <el-table-column prop="product_encoding" label="产品编码" width="120"></el-table-column>
            <el-table-column prop="product_name" label="产品名称" width="120"></el-table-column>
            <el-table-column prop="people_number" label="总人数" width="100"></el-table-column>
            <el-table-column prop="people_labors" label="劳务工人数" width="100"></el-table-column>
            <el-table-column prop="people_workers" label="正式工人数"  width="100"></el-table-column>
            <el-table-column prop="work_hours" label="作业工时（人/分钟)"  width="100"></el-table-column>
            <el-table-column label="生产损时（人/分钟)">
                <el-table-column prop="machine_debug" label="机器调试" width="120"></el-table-column>
                <el-table-column prop="wait_outside_material" label="等外部料" width="120"></el-table-column>
                <el-table-column prop="wait_inside_material" label="等内部料" width="120"></el-table-column>
                <el-table-column prop="equipment_maintenance" label="设备维修" width="120"></el-table-column>
                <el-table-column prop="other_problem" label="其他"  width="100"></el-table-column>
            </el-table-column>
            <el-table-column prop="job_hours" label="作业RT" width="120"></el-table-column>
            <el-table-column prop="labors_hours" label="劳务工时（H）" width="120"></el-table-column>
            <el-table-column prop="workers_hours" label="正式工时（H）" width="120"></el-table-column>
            <el-table-column prop="working_hours" label="作业工时（H）" width="120"></el-table-column>
            <el-table-column prop="product_loss_time" label="生产损时（H）" width="120"></el-table-column>
            <el-table-column prop="sum_working_hours" label="总工时（H）" width="100"></el-table-column>
            <el-table-column prop="production_number" label="生产数量" width="120"></el-table-column>
            <el-table-column prop="warehousing_number" label="入库数量" width="120"></el-table-column>
            <el-table-column prop="no_warehousing_number" label="未入库数量" width="120"></el-table-column>
            <el-table-column prop="warehousing_encoding" label="入库编码" width="120"></el-table-column>
            <el-table-column prop="no_warehousing_reason_dis" label="未入库原因"  width="120"></el-table-column>
            <el-table-column prop="warehousing_type_dis" label="入库类型" width="120"></el-table-column>
            <el-table-column prop="rework_reason" label="返工/报废原因" width="120"></el-table-column>
            <el-table-column prop="remarks" label="备注"  width="200"></el-table-column>
            <!-- <each-table-column :table_field="table_field"/> -->
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
import OrgSelect from '@/components/Org/OrgSelect'
const api_resource = api_common.resource("operatelist/prodictionslist");
const download = require('downloadjs')
import dayjs from 'dayjs'
let baseUri = process.env.VUE_APP_BASEAPI
export default {
    mixins: [table_mixin],
    data() {
        var checkNumber = (rule, value, callback)=>{
            if (value==='') {
				return callback(new Error('请输入'));
			}else{
                if (!(/^[0-9]\d*$/.test(value))) {
                    callback(new Error('请输入正整数'));
                }else{
                    callback();
                }
			}
        }
        var orderNumber = (rule, value, callback)=>{
            if (value==='') {
				return callback(new Error('请输入'));
			}else{
                if (!(/^[0-9]\d*$/.test(value))) {
                    callback(new Error('请输入正整数'));
                }else if(value.length>10){
                    callback(new Error('生产订单号不能大于十位'));
                }else{
                    callback();
                }
			}
        }
        var lineNumber = (rule, value, callback)=>{
            if (value==='') {
				return callback(new Error('请输入'));
			}else{
                if (!(/^[0-9]\d{0,2}$/.test(value))) {
                    callback(new Error('请输入3位数以内的正整数'));
                }else{
                    callback();
                }
			}
        }
        var warehousingNumber = (rule, value, callback)=>{
            if (value==='') {
				return callback(new Error('请输入'));
			}else{
                if (!(/^[0-9]\d*$/.test(value))) {
                    callback(new Error('请输入正整数'));
                }else if(Number(value) > Number(this.form.production_number)){
                    callback(new Error('入库数量不能大于生产数量'));
                }else{
                    callback()
                }
			}
        }
        return {
            loading: false,
            baseUri,
            form:{
                prodiction_order: '',
                people_number: '',
                people_workers: '',
                people_labors: '',
                work_hours: '',
                production_number:'',
                no_warehousing_number: '',
                warehousing_type: ''
            },
            no_warehousing_number: '',
            api_resource,
            queryDialogFormVisible:true,
            table_topHeight:234,
            dialogFormVisible:false,
            customId:'',
            customData:[],
            result:[],
            rules: {
                production_date: [
                    { required: true, message: '请选择', trigger: 'change' },
                ],
                customer_name: [
                    { required: true, message: '请输入', trigger: ['change','blur'] },
                ],
                shifts: [
                    { required: true, message: '请输入', trigger: ['change','blur'] },
                ],
                place: [
                    { required: true, message: '请输入', trigger: ['change','blur'] },
                ],
                class_ban: [
                    { required: true, message: '请输入', trigger: ['change','blur'] },
                ],
                prodiction_order: [
                    { required: true, message: '请输入', trigger: ['change','blur'] },
                    { validator: orderNumber, trigger: 'blur' }
                ],
                line_number: [
                    { required: true, message: '请输入', trigger: ['change','blur'] },
                    { validator: lineNumber, trigger: 'blur' }
                ],
                product_encoding: [
                    { required: true, message: '请输入', trigger: ['change','blur'] },
                ],
                product_name: [
                    { required: true, message: '请输入', trigger: ['change','blur'] },
                ],
                people_number: [
                    { required: true, message: '请输入', trigger: ['change','blur'] },
                ],
                people_labors: [
                    { required: true, message: '请输入', trigger: ['change','blur'] },
                    { validator: checkNumber, trigger: 'blur' }
                ],
                people_workers: [
                    { required: true, message: '请输入', trigger: ['change','blur'] },
                    { validator: checkNumber, trigger: 'blur' }
                ],
                work_hours: [
                    { required: true, message: '请输入', trigger: ['change','blur'] },
                    { validator: checkNumber, trigger: 'blur' }
                ],
                machine_debug: [
                    { required: true, message: '请输入', trigger: ['change','blur'] },
                    { validator: checkNumber, trigger: 'blur' }
                ],
                wait_outside_material: [
                    { required: true, message: '请输入', trigger: ['change','blur'] },
                    { validator: checkNumber, trigger: 'blur' }
                ],
                wait_inside_material: [
                    { required: true, message: '请输入', trigger: ['change','blur'] },
                    { validator: checkNumber, trigger: 'blur' }
                ],
                equipment_maintenance: [
                    { required: true, message: '请输入', trigger: ['change','blur'] },
                    { validator: checkNumber, trigger: 'blur' }
                ],
                other_problem: [
                    { required: true, message: '请输入', trigger: ['change','blur'] },
                    { validator: checkNumber, trigger: 'blur' }
                ],
                job_hours: [
                    { required: true, message: '请输入', trigger: ['change','blur'] },
                ],
                labors_hours: [
                    { required: true, message: '请输入', trigger: ['change','blur'] },
                ],
                workers_hours: [
                    { required: true, message: '请输入', trigger: ['change','blur'] },
                ],
                working_hours: [
                    { required: true, message: '请输入', trigger: ['change','blur'] },
                ],
                product_loss_time: [
                    { required: true, message: '请输入', trigger: ['change','blur'] },
                ],
                sum_working_hours: [
                    { required: true, message: '请输入', trigger: ['change','blur'] },
                ],
                production_number: [
                    { required: true, message: '请输入', trigger: ['change','blur'] },
                    { validator: checkNumber, trigger: 'blur' }
                ],
                warehousing_number: [
                    { required: true, message: '请输入', trigger: ['change','blur'] },
                     { validator: warehousingNumber, trigger: 'blur' }
                ],
                no_warehousing_number: [
                    { required: true, message: '请输入', trigger: ['change','blur'] },
                ],
            },
            workGroupData: [],
        };
    },
    watch:{
        'form.people_labors'(){
            if(this.form.people_labors && this.form.people_workers){
                this.form.people_number = Number(this.form.people_labors) + Number(this.form.people_workers)
            }
            if(this.form.people_labors && this.form.work_hours){
                this.form.labors_hours =  (Number(this.form.people_labors) *  Number(this.form.work_hours) / 60).toFixed(2)
            }
        },
        'form.people_workers'(){
            if(this.form.people_labors && this.form.people_workers){
                this.form.people_number = Number(this.form.people_labors) + Number(this.form.people_workers)
            }
             if(this.form.people_workers && this.form.work_hours){
                this.form.workers_hours =  (Number(this.form.people_workers) *  Number(this.form.work_hours) / 60).toFixed(2)
            }
        },
        'form.prodiction_order'(){
            if(this.form.prodiction_order && this.form.prodiction_order.length<10){
                this.form.prodiction_order = String(this.form.prodiction_order).padStart(10,'00')
            }
        },
        'form.people_number'(){
            if(this.form.people_number && this.form.work_hours && this.form.production_number){
                this.form.job_hours =  (Number(this.form.people_number) *  Number(this.form.work_hours) /  Number(this.form.production_number)).toFixed(2)
            }
            if(this.form.machine_debug && this.form.wait_outside_material&& this.form.wait_inside_material&& this.form.equipment_maintenance&& this.form.other_problem){
                this.form.product_loss_time =  ((Number(this.form.machine_debug) +  Number(this.form.wait_outside_material) +  Number(this.form.wait_inside_material)
                 +  Number(this.form.equipment_maintenance) +  Number(this.form.other_problem)) * this.form.people_number / 60).toFixed(2)
            }
        },
        'form.work_hours'(){
            if(this.form.people_number && this.form.work_hours && this.form.production_number){
                this.form.job_hours =  (Number(this.form.people_number) *  Number(this.form.work_hours) /  Number(this.form.production_number)).toFixed(2)
            }
            if(this.form.people_labors && this.form.work_hours){
                this.form.labors_hours =  (Number(this.form.people_labors) *  Number(this.form.work_hours) / 60).toFixed(2)
            }
            if(this.form.people_workers && this.form.work_hours){
                this.form.workers_hours =  (Number(this.form.people_workers) *  Number(this.form.work_hours) / 60).toFixed(2)
            }
        },
        'form.production_number'(){
            if(this.form.people_number && this.form.work_hours && this.form.production_number){
                this.form.job_hours =  (Number(this.form.people_number) *  Number(this.form.work_hours) /  Number(this.form.production_number)).toFixed(2)
            }
            if(this.form.warehousing_number && this.form.production_number){
                this.form.no_warehousing_number =  Number(this.form.production_number) -  Number(this.form.warehousing_number)
                this.no_warehousing_number = this.form.no_warehousing_number
            }
        },
        'form.labors_hours'(){
            if(this.form.labors_hours && this.form.workers_hours){
                this.form.working_hours =  (Number(this.form.labors_hours) *  Number(this.form.workers_hours) / 60).toFixed(2)
            }
        },
        'form.workers_hours'(){
            if(this.form.labors_hours && this.form.workers_hours){
                this.form.working_hours =  (Number(this.form.labors_hours) *  Number(this.form.workers_hours) / 60).toFixed(2)
            }
            if(this.form.working_hours && this.form.product_loss_time){
                this.form.sum_working_hours =  (Number(this.form.working_hours) + Number(this.form.product_loss_time)).toFixed(2)
            }
        },
        'form.machine_debug'(){
            if(this.form.machine_debug && this.form.wait_outside_material&& this.form.wait_inside_material&& this.form.equipment_maintenance&& this.form.other_problem){
                this.form.product_loss_time =  ((Number(this.form.machine_debug) +  Number(this.form.wait_outside_material) +  Number(this.form.wait_inside_material)
                 +  Number(this.form.equipment_maintenance) +  Number(this.form.other_problem)) * this.form.people_number / 60).toFixed(2)
            }
            if(this.form.working_hours && this.form.product_loss_time){
                this.form.sum_working_hours =  (Number(this.form.working_hours) +  Number(this.form.product_loss_time)).toFixed(2)
            }
        },
        'form.wait_outside_material'(){
            if(this.form.machine_debug && this.form.wait_outside_material&& this.form.wait_inside_material&& this.form.equipment_maintenance&& this.form.other_problem){
                this.form.product_loss_time =  ((Number(this.form.machine_debug) +  Number(this.form.wait_outside_material) +  Number(this.form.wait_inside_material)
                 +  Number(this.form.equipment_maintenance) +  Number(this.form.other_problem)) * this.form.people_number / 60).toFixed(2)
            }
            if(this.form.working_hours && this.form.product_loss_time){
                this.form.sum_working_hours =  (Number(this.form.working_hours) +  Number(this.form.product_loss_time)).toFixed(2)
            }
        },
        'form.wait_inside_material'(){
            if(this.form.machine_debug && this.form.wait_outside_material&& this.form.wait_inside_material&& this.form.equipment_maintenance&& this.form.other_problem){
                this.form.product_loss_time =  ((Number(this.form.machine_debug) +  Number(this.form.wait_outside_material) +  Number(this.form.wait_inside_material)
                 +  Number(this.form.equipment_maintenance) +  Number(this.form.other_problem)) * this.form.people_number / 60).toFixed(2)
            }
            if(this.form.working_hours && this.form.product_loss_time){
                this.form.sum_working_hours =  (Number(this.form.working_hours) +  Number(this.form.product_loss_time)).toFixed(2)
            }
        },
        'form.equipment_maintenance'(){
            if(this.form.machine_debug && this.form.wait_outside_material&& this.form.wait_inside_material&& this.form.equipment_maintenance&& this.form.other_problem){
                this.form.product_loss_time =  ((Number(this.form.machine_debug) +  Number(this.form.wait_outside_material) +  Number(this.form.wait_inside_material)
                 +  Number(this.form.equipment_maintenance) +  Number(this.form.other_problem)) * this.form.people_number / 60).toFixed(2)
            }
            if(this.form.working_hours && this.form.product_loss_time){
                this.form.sum_working_hours =  (Number(this.form.working_hours) +  Number(this.form.product_loss_time)).toFixed(2)
            }
        },
        'form.other_problem'(){
            if(this.form.machine_debug && this.form.wait_outside_material&& this.form.wait_inside_material&& this.form.equipment_maintenance&& this.form.other_problem){
                this.form.product_loss_time =  ((Number(this.form.machine_debug) +  Number(this.form.wait_outside_material) +  Number(this.form.wait_inside_material)
                 +  Number(this.form.equipment_maintenance) +  Number(this.form.other_problem)) * this.form.people_number / 60).toFixed(2)
            }
            if(this.form.working_hours && this.form.product_loss_time){
                this.form.sum_working_hours =  (Number(this.form.working_hours) +  Number(this.form.product_loss_time)).toFixed(2)
            }
        },
        'form.warehousing_number'(){
            if(this.form.production_number && this.form.production_number){
                this.form.no_warehousing_number =  Number(this.form.production_number) -  Number(this.form.warehousing_number)
                this.no_warehousing_number = this.form.no_warehousing_number
            }
        },
    },
    computed:{
    },
    methods: {
		fetch(){
			this.table_form.currentpage = 1
			this.fetchTableData()
        },
        async fetchTableData() {
            this.table_loading = true;
            const {rows , total }= await api_resource.get(this.table_form);
            this.table_data  = rows
            this.table_form.total = total
            setTimeout(() => {
                this.table_loading = false;
            }, 300);
        },
        async add(){
            this.$nextTick(()=>{
                this.$refs['form'].clearValidate()
            })
            this.workGroupData = (await api_common.resource('officeaddress').get()).map(o=>{return {label:o.officeaddressname,value:o.id}})
            this.form = {}
            this.dialogFormVisible = true
        },
        async edit(){
            let row = this.table_selectedRows[0];
            this.workGroupData = (await api_common.resource('officeaddress').get()).map(o=>{return {label:o.officeaddressname,value:o.id}})
            this.form = await this.$request.get('operatelist/prodictionlist/'+row.id)
            this.dialogFormVisible = true
        },
        async delete(){
            let rows = this.table_selectedRows.map(row=>row.id)
            await this.$request.delete('operatelist/prodictionslist?ids='+rows.join(','))
            this.$message.success({message:'删除成功'})
            this.fetchTableData();
        },
        async handleFormSubmit(){
            await this.form_validate()
            let form = Object.assign({},this.form)
            if(this.isInsert){
                try{
                    await this.throwFormError(api_resource.create(form))
                    // await api_resource.create(form)
                    this.dialogFormVisible = false
                    this.fetchTableData()
                }catch(err){
                    this.$message.error(err.field[0]);
                }
            }else{
                await this.$request.put('operatelist/prodictionlist/'+form.id,form)
                this.dialogFormVisible = false
                this.fetchTableData()
            }
        }
    },
    async created() {
        const { field, action,table } = await api_common.menuInit("production/hours/form");
        this.table_field = field;
        this.table_actions = action;
        this.table_config = table
		this.table_form.dateLap = dayjs().format('YYYY-MM')
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