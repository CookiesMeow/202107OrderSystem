<template>
	<view class="u-wrap">
		<!--搜索栏-->

		<view class="u-search-box">
			<view class="u-search-inner">
				<u-icon name="search" color="#bcbfc7" :size="28"></u-icon>
				<text class="u-search-text">搜索</text>
			</view>
		</view>

		<!--左边菜单栏-->
		<view class="u-menu-wrap">
			<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view" :scroll-top="scrollTop"
				:scroll-into-view="itemId">
				<view v-for="(item,index) in category_list" :key="index" class="u-tab-item"
					:class="[current == index ? 'u-tab-item-active' : '']" @tap.stop="swichMenu(index)">
					<text class="u-line-1">{{item.name}}</text>
				</view>
			</scroll-view>

			<scroll-view :scroll-top="scrollRightTop" scroll-y scroll-with-animation class="right-box"
				@scroll="rightScroll">
				<view class="page-view">
					<!--每个类别-->
					<view class="class-item" :id="'item' + index" v-for="(item , index) in category_list" :key="index">
						<view class="item-title">
							<text>{{item.name}}</text>
						</view>
						<view class="item-container">
							<!--单个对象-->
							<view class="thumb-box" v-for="(item1, index1) in item.foods" :key="index1">
								<u-row gutter="16" justify="space-between">

									<!--图片-->
									<u-col span='4'>
										<image class="item-menu-image" :src="item1.picture"></image>
									</u-col>

									<!--菜名-->
									<u-col span='4'>
										<view class="item-menu-name">{{item1.name}}</view>
										<br>{{item1.price+'元'}}<br>
									</u-col>

									<!--步进器（数量选择）-->
									<u-col span='4'>
										<br><br>
										<u-number-box v-model="item1.choose_num" @change="valChange" :min="0" :max="99">
										</u-number-box>
									</u-col>
								</u-row>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view>
			<u-row align="space-around">
				<u-col span="7">
					<text class="total_price">总价：{{getTotalPrice()}}元</text>
				</u-col>
				<u-col span="5">

					<u-button type="primary" @click='submitOrder'>提交订单</u-button>
				</u-col>
			</u-row>
		</view>


	</view>
</template>

