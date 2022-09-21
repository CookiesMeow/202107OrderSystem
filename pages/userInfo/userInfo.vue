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

		<!--设置按钮-->
		<hr>
		<view class="words">
			<h4>
				<navigator url="../userInfo/change/changePassword">
					<br>修改密码<br>
					<p><br></p>
				</navigator>
			</h4>
		</view>
		<hr>
		<view class="words">
			<h4>
				<navigator url="../userInfo/fellowList">
					<br>查看同事<br>
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
		getTabbar,
		host
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
					host + '/logout'
				)
				self.location = '../login/login'
			},
			refreshUserinfo() {
				var func = this.$set
				var this1 = this
				axios.get(
					host + '/userinfo/getUserinfo'
				).then(
					function(response) {
						console.log(response.data)
						if (response.data['data'].user_group == 0) {
							document.location = "/#/pages/userinfo/adminUserInfo"
							return
						}
						func(this1, 'user_info', response.data['data']) //修改data里面的数据用this.$set
						console.log(document.getElementById('user_picture').getElementsByTagName("img")[0])
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
