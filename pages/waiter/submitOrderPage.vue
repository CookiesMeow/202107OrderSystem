<!--购物车页面-->
<!--如果菜品数量从0到1，即删除菜品-->
<!--///////////////////////////别动它！！！/////////////////////////////////////////-->
<template>
	<view>

		<!--购物车菜总数，清空按钮，（吸顶-->
		<u-sticky offset-top='0'>
			<!-- 只能有一个根元素 -->
			<view class="top_class">
				<u-row gutter="12" justify="space-between">
					<!--左上角菜数量总计-->
					<u-col span="5">
						<view class="total_words">共计{{Object.keys(order_value.order_list).length}}道菜</view>
					</u-col>

					<!--右上角清空按钮-->
					<u-col span="2">
						<botton class="clear_botton">清空</botton>
					</u-col>
				</u-row>
			</view>
			<u-line color="orange" />
		</u-sticky>

		<view class="wrap">
			<!--列表-->
			<u-swipe-action v-if="isfresh" :index="index" v-for="(number, key,index) in order_value.order_list" :key="key">
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
								单价：{{getDishById(key).price}}元
							</text>
						</view>
					</u-col>

					<!--菜品状态-->
					<u-col span="4">
						<view class="title-wrap">
							<br><br>
							<u-number-box v-model="order_value.order_list[key]" @change="valChange(key)" :max="99">
							</u-number-box>
						</view>
					</u-col>
				</view>
			</u-swipe-action>
			<!--单元格结束-->
			<u-line color="orange"></u-line>
		</view>

		<!--备注-->
		<view>
			<u-input class="note_input" type="text" v-model="order_value.remark" :border="true"
				placeholder="备注 : 可备注偏爱的口味" />
		</view>


		<!--底部-->

		<transition>
			<p :class="['go', { isFixed: headerFixed }]" v-if="headerFixed">
				<u-row gutter="13" justify="between">

					<u-col span="7">
						<text class="title u-line-1">
							<view class="price_words">总价：{{totalPrice()}}元</view>
						</text>
					</u-col>

					<u-col span='5'>
						<u-button @click="submitOrder" class="bottom_words">下单</u-button>
					</u-col>

				</u-row>
			</p>
		</transition>
	</view>
</template>

<script>
	import axios from 'axios'
	axios.defaults.withCredentials = true;
	import {
		getTabbar,getDishList,host
	} from '../../utils.js'
	export default {
		data() {
			return {
				scrollTop: 0,
				headerFixed: true,
				successful_show: false,
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
					"remark": "test"
				},
				isfresh:true,
				btnWidth: 200,

				dish_list: [
				]
			}
		},
		onLoad() {
			var this1=this
			getDishList((dish_list)=>{
				this1.$set(this1,'dish_list',dish_list)
			})
			const eventChannel = this.getOpenerEventChannel()
			if (JSON.stringify(eventChannel) != '{}') {

				// 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
				eventChannel.on('order', (data) => {
					console.log('test')

					this1.$set(this1, 'order_value',data['data'])
				})
			}
			this.totalPrice()
		},
		methods: {
			refresh(){
				this.isfresh= this.isfresh? false:true;
				this.$nextTick(function(){
					this.isfresh= this.isfresh? false:true;
				})
			},
			//点餐成功窗口
			valChange(key) {
				
				if(this.order_value.order_list[key]==0){
					delete this.order_value.order_list[key]
					delete this.order_value.status[key]
					this.refresh()
					console.log(this.order_value.order_list)
				}
				
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
				return total
			},
			submitOrder() {
				axios.post(
					host+'/order/submitOrder',
					this.order_value
				).then(
					(response) => {
						console.log(response)
						if (response.data['status'] == 0) {
							uni.showToast({
								title: '下单成功',
								duration: 2000
							});
						} else {
							uni.showToast({
								title: response.data['msg'],
								icon: 'none',
								duration: 2000
							});
						}
						setTimeout(()=>{
							uni.navigateBack()
						},2000)
						
					}
				)


			}
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

	.clear_botton {
		height: 50rpx;
		width: 10rpx;
		background-color: #FDF6EC;
		font-size: 30rpx;
	}

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
</style>