<script>
	import axios from 'axios'
	import {
		host
	} from "../../utils.js"
	axios.defaults.withCredentials = true;
	import {
		getUserInfo
	} from '../../utils.js'
	export default {
		data() {
			return {
				content: 'tets',
				Go_to_Top: 0,
				scrollTop: 0, //tab标题的滚动条位置
				oldScrollTop: 0,
				current: 0, // 预设当前项的值
				menuHeight: 0, // 左边菜单的高度
				menuItemHeight: 0, // 左边菜单item的高度
				itemId: '', // 栏目右边scroll-view用于滚动的id
				category_list: [{
					'category_id': 1,
					"name": "炒饭",
					"foods": [{
						"dish_id": 3,
						"name": "黄金蛋炒饭",
						"price": 3.0,
						"picture": "/static/food/food.png",
						"category": 5,
						"stock": 4
					}]
				}],
				menuItemPos: [],
				arr: [],
				desk_id:3,
				tabbar: [],
				scrollRightTop: 0, // 右边栏目scroll-view的滚动条高度
				timer: null, // 定时器

				//步进器
				value: 0
			}
		},
		onLoad() {
			var this1=this
			const eventChannel = this.getOpenerEventChannel()
			if (JSON.stringify(eventChannel) != '{}') {
			
				// 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
				eventChannel.on('desk_id', (data) => {
					console.log('data',data)
			
					this1.$set(this1, 'desk_id',data['data'])
				})
			}
			this.refreshDishList()
		},
		onReady() {
			this.getMenuItemTop()
		},
		methods: {
			//更新总价格
			submitOrder() {
				this.generateOrderInfo((order) => {
					this.refreshDishList()
					uni.navigateTo({
						url: 'submitOrderPage',
						success: function(res) {
							// 通过eventChannel向被打开页面传送数据
							res.eventChannel.emit('order', {
								data: order
							})
						}
					});
				})

			},
			generateOrderInfo(func) {
				var order_value = {}
				var this1 = this
				//console.log(this.category_list)
				getUserInfo((user_info) => {
					order_value = {
						"desk_id": this1.desk_id,
						'order_list': {

						},
						"price": this.getTotalPrice(),
						"status": {

						},
						"waitor": user_info.username,
						"remark": ""
					}
					for (var i = 0; i < this1.category_list.length; i++) {
						var category = this1.category_list[i]
						for (var j = 0; j < category.foods.length; j++) {
							var food = category.foods[j]
							if (food.choose_num != 0) {
								order_value['order_list'][food.dish_id] = food.choose_num
								order_value['status'][food.dish_id] = 0
							}
						}
					}
					func(order_value)
				})


			},
			getTotalPrice() {
				var total = 0

				for (var key in this.category_list) {
					for (var i = 0; i < this.category_list[key]['foods'].length; i++) {
						total += this.category_list[key]['foods'][i]['choose_num'] *
							this.category_list[key]['foods'][i]['price']
						//console.log(total)
					}
				}

				return total
			},
			refreshDishList() {
				var this1 = this
				axios.get(
					host + '/category/getCategoryList'
				).then(
					(response) => {
						var list = response.data['data']

						for (var i = 0; i < list.length; i++) {
							this1.$set(this1.category_list, list[i].position,
								list[i]
							)
							this1.$set(this1.category_list[list[i].position], 'foods',
								[]
							)
						}
						axios.get(
							host + '/dish/getDishList'
						).then(
							(response) => {
								console.log(response)
								var dish_list = response.data['data']
								for (var i = 0; i < dish_list.length; i++) {
									var position = 0
									for (var j = 0; j < list.length; j++) {
										if (list[j].category_id == dish_list[i].category) {
											position = list[j].position
											break
										}
									}
									var len = this1.category_list[position]['foods'].length
									this1.$set(this1.category_list[position]['foods'],
										len, dish_list[i]
									)
									this1.$set(this1.category_list[position]['foods'][len],
										'choose_num', 0
									)
								}
							}
						)
					}
				)
			},
			// 点击左边的栏目切换
			async swichMenu(index) {
				if (this.arr.length == 0) {
					await this.getMenuItemTop();
				}
				if (index == this.current) return;
				this.scrollRightTop = this.oldScrollTop;
				this.$nextTick(function() {
					this.scrollRightTop = this.arr[index];
					this.current = index;
					this.leftMenuStatus(index);
				})
			},
			// 获取一个目标元素的高度
			getElRect(elClass, dataVal) {
				new Promise((resolve, reject) => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.' + elClass).fields({
						size: true
					}, res => {
						// 如果节点尚未生成，res值为null，循环调用执行
						if (!res) {
							setTimeout(() => {
								this.getElRect(elClass);
							}, 10);
							return;
						}
						this[dataVal] = res.height;
						resolve();
					}).exec();
				})
			},
			// 观测元素相交状态
			async observer() {
				this.category_list.map((val, index) => {
					let observer = uni.createIntersectionObserver(this);
					// 检测右边scroll-view的id为itemxx的元素与right-box的相交状态
					// 如果跟.right-box底部相交，就动态设置左边栏目的活动状态
					observer.relativeTo('.right-box', {
						top: 0
					}).observe('#item' + index, res => {
						if (res.intersectionRatio > 0) {
							let id = res.id.substring(4);
							this.leftMenuStatus(id);
						}
					})
				})
			},
			// 设置左边菜单的滚动状态
			async leftMenuStatus(index) {
				this.current = index;
				// 如果为0，意味着尚未初始化
				if (this.menuHeight == 0 || this.menuItemHeight == 0) {
					await this.getElRect('menu-scroll-view', 'menuHeight');
					await this.getElRect('u-tab-item', 'menuItemHeight');
				}
				// 将菜单活动item垂直居中
				this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
			},
			// 获取右边菜单每个item到顶部的距离
			getMenuItemTop() {
				new Promise(resolve => {
					let selectorQuery = uni.createSelectorQuery();
					selectorQuery.selectAll('.class-item').boundingClientRect((rects) => {
						// 如果节点尚未生成，rects值为[](因为用selectAll，所以返回的是数组)，循环调用执行
						if (!rects.length) {
							setTimeout(() => {
								this.getMenuItemTop();
							}, 10);
							return;
						}
						rects.forEach((rect) => {
							// 这里减去rects[0].top，是因为第一项顶部可能不是贴到导航栏(比如有个搜索框的情况)
							this.arr.push(rect.top - rects[0].top);
							resolve();
						})
					}).exec()
				})
			},
			// 右边菜单滚动
			async rightScroll(e) {
				this.oldScrollTop = e.detail.scrollTop;
				if (this.arr.length == 0) {
					await this.getMenuItemTop();
				}
				if (this.timer) return;
				if (!this.menuHeight) {
					await this.getElRect('menu-scroll-view', 'menuHeight');
				}
				setTimeout(() => { // 节流
					this.timer = null;
					// scrollHeight为右边菜单垂直中点位置
					let scrollHeight = e.detail.scrollTop + this.menuHeight / 2;
					for (let i = 0; i < this.arr.length; i++) {
						let height1 = this.arr[i];
						let height2 = this.arr[i + 1];
						// 如果不存在height2，意味着数据循环已经到了最后一个，设置左边菜单为最后一项即可
						if (!height2 || scrollHeight >= height1 && scrollHeight < height2) {
							this.leftMenuStatus(i);
							return;
						}
					}
				}, 10)
			},

			//步进器
			valChange(e) {

			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-wrap {
		height: calc(100vh);
		/* #ifdef H5 */
		height: calc(100vh - var(--window-top));
		/* #endif */
		display: flex;
		flex-direction: column;
	}

	.total_price {
		font-size: 50rpx;
	}

	.u-search-box {
		padding: 18rpx 30rpx;
	}

	.u-menu-wrap {
		flex: 1;
		display: flex;
		overflow: hidden;
	}

	//左侧分类栏
	.u-search-inner {
		background-color: rgb(234, 234, 234);
		border-radius: 100rpx;
		display: flex;
		align-items: center;
		padding: 10rpx 16rpx;
	}

	//搜索栏
	.u-search-text {
		font-size: 26rpx;
		color: $u-tips-color;
		margin-left: 10rpx;
	}

	//左侧分类栏
	.u-tab-view {
		width: 200rpx;
		height: 100%;
	}

	//左侧分类栏
	.u-tab-item {
		height: 110rpx;
		background: #f6f6f6;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		color: #444;
		font-weight: 400;
		line-height: 1;
	}

	//左侧分类栏
	.u-tab-item-active {
		position: relative;
		color: #ffaa00;
		font-size: 30rpx;
		font-weight: 600;
		background: #fff;
	}

	//左侧分类栏
	.u-tab-item-active::before {
		content: "";
		position: absolute;
		border-left: 4px solid $u-type-primary;
		height: 32rpx;
		left: 0;
		top: 39rpx;
	}

	.right-box {
		background-color: rgb(250, 250, 250);
	}

	.page-view {
		padding: 16rpx;
	}

	//右边的商品栏（以类为单位）
	.class-item {
		margin-bottom: 30rpx;
		background-color: #fff;
		padding: 16rpx;
		border-radius: 8rpx;
	}

	.class-item:last-child {
		min-height: 100vh;
	}

	.item-title {
		font-size: 26rpx;
		color: $u-main-color;
		font-weight: bold;
	}

	.item-menu-name {
		font-size: 30rpx;
		margin-right: 0rpx;
		color: $u-main-color;
	}

	.item-container {
		display: flex;
		flex-wrap: wrap;
	}

	.thumb-box {
		width: 120%;
		//display: flex;
		//align-items: left;
		//justify-content: center;
		//flex-direction: column;
		margin-top: 20rpx;
	}

	.item-menu-image {
		width: 120rpx;
		height: 120rpx;
	}

	.demo-layout {
		height: 80rpx;
		border-radius: 8rpx;
	}

	.bg-purple-light {
		background: #e5e9f2;
	}
</style>
