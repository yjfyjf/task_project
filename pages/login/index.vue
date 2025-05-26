<template>
	<view class="contentClass">
		<button class="photo" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
			<image style="width: 100%; height: 100%" mode="aspectFit" :src="avatarUrl">
			</image>
		</button>
		<view class="itemClass">
			<view class="item-view">
				<image src="/static/loca.png" class="img" mode="widthFix"></image>
				<view>公司</view>
			</view>
			<view class="item-company">
				<view class="company">{{ company }}</view>
				<image src="/static/right.png" class="img" mode="widthFix"></image>
			</view>
		</view>
		<view class="itemClass">
			<view class="item-view">
				<image src="/static/name.png" class="img" mode="widthFix"></image>
				昵称
			</view>
			<input type="nickname" v-model="userName" @change="getUserName" placeholder="请输入昵称" />
		</view>
		<view class="itemClass">
			<view class="item-view">
				<image src="/static/name.png" class="img" mode="widthFix"></image>
				姓名
			</view>
			<input type="text" v-model="name" placeholder="请输入姓名" />
		</view>
		<button :class="disabled ? 'buttonClass btn' : 'buttonClass'" :disabled="disabled" @click="handleLogin"> 提 交 </button>
	</view>
</template>

<script>
import { base_url } from '@/util/request';
import { wxLogin, testUserInfo } from '@/util/api';
export default {
	data() {
		return {
			avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
			fileUrl: null,
			userName: null,
			name: null,
			lineInfo: null,
			company: '--',
			disabled: false
		}
	},
	onLoad(option) {
		this.company = option.company
		this.lineInfo = uni.getStorageSync('line')
		this.testUserInfo()
	},
	methods: {
		testUserInfo()  {
			uni.showLoading({
				noConflict: true,
			});
			wx.login({
				success: async (res) => {
					console.log(res);
					const loginRes = await testUserInfo({code: res.code, lineId: this.lineInfo.id})
					let userInfo = loginRes.data[0]
					this.userName = userInfo.userName
					this.name = userInfo.name
					if (userInfo.statusFlag == 3 || userInfo.checkFlag == 0 || userInfo.checkFlag == 2) {
						this.disabled = true
						uni.showToast({
							title: userInfo.statusFlag == 3 ? '该账号已离职，无法登录' : (userInfo.checkFlag == 0 ? '该账号待审核，请等待管理员审核' : (userInfo.checkFlag == 2 ? '该账号审核不通过' : '')),
							icon: 'none',
							mask: true
						})
						return
					}
					console.log(loginRes, 'loginRes');
				},
				complete() {
					uni.hideLoading({
					noConflict: true,
					});
				},
			})
			
		},
		getUserName(data) {
			this.userName = data.detail.value
		},
		onChooseAvatar(e) {
			const temUrl = e.detail.avatarUrl
			this.avatarUrl = e.detail.avatarUrl
			uni.uploadFile({
				url: base_url + '/commonApi/uploadFileData',
				filePath: temUrl,
				name: 'file',
				success: (res) => {
					const resData = JSON.parse(res.data)
					this.fileUrl = resData.data
				}
			})
		},
		handleLogin() {
			let that = this
			let params = {
				avatarUrl: this.fileUrl,
				userName: this.userName,
				name: this.name,
				lineId: this.lineInfo.id,
				code: ''
			}
			wx.login({
				success: async (res) => {
					console.log(res);
					params.code = res.code
					const loginRes = await wxLogin(params)
					that.loginShow(loginRes.data)
				}
			})
		},
		loginShow(data) {
			if (data == null) {
				uni.showModal({
					title: '提示',
					content: '注册成功，请等待管理员审核',
					showCancel: false,
					success() {
						uni.navigateBack({
							delta: 1
						})
					}
				})
			} else {
				uni.setStorageSync('userInfo', data)
				uni.showToast({
					icon: 'success',
					title: '登录成功',
					success() {
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/home/index'
							})
						}, 1000)
					}
				})
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.contentClass {
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: center;
	margin-top: 10vh;

	.photo {
		width: 140rpx;
		height: 140rpx;

		border-radius: 50%;
		background: #f4f4f6;

		&::after {
			border: none;
		}
	}

	.itemClass {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 75%;
		margin-top: 60rpx;
		border-bottom: solid 1rpx #ededed;
		font-size: 32rpx;
		color: #787878;
		padding: 15rpx;
		.item-view{
			width: 160rpx; 
			display: flex;
			.img{
				width: 32rpx;
				height: 32rpx;
				margin: auto 8rpx auto 0;
			}
		}
		.item-company{
			display: flex;
			.company{

			}
			.img{
				width: 32rpx;
				height: 32rpx;
				margin: auto 8rpx;
			}
		}
	}

	.buttonClass {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 50rpx;
		width: 350rpx;
		background-color: #00aaff;
		// padding: 20rpx 0;
		color: #fff;
		font-size: 32rpx;
		border-radius: 20rpx;
	}
	.btn{
		background-color: #ccc;
	}
}
</style>