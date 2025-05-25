<template>
	<view class="pages">
		<view class="headerClass">
			<view class="buttonClass" @click="openAdd"> 添加 </view>
			<uni-easyinput v-model="searchStr" prefixIcon="search" confirm-type="search" @confirm="iconClick" @clear="iconClick" placeholder="编号/归属人/名字/手机" @iconClick="iconClick">
			</uni-easyinput>
			<view class="statusClass">
				<uni-data-select @change="iconClick" placeholder="全部状态" :localdata="[
					{
						text: '全部',
						value: '',
					},
					{
						text: '正常',
						value: 1,
					},
					{
						text: '异常',
						value: 2,
					},
					{
						text: '封禁',
						value: 3,
					},
				]" v-model="searchStatus" :clear="false"></uni-data-select>
			</view>
		</view>
		<view class="table-header">
			<view class="table-item">编号</view>
			<view class="table-item">主体</view>
			<view class="table-item">话务/绑定</view>
			<view class="table-item">业务员</view>
			<view class="table-item">状态</view>
		</view>
		<scroll-view class="scroll-view" :refresher-triggered="triggered" scroll-y="true" refresher-enabled="{{true}}" :enable-pull-down-refresh="true" refresher-two-level-enabled="{{true}}" @refresherrefresh="downCallback" refresher-two-level-scroll-enabled="{{true}}">
			<view v-if="wChatList && wChatList.length > 0" class="table-box">
				<view v-for="(item, index) in wChatList" :key="index" @click="openEdit(item)">
					<uni-swipe-action class="swipe-action">
						<uni-swipe-action-item class="action-item" :right-options="options" :show="isOpened" :auto-close="false" @change="actionChange" @click="bindClick(item)">
							<view class="table-tbody">
								<view class="table-item">
									{{ item.code }}
								</view>
								<view class="table-item">
									{{ item.mainName }}
								</view>
								<view class="table-item">
									{{ item.trafficName }}
								</view>
								<view class="table-item">
									{{ item.salesmanName }}
								</view>
								<view class="table-item">
									<view :style="{
										color:
											item.statusFlag == 1
												? 'green'
												: item.statusFlag == 2
													? 'orange'
													: item.statusFlag == 3
														? 'red'
														: 'gray',
									}">
										{{
											item.statusFlag == 1
												? "正常"
												: item.statusFlag == 2
													? "异常"
													: item.statusFlag == 3
														? "封禁"
														: "--"
										}}
									</view>
								</view>
							</view>
						</uni-swipe-action-item>
					</uni-swipe-action>
				</view>
			</view>
			<view v-if="wChatList && wChatList.length == 0" class="none-data">
				<noData />
			</view>
		</scroll-view>
		<uni-popup ref="editPopup" borderRadius="10px" background-color="#fff" type="dialog">
			<view class="editClass">
				<view class="editHeaderClass">
					<view class="title">
						{{ title }}
					</view>
					<view @click="closeDialog">
						<uni-icons type="closeempty"></uni-icons>
					</view>
				</view>
				<view class="editContentClass">
					<view class="editItemClass">
						<view class="label-title">标签/编码</view>
						<uni-easyinput placeholder="请输入标签/编码" v-model="editData.code"></uni-easyinput>
					</view>
					<view class="editItemClass">
						<view class="label-title">微信名</view>
						<uni-easyinput placeholder="请输入微信名" v-model="editData.userName"></uni-easyinput>
					</view>
					<view class="editItemClass">
						<view class="label-title">所属主体</view>
						<uni-data-select :localdata="mainList" :clear="false" v-model="editData.mainId"></uni-data-select>
					</view>
					<view class="editItemClass">
						<view class="label-title">业务员</view>
						<uni-data-select :localdata="salesmanList" :clear="false" v-model="editData.salesmanId"></uni-data-select>
					</view>
					<view class="editItemClass">
						<view class="label-title">状态</view>
						<uni-data-select :clear="false" :localdata="[
							{
								text: '正常',
								value: 1,
							},
							{
								text: '异常',
								value: 2,
							},
							{
								text: '封禁',
								value: 3,
							},
						]" v-model="editData.statusFlag"></uni-data-select>
					</view>
					<view class="submit" @click="handleEdit">确 定</view>
				</view>
			</view>
		</uni-popup>
		<tab :id="4" />
	</view>
</template>

<script>
import { getWChatList, editWChatInfo, getSelectMainList, getSelectSalesmanList, removeWChatInfo } from '@/util/api';
import noData from '../component/noData.vue'
import tab from "../../components/wyg-bottom-tab/wyg-bottom-tab.vue";

