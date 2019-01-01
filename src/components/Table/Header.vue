<template>
  <div class="header">
    <div class="actions">
      <el-button-group>
        <el-button
          type="default"
          v-for="action in table_actions.slice(0,table_actions_morelen)"
          :icon="action.icon || 'icon iconfont icon-tianjia'"
          :key="action.id"
          @click="handleAction(action.code,action)"
          :disabled="!isDisabled(action.code)"
        >
          <span style="margin-left:4px">{{action.name}}</span>
        </el-button>

        <el-dropdown
          style="border-left: 1px solid #e8e8e8;"
          placement="bottom"
          size="medium"
          v-if="table_actions[table_actions_morelen]"
        >
          <el-button type="default" style="border-left: 0;">
            <span style="font-size: 12px;">更多</span>
            <i class="el-icon-arrow-down el-icon--right" style="font-size: 14px"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown" :split-button="true">
            <el-dropdown-item
              v-for="action in table_actions.slice(table_actions_morelen,table_actions.length)"
              :key="action.id"
              @click.native="handleAction(action.code,action)"
            >
              <i :class="action.icon" style="padding-right:10px;margin-right:-10px"></i>
              {{action.name}}
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
          v-model="form.x"
          class="actions-input"
        ></el-input>
      </div>
      <el-button-group class="right-aciton-item">
        <el-tooltip class="item" effect="dark" content="全屏" placement="bottom">
          <el-button
            icon="icon iconfont icon-xingzhuang"
            size="small"
            @click="handleAction('toggleModal')"
          ></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="刷新" placement="bottom">
          <el-button
            icon="icon iconfont icon-shuaxin"
            size="small"
            @click="handleAction('fetchTableData')"
          ></el-button>
        </el-tooltip>

        <el-tooltip class="item" effect="dark" content="设置列" placement="bottom">
          <el-button icon="icon iconfont icon-lie" size="small"></el-button>
        </el-tooltip>
      </el-button-group>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    table_actions: Array,
    table_selectedRows: Array
  },
  computed: {
    isDisabled() {
      let len = this.table_selectedRows.length;
      return function(code) {
        if (code === "edit") {
          return len === 1;
        }
        if (code === "delete") {
          return len >= 1;
        }
        return true;
      };
    }
  },
  data() {
    return {
      table_actions_morelen: 4,
      form: {}
    };
  },
  methods: {
    handleAction(action) {
      this.$emit("action", action);
    }
  }
};
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
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
</style>
