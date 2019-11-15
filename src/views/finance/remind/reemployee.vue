<template>
	<el-card class="box-card">
	  <div slot="header" class="clearfix">
		<span class="cardName">{{title}}(3)人</span>
		<el-button style="float: right; padding: 6px 4px">一键提醒</el-button>
	  </div>
		<el-row class="list" v-for="item in 3" :key="item"> 
			<el-col :span="18">
				<div class="list-l">
					<img src="http://cdn.admui.com/demo/pjax/2.0.0/images/avatar.svg" alt="" srcset="">
					<div>
						<!-- <p>{{o.chineseName}}- {{o.employeeCode}}</p>
						<span>{{o.department__name}}</span> -->
						<p>伊尔迷 揍敌客 - 111111</p>
						<span>杀手</span>
					</div>
				</div>
			</el-col>
			<el-col :span="6">
				<div class="list-r">
					<el-button type="primary" size="mini" @click="remind()">提醒员工</el-button>
				</div>
			</el-col>
		</el-row>
	</el-card>
	
</template>

<script>
export default {
	props:['title'],
	data() {
		return {
			dormitory:[]
		};
    },
	methods: {
		remind(status){
			// this.$router.push("/adminManagement/dormitory/checklistview?status="+status);
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
		.btn{
            margin-left: 10px;
		}
	}
}

</style>