export default {
	components: { noData, tab },
	data() {
		return {
			wChatList: [],
			total: 0,
			loading: false,
			mainList: [],
			salesmanList: [],
			editData: {
				code: null,
				userName: null,
				mainId: null,
				salesmanId: null,
				statusFlag: null
			},
			searchStr: null,
			searchStatus: null,
			title: '',
			options: [
				{
					text: '删除',
					style: {
						backgroundColor: '#db3231'
					}
				}
			],
			isOpened: 'none',
			triggered: false
		}
	},
	onLoad() {
		this.getWChatDataList()
		this.initMainList()
		this.initSalesmanList()
	},
	methods: {
		async downCallback() {
			this.triggered = true;
			await this.getWChatDataList()
			await this.initMainList()
			await this.initSalesmanList()
			this.triggered = false;
		},
		closeDialog() {
			this.$refs.editPopup.close()
		},
		async initMainList() {
			await getSelectMainList().then(res => {
				this.mainList = res.data
			})
		},
		async initSalesmanList() {
			await getSelectSalesmanList().then(res => {
				this.salesmanList = res.data
			})
		},
		async getWChatDataList() {
			this.loading = true
			await getWChatList({
				current: 1,
				size: 9999,
				searchStr: this.searchStr,
				statusFlag: this.searchStatus
			}).then(res => {
				this.wChatList = res.data.records || []
				this.total = res.data.total
				this.loading = false
			})
		},
		openEdit(item) {
			if ([2, 3].includes(item.statusFlag) && (item.updateTime && item.updateTime.length > 0)) {
				this.title = '编辑微信-上次被封：' + item.updateTime.substring(5, 16)
			} else {
				this.title = '编辑微信'
			}
			this.editData = item
			this.$refs.editPopup.open()
		},
		openAdd() {
			this.title = '新增微信'
			this.editData = {
				code: null,
				userName: null,
				mainId: null,
				salesmanId: null,
				statusFlag: null
			}
			this.$refs.editPopup.open()
		},
		iconClick() {
			this.getWChatDataList()
		},
		handleEdit() {
			let that = this
			if (!that.editData.code) {
				return that.hint('标签/编码不能为空')
			}
			if (!that.editData.userName) {
				return that.hint('微信名不能为空')
			}
			if (!that.editData.mainId) {
				return that.hint('请选择主体')
			}
			if (!that.editData.salesmanId) {
				return that.hint('请选择业务员')
			}
			if (!that.editData.statusFlag) {
				return that.hint('请选择状态')
			}
			editWChatInfo(this.editData).then(res => {
				uni.showModal({
					title: '提示',
					content: '操作成功',
					showCancel: false,
					success() {
						that.iconClick()
						that.$refs.editPopup.close()
					}
				})
			})
		},
		actionChange() {

		},
		bindClick(item) {
			let _this = this
			uni.showModal({
				title: '警告',
				content: '确定删除该微信吗?',
				success(res) {
					if (res.confirm) {
						removeWChatInfo([item.id]).then(resData => {
							if (resData.code == 200) {
								uni.showToast({
									title: '删除成功',
									icon: 'none',
									success() {
										_this.isOpened = 'done'
										_this.getWChatDataList()
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
	}
}
</script>

<style lang="scss" scoped>
.pages {
	.headerClass {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10rpx 14rpx 10rpx 14rpx;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		background: #fff;
		z-index: 10;

		.buttonClass {
			display: flex;
			align-items: center;
			justify-content: center;
			color: white;
			background-color: #ff0000;
			padding: 15rpx;
			font-size: 28rpx;
			border-radius: 6rpx;
		}

		::v-deep .is-input-border {
			border-radius: 8rpx 0 0 8rpx;
		}

		::v-deep .uni-easyinput__content-input {
			height: 66rpx;
		}

		.statusClass {
			z-index: 9;
		}
	}

	.table-header {
		display: flex;
		width: 100%;
		justify-content: space-between;
		background: #e5e5e5;
		font-size: 28rpx;
		padding: 20rpx 28rpx;
		box-sizing: border-box;
		position: fixed;
		top: 86rpx;
		left: 0;
		right: 0;
		z-index: 9;

		.table-item {
			white-space: nowrap;
			text-align: center;

			&:first-child {
				width: 15%;
			}

			&:nth-child(2) {
				width: 35%;
			}

			&:nth-child(3) {
				width: 20%;
			}

			&:nth-child(4) {
				width: 20%;
			}

			&:nth-child(5) {
				width: 10%;
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
		display: flex;
		width: 100%;
		justify-content: space-between;
		color: #000;
		font-size: 24rpx;
		padding: 24rpx 28rpx;
		box-sizing: border-box;
		border-bottom: 2rpx solid #ccc;
		overflow: hidden;

		.table-item {
			white-space: nowrap;
			text-align: center;

			&:first-child {
				width: 15%;
			}

			&:nth-child(2) {
				width: 35%;
			}

			&:nth-child(3) {
				width: 20%;
			}

			&:nth-child(4) {
				width: 20%;
			}

			&:nth-child(5) {
				width: 10%;
			}
		}
	}
}

.swipe-action {}

.action-item {
	display: block;
}

.editClass {
	width: 80vw;
	padding: 0 24rpx 24rpx 24rpx;
	border-radius: 12rpx;

	.editHeaderClass {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: solid 1rpx #e8e8e8;
		padding: 16rpx 0;

		.title {
			font-size: 32rpx;
		}
	}

	.form-content {
		.form-item {
			margin: 0;
		}
	}

	.submit {
		width: 100%;
		background: #3d8bf2;
		text-align: center;
		color: white;
		font-size: 28rpx;
		padding: 16rpx 0;
		border-radius: 6rpx;
	}

	::v-deep .uni-forms-item {
		margin-bottom: 10rpx;
		border-bottom: 1px solid #eee;

		&:first-child {
			border: none;
		}

		&:nth-child(2) {
			border: none;
		}
	}

	.editContentClass {
		width: 100%;

		.editItemClass {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;
			padding: 12rpx 0 12rpx 24rpx;
			color: #333;
			border-bottom: 1px solid #eee;
			position: relative;

			.label-title {
				width: 140rpx;
				font-size: 28rpx;
			}

			&::before {
				content: "*";
				color: red;
				position: absolute;
				left: 0;
			}
		}
	}

	::v-deep .uni-easyinput__content-input {
		height: 66rpx;
		width: 90%;
	}
}

::v-deep .uni-select__selector-item {
	white-space: nowrap;
	font-size: 28rpx;
}
</style>