<template>
  <div id="scheduleMarage">
    <el-card class="box-card">
      <el-row>
        <el-col class="borR" :span="14">
          <div class="cardHead">
            <div class="cardName"><i class="iconfont icon-gongzuoricheng date_icon"></i><span>工作日程</span></div>
          </div>
          <div class="list-l">
            <el-calendar v-model="value"></el-calendar>
          </div>
        </el-col>
        <el-col class="padd0" :span="10">
          <div class="cardHead">
            <div class="cardName"><i class="iconfont icon-tixing tip_icon"></i><span>今日提醒</span></div>
          </div>
          <div class="list-r">
            <div class="list-r-b">
              <NoData msg="暂无任务"></NoData>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog title="添加日程" :visible.sync="dialogFormVisible">
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
      <div slot="footer" class="dialog-footer">
        <el-switch
          v-model="value1"
          active-text="连续添加" class="continuously-added">
        </el-switch>  
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
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
      dialogFormVisible: false,
      dialogFormVisible2:false,
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
    addSchedule() {
      this.dialogFormVisible = true;
    }
  }
};
</script>
<style lang="scss">
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
}
</style>

<style lang="scss" scoped>
#scheduleMarage{
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
    padding: 0 20px;
    margin-bottom: 20px;
    box-sizing: border-box;
    .cardName {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      padding: 10px 0;
      border-bottom: 1px solid #E4EAEC;
      .icon-gongzuoricheng,.icon-tixing{
        font-size: 16px;
      }
    }
  }
  
  .list-r {
    padding-left: 10px;
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
    }
  }
  
}

</style>
