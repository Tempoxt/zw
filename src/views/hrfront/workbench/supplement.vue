<template>
	<el-card class="box-card">
	  <div slot="header" class="clearfix">
		<span class="cardName">补签卡审核</span>
		<!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
	  </div>
		<el-row class="list" align="middle" v-for="o in 6" :key="o">
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
					<el-button type="primary"  size="mini" @click="by">通过</el-button>
					<el-button class="btn"  size="mini" @click="goBack">退回</el-button>
				</div>
			</el-col>
		</el-row>
		<!-- <el-row class="list">
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
		</el-row> -->

	</el-card>
	
</template>

<script>
export default {
methods: {
      by() {
        this.$confirm('确定通过补卡申请?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '补卡成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消补卡'
          });          
        });
	  },
	  goBack() {
        this.$confirm('确定退回补卡申请?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '退回成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退回'
          });          
        });
      }
    }
}
</script>

<style lang="scss" scoped>
.el-button--mini{
	padding: 5px 11px!important;
}
.box-card{
	height: 460px;
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
