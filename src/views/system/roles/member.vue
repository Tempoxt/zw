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
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="同部门" name="first">
                    <br />
                    <el-input v-model="input" placeholder="搜索"></el-input>
                    <el-table
                        ref="multipleTable"
                        :data="tableData.filter(data=>!input || data.real_name.includes(input)||(data.user_num+'').includes(input))"
                        tooltip-effect="dark"
                        style="width: 100%"
                        @selection-change="handleSelectionChange"
                    >
                        <el-table-column  type="selection" width="55"></el-table-column>
                        <el-table-column label="工号" prop="user_num" width="120"> </el-table-column>
                        <el-table-column prop="real_name" label="姓名" width="120"> </el-table-column>
                        <el-table-column prop="principalship" label="职位" show-overflow-tooltip> </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="组织结构" name="second">
                    <br />
                    <org :roleid="roleid" ref="org"/>
                </el-tab-pane>
            </el-tabs>
            <br />
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
import org from './org'
const defaultForm = function(){
    return {
        iconName:{}
    }
}
export default {
    components:{
        MemberCheckbox,
        org
    },
    props:['roleid','roleList'],
    watch:{
        roleid(){
            this.fetchTableData()
        }
    },
    mixins: [table_mixin],
    methods:{
         async delete() {
        let rows = this.table_selectedRows.map(row=>row.id)
        this.$confirm('此操作将删除选中行, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        })
            .then(() => {
            return this.api_resource.remove(rows.join(','),{roleid:this.roleid})
            })
            .then(() => {
            this.fetchTableData()
            })
        },
        handleSelectionChange(val){
            this.multipleSelection = val;
        },
        async add(){
            // this.roleList[0].group_role.forEach(async (item)=>{
            //     this.$set(item,'subs',(await this.$request.get('/usernew/roleuser',{params:{roleid:item.roleid}})).map(o=>{
            //        o.name = o.real_name
            //        return o
            //    }))
            // })
            this.tableData = await this.$request.get('user/roledept',{
                roleid:this.roleid,
                // keyword:this.input
            })
            this.dialogFormVisible = true
        },
        handleClick(){
            
        },
        async edit(){
            this.tableData = await this.$request.get('user/roledept',{
                roleid:this.roleid,
                // keyword:this.input
            })
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
        //    let form = Object.assign({},this.form)
        //    const {icon,name} = form.iconName
        //    form.name = name
        //    form.icon = icon
        //    let form = Object.assign({},this.form)
        //    form.ids = [form.emID]
        //    form.roleid = this.roleid

        //     this.$request.post('roles/member',form,{
        //         params:form
        //     })

        //     if(this.isInsert){
        //         await api_resource.create(form)
        //     }else{
        //         await api_resource.update(form.id,form)
        //     }
        //     this.dialogFormVisible = false
        //     this.fetchTableData()
        // let ids = this.$refs.tree.getCheckedNodes()
        // let res = [];
        // let f = (ids) => {
        //     ids.forEach(o=>{
        //         console.log(o)
        //         if(o.real_name){
        //             res.push(o.id)
        //         }
        //         if(o.subs && o.subs.length){
        //             f(o.subs)
        //         }
        //     })
        // }
        // f(ids)
        // await this.$request.post('roles/member',{
        //     ids:res,
        //     roleid:this.roleid,
        // },{
        //     params:{
        //         roleid:this.roleid,
        //         ids:res,
        //     }
        // })
        // this.dialogFormVisible = false
        // this.fetchTableData()
        let ids = []
        if(this.activeName==='first'){
            ids = this.multipleSelection.map(o=>o.id)
        }else{
            ids = this.$refs.org.getChecked()
        }
        await this.$request.post('roles/member',{
            ids,
            roleid:this.roleid,
        },{
            params:{
                roleid:this.roleid,
                ids,
            }
        })
        this.dialogFormVisible = false
        this.fetchTableData()
     
       
     }
    },
    data(){
        return {
            table_topHeight:300,
            form:defaultForm(),
            defaultForm,
            api_resource,
            activeName:'first',
            tableData: [{
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        input:'',
        multipleSelection:[]
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
