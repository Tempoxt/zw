<template>
	<div id="quickEntry">
		<el-card class="box-card">
		<div slot="header" class="box-card-header clearfix">
			<div class="cardName"><i class="iconfont icon-zhifeiji-tongyong"></i><span>常用快捷入口</span></div>
			<!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
		</div>
			
		<router-link v-for="o in 4" :key="o" class="text item" to="./">
			<div>
					<img src="" alt="">
				</div>
				<p>组织架构</p>
		</router-link>
		</el-card>
	</div>
	
	
</template>

<script>
export default {
	name: 'quickEntry'
}
</script>

<style lang="scss" scoped>
#quickEntry{
	.box-card{
		height: 370px;
		padding-top: 0;
		margin-bottom: 15px;
	}
	.icon-zhifeiji-tongyong{
		font-size: 16px;
	}
	.item{
		display:inline-block;
		width: 60px;
		margin: 30px 30px 0 30px;
		>div{
			width: 60px;
			border:#CCD5DB 1px solid;
			border-radius: 30px;
			text-align: center;
			line-height: 60px;
		}
		p{
			text-align: center;
			margin-top: 10px;
		}
	}
}

</style>
