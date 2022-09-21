import axios from 'axios'
export var host = "http://192.168.1.100:8000"
axios.defaults.withCredentials = true;
export function statusToStr(order_status) {
	if (order_status == 0)
		return '准备烹饪'
	if (order_status == 1)
		return '正在烹饪'
	if (order_status == 2)
		return '烹饪完毕'
	if (order_status == 3)
		return '已完成'
	return '准备烹饪'
}
export function getDishList(func) {
	axios.get(
		host + '/dish/getDishList'
	).then((response) => {
		func(response.data['data'])
	})
}
export function getOrderList(func) {
	axios.get(
		host + '/order/getOrderList'
	).then((response) => {
		func(response.data['data'])
	})
}
export function getLocalTime(nS) {
	return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
}
export function getOrderById(order_id, func) {
	axios.get(
		host + '/order/getOrderById', {
			params: {
				id: order_id
			}
		}
	).then(
		func
	)
}
export function removeUserByUsername(username,func) {
	axios.get(
		host + '/manage/removeUser', {
			params: {
				username: username
			}
		}
	).then(func)
}
export function removeDish(dish_id) {
	axios.get(
		host + "/dish/removeDish", {
			params: {
				dish_id: dish_id
			}
		}
	)
}
export function getDishById(dish_id, func) {
	axios.get(
		host + '/dish/getDishById', {
			params: {
				id: dish_id
			}
		}
	).then(
		(response) => {
			func(response.data['data'])
		}
	)
}
export function getCategoryList(func) {
	axios.get(
		host + '/category/getCategoryList'
	).then(
		(response) => {
			func(response.data['data'])
		}
	)
}
export function addCategory(category) {
	axios.post(
		host + "/category/add",
		category
	).then(
		(response) => {
			console.log(response)
		}
	)
}
export function changeCategory(category) {
	axios.post(
		host + "/category/change",
		category
	).then(
		(response) => {
			console.log(response)
		}
	)
}
export function removeCategory(category_id) {
	axios.get(
		host + "/category/remove", {
			params: {
				category_id: category_id
			}
		}
	).then(
		(response) => {
			console.log(response)
		}
	)
}
export function changeUserGroupByUsername(username, group, func) {
	axios.get(
		host + '/manage/changeUserGroup', {
			params: {
				username: username,
				group: group
			}
		}
	).then(
		func
	)
}
export function getUserList(func) {
	axios.get(
		host + '/getUserList'
	).then(
		(response) => {
			func(response.data['data'])
		}
	)
}
var waiter_tabbar = [{
		iconPath: "home",
		selectedIconPath: "home-fill",
		text: '订单列表',
		customIcon: false,
		pagePath: "/pages/waiter/orderPage"
	},
	{
		iconPath: "home",
		selectedIconPath: "home-fill",
		text: '待上菜',
		customIcon: false,
		pagePath: "/pages/waiter/serve"
	},
	{
		iconPath: "account",
		selectedIconPath: "account-fill",
		text: '我的',
		count: 0,
		isDot: false,
		customIcon: false,
		pagePath: "/pages/userInfo/userInfo"
	},
]
var cook_tabbar = [{
		iconPath: "/static/uview/example/js.png",
		selectedIconPath: "/static/uview/example/js_select.png",
		text: '订单管理',
		pagePath: "/pages/cook/orderPage"
	},
	{
		iconPath: "/static/uview/example/js.png",
		selectedIconPath: "/static/uview/example/js_select.png",
		text: '个人',
		pagePath: "/pages/userInfo/userInfo"
	}
]

