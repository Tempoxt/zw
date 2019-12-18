<template>
    <div>
        222222
    </div>
</template>
<script>
import * as api_common from "@/api/common";
import table_mixin from "@c/Table/table_mixin";
const api_resource = api_common.resource("toolstationery/personledger");
let baseUrl = process.env.VUE_APP_STATIC
export default {
    mixins: [table_mixin],
    props:['orgid','m','url'],
    data() {
        return {
            baseUrl,
            loading: false,
            api_resource,
        };
    },
    watch:{
        orgid(){
            this.table_form.currentpage = 1
            this.fetchTableData()
        },
    },
    methods: {
		fetch(){
			this.table_form.currentpage = 1
			this.fetchTableData()
		},
        async fetchTableData() {
            if(this.orgid==''){
                return 
            }
            this.table_loading = true;
            this.table_form.org_id  = this.orgid
            const {rows , total }= await api_resource.get(this.table_form);
            this.table_data  = rows
            this.table_form.total = total
            setTimeout(() => {
                this.table_loading = false;
            }, 300);
        },
    },
    async created() {
        this.fetchTableData();
    },
};
</script>