 <template>
    <div id="backlog">
        <el-card class="box-card">
            <div slot="header" class="box-card-header flex_betwween">
                <div class="cardName"><i class="iconfont icon-daibanshixiang"></i><span>待办事项</span></div>
                <span class="num">全部<i class="color_bule">（100）</i></span>
                <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
            </div>
            <ul class="itemList">
                <li>
                    <i>25</i>
                    <span>意外险办理</span>
                </li>
            </ul>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'backlog',
    data() {
        return {
            
        }
    }
}
</script>

<style lang="scss">
#backlog{
    .el-card__body{
        height: 90px;
    }
}
</style>

<style lang="scss" scoped>
i{
    font-style: normal;
}
.flex_betwween{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.color_bule{
    font-style: normal;
    color: #0BB2D4;
}

#backlog{
    .cardName{
        .icon-daibanshixiang{
            font-size: 16px;
        }
    }
    
    .num{
        color: #37474F;
        font-size: 16px;
    }
    .itemList{
        padding-top: 20px;
        li{
            width: 160px;
            text-align: center;
            i{
                display: block;
                margin-bottom: 8px;
                font-size: 16px;
                font-weight:bold;
                color: #0BB2D4;
            }
            span{
                font-size: 12px;
                color: #4C5D66;
            }
        }
    }
}
</style>