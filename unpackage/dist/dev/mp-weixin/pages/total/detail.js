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
      params: {},
      remark: "",
      auditStatus: 0,
      dataListStandby: [],
      triggered: false
    };
  },
  onLoad(option) {
    this.params = JSON.parse(option.params);
    this.params.startTime = this.params.startTime + " 00:00:00";
    this.params.endTime = this.params.endTime + " 23:59:59";
    this.getTotalDetailData();
  },
  methods: {
    async downCallback() {
      this.triggered = true;
      await this.getTotalDetailData();
      this.triggered = false;
    },
    async getTotalDetailData() {
      let requestDeatil = "";
      if (this.params.type == "all") {
        requestDeatil = util_api.getUserTotalListDetail;
      } else if (this.params.type == "single") {
        requestDeatil = util_api.getUserTotalList;
      } else {
        requestDeatil = util_api.getUserTotalList;
      }
      await requestDeatil({
        userId: this.params.userId ? this.params.userId : "",
        roleType: this.params.roleType,
        startTime: this.params.startTime,
        endTime: this.params.endTime,
        roleType: this.params.roleType,
        remark: this.remark,
        auditStatus: this.auditStatus
      }).then((res) => {
        if (res.code == 200) {
          const dataList = res.data || [];
          this.dataListStandby = res.data || [];
          common_vendor.index.setNavigationBarTitle({
            title: "明细总计：" + dataList.length
          });
          dataList.forEach((i) => {
            i.time = i.createTime.substring(5, 16);
          });
          this.dataList = dataList;
        } else {
          common_vendor.index.showToast({
            title: res.error,
            icon: "none",
            mask: true
          });
        }
      }).catch((err) => {
        common_vendor.index.showToast({
          title: err.error,
          icon: "none",
          mask: true
        });
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
      util_api.removeCustomerNew([this.detail.customerId]).then((res) => {
        common_vendor.index.showToast({
          title: "删除成功",
          icon: "none",
          mask: true
        });
        this.close();
        this.getTotalDetailData();
      });
    },
    pass() {
      util_api.auditStatus({ userMissionId: this.detail.missionId, customerId: this.detail.customerId }).then((res) => {
        if (res.code == 200) {
          common_vendor.index.showToast({
            title: "已通过",
            icon: "none",
            mask: true
          });
          this.close();
          this.getTotalDetailData();
        }
      });
    },
    statusDetailData(e) {
      if (this.dataList && this.dataList.length > 0) {
        let dataList = [];
        if (e == 0) {
          this.dataList = this.dataListStandby;
        } else if (e == 1) {
          this.dataListStandby.forEach((i) => {
            if (i.auditStatus && i.auditStatus == "已添加") {
              dataList.push(i);
            }
          });
          this.dataList = dataList;
        } else if (e == 2) {
          this.dataListStandby.forEach((i) => {
            if (!i.auditStatus) {
              dataList.push(i);
            }
          });
          this.dataList = dataList;
        }
      }
    }
  }
};
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _component_noData = common_vendor.resolveComponent("noData");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_easyinput2 + _easycom_uni_data_select2 + _component_noData + _easycom_uni_popup2)();
}
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_data_select = () => "../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_data_select + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($options.getTotalDetailData),
    b: common_vendor.o($options.getTotalDetailData),
    c: common_vendor.o($options.getTotalDetailData),
    d: common_vendor.o(($event) => $data.remark = $event),
    e: common_vendor.p({
      prefixIcon: "search",
      ["confirm-type"]: "search",
      placeholder: "备注搜索",
      modelValue: $data.remark
    }),
    f: common_vendor.o($options.statusDetailData),
    g: common_vendor.o(($event) => $data.auditStatus = $event),
    h: common_vendor.p({
      placeholder: "全部状态",
      localdata: [{
        text: "全部",
        value: 0
      }, {
        text: "已添加",
        value: 1
      }, {
        text: "未添加",
        value: 2
      }],
      clear: false,
      modelValue: $data.auditStatus
    }),
    i: $data.dataList && $data.dataList.length > 0
  }, $data.dataList && $data.dataList.length > 0 ? {
    j: common_vendor.f($data.dataList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.customerName),
        b: common_vendor.t(item.auditStatus),
        c: common_vendor.t(item.time),
        d: common_vendor.t(item.trafficName),
        e: common_vendor.t(item.salesmanName),
        f: common_vendor.t(item.userName),
        g: index,
        h: common_vendor.o(($event) => $options.deleteHander(item), index)
      };
    }),
    k: common_assets._imports_0$1
  } : {}, {
    l: $data.dataList && $data.dataList.length == 0
  }, $data.dataList && $data.dataList.length == 0 ? {} : {}, {
    m: $data.triggered,
    n: common_vendor.o((...args) => $options.downCallback && $options.downCallback(...args)),
    o: common_vendor.t($data.detail.createTime + " 添加"),
    p: !$data.detail.auditStatus
  }, !$data.detail.auditStatus ? {
    q: common_vendor.o((...args) => $options.pass && $options.pass(...args))
  } : {}, {
    r: common_vendor.o((...args) => $options.remove && $options.remove(...args)),
    s: common_vendor.o((...args) => $options.close && $options.close(...args)),
    t: common_vendor.sr("popup", "f30043c6-3"),
    v: common_vendor.p({
      type: "bottom"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-f30043c6"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/total/detail.js.map
