<template>
	<view>
		<!--创建新订单按钮-->
		<u-sticky offset-top='1'>
			<!-- 只能有一个根元素 -->
			<view class="sticky">
				<u-button @click="number_show = true" class="plus_button" type="warning" shape="square">
					<view class="plus_word">创建新订单</view>
				</u-button>
			</view>
			<u-line color="orange" />
		</u-sticky>
		<u-swipe-action :show="item.show" :index="index" v-for="(item, index) in order_list" :key="item.id"
			@click="changeOrder" :options="options">
			<view class="item u-border-bottom">
				<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
				<br>
				<u-row justify='between'>
					<u-col span="5">
						<view class='desk_id'>桌号:{{item.desk_id }}桌
						</view>
					</u-col>
					<u-col span="5">
						<u-row>
							<text>{{ts2str(item.time)}}</text>
						</u-row>
						<u-row>
							总额<view class="total_price">{{item.price}}</view>元
						</u-row>
					</u-col>
				</u-row>
				<br>
			</view>
		</u-swipe-action>
		<u-popup v-model="number_show" mode='top'>
			<view class="number_input_area">
				<u-input v-model="desk_id" type="number" class="number_input" placeholder='输入桌号' input-align='center'></u-input>
				<button class="input_button" @click="newOrder">开始点菜</button>
			</view>
		</u-popup>
		<u-tabbar :list="tabbar" :mid-button="false"></u-tabbar>
	</view>
</template>

<script>
	import {
		getOrderList,
		getLocalTime,
		getTabbar
	} from '../../utils.js'
	export default {
		data() {
			return {
				number_show: false,
				desk_id:'',
				order_list: [{
					"order_id": 2,
					"desk_id": 3,
					"order_list": {
						"4": 4
					},
					"price": 99.0,
					"time": 44,
					"status": {
						"4": 0
					},
					"waitor": "hello",
					"remark": "test"
				}],
				options: [{
					text: '修改',
					style: {
						backgroundColor: '#33B600'
					}
				}],
				tabbar: [],
			}
		},
		onLoad() {
			this.refreshOrderList()
			getTabbar(this)
		},

		methods: {
			newOrder(){
				var desk_id=this.desk_id
				console.log('add order')
				uni.navigateTo({
					url: 'dishPage',
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						console.log('success')
						res.eventChannel.emit('desk_id', {
							data: desk_id
						})
					}
				});
			},
			changeOrder(index) {
				console.log(index)
				var order_id = this.order_list[index].order_id
				uni.navigateTo({
					url: 'changeOrderPage',
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('orderId', {
							data: order_id
						})
					}
				});
			},
			ts2str(ts) {
				return getLocalTime(ts)
			},
			click(index) {
				console.log(index)
			},
			refreshOrderList() {
				var this1 = this
				getOrderList((orderList) => {
					orderList.reverse()
					var new_list = []
					for (var i = 0; i < orderList.length; i++) {
						if (orderList[i].order_status == 0 || orderList[i].order_status == 2) {
							new_list[new_list.length] = orderList[i]
						}
					}
					this1.$set(this1, "order_list", new_list)
				})
			},
			onPullDownRefresh() {
				this.refreshOrderList()
				setTimeout(function() {
					uni.stopPullDownRefresh();
				}, 1000);
			}
		}
	}
</script>

<style>
	.desk_id {
		font-size: 50rpx;
		color: #DD6161;
	}

	.total_price {
		font-size: 60rpx;
		color: #DD6161;
	}

	,
	.number_input_area {
		height: 280rpx;
	}

	.number_input {
		height: 100rpx;
		width: 80%;
		font-size: 50rpx;
		border-radius: 20rpx;
		margin-left: 70rpx;
		margin-top: 100rpx;
		background-color: #f4f4f4;
	}

	.input_button {
		height: 100rpx;
		width: 80%;
		font-size: 40rpx;
		border-radius: 20rpx;
		margin-left: 70rpx;
		margin-top: 30rpx;
		background-color: #F29100;
	}
</style>
