<template>
    <div>
    <organization-chart :datasource="ds"></organization-chart>
  </div>
</template>
<script>
import OrganizationChart from 'vue-organization-chart'
import 'vue-organization-chart/dist/orgchart.css'
import * as api_common from "@/api/common";
const api_resource = api_common.resource("org");
export default {
    components: {
      OrganizationChart
    },
    data () {
      return {
        ds: {
          'id': '1',
          'name': 'Lao Lao',
          'title': 'general manager',
          'children': [
            { 'id': '2', 'name': 'Bo Miao', 'title': 'department manager' },
            { 'id': '3', 'name': 'Su Miao', 'title': 'department manager',
              'children': [
                { 'id': '4', 'name': 'Tie Hua', 'title': 'senior engineer' },
                { 'id': '5', 'name': 'Hei Hei', 'title': 'senior engineer',
                  'children': [
                    { 'id': '6', 'name': 'Pang Pang', 'title': 'engineer' },
                    { 'id': '7', 'name': 'Xiang Xiang', 'title': 'UE engineer' }
                  ]
                 }
               ]
             },
            { 'id': '8', 'name': 'Hong Miao', 'title': 'department manager' },
            { 'id': '9', 'name': 'Chun Miao', 'title': 'department manager' }
          ]
        }
      }
    },
    methods:{
        async fetchData(){
            var data = await api_resource.get();
            // (function f(data){
          
            // })(data)
        }
    }
  }
</script>
