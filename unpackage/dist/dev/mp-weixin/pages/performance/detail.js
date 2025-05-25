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
      total: 0,
      params: {},
      triggered: false
    };
  },
  onLoad(option) {
    this.params = JSON.parse(option.params);
    if (this.params.type == "all") {
      this.getAllPerformance();
    } else if (this.params.type == "single") {
      this.getTotalDetailData();
    }
  },
  methods: {
    async downCallback() {
      this.triggered = true;
      if (this.params.type == "all") {
        await this.getAllPerformance();
      } else if (this.params.type == "single") {
        await this.getTotalDetailData();
      }
      this.triggered = false;
    },
    async getTotalDetailData() {
      const _this = this;
      await util_api.getPerformanceDetail({
        id: _this.params.id,
        startTime: _this.params.startTime + " 00:00:00",
        endTime: _this.params.endTime + " 23:59:59",
        roleType: _this.params.roleType
      }).then((res) => {
        _this.total = 0;
        const dataList = res.data || [];
        dataList.forEach((i) => {
          i.time = i.createTime.substring(5, 16);
          if (_this.isNumber(i.receivedAmount)) {
            _this.total = _this.total + Number(i.receivedAmount);
          }
        });
        _this.dataList = dataList;
      });
    },
    async getAllPerformance() {
      const _this = this;
      let params = {
        page: 1,
        pageSize: 9999
      };
      await util_api.getAllPerformance(params).then((res) => {
        _this.total = 0;
        if (res.code == 200) {
          const dataList = res.data.records || [];
          dataList.forEach((i) => {
            i.time = i.createTime.substring(5, 16);
            if (_this.isNumber(i.receivedAmount)) {
              _this.total = _this.total + Number(i.receivedAmount);
            }
          });
          _this.dataList = dataList;
        }
      });
    },
    isNumber(value) {
      return /^[+-]?\d+(\.\d+)?$/.test(value);
    },
    deleteHander(item) {
      this.detail = item;
      this.$refs.popup.open();
    },
    close() {
      this.$refs.popup.close();
    },
    update() {
      common_vendor.index.navigateTo({ url: "/pages/performance/add?type=update&id=" + this.detail.id });
      this.close();
    },
    remove() {
      util_api.deletePerformance(this.detail.id).then((res) => {
        if (res.code == 200) {
          this.close();
          this.getTotalDetailData();
        }
        common_vendor.index.showToast({
          title: "删除成功",
          icon: "none",
          mask: true
        });
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
    a: common_vendor.t("总业绩" + $data.total),
    b: $data.dataList && $data.dataList.length > 0
  }, $data.dataList && $data.dataList.length > 0 ? {
    c: common_vendor.f($data.dataList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.receivedAmount),
        b: common_vendor.t(item.createTime ? item.createTime.substring(0, 10) : "-"),
        c: common_vendor.t(item.callAgentName),
        d: common_vendor.t(item.technician),
        e: common_vendor.t(item.source),
        f: common_vendor.t(item.wechatCode),
        g: index,
        h: common_vendor.o(($event) => $options.deleteHander(item), index)
      };
    }),
    d: common_assets._imports_0$1
  } : {}, {
    e: $data.dataList && $data.dataList.length == 0
  }, $data.dataList && $data.dataList.length == 0 ? {} : {}, {
    f: common_vendor.t(($data.detail.createTime ? $data.detail.createTime.substring(0, 10) : "-") + " 添加"),
    g: common_vendor.o((...args) => $options.update && $options.update(...args)),
    h: common_vendor.o((...args) => $options.remove && $options.remove(...args)),
    i: common_vendor.o((...args) => $options.close && $options.close(...args)),
    j: common_vendor.sr("popup", "d2162774-1"),
    k: common_vendor.p({
      type: "bottom"
    }),
    l: $data.triggered,
    m: common_vendor.o((...args) => $options.downCallback && $options.downCallback(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-d2162774"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/performance/detail.js.map
