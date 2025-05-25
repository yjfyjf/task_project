<template>
	<view class="pages">
		<view class="btn" @click="openAdd">添加分组</view>
		<scroll-view class="scroll-view" :refresher-triggered="triggered" scroll-y="true" refresher-enabled="{{true}}" :enable-pull-down-refresh="true" refresher-two-level-enabled="{{true}}" @refresherrefresh="downCallback" refresher-two-level-scroll-enabled="{{true}}">
			<view class="contentClass">
				<view class="itemClass" @click="openEdit(item.value, item.text)" v-for="(item, index) in groupList" :key="index">
					<view class="text">{{ item.text }}</view>
					<view class="right">
						<view class="num">{{ item.num || '--' }}</view>
						<image src="/static/right.png" class="right-img" mode="widthFix"></image>
					</view>
				</view>
			</view>
		</scroll-view>
		<uni-popup ref="inputDialog" type="dialog">
			<uni-popup-dialog ref="inputClose" :before-close="true" mode="input" :title="title" v-model="groupName" :value="groupName" placeholder="请输入名称" @close="groupClose" @confirm="handleEdit"></uni-popup-dialog>
		</uni-popup>

		<uni-popup ref="editHandle" background-color="#fff">
			<view>
				<view @click="openEditData" class="buttonClass" style="border-bottom: solid 1rpx #e8e8e8">编辑</view>
				<view @click="handleRemove" class="buttonClass" style="color: red">删除</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import {
	getGroupList,
	editGroupInfo,
	removeGroupInfo
} from '@/util/api'
export default {
	data() {
		return {
			title: '',
			groupId: '',
			groupName: null,
			groupList: [],
			triggered: false
		}
	},
	onLoad() {
		this.getGroupList()
	},
	methods: {
		async downCallback() {
			this.triggered = true
			await this.getGroupList()
			this.triggered = false
		},
		handleRemove() {
			let that = this
			uni.showModal({
				title: '警告',
				content: '确定删除该分组信息吗',
				success(handle) {
					if (handle.confirm) {
						that.$refs.editHandle.close()
						removeGroupInfo(that.groupId).then(res => {
							uni.showModal({
								title: '提示',
								content: '操作成功',
								showCancel: false,
								success() {
									that.getGroupList()
								}
							})
						})
					} else {

					}
				}
			})
		},
		async getGroupList() {
			await getGroupList().then(res => {
				this.groupList = res.data
			})
		},
		openAdd() {
			this.title = '添加分组'
			this.groupName = ''
			this.groupId = ''
			this.$refs.inputDialog.open()
		},
		openEdit(id, item) {
			this.groupId = id
			this.groupName = item
			this.$refs.editHandle.open('bottom')
		},
		openEditData() {
			this.title = '编辑分组'
			this.$refs.editHandle.close()
			this.$refs.inputDialog.open()
		},
		handleEdit() {
			let that = this
			if (!that.groupName) {
				uni.showToast({
					title: '分组名称不能为空',
					icon: 'none',
					mask: true
				})
				return
			}
			this.$refs.inputDialog.close()
			let params = {
				id: this.groupId,
				name: this.groupName
			}
			editGroupInfo(params).then(res => {
				if (res.code == 200) {
					uni.showToast({
						title: '操作成功',
						icon: 'none',
						mask: true
					})
					that.getGroupList()
				}
			})
		},
		groupClose() {
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

				.text {}

				.right {
					display: flex;

					.right-img {
						width: 32rpx;
						height: 32rpx;
						margin: auto 8rpx auto 0;
					}
				}
			}
		}
	}

}

.buttonClass {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 35rpx;
}
</style>