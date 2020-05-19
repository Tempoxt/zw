<template>
    <div id="PerformanceSchemeForm">

        <div style="display: flex;justify-content: space-between;margin-bottom: 10px;">
            <div>
                考核方案名称：
                <el-input
                    placeholder="请输入"
                    style="width:200px"
                    v-model="scheme_name">
                </el-input>
            </div>
            <div>
                  <el-button>验证</el-button>
                  <el-button type="primary" @click="submit">确认</el-button>
            </div>
        </div>
        <div>
           <el-row :gutter="10" style="display:flex">
            <el-col :span="5" style="width:250px">
                <div class="card">
                    <div class="card-title">考核参数表</div>
                    <div class="card-body">
                        <div style="padding:10px;display:flex;align-items: center;">
                             <!-- <el-select v-model="input1" placeholder="请选择">
                                <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select> -->

                            <el-input v-model="input1" placeholder="请输入内容" clearable></el-input>
                            <span @click="addparameter">
                                <el-popover
                                placement="right"
                                width="330"
                                trigger="click">
                                <div style="padding:14px">
                                    <div style="font-size: 16px;font-weight: bold;padding: 0 0 10px 0;">添加参数</div>
                                    <div  style="display:flex;align-items: center;font-size:14px;margin-bottom:10px">
                                         参数类别：
                                         <el-select v-model="parameterForm.parameter_classify" placeholder="请选择" style="width:200px">
                                             <el-option label="年度参数" value="年度参数"></el-option>
                                             <el-option label="月份参数" value="月份参数"></el-option>
                                             <el-option label="个人月参数" value="个人月参数"></el-option>
                                        </el-select>
                                    </div>
                                    <div  style="display:flex;align-items: center;font-size:14px;margin-bottom:10px">
                                         参数名称：
                                         <el-input v-model="parameterForm.parameter_name" placeholder="请输入内容" style="width:200px"></el-input>
                                    </div>
                                    <div  style="display:flex;align-items: center;font-size:14px;margin-bottom:10px" v-if="parameterForm.parameter_classify=='个人月参数'||parameterForm.parameter_classify=='月份参数'">
                                         参数分类：
                                         <el-select v-model="parameterForm.parameter_category" placeholder="请选择" style="width:200px">
                                           <el-option label="基础参数" value="0"></el-option>
                                           <el-option label="计算参数" value="1"></el-option>
                                        </el-select>
                                    </div>


                                    <div style="text-align: right;">
                                        <el-button type="primary" @click="submitParameterForm">确认</el-button>
                                    </div>
                                </div>
                                <i class="el-icon-circle-plus-outline" slot="reference" style="font-size: 22px;color:#A3AFB7;padding-left:10px;cursor: pointer;"></i>
                                </el-popover>


                              
                            </span>
                        </div>
                         <!-- 576px; -->
                        <ul style="padding-left:20px;overflow-y: scroll;height: 100%;">
                            <li v-for="item in parameterSearch" :key="item.id" style="margin-bottom: 6px;">  <el-link :underline="false" @click="changeText(item.parameter_name,'text')">{{item.parameter_name}}</el-link></li>
                        </ul>
                    </div>
                </div>
            </el-col>
            <el-col :span="19" style="width:100%">
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
                              <!-- <el-button size="mini" style="width:50px;" @click="changeText('else','symbol')">else</el-button> -->
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
    computed:{
        parameterSearch(){
            if(this.input1) {
                return this.parameter.filter(o=>o.parameter_name.indexOf(this.input1)!==-1)
            }
            return this.parameter
        }
    },
    props:['orgid','id','formValue','schemeName','dialogStatus','row'],
    data(){
        return {
            parameterForm:{},
            parameter:[],
            input1:'',
            options: [],
            scheme_name:'',
            value:[
                {
                    name:"总绩效奖金",
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
        async submitParameterForm(){
            this.parameterForm.department =this.id
            if(this.parameterForm.parameter_classify!=='个人月参数'||this.parameterForm.parameter_classify!=='月份参数'){
                this.parameterForm.parameter_category = null
            }
            await this.$request.post('/performance/parameter/name',this.parameterForm)
            this.parameterForm = {}
            this.getParameter()
            try {
                document.body.click()
            } catch (error) {
                
            }
        },
        addparameter(){

        },
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
            this.currentConditionItem = null
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
        async submit(){

            // 删除子公式前显示两个节点
            var value = JSON.parse(JSON.stringify(this.value))
            ~function f(value){
                value.forEach((o)=>{
                    if(o.subs){
                        o.subs = o.subs.filter(o=>!o.disabled)
                        f(o.subs)
                    }
                })
            }(value)
         
            if(this.dialogStatus==='insert'){
                await this.$request.post('/performance/scheme',{
                    department:this.id,
                    formula:value,
                    scheme_name:this.scheme_name
                },{
                    headers:{
                        "Content-Type":'application/json'
                    }
                })
            }else{
                await this.$request.put('/performance/scheme/'+this.row.id,{
                    department:this.id,
                    formula:value,
                    scheme_name:this.scheme_name
                },{
                    headers:{
                        "Content-Type":'application/json'
                    }
                })
            }
            this.$emit('submit')
           
        },
        async getParameter(){
            this.parameter = await this.$request.get('/performance/scheme/parameter',{params:{department:this.id}})
        },
        pushItem(name,type){
            const { key } = this.$refs.chart.current
            const { parent,idx } = this.findParentByKey(key)
            let item = {
                key:this.generateID(),
                name,
                type
            }
            parent.splice(idx+1,0,item)
            this.$refs.chart.current = item
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
                // 选入“）”再选÷×＋-时“）”就莫得
                if((name=='+'||name=='-'||name=='x'||name=='÷')){
                    this.pushItem(name,atype)
                }else{
                    if(type=='text'||name=='('||name==')'){
                        this.pushItem(name,atype)
                    }else{
                        if(type=='symbol'){
                            this.findByKey(key).name = name
                        }
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
            // this.$refs.chart.current = null
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
                    type:'text',
                    disabled:true
                },
                {
                    name:'=',
                    type:'symbol',
                    disabled:true
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
        if(this.formValue) {
            this.value = this.formValue
            this.scheme_name = this.schemeName
        }
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