<template>
	<el-card class="box-card">
		<div slot="header" class="clearfix">
			<span class="cardName">待转正员工</span>
			<!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
		</div>
		<el-scrollbar wrap-class="scrollbar-wrapper" class="scroll">
			<el-row class="list" v-for="(o,i) in datas" :key="i" style="margin-right:13px">
				<el-col :span="12">
					<div class="list-l">
						<img src="http://cdn.admui.com/demo/pjax/2.0.0/images/avatar.svg" alt="" srcset="">
						<div>
							<p>{{o.chineseName}}- {{o.employeeCode}}</p>
							<span>{{o.department__name}}</span>
						</div>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="list-r">
						转正时间: {{o.approvalTime}}
						<el-tag type="danger" class="tag" effect="plain">待转正</el-tag>
					</div>
				</el-col>
			</el-row>
		</el-scrollbar>
	</el-card>
	
</template>

<script>
export default {
  	props: ["title", "datas"],	
	data() {
		return {
			
		}
    },
	methods: {
		
	},
	async created(){
	},
}
</script>

<style lang="scss" scoped>
.box-card{
	height: 431px;
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
.scroll {
    height: calc(100%);
	width: 100%;
	/deep/ .scrollbar-wrapper {
		overflow-x: hidden;
	}
}
</style>
