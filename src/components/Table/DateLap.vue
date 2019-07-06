<template>
    <div>
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
            format="yyyy-MM-dd"
            placeholder="选择日">
        </el-date-picker>
        <el-date-picker
            v-if="ctype==2"
            class="dateLap-date"
            v-model="value2"
            type="month"
            value-format="yyyy-MM"
            format="yyyy-MM"
            placeholder="选择月">
        </el-date-picker>
        <el-date-picker
            v-if="ctype==3"
            class="dateLap-date"
            v-model="value2"
            type="year"
            value-format="yyyy"
            format="yyyy"
            placeholder="选择年">
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
                return dayjs(this.value).format('YYYY-MM-DD')
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
                console.log(val,'')
            },
            immediate:true
        },
        ctype(){
            console.log(this.value)
            if(this.ctype == 2){
                this.value2 = dayjs(this.value).format('YYYY-MM')
            }else if(this.ctype == 1){
                this.value2 = dayjs(this.value).format('YYYY-MM-DD')
            }else {
                this.value2 = dayjs(this.value).format('YYYY')
            }
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
            },{
                value:'3',
                label:'年'
            }],
        }
    }
}
</script>
<style lang="scss">
.dateLap-select {
    .el-input__inner {
            border-right: none;
            border-radius: 2px 0 2px 2px;
    }
}
.dateLap-date{
    .el-input__inner {
        border-radius: 2px 2px 2px 0px;
    }
   
}
</style>
