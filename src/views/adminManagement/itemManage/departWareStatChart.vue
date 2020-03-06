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
        </table-header>
        <div class="outside">
            <div class="dashboard">
                <el-scrollbar
                    wrap-class="scrollbar-wrapper"
                    class="scroll"
                    style="padding-bottom:30px"
                >
                    <el-row class="elCol" v-if="allData.length!=0">
                        <el-col :span="12" class="relative" v-for="item in allData" :key="item.id">
                            <lineChart
                                ref="echart12"
                                :show="checkFullshow"
                                screenIndex="12"
                                :id="item.id"
                                :datas="item"
                                :color="['#0BB2D4', '#F2353C', '#1FD361']"
                            ></lineChart>
                            <dateLap
                                :disabled="true"
                                class="dateLap"
                                width="140px"
                                itemsD="1"
                                v-model="item.dateLap"
                                @change="getCurrChart(item)"
                            />
                        </el-col>
                    </el-row>
                </el-scrollbar>
            </div>
        </div>
    </ui-table>
</template>
<script>
import dateLap from "@/components/Table/DateLap";
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";
import dayjs from 'dayjs'
const api_resource = api_common.resource("toolstationery/departledger/chartstat");
import lineChart from './lineChart'
export default {
    name:'departWareStatChart',
    mixins: [table_mixin],
    props:['org'],
    components:{
        lineChart,
        dateLap,
    },
    data() {
        return {
            api_resource,
            dateLap6: dayjs().subtract(1,'month').format('YYYY-MM'),
            allData: [],
            formData: {},
            checkFullshow: true,
            fullscreenLoading: false
        };
    },
    watch:{
        org(){
            if(this.org.orgid.indexOf('s') !=-1 || this.org.parent_org.indexOf('s') !=-1){
                return 
            }
            this.fetchTableData()
        },
    },
    methods: {
        async getCurrChart(item){
            let itemCurr = await this.$request.get('toolstationery/departledger/chartstat',{params:{
                materialCode: item.material_code,
                dateLap: item.dateLap,
                orgid: this.org.orgid
            }})
            if(itemCurr.length!=0){
                this.allData.forEach(o=>{
                    if(o.material_code == itemCurr[0].material_code){
                        this.$set(o,'grant_number',itemCurr[0].grant_number)
                        this.$set(o,'month_range',itemCurr[0].month_range)
                        this.$set(o,'purchase_number',itemCurr[0].purchase_number)
                        this.$set(o,'stock_number',itemCurr[0].stock_number)
                    }
                })
            }else{

            }
        },
		fetch(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
        async fetchTableData() {
            if(this.org.orgid.indexOf('s') !=-1 || this.org.parent_org.indexOf('s') !=-1){
                return 
            }
            this.formData.orgid  = this.org.orgid
            this.formData.quicksearch = this.table_form.quicksearch
            this.formData.keyword = this.table_form.keyword
            this.allData = await api_resource.get(this.formData);
            this.allData.forEach(o=>{
                this.$set(o,'dateLap',dayjs().subtract(1,'month').format('YYYY-MM') )
            })
        }
    },
    async mounted(){
		this.formData.dateLap = dayjs().subtract(1,'month').format('YYYY-MM') 
        this.fetchTableData();
    },
    async created() {
        const { field, action,table } = await api_common.menuInit("toolstationery/departledger/chartstat");
        this.table_field = field;
        this.table_actions = action;
        this.table_config = table
    },
};
</script>

<style lang="scss">
.outside {
    height: 780px;
    background: #f5fafb;
    
    .elCol{
        .el-card__body{
            padding: 0 0 0 20px;
        }
    }
}
.maxheight {
  height: 500px;
}

</style>
<style lang="scss" scoped>
.outside{
	.el-row .el-col:nth-child(2n){
		padding-left: 10px;
	}

    .box-card {
        width: 100%;
        margin-top: 10px;
        padding-top: 15px;
        .box-card-c.box-card-c2 {
            height: 100%;
        }
        .box-card-c {
            height: 350px;
        }
    }
    .scroll {
        height: calc(100% - 30px);
        width: 100%;
        /deep/ .scrollbar-wrapper {
            overflow-x: hidden;
        }
    }
    .dashboard {
        background: #f5fafb;
        height: 100%;
        padding: 20px;
        .selectdate {
            display: inline-block;
            margin-left: 60px;
        }
        .padding-left-10 {
            padding-left: 10px;
        }
        .speech-mode {
            position: fixed;
            top: 0;
            left: 0;
            margin-top: 0;
            z-index: 99;
            width: 100%;
            height: 100%;
        }
        .dateLap {
            position: absolute;
            top: 23px;
            right: 17px;
        }
        .relative {
            position: relative;
        }
    }
}
</style>