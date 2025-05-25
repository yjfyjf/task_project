"use strict";
const common_vendor = require("../../common/vendor.js");
const util_api = require("../../util/api.js");
const noData = () => "../component/noData.js";
const tab = () => "../../components/wyg-bottom-tab/wyg-bottom-tab.js";
const _sfc_main = {
  components: { noData, tab },
  data() {
    return {
      roleType: 1,
      timeArray: [],
      listType: 1,
      dataList: [],
      total: "",
      addTotal: "",
      detail: {},
      startTimeDom: "",
      endTimesDom: "",
      triggered: false
    };
  },
  onLoad() {
  },
  onShow() {
    this.initDate();
    this.initTotalData();
  },
  methods: {
    async downCallback() {
      this.triggered = true;
      this.dataList = [];
      await this.initTotalData();
      this.triggered = false;
    },
    initDate() {
      const today = /* @__PURE__ */ new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const day = today.getDate();
      const time = year + "-" + month + "-" + day;
      this.timeArray.push(time, time);
      if (this.timeArray && this.timeArray.length > 0) {
        this.startTimeDom = this.timeArray[0].substring(5);
        this.endTimesDom = this.timeArray[1].substring(5);
      }
    },
    checkDetail(item) {
      let userInfo = common_vendor.index.getStorageSync("userInfo");
      if (["a", "c", "d"].includes(userInfo.userRole) || item.isOneself) {
        this.detail = item;
        if (userInfo.userRole == "a" && this.roleType == 4) {
          let params = {
            userId: this.detail.userId,
            roleType: this.roleType
          };
          if (this.timeArray.length > 1) {
            params.startTime = this.timeArray[0];
            params.endTime = this.timeArray[1];
          }
          common_vendor.index.navigateTo({
            url: "./detail?params=" + JSON.stringify(params)
          });
        } else {
          this.$refs.popup.open();
        }
      } else {
        return common_vendor.index.showToast({
          title: "您没有权限查看",
          icon: "none",
          mask: true
        });
      }
    },
    iconClick() {
      this.dataList = [];
      this.downCallback();
    },
    initDataPicker(e) {
      this.timeArray = e;
      if (this.timeArray && this.timeArray.length > 0) {
        this.startTimeDom = this.timeArray[0].substring(5);
        this.endTimesDom = this.timeArray[1].substring(5);
      }
      this.initTotalData();
    },
    async initTotalData() {
      const _this = this;
      let params = {
        roleType: this.roleType,
        listType: this.listType
      };
      if (this.timeArray.length > 1) {
        params.startTime = this.timeArray[0];
        params.endTime = this.timeArray[1];
      }
      await util_api.getTotalData(params).then((res) => {
        const dataList = res.data;
        _this.total = 0;
        _this.addTotal = 0;
        dataList.sort((a, b) => {
          if (a.num > b.num)
            return -1;
          if (a.num < b.num)
            return 1;
          return 0;
        });
        let rank = 0;
        let prevScore = null;
        const userInfo = common_vendor.index.getStorageSync("userInfo");
        dataList.forEach((player, index) => {
          _this.total += player.num;
          _this.addTotal += player.addNum;
          if (prevScore !== player.num) {
            rank++;
          }
          player.judgeId = player.judgeId ? player.judgeId.split(" ") : [];
          if (player.judgeId.includes(userInfo.userInfo.id)) {
            player.isOneself = true;
          }
          player.rank = rank;
          prevScore = player.num;
        });
        this.dataList = dataList;
      });
    },
    remoDetail() {
      const _this = this;
      let params = {
        userId: _this.detail.userId,
        roleType: _this.roleType,
        type: "single"
      };
      if (this.timeArray.length > 1) {
        params.startTime = this.timeArray[0];
        params.endTime = this.timeArray[1];
      }
      common_vendor.index.navigateTo({
        url: "./detail?params=" + JSON.stringify(params)
      });
      this.close();
    },
    remoTask() {
      var _a;
      common_vendor.index.navigateTo({
        url: "./taskDetail?userId=" + ((_a = this.detail) == null ? void 0 : _a.userId) + "&roleType=" + this.roleType
      });
      this.close();
    },
    close() {
      this.$refs.popup.close();
    },
    remove() {
      removeDetailInfo({ id: this.detail.id }).then((res) => {
        common_vendor.index.showToast({
          title: "删除成功",
          icon: "none",
          mask: true
        });
      });
    },
    checkAll() {
      var _a;
      let userInfo = common_vendor.index.getStorageSync("userInfo");
      let params = {
        userId: (_a = userInfo == null ? void 0 : userInfo.userInfo) == null ? void 0 : _a.id,
        roleType: this.roleType,
        type: "all"
      };
      if (this.timeArray.length > 1) {
        params.startTime = this.timeArray[0];
        params.endTime = this.timeArray[1];
      }
      common_vendor.index.navigateTo({
        url: "./detail?params=" + JSON.stringify(params)
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  const _component_noData = common_vendor.resolveComponent("noData");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  const _component_tab = common_vendor.resolveComponent("tab");
  (_easycom_uni_data_select2 + _easycom_uni_datetime_picker2 + _component_noData + _easycom_uni_popup2 + _component_tab)();
}
const _easycom_uni_data_select = () => "../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_datetime_picker = () => "../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_data_select + _easycom_uni_datetime_picker + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($options.iconClick),
    b: common_vendor.o(($event) => $data.roleType = $event),
    c: common_vendor.p({
      localdata: [{
        text: "话务员",
        value: 1
      }, {
        text: "业务员",
        value: 2
      }, {
        text: "微信号",
        value: 3
      }, {
        text: "任务分组",
        value: 4
      }],
      clear: false,
      modelValue: $data.roleType
    }),
    d: common_vendor.t($data.startTimeDom && $data.startTimeDom.length > 0 ? $data.startTimeDom + "至" + $data.endTimesDom : "选择日期"),
    e: common_vendor.o($options.initDataPicker),
    f: common_vendor.o(($event) => $data.timeArray = $event),
    g: common_vendor.p({
      type: "daterange",
      value: $data.timeArray,
      modelValue: $data.timeArray
    }),
    h: common_vendor.o($options.iconClick),
    i: common_vendor.o(($event) => $data.listType = $event),
    j: common_vendor.p({
      localdata: [{
        text: "在岗列表",
        value: 1
      }, {
        text: "与我相关",
        value: 10
      }, {
        text: "分组展示",
        value: 3
      }],
      clear: false,
      modelValue: $data.listType
    }),
    k: common_vendor.o(($event) => $options.checkAll()),
    l: common_vendor.t("邀请 " + $data.total),
    m: common_vendor.t("新增 " + $data.addTotal),
    n: $data.dataList && $data.dataList.length > 0
  }, $data.dataList && $data.dataList.length > 0 ? {
    o: common_vendor.f($data.dataList, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.num),
        c: item.num - item.addNum > 0
      }, item.num - item.addNum > 0 ? {
        d: common_vendor.t(item.num - item.addNum)
      } : {}, {
        e: common_vendor.t(item.addNum),
        f: common_vendor.n(item.isOneself ? "todoy-line todoy-line-oneself" : "todoy-line"),
        g: index,
        h: common_vendor.o(($event) => $options.checkDetail(item), index)
      });
    })
  } : {}, {
    p: $data.dataList && $data.dataList.length == 0
  }, $data.dataList && $data.dataList.length == 0 ? {} : {}, {
    q: $data.triggered,
    r: common_vendor.o((...args) => $options.downCallback && $options.downCallback(...args)),
    s: common_vendor.o((...args) => $options.remoDetail && $options.remoDetail(...args)),
    t: common_vendor.o((...args) => $options.remoTask && $options.remoTask(...args)),
    v: common_vendor.o((...args) => $options.close && $options.close(...args)),
    w: common_vendor.sr("popup", "8fdbd695-4"),
    x: common_vendor.p({
      type: "bottom"
    }),
    y: common_vendor.p({
      id: 2
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-8fdbd695"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/total/index.js.map
