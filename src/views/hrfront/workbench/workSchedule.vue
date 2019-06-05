<template>
	<el-card class="box-card">
	  <div slot="header" class="clearfix">
		<span class="cardName">工作日程</span>
		<!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
	  </div>
		
       <el-row>
			<el-col :span="14">
				<div class="list-l">
                    <el-calendar v-model="value">
                    </el-calendar>
				</div>
			</el-col>
			<el-col :span="10">
				<div class="list-r">
                    <div class="list-r-h">
                        <span>日程表</span>
                        <el-button icon="el-icon-plus"  size="mini"></el-button>
                    </div>
                    <div class="list-r-b">
                        <NoData msg="暂无任务"></NoData>
                    </div>
				</div>
			</el-col>
		</el-row>
	</el-card>
	
</template>

<script>
import NoData from "./NoData"
export default {
    data() {
      return {
        value: new Date()
      }
    },
    components:{
        NoData
    }
}
</script>
<style>
.list-r-h .el-button--mini{
      padding: 7px 7px !important;
      float: right;
}
</style>

<style lang="scss" scoped>
.box-card{
	height: 350px;
    margin-left: 10px;
}
.cardName{
	color: #37474F;
	font-size: 16px;
	font-weight: bold
}
.list-l{
    height: 240px;
    border-right: 1px solid rgba(228,228,228,1);
}
.list-r{
    padding-left: 10px;
    .list-r-h{
        font-size: 16px;
        font-weight: bold;
        border-bottom: 1px solid rgba(245,245,245,1);
        padding-bottom: 15px;
    }
    .list-r-b{
        width: 100%;
        height: 190px;
        position: relative;
    }
}
</style>
