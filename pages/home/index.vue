<template>
	<view class="pages">
		<uni-popup ref="inputDialog" type="dialog">
			<uni-popup-dialog ref="inputClose" v-model="noticeStr" :value="noticeStr" :focus="false" mode="input" title="发布全局公告通知" placeholder="请输入公告内容" @confirm="handleAddNotice"></uni-popup-dialog>
		</uni-popup>
		<scroll-view class="scroll-view" :refresher-triggered="triggered" scroll-y="true" refresher-enabled="{{true}}" :enable-pull-down-refresh="true" refresher-two-level-enabled="{{true}}" @refresherrefresh="downCallback" refresher-two-level-scroll-enabled="{{true}}">
			<view class="not-popup">
				<uni-notice-bar showClose show-icon scrollable :text="noticeInfo.contentStr" />
			</view>
			<view class="headerClass">
				<view class="titleClass">
					<view class="titleItemClass">
						<view style="width: 160rpx">
							<uni-data-select v-model="handleType" :localdata="[
								{
									text: name,
									value: 0,
								},
								{
									text: '切换公司',
									value: 1,
								},
								{
									text: '退出',
									value: 2,
								},
							]" :clear="false"></uni-data-select>
						</view>
						<view style="font-size: 25rpx; color: #333">
							{{
								tyleSelect == 3 ? "本月" : tyleSelect == 2 ? "本周" : "今日"
							}}添加客户
						</view>
						<view class="time">
							<uni-data-select v-model="tyleSelect" :localdata="[
								{
									text: '今日',
									value: 1,
								},
								{
									text: '本周',
									value: 2,
								},
								{
									text: '本月',
									value: 3,
								},
							]" :clear="false"></uni-data-select>
						</view>
					</view>
					<view class="numClass">
						{{ homeTotal.todayNum }}
					</view>
					<view class="buttonClass">
						<view class="buttonItemClass" @click="openNotice">
							{{ ['a', 'd'].includes(role) ? "发送全局公告" : "查看统计" }}
						</view>
					</view>
					<view class="totalClass">
						<view class="totalItemClass">
							<view class="totalItemNumClass">
								<view class="name">{{ tyleSelect == 3 ? "本月" : tyleSelect == 2 ? "本周" : "今日" }}已邀请</view>
								<view>
									{{ homeTotal.numData || "-" }}
								</view>
							</view>
						</view>
						<!-- 设置任务 -->
						<view v-if="['a', 'd'].includes(role)" class="totalItemClass">
							<view class="totalItemActivityClass" @click="openTask">
								{{ taskName ? taskName.name : "无" }}
							</view>
						</view>
						<view class="totalItemClass">
							<view v-if="['a', 'd'].includes(role)" class="totalItemNumClass">
								<view class="name"> 累计新增 </view>
								<view>
									{{ homeTotal.totalNum }}
								</view>
							</view>
							<view v-else class="totalItemNumClass">
								<view class="name">{{ (tyleSelect == 1 ? "今日" : tyleSelect == 2 ? "本周" : tyleSelect == 3 ? "本月" : "-") + "排行" }}</view>
								<view class="total-num">{{ (['a'].includes(role) ? homeTotal.totalNum : homeTotal.rank || '-') }}</view>
							</view>
						</view>
					</view>
					<view v-if="['a', 'c', 'd'].includes(role)" class="userDataClass">
						<view class="userDataItemClass" @click="goUser">
							<view class="name"> 话务员 </view>
							<view>
								<text>{{ homeTotal.hwyNum }}</text>/
								<text>{{ homeTotal.hwyTotalNum }}</text>
							</view>
						</view>
						<view class="userDataItemClass" @click="goWChat">
							<view class="name"> 微信总数 </view>
							<view>
								<text>{{ homeTotal.weChatNum }}</text>/
								<text>{{ homeTotal.weChatTotalNum }}</text>
							</view>
						</view>
					</view>
					<view v-if="['a', 'd'].includes(role)" class="configClass">
						<view @click="goSalesmanInfo" class="configItemClass" style="border: solid 1rpx #00aaff; background-color: #00aaff">
							业务员设置 {{ homeTotal.ywyNum }}/{{ homeTotal.ywyTotalNum }}
						</view>
						<view @click="bonus" class="configItemClass" style="border: solid 1rpx #00cf00; background-color: #00cf00">
							奖励设置
						</view>
						<!-- <view @click="handerUser" class="configItemClass" style="border: solid 1rpx orange; background-color: orange">
							用户
						</view> -->
						<view @click="goMain" class="configItemClass" style="border: solid 1rpx #ff0000; background-color: #ff0000">
							主体设置 {{ homeTotal.mainNum }}
						</view>
					</view>
				</view>
			</view>
			<view v-if="userTotalList && userTotalList.length > 0" class="userClass">
				<view class="userItemClass" style="justify-content: start; color: #aaaaaa">
					<uni-icons type="medal" size="25" color="#aaaaaa"></uni-icons>
					<view class="rank">{{ (tyleSelect == 1 ? "今日" : tyleSelect == 2 ? "本周" : tyleSelect == 3 ? "本月" : "-") + "排行TOP3" }}</view>
				</view>
				<view class="user-item">
					<view>排名</view>
					<view>姓名</view>
					<view>{{ tyleSelect == 3 ? "本月" : tyleSelect == 2 ? "本周" : "今日" }}新增</view>
				</view>
				<scroll-view scroll-y="true">
					<view class="list">
						<view v-for="(item, index) in userTotalList" :key="index">
							<view v-if="item.totalNum > 0" class="list-item">
								<view class="rank">
									<image v-if="[1, 2, 3].includes(item.rank)" :src="'/static/' +
										(item.rank == 1
											? 'first'
											: item.rank == 2
												? 'second'
												: 'third') +
										'.png'
										" class="rank-img" mode="scaleToFill" />
									<view v-if="item.rank == 4" class="rank-num">4</view>
								</view>
								<view class="user-name">
									<view v-if="item.avatar_url" class="photo">
										<image :src="item.avatar_url && item.avatar_url.length > 0 ? ('https://www.zflh168.com' + item.avatar_url) : '../../static/mine.png'" class="photo-img" mode="scaleToFill" />
									</view>
									<view class="name">{{ item.name }}</view>
								</view>
								<view class="num">{{ item.totalNum }}</view>
							</view>
						</view>
						<!-- <uni-list-chat v-for="(item, index) in userTotalList" :key="index" class="list-item" :avatar-circle="true" :title="item.user_name" :avatar="'https://www.zflh168.com/' + item.avatar_url">
							<view class="chat-custom-right">
								<text class="chat-custom-text">{{ item.totalNum }}</text>
								<uni-icons type="star-filled" color="#999" size="18"></uni-icons>
							</view>
						</uni-list-chat> -->
					</view>
				</scroll-view>
			</view>
			<view class="date">
				<uni-calendar :startDate="dateTime" :endDate="dateTime"></uni-calendar>
			</view>
		</scroll-view>
		<uni-popup ref="taskDialog" type="dialog">
			<uni-popup-dialog ref="inputClose" mode="input" :focus="false" title="设置任务" :value="taskContent" v-model="taskContent" placeholder="请输入内容" @confirm="taskConfirm"></uni-popup-dialog>
		</uni-popup>
		<tab :id="1" />
	</view>
