<template>
  <div id="stickyNote">
    <el-card class="box-card">
      <div slot="header" class="box-card-header">
        <div class="cardName">
          <i class="iconfont icon-bianlitie"></i><span>便利贴</span>
        </div>
      </div>
      <div class="container" style="margin-top:14px;margin-bottom:14px">
        <div class="container_head flex_r_bc">
          <div class="container_head_l flex_r_sc">
            <span>共：{{total}}条</span>
          </div>
          <div class="container_head_r">
            <i @click="dialogVisible = true" class="icon_reduce"></i>
            <i @click="addNote" class="icon_add"></i>
          </div>
        </div>
        <div class="container_content flex_r_ss">
            <div class="container_content_l flex_c_ss" style="width: 180px;">
              <el-scrollbar ref="scrollbar" style="width:100%;height: 100%;">
                <div @click="chooseTabs(item.id)" v-for="item in noteTabs" :key="item.id" class="noteTabs flex_c_ss" :class="activeId == item.id?'activeTab':''">
                  <div class="flex_c_ss">
                    <span class="noteName">{{item.title}}</span>
                    <span class="noteTime">{{item.created | noteDate}}</span>
                  </div>
                </div>
              </el-scrollbar>

            </div>            

          <div class="container_content_r" style="height:100%">
            <template v-if="noteTabs.length">
             <div class="titleInput">
                  <el-input @change="changeNote" v-model="noteInput" placeholder="请输入内容"></el-input>
                </div>
                <div class="contentInput">
                  <el-input
                    ref="textarea"
                    type="textarea"
                    resize="none"
                    @change="changeNote"
                    v-model="noteTextarea"
                    placeholder="请输入内容"
                  ></el-input>
                </div>
            </template>       
            <div v-else style="    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;">
               <span>请先添加便签。</span>  
            </div>     
          </div>

        </div>
      </div>
    </el-card>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span class="dialogTxt">是否确认删除该条便利贴</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="del()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import * as api_common from "@/api/common";

export default {
  name: "stickyNote",
  data() {
    return {
      api_resource: api_common.resource('workbench/note'),
      activeId: '',
      total: 0,
      dialogVisible: false,
      noteInput: "",
      noteTextarea: "",
      isAdd: false,
      noteTabs: [],
      noteData: {},
    };
  },
  computed: {
    activeObj() {
      this.activeId == '' &&this.noteData.rows.length &&  (this.activeId = this.noteData.rows[0].id)
      if(this.noteData.rows.length){
        return this.noteData.rows.find(o=>o.id==this.activeId)        
      }else{
        return {}
      }
    },
    
  },
  filters: {
    noteDate(val) {
      return dayjs(val).format('M月D日 HH:mm')
    }
  },
  methods: {
    async del() {
      let preId = ''
      this.dialogVisible = false;
      let actIndex = await this.noteTabs.findIndex(o=>this.activeObj.id == o.id)
      await this.api_resource.remove(this.activeObj.id)
      await this.getData()
      preId = actIndex>0?this.noteTabs[actIndex-1].id:''
      
      if(preId){
        this.chooseTabs(preId)
        this.$refs['scrollbar'].wrap.scrollTop = this.$refs['scrollbar'].wrap.scrollTop-5
      }

      (actIndex==0 && this.noteTabs.length>0) && this.chooseTabs(this.noteTabs[0].id)

    },
    goScroll(num) {
      this.$refs['scrollbar'].wrap.scrollTop = num
    },
    chooseTabs(id,goTop) {
      this.activeId = id
      this.noteInput = this.activeObj.title || ''
      this.noteTextarea = this.activeObj.text || ''
      
      goTop && this.goScroll(0)
    },
    async changeNote() {
       (this.noteInput!=this.activeObj.title || this.noteTextarea!=this.activeObj.text) && 
        await this.api_resource.update(this.activeObj.id,{title: this.noteInput, text: this.noteTextarea})
        this.getData()
        return
      if(this.isAdd){
        this.getData()
        this.isAdd = false
      }else{
        (this.noteInput!=this.activeObj.title || this.noteTextarea!=this.activeObj.text) && 
        await this.api_resource.update(this.activeObj.id,{title: this.noteInput, text: this.noteTextarea})
        this.getData()
      }
    },
    async addNote() {
      this.isAdd = true
      // let now = dayjs().format('M月D日 HH-mm')
      await this.api_resource.create({title: '新建便利贴', text: ''},{alert:false})
      await this.getData()
      this.chooseTabs(this.noteTabs[0].id, true)
      this.$refs.textarea.focus()
    },
    async getData() {
      this.noteData =  (await this.api_resource.get())
      this.noteData.rows = this.noteData.rows.reverse()
      this.noteTabs = this.noteData.rows
      this.total = this.noteData.total || 0
      this.noteInput = this.activeObj && this.activeObj.title
      this.noteTextarea = this.activeObj && this.activeObj.text
    }
  },
  created() {
    this.getData()
  }
};
</script>

<style lang="scss">
#stickyNote{
  .el-dialog__header{
    padding: 15px 20px;
    background: #F5FAFB;
  }
  .el-dialog__footer{
    padding: 10px 20px;
    border-top: 1px solid #E4EAEC;
  }

  .titleInput{
        .el-input__inner{
            padding: 10px 0 10px 10px;
            border: none;
            border-bottom: 1px solid #F5F5F5;
            font-size: 14px;
        }
    }
   .contentInput{
        padding: 10px 0 0px 10px;
        .el-textarea__inner{
            height: 148px;
            padding: 0;
            border: none;
            font-size: 12px;
        }
    }
}
</style>


<style lang="scss" scoped>
i {
  font-style: normal;
}

#stickyNote {
  .cardName {
    .icon-bianlitie {
      font-size: 16px;
    }
  }

  .container {
    margin-top: 20px;
    .container_head {
      width: 100%;
      height: 40px;
      padding: 0 10px;
      box-sizing: border-box;
      background: #eeca78;
      
      .container_head_l {
        color: #91530c;
        span {
          display: inline-block;
          margin-right: 10px;
          font-size: 14px;
        }
        i {
          font-size: 16px;
          cursor: pointer;
        }
      }
      .container_head_r {
        .icon_reduce,
        .icon_add {
          display: inline-block;
          width: 16px;
          height: 16px;
          background-size: cover;
          cursor: pointer;
        }
        .icon_reduce {
          margin-right: 10px;
          background: url("~@imgs/workbench-img/icon_reduce.png");
        }
        .icon_add {
          background: url("~@imgs/workbench-img/icon_add.png");
        }
      }
    }
    .container_content {
      height: 190px;
      box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
      border-radius: 0px 0px 4px 4px;
      .container_content_l{
        width: 36%;
        height: 100%;
        border-right: 1px solid #E4E4E4;
        box-sizing: border-box;
        .noteTabs{
          width: 100%;
          padding: 9px 10px 0px 10px;
          box-sizing: border-box;
          &>div{
            width: 100%;
            padding-bottom: 9px;
            border-bottom: 1px solid #F5F5F5;
          }
          cursor: pointer;
          &.activeTab{
            background: #F6F5F8;
          }
          .noteName{
            font-size: 12px;
            color: #37474F;
            white-space: nowrap;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .noteTime{
            display: inline-block;
            margin-left: -5px;
            font-size: 12px;
            transform:scale(0.9);
            color: #CCD5DB;
          }
        }
      }
      .container_content_r{
        width: 64%;
      }
    }
  }
  .dialogTxt {
    display: block;
    text-align: center;
    font-size: 16px;
  }
}
</style>
