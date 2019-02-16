<template>
  <el-form-item :label="field.name" v-bind="$parent.$attrs">
    <el-input v-model="data" v-bind="$parent.$attrs" v-on="$parent.$listeners" :placeholder="placeholder"></el-input>
  </el-form-item>
</template>
<script>
export default {
  name: "form-input",
  props: {
    field: Object,
    value: {},
    placeholder:{
      default:'请输入'
    }
  },
  data() {
    return {
      data: ""
    };
  },
  watch: {
    data() {
      this.$emit("input", this.data);
    },
    value: {
      immediate: true,
      handler(val) {
        this.data = this.value;
      }
    }
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

