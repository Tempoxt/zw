<template>
    <el-row :gutter="40" class="row">
        <el-col :span="6" class="col" style="overflow-y: scroll;">
            <div class="label">
                菜单权限
            </div>
            <el-radio-group v-model="menuType">
                <el-radio-button label="1">前台</el-radio-button>
                <el-radio-button label="2">后台</el-radio-button>
            </el-radio-group>
            <div>
                <el-tree
                :data="menu"
                show-checkbox
                node-key="id"
                @node-click="nodeClick"
                ref="tree"
                :default-expanded-keys="roles_menu_checked_default"
                :default-checked-keys="roles_menu_checked"
                @check="treeNodeCheck"
                :highlight-current="true"
                accordion
                :props="defaultProps">
                </el-tree>
            </div>
        </el-col>
        <el-col :span="4"  class="col bg-gray"  style="overflow-y: scroll;">
            <div class="label">
                操作权限
            </div>
            <div>
                <div class="action-top">
                    <!-- <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" >全选</el-checkbox> -->
                    <el-button size="mini" round plain @click="checkAll">全选</el-button>
                </div>
                <el-checkbox-group v-model="checkedActions" @change="update">
                    <div v-for="action in actions" :key="action.id" class="cell">
                        <el-checkbox  :label="action.id" > <span :class="action.icon"></span> &nbsp;{{action.name}}</el-checkbox>
                    </div>
                </el-checkbox-group>
            </div>
        </el-col>
        <el-col :span="8"  class="col bg-gray" style="overflow-y: scroll;">
             <div class="label">
                字段权限
            </div>
             <div class="action-top">
                   <el-row >
                    <el-col :span="9">
                        <span>全选</span>
                    </el-col>
                    <el-col :span="5">
                            <el-button size="mini" round plain @click="all(2)">读写</el-button>
                    </el-col>
                    <el-col :span="5">
                        <el-button size="mini" plain round @click="all(1)">只读</el-button>
                    </el-col>
                    <el-col :span="5">
                        <el-button size="mini" plain round @click="all(0)">不可见</el-button>
                    </el-col>
                </el-row>
                </div>
            <div>
                <el-row  class="cell" v-for="field in fields" :key="field.id">
                    <el-col :span="9">
                        <el-radio @change="update" :label="field.id">{{field.showname}}</el-radio>
                    </el-col>
                    <el-col :span="5">
                        <el-radio v-model="field.haspermission" :label="2" @change="update">读写</el-radio>
                    </el-col>
                    <el-col :span="5">
                        <el-radio v-model="field.haspermission" :label="1" @change="update">只读</el-radio>
                    </el-col>
                    <el-col :span="5">
                        <el-radio v-model="field.haspermission" :label="0" @change="update">不可见</el-radio>
                    </el-col>
                </el-row>
            </div>
        </el-col>
        <el-col :span="6"  class="col bg-gray-2"  style="overflow-y: scroll;">
            <div class="label">
                数据范围
            </div>
            <div class="action-top">
                <el-radio :label="1" v-model="data" @change="update">全部</el-radio>
            </div>
            <el-radio-group v-model="data" @change="update" style="margin-top: 12px;">
                <div v-for="i in [{label:'本部门及下属部门',value:2},{label:'本部门',value:3},{label:'本人相关',value:4}]" :key="i.value"  class="cell flex">
                    <el-radio :label="i.value">{{i.label}}</el-radio>
                        <div v-if="i.value==4" class="flex">
                            <el-input size="mini" placeholder="请输入内容" v-model="filterfield" @blur="update" class="input-with-select appendIn" :disabled="data!=4"></el-input>
                            <!-- <el-button type="primary" class="append" size="mini" :disabled="i.value!=2">确定</el-button> -->
                        </div>
                </div>
            </el-radio-group>
            <!-- 选择跨部门 -->
            <div class="action-bottom">
                <el-checkbox :label="100" v-model="crossDepart" @change="showDepart">跨部门</el-checkbox>
            </div>
            <div class="org-tree" v-show="crossDepart==true">
                <el-tree
                    :data="orgData"
                    show-checkbox
                    node-key="orgid"
                    ref="tree1"
                    :default-expanded-keys="org_menu_checked_default"
                    :default-checked-keys="org_menu_checked"
                    @check="orgNodeCheck"
                    :highlight-current="true"
                    accordion
                    :props="defaultPropsorg">
                </el-tree>
            </div>
        </el-col>
    </el-row>
