<template>
    <div>
        <el-tabs v-model="activeName" @tab-click="tabclick()">
            <el-tab-pane label="同部门" name="first">
                <el-row :gutter="20" style="height:400px">
                    <el-col :span="11">
                        <Org ref="sameDepartment" style="height:400px" :getApi="getApi" :searchApi="searchApi" :filter_mark="filter_mark" :month="month" same="false"
                          @change="changeOrg" :dataList="result"/>
                    </el-col>
                </el-row>
            </el-tab-pane>  
        </el-tabs>
    </div>
</template>
<script>
import Org from './Org.vue'

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
        searchApi:{},
        result:Array
	},
    components:{
		Org,
    },
    data(){
        return {
            activeName:'first',
            select:{
                disabled:true,
            },
            resultSelect:{},
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
        getAryResult(){
            let allAry = []
            this.result.map(o=>allAry.push(o))
            return allAry
        },
        changeOrg(data){
            console.log(data,' d d  d  a ')
            this.select = data
            this.result = data
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
