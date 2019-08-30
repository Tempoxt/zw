<template>
    <div>
         <el-tabs v-model="activeName" @tab-click="tabclick()">
            <el-tab-pane label="同部门" name="first">
                <el-row :gutter="20" style="height:400px">
                    <el-col :span="11">
                        <Org2 ref="sameDepartment" style="height:400px" getApi="/org/samedeptselect" :searchApi="searchApi" :filter_mark="filter_mark" :month="month" same="false"
                          @change="changeOrg"  :dataList="result"/>
                    </el-col>
                    <el-col :span="2" style="height:100%">
                        <div class="control">
                            <div class="control-btns">
                                <div>
                                    <el-button icon="el-icon-arrow-right" circle :type="!select.disabled?'primary':''" @click="add(1)"></el-button>
                                </div>
                                <div>
                                   <el-button icon="el-icon-arrow-left" circle  :type="resultSelect.id?'primary':''" @click="remove(1)"></el-button>
                                </div>
                                <div>
                                    <el-button icon="el-icon-refresh" circle @click="reset"></el-button>
                                </div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="11">
                        <OrgResult  style="height:400px" :data="result" @change="changeResult"/>
                    </el-col>
                </el-row>
            </el-tab-pane>
            <!-- <el-tab-pane label="我的下属" name="second">:sele="select.seleSim" :leaf="select.leaf" 
            </el-tab-pane> -->
            <el-tab-pane label="组织结构" name="third" v-if="activeNam!='first'">
                <el-row :gutter="20" style="height:400px">
                    <el-col :span="11">
                        <Org2 ref="organizationalStructure" style="height:400px" :searchApi="searchApi" :filter_mark="filter_mark" :month="month" same="true" @change="changeOrg"/>
                    </el-col>
                    <el-col :span="2" style="height:100%">
                        <div class="control">
                            <div class="control-btns">
                                <div>
                                    <el-button icon="el-icon-arrow-right" circle :type="!select.disabled?'primary':''" @click="add(2)"></el-button>
                                </div>
                                <div>
                                   <el-button icon="el-icon-arrow-left" circle  :type="resultSelect.id?'primary':''" @click="remove(2)"></el-button>
                                </div>
                                <div>
                                    <el-button icon="el-icon-refresh" circle @click="reset"></el-button>
                                </div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="11">
                        <OrgResult  style="height:400px" :data="result" @change="changeResult"/>
                    </el-col>
                </el-row>
            </el-tab-pane>   
        </el-tabs>
    </div>
</template>
<script>
import Org from './Org.vue'
import Org2 from './Org2.vue'
import OrgResult from './OrgResult'

export default {
    props:{
		"activeNam":{
            default:''
        },
		filter_mark:{
            default:''
        },
        month:{},
		getApi:{},
		searchApi:{}
	},
    components:{
        Org,
		Org2,
        OrgResult
    },
    data(){
        return {
            activeName:'first',
            select:{
                disabled:true,
                // seleSim:true,
                // leaf:false
            },
            resultSelect:{},
            result:[],
            sele:'false'
        }
    },
    methods:{
        getIdsResult(){
            return this.result.map(o=>o.id).join(',')
        },
        getIdsAryResult(){
            let idsAry = []
            this.result.map(o=>idsAry.push(o.id))
            return idsAry
        },
        getNamesAryResult(){
            let nameAry = []
            this.result.map(o=>nameAry.push(o.name))
            return nameAry
        },
        changeOrg(data){
            this.select = data
        },
        changeResult(data){
            this.resultSelect= data
        },
        eachNode(nodes,res){
            nodes.forEach(node=>{
                node.dd = res
                this.$set(node.data,'disabled',res)
                if(node.childNodes.length){
                    this.eachNode(node.childNodes,res)
                }
            })
        },
        add(n){
            if(n==2){
                this.$nextTick(()=>{
                    var node = this.$refs.organizationalStructure.$refs.treeSame.getNode(this.select.id)
                    this.eachNode([node],true)
                })
            }else{
                this.$nextTick(()=>{
                    var node = this.$refs.sameDepartment.$refs.treeSame.getNode(this.select.id)
                    this.eachNode([node],true)
                })
            }
            if(this.select && !this.select.disabled){
                this.result.push(this.select)
                this.$set(this.select,'disabled',true)
                this.select.disabled = true
            }
        },
        remove(n){
            if(n==2){
                var node = this.$refs.organizationalStructure.$refs.treeSame.getNode(this.resultSelect.id)
                this.eachNode([node],false)
            }else{
                var node = this.$refs.sameDepartment.$refs.treeSame.getNode(this.resultSelect.id)
                this.eachNode([node],false)
            }
            this.$set(this.resultSelect,'disabled',false)
            this.result.forEach((o,i)=>{
                if(o.id===this.resultSelect.id){
                    this.result.splice(i,1)
                }
            })
            this.resultSelect = {}
        },
		reset(){
			this.result.forEach((o,i)=>{
			    this.$set(o,'disabled',false)
			})
			this.result=[]
			this.resultSelect = {}
        },
		tabclick(){
		   this.$refs.sameDepartment.empty()
		   this.$refs.organizationalStructure.empty()	
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
