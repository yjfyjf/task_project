"use strict";
const common_vendor = require("../../common/vendor.js");
const util_api = require("../../util/api.js");
const common_assets = require("../../common/assets.js");
const noData = () => "../component/noData.js";
const _sfc_main = {
  components: { noData },
  data() {
    return {
      dataList: [],
      detail: {},
      userId: "",
      params: {},
      triggered: false
    };
  },
  onLoad(option) {
    this.params = option;
    this.getAboutMission();
  },
  methods: {
    async downCallback() {
      this.triggered = true;
      await this.getAboutMission();
      this.triggered = false;
    },
    async getAboutMission() {
      await util_api.getAboutMission({
        userId: this.params.userId ? this.params.userId : "",
        roleType: this.params.roleType
      }).then((res) => {
        this.dataList = res.data;
      });
    },
    deleteHander(item) {
      this.detail = item;
      this.$refs.popup.open();
    },
    close() {
      this.$refs.popup.close();
    },
    remove() {
      util_api.deleteMission({ missionId: this.detail.missionId, userId: this.detail.userId, chatId: this.detail.wchatId }).then((res) => {
        common_vendor.index.showToast({
          title: "删除成功",
          icon: "none",
          mask: true
        });
        this.$refs.popup.close();
        this.getAboutMission();
      });
    }
  }
};
if (!Array) {
  const _component_noData = common_vendor.resolveComponent("noData");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_component_noData + _easycom_uni_popup2)();
}
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  _easycom_uni_popup();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.dataList && $data.dataList.length > 0
  }, $data.dataList && $data.dataList.length > 0 ? {
    b: common_vendor.f($data.dataList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.chatCode),
        b: common_vendor.t(item.chatName),
        c: common_vendor.t(item.hwyName),
        d: common_vendor.t("邀请：" + item.inviteCount),
        e: common_vendor.t("添加：" + item.addCount),
        f: common_vendor.t(item.salesManName),
        g: index,
        h: common_vendor.o(($event) => $options.deleteHander(item), index)
      };
    }),
    c: common_assets._imports_0$1
  } : {}, {
    d: $data.dataList && $data.dataList.length == 0
  }, $data.dataList && $data.dataList.length == 0 ? {} : {}, {
    e: $data.triggered,
    f: common_vendor.o((...args) => $options.downCallback && $options.downCallback(...args)),
    g: common_vendor.o((...args) => $options.remove && $options.remove(...args)),
    h: common_vendor.o((...args) => $options.close && $options.close(...args)),
    i: common_vendor.sr("popup", "cbe33c55-1"),
    j: common_vendor.p({
      type: "bottom"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-cbe33c55"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/total/taskDetail.js.map
