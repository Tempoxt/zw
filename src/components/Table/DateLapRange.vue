<template>
    <div class="flex">
        <el-select v-model="ctype" :disabled="disabled" placeholder="请选择" style="width:60px" class="dateLap-select">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
        </el-select>
        <el-date-picker
            v-if="ctype==1"
            class="dateLap-date"
            v-model="value2"
            value-format="yyyy-MM-dd"
            style="width:250px"
            type="daterange"
            start-placeholder="开始日"
            end-placeholder="结束日"
            placeholder="选择日">
        </el-date-picker>
        <el-date-picker
            v-if="ctype==2"
            class="dateLap-date"
            v-model="value2"
            style="width:250px"
            value-format="yyyy-MM"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            type="monthrange"
            placeholder="选择月">
        </el-date-picker>
       
    </div>
</template>
<script>
import dayjs from 'dayjs'
import { setTimeout } from 'timers';
export default {
    props:{
        value:{},
        type:{},
        disabled:{
            default:false
        },
    },
    computed:{
        value2:{
            get(){
                return this.value || dayjs(this.value).format('YYYY-MM-DD')
            },
            set(val){
                this.$emit('input',val)
                this.$emit('change',val)
            }
        }
    },
    watch:{
        value:{
            handler(val){
                // console.log(val,'')
            },
            immediate:true
        },
        ctype(){
            this.$emit('change')
        }
    },
    data(){
        return {
            ctype:this.type||'2',
            options:[{
                value:'1',
                label:'日'
            },{
                value:'2',
                label:'月'
            }],
        }
    }
}
</script>
<style lang="scss">
.flex{
    display: flex;
    align-items: center
}
.dateLap-select {
    .el-input__inner {
        border-right: none;
        border-radius: 2px 0 2px 2px;
    }
}
.dateLap-date{
    border-radius: 0px 2px 2px 0px!important;
    .el-input__inner {
        border-radius: 2px 2px 2px 0px;
    }
   
}
</style>
