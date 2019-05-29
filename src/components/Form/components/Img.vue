<template>
  <el-form-item :label="field.name">
    <el-upload
    v-bind="$parent.$attrs" 
    v-on="$parent.$listeners"
    :headers="{Authorization:token}"
    class="avatar-uploader"
    name="the_file"
    :action="`${url}/uploadfile`"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload">
    <img v-if="data" :src="baseUrl+''+data" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
    <!-- <el-input v-model="data" v-bind="$parent.$attrs" v-on="$parent.$listeners" :placeholder="placeholder"></el-input> -->
  </el-form-item>
</template>
<script>
let baseUrl = process.env.VUE_APP_STATIC
export default {
  name: "form-img",
  props: {
    field: Object,
    
    value: {},
    placeholder:{
      default:'请输入'
    }
  },
  data() {
    return {
      data: "",
      url:process.env.VUE_APP_BASEAPI,
      baseUrl
    };
  },
  watch: {
    data() {
       this.$parent.$emit("input", this.data);
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
    },
    token(){
      return this.$store.state.user.token
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
        // this.data = URL.createObjectURL(file.raw);
        this.data = res.path
     
    },
    beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        console.log(file,'file')
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isLt2M;
      }
  
  },
  created() {

   
  }
};
</script>

<style lang="scss">
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    max-width: 100px;
    min-width: 100px;
    // height: 100px;
    line-height: 100px;
    text-align: center;
  }
  .avatar {
    max-width: 100px;
    // height: 100px;
    display: block;
  }
</style>
