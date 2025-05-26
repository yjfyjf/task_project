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
				<uni-datetime-picker type="daterange" v-model="timeArray" :value="timeArray" @change="initDataPicker">{{ startTimeDom && startTimeDom.length > 0 ? (startTimeDom + '至' + endTimesDom) : '选择日期' }}</uni-datetime-picker>
			</view>
			<view class="header-item">
				<uni-data-select :localdata="[
					{
						text: '在岗列表',
						value: 1
					},
					{
						text: '与我相关',
						value: 10
					},
					{
						text: '分组展示',
						value: 3
					}
				]" :clear="false" v-model="listType" @change="iconClick"></uni-data-select>
			</view>
		</view>

		<view class="contentClass">
			<view class="table">
				<view class="table-header">
					<view v-show="role != 'a'" @click="checkAll()" class="header-item">
						<view class="text">明细</view>
					</view>
					<view class="header-item">{{ '邀请 ' + total }}</view>
					<!-- <view class="header-item">{{roleType==3?'微信号':roleType==2?'业务员':'话务员'}}</view> -->
					<view class="header-item">{{ '新增 ' + addTotal }}</view>
					<!-- <view class="header-item">合计</view> -->
				</view>
				<scroll-view class="scroll-view" :refresher-triggered="triggered" scroll-y="true" refresher-enabled="{{true}}" :enable-pull-down-refresh="true" refresher-two-level-enabled="{{true}}" @refresherrefresh="downCallback" refresher-two-level-scroll-enabled="{{true}}">
					<view v-if="dataList && dataList.length > 0" class="table-todoy">
						<view :class="item.isOneself ? 'todoy-line todoy-line-oneself' : 'todoy-line'" v-for="(item, index) in dataList" :key="index" @click="checkDetail(item)">
							<view class="header-item line-name">
								<view class="name-text">{{ item.name }}</view>
								<!-- <image v-if="[1, 2, 3].includes(item.rank)" :src="'/static/' + (item.rank == 1 ? 'first' : (item.rank == 2 ? 'second' : 'third')) + '.png'" class="rank-img" mode="scaleToFill" /> -->
							</view>
							<view class="header-item-num">
								<span>{{ item.num }}</span>
								<span v-if="(item.num - item.addNum) > 0" class="item-no-add">{{ item.num - item.addNum }}</span>
							</view>
							<view class="header-item item-num">
								<view>{{ item.addNum }}</view>
								<!-- <image src="/static/right.png" class="right-img" mode="widthFix"></image> -->
							</view>
						</view>
					</view>
					<view v-if="dataList && dataList.length == 0" class="none-data">
						<noData />
					</view>
				</scroll-view>
			</view>
		</view>
		<uni-popup class="popup" ref="popup" type="bottom">
			<view class="popup-content">
				<view @click="remoDetail" class="popup-line">查看明细</view>
				<view @click="remoTask" class="popup-line">查看相关任务</view>
				<view @click="close" class="popup-close">取消</view>
			</view>
		</uni-popup>
		<tab :id="2" />
	</view>
</template>

<script>
import {
	getTotalData
} from '@/util/api';
import noData from '../component/noData.vue'
import tab from "../../components/wyg-bottom-tab/wyg-bottom-tab.vue";

