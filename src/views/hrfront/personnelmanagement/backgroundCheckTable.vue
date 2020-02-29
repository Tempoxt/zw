<template>
    <div id="backgroundCheck">
        <ui-table ref="table" 
            :table_column="table_field" 
            :table_query.sync="table_form.query"
            @query="querySubmit"
            >

            <el-dialog
                title="请选择"
                :visible.sync="dialogFormVisible"
                class="public-dialog"
                v-el-drag-dialog
                width="520px"
                >

                <el-form ref="form" :model="form" label-width="100px" :rules="rules">
                    <el-row>
                        <el-col :span="24">
                            <form-render
                                :type="`radio`"
                                :field="{name:'是否通过',options:[{
                                    value: 1,
                                    label: '通过'
                                },{
                                    value: 2,
                                    label: '不通过'
                                }]}"
                                v-model="form.audit"
                                prop="audit"
                            />
                        </el-col>
                        <el-col :span="24" v-if="this.form.audit==2">
                            <form-render
                                :type="`textarea`"
                                :autosize="{ minRows: 2, maxRows: 4}"
                                prop="remark"
                                filterable
                                :field="{name:'不通过原因'}"
                                v-model="form.remark"
                            />
                        </el-col>
                    </el-row>
                </el-form>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleFormSubmit" :disabled="disabled">确 定</el-button>
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
                    <el-select v-model="table_form.jobType" clearable @change="fetch" placeholder="请选择员工或职员">
                        <el-option
                        v-for="item in jobTypes"
                        :key="item.id"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div style="padding-left:10px">
                    <dateLap type="1" v-model="table_form.dateLap" @change="fetch"/>
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

                <el-table-column type="index" :index="indexMethod" fixed/>
                <el-table-column prop="name" label="姓名" fixed/>
                <el-table-column prop="department" label="应聘部门" fixed/>
                <el-table-column prop="job" label="应聘岗位" fixed/>
                <el-table-column prop="census" label="户籍" fixed/>
                <el-table-column prop="idCard" label="身份证号" fixed/>
                <el-table-column prop="age" label="年龄" fixed/>
                <el-table-column prop="sex" label="性别" sortable fixed/>
                <el-table-column prop="isRecommend" label="是否公司内部介绍" sortable fixed/>

                <each-table-column :table_field="table_field.filter(o=>!['name','department','job','census','idCard','age','sex','annexUrl','signature','idCardPositive','idCardReverse','isRecommend'].includes(o.name))" :template="template"/>
                
                <el-table-column prop="annexUrl" label="身份证正面">
                    <template slot-scope="scope">
                        <el-button type="text" @click="lookImg(scope.row.idCardPositive)">查看附件</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="annexUrl" label="身份证反面">
                    <template slot-scope="scope">
                        <el-button type="text" @click="lookImg(scope.row.idCardReverse)">查看附件</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="annexUrl" label="证明资料附件">
                    <template slot-scope="scope">
                        <el-button type="text" @click="lookImg(scope.row.annexUrl)">查看附件</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="signature" label="签名附件">
                    <template slot-scope="scope">
                        <el-button type="text" @click="lookImg(scope.row.signature)">查看附件</el-button>
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
        
    </div>
</template>

<script>
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";
import dayjs from 'dayjs'

export default {
    mixins: [table_mixin],
    name: 'backgroundCheck',
    props:['flag'],
    data() {
        return {
            table_loading: false,
            api_resource: api_common.resource("hrm/backgroundCheck"),
            table_topHeight: 300,
            dialogFormVisible: false,
            form: {},
			rules:{
				audit:[
					{ required: true, message: '请选择', trigger:  ['blur', 'change'] },
				],
            },
            jobTypes: [
                {
                    value: '0',
                    label: '员工'
                }, {
                    value: '1',
                    label: '职员'
                },
            ],
            template:{
                
            }
        }
    },
    watch:{
        flag(){
			this.table_form.query.query = []
			this.table_form.currentpage = 1
            this.fetchMenu()
            this.fetchTableData()
        }
    },
    computed: {
        // table_height(){ 
        //     return (this.window_innerHeight||window.innerHeight) - 220
        // },
        disabled(){
			if(this.form.audit!==''){
				if(this.form.audit==1){
					return false
				}else if(this.form.audit==2){
					if(this.form.remark&&this.form.remark!==''){
						return false
					}else{
						return true
					}
				}
			}
			return true
		}
    },
    methods: {
        fetch(){
            this.table_form.currentpage = 1
            this.fetchTableData()
        },
        audit(){
            this.dialogFormVisible = true
            this.form = {}
        },
        async handleFormSubmit(){
            let ids = this.table_selectedRows.map(o=>o.id)
            this.form.ids = ids.join(',')
            await this.$request.put('/hrm/backgroundCheck/audit',this.form)
            this.dialogFormVisible = false
            this.fetchTableData()
        },
        async fetchTableData() {
			this.table_loading = true;
            this.table_form.flag = this.flag
			const {rows , total }= await this.api_resource.get(this.table_form);
			this.table_data  = rows
			this.table_form.total = total
			setTimeout(() => {
                this.table_loading = false;
                this.$refs.elTable.doLayout()
            }, 300);
        },
        lookImg(url) {
            let urls = url.split(';')
           
            urls.forEach(o=>{
                window.open(process.env.VUE_APP_STATIC+o.replace('.tencent','.png').replace('.android','.png'))
            })
        },
        async fetchMenu(){
            const { field, action,table } = await api_common.menuInit("backgroundCheck"+this.flag);
            this.table_field = field;
            this.table_actions = action;
            this.table_config = table
        }
    },
    async created() {
        this.fetchMenu()
    },
    mounted() {
		this.$set(this.table_form,'dateLap',dayjs().format('YYYY-MM-DD'))
        this.table_form.jobType = '0'
        this.fetchTableData();
    }
    
    
}
</script>

<style lang="scss" scoped>
#backgroundCheck{

}
</style>