<template>
	<view class="pages">
		<view class="headerClass">
			<uni-easyinput class="uni-mt-5" suffixIcon="search" placeholder="请输入搜索关键词" @iconClick="handleSearch" v-model="searchParams.searchStr"></uni-easyinput>
			<view class="buttonClass" @click="goGroup">
				分组管理
			</view>
		</view>
		<view class="classifyClass">
			<view class="classifyItemClass">
				<uni-data-select placeholder="全部状态" :localdata="[
					{
						text: '待审核',
						value: 4
					},
					{
						text: '在岗',
						value: 1
					},
					{
						text: '休假',
						value: 2
					},
					{
						text: '离职',
						value: 3
					}
				]" v-model="searchParams.statusFlag"></uni-data-select>
			</view>
			<view class="classifyItemClass">
				<uni-data-select placeholder="全部角色" :localdata="roleList" v-model="searchParams.roleId"></uni-data-select>
			</view>
			<view class="classifyItemClass">
				<uni-data-select placeholder="展示类型" :localdata="[
					{
						text: '列表',
						value: 1
					},
					{
						text: '分组',
						value: 2
					}
				]" v-model="dataType" :clear="false"></uni-data-select>
			</view>
		</view>
		<scroll-view class="scroll-view" :refresher-triggered="triggered" scroll-y="true" refresher-enabled="{{true}}" :enable-pull-down-refresh="true" refresher-two-level-enabled="{{true}}" @refresherrefresh="downCallback" refresher-two-level-scroll-enabled="{{true}}">
			<view class="userListClass" v-if="dataType == 1">
				<view class="main-user" v-if="userInfoList.length > 0">
					<view class="userItemClass" v-for="(item, index) in userInfoList" @click="openEdit(item)" :key="index">
						<uni-swipe-action class="swipe-action">
							<uni-swipe-action-item class="action-item" :right-options="options" :show="isOpened" :auto-close="false" @change="actionChange" @click="bindClick(item)">
								<view class="userClass">
									<view v-show="item.avatarUrl" class="name-title">
										<image :src="item.avatarUrl && item.avatarUrl.length > 0 ? ('https://www.zflh168.com' + item.avatarUrl) : '../../static/mine.png'" class="name-img"></image>
									</view>
									<view class="name-text">
										{{ item.name }}
									</view>
									<view class="status">
										<uni-tag class="tagClass" :text="item.roleName" type="primary" />
										<uni-tag class="tagClass" :text="item.statusFlag == 1 ? '在岗' : item.statusFlag == 2 ? '休假' : item.statusFlag == 3 ? '离职' : ''" :type="item.statusFlag == 1 ? 'success' : 'error'" />
										<uni-tag class="tagClass" :inverted="true" :text="item.groupName" type="error" />
									</view>
								</view>
								<!-- <view class="right-box">
									<image src="/static/right.png" class="right-img" mode="widthFix"></image>
								</view> -->
							</uni-swipe-action-item>
						</uni-swipe-action>
					</view>
				</view>
				<view v-else class="none-data">
					<noData />
				</view>
			</view>
			<view class="userListClass" v-else>
				<uni-collapse accordion>
					<uni-collapse-item :title="groupItem.group" v-for="(groupItem, groupIndex) in userInfoList" :key="groupItem.group">
						<view class="userItemClass" v-for="(item, index) in groupItem.itemData" @click="openEdit(item)" :key="index">
							<uni-swipe-action class="swipe-action">
								<uni-swipe-action-item class="action-item" :right-options="options" :show="isOpened" :auto-close="false" @change="actionChange" @click="bindClick(item)">
									<view class="userClass">
										<view v-show="item.avatarUrl" class="name-title">
											<image :src="item.avatarUrl && item.avatarUrl.length > 0 ? ('https://www.zflh168.com' + item.avatarUrl) : '../../static/mine.png'" class="name-img"></image>
										</view>
										<view class="name-text">
											{{ item.name }}
										</view>
										<uni-tag class="tagClass" :text="item.roleName" type="primary" />
										<uni-tag class="tagClass" :text="item.statusFlag == 1 ? '在岗' : item.statusFlag == 2 ? '休假' : item.statusFlag == 3 ? '离职' : ''" :type="item.statusFlag == 1 ? 'success' : 'error'" />
										<uni-tag class="tagClass" :inverted="true" :text="item.groupName" type="error" />
									</view>
									<!-- <view class="right-box">
										<image src="/static/right.png" class="right-img" mode="widthFix"></image>
									</view> -->
								</uni-swipe-action-item>
							</uni-swipe-action>
						</view>
					</uni-collapse-item>
				</uni-collapse>
				<view v-if="userInfoList.length == 0">
					<!-- <noData /> -->
				</view>
			</view>
		</scroll-view>
		<uni-popup ref="inputDialog" type="dialog">
			<view class="editClass">
				<view class="editHeaderClass">
					<view class="title">
						编辑用户
					</view>
					<view @click="closeDialog">
						<uni-icons type="closeempty"></uni-icons>
					</view>
				</view>
				<view v-if="editDataInfo.avatarUrl" style="display: flex;align-items: center;justify-content: center;margin-bottom: 18rpx;">
					<image :src="'https://www.zflh168.com/' + editDataInfo.avatarUrl" style="width: 100rpx;height: 100rpx;border-radius: 50%;"></image>
				</view>
				<uni-forms class="form-content" ref="baseForm">
					<uni-forms-item class="form-item" label="姓名:" label-width="80px" required>
						<uni-easyinput v-model="editDataInfo.name" placeholder="请输入姓名" />
					</uni-forms-item>
					<uni-forms-item class="form-item" label="微信名:" label-width="80px" required>
						<uni-easyinput v-model="editDataInfo.userName" placeholder="请输入微信名" />
					</uni-forms-item>
					<uni-forms-item class="form-item" label="状态:" label-width="80px" required>
						<uni-data-select v-model="editDataInfo.statusFlag" :clear="false" :localdata="[
							{
								text: '在岗',
								value: 1
							},
							{
								text: '休假',
								value: 2
							},
							{
								text: '离职',
								value: 3
							}
						]"></uni-data-select>
					</uni-forms-item>
					<uni-forms-item class="form-item" label="审核状态:" label-width="80px" required>
						<uni-data-select v-model="editDataInfo.checkFlag" :clear="false" :localdata="[
							{
								text: '待审核',
								value: 0
							},
							{
								text: '审核通过',
								value: 1
							},
							{
								text: '审核不通过',
								value: 2
							}
						]"></uni-data-select>
					</uni-forms-item>
					<uni-forms-item class="form-item" label="角色:" label-width="80px" required>
						<uni-data-select placeholder="全部角色" :localdata="roleList" :clear="false" v-model="editDataInfo.roleId"></uni-data-select>
					</uni-forms-item>
					<uni-forms-item class="form-item" label="归属组:" label-width="80px">
						<uni-data-select placeholder="全部分组" :localdata="groupInfoList" :clear="false" v-model="editDataInfo.groupId"></uni-data-select>
					</uni-forms-item>
					<view class="btns">
						<view v-if="editDataInfo.haveUserMission == 1" @click="handleRemove" class="remove">清除相关任务</view>
						<view @click="handleEdit" class="submit">确 定</view>
					</view>
				</uni-forms>
			</view>
		</uni-popup>
	</view>