</template>

<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";

import tab from "../../components/wyg-bottom-tab/wyg-bottom-tab.vue";

import { getNoticeInfo, wxLogin, editNoticeInfo, getTask, createTask, getHomeTotalData, getHomeUserTotalList, getVerifyWord } from '@/util/api'

export default {
	mixins: [MescrollMixin], // 使用mixin
	components: { tab },
	props: {
	},
	data() {
		return {
			companyNum: 0,
			lineData: {},
			handleType: 0,
			noticeInfo: {},
			noticeStr: null,
			taskName: null,
			taskContent: null,
			homeTotal: {},
			tyleSelect: 1,
			userTotalList: [],
			dateTime: '',
			dataType: 1,
			name: '',
			role: '',
			triggered: false
		}
	},
	beforeCreate() {
		let line = uni.getStorageSync('line')
		let userInfo = uni.getStorageSync('userInfo') || {}
		let params = {
			avatarUrl: userInfo?.userInfo?.fileUrl,
			userName: userInfo?.userInfo?.userName,
			name: userInfo?.userInfo?.name,
			lineId: line.id,
			code: ''
		}
		wx.login({
			success: async (res) => {
				console.log(res);
				params.code = res.code
				const loginRes = await wxLogin(params)
				uni.setStorageSync('userInfo', loginRes.data)
			}
		})
	},
	onShow() {
		let userInfo = uni.getStorageSync('userInfo')
		this.name = userInfo?.userInfo?.name
		this.role = userInfo?.userRole
		this.initNotice()
		this.initTask()
		this.initTotal()
		this.getUserTotal()
		
	},
	watch: {
		tyleSelect() {
			this.initTotal()
			this.getUserTotal()
		},
		handleType() {
			if (this.handleType == 1) {
				uni.reLaunch({
					url: '/pages/index/index'
				})
			} else if (this.handleType == 2) {
				this.loginOut()
			}
		}
	},
	methods: {
		loginOut() {
			uni.removeStorageSync('line')
			uni.removeStorageSync('userInfo')
			uni.reLaunch({
				url: '/pages/index/index'
			})
		},
		async init() {
			this.lineData = uni.getStorageSync('line')
			this.name = uni.getStorageSync('userInfo')?.userInfo?.name
			this.dateTime = this.getDate(new Date(), 30).fullDate
			await this.initNotice()
			await this.initTask()
			await this.initTotal()
			await this.getUserTotal()
			this.triggered = false;
		},
		getDate(date, AddDayCount = 0) {
			if (!date) {
				date = new Date()
			}
			if (typeof date !== 'object') {
				date = date.replace(/-/g, '/')
			}
			const dd = new Date(date)

			dd.setDate(dd.getDate() + AddDayCount) // 获取AddDayCount天后的日期

			const y = dd.getFullYear()
			const m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1 // 获取当前月份的日期，不足10补0
			const d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate() // 获取当前几号，不足10补0
			return {
				fullDate: y + '-' + m + '-' + d,
				year: y,
				month: m,
				date: d,
				day: dd.getDay()
			}
		},
		async getUserTotal() {
			let params = {
				dataType: this.tyleSelect
			}
			await getHomeUserTotalList(params).then(res => {
				const userTotalList = res.data
				userTotalList.sort((a, b) => {
					if (a.totalNum > b.totalNum) return -1; // a应该排在b前面
					if (a.totalNum < b.totalNum) return 1;  // a应该排在b后面
					return 0; // 如果相同，保持原顺序
				});

				let rank = 0;
				let prevScore = null;
				userTotalList.forEach((player, index) => {
					if (prevScore !== player.totalNum) {
						rank++; // 新的排名始于当前索引加1
					}
					player.rank = rank; // 添加排名属性到每个对象中
					prevScore = player.totalNum; // 更新prevScore为当前玩家的分数，用于下一次比较
				});
				this.userTotalList = userTotalList
			})
		},
		goUser() {
			if (['c', 'd'].includes(this.role)) { // 业务员经理
				uni.showToast({
					title: '暂无权限',
					icon: 'none',
					mask: true
				})
				return;
			}
			uni.navigateTo({
				url: '/pages/user/index'
			})
		},
		goWChat() {
			if (['c'].includes(this.role)) { // 业务员经理
				uni.showToast({
					title: '暂无权限',
					icon: 'none',
					mask: true
				})
				return;
			}
			uni.switchTab({
				url: '/pages/wxChat/index'
			})
		},
		openTask() {
			if (this.role == 'd') { // 业务员经理
				uni.showToast({
					title: '暂无权限',
					icon: 'none',
					mask: true
				})
				return;
			}
			this.taskContent = this?.taskName?.name
			this.$refs.taskDialog.open()
		},
		taskConfirm() {
			let that = this
			createTask({
				name: this.taskContent
			}).then(res => {
				uni.showModal({
					title: '提示',
					content: '操作成功',
					showCancel: false,
					success() {
						that.initTask()
						that.$refs.taskDialog.close()
					}
				})
			})
		},
		async initTask() {
			await getTask().then(res => {
				this.taskName = res.data
			})
		},
		goMain() {
			uni.navigateTo({
				url: '/pages/mainInfo/index'
			})
		},
		goSalesmanInfo() {
			uni.navigateTo({
				url: '/pages/salesman/index'
			})
		},
		async initNotice() {
			const res = await getNoticeInfo()
			this.noticeInfo = res.data
		},
		openNotice() {
			if (this.role == 'd') { // 业务员经理
				uni.showToast({
					title: '暂无权限',
					icon: 'none',
					mask: true
				})
				return;
			}
			if (this.role == 'a') { // 管理员
				this.$refs.inputDialog.open()
			} else { // 话务员、话务员经理
				uni.switchTab({
					url: '/pages/total/index'
				});
			}
		},
		handleAddNotice() {
			const _this = this
			getVerifyWord({ word: _this.noticeStr }).then(res => { // 是否为验证口令
				console.log(res, 'res');
				if (res.code == 200) {
					if (res.data == 1) { // 是口令
						_this.noticeStr = ''
						uni.navigateTo({ url: '/pages/totalAll/index' })
					} else {
						let params = {
							lineId: _this.lineData.id,
							contentStr: _this.noticeStr
						}
						editNoticeInfo(params).then(res => {
							if (res.code == 200) {
								uni.showToast({
									icon: 'none',
									title: '发送成功'
								})
								_this.noticeStr = ''
								_this.initNotice()
							} else {
								uni.showToast({
									icon: 'none',
									title: res.message
								})
							}
						})
					}
				} else {
					uni.showToast({
						icon: 'none',
						title: res.message
					})
				}
			})
				.catch(err => {
					console.log(err);
				})

		},
		async initTotal() {
			let params = {
				dataType: this.tyleSelect
			}
			await getHomeTotalData(params).then(res => {
				this.homeTotal = res.data
			})
		},
		bonus() {
			uni.showToast({
				title: '功能正在建设中',
				icon: 'none',
				mask: true
			})
		},
		handerUser() {
			if (this.role == 'a') {
				uni.navigateTo({ url: '/pages/user/index' })
			}
		},
		async downCallback() {
			this.triggered = true;
			await this.init()
		}
	}
}
</script>

