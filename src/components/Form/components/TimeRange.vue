<template>
  <el-form-item 
  :label="field.name"
   v-bind="$parent.$attrs"
   v-on="$parent.$listeners"
  >
    <el-time-picker
      format="HH:mm:ss" value-format="HH:mm:ss"
      is-range
      v-model="data"
      range-separator="至"
      start-placeholder="开始时间"
      end-placeholder="结束时间"
      placeholder="选择时间范围">
    </el-time-picker>
  </el-form-item>
</template>
<script>
import formMixin from "../mixin";
export default {
  name: "form-timerange",
  props: {
    field: Object,
    value: {}
  },
   watch: {
    data () {
      this.$parent.$emit('input', this.data)
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
      data: []
    };
  }
};
</script>
