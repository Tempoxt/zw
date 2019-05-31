<template>
    <fragment>
         <el-table-column
                :render-header="renderHeader"
                :prop="column.name"
                :label="column.showname"
                v-for="column in table_field.filter(column=>!column.fed_isvisiable).filter(column=>!column.isvisiable)"
                :key="column.id"
                :width="column.width||'auto'"
                :sortable="column.issort?'custom':false"
            >
            <template slot-scope="scope">
                 <table-column :row="scope.row" :elColumn="scope.column" :column="column" :template="template"/>
            </template>
        </el-table-column>
    </fragment>
    
</template>
<script>
import tableColumn from '@c/publicTable/tableColumn'
export default {
    props:['table_field','template'],
    components:{
        tableColumn
    },
    methods:{
        renderHeader(h, { column, $index }){
            return <span domPropsInnerHTML={column.label}></span>
        }
    }
}
</script>
