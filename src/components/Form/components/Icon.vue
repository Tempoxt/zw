<template>
	<el-form-item :label="field.name" style="height:33px">
		<el-input
			placeholder="请输入名称"
			class="input-with-select"
			v-bind="$parent.$attrs"
			v-on="$parent.$listeners"
			v-model="data.name"
			>
			<el-popover transition="el-zoom-in-top" slot="prepend" placement="bottom" width="200" trigger="click" v-model="visible">
				<div>
					<el-input placeholder="搜索图标" suffix-icon="el-icon-search" v-model="form.input2"></el-input>
						<div class="icon-wrap">
						<el-scrollbar wrap-class="scrollbar-wrapper" class="scroll">
							<span
							:class="className"
							@click="selectIcon(className)"
							v-for="className in iconList"
							:key="className"
							></span>
						</el-scrollbar>
						</div>
				</div>
				<span :class="data.icon" slot="reference" style="padding:0 10px;"></span>
			</el-popover>
		</el-input>
	</el-form-item>
</template>
<script>
export default {
  name: "form-icon",
  props: {
    field: Object,
    value: {}
  },
  data() {
    return {
      data: {
        icon: "icon iconfont icon-fangke",
        name: ""
      },
      visible: false,
      form: {},
      iconList: [
	   'iconwu',"icon iconfont icon-ppt","icon iconfont icon-Word","icon iconfont icon-pdf1","icon iconfont icon-zhongxinbaozhuang-zhanban","icon iconfont icon-zhongxinbaozhuang-waixiang","icon iconfont icon-jiezhanban","icon iconfont icon-yichuwaixiang","icon iconfont icon-hebing","icon iconfont icon-yichuwuliao","icon iconfont icon-jiechuwaixiang","icon iconfont icon-wanchengzhanban","icon iconfont icon-wanchengwaixiang","icon iconfont icon-jiancha1","icon iconfont icon-yusuanbaobiao","icon iconfont icon-jisuan","icon iconfont icon-jiancha","icon iconfont icon-paiqi","icon iconfont icon-zhuanhuan","icon iconfont icon-fanhui","icon iconfont icon-guanbi2","icon iconfont icon-wanjie","icon iconfont icon-zhuanjiao","icon iconfont icon-ziyuanliyongshuai","icon iconfont icon-bingtu","icon iconfont icon-tongji","icon iconfont icon-baocun1","icon iconfont icon-weixiu","icon iconfont icon-baoyang","icon iconfont icon-dianjian","icon iconfont icon-ziyuan1","icon iconfont icon-chanpinduizhaobiao","icon iconfont icon-churukujilu","icon iconfont icon-yisunjianguanli","icon iconfont icon-ziyuanguanli","icon iconfont icon-weixiushenqing","icon iconfont icon-ziyuanyanzheng","icon iconfont icon-bianji1","icon iconfont icon-baoyangshenqing","icon iconfont icon-baoyangjilu","icon iconfont icon-baoyangjihua","icon iconfont icon-baoyangxiangmu","icon iconfont icon-baoyangyujing","icon iconfont icon-weixiulvli","icon iconfont icon-daibanshixiang","icon iconfont icon-gongzuoricheng","icon iconfont icon-tixing","icon iconfont icon-bianlitie","icon iconfont icon-wodekaoqin","icon iconfont icon-xitongxiaoxi","icon iconfont icon-duoyun","icon iconfont icon-qingtian","icon iconfont icon-xue","icon iconfont icon-yintian","icon iconfont icon-yu","icon iconfont icon-logo-zhongwu","icon iconfont icon-logo-yingwen","icon iconfont icon-nianhui","icon iconfont icon-zhifeiji-tongyong","icon iconfont icon-shezhi","icon iconfont icon-pandian","icon iconfont icon-wupin","icon iconfont icon-ruku","icon iconfont icon-zuofei","icon iconfont icon-shijian","icon iconfont icon-tuisu1","icon iconfont icon-shebeileixing","icon iconfont icon-weizhi1","icon iconfont icon-menjinji","icon iconfont icon-shebeiguanli","icon iconfont icon-kaoqinji","icon iconfont icon-gaowenjintie","icon iconfont icon-bangzhu","icon iconfont icon-ticheng","icon iconfont icon-shenqing","icon iconfont icon-yiwaixian1","icon iconfont icon-shebaojilu","icon iconfont icon-fapiao","icon iconfont icon-saoma1","icon iconfont icon-renshi","icon iconfont icon-tuisu","icon iconfont icon-caozuomingdan","icon iconfont icon-shengchan","icon iconfont icon-zhongfu","icon iconfont icon-chengben","icon iconfont icon-cunhuochengben","icon iconfont icon-cunhuoguanli","icon iconfont icon-xinzi","icon iconfont icon-susheguanli","icon iconfont icon-canyinguanli","icon iconfont icon-gongyiguanli","icon iconfont icon-jichuzidian","icon iconfont icon-chexiao","icon iconfont icon-dingcantongji","icon iconfont icon-aixinjijin1","icon iconfont icon-pingshen","icon iconfont icon-chaxun","icon iconfont icon-wenjian2","icon iconfont icon-nv","icon iconfont icon-nan","icon iconfont icon-sushekaoqin1","icon iconfont icon-menjinguanli1","icon iconfont icon-weizhi","icon iconfont icon-lishijilu","icon iconfont icon-gantanhao","icon iconfont icon-fengongsi","icon iconfont icon-zonggongsi","icon iconfont icon-fenbumen","icon iconfont icon-duqiaqi","icon iconfont icon-wancheng","icon iconfont icon-baocun","icon iconfont icon-jichuguanli","icon iconfont icon-jiating","icon iconfont icon-yeqian","icon iconfont icon-wenjian1","icon iconfont icon-word","icon iconfont icon-excel","icon iconfont icon-tupian1","icon iconfont icon-men","icon iconfont icon-chuang","icon iconfont icon-sushekaoqin","icon iconfont icon-pdf","icon iconfont icon-tuichu1","icon iconfont icon-guanli","icon iconfont icon-renliziyuan","icon iconfont icon-zhengque","icon iconfont icon-yanjiang","icon iconfont icon-tubiaozhuzhuangtu","icon iconfont icon-61","icon iconfont icon-xiazai","icon iconfont icon-ziyuan","icon iconfont icon-hangzheng","icon iconfont icon-shebaojisuan","icon iconfont icon-geshuijisuan","icon iconfont icon-gongjijinjilu","icon iconfont icon-kaoqinchaxun","icon iconfont icon-kaoqintongji","icon iconfont icon-shuju","icon iconfont icon-fenxi","icon iconfont icon-tupian","icon iconfont icon-shanchu","icon iconfont icon-shangchuan","icon iconfont icon-yichu","icon iconfont icon-emizhifeiji","icon iconfont icon-shouqijiantou","icon iconfont icon-component-scheme","icon iconfont icon-xitongguanli_canshushezhi","icon iconfont icon-suoxiao","icon iconfont icon-icon_date","icon iconfont icon-zhankaicopy","icon iconfont icon-shouqicopy","icon iconfont icon-shaixuan","icon iconfont icon-jiesuo","icon iconfont icon-suoding","icon iconfont icon-qiyong","icon iconfont icon-blacklist","icon iconfont icon-jinyong","icon iconfont icon-gongneng","icon iconfont icon-queding","icon iconfont icon-mima","icon iconfont icon-logo","icon iconfont icon-geren","icon iconfont icon-wenjian","icon iconfont icon-rizhi","icon iconfont icon-jiaose","icon iconfont icon-caozuorizhi","icon iconfont icon-quanxian","icon iconfont icon-quanxian1","icon iconfont icon-diannao","icon iconfont icon-caidan","icon iconfont icon-jichu","icon iconfont icon-gaojisousuo","icon iconfont icon-zhankai","icon iconfont icon-shenhe","icon iconfont icon-xingzhuang","icon iconfont icon-lajitong","icon iconfont icon-xiaosanjiao","icon iconfont icon-sousuo1","icon iconfont icon-tuichu","icon iconfont icon-buju","icon iconfont icon-shouji","icon iconfont icon-xiaoxi","icon iconfont icon-quanping","icon iconfont icon-xiaoping","icon iconfont icon-menhu","icon iconfont icon-xitongshezhi","icon iconfont icon-tubiao","icon iconfont icon-liucheng","icon iconfont icon-jixiao1","icon iconfont icon-caidanqiehuan","icon iconfont icon-baobiao","icon iconfont icon-guanbi1","icon iconfont icon-guanbi","icon iconfont icon-bianji","icon iconfont icon-tianjia","icon iconfont icon-daoru","icon iconfont icon-daochu","icon iconfont icon-dayin","icon iconfont icon-lie","icon iconfont icon-shuaxin","icon iconfont icon-riqi","icon iconfont icon-sousuo","icon iconfont icon-zuzhi","icon iconfont icon-jichushezhi-xuanzhong","icon iconfont icon-shebei","icon iconfont icon-xiaofeiguanli","icon iconfont icon-houqinguanli","icon iconfont icon-fangke","icon iconfont icon-peixun","icon iconfont icon-rencaizhaopinguanli","icon iconfont icon-jixiao","icon iconfont icon-xinziguanli","icon iconfont icon-renshiguanli","icon iconfont icon-kaoqin"
      ]
    };
  },
  watch: {
    data: {
      handler() {
        this.$parent.$emit("input", this.data);
      },
      deep: true
    },
    value: {
      immediate: true,
      handler(val) {
        const { icon, name } = this.value;
        this.data.name = name;
        this.data.icon = icon || this.data.icon;
      }
    }
  },
  methods: {
    selectIcon(icon) {
      this.data.icon = icon;
      this.visible = false;
    }
  },
  created() {}
};
</script>
<style lang="scss" scoped>
.scroll {
	height: calc(100%);
	width: 100%;
	/deep/ .scrollbar-wrapper {
		overflow-x: hidden;
	}
}
.input-with-select {
  /deep/ .el-input-group__prepend {
    background-color: #fff;
  }
  /deep/ .el-input-group__prepend {
    padding: 0 0px;
    cursor: pointer;
  }
}
.icon-wrap {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding-top: 10px;
  height: 300px;
	.scroll{
		span {
			display: inline-block;
			flex: 0 0 20%;
			text-align: center;
			cursor: pointer;
			padding: 2px 3px;
			margin: 2px 0;
			&:hover {
			background: #f9f9f9;
			}
		}
	}
}
.iconwu {
  &::after{
    content:"无"
  }
}
</style>

