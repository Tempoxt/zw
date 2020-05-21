<template>
    <ui-table ref="table" 
        :table_column="table_field" 
        :table_query.sync="table_form.query"
        @query="querySubmit"
        >

        <table-header
            :table_actions="table_actions"
            :table_selectedRows="table_selectedRows"
            @action="handleAction"
            :table_form.sync="table_form"
            :table_column="table_field"
        >
            <div style="padding-left:10px">
                <dateLap :disabled="true" v-model="table_form.dateLap" @change="fetch"/>
            </div>
        </table-header>
        <!-- <el-table
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
        </el-table> -->
        <vxe-table
            class="public-vxe-table "
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
            @sort-change="table_sort_change"
            :seq-config="{seqMethod: VxeIndexMethod}"
            @resizable-change="table_dragend" 
            :edit-config="{trigger: 'dblclick', mode: 'cell'}"
            @edit-actived="editActivedEvent"
            @edit-closed="editClosedEvent"
            >
            <vxe-table-column 
                type="selection" 
                width="45" 
                class-name="table-column-disabled"
                :selectable="table_disable_selected"
            ></vxe-table-column>
            <vxe-table-column type="index" width="40" align="center"></vxe-table-column>
            <vxe-table-column field="department_name" title="部门" width="80">
                <template slot-scope="scope">
                    <div v-html="scope.row.department_name" :title="scope.row.department_name"></div>
                </template>
            </vxe-table-column>
            <vxe-table-column field="hrmteam" title="小组" width="80">
                <template slot-scope="scope">
                    <div v-html="scope.row.hrmteam" :title="scope.row.hrmteam"></div>
                </template>
            </vxe-table-column>
            <vxe-table-column field="name" title="姓名" width="80">
                <template slot-scope="scope">
                    <div v-html="scope.row.name" :title="scope.row.name"></div>
                </template>
            </vxe-table-column>
            <vxe-table-column field="personal_number" title="工号" width="80">
                <template slot-scope="scope">
                    <div v-html="scope.row.personal_number"  :title="scope.row.personal_number"></div>
                </template>
            </vxe-table-column>
            <vxe-table-column field="position" title="职位" width="80">
                <template slot-scope="scope">
                    <div v-html="scope.row.position"  :title="scope.row.position"></div>
                </template>
            </vxe-table-column>
            <vxe-table-column field="scheme_name" title="方案名称" width="80">
                <template slot-scope="scope">
                    <div v-html="scope.row.scheme_name"  :title="scope.row.scheme_name"></div>
                </template>
            </vxe-table-column>
            <vxe-table-column field="version" title="当前绩效版本" width="80">
                <template slot-scope="scope">
                    <div v-html="scope.row.version"  :title="scope.row.version"></div>
                </template>
            </vxe-table-column>
            <vxe-table-column v-for="field in table_field.filter(o=>!['department_name','hrmteam','name','personal_number','position','scheme_name','version'].includes(o.name))
                .filter(column=>!column.fed_isvisiable).filter(column=>!column.isvisiable)" :edit-render="{name: 'input', attrs: {type: 'text'}}"
                :key="field.id" :field="field.name" :title="field.showname" :width="field.width=='auto'?'': parseInt(field.width)" :sortable="field.issort" />
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
const api_pagemanager = api_common.resource('pagemanager/field')
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";
let baseUrl = process.env.VUE_APP_STATIC
import dayjs from 'dayjs'
const api_resource = api_common.resource('performance/parameter/value')
export default {
    mixins: [table_mixin],
    props:['orgid','id'],
    data() {
        return {
            baseUrl, 
			vxeHeaderStyle:{background:'#F5FAFB',color:'#37474F'},
            api_resource,
            loading: false,
            queryDialogFormVisible:true,
            table_topHeight: 235,
            downloadUrl: '',
            importUploadUrl:'performance/parameter/value/input'
        };
    },
    computed:{ 
       
    },
    watch:{
        orgid(){
            this.fetchMenu()
        },
        id(){
            this.downloadUrl = 'performance/parameter/value/export?department='+this.id
        }
    },
    methods: {
        editActivedEvent({ row, column }, event) {
            console.log(`打开 ${column.title} 列编辑`)
        },
        async editClosedEvent({ row, column }, event) {
            // console.log(`关闭 ${column.title} 列编辑`)
            // console.log(row,'row')
            // console.log(row[column.property],'property')
            let curData = row[column.property]
            if(curData!==''&&curData!=undefined){
                if(!(/^[0-9]+(.[0-9]{0,9})?$/.test(curData))){
                    this.$message.error('请输入正确的数字')
                    return
                }else{
                    let data = {
                        department: row.department,
                        parameter_name: column.property,
                        parameter_value: curData,
                        personal_number_id: row.personal_number_id,
                        dateLap: this.table_form.dateLap
                    }
                    await this.$request.put('/performance/parameter/value',data)
                    this.fetchTableData()
                }
            }else{
                let data = {
                    department: row.department,
                    parameter_name: column.property,
                    parameter_value: curData,
                    personal_number_id: row.personal_number_id,
                    dateLap: this.table_form.dateLap
                }
                await this.$request.put('/performance/parameter/value',data)
                this.fetchTableData()
            }
        },
        handleChangeSelection({selection:val}){ // 单选
			this.table_selectedRowsInfo = val
			this.table_selectedRows = val
			this.$emit("update:table_selectedRows",val)
        },
        table_dragend({$rowIndex, column, columnIndex, $columnIndex, fixed, isHidden}){
            let row = this.table_field.find(field=>field.showname===column.title)
            var isEnd = false
            this.table_field.forEach((item,i)=>{
                if(item==row&&i==this.table_field.length-2){
                isEnd = true
                }
            })
            var newWidth = column.resizeWidth
            row.width = newWidth
            row.menuid = row.menuid_id
            api_pagemanager.update(row.id,{
                width:newWidth,
                menuid:row.menuid_id
            },{alert:false})
        },
        // /performance/parameter/value/export
        async handleFormSubmit(){
            await this.form_validate()
            this.form.ids = this.$refs.OrgSelect.getIdsResult()
            this.form.department = this.id
            let form = Object.assign({},this.form)
            await api_resource.create(form)
            this.fetch()
            this.dialogFormVisible = false
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
            this.table_form.t = 0
            const {rows , total }= await api_resource.get(this.table_form);
            this.table_data  = rows
            this.table_form.total = total
            setTimeout(() => {
                this.table_loading = false;
            }, 300);
        },
		async fetchMenu(){
            const { field, action,table } = await api_common.menuInit('personal_param');
            setTimeout(async ()=>{
                if(this.id!=''){
                    this.table_field = field;
                    let fields = await this.$request.get('performance/parameter/value/name0?department='+this.id)
                    fields.forEach(o=>{
                        this.$set(o,'width',120)
                        this.table_field.push(o)
                    })
                }
                this.table_form.dateLap = dayjs().format('YYYY-MM')
                this.table_actions = action;
                this.table_config = table
                this.fetchTableData()
            },500)
            
		},
    },
    async created() {
        this.fetchMenu();
    },
};
</script>