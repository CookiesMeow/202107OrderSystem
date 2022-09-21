<template>

	<view>

		
		<view class='desk_id'>
			订单详情
		</view>
		<view ><br>当前桌号:{{order_value.desk_id}}
		
		</view>
		<br>
		<u-table v-for="(value,key,index) in order_value.order_list">
			<u-row justify="between">
				<image class='dish_img' :src="getDishById(key).picture"></image>

				<u-col span="4">
					{{getDishById(key).name}}
				</u-col>
				<u-col span="4">
					<u-row>
						数量：{{value}}
					</u-row>
					<u-row>
						{{statusToStr(order_value.status[key])}}
					</u-row>
				</u-col>
			</u-row>
			<br>
		</u-table>
		<br>
		<br>
		<view>

			<u-line color="#FF9E28" />
			<view class='title'>订单信息</view>
			<br>
			<u-row>
				订单id: <view class="stress">
					{{order_value.order_id}}
				</view>
			</u-row>
			<u-row>
				订单时间：
				<view class="stress">
					{{ts2str(order_value.time)}}

				</view>
			</u-row>
			<br>
			订单备注：
			<u-row>
				<u-input :border="true" class='remark' 
				:value="order_value.remark">
				</u-input>
			</u-row>
			<u-line color="#FF9E28" />
		</view>
	</view>

</template>
<script>
	import {
		statusToStr,
		getLocalTime,
		getDishList,
		getOrderById
	} from '../../utils.js'
	export default {
		data() {
			return {
				order_value: {
					"order_id": 3,
					"desk_id": 3,
					"order_list": {
						"4": 4,
						"5": 700
					},
					"price": 99.0,
					"time": 44,
					"status": {
						"4": 0,
						'5': 0
					},
					"waitor": "hello",
					"remark": "test"
				},
				dish_list:[]
			}
		},
		onLoad(){
			var this1=this
			getDishList(
				(dish_list)=>{
					this1.$set(this1,'dish_list',dish_list)
				}
			)
			const eventChannel = this.getOpenerEventChannel()
			if (JSON.stringify(eventChannel) != '{}') {
				// 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
				eventChannel.on('orderId', (data) => {
					getOrderById(data['data'], (response) => {
						this1.$set(this1, 'order_value', response.data['data'])
						console.log(response)
					})
				})
			}
		}
		,
		methods: {
			getDishById(id) {
				for (var i = 0; i < this.dish_list.length; i++) {
					//console.log(this.dish_list[i]['dish_id'] + '-' + id)
					if (this.dish_list[i]['dish_id'] == id) {
						return this.dish_list[i]
					}
				}
				return null
			},
			statusToStr(status) {
				return statusToStr(status)
			},
			ts2str(ts) {
				return getLocalTime(ts)
			}
		}
	}
</script>

<style>
	.dish_img {
		width: 70px;
		height: 70px;
	}

	.title {
		font-size: 50rpx;
	}

	.desk_id {
		font-size: 50rpx;
		background-color: #FF9E28;
	}

	.remark {
		height: 200px;
	}

	.stress {
		font-weight: 1000;
	}
</style>
