<template>
  	<el-row class="h-full">
		<el-col :span="5" class="h-full">
			<div class="page-side h-full">
				<el-radio-group v-model="choicetype" style="margin-bottom: 20px;">
					<el-radio-button label="1">宿舍</el-radio-button>
					<el-radio-button label="2">部门</el-radio-button>
				</el-radio-group>
				
				<el-scrollbar wrap-class="scrollbar-wrapper" class="scroll">
					<div>
						<div class="side-header">
							<el-input placeholder="快速查找" v-model="filterText" class="input">
							<i slot="suffix" class="el-input__icon el-icon-search"></i>
							</el-input>
							<!-- <el-button icon="el-icon-refresh" circle @click="refresh"></el-button> -->
						</div>
						<el-tree
							class="tree"
							:data="data2"
							:props="{children: 'subs', label: 'dormName' }"
							default-expand-all
							node-key="orgid"
							:filter-node-method="filterNode"
							ref="tree2"
							:highlight-current="true"
							:check-on-click-node="false"
							@node-click="handleChangeNode"
							:expand-on-click-node="false"
							>
							<span slot-scope="{ node, data }" style="display:flex;justify-content: space-between;width: 100%;">
								<template v-if="!data.roomName">
									<div >
										<span class="icon iconfont icon-zonggongsi"></span>&nbsp;
										<span>{{ node.label||data.name }} </span>
									</div>
									<span v-if="choicetype==1" style="padding-right:10px">({{data.totalBeds}} - {{data.usedBeds}} )</span>
								</template>
								<template v-else>
									<div>
										<span class="icon iconfont icon-nv" v-if="data.dormType===0" style="color:rgba(255, 52, 160, 1)"></span>
										<span class="icon iconfont icon-nan" v-if="data.dormType===1" style="color:rgba(11, 178, 212, 1)"></span>
										&nbsp;
										<span>{{ data.roomName }} </span>
									</div>
									<span style="padding-right:10px" v-if="data.totalBeds">
										( {{data.totalBeds+' - '}}
										<span style="color:red" v-if="data.totalBeds-data.usedBeds">{{data.usedBeds}}</span>
										<span style="color:rgba(0, 187, 69, 1)" v-else>住满</span>
										)
									</span>
								</template>
							</span>
						</el-tree>
					</div>
				</el-scrollbar>
			</div>
		</el-col>

		<el-col :span="19">
		<div style="overflow: hidden;">
			<div>
				<!-- <roommonthbillInner :id="current_id" :data="current_data" v-if="current_type==='start'" :rows="rows"/> -->
				
				<roommonthbillDorm :id="current_id" :data="current_data" :orgid="orgid" :choicetype="choicetype" :current_type="current_type"/>
				<!-- <roommonthbillDorm :id="current_id" :data="current_data" :orgid="orgid" :choicetype="choicetype" :current_type="current_type" v-if="current_type==='dorm'" />
				<roommonthbillRoom :id="current_id" :data="current_data" :orgid="orgid" :choicetype="choicetype" :current_type="current_type" v-if="current_type==='room'" /> -->
			</div>
		</div>
		</el-col>
	</el-row>
</template>
<script>
import * as api_common from "@/api/common";
const api_restaurant = api_common.resource('restaurant')
import dormInner from './dormInner'
import roommonthbillRoom from './empmonthbill-dormRoom'
import roommonthbillDorm from './empmonthbill-dorm'
import roommonthbillInner from './empmonthbill-inner'
import dormDorm from './dormDorm'
export default {
    provide(){
		return {
			elParent: this
		}
    },
    components:{
		dormInner,
		roommonthbillRoom,
		roommonthbillDorm,
		roommonthbillInner,
		dormDorm
    },
    watch:{
		tabActive(val){
			
		},
		filterText(val) {
			this.$refs.tree2.filter(val);
		},
		choicetype(){
			this.getTree()
		}
    },
    data(){
        return {
            filterText:'',
            data2:[],
            currentMenuid:0,
            current_id:'',
            current_type:'start',
            current_data:{},
            rows:[],
            choicetype:1,
            orgid:''
        }
    },
    methods:{

		filterNode(value, data) {
			if (!value) return true;
			return data.restaurantname && data.restaurantname.indexOf(value) !== -1;
		},
		async handleChangeNode(data,node){
			const { roomId,dormId } = data
			this.current_id = roomId||dormId
			this.orgid = data.orgid
			this.current_type =  data.start?'start':(data.roomName?'room':'dorm')
			this.current_data = data
		},
		async refresh(){
			this.data2 =  await api_common.resource('restaurant/enable').get();
			this.$nextTick(()=>{
				this.$refs.tree2.setCurrentKey(this.orgid)
			})
		},
		async getTree(){
			if(this.choicetype==2){
				this.data2 = await this.$request.get('/org'); 
				this.orgid = this.data2[0].orgid
				this.$nextTick(()=>{
					this.$refs.tree2.setCurrentKey(this.data2[0].orgid)
				})
			}else if(this.choicetype==1){
				this.data2 =  [await api_common.resource('dormitory/dormtree/front').get()];
				this.$nextTick(()=>{
					this.$refs.tree2.setCurrentKey(this.data2[0].orgid)
				})
			}
		}
    },
    async created(){
        this.getTree()
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

