<!-- 修改密码-->
<template>
	<view class="content">
		<br><br>
		<form>
			<u-row justify="space-around">
				<u-col span="9">
					<h3>用户名：</h3>
					<u-input v-model="username" :type="type_text" placeholder="请输入用户名" :border="border"
						border-color="#FF9E28" maxlength="12" /><br>
				</u-col>
			</u-row>
			<!--用户名或邮箱-->
			<u-row justify="space-around">
				<u-col span="9">
					<h3>新密码：</h3>
					<u-input v-model="pwd1_value" :type="type_text" placeholder="大、小写字母和数字的组合,5~14位" :border="border"
						border-color="#FF9E28" maxlength="12" /><br>
				</u-col>
			</u-row>
			<!--验证码-->
			<u-row justify="space-around">
				<u-col span="9">
					<h3>再次确认：</h3>
					<u-input v-model="pwd2_value" :type="type_pwd" placeholder="再次输入密码" :border="border"
						border-color="#FF9E28" maxlength="12" />
					<br>
				</u-col>
			</u-row>
			<u-row justify="center">
				<u-col span="5">
					<h3>验证码：</h3>
					<u-input v-model="verification_code" :type="type_pwd" placeholder="请输入验证码" :border="border"
						border-color="#FF9E28" maxlength="30" />
				</u-col>
				<u-col span="4">
					<br>
					<u-toast ref="uToast"></u-toast>
					<u-verification-code :seconds="seconds" @end="end" @start="start" ref="uCode" @change="codeChange">
					</u-verification-code>
					<u-button @tap="getCode">{{tips}}</u-button>
				</u-col>
			</u-row>
			<br>
		</form>

		<view>
			<!--
			<input type="button" value="注册账号" />-->
			<button class="_button" @click="change_password">确定修改</button>
		</view>
		<u-row justify="space-around">
			<view class="tip">修改密码后会跳转到登陆页面重新登陆！</view>
		</u-row>
	</view>
</template>

<script>
	import axios from 'axios'
	import {
		host
	} from "../../utils.js"
	axios.defaults.withCredentials = true;
	export default {
		data() {
			return {
				tips: '',
				// refCode: null,
				seconds: 30,
				personal_E_mail: '',
				nick_name: '',
				pwd1_value: '',
				pwd2_value: '',
				type_text: 'text',
				type_pwd: '',
				border: true,
				verification_code: '',
				username: ''
			}
		},
		methods: {
			change_password() {

				axios.get(
					host + '/userinfo/change/password', {
						params: {
							'username': this.username,
							'new_password': this.pwd2_value,
							'verification_code': this.verification_code
						}
					}
				).then(
					(response) => {
						if (response.data.status == 0) {
							this.$u.toast('修改成功');
							uni.navigateTo({
								url: "login"
							})
						} else {
							this.$u.toast(response.data.msg);
						}
					}
				)


			},
			codeChange(text) {
				this.tips = text;
			},
			getCode() {
				if (this.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					var email = "";
					uni.showLoading({
						title: '正在获取验证码'
					})



					axios.get(
						host + '/getVerificationCode', {
							params: {
								'username': this.username
							}
						}
					)



					setTimeout(() => {
						uni.hideLoading();
						// 这里此提示会被this.start()方法中的提示覆盖
						this.$u.toast('验证码已发送至\r\n' + email);
						// 通知验证码组件内部开始倒计时
						this.$refs.uCode.start();
					}, 2000);
				} else {
					this.$u.toast('倒计时结束后再发送');
				}
			}
		}
	}
</script>

<style lang="scss">
	._button {
		height: 90rpx;
		width: 540rpx;
		background-color: #ffaa00;
		color: #000000;
	}

	.tip {
		margin-top: 20rpx;
		color: #82848A;
	}
</style>
