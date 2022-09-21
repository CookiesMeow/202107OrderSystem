<!--修改菜品+添加新菜品页面-->
<template>
	<view>
		<u-row justify="flex-start">
			<u-col span="6">
				<u-upload :custom-btn="true" @on-success="changePicture" :header='uploadHeader'
					:show-upload-list="false" :action="uploadUrl" :file-list="fileList">
					<view slot="addBtn" class="slot-btn" hover-class="slot-btn__hover" hover-stay-time="150">
						<image class="logo" :src="dishInfo.picture" @click="change_image_show = true"></image>
					</view>
				</u-upload>

			</u-col>
			<u-col span='6'>
				<form>
					<view class="name_words">菜名：</view>
					<u-input :type="type_text" v-model="dishInfo.name" placeholder="菜名" :border="border"
						border-color="#FF9E28" maxlength="12" class="name_input" borderColor="#000000" type="circle" />
					<br>
					<view class="name_words">库存：</view>
					<u-input :type="type_number" v-model="dishInfo.stock" placeholder="库存" :border="border"
						border-color="#FF9E28" class="name_input" maxlength="12" />
				</form>
			</u-col>
		</u-row>
		<u-row>
			<view class="price_words">价格：</view>
			<u-input :type="type_number" placeholder="价格" v-model="dishInfo.price" :border="border"
				border-color="#FF9E28" class="price_input" maxlength="12" />
		</u-row>
		<u-select v-model="label_select_show" @confirm="changeCategory" :list="category_list"></u-select>
		<u-button class="select_button" @click="label_select_show = true">选择菜品种类</u-button>

		<!--删除菜品和确认修改-->
		<u-row gutter="6" justify="space-around" class="delete_save_area">
			<!--总价-->
			<u-col span="6">

			</u-col>

			<!--下单按钮-->
			<u-col span="6">
				<u-button class="confirm_button" @click="addDish">
					添加菜品
				</u-button>
			</u-col>
		</u-row>

	</view>
</template>

<script>
	import {
		getCategoryList,
		addDish,
		getCookie,host
	} from '../../utils.js'
	export default {
		data() {
			return {
				type_text: 'text',
				type_number: 'number',
				change_image_show: false, //菜品图片
				label_select_show: false, //选择菜品种类
				border: true,
				fileList: [],
				uploadUrl: host + '/uploadPicture',
				uploadHeader: {
					'auth': 'test'
				},
				//菜品种类
				category_list: [{
						value: '1',
						label: '推荐菜' //label显示的值
					},
					{
						value: '2',
						label: '招牌菜'
					}
				],
				//菜品图片
				image_list: [{
					text: '从相册选择中选择'
					//color: 'blue',	颜色
					//fontSize: 28		字体大小
				}, {
					text: '拍照'
				}],
				dishInfo: {
					"name": "",
					"price": 0,
					"picture": "/static/food/food.png",
					"category": 4,
					"stock": 20
				}
			}
		},
		onLoad() {
			var this1 = this;
			//category_list
			console.log(this.dishInfo)
			this.$set(this.uploadHeader, 'auth', getCookie('auth'))
			getCategoryList((categoryList) => {
				for (var i = 0; i < categoryList.length; i++) {
					var dct = {
						value: categoryList[i]['category_id'],
						label: categoryList[i]['name']
					}
					this1.$set(this1.category_list, i, dct)
				}
				this1.$set(this1.dishInfo, 'category', this1.category_list[0].value)
				console.log(categoryList)
			})

		},
		methods: {
			changePicture(data, index, lists, name) {
				var code = data['data']
				this.dishInfo.picture = host + '/getPicture?id=' + code
				console.log(code)
			},
			addDish() {
				console.log(this.dishInfo)
				addDish(this.dishInfo)
				uni.navigateBack({

				})
			},
			changeCategory(item) {
				this.$set(this.dishInfo, 'category', item[0].value)
			}
		}
	}
</script>

<style lang="scss">
	.wrap {
		padding: 24rpx;
	}

	.logo {
		height: 300rpx; //高
		width: 300rpx; //宽
		margin-top: 50rpx; //顶部距离
		margin-left: 40rpx;
		margin-bottom: 50rpx;
		border-radius: 40rpx
	}




	.select_button {
		height: 100rpx;
		width: 87%;
		margin-top: 50rpx;
		background-color: #FDF6EC;
	}

	.slot-content {
		font-size: 28rpx;
		color: $u-content-color;
		padding-left: 30rpx;
	}

	.delete_save_area {
		width: 90%;
		margin-top: 50rpx;
		margin-left: 40rpx;
		margin-right: 40rpx;
	}

	.delete_button {
		width: 300rpx;
		height: 100rpx;
		font-size: 50rpx;
		background-color: #aa0000;
		color: #FFFFFF;
	}

	.confirm_button {
		width: 300rpx;
		height: 100rpx;
		font-size: 50rpx;
		background-color: #ffaa00;
		color: #FFFFFF;
	}

	.name_words {
		font-size: 40rpx;
		margin-top: rpx;
	}

	.number_words {
		font-size: 40rpx;
	}

	.price_words {
		font-size: 40rpx;
		margin-left: 50rpx;
	}

	.name_input {
		border-color: #000000;
		font-size: 50rpx;
		height: 80rpx;
		margin-top: 0rpx; //顶部距离
		width: 320rpx;
		background-color: #eeeeee;
		border-radius: 20rpx
	}

	.number_input {
		height: 80rpx;
		width: 0rpx;
		background-color: #eeeeee;
		border-radius: 20rpx;
		border-color: #000000;
	}

	.price_input {
		height: 80rpx;
		width: 100rpx;
		margin-right: 50rpx;
		background-color: #eeeeee;
		border-radius: 20rpx;
		border-color: #000000;
	}
</style>
