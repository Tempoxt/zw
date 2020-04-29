<template>
    <div id="PerformanceSchemeForm">
        <div style="display: flex;justify-content: space-between;margin-bottom: 10px;">
            <div>
                考核方案名称：
                <el-input
                    placeholder="请输入"
                    style="width:200px"
                    v-model="input1">
                </el-input>
            </div>
            <div>
                  <el-button>验证</el-button>
                  <el-button type="primary">确认</el-button>
            </div>
        </div>
        <div>
           <el-row :gutter="10">
            <el-col :span="5">
                <div class="card">
                    <div class="card-title">考核参数表</div>
                    <div class="card-body">
                        <div style="padding:10px;display:flex;align-items: center;">
                             <el-select v-model="input1" placeholder="请选择">
                                <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                            <span>
                                <i class="el-icon-circle-plus-outline" style="font-size: 22px;color:#A3AFB7;padding-left:10px;cursor: pointer;"></i>
                            </span>
                        </div>
                        <ul style="padding-left:20px">
                            <li v-for="item in 20" style="margin-bottom: 6px;">  <el-link :underline="false">总绩效奖金</el-link></li>
                        </ul>
                    </div>
                </div>
            </el-col>
            <el-col :span="19">
                <div class="card">
                    <div class="card-title" style="display: flex;">
                       <div>
                            <div>
                                <el-button size="mini" style="width:36px;">0</el-button>
                                <el-button size="mini" style="width:36px;">1</el-button>
                                <el-button size="mini" style="width:36px;">2</el-button>
                                <el-button size="mini" style="width:36px;">3</el-button>
                                <el-button size="mini" style="width:36px;">4</el-button>
                            </div>
                            <div style="margin-top:6px">
                                <el-button size="mini" style="width:36px;">0</el-button>
                                <el-button size="mini" style="width:36px;">1</el-button>
                                <el-button size="mini" style="width:36px;">2</el-button>
                                <el-button size="mini" style="width:36px;">3</el-button>
                                <el-button size="mini" style="width:36px;">4</el-button>
                            </div>
                       </div>
                       <div  style="padding-left:30px">
                           <div>
                               <el-button size="mini" style="width:36px;">%</el-button>
                           </div>
                           <div style="margin-top:6px">
                               <el-button size="mini" style="width:36px;">.</el-button>
                           </div>
                       </div>
                       <div style="padding-left:30px">
                           <div>
                               <el-button size="mini" style="width:36px;">(</el-button>
                           </div>
                           <div style="margin-top:6px">
                               <el-button size="mini" style="width:36px;">)</el-button>
                           </div>
                       </div>
                        <div style="padding-left:30px">
                           <div>
                               <el-button size="mini" style="width:36px;">+</el-button>
                               <el-button size="mini" style="width:36px;">-</el-button>
                               <el-button size="mini" style="width:36px;">x</el-button>
                               <el-button size="mini" style="width:36px;">÷</el-button>
                               <el-button size="mini" style="width:36px;">=</el-button>
                           </div>
                           <div style="margin-top:6px">
                               <el-button size="mini" style="width:36px;"><</el-button>
                               <el-button size="mini" style="width:36px;">></el-button>
                               <el-button size="mini" style="width:36px;">≤</el-button>
                               <el-button size="mini" style="width:36px;">≥</el-button>
                               <el-button size="mini" style="width:36px;">≠</el-button>
                           </div>
                       </div>
                       <div style="padding-left:30px">
                           <div>
                               <el-button size="mini" style="width:36px;">:</el-button>
                           </div>
                           <div style="margin-top:6px">
                               <el-button size="mini" style="width:36px;">∴</el-button>
                           </div>
                       </div>

                       <div style="padding-left:30px">
                           <div>
                               <el-button size="mini" style="width:50px;">if</el-button>
                              <el-button size="mini" style="width:50px;">then</el-button>
                              <el-button size="mini" style="width:50px;">else</el-button>
                           </div>
                       </div>



                    </div>
                    <div class="card-body area" id="area">
                        <chart :data="value"/>
                    </div>
                </div>
            </el-col>
           </el-row>
        </div>
    </div>
