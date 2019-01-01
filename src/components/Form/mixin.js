export default {
  props: {
    value: {}
  },
  data () {
    return {
      data: ''
    }
  },
  watch: {
    data () {
      this.$emit('input', this.data)
    },
    value: {
      immediate: true,
      handler (val) {
        this.data = this.value
      }
    }
  },
  computed: {
    listeners () {
      return {
        ...this.$listeners
      }
    }
  }
}
