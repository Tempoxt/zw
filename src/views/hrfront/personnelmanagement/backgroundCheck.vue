<template>
    <div id="backgroundCheck">
        <ui-table ref="table" 
            :table_column="table_field" 
            :table_query.sync="table_form.query"
            @query="querySubmit"
            >

            <table-header
                :table_actions="table_actions"
                :table_selectedRows="table_selectedRows"
                @action="handleAction"
                :table_form.sync="table_form"
                :table_column="table_field"
            >
            </table-header>
            <el-table
                ref="elTable"
                @selection-change="handleChangeSelection"
                :data="table_data"
                border
                style="width: 100%"
                v-loading="table_loading"
                :header-cell-style="headerCellStyle"
                :height="table_height"
                @header-dragend="table_dragend"
                @sort-change="table_sort_change"
                >
                <el-table-column 
                    type="selection" 
                    width="60" 
                    class-name="table-column-disabled"
                    :selectable="table_disable_selected"
                    >
                </el-table-column>
                <el-table-column type="index" :index="indexMethod" />
                
    
                <el-table-column fixed prop="name" label="姓名"/>
                <el-table-column fixed prop="department" label="应聘部门"/>
                <el-table-column fixed prop="job" label="应聘岗位"/>
                <el-table-column fixed prop="census" label="户籍"/>
                <el-table-column fixed prop="idCard" label="身份证号"/>
                <el-table-column fixed prop="age" label="年龄"/>
                <el-table-column fixed prop="sex" label="性别"/>

                <each-table-column :table_field="table_field.filter(o=>!['name','department','job','census','idCard','age','sex','annexUrl','signature','idCardPositive','idCardReverse'].includes(o.name))" :template="template"/>
                
                <el-table-column prop="annexUrl" label="身份证正面">
                    <template slot-scope="scope">
                        <el-button type="text" @click="lookImg(scope.row.idCardPositive)">查看附件</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="annexUrl" label="身份证反面">
                    <template slot-scope="scope">
                        <el-button type="text" @click="lookImg(scope.row.idCardReverse)">查看附件</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="annexUrl" label="证明资料附件">
                    <template slot-scope="scope">
                        <el-button type="text" @click="lookImg(scope.row.annexUrl)">查看附件</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="signature" label="签名附件">
                    <template slot-scope="scope">
                        <el-button type="text" @click="lookImg(scope.row.signature)">查看附件</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <table-pagination 
                :total="table_form.total" 
                :pagesize.sync="table_form.pagesize"
                :currentpage.sync="table_form.currentpage"
                @change="fetchTableData"
                :table_config="table_config"
            />

        </ui-table>
        
    </div>
</template>

<script>
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";
import dayjs from 'dayjs'

export default {
    mixins: [table_mixin],
    name: 'backgroundCheck',
    data() {
        return {
            table_loading: false,
            api_resource: api_common.resource("hrm/backgroundCheck"),
            template:{
                
            }
        }
    },
    computed: {
        table_height(){ 
            return (this.window_innerHeight||window.innerHeight) - 220
        },
    },
    methods: {
        async fetchTableData() {
			this.table_loading = true;
			const {rows , total }= await this.api_resource.get(this.table_form);
			this.table_data  = rows
			this.table_form.total = total
			setTimeout(() => {
				this.table_loading = false;
			}, 300);
        },
        lookImg(url) {
            let urls = url.split(';')
           
            urls.forEach(o=>{
                window.open(process.env.VUE_APP_STATIC+o.replace('.tencent','.png').replace('.android','.png'))
            })
            
            
        }
        
    },
    async created() {
		const { field, action,table } = await api_common.menuInit("hrm/backgroundCheck");
		this.table_field = field;
		this.table_actions = action;
		this.table_config = table
		this.$set(this.table_form,'dateLap',dayjs().format('YYYY-MM'))
        this.fetchTableData();
        
    },
    
    
}
</script>

<style lang="scss" scoped>
#backgroundCheck{

}
</style>