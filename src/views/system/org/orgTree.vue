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
            var $ul = $('<ul id="org" style="display:none"></ul>');
            (function f(data,$ul){
                data.forEach((item)=>{
                    var $li  = $(`<li>${item.name}</li>`)
                    $ul.append($li)
                    if(item.subs&&item.subs.length){
                        var $sub_ul = $("<ul></ul>")
                        $li.append($sub_ul)
                        f(item.subs,$sub_ul)
                    }
                })
            })(data,$ul)
    
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
