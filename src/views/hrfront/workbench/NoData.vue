<template>
    <div class="nodata">
        <div class="avatar">
            <img src="./nodataicon.png" alt="">
        </div>
        <div class="info">
            <span>{{msg}}</span>
        </div>
        <slot />
    </div>
</template>
<script>
export default {
    props:['msg']
}
</script>

<style lang="scss" scoped>
.nodata {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    display: flex;
    justify-content: center;
    padding:20px 0 10px 0;
    flex-direction: column;
    align-items: center;
    .avatar{
        width: 100px;
        height: 80px;
         img {
             width: 100%;
         }
    }
    .info {
        padding: 10px 0 0px 0;
        margin-bottom: 8px;
        color: #CBCBCB;
    }
    
}
</style>
