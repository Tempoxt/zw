<template>
<div>
    <el-row class="h-full public-table-container">
        <el-col :span="4" class="h-full">
            <div class=" h-full" id="srceenFull">
            <el-scrollbar wrap-class="scrollbar-wrapper" class="scroll"> 
                <div style="padding:20px">
                    <div class="side-header">
                        <el-input placeholder="快速查找" v-model="filterText" class="input">
                            <i slot="suffix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </div>
                        <el-scrollbar wrap-class="scrollbar-wrapper" class="scroll" :style="{height:screenHeight}">
                            <el-tree
                                class="tree"
                                :data="data2"
                                :props="{children: 'subs', label: 'name' }"
                                default-expand-all
                                node-key="id"
                                :filter-node-method="filterNode"
                                ref="tree2"
                                :highlight-current="true"
                                :check-on-click-node="false"
                                @node-click="handleChangeNode"
                                :expand-on-click-node="false"
                            >
                                <div slot-scope="{ node, data }" class="flexSpace">

                                    <div>
                                        <span v-if="data.id===0" class="icon iconfont icon-weizhi"></span>
                                        <span v-if="data.id==='t5'" class="icon iconfont icon-menjinji"></span>
                                        <span v-if="data.id==='t1'" class="icon iconfont icon-kaoqinji"></span>
                                        <span v-if="data.id!=0&&data.id!='t5'&&data.id!='t1'&&data.id.indexOf('m')==-1"  class="icon iconfont icon-shebeileixing"></span>
                                        &nbsp;
                                        <span>{{ node.label }}</span>
                                    </div>
                                </div>
                            </el-tree>
                        </el-scrollbar>
                </div>
            </el-scrollbar>
            </div>
        </el-col>
        <el-col :span="20" style="border-left:1px solid rgb(232, 232, 232)">
            <devicelistTable :id="id"/>
        </el-col>
    </el-row>
</div>
    
</template>
<script>
import table_mixin from "@c/Table/table_mixin";
import { getTabs } from '@/api/common'
import devicelistTable from './devicelistTable'
import * as api_common from "@/api/common";
export default {
    mixins: [table_mixin],
    components:{
        devicelistTable
    },  
    watch: {
        'screenHeight': function (val) { // 监听屏幕高度变化
            var oIframe = document.getElementById('srceenFull')
            oIframe && (oIframe.style.height = (Number(val) - 40) + 'px')
        },
        filterText(val) {
            this.$refs.tree2.filter(val);
        },
    },
    mounted () {
      
    },
    computed:{
        disable(){
            if(this.form.name!=''){
                return false
            }
            return true
        },
        disabeld(){
            if(this.form.customer==''||this.form.productCode==''||this.form.quickMarkLen==''||this.form.fixPrefix==''){
                return true
            }else{
                return false
            }
        }
    },
    data(){
        return {
            menu:[],
            id:'',
            data2:[],
            filterText:'',
            screenHeight:document.documentElement.clientHeight+'px',
        }
    },
    methods:{
        onTableResize(){
             var _this = this
             _this.screenHeight = document.body.clientHeight-170+'px'// 窗口高度
        },
        handleClick(val){
            
        },
        handleChangeNode(val){
            this.id = val.id
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name && data.name.indexOf(value) !== -1;
        },
    },
    async created(){
        this.data2 = await this.$request.get('devicemanager/devicelistmanage/getdevicemenu');
        let defaultId = this.data2[0].id
        this.id = defaultId
        this.$nextTick(()=>{
            this.$refs.tree2.setCurrentKey(defaultId)
        })
        this.screenHeight = document.body.clientHeight-170+'px'
    }
}
</script>
<style lang="scss" scoped>

.scroll {
  height: calc(100% - 30px);
  width: 100%;
 /deep/ .scrollbar-wrapper {
    overflow-x: hidden;
  }
}
</style>

