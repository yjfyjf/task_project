"use strict";
const common_vendor = require("../../common/vendor.js");
const util_api = require("../../util/api.js");
const _sfc_main = {
  data() {
    return {
      list: [],
      item: null
    };
  },
  onLoad() {
    this.initLine();
  },
  methods: {
    async initLine() {
      const res = await util_api.getLineList();
      this.list = res.data;
    },
    bindClick(item) {
      var _a, _b, _c;
      let checkedData = null;
      this.list.forEach((data) => {
        if (data.letter == item.item.key) {
          data.itemData.forEach((itemData) => {
            if (itemData.name == item.item.name) {
              checkedData = itemData;
            }
          });
        }
      });
      common_vendor.index.setStorageSync("line", checkedData);
      let userInfo = common_vendor.index.getStorageSync("userInfo");
      if (!userInfo) {
        common_vendor.index.navigateTo({
          url: "/pages/login/index?company=" + ((_a = item == null ? void 0 : item.item) == null ? void 0 : _a.name)
        });
      } else {
        if (((_b = userInfo == null ? void 0 : userInfo.userInfo) == null ? void 0 : _b.lineId) == checkedData.id) {
          common_vendor.index.switchTab({
            url: "/pages/home/index"
          });
        } else {
          common_vendor.index.navigateTo({
            url: "/pages/login/index?company=" + ((_c = item == null ? void 0 : item.item) == null ? void 0 : _c.name)
          });
        }
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_indexed_list2 = common_vendor.resolveComponent("uni-indexed-list");
  _easycom_uni_indexed_list2();
}
const _easycom_uni_indexed_list = () => "../../uni_modules/uni-indexed-list/components/uni-indexed-list/uni-indexed-list.js";
if (!Math) {
  _easycom_uni_indexed_list();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o($options.bindClick),
    b: common_vendor.p({
      options: $data.list,
      showSelect: false
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
