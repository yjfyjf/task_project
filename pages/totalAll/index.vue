<template>
	<view>
		<scroll-view scroll-y="true" class="SV_categoryTitle">
			<view class="categoryTitle">
				<view class="categoryName" v-for="(item, index) in categoryList" :key="index" :class="categoryNameActive == index ? 'categoryNameActive' : ''" @click="categoryClickEvent(item, index)">
					{{ item.name }}
				</view>
			</view>
		</scroll-view>
		<scroll-view class="scroll-Y" :scroll-y="true" :scroll-top="scrollTop" :scroll-with-animation="true" @scroll="scrollEvent">
			<view class="categoryList">
				<view v-if="categoryList && categoryList.length > 0" class="categoryListName">{{ categoryList[categoryNameActive].name + '今日：' + subCategoryDetail.todayNum + '人' + '； 共计：' +  subCategoryDetail.totalNum +'人'}}</view>
				<view class="categoryListBox">
					<view class="item-text" v-for="(sub, idx) in subCategoryDetail.totalUserInfoVo" :key="idx">
                        <view class="item-label">{{ sub.name + ':' }}</view>
                        <view class="item-value">{{ sub.todayNum }}</view>
                    </view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import { getLineList, getTotalInfo } from '@/util/api';
export default {
	data() {
		return {
			categoryList: [],
			categoryNameActive: 0, //当前选中active
			scrollTop: 0, //scroll-top
			scrollVal: 0, //滑动的值
			scrollStatus: true, //点击状态，是否能点击
			nodeHeight: [], //存储categoryList的top
			windowHeight: 0,
			windowTop: 0,
            subCategoryDetail: {
                todayNum: 0,
                totalNum: 0,
                totalUserInfoVo: []
            }
		};
	},
	mounted() {
		uni.getSystemInfo({
			success: (res) => {
				this.windowHeight = res.windowHeight;
				this.windowTop = res.windowTop;
			}
		});
		this.nodeHeight = [];
		let theNode = uni.createSelectorQuery().in(this).selectAll(".categoryList");
		theNode.boundingClientRect((data) => {
			data.forEach((item, index) => {
				// #ifndef H5
				this.nodeHeight.push({
					top: item.top,
					index: index
				})
				// #endif
				// #ifdef H5
				this.nodeHeight.push({
					top: item.top + this.windowTop,
					index: index
				})
				// #endif
			})
		}).exec()
	},
	async onLoad() {
        await this.getLineList()
	},
	methods: {
        async getLineList() {
            const _this = this
            await getLineList().then(res => {
                if (res.code == 200) {
                    let dataList = res.data || []
                    dataList.forEach(i => {
                        i.itemData && i.itemData.length > 0 && i.itemData.forEach(j => {
                            _this.categoryList.push({
                                id: j.id,
                                name: j.name
                            })
                        })
                    })
                    _this.getTotalInfo()
                }
            })
        },
		getTotalInfo(){
            const _this = this
			let params = {
				lineId: _this.categoryList[_this.categoryNameActive]['id'],
				startTime : _this.initDate() + " 00:00:00",
				endTime: _this.initDate() + " 23:59:59"
			}
			getTotalInfo(params).then(res => {
				if (res.code == 200) {
					this.subCategoryDetail.totalNum  = res.data.todayNum // 全部
					this.subCategoryDetail.todayNum = res.data.totalNum // 今天
					this.subCategoryDetail.totalUserInfoVo = res.data.totalUserInfoVo
				}
			})
		},
        initDate() {
			const today = new Date();
			const year = today.getFullYear();
			const month = today.getMonth() + 1;  // 月份从0开始，所以要加1
			const day = today.getDate();
			const time = year + '-' + month + '-' + day
            return time
		},
		categoryClickEvent(item, index) {
			// 300毫秒才能执行下次点击
			if (this.scrollStatus) {
				this.scrollStatus = false;
				this.categoryNameActive = index;
				let theNode = uni.createSelectorQuery().in(this).selectAll(".categoryList");
				theNode.boundingClientRect((data) => {
					/* 获取当前第index的categoryList的top,滑动后值scrollVal + categoryList的top */
					// #ifndef H5
					this.scrollTop = this.scrollVal + data[0].top;
					// #endif
					// #ifdef H5
					this.scrollTop = this.scrollVal + data[0].top + this.windowTop;
					// #endif
					setTimeout(() => {
						// 200毫秒才能执行下次点击
						this.scrollStatus = true;
					}, 200)
                    this.getTotalInfo()
				}).exec()
			}
		},
		scrollEvent(e) {
			if (this.scrollVal < e.detail.scrollTop) {
				// 向上
				this.nodeHeight.forEach(item => {
					if (this.scrollVal - item.top < 0 && this.scrollVal - item.top > -this.windowHeight) {
						this.categoryNameActive = item.index;
					}
				})
			} else {
				// 向下
				this.nodeHeight.forEach(item => {
					if (this.scrollVal - item.top > 0 && this.scrollVal - item.top < this.windowHeight) {
						this.categoryNameActive = item.index;
					}
				})
			}
			this.scrollVal = e.detail.scrollTop;
		},
	},
}
</script>

<style scoped lang="scss">
.item-text {
    display: flex;
	width: 100%;
    .item-label{
        margin: auto 20rpx auto 0;
    }
    .item-value{
        margin: auto 0;
    }
}

.categoryTitle {
	width: 249rpx;
	float: left;
	height: 100vh;
	background: #f7f9fa;
}

.SV_categoryTitle {
	width: 250rpx;
	height: 100vh;
	float: left;
}

.categoryName {
	width: 100%;
	text-align: center;
	height: 100rpx;
	line-height: 100rpx;
	color: #3E3E3E;
	background: #f7f9fa;
}

.categoryNameActive {
	background: #fff;
}

.scroll-Y {
	height: 100vh;
	width: 500rpx;
	float: left;
}

.categoryList {
	width: 100%;
	box-sizing: border-box;
	height: 100vh;
}

.categoryListName {
	width: 100%;
	height: 100rpx;
	line-height: 100rpx;
	color: #4892e9;
	background: #eef9fd;
	padding-left: 26rpx;
	float: left;
}

.categoryListBox {
	float: left;
	overflow: hidden;
	padding-left: 26rpx;

}

.item-text {
	color: #000;
	font-size: 28rxp;
	font-weight: 500;
	padding: 24rpx 0;
}

.categoryListBox image {
	width: 145rpx;
	height: 145rpx;
}

.categoryListName_line {
	height: 30rpx;
	background: rgba(0, 126, 96, 0.7);
	width: 8rpx;
	float: left;
	margin-top: 35rpx;
}
</style>
