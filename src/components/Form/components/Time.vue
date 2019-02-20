<template>
  <el-form-item :label="field.name">

   <el-time-picker
    v-model="data"
    v-bind="$parent.$attrs"
    v-on="$parent.$listeners"
    :picker-options="{
      
    }"
    value-format="HH:mm:ss"
    placeholder="选择时间">
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
