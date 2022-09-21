<!--订单详情-->
<!--可以把未烹饪的菜删除-->
<!--///////////////////////////别动它！！！/////////////////////////////////////////-->
<template>
	<view>
		<!--订单信息（订单号、下单时间、桌号），（吸顶-->
		<u-sticky offset-top='0'>
			<!-- 只能有一个根元素 -->
			<view class="top_class">
				<u-row gutter="6" justify="space-between">
					<!--桌号：-->
					<u-col span="9">
						<view class="total_words">当前桌号：{{order_value.desk_id}}</view>
					</u-col>

					<u-col span="2">
					</u-col>
				</u-row>
			</view>
			<u-line color="orange" />
		</u-sticky>

		<!--订单详情-->
		<view>
			<view class="order_detail">
				订单号：{{order_value.order_id}}
				<br>
				下单时间：{{ts2str(order_value.time)}}
			</view>
		</view>

		<view class="wrap">
			<!--列表-->
			<u-swipe-action :index="key" v-for="(number, key,index) in order_value.order_list" :key="key" @click="click"
				:options="options">
				<!--单元格开始-->
				<u-line color="orange"></u-line>
				<view class="item u-border-bottom">
					<!--菜品图片-->
					<image mode="aspectFill" :src="getDishById(key).picture" />
					<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->

					<!--菜名、数量-->
					<u-col span="6">
						<view class="title-wrap">
							<text class="title u-line-1">
								{{ getDishById(key).name }}<br><br>
								数量：{{order_value.order_list[key]}}
							</text>
						</view>
					</u-col>

					<!--菜品状态-->
					<u-col span="4">
						<view class="title-wrap">
							<br><br>
							{{statusToStr(order_value.status[key])}}
						</view>
					</u-col>
				</view>
			</u-swipe-action>
			<!--单元格结束-->
			<u-line color="orange"></u-line>
		</view>

		<!--备注-->
		<view>
			<view class="note_input">{{order_value.remark}}</view>
		</view>

		<view><br><br><br></view>
		<!--底部-->
		<transition>
			<p :class="['go', { isFixed: headerFixed }]" v-if="headerFixed">
				<u-row gutter="6" justify="flex-start">

					<!--总价-->
					<u-col span="6">
						<text class="title u-line-1">
							<view class="price_words">总价：{{totalPrice()}}元</view>
						</text>
					</u-col>

					<!--下单按钮-->
					<u-col span="6">
						<u-button class="invoice">结账</u-button>
					</u-col>
				</u-row>
			</p>
		</transition>
	</view>
</template>

<script>
	import {
		statusToStr,
		getLocalTime,
		getOrderById,
		getDishList,
		changeOrder
	} from '../../utils.js'
	export default {
		data() {
			return {
				value: 0,
				scrollTop: 0,
				headerFixed: true,
				successful_show: false,
				content: '下单成功！',
				order_value: {
					"order_id": 3,
					"desk_id": 3,
					'order_list': {
						4: 5,
						7: 8
					},
					"price": 99,
					"status": {
						4: 0,
						7: 0
					},
					"waitor": "hello",
					"remark": "test",
					"time": 9
				},
				disabled: false,
				btnWidth: 200,
				show: false,
				options: [{
					text: '取消',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				dish_list: [
				]
			}
		},
		onLoad(option) {
			var this1 = this;
			const eventChannel = this.getOpenerEventChannel()
			getDishList((lst)=>{
				this1.$set(this1,'dish_list',lst)
			})
			if (JSON.stringify(eventChannel) != '{}') {
				console.log('test')
				// 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
				eventChannel.on('orderId', (data) => {
					getOrderById(data['data'], (response) => {
						this1.$set(this1, 'order_value', response.data['data'])
						console.log(response)
					})
				})
			}
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
			totalPrice() {
				var total = 0
				for (var key in this.order_value.order_list) {
					var dish = this.getDishById(key)
					total += dish.price * this.order_value.order_list[key]
				}
				console.log(total)
				return total
			},
			click(index, index1) {
				if (this.order_value.status[index] == 0) {
					var this1=this
					var tmp=this.order_value
					delete tmp.order_list[index]
					delete tmp.status[index]
					changeOrder(tmp,(response)=>{
						if(response.data.status==0){
							delete this1.order_value.order_list[index]
							delete this1.order_value.status[index]
						}
						uni.showToast({
							title:response.data.msg,
							icon:(response.data.status==0?'success':'none')
						})
					})
				}
				
			},
			//只能同时拉出来一个
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			open(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.table_list[index].show = true;
				this.table_list.map((val, idx) => {
					if (index != idx) this.table_list[idx].show = false;
				})
			},

		}
	}
</script>

<style lang="scss">
	.note_input {
		height: 200rpx;
		width: 90%;
		margin-left: 36rpx;
		color: #141414;
		background-color: #f1f1f1;
	}

	.invoice {
		height: 100rpx;
		width: 375rpx;
		text-align: center;
		font-size: 50rpx;
		color: #ffffff;
		background-color: #ff8000;
	}

	.list-box {
		padding-bottom: 50px;
	}

	.go {
		background: #F0AD4E;
		text-align: center;
		line-height: 50px;
		width: 100%;
	}

	.isFixed {
		position: fixed;
		bottom: 0;
	}

	.price_words {
		font-size: 50rpx;
	}

	.bottom_words {
		width: 310rpx;
		height: 100rpx;
		margin-right: 0rpx;
		text-align: center;
		font-size: 50rpx;
		color: #ffffff;
		background-color: #ff8000;
	}

	//当前桌号
	.total_words {
		background-color: #FFFFFF;
		margin-top: 10rpx;
		margin-left: 30rpx;
		font-size: 40rpx;
	}

	.top_class {
		margin-top: 0rpx;
		height: 80rpx;
		background-color: #FFFFFF;
	}

	.wrap {
		padding: 12rpx;

	}

	.u-row {
		margin: 20rpx 0;
	}

	.item {
		display: flex;
		padding: 20rpx;
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
		background: #ffeaa5;
	}

	.bg-purple-light {
		background: #fff5e1;
	}

	.order_detail {
		height: 150rpx;
		width: 730rpx;
		font-size: 50rpx;
		margin-top: 10rpx;
		margin-left: 10rpx;
		color: #6c4800;
		background-color: #ffebc7;
	}
</style>
