<template>
	<view>
		<u-dropdown>
			<u-dropdown-item @change='refreshUserList' v-model="showGroup" title="职位" :options="options1"></u-dropdown-item>
			<u-dropdown-item @change='refreshUserList' v-model="showOrder" title="显示顺序" :options="options2"></u-dropdown-item>
		</u-dropdown>
		<u-swipe-action :index="index1" btn-width="240" v-for="(user,index1) in user_list_show" :key="index1"
			@click="changeUser" :options="options">
			<view class="item u-border-bottom">

				<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
				<br>
				<u-row justify="left" gutter="12">
					<!--餐品名-->
					<u-avatar :src="user.picture"></u-avatar>
					<u-col span="8">

						<text>{{ user.nickname+'('+user.username+')'}} </text>

					</u-col>
					<u-col span="2">

						<text>{{group2str(user.user_group)}}</text>
					</u-col>
				</u-row>
				<br>
			</view>
		</u-swipe-action>
		<u-modal v-model="show_remove_user" @confirm='removeUser' :show-cancel-button="true" :content="content">
		</u-modal>
		<u-action-sheet :list="group_list" @click='changeUserGroup' v-model="show_change_group"></u-action-sheet>
	</view>
</template>

<script>
	import {
		getUserList,
		removeUserByUsername,
		changeUserGroupByUsername
	} from '../../utils.js'
	export default {
		data() {
			return {
				user_list: [{
					"username": "robot",
					"email": "14******14qq.com",
					"user_group": 0,
					"nickname": "Donald Trump",
					"picture": "https://sinastorage.com/storage.caitou.sina.com.cn/products/201612/b7e38c24df5c6a7a6fe2af3880239baa.jpeg"
				}],
				options: [{
						text: '修改职位',
						style: {
							backgroundColor: '#33B600'
						}
					},
					{
						text: '开除员工',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				],
				showGroup:-1,
				showOrder:1,
				keyword: '',
				value1: 1,
				value2: 2,
				content: '请问您要开除该员工吗？',
				show_remove_user: false,
				show_change_group: false,
				group_list: [{
					text: '服务员',
					value:2
				}, {
					text: '后厨',
					value:1
				}],
				options1: [
					{
						label:'全部',
						value:-1
					}
					,{
						label: '管理员',
						value: 0,
					},
					{
						label: '服务员',
						value: 2,
					},
					{
						label: '后厨',
						value: 1,
					}
				],
				options2: [{
						label: '默认顺序',
						value: 1,
					},
					{
						label: '按用户名顺序',
						value: 2,
					},
					{
						label: '按昵称顺序',
						value: 3,
					}
				],
				current_user: '',
				user_list_show:[]
			}
		},
		onLoad() {
			this.refreshUserList()
		},
		methods: {
			refreshUserList(){
				var this1 = this
				getUserList((userList) => {
					this1.$set(this1, 'user_list', userList)
					var new_list=[]
					for(var i=0;i<userList.length;i++){
						var selected=this1.showGroup
						console.log(selected,'selected',this1.showGroup)
						if(selected==-1 || userList[i].user_group==selected)
							new_list[new_list.length]=userList[i]
					}
					/*按照指定顺序排序*/
				
					if(this1.showOrder==2){
						new_list=new_list.sort(function(a,b){
							return a.username.localeCompare(b.usernamem,'zh-CN')
						})
					}else if(this1.showOrder==3){
						new_list=new_list.sort(function(a,b){
							return a.nickname.localeCompare(b.nickname,'zh-CN')
						})
					}
					this1.$set(this1,'user_list_show',new_list)
					console.log(new_list)
				})
			},
			removeUser() {
				console.log(this.current_user + '用户被删除')
				removeUserByUsername(this.current_user,(response)=>{
					uni.showToast({
						title:response.data['msg'],
						icon:(response.data['status']==0?'success':'none')
					})
				})
				this.refreshUserList()
			},
			changeUserGroup(index) {
				changeUserGroupByUsername(this.current_user,this.group_list[index].value,
				(response)=>{
					uni.showToast({
						title:response.data['msg'],
						icon:(response.data['status']==0?'success':'none')
					})
				})
				this.refreshUserList()
			},
			group2str(group) {
				if (group == 0)
					return '管理员'
				if (group == 1)
					return "后厨"
				if (group == 2)
					return "服务员"
			},
			changeUser(index, index1) {
				this.current_user = this.user_list[index]['username']
				if (index1 == 0) {
					console.log('修改职位')
					this.show_change_group = true
				} else {
					console.log('删除员工')
					this.show_remove_user = true;
				}
			}
		}
	}
</script>

<style>

</style>
