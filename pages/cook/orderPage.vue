<!--订单-->
<template>
	<view>
		<u-collapse>
			<u-collapse-item :title="item.time+' 公告'" class="background_color"
				v-for="(item, index) in announcement_list" :key="index">
				<view class="words">

					{{item.content}}
				</view>
			</u-collapse-item>
		</u-collapse>
		<view class="wrap">


			<u-collapse>
				<u-collapse-item :title="'桌号：'+order.desk_id+'    时间:'+ts2str(order.time)"
					v-for="(order, order_index) in order_list" :key="order_index">
					<u-swipe-action :index="index1" v-for="(value,key,index1) in order.order_list" :key="key"
						@click="function(index__,index_1){return clickParam(order_index,key)(index__,index_1)}"
						:options="options">
						<view class="item u-border-bottom">
							<image mode="aspectFill" :src="getDishById(key).picture" />
							<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
							<view>
								<u-row justify="space-around">
									<!--餐品名-->
									<view>
										<text>{{ getDishById(key).name}} </text>
									</view>

								</u-row>
								<u-row>
									<view>
										<text>共{{ value }}件</text>
									</view>
								</u-row>
								<u-row>

									<text>
										{{ statusToStr(order.status[key]) }}</text>
								</u-row>
							</view>
						</view>
					</u-swipe-action>
				</u-collapse-item>
			</u-collapse>
			<!--单元格结束-->
			<!--tabBar-->
			<u-tabbar v-model="current" :list="tabbar" :mid-button="false"></u-tabbar>
		</view>

	</view>
</template>

<script>
	import {
		statusToStr,
		getOrderList,
		getDishList,
		getTabbar,
		getTopAnnoucement,
		host,
		getLocalTime
	} from '../../utils.js'
	import axios from 'axios'
	axios.defaults.withCredentials = true;
	export default {

		data() {
			return {
				cir_cular: true,
				announcement_list: [{
					'content': '公告 公告 公告 公告 ',
					'time': '2021年'
				}],
				order_list: [],
				dish_list: [],
				disabled: false,
				btnWidth: 180,
				show: false,
				current: 1,
				tabbar:[],
				options: [{
						text: '正在烹饪',
						style: {
							backgroundColor: '#33B600'
						}
					},
					{
						text: '烹饪完毕',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				]
			}
		},
		onLoad() {
			//tabBar
			var func = this.$set
			var data = this.announcement_list[0]
			var this1 = this
			getTopAnnoucement(
				function(announcement) {
					var format_time = this1.ts2str(announcement['time'])
					func(data, 'content', announcement['content'])
					func(data, 'time', format_time)
					console.log(format_time)
				}
			)
			this.refreshOrderList()
			var this1 = this
			getTabbar(this)

		},
		methods: {
			ts2str(ts) {
				return getLocalTime(ts)
			},
			statusToStr(order_status) {
				return statusToStr(order_status)
			},
			getDishById(id) {
				for (var i = 0; i < this.dish_list.length; i++) {
					//console.log(this.dish_list[i]['dish_id'] + '-' + id)
					if (this.dish_list[i]['dish_id'] == id) {
						return this.dish_list[i]
					}
				}
				return null
			},
			refreshOrderList() {
				var this1 = this
				getDishList(
					(dish_list) => {
						this1.$set(this1, 'dish_list', dish_list)
					}
				)
				getOrderList(
					(order_list => {
						var new_list = []
						for (var i = 0; i < order_list.length; i++) {
							if (order_list[i]['order_status'] == 0 || order_list[i]['order_status'] == 2) {
								//只保留未完成的菜品
								var finished=true
								for(var key in order_list[i].status){
									if(order_list[i].status[key]<2)
										finished=false
								}
								if(!finished)
									new_list[new_list.length] = order_list[i]
							}
						}
						this1.$set(this1, 'order_list', new_list)
					})
				)
			},
			onPullDownRefresh() {
				this.refreshOrderList()
				setTimeout(function() {
					uni.stopPullDownRefresh();
				}, 1000);
			},
			format(left, right, len) {
				//将left和right格式化输出
				left = '' + left
				right = new Date(right * 1000).toJSON().substr(11, 5)
				var left_len = len - left.length - right.length
				var s = left
				for (var i = 0; i < left_len; i++) {
					s = s + '_'
				}
				s = s + right
				return s
			},
			clickParam(order_index, dish_id) {
				/*
				传入选中order的位置以及选中dish的id
				*/
				//高阶函数实现偏函数，传入菜品位置
				var this1 = this
				return function(index, index1) {
					//index1代表当前选择状态 index为选择的位置，在这里没有用处
					this1.$u.toast('设置成功');
					if (index1 == 1) {

						console.log('烹饪完毕')
						this1.$set(this1.order_list[order_index].status, dish_id, 2)
						//显示菜品烹饪完毕
					} else {
						console.log('正在烹饪')
						this1.$set(this1.order_list[order_index].status, dish_id, 1)
						//把菜品状态设置成：正在烹饪
					}
					axios.post(host + '/order/modifyOrderInfo',
						this1.order_list[order_index]
					).then((response) => {
						this1.refreshOrderList()
						console.log(response)
					})



				}
			}

		}
	}
</script>

<style lang="scss">
	.wrap {
		padding: 24rpx;
	}

	.u-row {
		margin: 20rpx 0;
	}

	.item {
		display: flex;
		padding: 20rpx;
	}

	.background_color {
		background-color: #fff4cd;
	}

	.words {
		font-size: 40rpx;
		color: #F0AD4E;
		padding-bottom: 200px;
	}

	image {
		width: 120rpx;
		flex: 0 0 120rpx;
		height: 120rpx;
		margin-right: 20rpx;
		border-radius: 12rpx;
	}

	.title {
		text-align: left;
		font-size: 28rpx;
		color: $u-content-color;
		margin-top: 20rpx;
	}

	.u-row {
		margin: 0rpx 0; //间隔
	}

	.demo-layout {
		height: 55rpx;
		border-radius: 5rpx; //圆角
	}

	.bg-purple {
		background: #d3dce6;
	}

	.bg-purple-light {
		background: #e5e9f2;
	}
</style>
