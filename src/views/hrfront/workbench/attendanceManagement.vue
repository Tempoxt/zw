<template>
    <div id="attendanceManagement">
        <el-card class="box-card">
            <div slot="header" class="box-card-header flex_between">
                <div class="cardName"><i class="iconfont icon-wodekaoqin"></i><span>考勤管理</span></div>
                <div class="choosen_date"><i class="iconfont icon-icon_date"></i><span>{{attendanceMonth | timefilter}}</span></div>
                <el-date-picker
                    class="attendanceMonth"
                    @change="changeDate"
                    v-model="attendanceMonth"
                    :clearable="false"
                    type="month"
                    placeholder="选择日期">
                </el-date-picker>
            </div>
            <div class="container">
                <el-scrollbar style="width:100%;height: 100%;">
                    <div class="dataList flex_r_bc" v-for="item in dataList.rows" :key="item.id">
                        <div class="li_l flex_r_sc">
                            <span><span class="icon_zhiwen"></span>{{item.checkMonth}}月{{item.checkDay}}日&nbsp;{{item.weekDay}}</span>
                        </div>
                        <div class="li_r flex_r_sc">
                            <span class="clockIn" v-if="item['checktime'+count][0]&&item['checktime'+count][1]" v-for="count in 3" :key="count">
                                <span :class="`${item.exception.includes('OnDutyTime'+(count))?'color_orange':''}`">{{item['checktime'+count][0].substring(0,6).trim()}}</span>
                                -
                                <span :class="`${item.exception.includes('OffDutyTime'+(count))?'color_orange':''}`">{{item['checktime'+count][1].substring(0,6).trim()}}</span>
                            </span>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
        </el-card>
    </div>
</template>

<script>
import dayjs from 'dayjs'
import * as api_common from "@/api/common";

export default {
    name: 'attendanceManagement',
    data() {
        return {
            dataList: [],
            api_resource: api_common.resource('workbench/cardcheck'),
            attendanceMonth: dayjs()
        }
    },
    filters: {
        timefilter(val) {
            return dayjs(val).format('YYYY年MM月')
        }
    },
    methods: {
        async getData(params) {
            this.dataList = params ? await this.api_resource.get({datelap: params}) : await this.api_resource.get()
        },
        changeDate(val) {
            this.getData(dayjs(val).format('YYYY-MM'))
        },
    },
    
    created() {
        this.getData()
    }
}
</script>

<style lang="scss">
#attendanceManagement{
    .box-card{
        .el-card__body{
            padding-top: 10px;
            padding-bottom: 10px;
        }
    }
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
            display: inline-block;
            width: 80px;
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
        position: relative;;
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
        height: 239px;
        .dataList{
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
                // margin-right: 10%;
                font-size: 14px;
                color: #4C5D66;
            }
            .li_r{
                font-size: 12px;
                color: #A3AFB7;
                &>span{
                    display: inline-block;
                }
                .clockIn:not(:last-child){
                    margin-right: 10px;
                }
                .color_orange{
                    color: #F47A24;
                }
            }
        }
    }
}
</style>