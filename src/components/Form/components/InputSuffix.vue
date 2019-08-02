<template>
  <el-form-item  :error="error" :label="field.name" v-bind="$parent.$attrs">
    <el-input v-model="data" :placeholder="$parent.$attrs.placeholder||'请输入'" v-bind="$parent.$attrs" v-on="$parent.$listeners" :type="field.type||'text'">
      <i slot="suffix" class="el-input__icon">%</i>
    </el-input>
  </el-form-item>
</template>
<script>
import errorMixin from '../errorMixin'
export default {
  name: "form-inputSuffix",
  mixins:[errorMixin],
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
      if(this.data){
        this.error = ''
      }
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

