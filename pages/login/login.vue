<!--【【【登录界面】】】-->

<template>
	<view class="content">
		<!--中间的图片-->
		<u-navbar :is-back="false" title="" :background="background" title='登录' title-color='black' title-size='44rpx'
			:title-bold="bool_true">
		</u-navbar>
		<image class="logo" src="/static/1.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>

		<!--用户名和密码-->
		<form>
			<br>
			<u-row justify="center">
				<u-col span='10'>
					username:
					<u-input v-model="name_value" :type="type_text" placeholder="用户名" :border="border"
						border-color="#FF9E28" maxlength="32" @onblur=requireCaptcha />
				</u-col>
			</u-row>
			<u-row justify="center">
				<u-col span='10'>
					password
					<u-input v-model="pwd_value" :type="type_pwd" placeholder="密码" :border="border"
						border-color="#FF9E28" maxlength="18" />
				</u-col>
			</u-row>
			<br>
			<u-row justify="center" v-show="showCaptcha">
				<u-col span='5'>
					<u-input v-model="captcha_value" :type="type_text" placeholder="验证码" :border="border"
						border-color="#FF9E28" maxlength="5" />
				</u-col>
				<u-col span='5'>
					<image class="captcha" :src='captchaUrl' @click="refreshCaptcha" id="user_picture"></image>
				</u-col>
			</u-row>
			<br>
		</form>

		<!--注册，无条件跳转到注册页面-->
		<u-row gutter="16" justify="space-around">
			<u-col span="6">
				<view>
					<navigator url="register/register">
						<button class="reg_button">注册</button>
					</navigator>
				</view>
			</u-col>
			<!--登录,跳转到主页-->
			<u-col span="6">
				<view>
					<button class="load_in_button" @click="login">登录</button>
				</view>
			</u-col>
		</u-row>

		<!--忘记密码，无条件跳转到忘记密码页面-->
		<view><br>
			<navigator url="forgetPassword">忘记密码？click me!</navigator>
		</view>

	</view>
</template>

<script>
	import axios from 'axios'
	import {
		host,getUserInfo
	} from '../../utils.js'
	axios.defaults.withCredentials = true;
	// VM,协调者，调度器
	export default {
		//model:所有的数据
		data() {
			//方法：每次都会更新，而不是对象：会保留上次的数据
			//return对象即是需要写的所有的数据
			return {
				title: 'Welcome!',
				name_value: '', //用户名
				pwd_value: '', //密码,
				captcha_value: '',
				type_text: 'text', //用户名
				type_pwd: 'password', //密码
				border: true,
				captchaUrl: host + '/captcha',
				showCaptcha: false,
				bool_true: true,
				background: {
					// 导航栏背景图
					background: 'url(https://pic3.zhimg.com/v2-abfa94dd808fe49e7a7a2c8bf826855b_b.jpg) no-repeat',
					// 还可以设置背景图size属性
					backgroundSize: 'cover',
				}
			}
		},
		onLoad() {
			//判断用户是否已经登录,如果已经登录，那么则跳转
			getUserInfo((info)=>{
				if(info!=null){
					document.location='#/pages/userinfo/userInfo'
				}
			})
		},
		//用户的所有定义方法
		methods: {
			refreshCaptcha() {
				this.$set(this, 'captchaUrl', host + '/captcha?rand=' + Math.round(Math.random() * 5 + 5) +
					'&username=' + this.name_value)
			},
			requireCaptcha(func) {
				axios.get(
					host + '/requireVerificate', {
						params: {
							username: this.name_value
						}
					}
				).then(func)
			},
			login() {
				var need_captcha = null
				this.requireCaptcha((response) => {
					need_captcha = response.data['data']
					console.log(response)
				})
				var refreshCaptcha = this.refreshCaptcha()
				var this1 = this
				setTimeout(() => {
					if (need_captcha == null) {
						uni.showToast({
							icon: 'none',
							title: '登录超时'
						});
						return
					} else if (need_captcha && !this1.showCaptcha) {
						uni.showToast({
							icon: 'none',
							title: '请输入验证码'
						});
						this1.$set(this1, 'showCaptcha', true)
						refreshCaptcha()
						return
					}
					console.log(this.name_value, this.pwd_value)
					axios.get(host + "/login", {
						params: {
							username: this.name_value,
							password: this.pwd_value,
							captcha: this.captcha_value
						}
					}).then(function(response) {
						console.log(response.data)
						if (response.data['status'] == 0) {
							uni.showToast({
								title: '登陆成功'
							})
							var exp = new Date();
							var Days = 1
							exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
							document.cookie = 'auth=' + response.data['data'] +
								";expires=" + exp.toGMTString() + ';path=/'
							self.location = '../#/pages/userinfo/userInfo'
						} else
							uni.showToast({
								icon: 'none',
								title: response.data.msg
							});
						console.log(response);

					})
				}, 1000)

			}
		},
		mounted() {}
	}
</script>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx; //高
		width: 200rpx; //宽
		margin-top: 200rpx; //顶部距离
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}

	.reg_button {
		height: 82rpx;
		width: 188rpx;
		color: #ffffff;
		background-color: #00aa00;
	}

	.load_in_button {
		height: 82rpx;
		width: 188rpx;
		color: #ffffff;
		background-color: #ffaa00;
	}

	.captcha {
		height: 80rpx;
		width: 240rpx;
	}
</style>
