<template>
	<view class="pages">
		<view v-if="detail.rank > 0" class="header">
			<view class="yq">{{ '今日邀请：' + (detail.yqNum || 0) }}</view>
			<view class="pm">
				排名
				<span class="num">{{ detail.rank || '-' }}</span>
			</view>
			<view class="xz">{{ '今日新增：' + (detail.addNum || 0) }}</view>
		</view>
		<view v-if="detail.rank == 0" class="tip">
			今日暂无排名
		</view>
		<view class="btns">
			<view class="btn" @click="openList">添加任务</view>
			<view class="text">{{ missionName || '--' }}</view>
			<view class="close" @click="removeItem">清空任务</view>
		</view>
		<view v-if="!isShow">
			<scroll-view class="scroll-view" :refresher-triggered="triggered" scroll-y="true" refresher-enabled="{{true}}" :enable-pull-down-refresh="true" refresher-two-level-enabled="{{true}}" @refresherrefresh="downCallback" refresher-two-level-scroll-enabled="{{true}}">
				<view class="user-content">
					<uni-collapse ref="collapse" accordion class="coll-apse" v-model="activeData" @change="collapseChange">
						<view v-for="item in mineMissionList" :key="item.key" class="coll-item">
							<uni-swipe-action class="swipe-action">
								<uni-swipe-action-item class="action-item" :right-options="options" :show="isOpened" :auto-close="false" @change="actionChange" @click="bindClick(item)">
									<uni-collapse-item class="item">
										<template v-slot:title>
											<view class="coll-header">
												<view class="user">
													<view class="code">{{ item.code || '-' }}</view>
													<view class="name">{{ '业务员：' + item.userName || '-' }}</view>
												</view>
												<view class="num">
													<view>{{ '已邀请：' + (item.total || 0) + '; 已添加：' + item.addTotal }}</view>
												</view>
											</view>
										</template>
										<view class="main">
											<view class="add">
												<view class="add-title">客户备注:</view>
												<view class="add-input">
													<uni-easyinput v-model="client" :clearable="false" placeholder="手机号/备注"></uni-easyinput>
												</view>
												<view class="invite" @click="dialogInputConfirm(item)">添加邀请</view>
											</view>
											<view class="detail" v-for="(dataItem, dataIndex) in item.taskCustomerLogList" :key="dataIndex">
												<view class="detail-name">{{ dataItem.customerName }}</view>
												<view class="detail-time">{{ dataItem?.createTime.substring(5, 10) + ' ' + dataItem?.createTime.substring(11, 16) }}</view>
												<view class="detail-btns">
													<view v-if="dataItem.auditStatus != '已添加'" class="detail-pass" @click="pass(dataItem)">已通过</view>
													<view v-if="dataItem.auditStatus == '已添加'" class="detail-text">已添加</view>
													<view v-if="dataItem.auditStatus != '已添加'" class="detail-remove" @click="removeCustomerItem(dataItem)">删除</view>
												</view>
											</view>
										</view>
									</uni-collapse-item>
								</uni-swipe-action-item>
							</uni-swipe-action>
						</view>
					</uni-collapse>
				</view>
			</scroll-view>
		</view>

		<view class="list-add" v-if="isShow">
			<view class="add-task">
				<view class="search">
					<uni-easyinput v-model="searchStr" prefixIcon="search" confirm-type="search" placeholder="标签/微信名/业务名筛选"></uni-easyinput>
					<view class="close-box" @click="closeAdd">
						<image src="/static/close.png" class="close-img" mode="widthFix"></image>
					</view>
				</view>
				<view class="select">
					<view class="select-line">
						<view class="select-item">
							<uni-data-select @change="sortClick" placeholder="排序" :localdata="[
								{
									text: '添加数顺序',
									value: 3
								},
								{
									text: '添加数倒序',
									value: 4
								},
								{
									text: '编号顺序',
									value: 2
								},
								{
									text: '编号倒序',
									value: 1
								}
							]" v-model="sort" :clear="false"></uni-data-select>
						</view>
						<view class="select-item">
							<uni-data-select @change="dataTypeClick" placeholder="数量" :localdata="[
								{
									text: '今日添加数',
									value: 1
								},
								{
									text: '本周添加数',
									value: 2
								},
								{
									text: '本月添加数',
									value: 3
								},
							]" v-model="dataType" :clear="false"></uni-data-select>
						</view>
						<view class="select-item">
							<uni-data-select @change="addTypeClick" placeholder="类型" :localdata="[
								{
									text: '全部',
									value: ''
								},
								{
									text: '未被添加',
									value: 1
								},
							]" v-model="addType" :clear="false"></uni-data-select>
						</view>
					</view>
				</view>
			</view>
			<scroll-view class="scroll-view-add" :refresher-triggered="triggeredadd" scroll-y="true" refresher-enabled="{{true}}" :enable-pull-down-refresh="true" refresher-two-level-enabled="{{true}}" @refresherrefresh="downCallbackadd" refresher-two-level-scroll-enabled="{{true}}">
				<uni-list class="table-box">
					<uni-list-item class="list">
						<!-- 自定义 body -->
						<template style="width: 100%;height: 100%;overflow: auto;" v-slot:body>
							<view class="list-item" v-for="item in wChatList" :key="item.id" @click="handleCheck(item)">
								<view class="detail">
									<view class="code">{{ item.code }}</view>
									<view v-if="item.userName" class="user-name">{{ item.userName || '-' }}</view>
									<view v-if="item.salesmanName" class="salesman-name">{{ item.salesmanName || '-' }}</view>
									<view v-if="item.trafficName" class="name">{{ item.trafficName + '任务' }}</view>
								</view>
								<view class="num">{{ item.customerCount || 0 }}</view>
							</view>
						</template>
					</uni-list-item>
				</uni-list>
			</scroll-view>
		</view>
		<tab :id="3" />
	</view>
