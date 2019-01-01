<template>
     <el-popover
        placement="bottom"
        title="选择图标"
        width="200"
        trigger="click"
       >
       <div class="icon-list">
           <el-scrollbar wrap-class="scrollbar-wrapper" class="scrollbar"> 
           <el-button :icon="`fa fa-${icon}`" circle v-for="(icon,i) in iconList" :key="i"></el-button>
            </el-scrollbar>
       </div>
        <span slot="reference" class="icon-span"><i class="fa fa-address-book"></i></span>
    </el-popover>
</template>

<style lang="scss" scoped>
.icon-span {
    display: block;
    padding: 5px;
    padding-top: 8px;
    cursor: pointer;
}
.icon-list {
    /deep/ button {
        margin-left:0;
        margin:4px 4px;
    }
}
.scrollbar {
    height: 200px;
}
</style>

<script>
export default {
    data(){
        return {
            iconList:[
                'address-book',
                'bandcamp',
                'address-card',
                'address-card-o',
                'bandcamp',
                'bath',
                'free-code-camp',
                'address-book',
                'bandcamp',
                'address-card',
                'address-card-o',
                'bandcamp',
                'bath',
                'free-code-camp',
                'address-book',
                'bandcamp',
                'address-card',
                'address-card-o',
                'bandcamp',
                'bath',
                'free-code-camp',
                'address-card',
                'address-card-o',
                'bandcamp',
                'bath',
                'free-code-camp',
                'address-book',
                'bandcamp',
                'address-card',
                'address-card-o',
                'bandcamp',
                'bath',
                'free-code-camp'
            ]
        }
    }
}
</script>


