<template>
    <div>
         <el-tabs v-model="activeName" @tab-click="tabclick()">
            <el-tab-pane label="同部门" name="first">
                <el-row :gutter="20" style="height:400px">
                    <el-col :span="10">
                        <Org2 ref="sameDepartment"  style="height:400px" getApi="/org/samedeptselect" :searchApi="searchApi" :filter_mark="filter_mark" same="false" @change="changeSameOrg"/>
                    </el-col>
                    <el-col :span="2" style="height:100%">
                        <div class="control">
                            <div class="control-btns">
                                <div>
                                    <el-button icon="el-icon-arrow-right" circle :type="!selectSame.disabled?'primary':''" @click="addSame"></el-button>
                                </div>
                                <div>
                                   <el-button icon="el-icon-arrow-left" circle :type="resultSameSelect.id?'primary':''" @click="removeSame"></el-button>
                                </div>
                                <div>
                                    <el-button icon="el-icon-refresh" circle  @click="resetSame"></el-button>
                                </div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="10">
                            <OrgResult  style="height:400px" :data="resultSame" @change="changeSameResult"/>
                    </el-col>
                </el-row>
            </el-tab-pane>
            <!-- <el-tab-pane label="我的下属" name="second">
            </el-tab-pane> -->
            <el-tab-pane label="组织结构" name="third" v-if="activeNam!='first'">
                <el-row :gutter="20" style="height:400px">
                    <el-col :span="10">
                        <Org2 ref="organizationalStructure" style="height:400px" :searchApi="searchApi" :filter_mark="filter_mark" same="true" @change="changeOrg"/>
                    </el-col>
                    <el-col :span="2" style="height:100%">
                        <div class="control">
                            <div class="control-btns">
                                <div>
                                    <el-button icon="el-icon-arrow-right" circle :type="!select.disabled?'primary':''" @click="add"></el-button>
                                </div>
                                <div>
                                   <el-button icon="el-icon-arrow-left" circle  :type="resultSelect.id?'primary':''" @click="remove"></el-button>
                                </div>
                                <div>
                                    <el-button icon="el-icon-refresh" circle @click="reset"></el-button>
                                </div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="10">
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
                disabled:true
            },
            selectSame:{
                disabled:true
            },
            resultSelect:{
                
            },
            result:[
               
            ],
            resultSameSelect:{
                
            },
            resultSame:[
               
            ],
        }
    },
    methods:{
        getIdsResult(){
            return this.result.map(o=>o.id).join(',')
        },
        getIdsSameResult(){
            return this.resultSame.map(o=>o.id).join(',')
        },
        changeOrg(data){
            this.select = data
        },
        changeSameOrg(data){
            this.selectSame = data
        },
        changeResult(data){
            this.resultSelect= data
        },
        changeSameResult(data){
            this.resultSameSelect= data
        },
        add(){
            if(this.select && !this.select.disabled){
                this.result.push(this.select)
                this.$set(this.select,'disabled',true)
                this.select.disabled = true
            }
            if(this.select.subs==1){
                this.$set(this.select,'disabled',true)
            }
        },
        remove(){
			//console.log(this.resultSelect)
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
        addSame(){
            if(this.selectSame && !this.selectSame.disabled){
                this.resultSame.push(this.selectSame)
                this.$set(this.selectSame,'disabled',true)
                this.selectSame.disabled = true
            }
        },
        removeSame(){
            this.$set(this.resultSameSelect,'disabled',false)
            this.resultSame.forEach((o,i)=>{
                if(o.id===this.resultSameSelect.id){
                    this.resultSame.splice(i,1)
                }
            })
            this.resultSameSelect = {}
        },
		resetSame(){
			this.resultSame.forEach((o,i)=>{
			    this.$set(o,'disabled',false)
			})
			this.resultSame=[]
			this.resultSameSelect = {}
		},
		tabclick(){
		   this.$refs.sameDepartment.empty()
		   this.$refs.organizationalStructure.empty()	
		}
    },
    // async crated(){
    //     console.log(this.props.activeName)
    // }
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
