<template>
	<view class="pages">
		<view class="btn" @click="openAdd">新 增</view>
		<scroll-view class="scroll-view" :refresher-triggered="triggered" scroll-y="true" refresher-enabled="{{true}}" :enable-pull-down-refresh="true" refresher-two-level-enabled="{{true}}" @refresherrefresh="downCallback" refresher-two-level-scroll-enabled="{{true}}">
			<view class="contentClass">
				<view v-if="salesmanList && salesmanList.length > 0">
					<view class="itemClass" @click="openEdit(item)" v-for="(item, index) in salesmanList" :key="index">
						<view class="name">{{ item.name }}</view>
						<view class="status">
							<uni-tag text="正常" type="success" v-if="item.statusFlag == 1" />
							<uni-tag text="请假" type="primary" v-else-if="item.statusFlag == 2" />
							<uni-tag text="离职" type="error" v-else />
						</view>
					</view>
				</view>
				<view v-if="salesmanList && salesmanList.length == 0" class="none-data">
					<noData />
				</view>
			</view>
		</scroll-view>

		<uni-popup ref="inputDialog" borderRadius="10px 10px 10px 10px" background-color="#fff" type="dialog">
			<view class="contentItemClass">
				<view class="popup-title">
					<view class="text">{{ title }}</view>
					<image @click="inputDialogClsoe" src="/static/close.png" class="close-img" mode="widthFix"></image>
				</view>
				<view class="form-item">
					<view class="item-label">业务员名称：</view>
					<uni-easyinput v-model="salesmanName" placeholder="请输入名称"></uni-easyinput>
				</view>
				<view class="form-item">
					<view class="item-label">业务员状态：</view>
					<uni-data-select :localdata="[
						{
							text: '正常',
							value: 1
						},
						{
							text: '请假',
							value: 2
						},
						{
							text: '离职',
							value: 3
						}
					]" v-model="statusFlag" :clear="false"></uni-data-select>
				</view>
				<view class="submit" @click="handleEdit">确 定</view>
			</view>
		</uni-popup>

		<uni-popup ref="editHandle" background-color="#fff">
			<view class="popup-content">
				<view @click="openEditData" class="buttonClass">编辑</view>
				<view @click="handleRemove" class="remove" style="color: red;">删除</view>
				<view @click="editHandleclose" class="close">取消</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import { getSalesmanList, editSalesmanInfo, removeSalesmanInfo } from '@/util/api'
import noData from '../component/noData.vue'
export default {
	components: { noData },
	data() {
		return {
			title: '',
			salesmanId: '',
			salesmanName: null,
			statusFlag: 1,
			salesmanList: [],
			triggered: false
		}
	},
	onLoad() {
		this.getSalesmanInfoList()
	},
	methods: {
		async downCallback() {
			this.triggered = true
			await this.getSalesmanInfoList()
			this.triggered = false
		},
		handleRemove() {
			let that = this
			uni.showModal({
				title: '警告',
				content: '确定删除该业务员吗',
				success(handle) {
					if (handle.confirm) {
						that.$refs.editHandle.close()
						removeSalesmanInfo(that.salesmanId).then(res => {
							uni.showModal({
								title: '提示',
								content: '操作成功',
								showCancel: false,
								success() {
									that.getSalesmanInfoList()
								}
							})
						})
					}
				}
			})
		},
		async getSalesmanInfoList() {
			await getSalesmanList().then(res => {
				this.salesmanList = res.data
			})
		},
		openAdd() {
			this.title = '添加业务员'
			this.salesmanName = ''
			this.salesmanId = ''
			this.statusFlag = 1
			this.$refs.inputDialog.open()
		},
		openEdit(item) {
			this.salesmanId = item.id
			this.salesmanName = item.name
			this.statusFlag = item.statusFlag
			this.$refs.editHandle.open('bottom')
		},
		openEditData() {
			this.title = '编辑业务员'
			this.$refs.editHandle.close()
			this.$refs.inputDialog.open()
		},
		handleEdit() {
			let that = this
			if (!that.salesmanName) {
				uni.showToast({
					title: '名称不能为空',
					icon: 'none',
					mask: true
				})
				return
			}
			this.$refs.inputDialog.close()
			let params = {
				id: this.salesmanId,
				name: this.salesmanName,
				statusFlag: this.statusFlag
			}
			editSalesmanInfo(params).then(res => {
				uni.showModal({
					title: '提示',
					content: '操作成功',
					showCancel: false,
					success() {
						that.getSalesmanInfoList()
					}
				})
			})
		},
		editHandleclose() {
			this.$refs.editHandle.close()
		},
		inputDialogClsoe() {
			this.$refs.inputDialog.close()
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
				padding: 18rpx 48rpx;

				.name {
					color: #656565;
					font-size: 32rpx;
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

.contentItemClass {
	display: flex;
	flex-direction: column;
	align-items: center;
	border-radius: 16rpx;
	padding: 24rpx 20rpx;

	.popup-title {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 0 12rpx 0;

		.text {
			font-size: 32rpx;
		}

		.close-img {
			width: 32rpx;
			height: 32rpx;
		}
	}

	.form-item {
		display: flex;
		justify-content: space-between;
		padding: 12rpx 0;
		width: 100%;

		.item-label {
			font-size: 32rpx;
			margin: auto 0;
		}
	}

	.submit {
		background: #3d8bf2;
		color: white;
		padding: 18rpx 0;
		text-align: center;
		width: 100%;
		font-size: 28rpx;
		border-radius: 12rpx;
	}

	::v-deep .uni-easyinput__content-input {
		height: 66rpx;
	}
}
</style>