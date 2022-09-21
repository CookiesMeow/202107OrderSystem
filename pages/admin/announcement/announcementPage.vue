<template>
	<view>
		<u-sticky offset-top="-30">
			<!-- 只能有一个根元素 -->
			<view class="top_class button_area">
				<!--公告输入+按钮发布-->
				<button class="announce_button" @click="open">
					发布新公告
				</button>
			</view>
			<u-line color="orange" />
		</u-sticky>
		<view class="wrap" :show="item.show" :index="index" v-for="(item, index) in announceList" :key="item.id">
			<u-card box-shadow=" 0 0 8px rgba(255, 170, 0, 0.6)" :title="ts2str(item.time)" :sub-title="''+item.id">

				<view slot="body">

					<u-read-more ref="uReadMore" show-height='200' :toggle="true" color='orange'>
						<u-parse :html="item.content"></u-parse>
					</u-read-more>

				</view>
			</u-card>

		</view>
		<u-tabbar :list="tabbar" :mid-button="false"></u-tabbar>
	</view>
</template>

<script>
	import {
		getAnnouncementList,
		getLocalTime,
		getTabbar
	} from '../../../utils.js'
	export default {
		data() {
			return {
				announceList: [],
				tabbar: [],
			}
		},
		onLoad() {
			getTabbar(this)
			this.refreshAnnoucementList()
		},
		methods: {
			onPullDownRefresh() {
				this.refreshDishList()
				setTimeout(function() {
					uni.stopPullDownRefresh();
				}, 1000);
			},
			refreshAnnoucementList() {
				var this1 = this
				getAnnouncementList((announce) => {
					announce.reverse()
					this1.$set(this1, 'announceList', announce)
				})
			},
			onPullDownRefresh() {
				this.refreshAnnoucementList()
				setTimeout(function() {
					uni.stopPullDownRefresh();
				}, 1000);
			},
			ts2str(ts) {
				return getLocalTime(ts)
			},
			open() {
				uni.navigateTo({
					url: "announcementAddPage"
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.button_area {
		width: 100%;
		height: 120rpx;
		margin-top: 0rpx;
		background-color: #ffffff;
	}

	.announce_button {
		width: 95%;
		margin-top: 30rpx;
		margin-bottom: 30rpx;
		background-color: #ffebc3;
	}
</style>
