<template>
    <div id="systemMessages">
        <el-card class="box-card">
            <div slot="header" class="box-card-header">
                <div class="cardName"><i class="iconfont icon-xitongxiaoxi"></i><span>系统消息</span></div>
            </div>
            <div class="container">
                
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'systemMessages',
    data() {
        return {

        }
    }
}
</script>

<style lang="scss" scoped>
#systemMessages{
    .icon-xitongxiaoxi{
        font-size: 16px;
    }
    .container{
        height: 250px;
    }
}
</style>