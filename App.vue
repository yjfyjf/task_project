<script>
// import { wxLogin } from '@/util/api'

export default {
	onLaunch: function () {
		// let line = uni.getStorageSync('line')
		// let userInfo = uni.getStorageSync('userInfo')
		// let params = {
		// 	avatarUrl: userInfo.fileUrl,
		// 	userName: userInfo.userName,
		// 	name: userInfo.name,
		// 	lineId: line.id,
		// 	code: ''
		// }
		// wx.login({
		// 	success: async (res) => {
		// 		console.log(res);
		// 		params.code = res.code
		// 		const loginRes = await wxLogin(params)
		// 		uni.setStorageSync('userInfo', loginRes.data)
		// 	}
		// })
		console.log('App Launch')
	},
	onShow: function () {
		console.log('App Show')
	},
	onHide: function () {
		console.log('App Hide')
	}
}
</script>

<style>
/*每个页面公共css */
</style>
