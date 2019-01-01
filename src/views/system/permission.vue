<template>
  <el-row class="h-full">
    <el-col :span="6" class="h-full">
      <div class="page-side h-full">
        <span class="page-title">角色管理</span>
        <div>
          <div class="side-header">
            <el-input placeholder="输入关键字进行过滤" v-model="filterText" class="input">
              <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>

            <el-dropdown>
              <span class="el-dropdown-link">
                <el-button icon="el-icon-plus"></el-button>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>添加分类</el-dropdown-item>
                <el-dropdown-item>添加角色</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <el-tree
            class="filter-tree"
            :data="data2"
            :props="defaultProps"
            default-expand-all
            :filter-node-method="filterNode"
            ref="tree2"
          ></el-tree>
        </div>
      </div>
    </el-col>
    <el-col :span="18">
      <el-tabs v-model="activeName" class="tabs">
        <el-tab-pane label="角色成员分配" name="first">
          <div class="ui-table">
            <div class="header">
              <div class="actions">
                <el-button-group>
                  <el-button type="default" icon="icon iconfont icon-tianjia">
                    <span style="margin-left:4px">添加</span>
                  </el-button>
                  <el-button type="default" icon="icon iconfont icon-sousuo">
                    <span style="margin-left:4px">搜索</span>
                  </el-button>
                  <el-button type="default" icon="icon iconfont icon-renshi">
                    <span style="margin-left:4px">审核</span>
                  </el-button>
                  <el-dropdown
                    style="border-left: 1px solid #e8e8e8;"
                    placement="bottom"
                    size="medium"
                  >
                    <el-button type="default" size="medium">
                      <span style="font-size: 12px;">更多</span>
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown" :split-button="true">
                      <el-dropdown-item>
                        <i class="icon iconfont icon-lajitong" style="padding-right:10px"></i>删除
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <i class="icon iconfont icon-lajitong" style="padding-right:10px"></i>删除
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <i class="icon iconfont icon-lajitong" style="padding-right:10px"></i>删除
                      </el-dropdown-item>
                      <el-dropdown-item>
                        <i class="icon iconfont icon-lajitong" style="padding-right:10px"></i>删除
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-button-group>
              </div>

              <div class="right-actions">
                <div class="right-aciton-item">
                  <el-input
                    placeholder="快速查找"
                    suffix-icon="el-icon-search"
                    v-model="tableData.x"
                    class="actions-input"
                  ></el-input>
                </div>
                <el-button-group class="right-aciton-item">
                  <el-tooltip class="item" effect="dark" content="全屏" placement="bottom">
                    <el-button
                      icon="icon iconfont icon-xingzhuang"
                      size="small"
                      @click="modal11 = !modal11"
                    ></el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="刷新" placement="bottom">
                    <el-button icon="icon iconfont icon-shuaxin" size="small"></el-button>
                  </el-tooltip>

                  <el-tooltip class="item" effect="dark" content="设置列" placement="bottom">
                    <el-button icon="icon iconfont icon-lie" size="small"></el-button>
                  </el-tooltip>
                </el-button-group>
              </div>
            </div>

            <el-table :data="tableData3" height="400" border style="width: 100%">
              <el-table-column prop="date" label="日期" width="180"></el-table-column>
              <el-table-column prop="name" label="姓名" width="180"></el-table-column>
              <el-table-column prop="address" label="地址"></el-table-column>
            </el-table>

            <div class="pagination">
              <el-pagination
                background
                :page-sizes="[100, 200, 300, 400]"
                :page-size="100"
                layout="total, sizes"
                :total="400"
              ></el-pagination>

              <el-pagination
                background
                :page-sizes="[100, 200, 300, 400]"
                :page-size="100"
                layout="prev, pager, next"
                :total="400"
              ></el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="功能权限设置" name="second">功能权限设置</el-tab-pane>
        <el-tab-pane label="数据权限设置" name="third">数据权限设置</el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>
<style lang="scss" scoped>
.page-side {
  padding: 20px;
  border-right: 1px solid #e4eaec;
  .page-title {
    color: #333333;
    font-size: 16px;
    margin-bottom: 10px;
    font-weight: bold;
    display: block;
  }
  .side-header {
    display: flex;
    margin-bottom: 20px;
    .input {
      margin-right: 10px;
      /deep/ input {
        border-radius: 40px;
      }
    }
  }
}

.tabs {
  padding: 0 20px;
  padding-top: 20px;
  /deep/ .el-tabs__nav-wrap {
    &::after {
      background-color: transparent;
    }
  }
  /deep/ .el-tabs__item {
    font-weight: normal;
  }
}
</style>

<script>
export default {
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    }
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    }
  },

  data() {
    return {
      modal11: false,
      activeName: "first",
      tableData: {},
      filterText: "",
      tableData3: [
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        }
      ],
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
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.ui-table {
  width: 100%;
  height: 100%;
  // padding-top: 30px;
  .table-top {
    display: flex;
    justify-content: space-between;
    padding: 20px;
  }
  .header {
    display: flex;
    justify-content: space-between;
    // padding: 0 20px;
    margin-bottom: 10px;
    .actions {
      display: flex;
      .more {
        margin-left: 10px;
      }
    }
    .right-actions {
      display: flex;
      .right-aciton-item {
        cursor: pointer;
        margin-left: 20px;
      }
      .actions-input {
        /deep/ input {
          border-radius: 20px;
        }
      }
    }
  }

  .pagination {
    display: flex;
    justify-content: space-between;
    padding: 20px 0;
  }
}
</style>
