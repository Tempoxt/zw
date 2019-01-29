<template>
    <div @wheel="zoomWheelHandler"  style="position: relative;">
    <fullscreen v-model="full">
        <div style="display: flex;width: 100%;justify-content: space-between;padding: 10px 20px;position: absolute;z-index:3;">
                
    <!-- position: absolute; right: 34px;top: 3px;z-index:3;display:flex; -->
            <el-button @click="exportCanvas" ><i data-v-0845e584="" class="icon iconfont icon-daochu" style="padding-right: 10px; margin-right: -10px;"></i> 导出</el-button>
            <el-button-group>
                <el-button @click="full=!full" ><i data-v-0845e584="" class="icon iconfont icon-xingzhuang" ></i></el-button>
                <el-button @click="fetchData" ><i data-v-0845e584="" class="icon iconfont icon-shuaxin" ></i></el-button>
            </el-button-group>
        </div>
       
        <div >
            <div id="box" :class="state==='export'?'export':''" :style="{ transform: transformVal }">

            </div>
        </div>
        </fullscreen>
    </div>
</template>
<script>
require('@public/static/jq/jOrgChart/jquery.jOrgChart.js')
import '@public/static/jq/jOrgChart/jquery.jOrgChart.css'
import * as api_common from "@/api/common";
const api_resource = api_common.resource("org");
import html2canvas from 'html2canvas';
const download = require('downloadjs')
import { scale, rotate, translate, transform, toCSS, fromString } from 'transformation-matrix'
import fullscreen from '@c/UI/fullscreen'
export default {
    components:{
        fullscreen
    },
    data(){
        return {
            state:'',
            transformVal: 'matrix(1, 0, 0, 1, 0, 0)',
            zoomoutLimit:0.5,
            zoominLimit:7,
            full:false
        }
    },
   methods:{
       async fetchData(){
        //    $('#box').html('')
           $('#box').html('').css({
               height:window.innerHeight-165,
            //    'overflow-y':'scroll'
           })
            var data = await api_resource.get();
            // console.log(data,'data')
            var $ul = $('<ul id="org" style="display:none"></ul>');
            var level = 0;
            (function f(data,$ul,level){
                data.forEach((item,idx)=>{
                    if(item.estate){
                        var $li  = $(`<li></li>`)
                        if(level>2){
                            $li.append(`<div style='user-select:none;' class='sub-node'>${item.name.split('').map(t=>('<div>'+t+'</div>')).join('')}</div>`)
                        }else{
                            $li.append(`<span style='user-select:none;'>${item.name}</span>`)
                        }
                        $ul.append($li)
                        if(item.subs&&item.subs.length){
                            var $sub_ul = $("<ul></ul>")
                            $li.append($sub_ul)
                            f(item.subs,$sub_ul,level+1)
                        }
                    }
                    
                })
            })(data,$ul,level)
    
            setTimeout(()=>{
                $ul.jOrgChart({
                    chartElement:'#box'
                });
            },0)
            setTimeout(()=>{
                console.log($('#box').width())
            },100)
       },
       exportCanvas(){
           const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            })
            
           setTimeout(()=>{
                $('#box').css({
                    height:'100%',
                    width:document.getElementById('box').scrollWidth+'px'
                })
                this.state = 'export'
                var transform = $('#box .jOrgChart').css('transform')
                $('#box .jOrgChart').css({
                    'transform':'none'
                })
                html2canvas(document.getElementById('box')).then((canvas)=>{
                    // document.getElementById('box').appendChild(canvas);
                    download(canvas.toDataURL("image/png"), "组织架构图.png", "image/png");
                    $('#box').css({
                        height:window.innerHeight-165,
                        width:'auto'
                    }).find('.jOrgChart').css('transform',transform)

                    this.state = ''
                    loading.close();

                });

           },100)
       },
       zoomWheelHandler (event) {
            var newScale  = 1 + (event.deltaY > 0 ? -0.1 : 0.1)
            let targetScale = fromString(this.transformVal).a * newScale
            if (targetScale > this.zoomoutLimit && targetScale < this.zoominLimit) {
                this.transformVal = toCSS(transform(fromString(this.transformVal), scale(newScale, newScale)))
            }
        }
   },
   async mounted(){
    
    }
}
</script>
<style lang="scss" scoped>
#box {
   /deep/ &.export {
        .jOrgChart .active::before {
            display: none;
        }
    }
    
}
</style>
