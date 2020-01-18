<template>
	<div id="quickEntry">
		<el-card class="box-card">
			<div slot="header" class="box-card-header flex_r_bc">
				<div class="cardName"><i class="iconfont icon-zhifeiji-tongyong"></i><span>常用快捷入口</span></div>
				<i @click="dialogFormVisible=true" class="icon_set"></i>
			</div>
			<router-link v-for="o in ableList" :key="o.Eid" class="text item" :to="o.url">
				<div><span class="icon_link"></span><span class="linkName">{{o.Ename}}</span></div>
			</router-link>
		</el-card>

		<el-dialog title="常用快捷入口" :visible.sync="dialogFormVisible">
			<div class="dialogContainer">
				<div class="dialogFormVisible_hear">
					<span>已选择 <span>({{ableList.length}})</span></span>
					<div class="chooseList">
						<ul class="chooseList_son flex_r_ss flex_wrap">
							<li v-for="item in ableList" :key="item.Eid">
								<div class="li_box flex_r_sc flex_noWrap">
									<span class="menuName">{{item.Ename}}</span>
									<span class="iconBox"><span class="iconfont icon-guanbi1"></span></span>
								</div>
							</li>
						</ul>						
					</div>
				</div>
				<div class="dialogFormVisible_foot">
					<span>可选择 <span>({{menu_length}})</span></span>
					<el-tabs v-model="activeNameAll" @tab-click="handleClick">
						<el-tab-pane class="chooseList" v-for="(item,index) in menu_all" :key="item.id" :label="item.name" :name="index+''">
							<ul class="chooseList_son flex_r_ss flex_wrap">
								<li v-for="(ss,i) in item.subs.map(o=>o.subs.length?o.subs:[o]).flat()" :key="ss.id">
									<div class="li_box flex_noWrap" :class="chooseList.map(o=>o.id).includes(ss.id)?'disabled':''">
										<span @click="getMenuLi(ss,item.url)" class="menuName">{{ss.name}}</span>
									</div>
								</li>
							</ul>
						</el-tab-pane>
					</el-tabs>
				</div>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible=false">取 消</el-button>
				<el-button type="primary" @click="submit">确 定</el-button>
			</div>
		</el-dialog>
	</div>

</template>

<script>
import * as api_common from '@/api/common'

export default {
	name: 'quickEntry',
	data() {
		return {
			api_resource: api_common.resource('workbench/enter'),
			dialogFormVisible: false,
			menu_all: [],
			menu_s: [],
			menu_length: 0,
			activeName: '43',
			activeNameAll: '0',
			ableList: [],
			chooseList: [],
			disabled: true
		}
	},
	methods: {
		submit() {
			this.api_resource.create({enterRecord: this.chooseList},{
				 headers: {
					 'Content-Type':'application/json'
				 }
				
			})
		},
		getMenuLi(obj,fUrl) {
			this.chooseList.push({
				Eid: obj.id,
				Ename: obj.name,
				url: `${fUrl}/${obj.url}?menuid=${obj.id}`
			})

		},
		async getMenu(values=[]) {
			let { menu } = await api_common.getMenu(1)
			this.menu_all = menu
			// ~function f(menu){
			// 	menu.forEach(o=>{
			// 		if(o.subs && o.subs.length){
			// 			f(o.subs)
			// 			menuLength+=o.subs.length
			// 		}
			// 	})
			// 	values = values.concat(menu)
			// }(menu)


			this.ableList = await this.api_resource.get()
			console.log(this.chooseList, 1550)
			
		},
		
		handleClick() {

		}
	},
	created() {
		this.getMenu(this.choose)
	}
}
</script>

<style lang="scss">
#quickEntry{
  .el-dialog__header{
    padding: 15px 20px;
    background: #F5FAFB;
  }
  .el-dialog__footer{
    padding: 10px 20px;
    border-top: 1px solid #E4EAEC;
  }
  .el-dialog__body{
	  padding: 0 20px;
  }
}
</style>

<style lang="scss" scoped>
#quickEntry{
	.box-card{
		height: 370px;
		padding-top: 0;
		margin-bottom: 15px;
	}
	.cardName{
		.icon-zhifeiji-tongyong{
			font-size: 16px;
		}		
	}
	.icon_set{
		display: inline-block;
		width: 21px;
		height: 19px;
		background: url('~@imgs/workbench-img/icon_set.png');
		background-size: cover;
		cursor: pointer;
	}

	.item{
		display:inline-block;
		width: 33.3333333%;
		height: 100px;
		>div{
			width: 100%;
			text-align: center;
			line-height: 100px;
		}
		p{
			text-align: center;
			margin-top: 10px;
		}
		.icon_link{
			display: inline-block;
			width: 14px;
			height: 14px;
			margin-right: 8px;
			background: url('~@imgs/workbench-img/icon_link.png');
			background-size: cover;
			cursor: pointer;
		}
		.linkName{
			font-size: 14px;
			color: #4C5D66;
			text-decoration: underline;
		}
	}
	.dialogContainer{
		.dialogFormVisible_hear,.dialogFormVisible_foot{
			&>span{
				display: block;
				margin: 20px 0;
				font-size: 14px;
				color: #4C5D66;
				i{
					color: #0BB2D4;
				}
			}
			.iconBox{
				display: inline-block;
				height: 35px;
				padding: 7px 10px 7px 0px;
				.iconfont{
					margin-left: 8px;
					color: #8CA2AE;
				}
				.icon-guanbi1{
					margin-right: 0;
					cursor: pointer;
				}				
			}

			.chooseList{
				margin-bottom: 30px;
				.chooseList_son{
					margin-top: 15px;
					.li_box{
						display: inline-block;
						margin-right: 10px;
						margin-bottom: 10px;
						border-radius: 4px;
						font-size: 12px;
						&.disabled{
							&>span,.iconfont{
								opacity: 0.6;
								cursor: no-drop;								
							}
						}
						
					}
				}
			}
		}
		.dialogFormVisible_hear{
			border-bottom: 1px solid #CCD5DB;
			.chooseList_son{
				min-height: 45px;
				.li_box{
					color: #0BB2D4;
					background: rgba(11,178,212,0.1);
					.menuName{
						display: inline-block;
						padding: 7px 0 7px 10px;
						cursor: pointer;
					}
				}
			}
		}
		.dialogFormVisible_foot{
			.chooseList_son{
				.li_box{
					color: #4C5D66;
					background: rgba(76,93,102,0.1);
					.menuName{
						display: inline-block;
						padding: 7px 10px;
						cursor: pointer;
					}
				}
			}
		}
	}
}

</style>
