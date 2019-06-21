<template>
  <el-form-item :label="field.name"  v-bind="$parent.$attrs"
      v-on="$parent.$listeners">
    <el-select
      v-model="data"
      placeholder="请选择"
      style="width:100%"
      v-bind="$parent.$attrs"
      v-on="$parent.$listeners"
    >
      <input class="search-text" @keyup='search($event)' placeholder="请输入内容" />
      <el-option
        ref="option"
        v-for="item in field.options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
  </el-form-item>
</template>

<script>
import formMixin from "../mixin";
export default {
  name: "form-select2",
  props: {
    field: Object,
    value: {}
  },
  data() {
    return {
      form: {},
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        }
      ],
      data: "",
      filterText: ''
    };
  },
  watch: {
    data() {
      this.$emit("input", this.data);
    },
    filterText(val) {
      this.$refs.option.filter(val);
    },
    value: {
      immediate: true,
      handler(val) {
        this.data = this.value;
      }
    }
  },
  methods:{
    search(e){
      let searchvalue = e.currentTarget.value;
      var arr = this.field.options.filter((item)=>{
        return item.label.includes(searchvalue);
      });
      this.$set(this.field,'options',arr)
      console.log(this.field.options,'aaaaaaaaaaaaa')
    }
  },
  created() {}
};
</script>
<style>
  .search-text{
    height:30px;
    line-height: 30px;margin-left: 20px;
  }
</style>