</template>

<script>
import tab from "../../components/wyg-bottom-tab/wyg-bottom-tab.vue";

import { getWChatList, addMissionInfo, getMineMissionList, addCustomerInfo, removeMission, removeCustomer, auditStatus, getMineMissionRank, removeTaskUserMission } from '@/util/api';
export default {
	components: { tab },
	data() {
		return {
			wChatList: [],
			mineMissionList: [],
			activeData: [],
			missionInfo: {},
			missionName: '',
			client: '',
			sort: 2,
			dataType: 1,
			addType: '',
			drawerWidth: 0,
			searchStr: '',
			current: 1,
			total: 0,
			isShow: false,
			detail: {},
			options: [
				{
					text: '删除',
					style: {
						backgroundColor: '#db3231'
					}
				}
			],
			isOpened: 'none',
			triggered: false,
			triggeredadd: false
		}
	},
	onShow() {
		this.getWChatList()
		this.getMissionList()
	},
	onLoad() {

	},
	methods: {
		actionChange() {

		},
		bindClick(item) {
			let _this = this
			uni.showModal({
				title: '警告',
				content: '确定删除该任务吗?',
				success(res) {
					if (res.confirm) {
						removeTaskUserMission([item.id]).then(resData => {
							if (resData.code == 200) {
								uni.showToast({
									title: '操作成功',
									icon: 'none',
									success() {
										_this.isOpened = 'done'
										_this.getMissionList()
									}
								})
							}
						})
					} else {
						console.log("取消")
					}
				}
			})
		},
		async downCallbackadd() {
			this.triggeredadd = true
			await this.getMissionList()
			this.triggeredadd = false
		},

		async downCallback() {
			this.triggered = true
			await this.getWChatList()
			this.triggered = false
		},
		getMineMissionRank() {
			getMineMissionRank().then(res => {
				if (res.code == 200) {
					this.detail = res.data
				}
			})
		},
		removeCustomerItem(item) {
			let that = this
			uni.showModal({
				title: '警告',
				content: '确定删除该条数据吗?',
				success(res) {
					if (res.confirm) {
						removeCustomer(item.id).then(res => {
							uni.showToast({
								title: '操作成功',
								icon: 'none',
								success() {
									that.getMissionList()
								}
							})
						})
					} else {
						console.log("取消")
					}
				}
			})
		},
		collapseChange() {
			this.client = ''
		},
		removeItem(item) {
			let that = this
			uni.showModal({
				title: '警告',
				content: '确定清空任务吗?',
				success(res) {
					if (res.confirm) {
						removeMission([]).then(resData => {
							if (resData.code == 200) {
								uni.showToast({
									title: '操作成功',
									icon: 'none',
									success() {
										that.getMissionList()
									}
								})
							}
						})
					} else {
						console.log("取消")
					}
				}
			})
		},
		dialogInputConfirm(item) {
			if (!this.client) {
				uni.showToast({
					title: '内容不能为空',
					icon: 'none',
					mask: true
				})
				return
			}
			let params = {
				missionId: item.missionId,
				wxId: item.wchatId,
				userMissionId: item.id,
				customerName: this.client
			}
			let that = this
			addCustomerInfo(params).then(res => {
				that.client = ''
				that.getMissionList()
			})
		},
		async getMissionList() {
			await getMineMissionList().then(res => {
				let mineMissionList = res.data
				mineMissionList.forEach(i => {
					i.addTotal = 0
					if (i.taskCustomerLogList && i.taskCustomerLogList.length > 0) {
						i.taskCustomerLogList.forEach(j => {
							if (j.auditStatus) {
								i.addTotal += 1
							}
						})
					}
				});
				this.mineMissionList = mineMissionList
				this.missionName = (this.mineMissionList && this.mineMissionList.length > 0) ? this.mineMissionList[0].missionName : '--'
				this.$nextTick(() => {
					this.$refs.collapse.resize()
				})
			})
			this.getMineMissionRank()
		},
		handleCheck(item) {
			const _this = this
			if (item.trafficName) {
				return
			}
			let that = this
			let params = {
				wxId: item.id
			}
			addMissionInfo(params).then(res => {
				uni.showModal({
					title: '提示',
					content: '添加任务成功',
					showCancel: false,
					success() {
						_this.isShow = false
						that.getMissionList()
					}
				})
			})
		},
		getStatus(index) {
			if (index == null) {
				return ''
			}
			switch (index) {
				case 1:
					return '正常'
				case 2:
					return '异常'
				case 3:
					return '被封'
			}
		},
		async getWChatList() {
			await getWChatList({ sort: this.sort, dataType: this.dataType, searchStr: this.searchStr, add: this.addType, size: 99999, current: 1, statusFlag: 1, saleManStatusFlag: 1 }).then(res => {
				if (res.code == 200) {
					this.wChatList = res?.data?.records || []
					if (this.addType == 1) {
						let wChatList = []
						this.wChatList.forEach(i => {
							if (!i.trafficName) {
								wChatList.push(i)
							}
						})
						this.wChatList = wChatList
					}
					this.total = res.data.total
				}
			})
		},
		openList() {
			if (this.isShow) {
				return
			}
			this.drawerWidth = wx.getSystemInfoSync().windowWidth
			// this.getWChatList()
			this.isShow = true
		},
		sortClick(e) {
			console.log(e, '添加数');
			console.log(this.sort, '未被添加数');
			if (e == 1 || e == 2) {
				this.current = 1
				this.wChatList = []
				this.getWChatList()
			} else if (e == 3) {
				this.wChatList.sort(function (a, b) {
					return a.customerCount - b.customerCount;
				});
			} else if (e == 4) {
				this.wChatList.sort(function (a, b) {
					return b.customerCount - a.customerCount;
				});
			}
		},
		addTypeClick(e) {
			console.log(e, '今日添加数');
			console.log(this.addType, '未被添加数');
			this.current = 1
			this.wChatList = []
			this.getWChatList()
		},
		dataTypeClick(e) {
			console.log(e, '未被添加数');
			console.log(this.dataType, '未被添加数');
			this.current = 1
			this.wChatList = []
			this.getWChatList()
		},
		pass(item) {
			auditStatus({ userMissionId: item.id, customerId: item.id }).then(res => {
				if (res.code == 200) {
					uni.showToast({
						title: '已通过',
						icon: 'none',
						mask: true
					})
					this.getMissionList()
				}
			})
		},
		closeAdd() {
			this.isShow = false
		}
	}
}
</script>

