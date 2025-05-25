<template>
	<view class="content">
		 <home v-if="tabIdx===1"></home>
		 <cate v-if="tabIdx===2"></cate>
		 <cart v-if="tabIdx===4"></cart>
		 <user v-if="tabIdx===5"></user>
		 <center v-if="tabIdx===3"></center>
		
		<wyg-bottom-tab-withcenter tabIndex=1 :tabListParent="tabList" @changeTabIdx="_changeTabIdx"></wyg-bottom-tab-withcenter>
	</view>
</template>

<script> 
    import wygBottomTabWithcenter from '@/components/wyg-bottom-tab/wyg-bottom-tab-withcenter.vue';
	
	import TAB_LIST from '../../static/wyg-bottom-tab/js/botoom-list2.js';
	
	import home from '../center/home.vue';
	import cate from '../center/cate.vue';
	import cart from '../center/cart.vue';
	import user from '../center/user.vue';
	import center from '../center/center.vue';
	
	export default {
        components:{wygBottomTabWithcenter,home,cate,cart,user,center},
		data() {
			return {
				tabList:TAB_LIST,
				tabIdx:1
			}
		},
		onLoad() {
			
		},
		methods: {
			_changeTabIdx(e){
				this.tabIdx=e;
			}

		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50upx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}
</style>
