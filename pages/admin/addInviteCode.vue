<template>
	<view>

		<u-subsection :list="groupList" :current="currentGroup" @change="refreshInviteCodeList"></u-subsection>
		<view class="output_area" v-for="(inviteCode,index1) in inviteCodeList">
			<u-row>
				<u-col span="8">

					<!--邀请码输出-->
					<view class="invite_code_output">
						<u-input type="textarea" :id="'invite'+index1" :disabled="true" placeholder=''
							v-model="inviteCode.inviteCode" />

					</view>
				</u-col>
				<u-col span="4">

					<!--复制按钮-->
					<button class="copy_button" @click="copyInviteCode(index1)">复制</button>
				</u-col>
			</u-row>
		</view>

		<u-row gutter="13" justify="between">

			<u-col span="7">

			</u-col>

			<u-col span='5'>
				<u-button @click="addInviteCode" class="bottom_words">添加邀请码</u-button>
			</u-col>

		</u-row>
	</view>
</template>

<script>
	import {
		getInviteCodeList,
		addInviteCode
	} from '../../utils.js'
	export default {
		data() {
			return {
				headerFixed: false,
				groupList: [{

					name: '服务员',
					value: 2
				}, {

					name: '后厨',
					value: 1
				}],
				show: false,
				inviteCodeList: [],
				currentGroup: 0
			}
		},
		onLoad() {
			this.refreshInviteCodeList(this.currentGroup)
		},
		methods: {
			refreshInviteCodeList(index) {
				this.$set(this, 'currentGroup', index)
				var this1 = this
				console.log(index)
				getInviteCodeList((codeList) => {
					var new_list = []
					for (var i = 0; i < codeList.length; i++) {
						if (codeList[i]['user_group'] == this1.groupList[index].value) {
							new_list[new_list.length] = codeList[i]
						}
					}
					this1.$set(this1, 'inviteCodeList', new_list)
					console.log(this1.groupList[index].value)
				})
			},
			addInviteCode() {
				addInviteCode(this.groupList[this.currentGroup].value)
			},
			copyInviteCode(index1) {
				var code=this.inviteCodeList[index1].inviteCode
				console.log(code)
				this.copyArea(code)
			},
			copyArea(e) {
				// console.log(e)
				var input = document.createElement("input"); // 直接构建input
				input.value = e; // 设置内容
				document.body.appendChild(input); // 添加临时实例
				input.select(); // 选择实例内容
				document.execCommand("Copy"); // 执行复制
				if (document.execCommand("Copy")) {
					// console.log("okok");
					
					uni.showToast({
					title: '复制成功',
					duration: 1000
					})
				} else {
					uni.showToast({
					title: '复制失败,请重试',
					duration: 1000,
					icon:'none'
					})
				}
				document.body.removeChild(input); // 删除临时实例
			}

		}
	}
</script>

<style lang="scss">
	.wrap {
		padding: 30rpx;
	}

	.words {
		height: 100rpx;
		font-size: 50rpx;
		margin-top: 50rpx;
		margin-bottom: 30rpx;
	}

	.output_area {}

	.invite_code_output {
		height: 105rpx;
		width: 100%;
		margin-top: 45rpx;
		border-radius: 20rpx;
		background-color: #ebebeb;
	}

	.copy_button {
		height: 100rpx;
		width: 90%;
		font-size: 40rpx;
		margin-top: 50rpx;
		color: #FFFFFF;
		background-color: #18B566;
	}

	#test {
		.list-box {
			padding-bottom: 50px;
		}

		.go {
			background: pink;
			text-align: center;
			line-height: 50px;
			width: 100%;
		}

		.isFixed {
			position: fixed;
			bottom: 0;
		}

		.fade-enter {
			opacity: 0;
		}

		.fade-enter-active {
			transition: opacity 0.8s;
		}

		.fade-leave-to {
			opacity: 0;
		}

		.fade-leave-active {
			transition: opacity 0.8s;
		}
	}
</style>
