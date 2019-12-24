<template>
  <el-form-item 
  :label="field.name"
   v-bind="$parent.$attrs"
   v-on="$parent.$listeners"
  >
   <el-date-picker
      v-model="data"
      type="year"
      v-bind="$parent.$attrs"
      v-on="$parent.$listeners"
      format="yyyy"
      value-format="yyyy"
      style="width:100%"
      :placeholder="$parent.$attrs.placeholder||'选择年份'">
    </el-date-picker>
  </el-form-item>
</template>
<script>
import formMixin from "../mixin";
export default {
  name: "form-year",
  props: {
    field: Object,
    value: {}
  },
   watch: {
    data () {
      this.$emit('input', this.data)
    },
    value: {
      immediate: true,
      handler (val) {
        this.data = this.value
    
      }
    }
  },
  data() {
    return {
      data: ""
    };
  }
};
</script>