export default {
	components: { noData, tab },
	data() {
		return {
			roleType: 1,
			timeArray: [],
			listType: 1,
			dataList: [],
			total: '',
			addTotal: '',
			detail: {},
			startTimeDom: '',
			endTimesDom: '',
			triggered: false,
			role: ''
		}
	},
	onLoad() {
	},
	onShow() {
		let userInfo = uni.getStorageSync('userInfo')
		this.role = userInfo?.userRole
		this.initDate()
		this.initTotalData()
		
	},
	methods: {
		async downCallback() {
			this.triggered = true
			this.dataList = []
			await this.initTotalData()
			this.triggered = false
		},
		initDate() {
			const today = new Date();
			const year = today.getFullYear();
			const month = today.getMonth() + 1;  // 月份从0开始，所以要加1
			const day = today.getDate();
			const time = year + '-' + month + '-' + day
			this.timeArray.push(time, time)
			if (this.timeArray && this.timeArray.length > 0) {
				this.startTimeDom = this.timeArray[0].substring(5)
				this.endTimesDom = this.timeArray[1].substring(5)
			}
		},
		checkDetail(item) {
			let userInfo = uni.getStorageSync('userInfo')
			if (['a', 'c', 'd'].includes(userInfo.userRole) || item.isOneself) {
				this.detail = item
				if (userInfo.userRole == 'a' && this.roleType == 4) {
					let params = {
						userId: this.detail.userId,
						roleType: this.roleType
					}
					if (this.timeArray.length > 1) {
						params.startTime = this.timeArray[0]
						params.endTime = this.timeArray[1]
					}
					uni.navigateTo({
						url: './detail?params=' + JSON.stringify(params)
					})
				} else {
					this.$refs.popup.open()
				}
			} else {
				return uni.showToast({
					title: '您没有权限查看',
					icon: 'none',
					mask: true
				})
			}
		},
		iconClick() {
			this.dataList = []
			this.downCallback()
		},
		initDataPicker(e) {
			this.timeArray = e
			if (this.timeArray && this.timeArray.length > 0) {
				this.startTimeDom = this.timeArray[0].substring(5)
				this.endTimesDom = this.timeArray[1].substring(5)
			}
			this.initTotalData()
		},
		async initTotalData() {
			const _this = this
			let params = {
				roleType: this.roleType,
				listType: this.listType
			}
			if (this.timeArray.length > 1) {
				params.startTime = this.timeArray[0]
				params.endTime = this.timeArray[1]
			}
			await getTotalData(params).then(res => {
				const dataList = res.data
				_this.total = 0
				_this.addTotal = 0
				dataList.sort((a, b) => {
					if (a.num > b.num) return -1; // a应该排在b前面
					if (a.num < b.num) return 1;  // a应该排在b后面
					return 0; // 如果相同，保持原顺序
				});

				let rank = 0;
				let prevScore = null;
				const userInfo = uni.getStorageSync('userInfo')
				dataList.forEach((player, index) => {
					_this.total += player.num
					_this.addTotal += player.addNum
					if (prevScore !== player.num) {
						rank++; // 新的排名始于当前索引加1
					}
					player.judgeId = player.judgeId ? player.judgeId.split(" ") : []
					if (player.judgeId.includes(userInfo.userInfo.id)) {
						player.isOneself = true
					}
					player.rank = rank; // 添加排名属性到每个对象中
					prevScore = player.num; // 更新prevScore为当前玩家的分数，用于下一次比较
				});
				this.dataList = dataList
			})
		},
		remoDetail() {
			const _this = this
			let params = {
				userId: _this.detail.userId,
				roleType: _this.roleType,
				type: 'single'
			}
			if (this.timeArray.length > 1) {
				params.startTime = this.timeArray[0]
				params.endTime = this.timeArray[1]
			}
			uni.navigateTo({
				url: './detail?params=' + JSON.stringify(params)
			})
			this.close()
		},
		remoTask() {
			uni.navigateTo({
				url: './taskDetail?userId=' + this.detail?.userId + '&roleType=' + this.roleType
			})
			this.close()
		},
		close() {
			this.$refs.popup.close()
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
		checkAll() {
			let userInfo = uni.getStorageSync('userInfo');
			let params = {
				userId: userInfo?.userInfo?.id,
				roleType: this.roleType,
				type: 'all'
			}
			if (this.timeArray.length > 1) {
				params.startTime = this.timeArray[0]
				params.endTime = this.timeArray[1]
			}
			uni.navigateTo({
				url: './detail?params=' + JSON.stringify(params)
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
		background: #fff;
		left: 0;
		right: 0;
		z-index: 9;

		.header-item {
			font-size: 28rpx;
		}
	}

	.contentClass {
		padding-bottom: 40rpx;
		padding-top: 192rpx;

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
						padding: 2rpx 20rpx;

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

			.table-todoy {
				.todoy-line {
					display: flex;
					padding: 0 44rpx 0 12rpx;
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

					.header-item-num {
						width: 33.33%;
						margin: auto 0;
						font-size: 28rpx;
						display: flex;
						align-items: center;
						justify-content: center;

						.item-no-add {
							color: orangered;
							border-radius: 50%;
							padding: 0 8rpx;
							font-size: 20rpx;
							border: 3rpx solid orangered;
							margin: 10rpx 0 0 0;
						}
					}


					.item-num {
						display: flex;
						justify-content: flex-end;
					}

					.header-item {
						width: 33.33%;
						margin: auto 0;
						font-size: 28rpx;

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

				.todoy-line-oneself {
					color: red;
				}
			}

			.none-data {
				font-size: 36rpx;
				color: #656565;
				padding: 200rpx 0 0 0;
				text-align: center;
			}
		}
	}


}




.popup-content {
	background: white;
	padding: 24rpx 0 18rpx 0;
	border-radius: 20rpx 20rpx 0 0;
	position: fixed;
	bottom: 0;
	right: 0;
	left: 0;

	.title {
		font-size: 36rpx;
		font-weight: 500;
		text-align: center;
		padding: 0 0 12rpx 0;
	}

	.popup-line {
		padding: 12rpx 0;
		text-align: center;
		font-size: 36rpx;
	}

	.popup-close {
		color: #807d7d;
		padding: 24rpx 0 16rpx 0;
		font-size: 30rpx;
		text-align: center;
	}

}

::v-deep .uni-select__selector-item {
	white-space: nowrap;
}
</style>