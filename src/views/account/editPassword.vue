<template>
	<div>
		<el-dialog
			title="修改密码"
			:visible.sync="dialogFormVisible"
			class="public-dialog"
			v-el-drag-dialog  
			>
			<div>
				<el-form ref="editForm" :model="editForm" label-width="100px" :rules="editRules">
					<el-row :gutter="20">
						<el-col :span="24">
							<el-form-item label="密码" prop="password">
								<el-input v-model="editForm.password" placeholder="请输入原密码"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label="新密码" prop="passwordNew">
								<el-input v-model="editForm.passwordNew" placeholder="请输入新密码"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label="新密码验证" prop="passwordPard">
								<el-input v-model="editForm.passwordPard" placeholder="请再次输入新密码"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>

			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="handleFormSubmit" :disabled="disabeld">确 定</el-button>
			</div>

		</el-dialog>
	</div>
</template>

<script>
import * as api_common from "@/api/common";
export default {
	props:['showModal'],
	data() {
		var validatePass = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入新密码'));
			} else {
			if (this.ruleForm.checkPass !== '') {
				this.$refs.editForm.validateField('checkPass');
			}
			callback();
			}
		};
		var validatePass2 = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请再次输入密码'));
			} else if (value !== this.editForm.passwordNew) {
				callback(new Error('两次输入密码不一致!'));
			} else {
				callback();
			}
		};
		return {
			editForm: {
				password: '',
				passwordNew: '',
				passwordPard: '',
			},
			// dialogFormVisible:false,
			editRules: {
				password: [
					{ required: true, trigger: "blur", message:'请输入原密码' }
				],
				passwordNew: [
					{ required: true, trigger: "blur", validator: validatePass, }
				],
				passwordPard: [
					{ required: true, trigger: "blur", validator: validatePass2, }
				]
			}
		};
	},
	computed:{
		dialogFormVisible:{
			get(){
                return this.showModal
            },
            set(val){
                this.$emit('update:showModal',val)
            }
		},
		disabeld(){
            if(this.editForm.password==''||this.editForm.passwordNew==''||this.editForm.passwordPard==''||(this.editForm.passwordNew!=this.editForm.passwordPard)){
                return true
            }else{
                return false
            }
        }
	},
	methods:{
		async handleFormSubmit(){
			this.form = await this.$request.post('/user/updatePwd',{
				oldPwd:this.editForm.password,
				newPwd:this.editForm.passwordNew
			})
		}
	},
	created(){
		// console.log(this.showModal,'visible')
	}
}
</script>

