<template>
	<el-card class="box-card">
	  <div slot="header" class="clearfix">
		<span class="cardName">意外险/社保/公积金待办</span>
		<!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
	  </div>
		<el-row class="list" v-if="this.accident&&this.accident.social_increase_backlog.value"> 
			<el-col :span="18">
				<div class="list-l">
					<span class="icon iconfont icon-shebaojilu"></span>
					<div>
						<p>社保新增待办</p>
						<span>{{this.accident.social_increase_backlog.value}}条</span>
					</div>
				</div>
			</el-col>
			<el-col :span="6">
				<div class="list-r">
					<el-button type="primary" size="mini" @click="bySocialAdd">处理</el-button>
				</div>
			</el-col>
		</el-row>
		<el-row class="list" v-if="this.accident&&this.accident.social_cancel_backlog.value"> 
			<el-col :span="18">
				<div class="list-l relia">
					<span class="icon iconfont icon-shebaojilu"></span>
					<i class="el-icon el-icon-remove"></i>
					<div>
						<p>社保注销待办</p>
						<span>{{this.accident.social_cancel_backlog.value}}条</span>
					</div>
				</div>
			</el-col>
			<el-col :span="6">
				<div class="list-r">
					<el-button type="primary" size="mini" @click="bySocialCancel">处理</el-button>
				</div>
			</el-col>
		</el-row>
		<el-row class="list" v-if="this.accident&&this.accident.accumulate_fund_increase_backlog.value"> 
			<el-col :span="18">
				<div class="list-l">
					<span class="icon iconfont icon-gongjijinjilu"></span>
					<div>
						<p>公积金新增待办</p>
						<span>{{this.accident.accumulate_fund_increase_backlog.value}}条</span>
					</div>
				</div>
			</el-col>
			<el-col :span="6">
				<div class="list-r">
					<el-button type="primary" size="mini" @click="byFundAdd">处理</el-button>
				</div>
			</el-col>
		</el-row>
		<el-row class="list" v-if="this.accident&&this.accident.accumulate_fund_cancel_backlog.value"> 
			<el-col :span="18">
				<div class="list-l relia">
					<span class="icon iconfont icon-gongjijinjilu"></span>
					<i class="el-icon el-icon-remove"></i>
					<div>
						<p>公积金注销待办</p>
						<span>{{this.accident.accumulate_fund_cancel_backlog.value}}条</span>
					</div>
				</div>
			</el-col>
			<el-col :span="6">
				<div class="list-r">
					<el-button type="primary" size="mini" @click="byFundCancel">处理</el-button>
				</div>
			</el-col>
		</el-row>
		<el-row class="list" v-if="this.accident&&this.accident.accident_insurance_increase_backlog.value"> 
			<el-col :span="18">
				<div class="list-l">
					<span class="icon iconfont icon-yiwaixian1"></span>
					<div>
						<p>意外险新增待办</p>
						<span>{{this.accident.accident_insurance_increase_backlog.value}}条</span>
					</div>
				</div>
			</el-col>
			<el-col :span="6">
				<div class="list-r">
					<el-button type="primary" size="mini" @click="byInsuranceAdd">处理</el-button>
				</div>
			</el-col>
		</el-row>
		<el-row class="list" v-if="this.accident&&this.accident.accident_insurance_cancel_backlog.value"> 
			<el-col :span="18">
				<div class="list-l relia">
					<span class="icon iconfont icon-yiwaixian1"></span>
					<i class="el-icon el-icon-remove"></i>
					<div>
						<p>意外险注销待办</p>
						<span>{{this.accident.accident_insurance_cancel_backlog.value}}条</span>
					</div>
				</div>
			</el-col>
			<el-col :span="6">
				<div class="list-r">
					<el-button type="primary" size="mini" @click="byInsuranceCancel">处理</el-button>
				</div>
			</el-col>
		</el-row>
	</el-card>
	
</template>

<script>
export default {
	data() {
		return {
			accident:{
				accident_insurance_increase_backlog:{
					value:''
				},
				accident_insurance_cancel_backlog:{
					value:''
				},
				social_increase_backlog:{
					value:''
				},
				social_cancel_backlog:{
					value:''
				},
				accumulate_fund_increase_backlog:{
					value:''
				},
				accumulate_fund_cancel_backlog:{
					value:''
				}
			}
		};
    },
	methods: {
		bySocialAdd(){
			this.$router.push("/hrfront/addSocialIns?menuid=250");
		},
		bySocialCancel(){
			this.$router.push("/hrfront/cancelSocialins?menuid=251");
		},
		byFundAdd(){
			this.$router.push("/hrfront/addReserveFund?menuid=252");
		},
		byFundCancel(){
			this.$router.push("/hrfront/cancelReserveFund?menuid=253");
		},
		byInsuranceAdd(){
			this.$router.push("/hrfront/addAccidentIns?menuid=240");
		},
		byInsuranceCancel(){
			this.$router.push("/hrfront/cancelAccidentIns?menuid=241");
		}
	},
	async created(){
		this.accident = await this.$request.get('staffinsure/getstaffinsurebacklog');
	},
}
</script>

<style lang="scss" scoped>
.box-card{
	height: 431px;
	margin-top: 10px;
}
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
			font-size: 18px;
			text-align: center;
			line-height: 30px;
			float: left;
			border-radius: 50%;
			border: 1px solid #CCD5DB;
			margin-top: 5px;
		}
		>.icon-shebaojilu{
		   color: #0BB2D4;
		}
		>.icon-gongjijinjilu{
			color: #FF4099
		}
		>.icon-yiwaixian1{
			color: #3889FF
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
