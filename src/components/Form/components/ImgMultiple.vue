  <template>
    <el-form-item :label="field.name">
      <CropperImages :url="cropImagesUrl" :visible.sync="isCrop" @onBlob="uploadCrop"/>
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
          <span>
             <el-button type="text" @click="cropImages(baseUrl+item,index)">调整图片</el-button> &nbsp;&nbsp;

             <i class="icon iconfont icon-guanbi1" v-if="mouse&&index==current" @click="handleRemov(index)"></i>
             <i class="icon iconfont icon-qiyong" v-else></i>

          </span>
          
         
        </div>
      </div>
    </el-form-item>
  </template>
<script>
let baseUrl = process.env.VUE_APP_STATIC
import CropperImages from '@/components/Images/CropperImages'
import request from '@/plugins/request'
export default {
  components:{
    CropperImages
  },
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
      current: 0,
      isCrop:false,
	  cropImagesUrl:'',
	  imgFile:''
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
    async uploadCrop(blob){
        var formData = new FormData();
        formData.append("upload_msg", "employee_card");
        formData.append('the_file',blob,'hello.jpg')
        const { path } = await this.$request.post('/uploadfile',formData)
        this.handleRemov(this.cropIdx)
        if(this.data!=''){
          	this.data.push(path)
        }else{
			this.fileList.push(path)
			this.data = this.fileList
        }
    },
    cropImages(url,idx){
      this.cropImagesUrl = url
      this.cropIdx = idx
      this.isCrop = true
    },
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
      if(this.data!=''&&this.data!=undefined){
        this.data.push(res.path)
      }else{
        this.fileList.push(res.path)
        this.data = this.fileList
      }
    },
    handlePreview(file) {
      console.log(file);
    },
    //图片压缩
    async imgCompress(path,obj,statu){
		let _this = this  //这里的this 是把vue的实例对象指向改变为_this
		var img = new Image();
		img.src = _this.imgFile;
		img.onload = async function(){
			var that = this;  //这里的this 是把img的对象指向改变为that 
			// 默认按比例压缩
			var w = that.width,
				h = that.height,
				scale = w / h;
				w = obj.width || w;
				h = obj.height || (w / scale);
			var quality = 0.7;  // 默认图片质量为0.7
			//生成canvas
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');
			// 创建属性节点
			var anw = document.createAttribute("width");
			anw.nodeValue = w;
			var anh = document.createAttribute("height");
			anh.nodeValue = h;
			canvas.setAttributeNode(anw);
			canvas.setAttributeNode(anh);
			ctx.drawImage(that, 0, 0, w, h);
			// 图像质量
			if(obj.quality && obj.quality <= 1 && obj.quality > 0){
				quality = obj.quality;
			}
			// quality值越小，所绘制出的图像越模糊
			var base64 = canvas.toDataURL('image/jpeg', quality);
			// 回调函数返回base64的值
			var urlFile = _this.convertBase64UrlToBlob(base64)  //这个地方的处理是为了把压缩的base64转化为对象，获得压缩后图片的大小size，方便对压缩后的图片再次进行判断；
			let file = _this.blobToFile(urlFile,'123')
			var formData = new FormData();
			formData.append("upload_msg", "axjj");
			formData.append('the_file',file,'hello.jpg')
			console.log(quality)
			let {path}= await request.post('/uploadfile',formData)
			if(_this.data!=''&&_this.data!=undefined){
				_this.data.push(path)
			}else{
				_this.fileList.push(path)
				_this.data = _this.fileList
			}
			if(urlFile.size/1024 > 1025){
				_this.$message.error("图片过大，请重新上传图片")
			}
		}
	},
	convertBase64UrlToBlob(urlData){
		var arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
		while(n--){
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new Blob([u8arr], {type:mime});
	},
	blobToFile(theBlob, fileName){
		theBlob.lastModifiedDate = new Date();
		theBlob.name = fileName;
		return theBlob;
	},
    beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
		const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
			var reader = new FileReader()
			var that = this
			var image  = new Image()
			reader.readAsDataURL(file)
			reader.onload = function(e) {
				that.imgFile = this.result
				that.imgCompress(this.imgFile,{quality:0.2})
			}
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
   align-items: center;
  .icon-guanbi1{
    margin-right: 10px;
  }
 }
 .imgItem .icon-qiyong{
   color: #1FD361;margin-right: 10px;
 }
 .avatar{
   height: 80px;
 }
</style>
