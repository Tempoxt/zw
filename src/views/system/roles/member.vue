<template>
    <ui-table 
    ref="table" 
    :table_query.sync="table_form.query"
     :table_column="table_field" 
    @query="querySubmit"
    
    >
         <el-dialog
      :title="dialogStatus==='insert'?'添加':'编辑'"
      :visible.sync="dialogFormVisible"
      class="public-dialog"
      v-el-drag-dialog
    >
        <el-form ref="form" :model="form" label-width="80px" label-position="left">
                <member-checkbox />
        </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleFormSubmit">确 定</el-button>
      </div>
    </el-dialog>


            <table-header
            :table_actions="table_actions"
            :table_selectedRows="table_selectedRows"
            :table_form.sync="table_form"
             :table_column="table_field"
            @action="handleAction"
            
            ></table-header>
            <el-table 
                @selection-change="handleChangeSelection"
                :data="table_data"
                border 
                style="width: 100%"
                :row-class-name="table_state_className"
                :header-cell-style="headerCellStyle"
                :height="table_height"
                @header-dragend="table_dragend"
                @sort-change="table_sort_change"
                v-loading="table_loading">
                <el-table-column 
                type="selection" 
                width="60" 
                class-name="table-column-disabled"
                :selectable="table_disable_selected"
                >
                </el-table-column>
                 <el-table-column type="index" :index="indexMethod" />
                <el-table-column
                   
                    :prop="column.name"
                    :label="column.showname"
                    v-for="column in table_field.filter(column=>!column.fed_isvisiable)"
                    :key="column.id"
                    :width="column.width||'auto'"
                    :sortable="column.issort?'custom':false"
                    
                >
                <template slot-scope="scope">
                    <template v-if="column.name==='icon'">
                        <i :class="scope.row[column.name]"></i>
                    </template>
                    <template v-else>
                        {{ scope.row[column.name] }}
                    </template>
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
const api_resource = api_common.resource('roles/member')
import table_mixin from "@c/Table/table_mixin";
import MemberCheckbox from './MemberCheckbox'
const defaultForm = function(){
    return {
        iconName:{}
    }
}
export default {
    components:{
        MemberCheckbox
    },
    props:['roleid'],
    watch:{
        roleid(){
            this.fetchTableData()
        }
    },
    mixins: [table_mixin],
    methods:{
   
        add(){
            this.dialogFormVisible = true
        },
        edit(){
            this.form =Object.assign({}, this.table_selectedRowsInfo[0])
            const {name,icon} = this.form
            this.form.iconName = {
                name,
                icon
            }
            this.dialogFormVisible = true
        },
        async fetchTableData() {
            this.table_loading = true
            this.table_form.roleid = this.roleid
            const {rows,total}  =  await api_resource.get(this.table_form);
            this.table_data = rows
           
            this.table_form.total = total
            setTimeout(()=>{
                this.table_loading = false
            },300)
        },
        async handleFormSubmit(){
           let form = Object.assign({},this.form)
           const {icon,name} = form.iconName
           form.name = name
           form.icon = icon
            if(this.isInsert){
                await api_resource.create(form)
            }else{
                await api_resource.update(form.id,form)
            }
            this.dialogFormVisible = false
            this.fetchTableData()
        }
    },
    data(){
        return {
            table_height:window.innerHeight-300,
            form:defaultForm(),
            defaultForm,
            api_resource
        }
    },
    async created() {
        const { field, action,table} = await api_common.menuInit(
            "roles/member",
        );
        this.table_field = field;
        this.table_actions = action;
        this.table_config = table;
        this.fetchTableData()
    }
}
</script>
<style lang="scss">

</style>
