<template>
    <el-tabs v-model="activeName" class="table-tabs">
            <el-tab-pane label="基金收入" name="first">
                    <foundinTable />
            </el-tab-pane>
            <el-tab-pane label="支出申请" name="second">
                    <foundexpendTable />
            </el-tab-pane>

    </el-tabs>
</template>
<script>
import foundinTable from './foundinTable'
import foundexpendTable from './foundexpendTable'
export default {
    components:{
        foundinTable,
        foundexpendTable
    },
    data(){
        return {
            activeName:'first'
        }
    }
}
</script>
