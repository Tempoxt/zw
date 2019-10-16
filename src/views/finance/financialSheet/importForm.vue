<template>
    <!-- <el-dialog
        title="请选择"
        :visible.sync="dialogFormVisible"
        class="public-dialog"
        v-el-drag-dialog  
        > -->
        <div>
            <el-date-picker
                v-model="dateLap"
                :clearable="false"
                type="month"
                size="small"
                format="yyyy年MM月"
                value-format="yyyy-MM"
                placeholder="选择月份">
            </el-date-picker>
            <br/>
            <el-button-group class="table-import-upload" ref="import" style="margin-top:25px;">
                <el-button type="primary" @click="()=>{}" :disabled="this.dateLap==''">选择文件</el-button>
                <input type="file" ref="input" class="input" @change="handleImportChange"/>
                <el-button type="" v-if="this.downloadUrl!=''&&this.downloadUrl!=undefined" style="margin-left:20px" @click="handleDownloadChange">下载模板</el-button>
            </el-button-group>
        </div>
    <!-- </el-dialog> -->
</template>
<script>
import dayjs from 'dayjs'
import request from '@/plugins/request'
import { MessageBox } from 'element-ui';
export default {
	props:['importUploadUrl','downloadUrl'],
	data() {
		return {
			importForm:{
                month: '',
                the_file:''
            },
            dateLap:'',
		};
    },
	methods: {
        async handleImportChange(ev){
            this.importForm.month = this.dateLap
            const files = ev.target.files;
            this.importForm.the_file = files[0]
            if (!files) return;
            const { importForm } = this
            var form = new FormData();
            Object.keys(importForm).forEach(key=>{
                form.append(key,importForm[key])  
            })
            // form.append('the_file',files[0])
            this.importLoading = true
            MessageBox.close()
            MessageBox.alert(
                <div v-loading={true}><br /></div>, '导入中', {
                showConfirmButton:false,
                center:true
            });
            try {
                const mes = await request.post(this.importUploadUrl,form,{alert:false})
                this.$message({
                    message: mes,
                    type: 'success'
                });
                this.fetchTableData()
            } catch (error) {
                console.log(error)
                this.$message.error({dangerouslyUseHTMLString: true,message:error.response.data,duration:6000})
            }finally{
                this.importLoading = false
                MessageBox.close()
                this.$nextTick(()=>{
                    // this.$refs.importInput.value = null
                    ev.target.value = null
                    this.fetchTableData()
                })
            }
        },
        async handleDownloadChange(){
            console.log(this.downloadUrl,'this.downloadUrl')
            try {
                if(this.downloadUrl){
                    const  { data,name,contentType } = await request.get(this.downloadUrl,{
                        responseType:'arraybuffer'
                    })
                    download(data,name||this.$route.meta.title,contentType)
                    this.$message({
                        message: '下载成功',
                        type: 'success'
                    });
                }
            } catch (error) {
                
            }finally{
                MessageBox.close()
            }
        },
	},
	created() {
		
	}
};

</script>