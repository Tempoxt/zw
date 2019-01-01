<template>
<div class="h-full">
    <!-- <p v-for="i in 20">`123</p> -->
    <el-row :gutter="20" class="h-full">
        <el-col :span="6" class="h-full">
            <div class="menu-list h-full">
                <div class="block-title">权限列表</div>
                <el-menu default-active="2" class="el-menu-vertical-demo">
                    <el-menu-item :index="item" class="menu-item" v-for="item in 4">
                        <div slot="title" class="title">
                            一般人员
                            <div class="actions">
                                <i class="el-icon-edit-outline" @click="edit_menu(...arguments,{})"></i>
                                <i class="el-icon-remove" @click="remove_menu(...arguments,{})"></i>
                            </div>
                        </div>
                    </el-menu-item>
                </el-menu>
                <div class="start-menu-end">
                    <a href="javascript:;" @click="add_menu(...arguments,{})"><i class="el-icon-plus"></i>新增权限</a>
                </div>
            </div>
        </el-col>

        <el-col :span="18" class="h-full">
            <div style="height:calc(100% - 100px)">
                 <el-col :span="12" class="h-full" style="border-right:1px solid #e8e8e8">
                        <div class="block-title">权限列表</div>
                        <el-scrollbar ref="scrollContainer" :vertical="false" class="scroll">
                            <el-tree :data="data2" show-checkbox node-key="id" :default-expanded-keys="[2, 3]" :default-checked-keys="[5]" :props="defaultProps">
                            </el-tree>
                        </el-scrollbar>
                 </el-col>
               <el-col :span="12" class="h-full">
                   <div class="block-title">操作权限</div>

                   <div class="checkbox-wrap">
                       <el-checkbox-group v-model="checkList">
                           <div  v-for="item in 10">
                               <el-checkbox :label="`操作权限${item}`"></el-checkbox>
                           </div>
                            
                        </el-checkbox-group>

                   </div>
                </el-col>

            </div>
            <div class="actions-submit">
                <el-button type="primary">保存权限</el-button>
            </div>
        </el-col>

    </el-row>
</div>
</template>

<style lang="scss" scoped>
@import "./style.scss";
</style>

<script>
export default {
  data() {
    return {
      formLabelAlign: {},
      data2: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1"
                },
                {
                  id: 10,
                  label: "三级 1-1-2"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1"
            },
            {
              id: 8,
              label: "二级 3-2"
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      checkList: []
    };
  }
};
</script>
<style lang="scss" scoped>
.checkbox-wrap {
  /deep/ .el-checkbox {
    color: #76838f;
    font-weight: normal;
  }
}
</style>
