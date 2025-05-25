<template>
	<view class="pages">
		<view class="btn" @click="openAdd">新 增</view>
		<scroll-view class="scroll-view" :refresher-triggered="triggered" scroll-y="true" refresher-enabled="{{true}}" :enable-pull-down-refresh="true" refresher-two-level-enabled="{{true}}" @refresherrefresh="downCallback" refresher-two-level-scroll-enabled="{{true}}">
			<view class="contentClass">
				<view class="itemClass" @click="openEdit(item.id, item.name)" v-for="(item, index) in mainList" :key="index">
					<view class="name">
						<view class="name-text">
							{{ item.name }}
						</view>
						<view v-if="item.mainStatus == 2" class="status-text">被封</view>
					</view>
					<view class="status">{{ item.mainStatus == 1 ? '正常' : (item.mainStatus == 2 ? '封禁' : '-') }}</view>
				</view>
			</view>
		</scroll-view>
		<uni-popup ref="inputDialog" :mask-click="false" type="dialog" borderRadius="10px" background-color="#fff">
			<uni-popup-dialog v-if="type == 'add'" ref="inputClose" :focus="false" :before-close="true" mode="input" :title="title" v-model="mainName" :value="mainName" placeholder="请输入企业主体名称" @close="mainClose" @confirm="handleEdit"></uni-popup-dialog>
			<view v-if="type == 'edit'" class="editClass">
				<view class="editHeaderClass">
					<view class="title">编辑主体</view>
					<view @click="addclose">
						<uni-icons type="closeempty"></uni-icons>
					</view>
				</view>
				<view class="editContentClass">
					<view class="editItemClass">
						<view class="label-title">主体名称</view>
						<uni-easyinput placeholder="请输入主体名称" v-model="mainName"></uni-easyinput>
					</view>
					<view class="editItemClass">
						<view class="label-title">状态</view>
						<uni-data-select :clear="false" :localdata="[
							{
								text: '正常',
								value: 1
							},
							{
								text: '被封',
								value: 2
							},
						]" v-model="mainStatus"></uni-data-select>
					</view>
					<view class="submit" @click="handleEdit">确 定</view>
				</view>
			</view>
		</uni-popup>

		<uni-popup ref="editHandle" background-color="#fff">
			<view class="popup-content">
				<view @click="openEditData" class="buttonClass">编辑</view>
				<view @click="handleRemove" class="remove" style="color: red;">删除</view>
				<view class="close" @click="close">取消</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import { getMainList, editMainInfo, removeMainInfo } from '@/util/api'
export default {
	data() {
		return {
			title: '',
			mainId: '',
			mainName: null,
			mainList: [],
			type: 'add',
			mainStatus: 1,
			triggered: false
		}
	},
	onLoad() {
		this.getMainDataList()
	},
	methods: {
		async downCallback() {
			this.triggered = true
			await this.getMainDataList()
			this.triggered = false
		},
		handleRemove() {
			let that = this
			uni.showModal({
				title: '警告',
				content: '确定删除该主体信息吗',
				success(handle) {
					if (handle.confirm) {
						that.$refs.editHandle.close()
						removeMainInfo(that.mainId).then(res => {
							uni.showModal({
								title: '提示',
								content: '操作成功',
								showCancel: false,
								success() {
									that.getMainDataList()
								}
							})
						})
					} else {

					}
				}
			})
		},
		async getMainDataList() {
			await getMainList().then(res => {
				this.mainList = res.data
			})
		},
		openAdd() {
			this.title = '添加主体'
			this.mainName = ''
			this.mainId = ''
			this.type = 'add'
			this.$refs.inputDialog.open()
		},
		openEdit(id, item) {
			this.mainId = id
			this.mainName = item
			this.$refs.editHandle.open('bottom')
		},
		openEditData() {
			this.title = '编辑主体'
			this.type = 'edit'
			this.$refs.editHandle.close()
			this.$refs.inputDialog.open()
		},
		handleEdit() {
			let that = this
			if (!that.mainName) {
				uni.showToast({
					title: '主体名称不能为空',
					icon: 'none',
					mask: true
				})
				return
			}
			this.$refs.inputDialog.close()
			let params = {
				id: this.mainId,
				name: this.mainName,
				mainStatus: this.mainStatus
			}
			editMainInfo(params).then(res => {
				if (res.code == 200) {
					uni.showToast({
						title: '操作成功',
						icon: 'none',
						mask: true
					})
					that.getMainDataList()
				}
			})
		},
		close() {
			this.$refs.editHandle.close()
		},
		addclose() {
			this.$refs.inputDialog.close()
		},
		mainClose() {
			this.$refs.inputClose.close()
		}
	}
}
</script>

<style lang="scss" scoped>
.pages {
	.btn {
		background: #3d8bf2;
		color: white;
		padding: 18rpx 0;
		text-align: center;
		width: 100%;
		font-size: 28rpx;
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
	}

	.scroll-view {
		overflow-y: auto;
		position: fixed;
		left: 0;
		right: 0;
		top: 80rpx;
		bottom: 0;
		padding-bottom: 120rpx;

		.contentClass {
			overflow-y: auto;

			.itemClass {
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: solid 1rpx #e8e8e8;
				padding: 24rpx 18rpx;
				font-size: 28rpx;

				.name {
					display: flex;
					margin: auto 0;

					.name-text {
						display: flex;
					}
				}

				.status-text {
					background: red;
					color: #fff;
					border-radius: 6rpx;
					padding: 4rpx 6rpx;
					width: 60rpx;
					text-align: center;
					margin: 0 0 0 4rpx;
				}
			}
		}
	}
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
			padding: 12rpx 0 12rpx 24rpx;
			color: #333;
			border-bottom: 1px solid #eee;
			position: relative;

			.label-title {
				width: 140rpx;
				font-size: 28rpx;
			}

			&::before {
				content: '*';
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

.popup-content {
	border-radius: 12rpx 12rpx 0 0;

	.buttonClass {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 36rpx;
		padding-top: 22rpx;

	}

	.remove {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 22rpx 0;
		font-size: 36rpx;
	}

	.close {
		text-align: center;
		color: #5e5b5b;
		padding-top: 22rpx;
		border-top: 3rpx solid #e9dbdb;
	}
}
</style>