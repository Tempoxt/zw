<template>
  <div id="scheduleMarage">
    <el-card class="box-card">
      <el-row>
        <el-col class="borR" :span="14">
          <div class="cardHead padding-r-20">
            <div class="cardName"><i class="iconfont icon-gongzuoricheng date_icon"></i><span>工作日程</span></div>
          </div>
          <div class="list-l">
            <el-calendar v-model="calendar">
              <template
                slot="dateCell"
                slot-scope="{date, data}">
                <!-- <p @click="chooseDate(scheduleData && scheduleData.find(o=>o.remindTime.substring(0,10) == data.day).id)" :class="data.isSelected ? 'is-selected flex_r_bc' : 'flex_r_bc'"> -->
                <p :class="data.isSelected ? 'is-selected flex_r_bc' : 'flex_r_bc'">
                  <span>{{ data.day.substring(8) }}</span>
                  <span v-if="scheduleData && scheduleData.find(o=>o.remindTime.substring(0,10) == data.day)" class="dot bg_orange"></span>
                </p>
              </template>
            </el-calendar>
          </div>
        </el-col>
        <el-col class="padd0" :span="10">
          <div class="cardHead padding-l-20">
            <div class="cardName flex_r_bc">
              <span><i class="iconfont icon-tixing tip_icon"></i>今日提醒</span>
              <i class="icon_add" @click="action('add')"></i>
            </div>
          </div>
          <div class="list-r">
            <div class="list-r-b">
              <ul class="tipList">
                <li class="flex_r_bc" v-for="(item,index) in scheduleTody.rows" :key="item.id" @click.self.prevent="chooseDate(item.id)">
                  <div class="li_l">
                    <span class="li_name"><span class="dot bg_orange"></span>{{item.title}}</span>
                    <span class="li_state">{{item.level == 1?'一般':item.level == 2?'重要':'紧急'}}</span>
                  </div>
                  <div class="li_r">
                    <span @click="dialogFormVisible3 = true;activeId = item.id" class="iconfont icon-lajitong"></span>
                    <span @click="action('edit',item.id,index)" class="iconfont icon-bianji"></span>
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
      <el-form ref="scheduleForm" :model="form" class="add-form">
        <el-form-item required label="日程类型" prop="sType" :label-width="formLabelWidth">
          <el-select v-model="form.sType" placeholder="请选择类型" class="add-type">
            <el-option v-for="item in typeList" :key="item.id" :label="item.sname" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title" :label-width="formLabelWidth" :rules="{required: true, message: '标题不能为空'}">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="text" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="form.text" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item prop="times" label="起止日期" :label-width="formLabelWidth" :rules="{required: true, message: '起止日期不能为空'}">
          <el-date-picker
            v-model="form.times"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="紧急程度" prop="urgency" :label-width="formLabelWidth">
          <el-radio-group v-model="form.urgency">
            <el-radio v-for='item in urgencyList' :key="item.id" :label="item.id">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="日程提醒" prop="remindType" :label-width="formLabelWidth">
          <el-radio-group v-model="form.remindType">
            <el-radio v-for="item in remindTypeList" :key="item.id" :label="item.id">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="提醒时间" prop="remindTime" :label-width="formLabelWidth" :rules="{required: true, message: '提醒时间不能为空'}">
          <el-date-picker
            v-model="form.remindTime"
            type="datetime"
            placeholder="选择日期时间"
            default-time="12:00:00">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer flex_r_bc">
        <el-switch
          v-model="continuous"
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
          {{activeDate.sname}}
        </el-form-item>
        <el-form-item label="标题" :label-width="formLabelWidth">
          {{activeDate.title}}
        </el-form-item>
        <el-form-item label="内容" :label-width="formLabelWidth">
          {{activeDate.text}}
        </el-form-item>
        <el-form-item label="起止日期" :label-width="formLabelWidth">
          {{activeDate.startTime}} 至 {{activeDate.endTime}}
        </el-form-item>
        <el-form-item label="紧急程度" :label-width="formLabelWidth">
          <el-tag  effect="plain" class="tag">{{activeDate.urgency==1?'一般':activeDate.urgency==2?'重要':'紧急'}}</el-tag>
        </el-form-item>
        <el-form-item label="日程提醒" :label-width="formLabelWidth">
          {{activeDate.remindTime}}
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="dialogFormVisible3" width="30%">
      <span class="dialogTxt">是否确认删除今日提醒</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="deleteTip">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import NoData from "./NoData";
