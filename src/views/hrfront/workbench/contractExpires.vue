<template>
	<el-card class="box-card1">
		<div slot="header" class="clearfix" style="padding: 15px 0 ">
			<span class="cardName">合同续签待办</span>
		</div>
		<div :style="`height:${height}px`">
			<el-scrollbar wrap-class="scrollbar-wrapper" class="scroll">
				<el-row class="list" v-for="(o,i) in list" :key="i" style="margin-right:13px">
					<el-col :span="8">
						<div class="list-l">
							<img src="http://cdn.admui.com/demo/pjax/2.0.0/images/avatar.svg" alt="" srcset="">
							<div>
								<p>{{o.chineseName}}- {{o.employeeCode}}</p>
								<span>{{o.departmentName}}</span>
							</div>
						</div>
					</el-col>
					<el-col :span="12">
						<div class="list-l">
							<span style="margin-right: 10px">合同开始：{{o.contractStart}}</span>
							<span>合同结束：{{o.contractEnd}}</span>
						</div>
					</el-col>
					<el-col :span="4">
						<div class="list-r">
							<el-button type="primary" size="mini" @click="distrib">去办理</el-button>
						</div>
					</el-col>
				</el-row>
			</el-scrollbar>
		</div>
	</el-card>
	
</template>

<script>
export default {
	data() {
		return {
			list: [],
			height: 260
		}
    },
	methods: {
		distrib( ){
			this.$router.push("hrfront/personnelmanagement?menuid=105");
		}
	},
	async created(){
		this.list = await this.$request.get('/hrm/pushcontractinfrom')
	},
}
</script>

<style lang="scss" scoped>
.box-card1{
	height: 326px;
	.cardName{
		color: #37474F;
		font-size: 16px;
		font-weight: bold
	}
	.list{
		border-bottom: 1px solid rgba(228,234,236,1);
		height: 50px;
		display: flex;
		align-items: center;
		.list-l{
			padding-top: 5px;
			>img{
			width: 30px;
			height: 30px;
			border-radius: 50%;
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
			.tag{
				margin-left: 18px;
			}
		}
	}
}

.scroll {
    height: calc(100%);
	width: 100%;
	/deep/ .scrollbar-wrapper {
		overflow-x: hidden;
	}
}
</style>
