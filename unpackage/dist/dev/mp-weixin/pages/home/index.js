"use strict";
const common_vendor = require("../../common/vendor.js");
const uni_modules_mescrollUni_components_mescrollUni_mescrollMixins = require("../../uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js");
const util_api = require("../../util/api.js");
const tab = () => "../../components/wyg-bottom-tab/wyg-bottom-tab.js";
const _sfc_main = {
  mixins: [uni_modules_mescrollUni_components_mescrollUni_mescrollMixins.MescrollMixin],
  // 使用mixin
  components: { tab },
  props: {},
  data() {
    return {
      companyNum: 0,
      lineData: {},
      handleType: 0,
      noticeInfo: {},
      noticeStr: null,
      taskName: null,
      taskContent: null,
      homeTotal: {},
      tyleSelect: 1,
      userTotalList: [],
      dateTime: "",
      dataType: 1,
      name: "",
      role: "",
      triggered: false
    };
  },
  beforeCreate() {
    var _a, _b, _c;
    let line = common_vendor.index.getStorageSync("line");
    let userInfo = common_vendor.index.getStorageSync("userInfo") || {};
    let params = {
      avatarUrl: (_a = userInfo == null ? void 0 : userInfo.userInfo) == null ? void 0 : _a.fileUrl,
      userName: (_b = userInfo == null ? void 0 : userInfo.userInfo) == null ? void 0 : _b.userName,
      name: (_c = userInfo == null ? void 0 : userInfo.userInfo) == null ? void 0 : _c.name,
      lineId: line.id,
      code: ""
    };
    common_vendor.wx$1.login({
      success: async (res) => {
        common_vendor.index.__f__("log", "at pages/home/index.vue:216", res);
        params.code = res.code;
        const loginRes = await util_api.wxLogin(params);
        common_vendor.index.setStorageSync("userInfo", loginRes.data);
      }
    });
  },
  onShow() {
    var _a;
    let userInfo = common_vendor.index.getStorageSync("userInfo");
    this.name = (_a = userInfo == null ? void 0 : userInfo.userInfo) == null ? void 0 : _a.name;
    this.role = userInfo == null ? void 0 : userInfo.userRole;
    this.initNotice();
    this.initTask();
    this.initTotal();
    this.getUserTotal();
  },
  watch: {
    tyleSelect() {
      this.initTotal();
      this.getUserTotal();
    },
    handleType() {
      if (this.handleType == 1) {
        common_vendor.index.reLaunch({
          url: "/pages/index/index"
        });
      } else if (this.handleType == 2) {
        this.loginOut();
      }
    }
  },
  methods: {
    loginOut() {
      common_vendor.index.removeStorageSync("line");
      common_vendor.index.removeStorageSync("userInfo");
      common_vendor.index.reLaunch({
        url: "/pages/index/index"
      });
    },
    async init() {
      var _a, _b;
      this.lineData = common_vendor.index.getStorageSync("line");
      this.name = (_b = (_a = common_vendor.index.getStorageSync("userInfo")) == null ? void 0 : _a.userInfo) == null ? void 0 : _b.name;
      this.dateTime = this.getDate(/* @__PURE__ */ new Date(), 30).fullDate;
      await this.initNotice();
      await this.initTask();
      await this.initTotal();
      await this.getUserTotal();
      this.triggered = false;
    },
    getDate(date, AddDayCount = 0) {
      if (!date) {
        date = /* @__PURE__ */ new Date();
      }
      if (typeof date !== "object") {
        date = date.replace(/-/g, "/");
      }
      const dd = new Date(date);
      dd.setDate(dd.getDate() + AddDayCount);
      const y = dd.getFullYear();
      const m = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;
      const d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
      return {
        fullDate: y + "-" + m + "-" + d,
        year: y,
        month: m,
        date: d,
        day: dd.getDay()
      };
    },
    async getUserTotal() {
      let params = {
        dataType: this.tyleSelect
      };
      await util_api.getHomeUserTotalList(params).then((res) => {
        const userTotalList = res.data;
        userTotalList.sort((a, b) => {
          if (a.totalNum > b.totalNum)
            return -1;
          if (a.totalNum < b.totalNum)
            return 1;
          return 0;
        });
        let rank = 0;
        let prevScore = null;
        userTotalList.forEach((player, index) => {
          if (prevScore !== player.totalNum) {
            rank++;
          }
          player.rank = rank;
          prevScore = player.totalNum;
        });
        this.userTotalList = userTotalList;
      });
    },
    goUser() {
      if (["c", "d"].includes(this.role)) {
        common_vendor.index.showToast({
          title: "暂无权限",
          icon: "none",
          mask: true
        });
        return;
      }
      common_vendor.index.navigateTo({
        url: "/pages/user/index"
      });
    },
    goWChat() {
      if (["c"].includes(this.role)) {
        common_vendor.index.showToast({
          title: "暂无权限",
          icon: "none",
          mask: true
        });
        return;
      }
      common_vendor.index.switchTab({
        url: "/pages/wxChat/index"
      });
    },
    openTask() {
      var _a;
      if (this.role == "d") {
        common_vendor.index.showToast({
          title: "暂无权限",
          icon: "none",
          mask: true
        });
        return;
      }
      this.taskContent = (_a = this == null ? void 0 : this.taskName) == null ? void 0 : _a.name;
      this.$refs.taskDialog.open();
    },
    taskConfirm() {
      let that = this;
      util_api.createTask({
        name: this.taskContent
      }).then((res) => {
        common_vendor.index.showModal({
          title: "提示",
          content: "操作成功",
          showCancel: false,
          success() {
            that.initTask();
            that.$refs.taskDialog.close();
          }
        });
      });
    },
    async initTask() {
      await util_api.getTask().then((res) => {
        this.taskName = res.data;
      });
    },
    goMain() {
      common_vendor.index.navigateTo({
        url: "/pages/mainInfo/index"
      });
    },
    goSalesmanInfo() {
      common_vendor.index.navigateTo({
        url: "/pages/salesman/index"
      });
    },
    async initNotice() {
      const res = await util_api.getNoticeInfo();
      this.noticeInfo = res.data;
    },
    openNotice() {
      if (this.role == "d") {
        common_vendor.index.showToast({
          title: "暂无权限",
          icon: "none",
          mask: true
        });
        return;
      }
      if (this.role == "a") {
        this.$refs.inputDialog.open();
      } else {
        common_vendor.index.switchTab({
          url: "/pages/total/index"
        });
      }
    },
    handleAddNotice() {
      const _this = this;
      util_api.getVerifyWord({ word: _this.noticeStr }).then((res) => {
        common_vendor.index.__f__("log", "at pages/home/index.vue:405", res, "res");
        if (res.code == 200) {
          if (res.data == 1) {
            _this.noticeStr = "";
            common_vendor.index.navigateTo({ url: "/pages/totalAll/index" });
          } else {
            let params = {
              lineId: _this.lineData.id,
              contentStr: _this.noticeStr
            };
            util_api.editNoticeInfo(params).then((res2) => {
              if (res2.code == 200) {
                common_vendor.index.showToast({
                  icon: "none",
                  title: "发送成功"
                });
                _this.noticeStr = "";
                _this.initNotice();
              } else {
                common_vendor.index.showToast({
                  icon: "none",
                  title: res2.message
                });
              }
            });
          }
        } else {
          common_vendor.index.showToast({
            icon: "none",
            title: res.message
          });
        }
      }).catch((err) => {
        common_vendor.index.__f__("log", "at pages/home/index.vue:439", err);
      });
    },
    async initTotal() {
      let params = {
        dataType: this.tyleSelect
      };
      await util_api.getHomeTotalData(params).then((res) => {
        this.homeTotal = res.data;
      });
    },
    bonus() {
      common_vendor.index.showToast({
        title: "功能正在建设中",
        icon: "none",
        mask: true
      });
    },
    handerUser() {
      if (this.role == "a") {
        common_vendor.index.navigateTo({ url: "/pages/user/index" });
      }
    },
    async downCallback() {
      this.triggered = true;
      await this.init();
    }
  }
};
if (!Array) {
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _easycom_uni_notice_bar2 = common_vendor.resolveComponent("uni-notice-bar");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_calendar2 = common_vendor.resolveComponent("uni-calendar");
  const _component_tab = common_vendor.resolveComponent("tab");
  (_easycom_uni_popup_dialog2 + _easycom_uni_popup2 + _easycom_uni_notice_bar2 + _easycom_uni_data_select2 + _easycom_uni_icons2 + _easycom_uni_calendar2 + _component_tab)();
}
const _easycom_uni_popup_dialog = () => "../../uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
const _easycom_uni_notice_bar = () => "../../uni_modules/uni-notice-bar/components/uni-notice-bar/uni-notice-bar.js";
const _easycom_uni_data_select = () => "../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_calendar = () => "../../uni_modules/uni-calendar/components/uni-calendar/uni-calendar.js";
if (!Math) {
  (_easycom_uni_popup_dialog + _easycom_uni_popup + _easycom_uni_notice_bar + _easycom_uni_data_select + _easycom_uni_icons + _easycom_uni_calendar)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.sr("inputClose", "4978fed5-1,4978fed5-0"),
    b: common_vendor.o($options.handleAddNotice),
    c: common_vendor.o(($event) => $data.noticeStr = $event),
    d: common_vendor.p({
      value: $data.noticeStr,
      focus: false,
      mode: "input",
      title: "发布全局公告通知",
      placeholder: "请输入公告内容",
      modelValue: $data.noticeStr
    }),
    e: common_vendor.sr("inputDialog", "4978fed5-0"),
    f: common_vendor.p({
      type: "dialog"
    }),
    g: common_vendor.p({
      showClose: true,
      ["show-icon"]: true,
      scrollable: true,
      text: $data.noticeInfo.contentStr
    }),
    h: common_vendor.o(($event) => $data.handleType = $event),
    i: common_vendor.p({
      localdata: [{
        text: $data.name,
        value: 0
      }, {
        text: "切换公司",
        value: 1
      }, {
        text: "退出",
        value: 2
      }],
      clear: false,
      modelValue: $data.handleType
    }),
    j: common_vendor.t($data.tyleSelect == 3 ? "本月" : $data.tyleSelect == 2 ? "本周" : "今日"),
    k: common_vendor.o(($event) => $data.tyleSelect = $event),
    l: common_vendor.p({
      localdata: [{
        text: "今日",
        value: 1
      }, {
        text: "本周",
        value: 2
      }, {
        text: "本月",
        value: 3
      }],
      clear: false,
      modelValue: $data.tyleSelect
    }),
    m: common_vendor.t($data.homeTotal.todayNum),
    n: common_vendor.t(["a", "d"].includes($data.role) ? "发送全局公告" : "查看统计"),
    o: common_vendor.o((...args) => $options.openNotice && $options.openNotice(...args)),
    p: common_vendor.t($data.tyleSelect == 3 ? "本月" : $data.tyleSelect == 2 ? "本周" : "今日"),
    q: common_vendor.t($data.homeTotal.numData || "-"),
    r: ["a", "d"].includes($data.role)
  }, ["a", "d"].includes($data.role) ? {
    s: common_vendor.t($data.taskName ? $data.taskName.name : "无"),
    t: common_vendor.o((...args) => $options.openTask && $options.openTask(...args))
  } : {}, {
    v: ["a", "d"].includes($data.role)
  }, ["a", "d"].includes($data.role) ? {
    w: common_vendor.t($data.homeTotal.totalNum)
  } : {
    x: common_vendor.t(($data.tyleSelect == 1 ? "今日" : $data.tyleSelect == 2 ? "本周" : $data.tyleSelect == 3 ? "本月" : "-") + "排行"),
    y: common_vendor.t(["a"].includes($data.role) ? $data.homeTotal.totalNum : $data.homeTotal.rank || "-")
  }, {
    z: ["a", "c", "d"].includes($data.role)
  }, ["a", "c", "d"].includes($data.role) ? {
    A: common_vendor.t($data.homeTotal.hwyNum),
    B: common_vendor.t($data.homeTotal.hwyTotalNum),
    C: common_vendor.o((...args) => $options.goUser && $options.goUser(...args)),
    D: common_vendor.t($data.homeTotal.weChatNum),
    E: common_vendor.t($data.homeTotal.weChatTotalNum),
    F: common_vendor.o((...args) => $options.goWChat && $options.goWChat(...args))
  } : {}, {
    G: ["a", "d"].includes($data.role)
  }, ["a", "d"].includes($data.role) ? {
    H: common_vendor.t($data.homeTotal.ywyNum),
    I: common_vendor.t($data.homeTotal.ywyTotalNum),
    J: common_vendor.o((...args) => $options.goSalesmanInfo && $options.goSalesmanInfo(...args)),
    K: common_vendor.o((...args) => $options.bonus && $options.bonus(...args)),
    L: common_vendor.t($data.homeTotal.mainNum),
    M: common_vendor.o((...args) => $options.goMain && $options.goMain(...args))
  } : {}, {
    N: $data.userTotalList && $data.userTotalList.length > 0
  }, $data.userTotalList && $data.userTotalList.length > 0 ? {
    O: common_vendor.p({
      type: "medal",
      size: "25",
      color: "#aaaaaa"
    }),
    P: common_vendor.t(($data.tyleSelect == 1 ? "今日" : $data.tyleSelect == 2 ? "本周" : $data.tyleSelect == 3 ? "本月" : "-") + "排行TOP3"),
    Q: common_vendor.t($data.tyleSelect == 3 ? "本月" : $data.tyleSelect == 2 ? "本周" : "今日"),
    R: common_vendor.f($data.userTotalList, (item, index, i0) => {
      return common_vendor.e({
        a: item.totalNum > 0
      }, item.totalNum > 0 ? common_vendor.e({
        b: [1, 2, 3].includes(item.rank)
      }, [1, 2, 3].includes(item.rank) ? {
        c: "/static/" + (item.rank == 1 ? "first" : item.rank == 2 ? "second" : "third") + ".png"
      } : {}, {
        d: item.rank == 4
      }, item.rank == 4 ? {} : {}, {
        e: item.avatar_url
      }, item.avatar_url ? {
        f: item.avatar_url && item.avatar_url.length > 0 ? "https://www.zflh168.com" + item.avatar_url : "../../static/mine.png"
      } : {}, {
        g: common_vendor.t(item.name),
        h: common_vendor.t(item.totalNum)
      }) : {}, {
        i: index
      });
    })
  } : {}, {
    S: common_vendor.p({
      startDate: $data.dateTime,
      endDate: $data.dateTime
    }),
    T: $data.triggered,
    U: common_vendor.o((...args) => $options.downCallback && $options.downCallback(...args)),
    V: common_vendor.sr("inputClose", "4978fed5-8,4978fed5-7"),
    W: common_vendor.o($options.taskConfirm),
    X: common_vendor.o(($event) => $data.taskContent = $event),
    Y: common_vendor.p({
      mode: "input",
      focus: false,
      title: "设置任务",
      value: $data.taskContent,
      placeholder: "请输入内容",
      modelValue: $data.taskContent
    }),
    Z: common_vendor.sr("taskDialog", "4978fed5-7"),
    aa: common_vendor.p({
      type: "dialog"
    }),
    ab: common_vendor.p({
      id: 1
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-4978fed5"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/home/index.js.map
