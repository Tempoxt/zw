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
                        <el-radio @change="update" v-model="filterfield" :label="field.id">{{field.showname}}</el-radio>
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
                <div v-for="i in [{label:'本部门及下属部门',value:4},{label:'本部门',value:3},{label:'本人相关',value:2}]" :key="i.value"  class="cell">
                    <el-radio :label="i.value">{{i.label}}</el-radio>
                </div>
            </el-radio-group>
            <!-- 选择跨部门 -->
            <div class="action-bottom">
                <el-radio :label="100" v-model="orgDepart" @change="showDepart">跨部门</el-radio>
            </div>
            <div class="org-tree" v-if="orgDepart==100">
                <el-tree
                    :data="orgData"
                    show-checkbox
                    node-key="orgid"
                    @node-click="orgClick"
                    ref="tree"
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
            // const [ {},{sub:roles_menu} ] = await api_roles_menu.find(this.roleid)
            this.roles_menu_checked = []
            // ;(function f(roles_menu_checked,roles_menu){
            //     roles_menu.forEach((item)=>{
            //         if(item.haspermission){
            //              roles_menu_checked.push(item.id)
            //         }
            //         if(item.sub&&item.sub.length){
            //             f(roles_menu_checked,item.sub)
            //         }
            //     })
            // })(this.roles_menu_checked,roles_menu)
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
            // console.log(this.roles_menu_checked,'roles_menu_checked')
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
            // this.$refs.tree.setCurrentKey(currentKey)
            await this.nodeClick({id:currentKey})
            this.$refs.tree.setCurrentKey(currentKey)
            this.roles_menu_checked_default = [currentKey]
        },
        async nodeClick({id}){
            this.currentMenuId = id
            const { fields,actions,data,filterfield }  = await api_roles_auth.find(this.roleid,{
                menuid:id
            })
            this.fields = fields
            this.actions = actions
            this.checkedActions = this.actions.filter(item=>item.haspermission).map(item=>item.id)
            this.data = data
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
            this.orgData = await this.$request.get('org/tree')
        },
        async orgClick({id}){
            
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
            this.depts = orgList.join(',')
            console.log(this.depts,'dsdsds')
            this.data = 5
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
            depts:''
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
</style>
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
