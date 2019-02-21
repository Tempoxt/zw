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
            <span
              :class="className"
              @click="selectIcon(className)"
              v-for="className in iconList"
              :key="className"
            ></span>
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
       'iconwu',"icon iconfont icon-tubiaozhuzhuangtu","icon iconfont icon-emizhifeiji","icon iconfont icon-fangke","icon iconfont icon-riqi","icon iconfont icon-hangzheng","icon iconfont icon-shouqijiantou","icon iconfont icon-lajitong","icon iconfont icon-jichuguanli","icon iconfont icon-jiaose","icon iconfont icon-quanxian","icon iconfont icon-zuzhi","icon iconfont icon-tuichu1","icon iconfont icon-kaoqin","icon iconfont icon-geren","icon iconfont icon-houqinguanli","icon iconfont icon-jixiao","icon iconfont icon-chuang","icon iconfont icon-quanxian1","icon iconfont icon-rizhi","icon iconfont icon-shangchuan","icon iconfont icon-jichushezhi-xuanzhong","icon iconfont icon-kaoqinchaxun","icon iconfont icon-shanchu","icon iconfont icon-peixun","icon iconfont icon-qiyong","icon iconfont icon-61","icon iconfont icon-kaoqintongji","icon iconfont icon-xinziguanli","icon iconfont icon-shuju","icon iconfont icon-blacklist","icon iconfont icon-xiaofeiguanli","icon iconfont icon-diannao","icon iconfont icon-wancheng","icon iconfont icon-caozuorizhi","icon iconfont icon-fenxi","icon iconfont icon-excel","icon iconfont icon-shaixuan","icon iconfont icon-hang","icon iconfont icon-wushuju","icon iconfont icon-sushekaoqin","icon iconfont icon-component-scheme","icon iconfont icon-wenjian","icon iconfont icon-xiazai","icon iconfont icon-xitongguanli_canshushezhi","icon iconfont icon-shenhe","icon iconfont icon-shebei","icon iconfont icon-sousuo","icon iconfont icon-jichu","icon iconfont icon-jinyong","icon iconfont icon-pdf","icon iconfont icon-tupian","icon iconfont icon-baocun","icon iconfont icon-caidan","icon iconfont icon-duqiaqi","icon iconfont icon-rencaizhaopinguanli","icon iconfont icon-renshiguanli","icon iconfont icon-shuaxin","icon iconfont icon-lie","icon iconfont icon-dayin","icon iconfont icon-daochu","icon iconfont icon-daoru","icon iconfont icon-lizhi","icon iconfont icon-tianjia","icon iconfont icon-bianji","icon iconfont icon-guanbi","icon iconfont icon-guanbi1","icon iconfont icon-baobiao","icon iconfont icon-caidanqiehuan","icon iconfont icon-jixiao1","icon iconfont icon-liucheng","icon iconfont icon-tubiao","icon iconfont icon-xitongshezhi","icon iconfont icon-menhu","icon iconfont icon-renshi","icon iconfont icon-xiaoping","icon iconfont icon-quanping","icon iconfont icon-xiaoxi","icon iconfont icon-shouji","icon iconfont icon-buju","icon iconfont icon-tuichu","icon iconfont icon-sousuo1","icon iconfont icon-xiaosanjiao","icon iconfont icon-zuzhi1","icon iconfont icon-zuzhi2","icon iconfont icon-xingzhuang","icon iconfont icon-zhankai","icon iconfont icon-gaojisousuo","icon iconfont icon-ziyuan","icon iconfont icon-logo","icon iconfont icon-mima","icon iconfont icon-zhanghao","icon iconfont icon-queding","icon iconfont icon-gongneng","icon iconfont icon-suoding","icon iconfont icon-jiesuo","icon iconfont icon-shouqicopy","icon iconfont icon-zhankaicopy","icon iconfont icon-menjinguanli","icon iconfont icon-icon_date","icon iconfont icon-suoxiao","icon iconfont icon-yichu","icon iconfont icon-gongjijinjilu","icon iconfont icon-shebaojilu","icon iconfont icon-shebaojisuan","icon iconfont icon-geshuijisuan","icon iconfont icon-yanjiang","icon iconfont icon-zhengque","icon iconfont icon-renliziyuan","icon iconfont icon-jiating","icon iconfont icon-guanli","icon iconfont icon-men","icon iconfont icon-tupian1","icon iconfont icon-word","icon iconfont icon-wenjian1","icon iconfont icon-yeqian","icon iconfont icon-zhengjian","icon iconfont icon-fengongsi","icon iconfont icon-zonggongsi","icon iconfont icon-fenbumen"
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
  span {
    flex: 0 0 20%;
    text-align: center;
    cursor: pointer;
    padding: 2px 0px;
    &:hover {
      background: #f9f9f9;
    }
  }
}
.iconwu {
  &::after{
    content:"无"
  }
}
</style>

