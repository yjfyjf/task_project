<template>
	<view class="bottom-tab">
		<view class="bottom-tab-item" @click="changeTap(item)" v-for="(item, index) in tabList" :key="index">
			<image v-if="curTab == item.id" class="first-img" :src="item.imgOn"></image>
			<image v-if="curTab != item.id" class="first-img" :src="item.imgOff"></image>
			<text :class="curTab == item.id ? 'text-position text-on' : 'text-position'">{{ item.name }}</text>
		</view>
	</view>
</template>

<script>


export default {
	name: "wyg-bottom-tab",
	props: {
		tabIndex: {
			//图片的尺寸
			type: String,
			default: "1"
		},
		tabListParent: {
			type: Array,
			default: []
		},
		userInfo: {
			type: Object,
			default: {}
		},
		id: {
			type: Number,
			default: 1
		}
	},
	data() {
		return {
			curTab: 1,
			tabList: [],
			tabListOne: [ // 话务员
				{ id: 1, name: "首页", imgOff: "/static/home.png", imgOn: "/static/home_checked.png", url: '/pages/home/index' },
				{ id: 2, name: "统计", imgOff: "/static/total.png", imgOn: "/static/total_checked.png", url: '/pages/total/index' },
				{ id: 5, name: "业绩", imgOff: "/static/performance.png", imgOn: "/static/performance_checked.png", url: '/pages/performance/index' },
				{ id: 3, name: "我的", imgOff: "/static/mine.png", imgOn: "/static/mine_checked.png", url: '/pages/mine/index' },
				// { id: 4, name: "微信", imgOff: "/static/wxChat.png", imgOn: "/static/wxChat_checked.png", url: '/pages/wxChat/index' }

			],
			tabListTwo: [ // 业务员经理
				{ id: 1, name: "首页", imgOff: "/static/home.png", imgOn: "/static/home_checked.png", url: '/pages/home/index' },
				{ id: 2, name: "统计", imgOff: "/static/total.png", imgOn: "/static/total_checked.png", url: '/pages/total/index' },
				{ id: 5, name: "业绩", imgOff: "/static/performance.png", imgOn: "/static/performance_checked.png", url: '/pages/performance/index' },
				{ id: 4, name: "微信", imgOff: "/static/wxChat.png", imgOn: "/static/wxChat_checked.png", url: '/pages/wxChat/index' }
			],
			tabListThree: [ // 话务员经理
				{ id: 1, name: "首页", imgOff: "/static/home.png", imgOn: "/static/home_checked.png", url: '/pages/home/index' },
				{ id: 2, name: "统计", imgOff: "/static/total.png", imgOn: "/static/total_checked.png", url: '/pages/total/index' },
				{ id: 3, name: "我的", imgOff: "/static/mine.png", imgOn: "/static/mine_checked.png", url: '/pages/mine/index' },
			],
			tabListFour: [ // 管理员
				{ id: 1, name: "首页", imgOff: "/static/home.png", imgOn: "/static/home_checked.png", url: '/pages/home/index' },
				{ id: 4, name: "微信", imgOff: "/static/wxChat.png", imgOn: "/static/wxChat_checked.png", url: '/pages/wxChat/index' },
				{ id: 2, name: "统计", imgOff: "/static/total.png", imgOn: "/static/total_checked.png", url: '/pages/total/index' },
				{ id: 5, name: "业绩", imgOff: "/static/performance.png", imgOn: "/static/performance_checked.png", url: '/pages/performance/index' },

			]
		}
	},
	created() {
		this.init()
	},
	methods: {
		init() {
			let userInfo = uni.getStorageSync('userInfo') || {}
			if (userInfo && Object.keys(userInfo).length > 0) {
				if (userInfo.userRole == 'a') { // 管理员
					this.tabList = this.tabListFour
				} else if (userInfo.userRole == 'b') { // 话务员
					this.tabList = this.tabListOne
				} else if (userInfo.userRole == 'c') { // 话务员经理
					this.tabList = this.tabListThree
				} else if (userInfo.userRole == 'd') { // 业务员经理
					this.tabList = this.tabListTwo
				}
			}
			// this.curTab = new Number(this.tabIndex);
			if (this.tabListParent.length > 0) {
				this.tabList = this.tabListParent;
			}
			this.curTab = this.id
		},
		changeTap(e) {
			// this.curTab = e.id;
			this.$emit("changeTabIdx", e.id);
			uni.switchTab({ url: e.url })
		}
	}
}

</script>

<style lang="scss">
.bottom-tab {
	position: fixed;
	background-color: #FDFDFD;
	left: 0%;
	bottom: 0%;
	width: 100%;
	height: 2.9rem;
	border-top: 3rpx solid #eee;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-bottom: 24rpx;

	.bottom-tab-item {
		width: 25%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.first-img {
			width: 1.5rem;
			height: 1.5rem;
		}

		.text-position {
			margin-top: 0rem;
			font-size: 0.6rem;
			color: #757575;
		}

		.text-on {
			color: red;
		}

	}


}
</style>
