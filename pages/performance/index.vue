<template>
	<view class="pages">
		<view class="headerClass">
			<view class="header-item">
				<uni-data-select :localdata="[
					{
						text: '话务员',
						value: 1
					},
					{
						text: '业务员',
						value: 2
					},
					{
						text: '微信号',
						value: 3
					},
					{
						text: '任务分组',
						value: 4
					}
				]" :clear="false" v-model="roleType" @change="iconClick"></uni-data-select>
			</view>
			<view class="header-item">
				<uni-datetime-picker type="daterange" v-model="timeArray" @change="initData">{{ timeArray.length > 0 ? timeArray[0].substring(5) + '至' + timeArray[1].substring(5) : '选择日期' }}</uni-datetime-picker>
			</view>
		</view>
		<view class="contentClass">
			<view class="table">
				<view class="table-header">
					<view class="header-item">{{ '总业绩 ' + total }}</view>
				</view>
				<scroll-view class="scroll-view" :refresher-triggered="triggered" scroll-y="true" refresher-enabled="{{true}}" :enable-pull-down-refresh="true" refresher-two-level-enabled="{{true}}" @refresherrefresh="downCallback" refresher-two-level-scroll-enabled="{{true}}">
					<view v-if="dataList && dataList.length > 0" class="table-todoy">
						<view class="todoy-line" v-for="(item, index) in dataList" :key="index" @click="checkDetail(item)">
							<view class="header-item line-name">
								<view class="name-text">{{ item.name }}</view>
								<image v-if="[1, 2, 3].includes(item.rank)" :src="'/static/' + (item.rank == 1 ? 'first' : (item.rank == 2 ? 'second' : 'third')) + '.png'" class="rank-img" mode="scaleToFill" />
							</view>
							<view class="header-item">{{ item.receivedAmount }}</view>
						</view>
					</view>
					<view v-if="dataList && dataList.length == 0" class="none-data">
						<noData />
					</view>
				</scroll-view>
			</view>
		</view>
		<view v-if="role != 'b'" class="add-title" @click="addPerformance">
			<image src="/static/add.png" class="add-img" mode="scaleToFill" />
			<!-- <view class="add-text">添加</view> -->
		</view>
		<tab :id="5" />
	</view>
</template>

<script>
import { performanceList } from '@/util/api';
import noData from '../component/noData.vue'
import tab from "../../components/wyg-bottom-tab/wyg-bottom-tab.vue";

