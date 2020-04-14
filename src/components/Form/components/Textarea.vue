<template>
  <el-form-item :label="field.name" v-bind="$parent.$attrs">
    <el-input type="textarea" v-model="data" v-bind="$parent.$attrs" v-on="$parent.$listeners"></el-input>
  </el-form-item>
</template>

<script>
import formMixin from "../mixin";
export default {
  name: "form-textarea",
  mixins: [formMixin],
  props: {
    field: Object
  }
};
</script>
