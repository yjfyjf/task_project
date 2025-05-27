"use strict";
const common_vendor = require("../../common/vendor.js");
const util_api = require("../../util/api.js");
const common_assets = require("../../common/assets.js");
const noData = () => "../component/noData.js";
const tab = () => "../../components/wyg-bottom-tab/wyg-bottom-tab.js";
const _sfc_main = {
  components: { noData, tab },
  data() {
    return {
      roleType: 1,
      timeArray: [],
      dataList: [],
      downOption: {},
      role: "",
      triggered: false,
      allAmount: 0
    };
  },
  onShow() {
    let userInfo = common_vendor.index.getStorageSync("userInfo");
    this.role = userInfo == null ? void 0 : userInfo.userRole;
    this.initDate();
    this.initTotalData();
  },
  methods: {
    async downCallback() {
      this.triggered = true;
      this.dataList = [];
      this.initDate();
      await this.initTotalData();
      this.triggered = false;
    },
    iconClick() {
      this.dataList = [];
      this.downCallback();
    },
    initDate() {
      const today = /* @__PURE__ */ new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const day = today.getDate();
      const time = year + "-" + month + "-" + day;
      this.timeArray = [time, time];
    },
    checkDetail(item) {
      let params = {
        id: item.id,
        roleType: this.roleType,
        type: "single"
      };
      if (this.timeArray.length > 1) {
        params.startTime = this.timeArray[0];
        params.endTime = this.timeArray[1];
      }
      common_vendor.index.navigateTo({
        url: "./detail?params=" + JSON.stringify(params)
      });
    },
    initData(e) {
      this.timeArray = e;
      this.initTotalData();
    },
    async initTotalData() {
      const _this = this;
      let params = {
        roleType: this.roleType
      };
      if (this.timeArray.length > 1) {
        params.startTime = this.timeArray[0] + " 00:00:00";
        params.endTime = this.timeArray[1] + " 23:59:59";
      }
      await util_api.performanceList(params).then((res) => {
        var _a, _b;
        const dataList = ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.performanceReturnVoList) || [];
        this.allAmount = (_b = res == null ? void 0 : res.data) == null ? void 0 : _b.allAmount;
        dataList.sort((a, b) => {
          if (a.num > b.num)
            return -1;
          if (a.num < b.num)
            return 1;
          return 0;
        });
        let rank = 0;
        let prevScore = null;
        dataList.forEach((player, index) => {
          if (prevScore !== player.num) {
            rank++;
          }
          player.rank = rank;
          prevScore = player.num;
        });
        _this.dataList = dataList;
      });
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
    addPerformance() {
      common_vendor.index.navigateTo({
        url: "./add"
      });
    },
    checkAll() {
      let params = {
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
  const _component_tab = common_vendor.resolveComponent("tab");
  (_easycom_uni_data_select2 + _easycom_uni_datetime_picker2 + _component_noData + _component_tab)();
}
const _easycom_uni_data_select = () => "../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_datetime_picker = () => "../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
if (!Math) {
  (_easycom_uni_data_select + _easycom_uni_datetime_picker)();
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
    d: common_vendor.t($data.timeArray.length > 0 ? $data.timeArray[0].substring(5) + "至" + $data.timeArray[1].substring(5) : "选择日期"),
    e: common_vendor.o($options.initData),
    f: common_vendor.o(($event) => $data.timeArray = $event),
    g: common_vendor.p({
      type: "daterange",
      modelValue: $data.timeArray
    }),
    h: $data.role == "a"
  }, $data.role == "a" ? {
    i: common_vendor.o(($event) => $options.checkAll())
  } : {}, {
    j: common_vendor.t("总业绩 " + $data.allAmount),
    k: $data.dataList && $data.dataList.length > 0
  }, $data.dataList && $data.dataList.length > 0 ? {
    l: common_vendor.f($data.dataList, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.name),
        b: [1, 2, 3].includes(item.rank)
      }, [1, 2, 3].includes(item.rank) ? {
        c: "/static/" + (item.rank == 1 ? "first" : item.rank == 2 ? "second" : "third") + ".png"
      } : {}, {
        d: common_vendor.t(item.receivedAmount),
        e: index,
        f: common_vendor.o(($event) => $options.checkDetail(item), index)
      });
    })
  } : {}, {
    m: $data.dataList && $data.dataList.length == 0
  }, $data.dataList && $data.dataList.length == 0 ? {} : {}, {
    n: $data.triggered,
    o: common_vendor.o((...args) => $options.downCallback && $options.downCallback(...args)),
    p: $data.role != "b"
  }, $data.role != "b" ? {
    q: common_assets._imports_0$3,
    r: common_vendor.o((...args) => $options.addPerformance && $options.addPerformance(...args))
  } : {}, {
    s: common_vendor.p({
      id: 5
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-24de663c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/performance/index.js.map