import dayjs from 'dayjs'
import * as api_common from '@/api/common'

export default {
  name: 'scheduleMarage',
  data() {
    return {
      api_schedule: api_common.resource('workbench/schedule'),
      api_scheduleTody: api_common.resource('workbench/schedule/today'),
      api_typeList: api_common.resource('workbench/schedule/dropdown'),
      calendar: new Date(),
      continuous:false,
      scheduleData: [],
      scheduleTody: [],
      activeDate: {},
      activeId: '',
      dialogState: 'add',
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      typeList: [],
      urgencyList: [{name: '一般', id: 1},{name: '重要', id:2}, {name: '紧急', id: 3}],
      remindTypeList: [{name: '不提醒', id:1}, {name: '企业微信', id: 2}, {name: '短信', id: 3}],
      form: {
        sType: 1,
        urgency: 1,
        remindType: 1
      },
      formLabelWidth: "100px",
			pickerOptions: {
          shortcuts: [{
            text: '往后一周',
            onClick(picker) {
              const start = new Date();
              const end = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '往后一个月',
            onClick(picker) {
              const start = new Date();
              const end = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '往后三个月',
            onClick(picker) {
              const start = new Date();
              const end = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
    };
  },
  components: {
    NoData
  },
  computed: {
    startTime() {
      return this.form.times ? dayjs(this.form.times[0]).format('YYYY-MM-DD') : ''
    },
    endTime() {
      return this.form.times ? dayjs(this.form.times[1]).format('YYYY-MM-DD') : ''
    }
  },
  watch: {
    calendar(val) {
      this.getData()
    }
  },
  methods: {
    async action(state,id,index) {
      this.dialogState == state
      if(state == 'edit'){
        this.dialogState='edit'
        let obj = await this.api_schedule.find(id)
        this.$set(this,'form', obj[index])
        let times = []
        times[0] = dayjs(obj[index].startTime).toDate()
        times[1] = dayjs(obj[index].endTime).toDate()

        this.$set(this.form,'times', times)
        
      }else{
        this.$set(this, 'form', {sType: 1,urgency: 1,remindType: 1})        
      }

      this.dialogFormVisible=true
    },
    submit() {
      this.$refs['scheduleForm'].validate((valid) => {
        if(valid){
          this.dialogFormVisible = false
          if(this.dialogState == 'add'){
            this.api_schedule.create({
              ...this.form,
              startTime: this.startTime,
              endTime: this.endTime,
              remindTime: dayjs(this.form.remindTime).format('YYYY-MM-DD HH:mm')
            }).then(()=>{
              this.$set(this, 'form', {sType: 1,urgency: 1,remindType: 1})
            })
            if(this.continuous){
              this.dialogFormVisible = true
            }else{
              this.dialogFormVisible = false
            }
          }else{
            

          }                  
        }
      })
    },
    async chooseDate(id) {
      if(id){
        this.activeDate = await this.api_schedule.find(id)[0]
        this.dialogFormVisible2 = true
      }
    },
    filterDate(date) {
      return dayjs(date).format('YYYY-MM-DD')
    },
    deleteTip(id) {
      this.dialogFormVisible3 = false
      this.api_schedule.delete(id)      
    },
    async getData() {
      let schedule = await this.api_schedule.get(`${dayjs(this.calendar).format('YYYY-MM')}`)
      this.scheduleData = schedule.rows
      this.scheduleTody = await this.api_scheduleTody.get()
      this.typeList = await this.api_typeList.get()
      console.log(this.calendar, 48787)
    }
  },
  created() {
    this.getData()
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
  .el-calendar{
    .el-calendar__header{
      border: 0;
    }
    .el-calendar__body{
      padding: 10px 0 32px;
    }    
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

  .el-date-editor{
    width: 100%;
  }
}
</style>

<style lang="scss" scoped>
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
    height: 360px;
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
    padding: 0 20px;
  }
  .list-r {
    padding: 0 20px;
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
          cursor: pointer;
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
