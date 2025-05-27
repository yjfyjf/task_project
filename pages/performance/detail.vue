<template>
	<view class="pages">
		<view class="header">
			<view class="allTotal">{{ '总业绩' + total }}</view>
			<view class="table-header">
				<view class="table-item">业绩</view>
				<view class="table-item">添加时间</view>
				<view class="table-item">话务员</view>
				<view class="table-item">业务员</view>
				<view class="table-item">来源</view>
				<view class="table-item">微信</view>
			</view>
		</view>
		<scroll-view class="scroll-view" :refresher-triggered="triggered" scroll-y="true" refresher-enabled="{{true}}" :enable-pull-down-refresh="true" refresher-two-level-enabled="{{true}}" @refresherrefresh="downCallback" refresher-two-level-scroll-enabled="{{true}}">
			<view ref="table">
				<view v-if="dataList && dataList.length > 0">
					<view class="table-tbody">
						<view v-for="(item, index) in dataList" :key="index" @click="deleteHander(item)" class="line-item">
							<view class="table-item">
								{{ item.receivedAmount }}
							</view>
							<view class="table-item">
								{{ item.createTime ? item.createTime.substring(0, 10) : '-' }}
							</view>
							<view class="table-item">
								{{ item.callAgentName }}
							</view>
							<view class="table-item">
								{{ item.technician }}
							</view>
							<view class="table-item">
								{{ item.source }}
							</view>
							<view class="table-item name-item">
								<view class="name-text">{{ item.wechatCode }}</view>
								<image src="/static/right.png" class="right-img" mode="widthFix"></image>
							</view>
						</view>
					</view>
				</view>
				<view v-if="dataList && dataList.length == 0" class="none-data">
					<noData />
				</view>
			</view>
			<uni-popup ref="popup" type="bottom">
				<view class="popup-content">
					<view class="title">{{ (detail.createTime ? detail.createTime.substring(0, 10) : '-') + ' 添加' }}</view>
					<view @click="update" class="popup-update">编辑</view>
					<view @click="remove" class="popup-line">删除</view>
					<view @click="close" class="popup-close">取消</view>
				</view>
			</uni-popup>
		</scroll-view>
	</view>
</template>

<script>
import { getPerformanceDetail, deletePerformance, getAllPerformance } from '@/util/api'
import noData from '../component/noData.vue'
export default {
	components: { noData },
	data() {
		return {
			dataList: [],
			detail: {},
			total: 0,
			params: {},
			triggered: false
		}
	},
	onLoad(option) {
		this.params = JSON.parse(option.params)
		if (this.params.type == 'all') {
			this.getAllPerformance()
		} else if (this.params.type == 'single') {
			this.getTotalDetailData()
		}
	},
	methods: {
		async downCallback() {
			this.triggered = true
			if (this.params.type == 'all') {
				await this.getAllPerformance()
			} else if (this.params.type == 'single') {
				await this.getTotalDetailData()
			}
			this.triggered = false
		},
		async getTotalDetailData() {
			const _this = this
			await getPerformanceDetail({
				id: _this.params.id,
				startTime: _this.params.startTime + ' 00:00:00',
				endTime: _this.params.endTime + ' 23:59:59',
				roleType: _this.params.roleType
			}).then(res => {
				_this.total = 0
				const dataList = res.data || []
				dataList.forEach(i => {
					i.time = i.createTime.substring(5, 16)
					if (_this.isNumber(i.receivedAmount)) {
						_this.total = _this.total + Number(i.receivedAmount)
					}
				});
				_this.dataList = dataList
			})
		},
		async getAllPerformance() {
			const _this = this
			let params = {
				page: 1,
				pageSize: 9999,
				startTime: _this.params.startTime + ' 00:00:00',
				endTime: _this.params.endTime + ' 23:59:59',
			}
			await getAllPerformance(params).then(res => {
				_this.total = 0
				if (res.code == 200) {
					const dataList = res.data.records || []
					dataList.forEach(i => {
						i.time = i.createTime.substring(5, 16)
						if (_this.isNumber(i.receivedAmount)) {
							_this.total = _this.total + Number(i.receivedAmount)
						}
					});
					_this.dataList = dataList
				}
			})
		},
		isNumber(value) {
			return /^[+-]?\d+(\.\d+)?$/.test(value);
		},
		deleteHander(item) {
			this.detail = item
			this.$refs.popup.open()
		},
		close() {
			this.$refs.popup.close()
		},
		update() {
			uni.navigateTo({ url: '/pages/performance/add?type=update&id=' + this.detail.id })
			this.close()
		},
		remove() {
			deletePerformance(this.detail.id).then(res => {
				if (res.code == 200) {
					this.close()
					this.getTotalDetailData()
				}
				uni.showToast({
					title: '删除成功',
					icon: 'none',
					mask: true
				})
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.pages {
	.header {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		.allTotal {
			font-size: 32rpx;
			padding: 24rpx 0;
			text-align: center;
		}

		.table-header {
			display: flex;
			width: 100%;
			background: #e5e5e5;
			color: #656565;
			font-size: 28rpx;
			padding: 14rpx 12rpx;
			box-sizing: border-box;

			.table-item {
				// white-space: nowrap;
				text-align: center;

				&:first-child {
					width: 20%;
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
					width: 15%;
				}

				&:nth-child(6) {
					width: 15%;
				}
			}
		}
	}

	.scroll-view {
		overflow-y: auto;
		position: fixed;
		left: 0;
		right: 0;
		top: 176rpx;
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
			width: 100%;
			box-sizing: border-box;
			padding: 24rpx 12rpx 24rpx 12rpx;
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
				white-space: nowrap;
			}

			.right-img {
				width: 28rpx;
				height: 28rpx;
				margin: auto 8rpx;
			}

		}

		.table-item {
			// white-space: nowrap;
			text-align: center;
			word-break: break-all;

			&:first-child {
				width: 20%;
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
				width: 15%;
			}

			&:nth-child(6) {
				width: 15%;
			}
		}
	}
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

	.popup-update {
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