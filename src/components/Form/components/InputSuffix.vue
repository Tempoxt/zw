<template>
  <el-form-item  :error="error" :label="field.name" v-bind="$parent.$attrs">
    <el-input class="suffix" v-model="data" :placeholder="$parent.$attrs.placeholder||'请输入'" v-bind="$parent.$attrs" v-on="$parent.$listeners" :type="field.type||'text'">
      <i slot="suffix" class="el-input__icon">{{$parent.$attrs.suffix}}</i>
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
    },
    suffix:''
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
<style>
  .suffix .el-input__icon{
    color: #4C5D66;
    font-style:normal
  }
</style>

