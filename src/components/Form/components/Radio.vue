<template>
  <el-form-item :label="field.name" style="height:33px"  v-bind="$parent.$attrs"
        v-on="$parent.$listeners">
      <el-radio-group 
        v-model="data"   
        v-bind="$parent.$attrs"
        v-on="$parent.$listeners">
        <el-radio :label="radio.value" v-for="radio in field.options" :key="radio.label">{{radio.label}}</el-radio>
    </el-radio-group>
  </el-form-item>
</template>
<script>
import formMixin from "../mixin";
export default {
  name: "form-radio",
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

