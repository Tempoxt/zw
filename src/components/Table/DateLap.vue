<template>
    <div>
        <el-select v-model="type" placeholder="请选择" style="width:60px" class="dateLap-select">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
        <el-date-picker
                v-if="type==1"
                class="dateLap-date"
                v-model="value2"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                placeholder="选择日">
        </el-date-picker>
        <el-date-picker
                v-if="type==2"
                class="dateLap-date"
                v-model="value2"
                type="month"
                value-format="yyyy-MM"
                format="yyyy-MM"
                placeholder="选择月">
        </el-date-picker>
         <el-date-picker
                v-if="type==3"
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
export default {
    props:{
        value:{}
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
             
            },
            immediate:true
        }
    },
    data(){
        return {
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
            type:'2'
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