</template>


<script>
import { getUserInfoList, getRoleList, getGroupList, editUserInfo, removeMission, deleteUser } from '@/util/api';
import noData from '../component/noData.vue'
export default {
	components: { noData },
	data() {
		return {
			userInfoList: [],
			pageInfo: {
				current: 1,
				size: 9999
			},
			searchParams: {
				searchStr: null,
				statusFlag: null,
				roleId: null
			},
			roleList: [],
			total: 0,
			dataType: 1,
			editDataInfo: {},
			groupInfoList: [],
			triggered: false,
			options: [
				{
					text: '删除',
					style: {
						backgroundColor: '#db3231'
					}
				}
			],
			isOpened: 'none',
		}
	},
	watch: {
		dataType() {
			this.init()
		},
		'searchParams.statusFlag'() {
			this.init()

		},
		'searchParams.roleId'() {
			this.init()
		}
	},
	onShow() {
	},
	onLoad() {
		this.getUserList()
		this.initRoleData()
		this.initGroupList()
	},
	methods: {
		init() {
			this.userInfoList = []
			this.getUserList()
		},
		async downCallback() {
			this.triggered = true
			await this.getUserList()
			this.triggered = false
		},
		goGroup() {
			uni.navigateTo({
				url: '/pages/group/index'
			})
		},
		handleEdit() {
			let that = this
			if (!that.editDataInfo.name) {
				return that.hint('姓名不能为空')
			}
			if (!that.editDataInfo.userName) {
				return that.hint('微信名不能为空')
			}
			if (!that.editDataInfo.statusFlag) {
				return that.hint('请选择状态')
			}
			if (!that.editDataInfo.checkFlag) {
				return that.hint('请选择审核状态')
			}
			if (!that.editDataInfo.roleId) {
				return that.hint('请选择角色')
			}
			// if (!that.editDataInfo.groupId) {
			// 	return that.hint('请选择归属组')
			// }
			editUserInfo(this.editDataInfo).then(res => {
				uni.showModal({
					title: '提示',
					content: '操作成功',
					showCancel: false,
					success() {
						that.$refs.inputDialog.close()
						that.handleSearch()
					}
				})
			})
		},
		hint(text) {
			uni.showToast({
				title: text,
				icon: 'none',
				duration: 2000
			});
		},
		async initGroupList() {
			await getGroupList().then(res => {
				this.groupInfoList = res.data
			})
		},
		closeDialog() {
			this.$refs.inputDialog.close()
		},
		async initRoleData() {
			await getRoleList().then(res => {
				this.roleList = res.data
			})
		},
		handleSearch() {
			this.getUserList()
		},
		async getUserList() {
			if (this.dataType == null || this.dataType == '') {
				uni.showToast({
					icon: 'error',
					title: '请先选择展示类型'
				})
				return
			}
			await getUserInfoList({
				...this.pageInfo,
				...this.searchParams,
				checkType: this.dataType
			}).then(res => {
				if (this.dataType == 1) {
					this.userInfoList = res.data.records
					this.total = res.data.total
				} else {
					this.userInfoList = res.data
				}
			})
		},
		openEdit(item) {
			this.editDataInfo = item
			this.$refs.inputDialog.open()
		},
		handleRemove() {
			removeMission({ idList: [this.editDataInfo.openId] }).then(resData => {
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
		},
		actionChange() {

		},
		bindClick(item) {
			let _this = this
			uni.showModal({
				title: '警告',
				content: '确定删除该用户吗?',
				success(res) {
					if (res.confirm) {
						deleteUser({ id: item.id }).then(resData => {
							if (resData.code == 200) {
								uni.showToast({
									title: '删除成功',
									icon: 'none',
									success() {
										_this.isOpened = 'done'
										_this.getUserList()
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
		justify-content: center;
		position: fixed;
		background: #fff;
		padding-top: 20rpx;
		left: 0;
		right: 0;
		top: 0;
		z-index: 9;

		::v-deep .is-input-border {
			border-radius: 8rpx 0 0 8rpx;
		}

		::v-deep .uni-easyinput__content-input {
			height: 66rpx;
		}

		.buttonClass {
			display: flex;
			align-items: center;
			justify-content: center;
			color: white;
			background-color: #58bd6a;
			padding: 16rpx 10rpx;
			font-size: 28rpx;
			border-radius: 4rpx;
		}
	}

	.classifyClass {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin: 10rpx 10rpx 0 10rpx;
		border-bottom: solid 1rpx #d9d9d9;
		background: #fff;
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		z-index: 8;
		padding-top: 80rpx;

		.classifyItemClass {
			width: 150rpx;
		}
	}

	.swipe-action {
		.action-item {
			display: flex;
		}
	}


	.scroll-view {
		overflow-y: auto;
		position: fixed;
		left: 0;
		right: 0;
		top: 180rpx;
		bottom: 0;
		width: 100%;

		.userListClass {
			width: 100%;
			// overflow-y: auto;
			box-sizing: border-box;

			.main-user {
				width: 100%;
				padding-bottom: 60rpx;
			}

			.userItemClass {
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: solid 1rpx #e8e8e8;
				padding: 16rpx 12rpx;

				.userClass {
					display: flex;
					align-items: center;
					width: 100vw;
					padding: 0 0 0 24rpx;
					.name-title {
						display: flex;

						.name-img {
							width: 48rpx;
							height: 48rpx;
							margin: auto 12rpx auto 0;
							border-radius: 50%;
						}
					}

					.name-text {
						font-size: 28rpx;
						margin: auto 8rpx auto 20rpx;
						width: 160rpx;
					}

					.status {
						display: flex;
						justify-content: center;
						padding: 0 0 0 24rpx;

						.tagClass {
							::v-deep .uni-tag {
								padding: 4rpx 6rpx;
								margin-right: 12rpx;
							}
						}
					}

				}

				.right-box {
					width: 32rpx;
					height: 32rpx;

					.right-img {
						width: 32rpx;
						height: 32rpx;
						margin: auto 8rpx auto 0;
					}
				}
			}

			.userClass {
				.tagClass {
					margin-right: 24rpx;
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




.editClass {
	background-color: white;
	padding: 20rpx;
	border-radius: 10rpx;
	width: 80vw;
	box-sizing: border-box;

	.editHeaderClass {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: solid 1rpx #e8e8e8;
		padding-bottom: 16rpx;
		margin-bottom: 16rpx;

		.title {
			font-size: 36rpx;
		}
	}

	.form-content {
		.form-item {
			margin: 0;
		}

	}

	.submit {
		background: #3d8bf2;
		text-align: center;
		color: white;
		font-size: 28rpx;
		padding: 16rpx 24rpx;
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

	::v-deep .uni-easyinput__content-input {
		height: 66rpx;
	}
}

::v-deep .uni-select__selector-item {
	white-space: nowrap;
	font-size: 28rpx;
}

.btns {
	display: flex;
	justify-content: space-between;

	.remove {
		background: red;
		text-align: center;
		color: white;
		font-size: 28rpx;
		padding: 16rpx 24rpx;
		border-radius: 6rpx;
	}
}
</style>