<template>
  <div id="scheduleMarage">
    <el-card class="box-card">
      <el-row>
        <el-col class="borR" :span="14">
          <div class="cardHead padding-r-20">
            <div class="cardName"><i class="iconfont icon-gongzuoricheng date_icon"></i><span>工作日程</span></div>
          </div>
          <div class="list-l">
            <el-calendar v-model="value">
              <template
                slot="dateCell"
                slot-scope="{date, data}">
                <p :class="data.isSelected ? 'is-selected flex_r_bc' : 'flex_r_bc'">
                  <span>{{ data.day.substring(8) }}</span>
                  <span v-if="data.isSelected" class="dot  bg_orange"></span>
                </p>
              </template>
            </el-calendar>
          </div>
        </el-col>
        <el-col class="padd0" :span="10">
          <div class="cardHead padding-l-20">
            <div class="cardName flex_r_bc">
              <span><i class="iconfont icon-tixing tip_icon"></i>今日提醒</span>
              <i class="icon_add" @click="dialogState='add';dialogFormVisible=true"></i>
            </div>
          </div>
          <div class="list-r">
            <div class="list-r-b">
              <ul class="tipList">
                <li class="flex_r_bc">
                  <div class="li_l">
                    <span class="li_name"><span class="dot bg_orange"></span>模具管理UI设计</span>
                    <span class="li_state">一般</span>
                  </div>
                  <div class="li_r">
                    <span @click="deleteTip()" class="iconfont icon-lajitong"></span>
                    <span @click="dialogState='edit';dialogFormVisible=true" class="iconfont icon-bianji"></span>
                  </div>
                </li>
              </ul>
              <!-- <NoData msg="暂无任务"></NoData> -->
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog :title="dialogState=='add'?'添加日程':'编辑日程'" :visible.sync="dialogFormVisible">
      <el-form :model="form" class="add-form">
        <el-form-item label="日程类型" :label-width="formLabelWidth">
          <el-select v-model="form.region" placeholder="请选择类型" class="add-type">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.desc" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="起止日期" :label-width="formLabelWidth">
          <el-date-picker
            v-model="value2"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="紧急程度" :label-width="formLabelWidth">
          <el-radio-group v-model="form.resource">
            <el-radio label="一般"></el-radio>
            <el-radio label="重要"></el-radio>
            <el-radio label="紧急"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="日程提醒" :label-width="formLabelWidth">
          <el-radio-group v-model="form.resource">
            <el-radio label="不提醒"></el-radio>
            <el-radio label="企业微信"></el-radio>
            <el-radio label="短信"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="提醒时间" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer flex_r_bc">
        <el-switch
          v-model="value1"
          active-text="连续添加" class="continuously-added">
        </el-switch>  
        <div>
          <el-button @click="dialogFormVisible=false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </div>
      </div>
    </el-dialog>

     <el-dialog title="日程详情" :visible.sync="dialogFormVisible2">
      <el-form class="schedule">
        <el-form-item label="日程类型" :label-width="formLabelWidth">
          工作安排
        </el-form-item>
        <el-form-item label="标题" :label-width="formLabelWidth">
          模具管理UI设计
        </el-form-item>
        <el-form-item label="内容" :label-width="formLabelWidth">
          这里是内容
        </el-form-item>
        <el-form-item label="起止日期" :label-width="formLabelWidth">
          2019-05-20 至 2019-05-24
        </el-form-item>
        <el-form-item label="紧急程度" :label-width="formLabelWidth">
          <el-tag  effect="plain" class="tag">一般</el-tag>
        </el-form-item>
        <el-form-item label="日程提醒" :label-width="formLabelWidth">
          不提醒
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import NoData from "./NoData";
export default {
  name: 'scheduleMarage',
  data() {
    return {
      value: new Date(),
      value1:false,
      value2: '',
      dialogState: 'add',
      dialogFormVisible: false,
      dialogFormVisible2: false,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      formLabelWidth: "100px",
			pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
    };
  },
  components: {
    NoData
  },
  methods: {
    submit() {
      this.dialogFormVisible = false
      if(this.dialogState == 'add'){

      }else{

      }
    },
    deleteTip() {
      
    }
  }
};
</script>
<style lang="scss">
.bg_orange{
  background: #FFA023;
}
.list-r-h .el-button--mini {
  padding: 7px 7px !important;
  float: right;
}

#scheduleMarage{
  .el-card__body{
    height: 100%;
    padding: 0 !important;
  }
  .el-calendar__header{
    border: 0;
  }
  .el-calendar-table .el-calendar-day{
    height: 31px;
    box-sizing: border-box;
  }

  .el-dialog__header{
    padding: 15px 20px;
    background: #F5FAFB;
  }
  .el-dialog__footer{
    padding: 10px 20px;
    border-top: 1px solid #E4EAEC;
  }
}
</style>

<style lang="scss" scoped>
.padding-l-20{
  padding-left: 20px;
}
.padding-r-20{
  padding-right: 20px;
}
.padding-lr-20{
  padding: 0 20px;
}

#scheduleMarage{
  .dot{
    display: inline-block;
    width: 6px;
    height: 6px;
    margin-right: 10px;
    border-radius: 50%;
  }

  .heightMax{
    height: 100%;
  }
  .padd0{
    padding: 0;
  }
  .borR{
    border-right: 1px solid #E4E4E4;
  }

  .box-card {
    height: 370px;
  }
  .add-form{
    width: 450px;
    margin: 0 auto;
    .add-type{
      width: 350px;
    }

  }
  .continuously-added{
      float: left;
    }
  .cardHead{
    width: 100%;
    box-sizing: border-box;
    .cardName {
      position: relative;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      padding: 10px 0;
      border-bottom: 1px solid #E4EAEC;
      .icon-gongzuoricheng,.icon-tixing{
        font-size: 16px;
      }
      .icon_add{
        position: absolute;
        right: 0;
        top: 16px;
        width: 16px;
        height: 16px;
        background: url('~@imgs/workbench-img/icon_add2.png');
        background-size: cover;
        cursor: pointer;
      }
    }

  }
  
  .list-l{
    margin-top: 20px;
    padding-right: 20px;
  }
  .list-r {
    padding-left: 20px;
    .list-r-h {
      font-size: 16px;
      font-weight: bold;
      border-bottom: 1px solid rgba(245, 245, 245, 1);
      padding-bottom: 15px;
    }
    .list-r-b {
      width: 100%;
      height: 190px;
      position: relative;
      .tipList{
        li{
          padding: 13px 0 17px 0;
          .li_name{
            display: inline-block;
            margin-right: 15px;
            font-size: 12px;
            color: #4C5D66;
          }
          .li_state{
            display: inline-block;
            padding: 5px 14px;
            font-size: 12px;
            color: #0BB2D4;
            background:rgba(11,178,212,0.1);
            border-radius:2px;
          }
        }
      }
      .li_r{
        .icon-lajitong,.icon-bianji{
          color: #CCD5DB;
          cursor: pointer;
        }
      }
    }
  }
  
}

</style>
