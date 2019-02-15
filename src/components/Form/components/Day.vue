<template>
  <el-form-item :label="field.name">
   <el-date-picker
      v-model="data"
      type="date"
      v-bind="$parent.$attrs"
      v-on="$parent.$listeners"
      format="yyyy-MM-dd"
      value-format="yyyy-MM-dd"
      placeholder="选择日期">
    </el-date-picker>
  </el-form-item>
</template>
<script>
import formMixin from "../mixin";
export default {
  name: "form-day",
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
