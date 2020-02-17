<template>
  <div id="systemMessages">
    <el-card class="box-card">
      <div slot="header" class="box-card-header">
        <div class="cardName">
          <i class="iconfont icon-xitongxiaoxi"></i><span>系统消息</span>
        </div>
      </div>
      <div class="container">
        <ul class="dataList">
          <li class="flex_r_bs">
            <div class="li_l flex_c_ss">
              <div class="flex_r_sc mb10"><span class="dot bg_red"></span>物品领用，退转功能已开通</div>
              <div class="linkTxt"><span class="icon_pdf"></span>物品领用使用说明v1.2</div>
            </div>
            <div class="li_r">
                <span>2020.01.13  11:40</span>
            </div>
            
          </li>
        </ul>
        <!-- <NoData msg="暂无消息"></NoData> -->
      </div>
    </el-card>
  </div>
</template>

<script>
import NoData from "./NoData";

export default {
  name: "systemMessages",
  data() {
    return {};
  },
  components: {
    NoData
  }
};
</script>

<style lang="scss">
#systemMessages{
  .box-card{
    .el-card__body{
      padding-top: 10px;
      padding-bottom: 10px;
    }    
  }
}
</style>

<style lang="scss" scoped>
.mb10{
    margin-bottom: 10px;
}

#systemMessages {

  .bg_red {
    background: #ff2323;
  }
  .bg_gray {
    background: #ccd5db;
  }

  .box-card-header{
  }
  .cardName {
    .icon-xitongxiaoxi {
      font-size: 16px;
    }
  }
  .container {
    position: relative;
    height: 239px;
    .dataList{
        li{
            padding-bottom: 15px;
            border-bottom: 1px solid #F5F5F5;
            .li_l{
                font-size: 14px;
                .dot{
                    display: inline-block;
                    width: 6px;
                    height: 6px;
                    margin-right: 15px;
                    border-radius: 50%;
                }
                .icon_pdf{
                    display: inline-block;
                    width: 10px;
                    height: 12px;
                    margin-right: 15px;
                    background: url('~@imgs/workbench-img/pdf.png');
                    background-size: cover;
                }
                .linkTxt{
                    text-decoration: underline;
                    color: #0BB2D4;
                    cursor: pointer;
                }        
            }  
            .li_r{
                color: #A3AFB7;
            }               
        }
   
    }


  }
}
</style>