<style lang="scss" scoped>
.pages {
	overflow: hidden;
	height: 100%;

	.scroll-view {
		height: 100%;
		overflow: auto;
		position: fixed;
		.headerClass {
			background: linear-gradient(to bottom, #a87053, white);
			padding: 34rpx 34rpx 0 34rpx;

			.titleClass {
				background-color: white;
				padding: 35rpx 0;
				border-radius: 25rpx;
				border: 2rpx solid #eee;
				box-shadow: 0 0 6rpx #888282;

				.titleItemClass {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 0 20rpx;

					.time {
						width: 120rpx;
					}
				}

				.numClass {
					display: flex;
					align-items: center;
					justify-content: center;
					color: #333;
					font-size: 50rpx;
					margin: 0 15rpx;
				}

				.buttonClass {
					display: flex;
					align-items: center;
					justify-content: center;
					margin-top: 35rpx;

					.buttonItemClass {
						display: flex;
						align-items: center;
						justify-content: center;
						color: white;
						width: 60%;
						padding: 18rpx;
						border-radius: 50rpx;
						font-size: 28rpx;
						background: linear-gradient(to bottom, #dedede, #a87053);
					}
				}

				.totalClass {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-top: 50rpx;

					.totalItemClass {
						width: 33%;
						font-size: 20rpx;

						.totalItemNumClass {
							display: flex;
							align-items: center;
							justify-content: center;
							flex-direction: column;

							.name {
								padding: 0 0 12rpx 0;
								color: #a59f9f;
							}

							.total-num {
								background: red;
								border-radius: 50%;
								padding: 4rpx 12rpx;
								color: #fff;
							}
						}

						.totalItemActivityClass {
							display: flex;
							align-items: center;
							justify-content: center;
							background-color: blue;
							color: white;
							padding: 10rpx;
							border-radius: 50rpx;
						}
					}
				}

				.userDataClass {
					display: flex;
					align-items: center;
					font-size: 20rpx;
					justify-content: space-between;
					margin-top: 30rpx;
					border-top: solid 1rpx #e6e6e6;
					border-bottom: solid 1rpx #e6e6e6;

					.userDataItemClass {
						display: flex;
						align-items: center;
						justify-content: center;
						flex-direction: column;
						width: 40%;
						padding: 16rpx;

						&:first-child {
							border-right: 1px solid #e6e6e6;
						}

						.name {
							padding: 0 0 12rpx 0;
							color: #a59f9f;
						}
					}
				}

				.configClass {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-top: 40rpx;

					.configItemClass {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 33%;
						font-size: 20rpx;
						height: 50rpx;
						color: white;
					}
				}
			}
		}

		.userClass {
			margin: 25rpx 0 0 0;
			margin-top: 20rpx;

			.userItemClass {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 18rpx 28rpx 16rpx 28rpx;
				font-size: 25rpx;
				color: #333;
				font-weight: bold;

				.rank {
					font-size: 28rpx;
					color: #655e5e;
					font-weight: normal;
					margin: 0 0 0 8rpx;
				}
			}

			.user-item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 12rpx 28rpx;
				font-size: 24rpx;
				color: #333;
				font-weight: bold;
				background: #f7f7f7;
				border-top: 1px solid #ccc;
				border-bottom: 1px solid #ccc;
			}

			.list {
				padding-bottom: 36rpx;

				.list-item {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 18rpx 48rpx 18rpx 30rpx;
					border-bottom: 1px solid #ccc;

					.rank {
						.rank-img {
							width: 40rpx;
							height: 40rpx;
						}

						.rank-num {
							width: 40rpx;
							height: 40rpx;
							line-height: 40rpx;
							border-radius: 50%;
							background: red;
							font-size: 24rpx;
							color: #fff;
							text-align: center;
						}
					}

					.user-name {
						display: flex;
						margin: auto 0;
						justify-content: center;
						align-items: center;
						padding: 0 24rpx 0 0;

						.photo {
							display: flex;
							justify-content: center;
							align-items: center;

							.photo-img {
								width: 40rpx;
								height: 40rpx;
								margin: auto 0;
								border-radius: 50%;
							}
						}

						.name {
							font-size: 28rpx;
							margin: auto 0 auto 8rpx;
						}
					}

					.num {
						text-align: center;
						padding: 2rpx 6rpx;
						color: white;
						background: #48a9f8;
						border-radius: 8rpx;
						font-size: 24rpx;
						margin: auto 0;
					}
				}
			}
		}

		.date {
			margin: 10rpx 0 0 0;

			::v-deep .uni-calendar__header-btn-box {
				display: none;
			}

			::v-deep .uni-calendar__backtoday {
				display: none;
			}

			::v-deep .uni-calendar__header {
				height: 80rpx;
			}
		}
	}

}

::v-deep .uni-noticebar {
	position: relative;
}

::v-deep .uni-noticebar {
	height: 100%;
}

::v-deep .uni-select__selector-item {
	white-space: nowrap;
	font-size: 28rpx;
}
</style>