export default {
	components: { noData, tab },
	data() {
		return {
			roleType: 1,
			timeArray: [],
			dataList: [],
			total: '',
			downOption: {},
			role: '',
			triggered: false
		}
	},
	onShow() {
		let userInfo = uni.getStorageSync('userInfo')
		this.role = userInfo.userRole
		this.initDate()
		this.initTotalData()
	},
	methods: {
		async downCallback() {
			this.triggered = true
			this.dataList = []
			this.initDate()
			await this.initTotalData()
			this.triggered = false
		},
		iconClick() {
			this.dataList = []
			this.downCallback()
		},
		initDate() {
			const today = new Date();
			const year = today.getFullYear();
			const month = today.getMonth() + 1;  // 月份从0开始，所以要加1
			const day = today.getDate();
			const time = year + '-' + month + '-' + day
			this.timeArray = [time, time]
		},
		checkDetail(item) {
			let params = {
				id: item.id,
				roleType: this.roleType
			}
			if (this.timeArray.length > 1) {
				params.startTime = this.timeArray[0]
				params.endTime = this.timeArray[1]
			}
			uni.navigateTo({
				url: './detail?params=' + JSON.stringify(params)
			})
		},
		initData(e) {
			this.timeArray = e
			this.initTotalData()
		},
		async initTotalData() {
			const _this = this
			let params = {
				roleType: this.roleType
			}
			if (this.timeArray.length > 1) {
				params.startTime = this.timeArray[0] + ' 00:00:00'
				params.endTime = this.timeArray[1] + ' 23:59:59'
			}
			await performanceList(params).then(res => {
				const dataList = res.data
				_this.total = 0
				dataList.sort((a, b) => {
					if (a.num > b.num) return -1; // a应该排在b前面
					if (a.num < b.num) return 1;  // a应该排在b后面
					return 0; // 如果相同，保持原顺序
				});

				let rank = 0;
				let prevScore = null;
				dataList.forEach((player, index) => {
					_this.total += Number(player.receivedAmount)
					if (prevScore !== player.num) {
						rank++; // 新的排名始于当前索引加1
					}
					player.rank = rank; // 添加排名属性到每个对象中
					prevScore = player.num; // 更新prevScore为当前玩家的分数，用于下一次比较
				});
				_this.total = _this.total.toFixed(2)
				_this.dataList = dataList

			})
		},
		remove() {
			removeDetailInfo({ id: this.detail.id }).then(res => {
				uni.showToast({
					title: '删除成功',
					icon: 'none',
					mask: true
				})
			})
		},
		addPerformance() {
			uni.navigateTo({
				url: './add'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.pages {
	.headerClass {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 14rpx 18rpx 12rpx 18rpx;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 9;
		background: #fff;

		.header-item {
			font-size: 28rpx;
		}
	}

	.contentClass {
		padding-bottom: 40rpx;
		padding-top: 180rpx;

		.table {
			.table-header {
				display: flex;
				padding: 20rpx 24rpx 20rpx 42rpx;
				background: #ebebeb;
				position: fixed;
				top: 86rpx;
				left: 0;
				right: 0;
				z-index: 2;

				.header-item {
					width: 33.33%;
					font-size: 28rpx;
					margin: auto 0;

					.text {
						width: 60rpx;
						background: white;
						padding: 12rpx 20rpx;

					}

					&:first-child {}

					&:nth-child(2) {
						text-align: center;
					}

					&:nth-child(3) {
						text-align: right;
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

				.table-todoy {
					overflow-y: auto;

					.todoy-line {
						display: flex;
						padding: 0 24rpx 0 12rpx;
						border-bottom: 2rpx solid #eee;

						.line-name {
							display: flex;
							align-items: center;

							.name-text {
								white-space: nowrap;
								background: white;
								padding: 12rpx 12rpx 12rpx 20rpx;
							}

							.rank-img {
								width: 40rpx;
								height: 40rpx;
								display: flex;
							}
						}

						.item-num {
							display: flex;
							justify-content: flex-end;
						}

						.header-item {
							width: 33.33%;
							font-size: 28rpx;
							margin: auto 0;

							.right-img {
								width: 24rpx;
								height: 24rpx;
								margin: auto 8rpx;
							}

							&:first-child {
								padding: 12rpx 20rpx;
								background: white;
							}

							&:nth-child(2) {
								text-align: center;
							}

							&:nth-child(3) {
								text-align: right;
							}
						}
					}
				}
			}
			.none-data {
				font-size: 36rpx;
				color: #656565;
				text-align: center;
			}
		}
	}

}

.add-title {
	// border: 3rpx solid #529cf8;
	width: 120rpx;
	height: 120rpx;
	box-sizing: border-box;
	border-radius: 50%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	position: fixed;
	right: 20rpx;
	bottom: 160rpx;

	.add-text {
		font-size: 28rpx;
		color: #529cf8;
	}

	.add-img {
		width: 80rpx;
		height: 80rpx;
	}
}

.popup-content {
	background: white;
	padding: 24rpx 0 12rpx 0;
	border-radius: 20rpx 20rpx 0 0;

	.title {
		font-size: 36rpx;
		font-weight: 500;
		text-align: center;
		padding: 0 0 12rpx 0;
	}

	.popup-line {
		padding: 12rpx 0;
		text-align: center;
		font-size: 28rpx;
	}

	.popup-close {
		color: #807d7d;
		padding: 24rpx 0;
		font-size: 40rpx;
		text-align: center;
	}

}

::v-deep .uni-select__selector-item {
	white-space: nowrap;
}
</style>