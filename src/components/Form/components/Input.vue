<template>
  <el-form-item :label="field.name" v-bind="$parent.$attrs">
    <el-input v-model="data" :placeholder="$parent.$attrs.placeholder||'请输入'" v-bind="$parent.$attrs" v-on="$parent.$listeners" ></el-input>
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
  created() {
    
  }
};
</script>

