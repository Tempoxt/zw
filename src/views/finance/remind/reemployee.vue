<template>
	<el-card class="box-card scroll">
		<div slot="header" class="clearfix">
			<span class="cardName">{{title}}({{total}})人</span>
			<el-button style="float: right; padding: 6px 4px" @click="remindAll">一键提醒</el-button>
		</div>
		<el-scrollbar wrap-class="scrollbar-wrapper" class="scroll">
			<el-row class="list" v-for="(o,i) in infoData" :key="i"> 
				<el-col :span="18">
					<div class="list-l">
						<img src="http://cdn.admui.com/demo/pjax/2.0.0/images/avatar.svg" alt="" srcset="">
						<div>
							<p>{{o.chineseName}}- {{o.employeeCode}}</p>
							<span>{{o.department__name}}</span>
						</div>
					</div>
				</el-col>
				<el-col :span="6">
					<div class="list-r">
						<el-button type="primary" size="mini" @click="remind(o.employeeCode)">提醒员工</el-button>
					</div>
				</el-col>
			</el-row>
		</el-scrollbar>
	</el-card>
	
</template>

<script>
export default {
	props:['title','info'],
	data() {
		return {
			infoData:[],
			total:''
		};
    },
	methods: {
		async remind(employeeCode){
			await this.$request.post("wechat/remind",{workcode:employeeCode,msg:this.info});
			this.$message.success('提醒成功')
		},
		async remindAll(){
			let codes = this.infoData.map(o=>o.employeeCode)
			await this.$request.post("wechat/remind",{workcode:codes.join(','),msg:this.info});
			this.$message.success('一键提醒成功')
		}
	},
	async created(){
		if(this.info&&this.info=='NoBankCard'){
			this.infoData = await this.$request.get('salary/noBankCard');
			this.total = this.infoData.length
		}
	},
}
</script>

<style lang="scss" scoped>
.scroll {
    height: calc(100%);
	width: 100%;
	/deep/ .scrollbar-wrapper {
		overflow-x: hidden;
	}
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
