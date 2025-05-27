"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
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
      tabListOne: [
        // 话务员
        { id: 1, name: "首页", imgOff: "/static/home.png", imgOn: "/static/home_checked.png", url: "/pages/home/index" },
        { id: 2, name: "统计", imgOff: "/static/total.png", imgOn: "/static/total_checked.png", url: "/pages/total/index" },
        { id: 5, name: "业绩", imgOff: "/static/performance.png", imgOn: "/static/performance_checked.png", url: "/pages/performance/index" },
        { id: 3, name: "我的", imgOff: "/static/mine.png", imgOn: "/static/mine_checked.png", url: "/pages/mine/index" }
        // { id: 4, name: "微信", imgOff: "/static/wxChat.png", imgOn: "/static/wxChat_checked.png", url: '/pages/wxChat/index' }
      ],
      tabListTwo: [
        // 业务员经理
        { id: 1, name: "首页", imgOff: "/static/home.png", imgOn: "/static/home_checked.png", url: "/pages/home/index" },
        { id: 2, name: "统计", imgOff: "/static/total.png", imgOn: "/static/total_checked.png", url: "/pages/total/index" },
        { id: 5, name: "业绩", imgOff: "/static/performance.png", imgOn: "/static/performance_checked.png", url: "/pages/performance/index" },
        { id: 4, name: "微信", imgOff: "/static/wxChat.png", imgOn: "/static/wxChat_checked.png", url: "/pages/wxChat/index" }
      ],
      tabListThree: [
        // 话务员经理
        { id: 1, name: "首页", imgOff: "/static/home.png", imgOn: "/static/home_checked.png", url: "/pages/home/index" },
        { id: 2, name: "统计", imgOff: "/static/total.png", imgOn: "/static/total_checked.png", url: "/pages/total/index" },
        { id: 3, name: "我的", imgOff: "/static/mine.png", imgOn: "/static/mine_checked.png", url: "/pages/mine/index" }
      ],
      tabListFour: [
        // 管理员
        { id: 1, name: "首页", imgOff: "/static/home.png", imgOn: "/static/home_checked.png", url: "/pages/home/index" },
        { id: 4, name: "微信", imgOff: "/static/wxChat.png", imgOn: "/static/wxChat_checked.png", url: "/pages/wxChat/index" },
        { id: 2, name: "统计", imgOff: "/static/total.png", imgOn: "/static/total_checked.png", url: "/pages/total/index" },
        { id: 5, name: "业绩", imgOff: "/static/performance.png", imgOn: "/static/performance_checked.png", url: "/pages/performance/index" }
      ]
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      let userInfo = common_vendor.index.getStorageSync("userInfo") || {};
      if (userInfo && Object.keys(userInfo).length > 0) {
        if (userInfo.userRole == "a") {
          this.tabList = this.tabListFour;
        } else if (userInfo.userRole == "b") {
          this.tabList = this.tabListOne;
        } else if (userInfo.userRole == "c") {
          this.tabList = this.tabListThree;
        } else if (userInfo.userRole == "d") {
          this.tabList = this.tabListTwo;
        }
      }
      if (this.tabListParent.length > 0) {
        this.tabList = this.tabListParent;
      }
      this.curTab = this.id;
    },
    changeTap(e) {
      this.$emit("changeTabIdx", e.id);
      common_vendor.index.switchTab({ url: e.url });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.tabList, (item, index, i0) => {
      return common_vendor.e({
        a: $data.curTab == item.id
      }, $data.curTab == item.id ? {
        b: item.imgOn
      } : {}, {
        c: $data.curTab != item.id
      }, $data.curTab != item.id ? {
        d: item.imgOff
      } : {}, {
        e: common_vendor.t(item.name),
        f: common_vendor.n($data.curTab == item.id ? "text-position text-on" : "text-position"),
        g: common_vendor.o(($event) => $options.changeTap(item), index),
        h: index
      });
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/wyg-bottom-tab/wyg-bottom-tab.js.map
