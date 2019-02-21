<template>
  <el-form-item 
  :label="field.name"
   v-bind="$parent.$attrs"
   v-on="$parent.$listeners"
  >
    <el-input-number
      v-model="data"
      v-bind="$parent.$attrs"
      v-on="$parent.$listeners"
      style="width:100%"
      controls-position="right"
    ></el-input-number>
  </el-form-item>
</template>
<script>
import formMixin from "../mixin";
export default {
  name: "form-number",
  mixins: [formMixin],
  props: {
    field: Object
  },
  computed: {
    listeners() {
      return {
        ...this.$listeners
      };
    }
  },
  methods: {},
  created() {}
};
</script>

