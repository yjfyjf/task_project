"use strict";
const common_vendor = require("../../common/vendor.js");
const util_api = require("../../util/api.js");
const common_assets = require("../../common/assets.js");
const noData = () => "../component/noData.js";
const _sfc_main = {
  components: { noData },
  data() {
    return {
      title: "",
      salesmanId: "",
      salesmanName: null,
      statusFlag: 1,
      salesmanList: [],
      triggered: false
    };
  },
  onLoad() {
    this.getSalesmanInfoList();
  },
  methods: {
    async downCallback() {
      this.triggered = true;
      await this.getSalesmanInfoList();
      this.triggered = false;
    },
    handleRemove() {
      let that = this;
      common_vendor.index.showModal({
        title: "警告",
        content: "确定删除该业务员吗",
        success(handle) {
          if (handle.confirm) {
            that.$refs.editHandle.close();
            util_api.removeSalesmanInfo(that.salesmanId).then((res) => {
              common_vendor.index.showModal({
                title: "提示",
                content: "操作成功",
                showCancel: false,
                success() {
                  that.getSalesmanInfoList();
                }
              });
            });
          }
        }
      });
    },
    async getSalesmanInfoList() {
      await util_api.getSalesmanList().then((res) => {
        this.salesmanList = res.data;
      });
    },
    openAdd() {
      this.title = "添加业务员";
      this.salesmanName = "";
      this.salesmanId = "";
      this.statusFlag = 1;
      this.$refs.inputDialog.open();
    },
    openEdit(item) {
      this.salesmanId = item.id;
      this.salesmanName = item.name;
      this.statusFlag = item.statusFlag;
      this.$refs.editHandle.open("bottom");
    },
    openEditData() {
      this.title = "编辑业务员";
      this.$refs.editHandle.close();
      this.$refs.inputDialog.open();
    },
    handleEdit() {
      let that = this;
      if (!that.salesmanName) {
        common_vendor.index.showToast({
          title: "名称不能为空",
          icon: "none",
          mask: true
        });
        return;
      }
      this.$refs.inputDialog.close();
      let params = {
        id: this.salesmanId,
        name: this.salesmanName,
        statusFlag: this.statusFlag
      };
      util_api.editSalesmanInfo(params).then((res) => {
        common_vendor.index.showModal({
          title: "提示",
          content: "操作成功",
          showCancel: false,
          success() {
            that.getSalesmanInfoList();
          }
        });
      });
    },
    editHandleclose() {
      this.$refs.editHandle.close();
    },
    inputDialogClsoe() {
      this.$refs.inputDialog.close();
    }
  }
};
if (!Array) {
  const _easycom_uni_tag2 = common_vendor.resolveComponent("uni-tag");
  const _component_noData = common_vendor.resolveComponent("noData");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_tag2 + _component_noData + _easycom_uni_easyinput2 + _easycom_uni_data_select2 + _easycom_uni_popup2)();
}
const _easycom_uni_tag = () => "../../uni_modules/uni-tag/components/uni-tag/uni-tag.js";
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_data_select = () => "../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_tag + _easycom_uni_easyinput + _easycom_uni_data_select + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.openAdd && $options.openAdd(...args)),
    b: $data.salesmanList && $data.salesmanList.length > 0
  }, $data.salesmanList && $data.salesmanList.length > 0 ? {
    c: common_vendor.f($data.salesmanList, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.name),
        b: item.statusFlag == 1
      }, item.statusFlag == 1 ? {
        c: "3fa27b3f-0-" + i0,
        d: common_vendor.p({
          text: "正常",
          type: "success"
        })
      } : item.statusFlag == 2 ? {
        f: "3fa27b3f-1-" + i0,
        g: common_vendor.p({
          text: "请假",
          type: "primary"
        })
      } : {
        h: "3fa27b3f-2-" + i0,
        i: common_vendor.p({
          text: "离职",
          type: "error"
        })
      }, {
        e: item.statusFlag == 2,
        j: common_vendor.o(($event) => $options.openEdit(item), index),
        k: index
      });
    })
  } : {}, {
    d: $data.salesmanList && $data.salesmanList.length == 0
  }, $data.salesmanList && $data.salesmanList.length == 0 ? {} : {}, {
    e: $data.triggered,
    f: common_vendor.o((...args) => $options.downCallback && $options.downCallback(...args)),
    g: common_vendor.t($data.title),
    h: common_vendor.o((...args) => $options.inputDialogClsoe && $options.inputDialogClsoe(...args)),
    i: common_assets._imports_0$2,
    j: common_vendor.o(($event) => $data.salesmanName = $event),
    k: common_vendor.p({
      placeholder: "请输入名称",
      modelValue: $data.salesmanName
    }),
    l: common_vendor.o(($event) => $data.statusFlag = $event),
    m: common_vendor.p({
      localdata: [{
        text: "正常",
        value: 1
      }, {
        text: "请假",
        value: 2
      }, {
        text: "离职",
        value: 3
      }],
      clear: false,
      modelValue: $data.statusFlag
    }),
    n: common_vendor.o((...args) => $options.handleEdit && $options.handleEdit(...args)),
    o: common_vendor.sr("inputDialog", "3fa27b3f-4"),
    p: common_vendor.p({
      borderRadius: "10px 10px 10px 10px",
      ["background-color"]: "#fff",
      type: "dialog"
    }),
    q: common_vendor.o((...args) => $options.openEditData && $options.openEditData(...args)),
    r: common_vendor.o((...args) => $options.handleRemove && $options.handleRemove(...args)),
    s: common_vendor.o((...args) => $options.editHandleclose && $options.editHandleclose(...args)),
    t: common_vendor.sr("editHandle", "3fa27b3f-7"),
    v: common_vendor.p({
      ["background-color"]: "#fff"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-3fa27b3f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/salesman/index.js.map
