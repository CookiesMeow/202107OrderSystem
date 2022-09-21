<template>
	<view>
		<view class="wrap">
			<u-row justify="flex-start">
				<u-col span="6">
					<u-input class="add_input" v-model="categoryName" type="text" />
				</u-col>
				<u-col span="6">
					<button class="add_button" @click="addCategory">添加标签</button>
				</u-col>
			</u-row>
		</view>

		<u-line color="orange"></u-line>

		<!--标签tabs-->
		<u-swipe-action :show="item.show" :index="index" v-for="(item, index) in list" :key="item.category_id"
			@click="click" @open="open" :options="options">
			<view class="item u-border-bottom">
				<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
				<view class="title-wrap">
					<text class="title u-line-2">{{ item.name }}</text>
				</view>
			</view>
		</u-swipe-action>
		<u-modal v-model="delete_show" :show-cancel-button="true" @confirm="confirmRemove" :content="delete_content">
		</u-modal>

		<!--弹出层-->
		<u-popup mode="top" v-model="modify_show">
			<view class="popup_area wrap">
				<view class="input_area">
					<u-input v-model="categoryNameToChange" placeholder="输入标签内容" class="modify_input" type="text" />
				</view>

				<button class="modify_buttom" @click="changeCategory"> 修改 </button>
			</view>
		</u-popup>
		<u-tabbar :list="tabbar" :mid-button="false"></u-tabbar>
	</view>
</template>

<script>
	import {
		getCategoryList,
		submitCategoryList,
		removeCategory,
		addCategory,
		changeCategory,
		getTabbar
	} from "../../../utils.js"
	export default {
		data() {
			return {
				list: [{
					"name": "bestselling",
					"position": 4,
					"category_id": 0
				}],
				tabbar: [],
				delete_show: false,
				delete_content: '确定删除？',
				categoryName: '',
				categoryNameToChange: '',
				modify_show: false,
				currentCategory: 0,
				disabled: false,
				btnWidth: 180,
				show: false,
				options: [{
						text: '修改',
						style: {
							backgroundColor: '#55aa00'
						}
					},
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				]
			};
		},
		onLoad() {
			this.refreshCategoryList()
			getTabbar(this)
		},
		methods: {
			click(index, index1) {
				this.currentCategory = index
				if (index1 == 1) {
					//this.list.splice(index, 1);
					this.delete_show = true
				} else {
					this.$set(this, 'categoryNameToChange',this.list[this.currentCategory].name)
					this.modify_show = true
				}
			},
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			open(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.list[index].show = true;
				this.list.map((val, idx) => {
					if (index != idx) this.list[idx].show = false;
				})
			},
			refreshCategoryList() {
				var this1 = this
				getCategoryList(
					(categoryList) => {
						this1.$set(this1, 'list', categoryList)
					}
				)
			},
			confirmRemove() {
				var to_remove = this.list[this.currentCategory].category_id
				removeCategory(to_remove)
				this.refreshCategoryList()
			},
			addCategory() {
				addCategory({
					'name': this.categoryName,
					'position': this.list.length
				})
				this.refreshCategoryList()
			},
			changeCategory() {
				this.$set(this.list[this.currentCategory], 'name', this.categoryNameToChange)
				changeCategory(this.list[this.currentCategory])
				this.modify_show = false
				this.refreshCategoryList()
			}
		}
	};
</script>

<style lang="scss" scoped>
	.wrap {
		padding: 24rpx;
	}

	.add_input {
		height: 80rpx;
		width: 430rpx;
		border-radius: 40rpx;
		background-color: #e6e6e6;
	}

	.add_button {
		height: 85rpx;
		width: 240rpx;
		margin-left: 100rpx;
		border-radius: 40rpx;
		background-color: #F29100;
	}

	.item {
		display: flex;
		padding: 20rpx;
	}

	.title {
		text-align: left;
		font-size: 28rpx;
		color: $u-content-color;
		margin-top: 20rpx;
		margin-left: 30rpx;
	}

	.popup_area {
		height: 500rpx;
	}

	.input_area {
		height: 120rpx;
		margin-top: 200rpx;
	}

	.modify_input {
		height: 100rpx;
		width: 100%;
		font-size: 50rpx;
		margin-left: rpx;
		background-color: #f1f1f1;
	}

	.modify_buttom {
		height: 100rpx;
		margin-top: 30rpx;
	}
</style>
