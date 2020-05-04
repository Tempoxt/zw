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
                  <el-button type="primary" @click="submit">确认</el-button>
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
                            <li v-for="item in parameter" :key="item.id" style="margin-bottom: 6px;">  <el-link :underline="false" @click="changeText(item.parameter_name,'text')">{{item.parameter_name}}</el-link></li>
                        </ul>
                    </div>
                </div>
            </el-col>
            <el-col :span="19">
                <div class="card">
                    <div class="card-title" style="display: flex;">
                       <div>
                            <div>
                                <el-button size="mini" style="width:36px;" @click="changeText(0,'text')">0</el-button>
                                <el-button size="mini" style="width:36px;" @click="changeText(1,'text')">1</el-button>
                                <el-button size="mini" style="width:36px;" @click="changeText(2,'text')">2</el-button>
                                <el-button size="mini" style="width:36px;" @click="changeText(3,'text')">3</el-button>
                                <el-button size="mini" style="width:36px;" @click="changeText(4,'text')">4</el-button>
                            </div>
                            <div style="margin-top:6px">
                                <el-button size="mini" style="width:36px;" @click="changeText(5,'text')">5</el-button>
                                <el-button size="mini" style="width:36px;" @click="changeText(6,'text')">6</el-button>
                                <el-button size="mini" style="width:36px;" @click="changeText(7,'text')">7</el-button>
                                <el-button size="mini" style="width:36px;" @click="changeText(8,'text')">8</el-button>
                                <el-button size="mini" style="width:36px;" @click="changeText(9,'text')">9</el-button>
                            </div>
                       </div>
                       <div  style="padding-left:30px">
                           <div>
                               <el-button size="mini" style="width:36px;" @click="changeText('%','text')">%</el-button>
                           </div>
                           <div style="margin-top:6px">
                               <el-button size="mini" style="width:36px;" @click="changeText('.','text')">.</el-button>
                           </div>
                       </div>
                       <div style="padding-left:30px">
                           <div>
                               <el-button size="mini" style="width:36px;" @click="changeText('(','symbol')">(</el-button>
                           </div>
                           <div style="margin-top:6px">
                               <el-button size="mini" style="width:36px;" @click="changeText(')','symbol')">)</el-button>
                           </div>
                       </div>
                        <div style="padding-left:30px">
                           <div>
                               <el-button size="mini" style="width:36px;" @click="changeText('+','symbol')">+</el-button>
                               <el-button size="mini" style="width:36px;" @click="changeText('-','symbol')">-</el-button>
                               <el-button size="mini" style="width:36px;" @click="changeText('x','symbol')">x</el-button>
                               <el-button size="mini" style="width:36px;" @click="changeText('÷','symbol')">÷</el-button>
                               <el-button size="mini" style="width:36px;" @click="changeText('=','symbol')">=</el-button>
                           </div>
                           <div style="margin-top:6px">
                               <el-button size="mini" style="width:36px;"  @click="changeText('<','symbol')"><</el-button>
                               <el-button size="mini" style="width:36px;"  @click="changeText('>','symbol')">></el-button>
                               <el-button size="mini" style="width:36px;"  @click="changeText('≤','symbol')">≤</el-button>
                               <el-button size="mini" style="width:36px;"  @click="changeText('≥','symbol')">≥</el-button>
                               <el-button size="mini" style="width:36px;" @click="changeText('≠','symbol')">≠</el-button>
                           </div>
                       </div>
                       <div style="padding-left:30px">
                           <div>
                               <el-button size="mini" style="width:36px;" @click="changeText(':','symbol')">:</el-button>
                           </div>
                           <div style="margin-top:6px">
                               <!-- <el-button size="mini" style="width:36px;" @click="changeText('∴','symbol')">∴</el-button> -->
                           </div>
                       </div>

                       <div style="padding-left:30px">
                           <div>
                              <el-button size="mini" style="width:50px;" @click="changeText('if','symbol')">if</el-button>
                              <el-button size="mini" style="width:50px;" @click="changeText('then','symbol')">then</el-button>
                              <el-button size="mini" style="width:50px;" @click="changeText('else','symbol')">else</el-button>
                           </div>
                       </div>



                    </div>
                    <div class="card-body area" id="area">
                        <chart 
                        :data="value"
                         @remove="remove" 
                         @removeSubs="removeSubs" 
                         @addSubs="addSubs" 
                         ref="chart" 
                         @showCondition="showCondition"

                         @changeConditionLine="changeConditionLine"
                         @removeConditionItem="removeConditionItem"
                         @changeConditionItem="changeConditionItem"
                         @removeCondition="removeCondition"
                         @closeCondition="hideCondition"
                         />
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
    props:['orgid','id'],
    data(){
        return {
            parameter:[],
            input1:'',
            options: [],
            value:[
                {
                    name:"开始",
                    type:'text'
                },
            ],
            value2: [
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
    methods:{
        removeCondition(idx,parent){
            parent.condition = parent.condition.filter((o,i)=>i!=idx)
        },
        hideCondition(item){
            this.isCondition = false
            item.visible = false
        },
        showCondition(key){
            const item = this.findByKey(key)
            // this.currentConditionItem = item
            if(!item.condition){
               this.$set(item,'condition',[])
               item.condition.push([])
            }
            item.visible = true
            this.isCondition = true
            this.currentCondition = item
            this.initChart()
            console.log(this.value)
        },
        changeConditionItem(item){
            this.currentConditionItem = item
        },
        changeConditionLine(i){
            this.currentConditionLine = i
        },
        removeConditionItem(item,idx){
            this.currentCondition.condition[this.currentConditionLine].splice(idx,1)
        },
        pushCondition(name,atype){
            const { type,aname } = this.currentConditionItem||{}
            var currentCondition = this.currentCondition.condition[this.currentConditionLine]
            if(this.currentConditionItem && atype=='text'){
                if(type=='text'){
                    if(name=='.'||name=='%'||(!isNaN(name) && !isNaN(this.currentConditionItem.name))){
                       this.currentConditionItem.name = this.currentConditionItem.name+''+name
                    }else{
                       this.currentConditionItem.name = name
                    }
                    if(type=='symbol'){
                        currentCondition.push({name,type:atype})
                    }

                }
               return
            }
             if(atype=='symbol'){
                if(type=='text'||name=='('||name==')'){
                    this.currentCondition.condition[this.currentConditionLine].push({
                        name,type:atype
                    })
                    return
                }else{
                    if(type=='symbol'){
                        this.currentConditionItem.name = name
                        return
                    }
                }
              
            }
            this.currentCondition.condition[this.currentConditionLine].push({
                name,type:atype
            })
        },
        submit(){
            console.log(JSON.stringify(this.value))
            console.log(this.value)
        },
        async getParameter(){
            this.parameter = await this.$request.get('/performance/scheme/parameter',{params:{department:this.id}})
        },
        pushItem(name,type){
            const { key } = this.$refs.chart.current
            const { parent,idx } = this.findParentByKey(key)
            parent.splice(idx+1,0,{
                key:this.generateID(),
                name,
                type
            })
            this.initChart()
        },
        changeText(name,atype){
            if(this.isCondition){
                this.pushCondition(name,atype)
                return
            }
            const { key,type } = this.$refs.chart.current
            if(!key) return
            if(atype=='text'){
                if(type=='text'){
                    if(name=='.'||name=='%'||(!isNaN(name) && !isNaN(this.findByKey(key).name))){
                        this.findByKey(key).name = this.findByKey(key).name+''+name
                    }else{
                        this.findByKey(key).name = name
                    }
                    

                }
                if(type=='symbol'){
                    this.pushItem(name,atype)
                }
            }
            if(atype=='symbol'){
                if(type=='text'||name=='('||name==')'){
                    this.pushItem(name,atype)
                }else{
                    if(type=='symbol'){
                        this.findByKey(key).name = name
                    }
                }
                
            }
            this.initChart()
        },
        generateID(){
            return parseInt(Math.random()*1000000)
        },
        findParentByKey(key){
            var parent = ''
            var idx = 0
            ~function f(value){
                value.forEach((o,i)=>{
                    if(o.key==key){
                        idx = i
                        parent = value
                        return
                    }
                    if(o.subs){
                        f(o.subs)
                    }
                })
            }(this.value)
            return {parent,idx}
        },
        findByKey(key){
            var val = ''
            ~function f(value){
                value.forEach((o)=>{
                    if(o.key==key){
                        val = o
                        return
                    }
                    if(o.subs){
                        f(o.subs)
                    }
                })
            }(this.value)
            return val
        },
        initChart(){
            this.$refs.chart.current = null
            this.$refs.chart.init()
        },
        removeSubs(key){
            var o = this.findByKey(key)
            delete o.subs
            this.initChart()
        },
        addSubs(key){
            var o = this.findByKey(key)
            o.subs = [
               {
                    name:o.name,
                    type:'text'
                },
                {
                    name:'=',
                    type:'symbol'
                }
            ]
            console.log(this.value,'this.value')
            this.$nextTick(()=>{
               this.format(this.value)
               this.initChart()
            })
        },
        remove(key){
            ~function f(value){
                value.forEach((o,i)=>{
                    if(o.key==key){
                        value.splice(i,1)
                        return
                    }
                    if(o.subs){
                        f(o.subs)
                    }
                })
            }(this.value)
            this.initChart()
        },
        format(value){
            value.forEach(o=>{
                o.key = this.generateID()
                if(o.subs && o.subs.length){
                    this.format(o.subs)
                }
            })
        }
    },
    created(){
        this.getParameter()
        this.format(this.value)
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
        justify-content: center;
        align-items: center;
        padding: 10px;
    }
    .box {
        margin-bottom: 30px;
    }
    .line {
        width:2px;
		position: absolute;
        background: #FF8000;
    }
}
</style>