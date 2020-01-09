<template>
    <el-tabs v-model="view_activeName" class="table-tabs public-table-container" ref="tabs">
      <el-tab-pane :label="getViewData('1').name" :name="getViewData('1').url" v-if="getViewData('1')" lazy>
        <menusheet position="1"/>
      </el-tab-pane>
      <el-tab-pane :label="getViewData('2').name" :name="getViewData('2').url" v-if="getViewData('2')" lazy>
        <menusheet position="2"/>
      </el-tab-pane>
    </el-tabs>
</template>
<script>
import menusheet from './menusheet/index'
import { getTabs } from '@/api/common'

export default {
  components:{
    menusheet,
  },
  data(){
    return {
      view_menu:[],
      view_activeName:''
    }
  },
  methods:{
      getViewData(url){
        return this.view_menu.find(view=>view.url==url)
      }
  },
  async created(){
    const { menu } = await getTabs(this.$route.query.menuid)
    this.view_menu = menu
    this.view_activeName = menu[0].url
 
  }
}
</script>
