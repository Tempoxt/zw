<template>
    <div id="weater">
        <div class="box flex_row_start">
            <div class="box_left flex_row_between">
                <div class="iconfont icon-duoyun"></div>
                <div class="weaterInfo">
                    <span>多云</span>
                    <span>15℃ <i>21/14</i></span>
                </div>
            </div>
            <div class="box_right flex_column_between">
                <span class="time">11:56</span>
                <div class="dateInfo">
                    <span class="dayTime">2020年1月13日  腊月十九</span>
                    <span class="location"><i></i>深圳市宝安区松岗街道</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'weater',
    data() {
        return {

        }
    }
}
</script>

<style lang="scss" scoped>
i{
    display: inline-block;
    font-style: normal;
}
.flex_row_start{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}

.flex_row_between{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
.flex_column_between{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
}

#weater{
    padding: 0px 35px;
    margin-bottom: 15px;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    border-radius: 4px;
    .box{
        height: 136px;
        .box_left{
            height: 90px;
            padding-right: 40px;
            border-right: 1px solid #E4E4E4;
            .icon-duoyun{
                font-size: 60px;
                margin-right: 20px;
            }
            .weaterInfo{
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                span{
                    font-size: 20px;
                    color: #37474F;
                    &:first-child{
                       margin-bottom: 9px; 
                    }
                    i{
                        font-size: 14px;
                    }
                }
            }
        }
        .box_right{
            padding-left: 40px;
            color: #37474F;
            .time{
                display: block;
                font-size: 36px;
            }
            .dateInfo{
                span{
                    display: block;
                }
                .dayTime{
                    font-size: 16px;
                }
                .location{
                    span{
                        font-size: 14px;
                    }
                    i{
                        width: 12px;
                        height: 14px;
                        margin-right: 10px;
                        background: url('../../../assets/style/workbench_img/location_icon.png');
                        background-size: cover;
                    }
                }
                
            }
        }
    }
}
</style>