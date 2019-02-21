<template>
  <div>
      <el-form-item :label="field.name" v-bind="$parent.$attrs">
      <el-dialog
        title="选择坐标"
        :visible.sync="dialogVisible"
        class="public-dialog"
        v-el-drag-dialog
        append-to-body
        >

        <div>
            <el-amap class="amap-box" :amap-manager="amapManager" :vid="'amap-vue'" :events="events" :center="center">
                 <el-amap-search-box class="search-box" :search-option="{}"  :on-search-result="onSearchResult"></el-amap-search-box>
                 <el-amap-marker 
                 vid="component-marker" 
                 :position="position" 
                 animation="AMAP_ANIMATION_BOUNCE"
                 >
                 </el-amap-marker>
            </el-amap>
        </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>



    <el-input @focus="showDialog" v-model="data" :placeholder="$parent.$attrs.placeholder||'请输入'" v-bind="$parent.$attrs" v-on="$parent.$listeners" ></el-input>
  </el-form-item>
  </div>
</template>
<script>
import VueAMap from 'vue-amap'
let amapManager = new VueAMap.AMapManager();
export default {
  name: "form-map",
  props: {
    field: Object,
    value: {},
    placeholder:{
      default:'请输入'
    }
  },
  data() {
    var self = this
    return {
      data: "",
      dialogVisible:false,
      position:this.value?this.value.split(','):[113.870845,22.816739],
      center:this.value?this.value.split(','):[113.870845,22.816739],
      amapManager,
      result:{},
      events:{
          click(e) {
              let { lng, lat } = e.lnglat
              self.center = self.position = [lng,lat]
              self.changeResult([lng,lat])


          }
      }
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
  methods: {
      changeResult(center){
          var self = this
            var geocoder = new AMap.Geocoder({
                extensions: "all"
            });        
            geocoder.getAddress(center, function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                    self.result = result.regeocode
                }
            });      
      },
      showDialog(){
          this.dialogVisible = true
      },
      handleSubmit(){
          console.log(this.result)
        
          this.$parent.$emit("input", this.center.join(','));
          this.$parent.$emit('amapSubmit',this.result)
          setTimeout(()=>{
            this.dialogVisible = false
          },300)
      },
      onSearchResult(pois) {
          this.result = pois
          this.center = this.position = [pois[0].lng,pois[0].lat]
          this.changeResult([pois[0].lng,pois[0].lat])
      }
  },
  created() {
    
  }
};
</script>

<style lang="scss" scoped>
.search-box {
      position: absolute;
      top: 25px;
      left: 20px;
    }
.amap-box {
    height:500px;
    width:100%;
    position: relative;
}
</style>
