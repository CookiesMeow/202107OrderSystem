<!--服务员主页，用于服务员接受菜品消息（端菜上菜）-->
<!--和公告-->
<!--///////////////////////////别动它！！！/////////////////////////////////////////-->
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
			<u-swipe-action :show="item.show" :index="index" v-for="(item, index) in dish_list" :key="item.id"
				@click="click" @open="open" :options="options">
				<!--单元格开始-->
				<u-line color="orange"></u-line>
				<!--布局-->
				<u-row gutter="6" justify="space-between">
					<!--桌号和时间-->
					<u-col span="7">
						<view class="demo-layout bg-purple">
							<text class="title u-line-1">桌号：{{ item.table_number }}</text>
						</view>
					</u-col>
					<u-col span="5">
						<view class="demo-layout bg-purple-light">
							<text class="title u-line-1">{{ item.time }}</text>
						</view>
					</u-col>
				</u-row>
				<u-line color="orange"></u-line>
				<view class="item u-border-bottom">
					<!--菜品图片-->
					<image mode="aspectFill" :src="item.picture" />
					<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->

					<!--备注，设定为6个汉字一行（超过了会自动换行）-->
					<u-col span="5">
						<view class="title-wrap">

						</view>
					</u-col>

					<!--菜名、数量-->
					<u-col span="5">
						<view class="title-wrap">
							<text class="title u-line-1">
								{{ item.name }}<br><br>
								数量：{{item.dish_number}}
							</text>
						</view>
					</u-col>
				</view>


			</u-swipe-action>
			<!--单元格结束-->
		</view>
		<u-tabbar :list="tabbar" :mid-button="false"></u-tabbar>
	</view>
</template>

<script>
	import {
		getTabbar,
		getOrderList,
		getDishList,
		getOrderById,
		changeOrder,
		getTopAnnoucement,
		getLocalTime
	} from "../../utils.js"
	export default {
		data() {

			return {
				announcement_list: [{
					'content': '公告 公告 公告 公告 ',
					'time': '2021年'
				}],
				dish_list: [{
						dish_id: 1, //列表序号
						name: '菜名大概最多', //菜名
						picture: '/static/logo.png', //菜品图片
						show: false, //滑动状态
						table_number: '桌号', //桌号
						time: '时间', //下单时间
						dish_number: '菜品数量', //菜品数量
						order_id: 0
					}

				],
				tabbar: [],
				disabled: false,
				btnWidth: 190,
				show: false,
				options: [{
					text: '上菜',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
			}
		},
		onLoad() {

			getTabbar(this)
			this.refreshDishList()
		},
		methods: {
			ts2str(ts) {
				return getLocalTime(ts)
			},
			onPullDownRefresh() {
				this.refreshDishList()
				setTimeout(function() {
					uni.stopPullDownRefresh();
				}, 1000);
			},
			refreshDishList() {
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
				var this1 = this
				getDishList((dish_list) => {
					var dct = {}
					for (var i = 0; i < dish_list.length; i++)
						dct[dish_list[i].dish_id] = dish_list[i]
					getOrderList((data) => {
						var result = []
						for (var i = 0; i < data.length; i++) {
							var dish_list = data[i].order_list;
							var status = data[i].status
							for (var key in dish_list) {
								if (status[key] == 2) {
									console.log(key)
									result[result.length] = dct[key]
									result[result.length - 1]['table_number'] = data[i]['desk_id']
									result[result.length - 1]['dish_number'] = dish_list[key]
									result[result.length - 1]['order_id'] = data[i].order_id
								}
							}
						}
						this1.$set(this1, 'dish_list', result)
						console.log(result)
					})
				})
			},
			click(index, index1) {
				if (index1 == 0) {
					//菜品状态为烹饪完毕，推送到服务员端


					uni.showToast({
						title: '上菜成功'
					})
					var dish = this.dish_list[index]
					console.log('order_id', dish.order_id)
					getOrderById(dish.order_id,
						(response) => {
							var order = response.data['data']
							order.status[dish['dish_id']] = 3
							changeOrder(order)
						})

					this.dish_list.splice(index, 1); //////////////////这是删除菜品的代码！

				}
			},
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			open(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.dish_list[index].show = true;
				this.dish_list.map((val, idx) => {
					if (index != idx) this.dish_list[idx].show = false;
				})
			}
		}
	}
</script>

<style lang="scss">
	.wrap {
		padding: 15rpx;
	}

	.item {
		display: flex;
		padding: 20rpx;
	}

	/*
	.u-gap{
		height:200rpx;
		bg-color:#ff0000;
	}*/

	image {
		width: 120rpx;
		flex: 0 0 120rpx;
		height: 120rpx;
		margin-right: 20rpx;
		border-radius: 12rpx;
	}

	.title {
		text-align: left;
		font-size: 30rpx;
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
		background: #ffe58e;
	}

	.bg-purple-light {
		background: #ffed8e;
	}

	.background_color {
		background-color: #fff4cd;
	}

	.words {
		font-size: 40rpx;
		color: #F0AD4E;
		padding-bottom: 200px;
	}
</style>
