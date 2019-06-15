<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="cardName">工作日程</span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
      </div>

      <el-row>
        <el-col :span="14">
          <div class="list-l">
            <el-calendar v-model="value"></el-calendar>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="list-r">
            <div class="list-r-h">
              <span>日程表</span>
              <el-button icon="el-icon-plus" @click="addSchedule" size="mini"></el-button>
            </div>
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
<style>
.list-r-h .el-button--mini {
  padding: 7px 7px !important;
  float: right;
}
</style>

<style lang="scss" scoped>
.box-card {
  height: 370px;
  margin-left: 10px;
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
.cardName {
  color: #37474f;
  font-size: 16px;
  font-weight: bold;
}
.list-l {
  height: 240px;
  border-right: 1px solid rgba(228, 228, 228, 1);
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
</style>
