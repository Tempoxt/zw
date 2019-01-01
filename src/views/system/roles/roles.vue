<template>
    <el-row :gutter="20" class="row">
        <el-col :span="6" class="col">
            <div class="label">
                菜单权限
            </div>
            <div>
                <el-tree
                :data="data2"
                show-checkbox
                node-key="id"
                :default-expanded-keys="[2, 3]"
                :default-checked-keys="[5]"
                :props="defaultProps">
                </el-tree>
            </div>
        </el-col>
        <el-col :span="6"  class="col">
            <div class="label">
                操作权限
            </div>
            <div>
                <div class="action-top">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" >全选</el-checkbox>
                </div>
                <el-checkbox-group v-model="checkedCities">
                    <div v-for="city in cities" :key="city" class="cell">
                        <el-checkbox  :label="city" >{{city}}</el-checkbox>
                    </div>
                </el-checkbox-group>
            </div>
        </el-col>
        <el-col :span="6"  class="col">
             <div class="label">
                字段权限
            </div>
             <div class="action-top">
                   <el-row >
                    <el-col :span="9">
                        <span>全选</span>
                    </el-col>
                    <el-col :span="5">
                            <el-radio v-model="radio" label="1">读写</el-radio>
                    </el-col>
                    <el-col :span="5">
                        <el-radio v-model="radio" label="1">只读</el-radio>
                    </el-col>
                    <el-col :span="5">
                        <el-radio v-model="radio" label="1">不可见</el-radio>
                    </el-col>
                </el-row>
                </div>
            <div>
                <el-row  class="cell">
                    <el-col :span="9">
                        <span>姓名</span>
                    </el-col>
                    <el-col :span="5">
                            <el-radio v-model="radio" label="1">读写</el-radio>
                    </el-col>
                    <el-col :span="5">
                        <el-radio v-model="radio" label="1">只读</el-radio>
                    </el-col>
                    <el-col :span="5">
                        <el-radio v-model="radio" label="1">不可见</el-radio>
                    </el-col>
                </el-row>
            <el-row  class="cell">
                <el-col :span="9">
                    <span>姓名</span>
                </el-col>
                <el-col :span="5">
                        <el-radio v-model="radio" label="1">读写</el-radio>
                </el-col>
                <el-col :span="5">
                    <el-radio v-model="radio" label="1">只读</el-radio>
                </el-col>
                <el-col :span="5">
                    <el-radio v-model="radio" label="1">不可见</el-radio>
                </el-col>
            </el-row>
            </div>
        </el-col>
        <el-col :span="6"  class="col">

            <div class="label">
                数据范围
            </div>
             <el-radio-group v-model="radio2">
                 <div v-for="i in 6" :key="i"  class="cell">
                     <el-radio :label="3">备选项</el-radio>
                 </div>
            </el-radio-group>
        </el-col>
        </el-row>
</template>
<script>
const cityOptions = ['上海', '北京', '广州', '深圳'];
  export default {
    data() {
      return {
          checkAll: false,
        checkedCities: ['上海', '北京'],
        cities: cityOptions,
        isIndeterminate: true,
        radio:'',
        radio2:'',
        data2: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    }
  };
</script>
<style lang="scss" scoped>
.label {
    font-size:16px;
    font-weight:600;
    padding: 20px 0px;
}
.row {
    height: 100%;
    .col {
        border-right: 1px solid #e8e8ee;
        height: 100%;
        &:first-child{
            padding-left: 20px !important;
        }
        
    }
}
.cell {
    margin-bottom: 10px;
}
.action-top {
    border-bottom: 1px solid #e8e8e8;
    padding:10px 0;
    margin-bottom: 10px;
}
</style>
