<template>
    <el-tabs v-model="activeName" class="table-tabs public-table-container">
            <el-tab-pane label="爱心基金汇总" name="second">
                <inexpendsummTable />
            </el-tab-pane>
            <el-tab-pane label="爱心基金展示" name="third">
                <inexpendshowTable />
            </el-tab-pane>
    </el-tabs>
</template>
<script>
import inexpendsummTable from './inexpendsummTable'
import inexpendshowTable from './inexpendshowTable'
export default {
    components:{
        inexpendsummTable,
        inexpendshowTable
    },
    data(){
        return {
            activeName:'second'
        }
    }
}
</script>
