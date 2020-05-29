<template>
    <div id="PerformanceSchemeChart">
        <div v-for="(row,i) in rows" :ref="row[0].id" :data-pid="row[0].pid" :data-key="row[0].key" class="box" :key="row[0].key">
            <a @keyup.delete="remove(item)"   v-for="(item) in row" :ref="item.id" :data-key="item.key"  :key="item.key" class="row-item" href="javascript:;" @click="setCurrent(item,row)" >
                 <!-- <el-popover
                    placement="right"
                    trigger="click"
                    width="100"
                    v-if="item.type=='text'"
                    >
                    <div >
                       <div>
                            <el-button type="text" style="color:#4C5D66;font-weight:bold">加参数</el-button>
                       </div>
                       <div>
                             <el-button type="text" style="color:#4C5D66;font-weight:bold" @click="addSubs(item)">子公式</el-button>
                       </div>
                       <div>
                             <el-button type="text" style="color:#4C5D66;font-weight:bold" @click="showCondition(item)">加条件</el-button>
                       </div>
                    </div>
                    <span class="icon"   slot="reference" >
                        <img src="@/assets/imgs/icon_subs.png" alt="">
                    </span>
                </el-popover> -->

                <el-popover
                    placement="right-start"
                    trigger="hover"
                    v-model="item.visible"
                    :popper-options="{boundariesElement: 'body'}"
                    >
                    <div style="min-width:400px">
                        <div style="font-size:16px;color:#143040;display: flex;justify-content: space-between;font-weight:bold">
                            <span>{{item.name}}条件</span>
                            <!-- <span @click="closeCondition(item)"><i class="el-icon-close"></i></span> -->
                        </div>
                        <div  v-for="(c,i) in item.condition" :key="i" style="display:flex;justify-content: space-between;align-items: center;">
                            <div class="PerformanceSchemeChart-select-input">
                                <span>{{item.name}}</span>
                                <span >:</span>
                                <!-- @keyup.delete="removeConditionItem(item,j)" -->
                                <a v-for="(d,j) in c" :key="j" href="javascript:;" @click.stop.prevent="changeConditionItem(d,i)" >{{d.name}}</a>
                                <!-- <span class="input"><input type="text" @focus="changeConditionLine(i)"></span> -->
                            
                            </div>
                        </div>
                   
                    </div>
                    <span slot="reference" style="color:#0BB2D4"  v-if="item.condition && item.condition.length">{{item.name}}</span>
                </el-popover>
                <span v-if="!item.condition" >{{item.name}}</span>
            </a>
        </div>

         <!-- <div >
            <span>机台稼动率1</span>: <span>机台稼动率</span> > <span>1</span> <span>then</span> <span>机台稼动率</span>
        </div>
            <div >
            <span>机台稼动率1</span>: <span>机台稼动率</span> > <span>1</span> <span>then</span> <span>机台稼动率</span>
        </div>
            <div >
            <span>机台稼动率1</span>: <span>机台稼动率</span> > <span>1</span> <span>then</span> <span>机台稼动率</span>
        </div> -->

        <!-- <div style="display: flex;justify-content: flex-end;">
                <el-button size="small" >修改</el-button>
        </div> -->


        <div :key="i" v-for="(l,i) in line" class="line" :style="`left:${l.l}px;height:${l.h}px;top:${l.t}px;`">
            <div :style="`margin-top:${l.h/2-10}px`" class="remove-text" title="移除" @click="removeSubs(l)"> 
                <i class="el-icon-remove-outline"></i> 子公式</div>
        </div>
    </div>
</template>
<script>

import $ from 'jquery'

