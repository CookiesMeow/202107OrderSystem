<!--修改个人信息按钮最左边50rpx是空的无法点击-->
<template>
	<view>
		<!--头像-->
		<u-upload :custom-btn="true" @on-success="changePicture" :header='uploadHeader' :show-upload-list="false"
			:action="uploadUrl" :file-list="fileList">
			<view slot="addBtn" class="slot-btn" hover-class="slot-btn__hover" hover-stay-time="150">
				<u-avatar class="logo" size='200' :src="user_info.picture" @click="show = true"></u-avatar>
			</view>
		</u-upload>
		<!-- 修改个人信息区域 -->
		<hr>
		<view class="words">
			<h4>
				<navigator url="changeNickname">
					<br>修改昵称<br>
					<p><br></p>
				</navigator>
			</h4>
		</view>
		<hr>
		<view class="words">
			<h4>
				<navigator url="changeEmail">
					<br>修改邮箱<br>
					<p><br></p>
				</navigator>
			</h4>
		</view>
		<hr>
	</view>
</template>

<script>
	import axios from 'axios'
	import {
		getCookie,
		host,
		changePicture
	} from '../../../utils.js'
	axios.defaults.withCredentials = true;
	export default {
		data() {
			return {
				show: false,
				user_info: {
					picture: '/static/1.png'
				},
				uploadUrl: host + '/uploadPicture',
				uploadHeader: {
					'auth': 'test'
				},
				fileList: []
			}
		},
		onLoad() {
			this.$set(this.uploadHeader, 'auth', getCookie('auth'))
			this.refreshUserinfo()
		},
		methods: {
			getuserinfo(res) {
				this.show = true;
				console.log(res);
			},
			refreshUserinfo() {
				var func = this.$set
				var info = this.user_info
				axios.get(
					host + '/userinfo/getUserinfo'
				).then(
					function(response) {
						console.log(response.data)
						func(info, 'picture', response.data['data']['picture']) //修改data里面的数据用this.$set
					}
				)
			},
			changePicture(data, index, lists, name) {
				var code = data['data']
				changePicture(  escape(host + '/getPicture?id=' + code))
				setTimeout(this.refreshUserinfo,500)
			}
		}
	}
</script>


<style lang="scss">
	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 50rpx;
		margin-left: 50rpx;
		margin-right: 0rpx;
		margin-bottom: 50rpx;
	}

	.words {
		margin-left: 50rpx;
	}
</style>
