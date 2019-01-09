<template>
    <div>
        <div id="box">
        
        </div>

    </div>
</template>
<script>
require('@public/static/jq/jOrgChart/jquery.jOrgChart.js')
import '@public/static/jq/jOrgChart/jquery.jOrgChart.css'
import * as api_common from "@/api/common";
const api_resource = api_common.resource("org");
export default {
   methods:{
       async fetchData(){
           $('#box').html('')
            var data = await api_resource.get();
            // console.log(data,'data')
            var $ul = $('<ul id="org" style="display:none"></ul>');
            var level = 0;
            (function f(data,$ul,level){
                data.forEach((item,idx)=>{
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
                })
            })(data,$ul,level)
    
            setTimeout(()=>{
                $ul.jOrgChart({
                chartElement:'#box'
            });
            },0)
       }
   },
   async mounted(){
     
   
    }
}
</script>
