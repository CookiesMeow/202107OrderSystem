<!-- 修改个人昵称-->
<template>
	<view class="content">
		<br><br>
		<form>
			<!--用户名或邮箱-->
			<u-row justify="space-around">
				<u-col span="9">
					<h3>更改昵称：</h3>
					<u-input v-model="nickname_value" placeholder="支持汉字\字母\数字,3~12位" :border="border"
						border-color="#FF9E28" maxlength="12" /><br>
				</u-col>
			</u-row>
		</form>

		<view>
			<navigator url="../../template/index">
				<!--
			<input type="button" value="注册账号" />-->
				<button class="_button" @click="change_nickname">确定修改</button>
			</navigator>
		</view>

	</view>
</template>

<script>
	import axios from 'axios'
	import {host} from '../../../utils.js'
	axios.defaults.withCredentials = true;
	export default {
		data() {
			return {
				nickname_value:'',
				border: true
			}
		},
		onLoad(){
			this.refreshUserinfo()
		}
		,
		methods: {
			change_nickname() {
				axios.get(
					host+'/userinfo/change/nickname', {
						params: {
							new_nickname: this.nickname_value,
						}
					}
				).then(
					(response)=>{
						uni.navigateBack({
							
						})
					}
				)
			},
			refreshUserinfo(){
				var func=this.$set
				var info=this
				axios.get(
					host+'/userinfo/getUserinfo'
				).then(
					function(response){
						console.log(response.data)
						func(info, 'nickname_value',  response.data['data']['nickname'])
					}
				)
			}
		}
	}
</script>

<style lang="scss">
	//确认修改
	._button {
		height: 90rpx;
		width: 540rpx;
		background-color: #ffaa00;
		color: #000000;
	}
</style>
