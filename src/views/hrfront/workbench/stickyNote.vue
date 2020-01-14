<template>
    <div id="stickyNote">
        <el-card class="box-card">
            <div slot="header" class="box-card-header">
                <div class="cardName"><i class="iconfont icon-bianlitie"></i><span>便利贴</span></div>
            </div>
            <div class="container">
                <div class="container_head flex_betwween">

                </div>
                <div class="container_content">

                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'stickyNote',
    data() {
        return {

        }
    }
}
</script>

<style lang="scss" scoped>
#stickyNote{
    .flex_betwween{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .icon-bianlitie{
        font-size: 16px;
    }
    .container{
        margin-top: 20px;
        .container_head{
            width: 100%;
            height: 40px;
            padding: 0 10px;
            box-sizing: border-box;
            background: #EECA78;
        }
        .container_content{
            height: 190px;
            box-shadow:0px 3px 10px rgba(0,0,0,0.1);
            border-radius:0px 0px 4px 4px;
        }
    }
    
}
</style>