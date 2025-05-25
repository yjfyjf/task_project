<template>
    <view class="pages-no-data">
        <view class="main">
            <img src="/static/empty.png" class="empty" alt="">
            <view class="text">暂无数据</view>
        </view>
    </view>
</template>
<script>
export default {
    data() {
        return {
            
        }
    },
}
</script>
<style lang="scss" scoped>
    .pages-no-data{
        width: 100%;
        .main{
            margin: 100rpx auto 0 auto;
            .empty{
                width: 160rpx;
                height: 160rpx;
            }
            .text{
                margin: 40rpx 0 0 0;
                font-size: 32rpx;
            }
        }
    }
</style>