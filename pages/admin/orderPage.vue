<template>
	<view>
		<u-sticky>
			<u-subsection :list="order_view" :current="currentView" @change="changeOrderView"></u-subsection>
		</u-sticky>
		<u-swipe-action :show="item.show" :index="index" v-for="(item, index) in order_list" :key="item.order_id"
			@click="click" :options="options">
			<view class="item u-border-bottom">
				<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
				<br>
				<u-row justify='between' @click='openOrderInfo(item.order_id)'>
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
		<!--吸底-->
		<u-modal v-model="show" :show-cancel-button="true" :content="content" @confirm="removeOrder"></u-modal>
		<u-tabbar :list="tabbar" :mid-button="false"></u-tabbar>
	</view>
</template>

<script>
	import {
		getOrderList,
		getLocalTime,
		getTabbar,
		removeOrder
	} from '../../utils.js'
	export default {
		data() {
			return {
				show: false,
				content: '请问您要取消该订单吗？',
				order_list: [],
				options: [{
					text: '取消',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				currentView: 0,
				order_view: [{
						name: '进行订单'
					},
					{
						name: '历史订单'
					}
				],
				tabbar: [],
				chooseOrderId: 0
			}
		},
		onLoad() {
			getTabbar(this)
			this.showOrderPreparing()
		},

		methods: {
			openOrderInfo(order_id) {
				uni.navigateTo({
					url: 'orderInfo',
					success: function(res) {
						// 通过eventChannel向被打开页面传送数据
						res.eventChannel.emit('orderId', {
							data: order_id
						})
					}
				});
			},
			changeOrderView(index) {
				if (index == 0)
					this.showOrderPreparing()
				else
					this.showHistoryOrder()
			},
			removeOrder() {
				console.log('remove' + this.chooseOrderId)
				removeOrder(this.chooseOrderId)
				this.changeOrderView(this.currentView)
			},
			ts2str(ts) {
				return getLocalTime(ts)
			},
			showHistoryOrder() {
				var this1 = this
				getOrderList(
					(order_list) => {
						var new_list = []
						order_list.reverse()
						for (var i = 0; i < order_list.length; i++) {
							var order_status = order_list[i]['order_status']
							if (order_status == 0 || order_status == 2) {

							} else
								new_list[new_list.length] = order_list[i]
						}
						this1.$set(this1, 'order_list', new_list)
					}

				)
				this1.$set(this1, "options", [])
			},
			onPullDownRefresh() {
				this.changeOrderView(this.currentView)
				setTimeout(function() {
					uni.stopPullDownRefresh();
				}, 1000);
			},
			showOrderPreparing() {
				var this1 = this
				getOrderList(
					(order_list) => {
						var new_list = []
						order_list.reverse()
						for (var i = 0; i < order_list.length; i++) {
							var order_status = order_list[i]['order_status']
							if (order_status == 0 || order_status == 2) {
								new_list[new_list.length] = order_list[i]
							}
						}
						this1.$set(this1, 'order_list', new_list)
					}

				)
				this1.$set(this1, "options", [{
					text: '取消',
					style: {
						backgroundColor: '#dd524d'
					}
				}])
			},
			click(index) {
				this.$set(this, 'chooseOrderId', this.order_list[index].order_id)
				this.show = true
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
</style>
