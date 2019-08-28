<template>
	<el-card class="box-card">
	  <div slot="header" class="clearfix">
		<span class="cardName">宿舍任务管理</span>
		<!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
	  </div>
		<el-row class="list" v-for="item in dormitory" :key="item"> 
			<el-col :span="18">
				<div class="list-l">
					<span v-if="item.selectState==1" class="icon iconfont icon-emizhifeiji"></span>
					<span v-if="item.selectState==2" class="icon iconfont icon-susheguanli"></span>
					<span v-if="item.selectState==3" class="icon iconfont icon-shenhe"></span>
					<span v-if="item.selectState==4" class="icon iconfont icon-tuisu1"></span>
					<div>
						<p v-if="item.selectState==1">待分配</p>
						<p v-if="item.selectState==2">待入住</p>
						<p v-if="item.selectState==3">待审核搬离</p>
						<p v-if="item.selectState==4">待搬离</p>
						<span>{{item.count}}条</span>
					</div>
				</div>
			</el-col>
			<el-col :span="6">
				<div class="list-r">
					<el-button type="primary" size="mini" @click="distrib(item.selectState)" v-if="item.selectState==1">去分配</el-button>
					<el-button type="primary" size="mini" @click="distrib(item.selectState)" v-if="item.selectState==2">去办理</el-button>
					<el-button type="primary" size="mini" @click="distrib(item.selectState)" v-if="item.selectState==3">去审核</el-button>
					<el-button type="primary" size="mini" @click="distrib(item.selectState)" v-if="item.selectState==4">去办理</el-button>
				</div>
			</el-col>
		</el-row>
	</el-card>
	
</template>

<script>
export default {
	data() {
		return {
			dormitory:[]
		};
    },
	methods: {
		distrib(status){
			this.$router.push("/adminManagement/dormitory/checklistview?status="+status);
		}
	},
	async created(){
		this.dormitory = await this.$request.get('dormitory/todocount');
	},
}
</script>

<style lang="scss" scoped>
.el-button--mini{
	padding: 5px!important;
}
.box-card{
	// height: 560px;
	margin-top: 10px;
}
.cardName{
	color: #37474F;
	font-size: 16px;
	font-weight: bold
}
.list{
	border-bottom: 1px solid rgba(228,234,236,1);
	height: 50px;
	.relia{
		position: relative;
		>.el-icon-remove{
			position: absolute;
			top: 13px;
			left: 22px;
			width: 9px;
			height: 9px;
			color: #FF004E;
		}
	}
	.list-l{
		padding-top: 5px;
		>.icon{
			width: 30px;
			height: 30px;
			font-size: 16px;
			text-align: center;
			line-height: 30px;
			float: left;
			border-radius: 50%;
			border: 1px solid #CCD5DB;
			margin-top: 5px;
		}
		>.icon-emizhifeiji{
			color:#F47A24
		}
		>.icon-shebaojilu{
		   color: #0BB2D4;
		}
		>.icon-susheguanli{
			color:#4F77AB;
			font-size: 14px;
		}
		>.icon-shenhe{
			color:#9B52EE
		}
		>.icon-tuisu1{
			color: #FB4C3F
		}
		>div{
			margin-left: 10px;
			display: inline-block;
			p{
				font-size: 12px;
				margin-top: 3px;
			}
			span{
				font-size: 10px;
				margin-top: 5px;
				color: #A3AFB7;
			}
		}
	}
	.list-r{
		text-align: right;
        line-height: 50px;
		.btn{
            margin-left: 10px;
		}
	}
}

</style>
