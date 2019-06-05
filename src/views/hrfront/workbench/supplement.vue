<template>
	<el-card class="box-card">
	  <div slot="header" class="clearfix">
		<span class="cardName">补签卡审核</span>
		<!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
	  </div>
		<el-row class="list">
			<el-col :span="8">
				<div class="list-l">
					<img src="http://cdn.admui.com/demo/pjax/2.0.0/images/avatar.svg" alt="" srcset="">
					<div>
						<p>张麻子-1789</p>
						<span>注塑事业部</span>
					</div>
				</div>
			</el-col>
			<el-col :span="3">
				<div class="list-r">
					本月：第1次
				</div>
			</el-col>
			<el-col :span="7">
				<div class="list-r">
					补签时间：2018-12-15  18:40
				</div>
			</el-col>
			<el-col :span="6">
				<div class="list-r">
					<el-button type="primary" >通过</el-button>
					<el-button class="btn">退回</el-button>
				</div>
			</el-col>
		</el-row>
		<el-row class="list">
			<el-col :span="8">
				<div class="list-l">
					<img src="http://cdn.admui.com/demo/pjax/2.0.0/images/avatar.svg" alt="" srcset="">
					<div>
						<p>张麻子-1789</p>
						<span>注塑事业部</span>
					</div>
				</div>
			</el-col>
			<el-col :span="3">
				<div class="list-r">
					本月：第1次
				</div>
			</el-col>
			<el-col :span="7">
				<div class="list-r">
					补签时间：2018-12-15  18:40
				</div>
			</el-col>
			<el-col :span="6">
				<div class="list-r">
					<el-button type="primary" >通过</el-button>
					<el-button class="btn">退回</el-button>
				</div>
			</el-col>
		</el-row>

	</el-card>
	
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.box-card{
	height: 340px;
	margin-top: 10px;
	margin-left: 10px;
}
.cardName{
	color: #37474F;
	font-size: 16px;
	font-weight: bold
}
.list{
	border-bottom: 1px solid rgba(228,234,236,1);
	height: 60px;
	.list-l{
		padding-top: 8px;
		>img{
           width: 40px;
		   height: 40px;
		   float: left;
		   border-radius: 20px;
		}
		>div{
			margin-left: 10px;
			display: inline-block;
			p{
				font-size: 14px;
				margin-top: 3px;
			}
			span{
				font-size: 12px;
				margin-top: 5px;
				color: #A3AFB7;
			}
		}
	}
	.list-r{
		text-align: right;
        line-height: 60px;
		.btn{
            margin-left: 10px;
		}
	}
}

</style>
