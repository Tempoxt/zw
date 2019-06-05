<template>
	<el-card class="box-card">
	  <div slot="header" class="clearfix">
		<span class="cardName">快捷入口</span>
		<!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
	  </div>
		
	  <router-link v-for="o in 4" :key="o" class="text item" to="./">
		   <div>
				 <img src="" alt="">
			 </div>
			 <p>组织架构</p>
	  </router-link>
	</el-card>
	
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.box-card{
	height: 350px;
}
.cardName{
	color: #37474F;
	font-size: 16px;
	font-weight: bold
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
</style>
