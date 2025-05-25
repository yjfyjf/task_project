"use strict";
const common_vendor = require("../../common/vendor.js");
const util_api = require("../../util/api.js");
const taskIndex = () => "../task/index2.js";
const tab = () => "../../components/wyg-bottom-tab/wyg-bottom-tab.js";
const _sfc_main = {
  components: { tab },
  props: {},
  components: {
    taskIndex
  },
  data() {
    return {
      role: ""
    };
  },
  onShow() {
    let userInfo = common_vendor.index.getStorageSync("userInfo");
    this.role = userInfo.userRole;
    util_api.getMineMissionList().then((res) => {
      let mineMissionList = res.data || [];
      if (mineMissionList && mineMissionList.length > 0) {
        common_vendor.index.reLaunch({
          url: "/pages/task/index"
        });
      }
    });
  },
  methods: {
    handleUser() {
    },
    goTask() {
      common_vendor.index.navigateTo({
        url: "/pages/task/index"
      });
    },
    loginOut() {
      common_vendor.index.removeStorageSync("lineId");
      common_vendor.index.removeStorageSync("userInfo");
      common_vendor.index.reLaunch({
        url: "/pages/index/index"
      });
    },
    change() {
    }
  }
};
if (!Array) {
  const _easycom_uni_card2 = common_vendor.resolveComponent("uni-card");
  const _component_taskIndex = common_vendor.resolveComponent("taskIndex");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _component_tab = common_vendor.resolveComponent("tab");
  (_easycom_uni_card2 + _component_taskIndex + _easycom_uni_popup2 + _component_tab)();
}
const _easycom_uni_card = () => "../../uni_modules/uni-card/components/uni-card/uni-card.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_card + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.role == "a"
  }, $data.role == "a" ? {
    b: common_vendor.o($options.handleUser),
    c: common_vendor.p({
      title: _ctx.userInfo.userName,
      ["sub-title"]: _ctx.userInfo.name,
      extra: $data.role == "a" ? "管理员" : "",
      thumbnail: _ctx.userInfo.avatarUrl ? "https://www.zflh168.com/" + _ctx.userInfo.avatarUrl : "/static/name.png"
    })
  } : {}, {
    d: $data.role != "a"
  }, $data.role != "a" ? {
    e: common_vendor.o((...args) => $options.goTask && $options.goTask(...args))
  } : {}, {
    f: common_vendor.n($data.role == "a" ? "" : "buttonClass"),
    g: common_vendor.sr("popup", "569e925a-1"),
    h: common_vendor.o($options.change),
    i: common_vendor.p({
      ["background-color"]: "#fff",
      bottom: true
    }),
    j: common_vendor.p({
      id: 3
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-569e925a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mine/index.js.map
