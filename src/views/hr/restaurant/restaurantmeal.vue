<template>
    <div>
         <el-tabs v-model="view_activeName" class="table-tabs" ref="tabs" @tab-click="handleClick">
            <el-tab-pane label="下级部门" name="c2" lazy >
              
            </el-tab-pane>
          </el-tabs>
    </div>
</template>
<script>
export default {
    props:['id'],
    data(){
        return {
            view_activeName:''
        }
    },
     watch:{
        id:{
            handler(id){
                this.fetchTableData();
            },
            immediate:true
        }
    },
    methods:{
        handleClick(){

        },
        fetchTableData(){

        }
    }
}
</script>
