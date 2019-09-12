<template>
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
            <div style="padding-left:10px">
                <dateLap v-model="table_form.dateLap" @change="fetch"/>
            </div>
        </table-header>
        <el-table
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
            <el-table-column type="index" :index="indexMethod"/>
            <each-table-column :table_field="table_field"/>
        </el-table>
        <table-pagination 
            :total="table_form.total" 
            :pagesize.sync="table_form.pagesize"
            :currentpage.sync="table_form.currentpage"
            @change="fetchTableData"
            :table_config="table_config"
        />
  </ui-table>
</template>
<script>
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";
import dayjs from 'dayjs'
import { MessageBox } from 'element-ui';
const api_resource = api_common.resource("standardcost/record");
export default {
    mixins: [table_mixin],
    data() {
        return {
            loading: false,
            form:{},
            api_resource,
            queryDialogFormVisible:true,
            // table_topHeight:296,
            importUploadUrl:"/standardcost",
			timer:'',
			statusk:1,
			val:'',
			s:1
        };
    },
    methods: {
        import(){
			let {
				handleImportChange,
			} = this
            MessageBox.alert(
                <el-button-group class="table-import-upload" ref="import">
                    <el-button type="primary" onClick={()=>{}}>选择文件</el-button>
                    <input type="file" ref="input" class="input" on-change={handleImportChange} ref="importInput"></input>
                </el-button-group>
                , '选择文件导入', {
                showConfirmButton:false,
                center:true
            });
		},
		async handleImportChange(ev){
			const files = ev.target.files;
			if (!files) return;
			var form = new FormData();
			form.append('the_file',files[0])
			this.importLoading = true
			MessageBox.close()
			MessageBox.alert(
				<div v-loading={true}><br /></div>, '导入中', {
				showConfirmButton:false,
				center:true
			});
			try {
				const mes = await this.$request.post(this.importUploadUrl,form,{alert:false})
				this.statusk = 1
				this.$message({
					message: mes,
					type: 'success'
				});
				this.timer = setInterval(()=>{
					this.getDa()
					this.s++;
				},10000)
			} catch (error) {
				console.log(error)
				this.$message.error({dangerouslyUseHTMLString: true,message:error.response.data,duration:5000})
			}finally{
				this.importLoading = false
				MessageBox.close()
				this.$nextTick(()=>{
					ev.target.value = null
				})
			}
    	},
		async getDa(){
			if(this.statusk!=0&&this.s<=6){
				if(this.s==6){
					this.$message.error({ message: '导入失败,请重试'})
				}
				this.val = await this.$request.get('/standardcost',{alert:false})
				this.statusk = 0
				this.$message.success({ message: this.val,duration:3000})
				this.fetchTableData()
			}else{
				clearInterval(this.timer)
				this.s=0
			}
		},
        fetch(){
            this.table_form.currentpage = 1
            this.fetchTableData()
        },
        async fetchTableData() {
            this.table_loading = true;
            const {rows , total }= await api_resource.get(this.table_form);
            this.table_data  = rows
            this.table_form.total = total
            setTimeout(() => {
                this.table_loading = false;
            }, 300);
        },
    },
    async created() {
        const { field, action,table } = await api_common.menuInit("standardcost/record");
        this.table_field = field;
        this.table_actions = action;
        this.table_config = table
        console.log(this.table_config)
        this.fetchTableData();
        this.table_form.dateLap = dayjs().format('YYYY-MM')
    }
};
</script>