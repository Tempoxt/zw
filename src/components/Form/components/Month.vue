<template>
  <el-form-item 
  :label="field.name"
   v-bind="$parent.$attrs"
   v-on="$parent.$listeners"
  >
   <el-date-picker
      v-model="data"
      type="month"
      v-bind="$parent.$attrs"
      v-on="$parent.$listeners"
      format="yyyy-MM"
      value-format="yyyy-MM"
      style="width:100%"
      :placeholder="$parent.$attrs.placeholder||'选择月份'">
    </el-date-picker>
  </el-form-item>
</template>
<script>
import formMixin from "../mixin";
export default {
  name: "form-month",
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
