  <template>
  <ui-table ref="table" 
	:table_column="table_field" 
	:table_query.sync="table_form.query"
	@query="querySubmit"
  class="mini-table"
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
	<vxe-table
      class="public-vxe-table"  
      ref="elTable"
      resizable
      show-overflow
      highlight-hover-row
      @select-all="handleChangeSelection"
      @select-change="handleChangeSelection"
      :data="table_data"
      border
      style="width: 100%"
      v-loading="table_loading"
      :header-cell-style="vxeHeaderStyle"
      :height="table_height"
      @resizable-change="table_dragend"
      @sort-change="table_sort_change"
      	:cell-class-name="cellClassName"
	  :seq-config="{seqMethod: VxeIndexMethod}"
      
    >
      <vxe-table-column 
        type="selection" 
        width="60" 
        class-name="table-column-disabled"
        :selectable="table_disable_selected"
        >
      </vxe-table-column>
      <vxe-table-column type="index" width="50" fixed/>
      <vxe-table-column v-for="field in table_field.filter(column=>!column.fed_isvisiable).filter(column=>!column.isvisiable)" :key="field.name"
		   :field="field.name" :title="field.showname" :width="field.width=='auto'?'': parseInt(field.width)" :sortable="field.issort" />
    </vxe-table>
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
const api_pagemanager = api_common.resource('pagemanager/field')
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";
const api_resource = api_common.resource("attendance/refakelist");
import dayjs from 'dayjs'
import { setInterval, clearInterval } from 'timers';
let baseUrl = process.env.VUE_APP_STATIC
let baseUri = process.env.VUE_APP_BASEAPI
const download = require('downloadjs')
export default {
	mixins: [table_mixin],
	props:['id'],
	data() {
		return {
			vxeHeaderStyle:{background:'#F5FAFB',color:'#37474F'},
			baseUrl,
			baseUri,
			loading: true,
			api_resource,
			queryDialogFormVisible:true,
            table_topHeight:230,
			importUploadUrl:"/attendance/record",
			timer:'',
			url:'',
			statusk:1
		};
	},
	watch:{
		id(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		}
	},
	methods: {
		cellClassName ({ row, column }) {
			if(row.Remark!=''&&row.Remark!=null){
          		return 'col-red'
        	}else if(column.title=="星期"){
          		if(row.weekday=='六'||row.weekday=='日'){
            		return 'col-bag-gray'
          		}
        	}else if(column.title=="假日"){
          		if(row.RestType=='1'){
            		return 'col-bag-one'
          		}else if(row.RestType=='2'){
					return 'col-bag-two'
				}else if(row.RestType=='3'){
					return 'col-bag-three'
				}else if(row.RestType=='4'){
					return 'col-bag-four'
				}else if(row.RestType=='5'){
					return 'col-bag-four'
				}else if(row.RestType=='6'){
					return 'col-bag-six'
				}else if(row.RestType=='9'){
					return 'col-bag-nine'
				}else if(row.RestType=='10'){
					return 'col-bag-ten'
				}
        	}
		},
		async getUrl(){
			if(this.statusk!=0){
				try{
					this.url = await this.$request.get('/attendance/refakelist/exportresult',{alert:false})
					if(this.url!=''){
						const res = download(baseUri+'/'+this.url)
						this.statusk = 0
					}
				}catch(err){
					// clearInterval(this.timer)
				}
			}else{
				clearInterval(this.timer)
			}
		},
		ab2str(u,f) {
			var b = new Blob([u]);
			var r = new FileReader();
			r.readAsText(b, 'utf-8');
			r.onload = function (){if(f)f.call(null,r.result)}
		},
		async download(){
			this.statusk = 1
			if(this.timer!=''){
				clearInterval(this.timer)
			}
			try{
				const { data,name,contentType} =  await this.api_resource.export(this.table_form,{
					responseType:'arraybuffer'
				})
				var that = this
				this.ab2str(data,function(str){
					that.$message.success({ message: str,duration:5000});
				});
				this.timer = setInterval(()=>{
					this.getUrl()
				}, 10000)
			}catch(err){
				console.log(err)
			}
		},
		fetch(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
		async fetchTableData() {
			if(!this.id){
				return
			}
			this.table_loading = true;
			this.table_form.org_id = this.id
			this.table_form.sheetType = 2
			const {rows , total }= await api_resource.get(this.table_form);
			this.table_data  = rows
			this.table_form.total = total
			setTimeout(() => {
				this.table_loading = false;
			}, 300);
		},
	},
	async created() {
		const { field, action,table } = await api_common.menuInit("attendance/refakelist");
		this.table_field = field;
		this.table_actions = action;
		this.table_config = table
		this.table_form.dateLap = dayjs().format('YYYY-MM')
		this.fetchTableData();
	}
};
</script>


