<template>
  <el-form-item :error="error" :label="field.name"  v-bind="$parent.$attrs"
      v-on="$parent.$listeners">
    <el-select
      v-model="data"
      :placeholder="$parent.$attrs.placeholder||'请选择'"
      style="width:100%"
      v-bind="$parent.$attrs"
      v-on="$parent.$listeners"
    >
      <el-option
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
import errorMixin from '../errorMixin'
export default {
  name: "form-select",
  mixins:[errorMixin],
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
    };
  },
  watch: {
    data() {
      if(this.data){
        this.error = ''
      }
      this.$emit("input", this.data);
    },
    value: {
      immediate: true,
      handler(val) {
        this.data = this.value;
      }
    }
  },
  
};
</script>
