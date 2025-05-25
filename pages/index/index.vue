<template>
	<view class="content">
		<uni-indexed-list :options="list" :showSelect="false" @click="bindClick"></uni-indexed-list>
	</view>
</template>

<script>
	import {
		getLineList
	} from '@/util/api';

	export default {
		data() {
			return {
				list: [],
				item: null,
			}
		},
		onLoad() {
			// let line = uni.getStorageSync('line')
			// let userInfo = uni.getStorageSync('userInfo')
			// console.dir(line)
			// console.dir(userInfo)
			// if (line != null && line != '' && userInfo != null && userInfo != null) {
			// 	uni.switchTab({
			// 		url: '/pages/home/index'
			// 	})
			// }
			this.initLine()
		},
		methods: {
			async initLine() {
				const res = await getLineList()
				this.list = res.data
			},
			bindClick(item) {
				let checkedData = null
				this.list.forEach(data => {
					if (data.letter == item.item.key) {
						data.itemData.forEach(itemData => {
							if (itemData.name == item.item.name) {
								checkedData = itemData
							}
						})
					}
				})
				uni.setStorageSync('line', checkedData)
				let userInfo = uni.getStorageSync('userInfo')
				if (!userInfo) {
					uni.navigateTo({
						url: '/pages/login/index?company=' + item?.item?.name
					})
				} else {
					if (userInfo?.userInfo?.lineId == checkedData.id) {
						uni.switchTab({
							url: '/pages/home/index'
						})
					} else {
						uni.navigateTo({
							url: '/pages/login/index?company=' + item?.item?.name
						})
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>