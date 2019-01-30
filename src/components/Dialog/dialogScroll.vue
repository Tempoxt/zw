<template>
    <el-scrollbar wrap-class="scrollbar-wrapper" :style="{height:height+'px'}" class="scrollbar">
        <slot />
    </el-scrollbar>
</template>
<script>
export default {
    data(){
        return {
            height:$(window).height()-400
        }
    },
    mounted(){
        this.height = $(window).height()-400
    }
}
</script>
<style lang="scss" scoped>
.scrollbar {
    overflow-x: hidden;
    /deep/ .scrollbar-wrapper {
        overflow-x: hidden;
    }
}
</style>

