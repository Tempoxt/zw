<template>
    <div>
         <el-tabs v-model="activeName" >
            <el-tab-pane label="同部门" name="first">
                
            </el-tab-pane>
            <el-tab-pane label="我的下属" name="second">
                
            </el-tab-pane>
            <el-tab-pane label="组织结构" name="third">
                <el-row :gutter="20" style="height:400px">
                    <el-col :span="10">
                        <Org  style="height:400px" @change="changeOrg"/>
                    </el-col>
                    <el-col :span="2" style="height:100%">
                        <div class="control">
                            <div class="control-btns">
                                <div>
                                    <el-button icon="el-icon-arrow-right" circle :type="!select.disabled?'primary':''"></el-button>
                                </div>
                                <div>
                                   <el-button icon="el-icon-arrow-left" circle></el-button>
                                </div>
                                <div>
                                    <el-button icon="el-icon-refresh" circle></el-button>
                                </div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="10">
                            <OrgResult  style="height:400px" :data="result"/>
                    </el-col>
                </el-row>

                
            </el-tab-pane>
            
        </el-tabs>
    </div>
</template>
<script>
import Org from './Org.vue'
import OrgResult from './OrgResult'
export default {
    components:{
        Org,
        OrgResult
    },
    data(){
        return {
            activeName:'first',
            select:{
                disabled:true
            },
            result:[
                {
                    employeeCode: 0,
                    id: "c1",
                    name: "兆威机电",
                    principalship: "",
                    subs: 1
                }
            ]
        }
    },
    methods:{
        changeOrg(data){
            this.select = data
        }
    }
}
</script>

<style lang="scss" scoped>
.control {
    height: 100%;
}
.control-btns {
    display: flex;
    flex-direction: column;
    position: relative;
    align-items: center;
    height: 100%;
    justify-content: center;
    
    &::after{
        content: "";
        width: 1px;
        background: #BBC1C7;
        height: 100%;
        position: absolute;
        top:0;
        left: 50%;
        z-index:1
    }
    >div {
        margin-top: 10px;
        z-index: 2;
    }
}
</style>