</template>
<script>
import $ from 'jquery'
import chart from './chart.vue'
export default {
    components:{
        chart
    },
    data(){
        return {
            input1:'',
            options: [],
            value: [
                {
                    name:"总绩效奖金",
                    type:'text'
                },
                {
                    name:"=",
                    type:'symbol'
                },
                {
                    name:"考核基数",
                    type:'text',
                    subs:[
                         {
                            name:'考核基数',
                            type:'text'
                        },
                        {
                            name:'=',
                            type:'symbol'
                        },
                        {
                            name:'(',
                            type:'symbol'
                        },
                    ]
                },{
                    name:"x",
                    type:'symbol'
                },{
                    name:"考评总系数",
                    type:'text',
                    subs:[
                        {
                            name:'考评总系数',
                            type:'text'
                        },
                        {
                            name:'=',
                            type:'symbol'
                        },
                        {
                            name:'(',
                            type:'symbol'
                        },
                        {
                            name:'工作量系数',
                            type:'text',
                            subs:[
                                {
                                    name:'工作量系数',
                                    type:'text'
                                },
                                {
                                    name:'=',
                                    type:'symbol'
                                },{
                                    name:'(',
                                    type:'symbol'
                                },{
                                    name:'实际产值',
                                    type:'text',
                                    subs:[
                                         {
                                            name:'实际产值',
                                            type:'text'
                                        },
                                    ]
                                },{
                                    name:'÷',
                                    type:'symbol'
                                },{
                                    name:'标准产值',
                                    type:'text'
                                },{
                                    name:')',
                                    type:'symbol'
                                }
                            ]
                        },
                        {
                            name:'x',
                            type:'symbol'
                        },
                        {
                            name:'0.5',
                            type:'text'
                        },
                        {
                            name:'+',
                            type:'symbol'
                        },
                        {
                            name:'工作质系数',
                            type:'text',
                            subs:[
                                {
                                    name:'工作质系数',
                                    type:'text'
                                },
                                {
                                    name:'=',
                                    type:'symbol'
                                },{
                                    name:'(',
                                    type:'symbol'
                                },{
                                    name:'实际产值',
                                    type:'text'
                                },{
                                    name:'÷',
                                    type:'symbol'
                                },{
                                    name:'标准产值',
                                    type:'text'
                                },{
                                    name:')',
                                    type:'symbol'
                                }
                            ]
                        },
                        {
                            name:'x',
                            type:'symbol'
                        },{
                            name:'0.5',
                            type:'text'
                        }, {
                            name:')',
                            type:'symbol'
                        },{
                            name:'+',
                            type:'symbol'
                        },{
                            name:'(',
                            type:'symbol'
                        },{
                            name:'机台稼动率',
                            type:'text',
                            subs:[
                                {
                                    name:'机台稼动率',
                                    type:'text'
                                },
                                 {
                                    name:'=',
                                    type:'symbol'
                                },{
                                    name:'(',
                                    type:'symbol'
                                },{
                                    name:'实际产值',
                                    type:'text'
                                },{
                                    name:'÷',
                                    type:'symbol'
                                },{
                                    name:'标准产值',
                                    type:'text'
                                },{
                                    name:')',
                                    type:'symbol'
                                }
                            ]
                        },{
                            name:'-',
                            type:'symbol'
                        },{
                            name:'1',
                            type:'text'
                        },{
                            name:')',
                            type:'symbol'
                        }
                    ]
                },
            ],
        }
    },
    mounted(){
       

    }
}
</script>
<style lang="scss" >
#PerformanceSchemeForm {
    .card {
        color:#4C5D66;
        font-size: 12px;
        height: 100%;
        border: 1px solid #E4EAEC;
    }
    .card-title {
        padding:10px;
        background: #F5F5F5;
        border-bottom: 1px solid #E4EAEC;
    }
    .area {
        position: relative;
        height: 584px;
            // display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
    }
    .box {
        // position: absolute;
        // width: 100%;
        margin-bottom: 30px;
    }
    .line {
        width:2px;
		position: absolute;
        background: #FF8000;
    }
}
</style>