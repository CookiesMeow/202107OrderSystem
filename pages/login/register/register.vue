<!--注册页面-->
<template>
	<view>
		<form>
			<!--用户名-->
			<u-row justify="space-around">
				<u-col span="9">
					<h3>用户名：</h3>
					<u-input v-model="username" :type="type_text" placeholder="大、小写字母和数字的组合,5~14位" :border="border"
						border-color="#FF9E28" maxlength="12" /><br>
				</u-col>
			</u-row>
			<!--个人邮箱-->
			<u-row justify="space-around">
				<u-col span="9">
					<h3>个人邮箱：</h3>
					<u-input v-model="personal_E_mail" :type="type_text" placeholder="个人邮箱" :border="border"
						border-color="#FF9E28" /><br>
				</u-col>
			</u-row>
			<!--密码-->
			<u-row justify="space-around">
				<u-col span="9">
					<h3>密码：</h3>
					<u-input v-model="password" :type="type_pwd" placeholder="字母，数字，_ @ ^ $,6~18位" :border="border"
						border-color="#FF9E28" maxlength="12" />
					<br>
				</u-col>
			</u-row>
			<!--确认密码-->
			<u-row justify="space-around">
				<u-col span="9">
					<h3>确认密码：</h3>
					<u-input v-model="confirm_password" :type="type_pwd" placeholder="再次输入密码" :border="border"
						border-color="#FF9E28" maxlength="12" />
					<br>
				</u-col>
			</u-row>
			<!--邀请码-->
			<u-row justify="space-around">
				<u-col span="9">
					<h3>邀请码：</h3>
					<u-input v-model="invite_code" :type="type_text" placeholder="邀请码" :border="border"
						border-color="#FF9E28" />
					<br>
				</u-col>
			</u-row>
			<!--验证码-->
			<u-row justify="center">
				<u-col span="5">
					<h3>验证码：</h3>
					<u-input v-model="verification_code" :type="type_text" placeholder="请输入验证码" :border="border"
						border-color="#FF9E28" maxlength="8" />
				</u-col>
				<u-col span="4">
					<br>
					<u-toast ref="uToast"></u-toast>
					<u-verification-code :seconds="seconds" ref="uCode" @change="codeChange">
					</u-verification-code>
					<u-button @tap="getCode">{{tips}}</u-button>
				</u-col>
			</u-row>
		</form>
		<br>
		<view>
				<!--
			<input type="button" value="注册账号" />-->
				<button class="_button" @click="register">立即注册</button>
		</view>
		<u-modal v-model="show" content="确认密码与密码不一致!"></u-modal>
	</view>
</template>

<script>
	import {
		getCaptchaByEmail,
		register
	} from '../../../utils.js'
	export default {
		data() {
			return {
				username: '', //用户名
				personal_E_mail: '', //个人邮箱
				nick_name: '', //昵称
				password: '', //密码
				confirm_password: '', //确认密码
				invite_code: '', //邀请码
				verification_code: '', //验证码

				type_text: 'text', //文本输入
				type_pwd: 'password', //密码输入
				border: true,
				tips: '',
				seconds: 30,
				show: false
			}
		},
		methods: {
			codeChange(text) {
				this.tips = text;
			},
			register() {
				if (this.password != this.confirm_password) {
					this.show=true
					return
				}
				register(this.username, this.password, this.personal_E_mail, this.verification_code, this.invite_code)
				uni.navigateTo({
					url:'../login'
				})
			},
			getCode() {
				if (this.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					var email = "";
					uni.showLoading({
						title: '正在获取验证码'
					})
					getCaptchaByEmail(this.personal_E_mail)

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
	//立即注册
	._button {
		height: 90rpx;
		width: 500rpx;
		background-color: #ffaa00;
		color: #000000;
	}
</style>