</template>
<script>
import * as api_common from '@/api/common'
const api_roles_menu = api_common.resource('roles/rolepermissionmenu')
const api_menu = api_common.resource('menusheet/menutree/0')
const api_roles_auth = api_common.resource('roles/rolepermisson')
import { throttle } from 'core-decorators';
  export default {
    props:['roleid'],
    watch:{
        roleid:{
            handler(id){
               this.roleid = id
               this.fetchData()
            },
            immediate:true
        },
        menuType(){
            this.getMenu()
        }
    },
    methods:{
        async getMenu(){
            const { menu } =  await api_common.resource('roles/rolepermissionmenu/'+this.roleid).get({position:this.menuType,power:0})
            this.menu = menu
            this.roles_menu_checked = []
            ;(function f(roles_menu_checked,roles_menu){
                roles_menu.forEach((item)=>{
                    if(item.haspermission==1){
                        roles_menu_checked.push(item.id)
                    }
                
                    if(item.sub&&item.sub.length){
                        f(roles_menu_checked,item.sub)
                    }
                })
            })(this.roles_menu_checked,menu)
            let currentKey = ''
            ;(function f(data){
                data.some(item=>{
                    if(item.menutype === 2){
                        currentKey = item.id 
                        return true
                    }else{
                        if(item.sub && item.sub.length){
                            f(item.sub)
                        }
                    }
                })
            })(roles_menu)
            this.$refs.tree.setCurrentKey(currentKey)
            await this.nodeClick({id:currentKey})
            this.$refs.tree.setCurrentKey(currentKey)
            this.roles_menu_checked_default = [currentKey]
        },
        async nodeClick({id}){
            
            this.orgDepart = 0
            this.currentMenuId = id
            const { fields,actions,data,filterfield,depts }  = await api_roles_auth.find(this.roleid,{
                menuid:id
            })
            this.fields = fields
            this.actions = actions
            this.checkedActions = this.actions.filter(item=>item.haspermission).map(item=>item.id)
            this.data = data
          
            this.org_menu_checked_default = depts
            this.org_menu_checked = depts
            this.depts = depts
            if(depts.length!=0&&depts[0]!=='0'){
                this.crossDepart = true
                this.showDepart()
            }else{
                this.crossDepart = false
            }
        
            this.filterfield = filterfield
            return
        },
        treeNodeCheck(data,{checkedKeys}){
           let checkList = [ data.id ]
           const estate = this.$refs.tree.getCheckedKeys().indexOf(data.id) !==-1 ? 1: 0
            ;(function f(sub){
                sub.forEach(item=>{
                checkList.push(item.id)
                })
                if(sub.sub&&sub.sub.length){
                    f(sub.sub)
                }
            })(data.sub||[])
            checkList.forEach((menuid)=>{
                api_roles_menu.update(this.roleid,{ menuid, estate })
            })
        },
        async showDepart(){
            if(this.crossDepart==true){
                this.orgData = await this.$request.get('org/tree')
            }else{
                this.depts = ''
                this.update()
            }
        },
        orgNodeCheck(data,{checkedKeys}){
            let orgList = [ data.orgid ]
            ;(function f(subs){
                subs.forEach(item=>{
                    orgList.push(item.orgid)
                })
                if(subs.subs&&subs.subs.length){
                    f(subs.subs)
                }
            })(data.subs||[])
            this.depts = checkedKeys.join(',')
            if(checkedKeys.length==0){
                this.depts = ''
            }
            this.update()
        },
        async fetchData(){
            //  const loading = this.$loading({
            //     lock: true,
            //     text: 'Loading',
            //     spinner: 'el-icon-loading',
            // });
            try {
                await this.getMenu();
            } catch (error) {
                
            }finally{
                setTimeout(()=>{
                    // loading.close();
                },300)
            }
        },
        checkAll(){
            this.checkedActions = this.actions.map(item=>item.id)
            this.update()
        },
        @throttle(1000, {leading: false})
        update(){
            if(this.filterfield==''){
                this.filterfield = 'creator'
            }
            api_roles_auth.update(this.roleid,{
                data:this.data,
                menuid:this.currentMenuId,
                actions:this.checkedActions,
                fields:this.fields.map(item=>(`${item['id']}:${item.haspermission}`)),
                filterfield:this.filterfield,
                depts:this.depts
            })
        },
        all(state){
            this.fields.forEach(item=>{
                item.haspermission = state
            })
            this.update()
        }
    },
    data() {
        return {
            checkedActions: [],
            isIndeterminate: true,
            radio:'',
            radio2:'',
            menuType:'1',
            menu:[],
            orgData:[],
            defaultProps: {
                children: 'sub',
                label: 'name'
            },
            defaultPropsorg: {
                children: 'subs',
                label: 'name'
            },
            roles_menu_checked:[],
            roles_menu_checked_default:[],
            org_menu_checked:[],
            org_menu_checked_default:[],
            fields:[],
            actions:[],
            data:0,
            filterfield:'',
            orgDepart:'',
            depts:[],
            crossDepart:false
        };
    }
  };
</script>
<style lang="scss">
    .org-tree .el-tree{
        .el-tree-node__label{
            font-size: 12px;
        }
    }
    .flex{
        display: flex;
        align-items: center
    }
    .appendIn{
        width: 66%;
        height: 26px;
        line-height: 26px;
        .el-input__inner{
            height: 26px;
            line-height: 26px;
        }
    }
    .append{
        height: 26px;
        box-sizing: border-box;
        // line-height: 26px;
        text-align: center;
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
        span{
            margin-left: -11px;
        }
    }
</style>
<style lang="scss" scoped>
.append{
    height: 26px;
    width: 30px;
    text-align: center;
    span{
        margin-left: -7px;
    }
}
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
            padding-left: 40px !important;
        }
    }
}
.cell {
    margin-bottom: 20px;
}
.action-top {
    border-bottom: 1px solid #e8e8e8;
    padding:10px 0;
    margin-bottom: 10px;
}
.action-bottom {
    border-top: 1px solid #e8e8e8;
    padding:10px 0;
}
.bg-gray {
    background: #EBF6F8
}
.bg-gray-2 {
    background: #DDECEF
}
.org-tree .el-tree{
    background: transparent;
}
</style>
