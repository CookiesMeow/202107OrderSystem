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
						border-color="#FF9E28" class="number_input" maxlength="12" />
				</form>
			</u-col>
		</u-row>
		<u-row>
			<view class="name_words">价格：</view>
			<u-input :type="type_number" placeholder="价格" v-model="dishInfo.price" :border="border"
				border-color="#FF9E28" class="price_input" maxlength="12" />
		</u-row>
		<u-select v-model="label_select_show" @confirm="changeCategory" :list="category_list"></u-select>
		<u-button class="select_button" @click="label_select_show = true">选择菜品种类</u-button>

		<!--删除菜品和确认修改-->
		<u-row gutter="6" justify="space-around" class="delete_save_area">
			<!--总价-->
			<u-col span="6">
				<!--@confirm:确认按钮事件、、、@cancel：取消按钮事件-->
				<u-modal v-model="delete_show" :title-style="{color: 'red'}" :show-confirm-button='true'
					:show-cancel-button='true' @confirm="removeDish">
					<view class="slot-content">
						<rich-text :nodes="content" class="words"></rich-text>
					</view>
				</u-modal>
				<u-button class="delete_button" @click="open">
					删除菜品
				</u-button>
			</u-col>

			<!--下单按钮-->
			<u-col span="6">
				<u-button class="confirm_button" @click="changeDish">
					保存修改
				</u-button>
			</u-col>
		</u-row>

	</view>
</template>

<script>
	import {
		getDishById,
		getCategoryList,
		changeDish,
		getCookie,
		host,
		removeDish
	} from '../../utils.js'
	export default {
		data() {
			return {
				type_text: 'text',
				type_number: 'number',
				change_image_show: false, //菜品图片
				label_select_show: false, //选择菜品种类
				delete_show: false, //删除菜品弹框
				content: `确认删除菜品？`,
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
				dishInfo: {}
			}
		},
		onLoad(option) {
			this.$set(this.uploadHeader, 'auth', getCookie('auth'))
			var this1 = this;
			const eventChannel = this.getOpenerEventChannel()
			if (JSON.stringify(eventChannel) != '{}') {
				// 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
				eventChannel.on('dishId', (data) => {
					getDishById(data['data'], (dish_info) => {
						this1.$set(this1, 'dishInfo', dish_info)
					})
				})
			}
			//category_list
			getCategoryList((categoryList) => {
				for (var i = 0; i < categoryList.length; i++) {
					var dct = {
						value: categoryList[i]['category_id'],
						label: categoryList[i]['name']
					}
					this1.$set(this1.category_list, i, dct)
				}

				console.log(categoryList)
			})
		},
		methods: {
			open() {
				this.delete_show = true;
			},
			changeDish() {
				this.$set(this.dishInfo, 'picture', escape(this.dishInfo.picture))
		
				changeDish(this.dishInfo,(data)=>{
					if(data.status==0){
						uni.showToast({
							title:"修改成功",
							duration:1000
						})
						setTimeout(
							uni.navigateBack,1000
						)
					}else{
						uni.showToast({
							title:data.msg,
							icon:'none'
						})
					}
				})
				this.$set(this.dishInfo, 'picture', unescape(this.dishInfo.picture))
						
			},
			changePicture(data, index, lists, name) {
				var code = data['data']
				this.dishInfo.picture = host + '/getPicture?id=' + code
				console.log(code)
			},
			removeDish(){
				removeDish(this.dishInfo.dish_id)
			},
			changeCategory(item) {
				console.log(item)
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

	.name_input {
		border-color: #000000;
		font-size: 50rpx;
		height: 100rpx;
		margin-top: 0rpx; //顶部距离
		width: 320rpx;
		margin-bottom: 15rpx;
		background-color: #eeeeee;
		border-radius: 20rpx
	}

	.number_input {
		height: 100rpx;
		margin-top: 15rpx; //顶部距离
		width: 320rpx;
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

	.words {
		width: 300rpx;
		height: 100rpx;
		font-size: 45rpx;
		margin-left: 50rpx;
	}
</style>