<style lang="scss" scoped>
.pages {
	width: 100vw;
	height: 100vh;

	.header {
		display: flex;
		justify-content: space-between;
		font-size: 26rpx;
		padding: 24rpx 24rpx 0 24rpx;
		position: fixed;
		left: 0;
		right: 0;
		top: 0;

		.num {
			background-color: #de728e;
			border-radius: 50%;
			color: #fff;
			padding: 2rpx 14rpx;
		}
	}

	.tip {
		text-align: center;
		font-size: 28rpx;
		padding: 24rpx 0 0 0;
	}

	.btns {
		display: flex;
		justify-content: space-between;
		padding: 24rpx;
		color: #fff;
		font-size: 28rpx;
		border-bottom: 3rpx solid #eee;
		position: fixed;
		left: 0;
		right: 0;
		top: 64rpx;
		background: #fff;
		z-index: 9;

		.text {
			color: #000;
			margin: auto 0;
		}

		.btn {
			background: #58bd6a;
			padding: 12rpx 24rpx;
		}

		.close {
			background: #db3231;
			padding: 12rpx 24rpx;
		}
	}

	.user-content {
		overflow-y: auto;

		.item {
			// border-bottom: 3rpx solid #ebeef5;
			padding: 20rpx 24rpx 0 24rpx;
			display: block;
		}

		.user {
			display: flex;
			font-size: 24rpx;
			justify-content: space-between;

			.code {}

			.name {
				color: #fff;
				background: #58bd6a;
				padding: 4rpx 8rpx;
				border-radius: 4rpx;
				margin: auto 0;
			}
		}

		.num {
			padding: 4rpx;
			color: #969799;
			font-size: 24rpx;
		}

		::v-deep.uni-collapse-item__title {
			// border-bottom: 3rpx solid #eee;
			padding: 0 0 24rpx 0;

		}

		::v-deep.uni-collapse-item__title-arrow {
			margin-bottom: 34rpx;
		}

		.main {
			padding: 0 24rpx 0 0;

			.add {
				display: flex;
				justify-content: space-between;
				padding: 24rpx 0;
				border-bottom: 3rpx solid #eee;

				.add-title {
					margin: auto 0;
					color: #646566;
					white-space: nowrap;
				}

				.add-input {}

				.invite {
					background: #3d8bf2;
					border-radius: 8rpx;
					white-space: nowrap;
					text-align: center;
					font-size: 28rpx;
					color: #fff;
					width: 160rpx;
					display: flex;
					align-items: center;
					justify-content: center;

				}

			}

			.detail {
				display: flex;
				padding: 28rpx 0;
				justify-content: space-between;
				border-bottom: 3rpx solid #eee;

				&:last-child {
					border-bottom: none;
				}

				.detail-name {
					color: #646566;
				}

				.detail-time {
					color: #c8c9cc;
					font-size: 24rpx;
				}

				.detail-btns {
					display: flex;
					font-size: 28rpx;
					color: #fff;

					.detail-pass {
						background: #3d8bf2;
						padding: 24prx 28rpx;
						border-radius: 4rpx;
						width: 120rpx;
						text-align: center;
						margin: auto 12rpx auto 0;
					}

					.detail-text {
						color: #ccc;
						padding: 24prx 28rpx;
						border-radius: 4rpx;
						width: 120rpx;
						text-align: center;
						margin: auto 12rpx auto 0;
					}

					.detail-remove {
						background: #da3332;
						padding: 24prx 28rpx;
						width: 120rpx;
						border-radius: 4rpx;
						text-align: center;
						margin: auto 0;
					}
				}
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
	}


	.list-add {
		width: 100%;
		height: 100%;
		overflow-y: auto;
		padding-bottom: 50px;
		z-index: 999;
		padding-top: 130rpx;

		.add-task {
			position: fixed;
			left: 0;
			right: 0;
			top: 180rpx;
			bottom: 0;

			.search {
				display: flex;
				padding: 12rpx 24rpx;
				background: #fff;

				.close-box {
					margin: auto 24rpx;
					display: flex;

					.close-img {
						width: 38rpx;
						height: 38rpx;

					}
				}
			}

			.select {
				box-shadow: 0 16rpx 20rpx rgba(97, 95, 95, 0.5);
				background: #fff;

				.select-line {
					display: flex;
					justify-content: space-around;

					.select-item {
						width: 100%;

						::v-deep .uni-select__input-text {
							width: initial;
						}

						::v-deep .uni-select__input-box {
							justify-content: center;
						}
					}
				}
			}


		}

		.scroll-view-add {
			padding-bottom: 120rpx;
			overflow-y: auto;
			position: fixed;
			left: 0;
			right: 0;
			top: 340rpx;
			bottom: 0;

			.table-box {
				overflow-y: auto;

				.list {
					.list-item {
						display: flex;
						justify-content: space-between;
						font-size: 28rpx;
						width: 100%;
						padding: 32rpx 0;
						box-sizing: border-box;
						border-bottom: 3rpx solid #eee;

						.detail {
							display: flex;
							margin: auto 0;

							.code {
								margin: auto 0;
							}

							.user-name {
								border-radius: 4rpx;
								border: 3rpx solid #e48870;
								padding: 4rpx 6rpx;
								margin: auto 8rpx;
								color: #e48870;

							}

							.salesman-name {
								border: 3rpx solid #667d89;
								color: #667d89;
								margin: auto 0;
								padding: 4rpx 6rpx;
							}

							.name {
								border-radius: 4rpx;
								border: 3rpx solid #58bd6a;
								background: #58bd6a;
								color: #fff;
								padding: 4rpx 6rpx;
								margin: auto 8rpx;

							}
						}

						.num {}
					}
				}
			}
		}
	}
}








::v-deep .uni-easyinput__content-input {
	height: 66rpx;
}

::v-deep .uni-drawer__content {
	width: 100% !important;
}

.coll-header {}

.mesc-body {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	overflow: auto;
	bottom: 0;
	clear: both;

}
</style>