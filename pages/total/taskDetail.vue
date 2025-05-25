<template>
	<view class="pages">
		<scroll-view class="scroll-view" :refresher-triggered="triggered" scroll-y="true" refresher-enabled="{{true}}" :enable-pull-down-refresh="true" refresher-two-level-enabled="{{true}}" @refresherrefresh="downCallback" refresher-two-level-scroll-enabled="{{true}}">
			<view ref="table">
				<view v-if="dataList && dataList.length > 0">
					<view class="table-tbody">
						<view v-for="(item, index) in dataList" :key="index" @click="deleteHander(item)" class="line-item">
							<view class="table-item tips-item">
								<view class="tips-title">{{ item.chatCode }}</view>
								<view class="tips">{{ item.chatName }}</view>
								<view class="hwy">{{ item.hwyName }}</view>
							</view>
							<view class="table-item num-item">
								{{ '邀请：' + item.inviteCount }}
							</view>
							<view class="table-item add-num-item">
								{{ '添加：' + item.addCount }}
							</view>
							<view class="table-item name-item">
								<view class="name-text">{{ item.salesManName }}</view>
								<image src="/static/right.png" class="right-img" mode="widthFix"></image>
							</view>
						</view>
					</view>
				</view>
				<view v-if="dataList && dataList.length == 0" class="none-data">
					<noData />
				</view>
			</view>
		</scroll-view>
		<uni-popup ref="popup" class="popup-task-detail" type="bottom">
			<view class="popup-content">
				<view @click="remove" class="popup-line">删除</view>
				<view @click="close" class="popup-close">取消</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import noData from '../component/noData.vue'
import {
	getAboutMission, deleteMission
} from '@/util/api'
export default {
	components: { noData },
	data() {
		return {
			dataList: [],
			detail: {},
			userId: '',
			params: {},
			triggered: false
		}
	},
	onLoad(option) {
		this.params = option
		this.getAboutMission()
	},
	methods: {
		async downCallback() {
			this.triggered = true
			await this.getAboutMission()
			this.triggered = false
		},
		async getAboutMission() {
			await getAboutMission({
				userId: this.params.userId ? this.params.userId : '',
				roleType: this.params.roleType
			}).then(res => {
				this.dataList = res.data
			})
		},
		deleteHander(item) {
			this.detail = item
			this.$refs.popup.open()
		},
		close() {
			this.$refs.popup.close()
		},
		remove() {
			deleteMission({ missionId: this.detail.missionId, userId: this.detail.userId, chatId: this.detail.wchatId }).then(res => {
				uni.showToast({
					title: '删除成功',
					icon: 'none',
					mask: true
				})
				this.$refs.popup.close()
				this.getAboutMission()
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.pages {
	.scroll-view {
		padding-bottom: 120rpx;
		overflow-y: auto;
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;

		.table {
			overflow-y: auto;
		}

	}
	.none-data {
		font-size: 36rpx;
		color: #656565;
		text-align: center;
	}

	.table-tbody {
		width: 100%;
		color: #000;
		font-size: 24rpx;
		box-sizing: border-box;
		padding: 0 0 60rpx 0;

		.line-item {
			display: flex;
			justify-content: space-between;
			padding: 24rpx 28rpx;
			border-bottom: 2rpx solid #eee;
		}

		.tips-item {
			display: flex;

			.tips-title {
				width: 50%;
			}

			.tips {
				font-size: 24rpx;
				color: #bbb2b2;
				padding: 0 4rpx;
				border: 2rpx solid #ccc;
				margin: 0 0 0 4rpx;
			}

			.hwy {
				font-size: 24rpx;
				color: #307ff4;
				padding: 0 4rpx;
				border: 2rpx solid #ccc;
				margin: 0 0 0 14rpx;
			}
		}

		.name-item {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			margin: auto 0;

			.name-text {
				margin: auto 0;
			}

			.right-img {
				width: 28rpx;
				height: 28rpx;
				margin: auto 8rpx;
			}

		}

		.table-item {
			white-space: nowrap;
			text-align: center;

			&:first-child {
				width: 40%;
			}

			&:nth-child(2) {
				width: 15%;
			}

			&:nth-child(3) {
				width: 15%;
			}

			&:nth-child(4) {
				width: 15%;
			}

			&:nth-child(5) {
				width: 15%;
			}
		}

		.num-item {
			border: 2rpx solid #ccc;
			color: #656565;
		}

		.add-num-item {
			background: #508be7;
			color: #fff;
		}
	}
}

.popup-task-detail {}

.popup-content {
	background: white;
	padding: 24rpx 0;
	border-radius: 20rpx 20rpx 0 0;
	position: fixed;
	bottom: 0;
	right: 0;
	left: 0;

	.title {
		color: blue;
		font-size: 28rpx;
		text-align: center;
	}

	.popup-line {
		color: red;
		padding: 24rpx 0;
		text-align: center;
		font-size: 36rpx;
		border-bottom: 8rpx solid #eee;
	}

	.popup-close {
		color: #807d7d;
		padding: 24rpx 0;
		font-size: 36rpx;
		text-align: center;
	}

}
</style>