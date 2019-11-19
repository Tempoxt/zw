<template>
  <el-form-item :label="field.name"
      v-bind="$parent.$attrs"
    v-on="$parent.$listeners"
  
  >

   <el-time-picker
    v-model="data"
    v-bind="$parent.$attrs"
    v-on="$parent.$listeners"
    :picker-options="{
      
    }"
    :placeholder="$parent.$attrs.placeholder||'选择时间'"
    format="HH:mm"
    value-format="HH:mm">
  </el-time-picker>
  </el-form-item>
</template>
<script>
import formMixin from "../mixin";
export default {
  name: "form-time",
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
