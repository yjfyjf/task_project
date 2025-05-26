"use strict";
const common_vendor = require("../../common/vendor.js");
const util_api = require("../../util/api.js");
const noData = () => "../component/noData.js";
const tab = () => "../../components/wyg-bottom-tab/wyg-bottom-tab.js";
const _sfc_main = {
  components: { noData, tab },
  data() {
    return {
      wChatList: [],
      total: 0,
      loading: false,
      mainList: [],
      salesmanList: [],
      editData: {
        code: null,
        userName: null,
        mainId: null,
        salesmanId: null,
        statusFlag: null
      },
      searchStr: null,
      searchStatus: null,
      title: "",
      options: [
        {
          text: "删除",
          style: {
            backgroundColor: "#db3231"
          }
        }
      ],
      isOpened: "none",
      triggered: false
    };
  },
  onLoad() {
    this.getWChatDataList();
    this.initMainList();
    this.initSalesmanList();
  },
  methods: {
    async downCallback() {
      this.triggered = true;
      await this.getWChatDataList();
      await this.initMainList();
      await this.initSalesmanList();
      this.triggered = false;
    },
    closeDialog() {
      this.$refs.editPopup.close();
    },
    async initMainList() {
      await util_api.getSelectMainList().then((res) => {
        this.mainList = res.data;
      });
    },
    async initSalesmanList() {
      await util_api.getSelectSalesmanList().then((res) => {
        this.salesmanList = res.data;
      });
    },
    async getWChatDataList() {
      this.loading = true;
      await util_api.getWChatList({
        current: 1,
        size: 9999,
        searchStr: this.searchStr,
        statusFlag: this.searchStatus
      }).then((res) => {
        this.wChatList = [...res.data.records];
        this.isOpened = "left", this.total = res.data.total;
        this.loading = false;
      });
    },
    openEdit(item) {
      if ([2, 3].includes(item.statusFlag) && (item.updateTime && item.updateTime.length > 0)) {
        this.title = "编辑微信-上次被封：" + item.updateTime.substring(5, 16);
      } else {
        this.title = "编辑微信";
      }
      this.editData = item;
      this.$refs.editPopup.open();
    },
    openAdd() {
      this.title = "新增微信";
      this.editData = {
        code: null,
        userName: null,
        mainId: null,
        salesmanId: null,
        statusFlag: null
      };
      this.$refs.editPopup.open();
    },
    iconClick() {
      this.getWChatDataList();
    },
    handleEdit() {
      let that = this;
      if (!that.editData.code) {
        return that.hint("标签/编码不能为空");
      }
      if (!that.editData.userName) {
        return that.hint("微信名不能为空");
      }
      if (!that.editData.mainId) {
        return that.hint("请选择主体");
      }
      if (!that.editData.salesmanId) {
        return that.hint("请选择业务员");
      }
      if (!that.editData.statusFlag) {
        return that.hint("请选择状态");
      }
      util_api.editWChatInfo(this.editData).then((res) => {
        common_vendor.index.showModal({
          title: "提示",
          content: "操作成功",
          showCancel: false,
          success() {
            that.iconClick();
            that.$refs.editPopup.close();
          }
        });
      });
    },
    actionChange() {
    },
    bindClick(item) {
      let _this = this;
      common_vendor.index.showModal({
        title: "警告",
        content: "确定删除该微信吗?",
        success(res) {
          if (res.confirm) {
            util_api.removeWChatInfo([item.id]).then((resData) => {
              if (resData.code == 200) {
                common_vendor.index.showToast({
                  title: "删除成功",
                  icon: "none",
                  success() {
                    _this.isOpened = "done";
                    _this.getWChatDataList();
                  }
                });
              }
            });
          } else {
            common_vendor.index.__f__("log", "at pages/wxChat/index.vue:287", "取消");
          }
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_uni_swipe_action_item2 = common_vendor.resolveComponent("uni-swipe-action-item");
  const _easycom_uni_swipe_action2 = common_vendor.resolveComponent("uni-swipe-action");
  const _component_noData = common_vendor.resolveComponent("noData");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _component_tab = common_vendor.resolveComponent("tab");
  (_easycom_uni_easyinput2 + _easycom_uni_data_select2 + _easycom_uni_swipe_action_item2 + _easycom_uni_swipe_action2 + _component_noData + _easycom_uni_icons2 + _easycom_uni_popup2 + _component_tab)();
}
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_data_select = () => "../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_swipe_action_item = () => "../../uni_modules/uni-swipe-action/components/uni-swipe-action-item/uni-swipe-action-item.js";
const _easycom_uni_swipe_action = () => "../../uni_modules/uni-swipe-action/components/uni-swipe-action/uni-swipe-action.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_data_select + _easycom_uni_swipe_action_item + _easycom_uni_swipe_action + _easycom_uni_icons + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.openAdd && $options.openAdd(...args)),
    b: common_vendor.o($options.iconClick),
    c: common_vendor.o($options.iconClick),
    d: common_vendor.o($options.iconClick),
    e: common_vendor.o(($event) => $data.searchStr = $event),
    f: common_vendor.p({
      prefixIcon: "search",
      ["confirm-type"]: "search",
      placeholder: "编号/归属人/名字/手机",
      modelValue: $data.searchStr
    }),
    g: common_vendor.o($options.iconClick),
    h: common_vendor.o(($event) => $data.searchStatus = $event),
    i: common_vendor.p({
      placeholder: "全部状态",
      localdata: [{
        text: "全部",
        value: ""
      }, {
        text: "正常",
        value: 1
      }, {
        text: "异常",
        value: 2
      }, {
        text: "封禁",
        value: 3
      }],
      clear: false,
      modelValue: $data.searchStatus
    }),
    j: $data.wChatList && $data.wChatList.length > 0
  }, $data.wChatList && $data.wChatList.length > 0 ? {
    k: common_vendor.f($data.wChatList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.code),
        b: common_vendor.t(item.mainName),
        c: common_vendor.t(item.trafficName),
        d: common_vendor.t(item.salesmanName),
        e: common_vendor.t(item.statusFlag == 1 ? "正常" : item.statusFlag == 2 ? "异常" : item.statusFlag == 3 ? "封禁" : "--"),
        f: item.statusFlag == 1 ? "green" : item.statusFlag == 2 ? "orange" : item.statusFlag == 3 ? "red" : "gray",
        g: common_vendor.o($options.actionChange, index),
        h: common_vendor.o(($event) => $options.bindClick(item), index),
        i: "fd66d48c-3-" + i0 + "," + ("fd66d48c-2-" + i0),
        j: "fd66d48c-2-" + i0,
        k: index,
        l: common_vendor.o(($event) => $options.openEdit(item), index)
      };
    }),
    l: common_vendor.p({
      ["right-options"]: $data.options,
      show: $data.isOpened,
      ["auto-close"]: false
    })
  } : {}, {
    m: $data.wChatList && $data.wChatList.length == 0
  }, $data.wChatList && $data.wChatList.length == 0 ? {} : {}, {
    n: $data.triggered,
    o: common_vendor.o((...args) => $options.downCallback && $options.downCallback(...args)),
    p: common_vendor.t($data.title),
    q: common_vendor.p({
      type: "closeempty"
    }),
    r: common_vendor.o((...args) => $options.closeDialog && $options.closeDialog(...args)),
    s: common_vendor.o(($event) => $data.editData.code = $event),
    t: common_vendor.p({
      placeholder: "请输入标签/编码",
      modelValue: $data.editData.code
    }),
    v: common_vendor.o(($event) => $data.editData.userName = $event),
    w: common_vendor.p({
      placeholder: "请输入微信名",
      modelValue: $data.editData.userName
    }),
    x: common_vendor.o(($event) => $data.editData.mainId = $event),
    y: common_vendor.p({
      localdata: $data.mainList,
      clear: false,
      modelValue: $data.editData.mainId
    }),
    z: common_vendor.o(($event) => $data.editData.salesmanId = $event),
    A: common_vendor.p({
      localdata: $data.salesmanList,
      clear: false,
      modelValue: $data.editData.salesmanId
    }),
    B: common_vendor.o(($event) => $data.editData.statusFlag = $event),
    C: common_vendor.p({
      clear: false,
      localdata: [{
        text: "正常",
        value: 1
      }, {
        text: "异常",
        value: 2
      }, {
        text: "封禁",
        value: 3
      }],
      modelValue: $data.editData.statusFlag
    }),
    D: common_vendor.o((...args) => $options.handleEdit && $options.handleEdit(...args)),
    E: common_vendor.sr("editPopup", "fd66d48c-5"),
    F: common_vendor.p({
      borderRadius: "10px",
      ["background-color"]: "#fff",
      type: "dialog"
    }),
    G: common_vendor.p({
      id: 4
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-fd66d48c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/wxChat/index.js.map
