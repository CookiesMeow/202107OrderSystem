<!--忘记密码，验证邮箱后修改密码-->
<template>
	<view>	
		<u-sticky offset-top='0'>
			<!-- 只能有一个根元素 -->
			<view class="top_class">
				<!--公告输入+按钮发布-->
				<view class="wrap">
					<u-input class="announcement" v-model='announceContent' type="textarea" :border="true"
					 placeholder="输入公告..." maxlength='9999' />
				</view>
				<!--@confirm:确认按钮事件、、、@cancel：取消按钮事件-->
				<u-modal :content="confirmContent" v-model="anounce_show" :title-style="{color: 'red'}" 
					:show-cancel-button='true' @confirm='addAnnouncement'  >
					
				</u-modal>
				<button class="announce_button" @click="open">
					确认发布
				</button>
			</view>
			<u-line color="orange" />
		</u-sticky>
	</view>
</template>

<script>
	import {addAnnouncement} from '../../../utils.js'
	export default {
		data() {
			return {
				anounce_show:false,
				confirmContent:'请问您要添加新公告吗',
				announceContent:''
			}
		},
		methods: {
			addAnnouncement(){
				addAnnouncement(this.announceContent)
			}
			,
			open(){
				this.anounce_show=true
			}
		}
	}
</script>

<style lang="scss">
	.wrap {
		padding: 24rpx;
	}
	.announcement {
		height: 600rpx;
		background-color: #FDF6EC;
	}
	.words{
		margin-left: 100rpx;
	}
	.announce_button {
		width: 95%;
		margin-bottom: 30rpx;
	}
</style>