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
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <div v-if="data!=''">
        <div class="imgItem" v-for="(item,index) in data" :key="item" @mouseenter="enter(index)" @mouseleave="leave()">
          <img :src="baseUrl+item" class="avatar">
          <i class="icon iconfont icon-guanbi1" v-if="mouse&&index==current" @click="handleRemov(index)"></i>
          <i class="icon iconfont icon-qiyong" v-else></i>
        </div>
      </div>
    </el-form-item>
  </template>
<script>
let baseUrl = process.env.VUE_APP_STATIC
export default {
  name: "form-imgMultiple",
  props: {
    field: Object,
    value: {},
    placeholder:{
      default:'请输入'
    },
    cardPerform:Object,
  },
  data() {
    return {
      data:[],
      fileList:[],
      url:process.env.VUE_APP_BASEAPI,
      baseUrl,
      mouse:false,
      current: 0
    };
  },
  
  watch: {
    data() {
      this.fileList = []
      this.$parent.$emit("input", this.data);
    },
    value: {
      immediate: true,
      handler(val) {
        this.data = this.value;
      },
      deep:true
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
    },
  },
  methods: {
    enter(index){
      this.mouse = true;
      this.current = index;
    },
    leave(){
      this.mouse = false;
      this.current = null;
    },
    handleRemov(index){
      this.data.splice(index,1);
    },
    handleAvatarSuccess(res, file) {
      if(this.data!=''){
        this.data.push(res.path)
      }else{
        this.fileList.push(res.path)
        this.data = this.fileList
      }
    },
    handlePreview(file) {
      console.log(file);
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
 .avatar-uploader .el-upload{
   border:none
 }
 .imgItem{
   border: 1px dashed #E4E4E4;
   margin-bottom: 8px;
   display: flex;
   justify-content: space-between;
   align-items: center
 }
 .icon-guanbi1{
  margin-right: 10px;
 }
 .icon-qiyong{
   color: #1FD361;margin-right: 10px;
 }
 .avatar{
   height: 80px;
 }
</style>
