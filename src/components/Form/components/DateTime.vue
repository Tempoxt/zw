<template>
  <el-form-item 
  :label="field.name"
   v-bind="$parent.$attrs"
   v-on="$parent.$listeners"
  >
    <el-date-picker
      v-model="data"
      type="datetime"
      v-bind="$parent.$attrs"
      v-on="$parent.$listeners"
      style="width:100%"
      value-format="yyyy-MM-dd HH:mm"
      :placeholder="$parent.$attrs.placeholder||'选择日期时间'">
    </el-date-picker>
  </el-form-item>
</template>
<script>
import formMixin from "../mixin";
export default {
  name: "form-datetime",
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
