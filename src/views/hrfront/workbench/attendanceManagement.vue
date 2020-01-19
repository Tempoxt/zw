<template>
    <div id="attendanceManagement">
        <el-card class="box-card">
            <div slot="header" class="box-card-header flex_between">
                <div class="cardName"><i class="iconfont icon-wodekaoqin"></i><span>考勤管理</span></div>
                <div class="choosen_date"><i class="iconfont icon-icon_date"></i><span>{{attendanceMonth | timefilter}}</span></div>
                <el-date-picker
                    class="attendanceMonth"
                    v-model="attendanceMonth"
                    :clearable="false"
                    type="month"
                    placeholder="选择日期">
                </el-date-picker>
            </div>
            <div class="container">
                <ul>
                    <li class="flex_r_sc">
                        <div class="li_l flex_r_sc">
                            <span><span class="icon_zhiwen"></span>1月13日&nbsp;星期一</span>
                        </div>
                        <div class="li_r flex_r_sc">
                            <span>打卡时间&nbsp;&nbsp;&nbsp;<span class="time_start">&nbsp;&nbsp;&nbsp;07:56-12:02</span><span class="time_end color_orange">&nbsp;&nbsp;&nbsp;13:30-19:09</span></span>
                        </div>
                    </li>
                </ul>
            </div>
        </el-card>
    </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
    name: 'attendanceManagement',
    data() {
        return {
            attendanceMonth: dayjs()
        }
    },
    filters: {
        timefilter(val) {
            console.log(val, 119)
            let time
            time = dayjs(val).format('YYYY年MM月')
            return time
        }
    }
}
</script>

<style lang="scss">
#attendanceManagement{

}
</style>

<style lang="scss" scoped>
.flex_between{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

#attendanceManagement{
    .cardName{
        .icon-wodekaoqin{
            font-size: 16px;
        }
    }
    .choosen_date{
        span{
            font-size: 14px;
            color: #A3AFB7;
        }
        .icon-icon_date{
            font-size: 16px;
            color: #F47A24;
        }
        cursor: pointer;
    }

    .box-card-header{
        position: relative;
        .attendanceMonth{
            position: absolute;
            top: 5px;
            right: 0px;
            width: 100px;
            opacity: 0;
        }        
    }

    .container{
        position: relative;
        height: 250px;
        ul{
            li{
                padding: 15px 0;
                border-bottom: 1px solid #F5F5F5;
                .icon_zhiwen{
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    margin-right: 10px;
                    margin-bottom: -3px;
                    background: url('~@imgs/workbench-img/icon_zhiwen.png');
                    background-size: cover;
                }
                .li_l{
                    margin-right: 10%;
                    font-size: 14px;
                    color: #4C5D66;
                }
                .li_r{
                    font-size: 12px;
                    color: #A3AFB7;
                    .color_orange{
                        color: #F47A24;
                    }
                }
            }
        }
    }
}
</style>