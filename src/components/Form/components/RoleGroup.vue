<template>
  <el-form-item :label="field.name">
   <el-select v-model="data" placeholder="请选择" multiple style="width:100%;">
    <el-option-group
      v-for="group in options3"
      :key="group.id"
      :label="group.groupname">
      <el-option
        v-for="item in group.group_role"
        :key="item.roleid"
        :label="item.name"
        :value="item.roleid">
      </el-option>
    </el-option-group>
  </el-select>
  </el-form-item>
</template>

<script>
import * as api_common from "@/api/common";
const api_rolegroup = api_common.resource('roles/rolegroup')
export default {
  name: "form-roleGroup",
  props: {
    field: Object,
    value: {}
  },
  methods: {

  },
  watch: {
    data: {
      handler() {
        this.$parent.$emit("input", this.data);
      },
      deep: true
    },
    value: {
      immediate: true,
      handler(val) {
        this.data = this.value;
      }
    }
  },
  data() {
    return {
        data:[],
        options3:[]
    };
  },
  async created() {
    this.options3 = await api_rolegroup.get();
    console.log(this.data,'data')
  }
};
</script>
