<!--个人信息-->
<template>
	<view>
		<view class="row">
			<!--头像和昵称-->
			<view class="column" id='yess'>
				<u-avatar class="logo" size='200' :src="user_info.picture" id="user_picture"></u-avatar>
			</view>
			<view class="column">
				<view class="username" id="username_label">{{user_info.nickname}}({{user_info.username}})</view>
			</view>
		</view>

		<!--修改个人信息按钮-->
		<hr>
		<view class="words">
			<h4>
				<navigator url="../userInfo/change/changeIndex">
					<br>修改个人信息<br>
					<p><br></p>
				</navigator>
			</h4>
		</view>

		<hr>
		<!--设置按钮-->
		<view class="words">
			<h4>
				<navigator url="../userInfo/change/changePassword">
					<br>修改密码<br>
					<p><br></p>
				</navigator>
			</h4>
		</view>
		<hr>

		<!--设置按钮-->
		<view class="words">
			<h4>
				<navigator url="../admin/addInviteCode">
					<br>生成邀请码<br>
					<p><br></p>
				</navigator>
			</h4>
		</view>
		<hr>
		<!--设置按钮-->
		<view class="words">
			<h4>
				<navigator url="../admin/userManage">
					<br>员工管理<br>
					<p><br></p>
				</navigator>
			</h4>
		</view>
		<!--退出登录-->
		<hr>
		<view class="words" @click="logout">
			<br>退出登录 <br>
			<p><br></p>
		</view>
		<hr>
		<u-tabbar :list="tabbar" :mid-button="false"></u-tabbar>
	</view>

</template>

<script>
	import axios from 'axios'
	axios.defaults.withCredentials = true;
	import {
		getTabbar,host
	} from '../../utils.js'
	export default {
		data() {
			return {
				title: '模板',
				user_info: {
					nickname: 'nickname',
					picture: '/static/1.png'
				},
				tabbar: [],
			}
		},
		activated() {
			this.refreshUserinfo()
		},
		onLoad() {

			this.refreshUserinfo()
			getTabbar(this)
			
		},
		methods: {
			logout() {
				axios.get(
					host+'/logout'
				)
				self.location = '../login/login'
			},
			refreshUserinfo() {
				console.log(this.user_info)
				var func = this.$set
				var this1=this
				axios.get(
					host+'/userinfo/getUserinfo'
				).then(
					function(response) {
						console.log(response.data)
						func(this1, 'user_info', response.data['data']) //修改data里面的数据用this.$set
					}
				)
			}
		}
	}
</script>

<style lang="scss">
	.bottomclick {
		width: 750rpx;
	}

	.logo {
		margin-top: 50rpx;
		margin-left: 50rpx;
		margin-right: 0rpx;
		margin-bottom: 50rpx;
	}

	.username {
		margin-top: 120rpx;
		margin-left: 0rpx;
	}

	.row:after {
		content: "";
		display: table;
		clear: both;
	}

	.words {
		margin-left: 50rpx;
	}

	.column {
		float: left;
		width: 50%;
	}
</style>
