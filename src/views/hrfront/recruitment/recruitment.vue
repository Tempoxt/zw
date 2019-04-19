<template>
    <div>
        <el-tabs v-model="activeName"  class="table-tabs">
            <el-tab-pane label="待招聘" name="first">
                <jobmsg url="recruit/jobmsg"/>
            </el-tab-pane>
            <el-tab-pane label="已完成" name="second" lazy>
                <jobmsg url="recruit/donejobmsg"/>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import jobmsg from './jobmsg'
export default {
    components:{
        jobmsg,
    },
    data(){
        return {
            activeName:'first'
        }
    }
}
</script>
