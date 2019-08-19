<template>
  <el-card class="box-card">
    <div :id="id" v-show="show" class="box-card-c"></div>
		<!-- <div id="ring-diagram2" v-show="!show" class="box-card-c"></div> -->
		<div :id="id+'2'" v-show="!show" class="box-card-c"></div>
  </el-card>
</template>

<script>
import echarts from "echarts";

export default {
	props:["title","id","show","datas","screenIndex"],
	data() {
		return {
			option: {}
		}
	},
	mounted() {
		this.$nextTick(function() {
			this.init(this.id,this.datas)
		})
	},
	watch: {
		datas:{
			handler(newVal, oldVal){
				if(this.datas!=''){
					this.datas = newVal
					this.init(this.id,newVal)
				}
			},
			immediate: true,
			deep: true
		}
	},
	methods:{
		checkFull(){
			$(".box-card-c").width(parseInt($("body").width())-40);
			$("#"+this.id+"2").height(parseInt(window.screen.height)-40);
			let aaa = echarts.init(document.getElementById(this.id+"2"));//ring-diagram2
			aaa.setOption(this.option);
		},
		base64ToBlob(code) {
            let parts = code.split(';base64,');
            let contentType = parts[0].split(':')[1];
            let raw = window.atob(parts[1]);
            let rawLength = raw.length;

            let uInt8Array = new Uint8Array(rawLength);

            for (let i = 0; i < rawLength; ++i) {
                uInt8Array[i] = raw.charCodeAt(i);
            }
            return new Blob([uInt8Array], { type: contentType });
        },
        saveAsImage(id){
			let myChart = echarts.init(document.getElementById(id));
            let content = myChart.getDataURL();

            let aLink = document.createElement('a');
            let blob = this.base64ToBlob(content);

            let evt = document.createEvent("HTMLEvents");
            evt.initEvent("click", true, true);
            aLink.download = "line.png";
            aLink.href = URL.createObjectURL(blob);
            aLink.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        },
		fullScreen(){
			this.$emit("fullScreen",this.screenIndex)
		},
		init(id,data){
			let _this=this;
			this.option = {
			  title: {
			    text: this.title
			  },
			  tooltip: {
			    trigger: "item",
			    formatter: "{a} <br/>{b}: {c} ({d}%)"
			  },
			  toolbox: {
				right:20,
			    show: true,
			    orient: "horizontal",
			    feature: {
			      myTool2: {
					  show: true,
					  padding:10,
					  title:"全屏",
			          icon: 'image://http://echarts.baidu.com/images/favicon.png',
			          onclick: function (){
			              _this.fullScreen()
			          }
				  },
				//    myTool3: {
				// 	  show: true,
				// 	  title:"保存为图片",
			    //       icon: 'image://data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7',
			    //       onclick: function (){
			    //           _this.saveAsImage(id)
			    //       }
			    //   },
			      saveAsImage: {
			        show: true
			      }
			    }
			  },
			  legend: {
			    orient: "horizontal",
				top: "40",
				data:[]
			  },
			  color: ["#5A8BFC","#FF8D53","#996EFF","#40CDE9","#84EBFF","#FF64A2","#FFAF47","#6556FF","#58D8BE","#B392FF","#FE68D1","#F3D044","#FF5454","#4BDB80","#FFAA7E","#C858FF","#E4D945","#5CACFC","#7DD453","#FF8D8D"],
			  series: [
			    {
				  name: this.title,
			      type: "pie",
			      radius: ["30%", "45%"],
			      center: ["50%", "65%"],
				  avoidLabelOverlap: true,
				  minAngle:20,
			      label: {
			        normal: {
			          show: true,
			          position: "outside",
			          formatter: "{b}:{c}/{d}%"
			        },
			        emphasis: {
			          show: true,
			          textStyle: {
			            fontSize: "16",
			            fontWeight: "bold"
			          }
			        }
			      },
			      labelLine: {
			        normal: {
			          show: true
			        }
				  },
				  data: data
				//   data:  [
			    //     { value: 335, name: "齿轮箱业务部" },
			    //     { value: 310, name: "总裁办" },
			    //     { value: 234, name: "管理部" },
			    //     { value: 135, name: "经管部" },
			    //     { value: 1548, name: "营业部" },
			    //     { value: 1548, name: "注塑业务部" }
			    //   ]
			    }
			  ]
			};
			if(data!=undefined){
				for (let i = 0; i < data.length; i++) {
					this.option.legend.data[i] = data[i].name;
				}
				if (this.color) {
					this.option.color = this.color;
				}
				$(".box-card-c").width(parseInt($(".box-card").parent().width())-40);
				let myChart = echarts.init(document.getElementById(id));
				myChart.setOption(this.option);
				window.addEventListener('resize',function() {
					$(".box-card-c").width(parseInt($(".box-card-c").parent().width()));
					$(".box-card-c").height(parseInt($(".box-card-c").parent().height()));
					myChart.resize()
				});
			}
		}
	},
};
</script>

<style lang="scss" scoped>
.box-card {
  margin-top: 10px;
  padding-top: 15px;
	#ring-diagram2{
		height: 100%;
	}
  .box-card-c{
    height: 380px;
  }
}
</style>
