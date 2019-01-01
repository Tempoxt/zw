<script>
const requireComponent = require.context(
  // 其组件目录的相对路径
  "./components",
  // 是否查询其子目录
  false,
  // 匹配基础组件文件名的正则表达式
  /[A-Z]\w+\.(vue|js)$/
);

export default {
  props: {
    type: String,
    field: Object,
    value: {}
  },
  render(h) {
    var componentConfig = null;
    requireComponent.keys().find(fileName => {
      componentConfig = requireComponent(fileName);
      return componentConfig.default.name === "form-" + this.type;
    });
    return (
      <componentConfig.default
        field={this.field}
        v-model={this.value}
        value={this.value}
      />
    );
  },
  created() {}
};
</script>
