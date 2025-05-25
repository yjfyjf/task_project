<template>
	<view class="contentClass">
		<view v-if="role == 'a'" class="userClass">
			<uni-card :title="userInfo.userName" :sub-title="userInfo.name" :extra="role == 'a' ? '管理员' : ''" :thumbnail="userInfo.avatarUrl ? 'https://www.zflh168.com/' + userInfo.avatarUrl : '/static/name.png'" @click="handleUser">
			</uni-card>
		</view>
		<view style="width: 100%;margin-top: 50rpx;" :class="role == 'a' ? '' : 'buttonClass'">
			<button type="primary" v-if="role != 'a'" style="width: 100%;margin: 0 40rpx;box-sizing: border-box;" @click="goTask">添 加 任 务</button>
			<!-- <button type="warn" @click="loginOut">退 出 登 录</button> -->
		</view>
		<uni-popup ref="popup" class="task-popup" background-color="#fff" bottom @change="change">
			<taskIndex class="taskIndex" />
		</uni-popup>
		<tab :id="3" />
	</view>
</template>

<script>
import taskIndex from "/pages/task/index.vue";
import tab from "../../components/wyg-bottom-tab/wyg-bottom-tab.vue";
import { getMineMissionList } from '@/util/api';
export default {
	components: { tab },
	props: {
	},
	components: {
		taskIndex,
	},
	data() {
		return {
			role: ''
		}
	},
	onShow() {
		let userInfo = uni.getStorageSync('userInfo')
		this.role = userInfo.userRole
		getMineMissionList().then(res => {
			let mineMissionList = res.data || []
			if (mineMissionList && mineMissionList.length > 0) {
				uni.reLaunch({
					url: '/pages/task/index'
				})
			}
		})
	},
	methods: {
		handleUser() {

		},
		goTask() {
			// this.$refs.popup.open()
			uni.navigateTo({
				url: '/pages/task/index'
			})
		},
		loginOut() {
			uni.removeStorageSync('lineId')
			uni.removeStorageSync('userInfo')
			uni.reLaunch({
				url: '/pages/index/index'
			})
		},
		change() {

		}
	}
}
</script>

<style lang="scss" scoped>
.contentClass {
	display: flex;
	align-items: center;
	flex-direction: column;
}

.task-popup {
	width: 100vw;
	height: 100vh;
}

.userClass {
	color: #333;
	width: 100%;
}

.buttonClass {
	display: flex;
	align-items: center;
	justify-content: space-between;
}
</style>