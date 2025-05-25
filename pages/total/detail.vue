<template>
	<view class="pages">
		<view class="headerClass">
			<uni-easyinput v-model="remark" prefixIcon="search" confirm-type="search" @confirm="getTotalDetailData" @clear="getTotalDetailData" placeholder="备注搜索" @iconClick="getTotalDetailData">
			</uni-easyinput>
			<view class="statusClass">
				<uni-data-select @change="statusDetailData" placeholder="全部状态" :localdata="[
					{
						text: '全部',
						value: 0,
					},
					{
						text: '已添加',
						value: 1,
					},
					{
						text: '未添加',
						value: 2,
					},
				]" v-model="auditStatus" :clear="false"></uni-data-select>
			</view>
		</view>
		<view ref="table">
			<view class="table-header">
				<view class="table-item">备注</view>
				<view class="table-item">邀请时间</view>
				<view class="table-item">话务员</view>
				<view class="table-item">业务员</view>
				<view class="table-item">微信</view>
			</view>
			<scroll-view class="scroll-view" :refresher-triggered="triggered" scroll-y="true" refresher-enabled="{{true}}" :enable-pull-down-refresh="true" refresher-two-level-enabled="{{true}}" @refresherrefresh="downCallback" refresher-two-level-scroll-enabled="{{true}}">
				<view class="table-box" v-if="dataList && dataList.length > 0">
					<view class="table-tbody">
						<view v-for="(item, index) in dataList" :key="index" @click="deleteHander(item)" class="line-item">
							<view class="table-item tips-item">
								<view class="tips-title">{{ item.customerName }}</view>
								<view class="tips">{{ item.auditStatus }}</view>
							</view>
							<view class="table-item">
								{{ item.time }}
							</view>
							<view class="table-item">
								{{ item.trafficName }}
							</view>
							<view class="table-item">
								{{ item.salesmanName }}
							</view>
							<view class="table-item name-item">
								<!-- + '  (' + item.missionCount + ')' -->
								<view class="name-text">{{ item.userName }}</view>
								<image src="/static/right.png" class="right-img" mode="widthFix"></image>
							</view>
						</view>
					</view>
				</view>
				<view v-if="dataList && dataList.length == 0" class="none-data">
					<noData />
				</view>
			</scroll-view>
		</view>
		<uni-popup ref="popup" type="bottom">
			<view class="popup-content">
				<view class="title">{{ detail.createTime + ' 添加' }}</view>
				<view v-if="!detail.auditStatus" @click="pass" class="pass">通过</view>
				<view @click="remove" class="popup-line">删除</view>
				<view @click="close" class="popup-close">取消</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import { getUserTotalList, removeCustomerNew, auditStatus, getUserTotalListDetail } from '@/util/api'
import noData from '../component/noData.vue'
export default {
	components: { noData },
	data() {
		return {
			dataList: [],
			detail: {},
			params: {},
			remark: '',
			auditStatus: 0,
			dataListStandby: [],
			triggered: false
		}
	},
	onLoad(option) {
		this.params = JSON.parse(option.params)
		this.params.startTime = this.params.startTime + ' 00:00:00'
		this.params.endTime = this.params.endTime + ' 23:59:59'
		this.getTotalDetailData()
	},
	methods: {
		async downCallback() {
			this.triggered = true
			await this.getTotalDetailData()
			this.triggered = false
		},
		async getTotalDetailData() {
			let requestDeatil = ''
			if (this.params.type == 'all') {
				requestDeatil = getUserTotalListDetail
			} else if (this.params.type == 'single') {
				requestDeatil = getUserTotalList
			} else {
				requestDeatil = getUserTotalList
			}
			await requestDeatil({
				userId: this.params.userId ? this.params.userId : '',
				roleType: this.params.roleType,
				startTime: this.params.startTime,
				endTime: this.params.endTime,
				roleType: this.params.roleType,
				remark: this.remark,
				auditStatus: this.auditStatus
			}).then(res => {
				if (res.code == 200) {
					const dataList = res.data || []
					this.dataListStandby = res.data || []
					uni.setNavigationBarTitle({
						title: '明细总计：' + dataList.length
					});
					dataList.forEach(i => {
						i.time = i.createTime.substring(5, 16)
					});
					this.dataList = dataList
				} else {
					uni.showToast({
						title: res.error,
						icon: 'none',
						mask: true
					})
				}
			})
				.catch(err => {
					uni.showToast({
						title: err.error,
						icon: 'none',
						mask: true
					})
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
			removeCustomerNew([this.detail.customerId]).then(res => {
				uni.showToast({
					title: '删除成功',
					icon: 'none',
					mask: true
				})
				this.close()
				this.getTotalDetailData()
			})
		},
		pass() {
			auditStatus({ userMissionId: this.detail.missionId, customerId: this.detail.customerId }).then(res => {
				if (res.code == 200) {
					uni.showToast({
						title: '已通过',
						icon: 'none',
						mask: true
					})
					this.close()
					this.getTotalDetailData()
				}
			})
		},
		statusDetailData(e) {
			if (this.dataList && this.dataList.length > 0) {
				let dataList = []
				if (e == 0) {
					this.dataList = this.dataListStandby
				} else if (e == 1) {

					this.dataListStandby.forEach(i => {
						if (i.auditStatus && i.auditStatus == '已添加') {
							dataList.push(i)
						}
					})
					this.dataList = dataList
				} else if (e == 2) {
					this.dataListStandby.forEach(i => {
						if (!i.auditStatus) {
							dataList.push(i)
						}
					})
					this.dataList = dataList
				}
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.pages {
	.table-header {
		display: flex;
		width: 100%;
		justify-content: space-between;
		background: #e5e5e5;
		color: #656565;
		font-size: 28rpx;
		padding: 14rpx 28rpx;
		box-sizing: border-box;

		.table-item {
			white-space: nowrap;
			text-align: center;

			&:first-child {
				width: 25%;
			}

			&:nth-child(2) {
				width: 25%;
			}

			&:nth-child(3) {
				width: 15%;
			}

			&:nth-child(4) {
				width: 15%;
			}

			&:nth-child(5) {
				width: 20%;
			}
		}
	}

	.scroll-view {
		padding-bottom: 120rpx;
		overflow-y: auto;
		position: fixed;
		left: 0;
		right: 0;
		top: 180rpx;
		bottom: 0;

		.table-box {
			overflow-y: auto;
		}

	}
	.none-data {
		font-size: 36rpx;
		color: #656565;
		padding: 200rpx 0 0 0;
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
			border-bottom: 2rpx solid #ccc;
		}

		.tips-item {
			display: flex;

			.tips-title {
				width: 65%;
			}

			.tips {
				font-size: 24rpx;
				color: #bbb2b2;
				padding: 0 12rpx;
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
				width: 25%;
			}

			&:nth-child(2) {
				width: 25%;
			}

			&:nth-child(3) {
				width: 15%;
			}

			&:nth-child(4) {
				width: 15%;
			}

			&:nth-child(5) {
				width: 20%;
			}
		}
	}
}

.headerClass {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 14rpx;

	::v-deep .is-input-border {
		border-radius: 8rpx 0 0 8rpx;
	}

	::v-deep .uni-easyinput__content-input {
		height: 66rpx;
	}

	.statusClass {
		// width: 150rpx;
	}
}

::v-deep .uni-select__selector-item {
	white-space: nowrap;
	font-size: 28rpx;
}

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

	.pass {
		color: blue;
		padding: 24rpx 0;
		text-align: center;
		font-size: 36rpx;
		border-bottom: 8rpx solid #eee;
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