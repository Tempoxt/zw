<template>
    <!-- <el-dialog
        title="选择文件导入"
        :visible.sync="dialogFormVisible"
        class="public-dialog"
        v-el-drag-dialog  
        width="500px"
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
const download = require('downloadjs')
export default {
	props:['importUploadUrl','downloadUrl','namie','getData'],
	data() {
		return {
			importForm:{
                month: '',
                the_file:''
            },
            dateLap:'',
            timer:'',
			statusk:1,
			val:'',
			s:1,
		};
    },
	methods: {
        async handleImportChange(ev){
            if(this.getData&&this.getData==1){
                this.importForm.dateLap = this.dateLap
                delete  this.importForm.month
            }else{
                this.importForm.month = this.dateLap
                delete  this.importForm.dateLap
            }
            const files = ev.target.files;
            this.importForm.the_file = files[0]
            if (!files) return;
            const { importForm } = this
            var form = new FormData();
            Object.keys(importForm).forEach(key=>{
                form.append(key,importForm[key])  
            })
            this.importLoading = true
            // MessageBox.close()
            MessageBox.alert(
                <div v-loading={true}><br /></div>, '导入中', {
                showConfirmButton:false,
                center:true
            });
            try {
                const mes = await request.post(this.importUploadUrl,form,{alert:false})
                this.statusk = 1
                this.$message({
                    message: mes,
                    type: 'success'
                });
                if(this.getData&&this.getData==1){
                    this.timer = setInterval(()=>{
                        this.getDa()
                        this.s++;
                    },5000)
                }else{
                    this.$emit("fetchData",mes)
                }
                this.dateLap = ''
            } catch (error) {
                console.log(error)
                this.$message.error({dangerouslyUseHTMLString: true,message:error.response.data,duration:6000})
            }finally{
                this.importLoading = false
                MessageBox.close()
                this.$nextTick(()=>{
                    ev.target.value = null
                })
            }
        },
        async getDa(){
			if(this.statusk!=0&&this.s<=12){
				if(this.s==12){
					this.$message.error({ message: '导入失败,请重试'})
				}
				this.val = await this.$request.get('/u8report/uploadbudget',{alert:false})
				this.statusk = 0
				this.$message.success({ message: this.val,duration:3000})
				this.$emit("fetchData",this.val)
			}else{
				clearInterval(this.timer)
				this.s=0
			}
		},
        async handleDownloadChange(){
            try {
                if(this.downloadUrl){
                    const  { data,name,contentType } = await request.get(this.downloadUrl,{
                        responseType:'arraybuffer'
                    })
                    download(data,name||this.namie,contentType)
                    this.$message({
                        message: '下载成功',
                        type: 'success'
                    });
                }
            } catch (error) {
                console.log(error)
            }finally{
                MessageBox.close()
            }
        },
	},
	created() {
		this.dateLap = ''
	}
};
</script>