var admin_tabbar = [{
		iconPath: "/static/dish.png",
		selectedIconPath: "/static/dish.png",
		text: '菜品管理',
		pagePath: "/pages/admin/dishManage"
	}, {
		iconPath: "/static/category.png",
		selectedIconPath: "/static/category.png",
		text: '标签管理',
		pagePath: "/pages/admin/category/changeCategory"
	}, {
		iconPath: "/static/orderLogo.png",
		selectedIconPath: "/static/orderLogo.png",
		text: '订单管理',
		pagePath: "/pages/admin/orderPage"
	}, {
		iconPath: "/static/announcement.png",
		selectedIconPath: "/static/announcement.png",
		text: '公告',
		pagePath: "/pages/admin/announcement/announcementPage"
	},
	{
		iconPath: "/static/userinfo.png",
		selectedIconPath: "/static/userinfo.png",
		text: '个人',
		pagePath: "/pages/userInfo/adminUserInfo"
	},
]
export function getTabbar(this1) {
	axios.get(
		host + '/userinfo/getUserinfo'
	).then(
		(response) => {
			if (response.data['status'] == 6) {
				document.location = "/pages/login/login.vue"
				console.log('log out')
				return
			}
			var group = response.data['data']['user_group']
			console.log(group)
			if (group == 0)
				this1.$set(this1, 'tabbar', admin_tabbar)
			else if (group == 1)
				this1.$set(this1, 'tabbar', cook_tabbar)
			else if (group == 2)
				this1.$set(this1, 'tabbar', waiter_tabbar)
			//判断当前页面是否为用户组对应页面。

		}
	)
}
export function getTopAnnoucement(func) {
	axios.get(
		host + '/announcement/top'
	).then(
		(response) => {
			func(response.data['data'])
		}
	)
}
export function getAnnouncementList(func) {
	axios.get(
		host + '/announcement/all'
	).then(
		(response) => {
			func(response.data['data'])
		}
	)
}
export function addAnnouncement(announcement) {
	axios.get(
		host + '/announcement/add', {
			params: {
				content: announcement
			}
		}
	)
}
export function addDish(dishInfo) {
	axios.post(
		host + '/dish/addDish',
		dishInfo
	).then(
		(response) => {
			console.log(response)
		}
	)
}
export function getCookie(name) {
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if (arr = document.cookie.match(reg))
		return unescape(arr[2]);
	else
		return null;
}
export function removeOrder(order_id) {
	axios.get(
		host + '/order/remove', {
			params: {
				order_id: order_id
			}
		}
	).then(
		(response) => {
			console.log(response)
		}
	)
}
export function getCaptchaByEmail(email) {
	axios.get(
		host + '/getVerificationCode', {
			params: {
				'email': email
			}
		}
	)
}
export function changePicture(new_picture) {
	axios.get(
		host + '/userinfo/change/picture', {
			params: {
				'new_picture': new_picture
			}
		}
	)
}
export function getUserInfo(func) {
	axios.get(
		host + '/userinfo/getUserinfo'
	).then(
		(response) => {
			func(response.data['data'])
		}
	)
}
export function getCaptcha() {
	axios.get(
		host + '/userinfo/getUserinfo'
	).then(
		(response) => {
			email = response.data['data']['email']
			axios.get(
				host + '/getVerificationCode', {
					params: {
						'username': response.data['data']['username']
					}
				}
			)
		}
	)
}
export function register(username, password, email, verification_code, invite_code) {
	axios.get(
		host + '/register', {
			params: {
				username: username,
				password: password,
				email: email,
				verification_code: verification_code,
				invite_code: invite_code
			}
		}
	).then(
		(response) => {
			console.log(response)
		}
	)
}
export function changeDish(dishInfo, func) {
	axios.post(
		host + "/dish/changeDish",
		dishInfo
	).then((response) => {
		func(response.data)
	})
}

export function getInviteCodeList(func) {
	axios.get(
		host + "/getInviteCodeList"
	).then(
		(response) => {
			func(response.data['data'])
		}
	)
}
export function addInviteCode(group) {
	axios.get(
		host + "/addInviteCode", {
			params: {
				user_group: group
			}
		}
	)
}
export function changeOrder(order, func) {
	axios.post(
		host + "/order/modifyOrderInfo",
		order
	).then(
		func
	)
}