export default {
    props:['data'],
    data(){
        return {
            rows:[],
            line:[]
        }
    },
    methods:{
        hoverShowCondition(item){
          
            if(item.condition && item.condition.length){
                item.visible = true
                this.$set(item,'visible',true)
            }
           
            
        },
        hoverHideCondition(item){
            setTimeout(()=>{
                 item.visible = false
            },1000)
        },
        closeCondition(item){
         this.$emit('closeCondition',item)
        },
        removeCondition(i,parent){
            this.$emit('removeCondition',i,parent)
        },
        changeConditionItem(item,i){
            
            this.changeConditionLine(i)
            this.$emit('changeConditionItem',item)
            
        },
        removeConditionItem(item,idx){
            this.$emit('removeConditionItem',item,idx)
        },
        showCondition(item){
            this.$emit('showCondition',item.key,item)
            this.$nextTick(()=>{
                document.body.click()
            })
        },
        changeConditionLine(i){
            this.$emit('changeConditionLine',i)
        },
        pushCondition(item){
             item.condition.push([
                 {
                    name:item.name,
                    type:'text',
                },
                {
                    name:':',
                    type:'symbol',
                }
             ])

        },
        addSubs({key}){
            this.$emit('addSubs',key)
        },
        removeSubs({key}){
            this.$emit('removeSubs',key)
        },
        remove({key,pid,pkey}){
           if(pid) {
               this.removeSubs({key:pkey})
               return
           }
           this.$emit('remove',key)
        },
        setCurrent(item){
            this.current = item
        },
        changeText(name){
            this.current.name = name
        },
        format(data){
           var row = []
           data.forEach(o=>{
               row.push(o)
               if(o.subs) {
                   o.id = `dom_${this.generateID()}`
                   o.subs[0].pid = o.id
                   o.subs[0].pkey = o.key
                   o.subs[0].name = o.name
                   o.subs[0].id = "calc_pos"
               }
           })
           this.rows.push(row)
           var subs = data.filter(d=>d.subs).map(d=>d.subs)
           if(subs.length){
               subs.reverse().forEach(v=>this.format(v))
           }
        },
        generateID(){
            return parseInt(Math.random()*1000000)
        },
        calcLeft(){
            this.$nextTick(()=>{
                if(!this.$refs.calc_pos) return
                this.$refs.calc_pos.forEach((dom)=>{
                    var pid = dom.getAttribute('data-pid')
                    var $dom = $(dom)
                    if(pid){
                        var $parent = $(this.$refs[`${pid}`])
                        $(dom).css({
                            'padding-left':$parent.position().left-10
                        })
                        this.line.push({
                            pid,
                            key:$parent.attr('data-key'),
                            h:($dom.position().top - $parent.position().top)- 28 ,
                            t:$parent.position().top + 32,
                            l:$parent.position().left+$parent.width()/2+(+$parent.css('padding').replace('px',''))
                        })
                    }
                })
            })
        },
        init(){
            this.line = []
            this.rows = []
            this.format(this.data)
            this.calcLeft()
        }
    },
    created(){
       this.init()
    }
}
</script>
<style lang="scss">
#PerformanceSchemeChart {
    .row-item {
        border:1px solid transparent;
        border-bottom: 1px solid #143040;
        padding: 4px;
        margin: 0px 2px;
        display: inline-block;
        cursor: pointer;
        color:#143040;
        position: relative;
        &:active {
            color:#0BB2D4;
            // font-weight: bold;
            border-color:#0BB2D4;
        }
         &:focus {
            color:#0BB2D4;
            border-color:#0BB2D4;
            // font-weight: bold;
        }
        &:hover {
            color:#0BB2D4;
            .icon {
                display: flex;
            }
        }
        .icon {
            position: absolute;
            bottom: -11px;
            right: -11px;
            font-size: 16px;
            color: #0BB2D4;
            background: #fff;
            box-shadow: 0px 4px 10px rgba(0,0,0,0.2);
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            display: none;
        }
    }
     .box {
        width: 100%;
        margin-bottom: 30px;
    }
    .line {
        width:1px;
		position: absolute;
        background: #FF8000;
        .remove-text {
            width:100px;
            padding-left:10px;
            font-size:12px;
            color:#FF8000;
            cursor: pointer;
            &:hover {
                color:#e07101;
            }
        }
    }
    
}
.PerformanceSchemeChart-select-input {
        background:#FAFAFA;
        padding:10px;
        margin: 10px 0;
        display:flex;
        // width: calc(100% - 30px);
        span,a {
            display: inline-block;
            border-bottom: 1px solid #76838F;
            margin: 0 4px;
            padding: 0 4px;
            color:#606266;
            white-space: nowrap;
            &:focus {
                color:#0BB2D4;
            }
        }
        .input {
            border-color: #0BB2D4;
        }
        input {
            width: 30px;
            border: none;
            caret-color:#0BB2D4;
            outline: none;
            background: #FAFAFA;
        }
}
 .icon-remove {
    border-color:transparent;
    font-size: 18px;
    color: #606266;
}
</style>