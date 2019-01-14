<template>
    <div>
         <el-button @click="exportCanvas" style="position: absolute; right: 34px;top: 3px;"><i data-v-0845e584="" class="icon iconfont icon-daochu" style="padding-right: 10px; margin-right: -10px;"></i> 导出</el-button>
        <div id="box" :class="state==='export'?'export':''">
        
        </div>

    </div>
</template>
<script>
require('@public/static/jq/jOrgChart/jquery.jOrgChart.js')
import '@public/static/jq/jOrgChart/jquery.jOrgChart.css'
import * as api_common from "@/api/common";
const api_resource = api_common.resource("org");
import html2canvas from 'html2canvas';
const download = require('downloadjs')
export default {
    data(){
        return {
            state:'',
        }
    },
   methods:{
       async fetchData(){
           $('#box').html('').css({
               height:window.innerHeight-165,
               'overflow-y':'scroll'
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
                })
                this.state = 'export'
                html2canvas(document.getElementById('box')).then((canvas)=>{
                    // document.getElementById('box').appendChild(canvas);
                    download(canvas.toDataURL("image/png"), "组织架构图.png", "image/png");
                    $('#box').css({
                        height:window.innerHeight-165,
                    })
                    this.state = ''
                    loading.close();
                });

           },100)
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
