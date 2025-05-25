"use strict";
const common_vendor = require("../../common/vendor.js");
const util_api = require("../../util/api.js");
const _sfc_main = {
  data() {
    return {
      title: "",
      mainId: "",
      mainName: null,
      mainList: [],
      type: "add",
      mainStatus: 1,
      triggered: false
    };
  },
  onLoad() {
    this.getMainDataList();
  },
  methods: {
    async downCallback() {
      this.triggered = true;
      await this.getMainDataList();
      this.triggered = false;
    },
    handleRemove() {
      let that = this;
      common_vendor.index.showModal({
        title: "警告",
        content: "确定删除该主体信息吗",
        success(handle) {
          if (handle.confirm) {
            that.$refs.editHandle.close();
            util_api.removeMainInfo(that.mainId).then((res) => {
              common_vendor.index.showModal({
                title: "提示",
                content: "操作成功",
                showCancel: false,
                success() {
                  that.getMainDataList();
                }
              });
            });
          }
        }
      });
    },
    async getMainDataList() {
      await util_api.getMainList().then((res) => {
        this.mainList = res.data;
      });
    },
    openAdd() {
      this.title = "添加主体";
      this.mainName = "";
      this.mainId = "";
      this.type = "add";
      this.$refs.inputDialog.open();
    },
    openEdit(id, item) {
      this.mainId = id;
      this.mainName = item;
      this.$refs.editHandle.open("bottom");
    },
    openEditData() {
      this.title = "编辑主体";
      this.type = "edit";
      this.$refs.editHandle.close();
      this.$refs.inputDialog.open();
    },
    handleEdit() {
      let that = this;
      if (!that.mainName) {
        common_vendor.index.showToast({
          title: "主体名称不能为空",
          icon: "none",
          mask: true
        });
        return;
      }
      this.$refs.inputDialog.close();
      let params = {
        id: this.mainId,
        name: this.mainName,
        mainStatus: this.mainStatus
      };
      util_api.editMainInfo(params).then((res) => {
        if (res.code == 200) {
          common_vendor.index.showToast({
            title: "操作成功",
            icon: "none",
            mask: true
          });
          that.getMainDataList();
        }
      });
    },
    close() {
      this.$refs.editHandle.close();
    },
    addclose() {
      this.$refs.inputDialog.close();
    },
    mainClose() {
      this.$refs.inputClose.close();
    }
  }
};
if (!Array) {
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_popup_dialog2 + _easycom_uni_icons2 + _easycom_uni_easyinput2 + _easycom_uni_data_select2 + _easycom_uni_popup2)();
}
const _easycom_uni_popup_dialog = () => "../../uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_data_select = () => "../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_popup_dialog + _easycom_uni_icons + _easycom_uni_easyinput + _easycom_uni_data_select + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.openAdd && $options.openAdd(...args)),
    b: common_vendor.f($data.mainList, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.name),
        b: item.mainStatus == 2
      }, item.mainStatus == 2 ? {} : {}, {
        c: common_vendor.t(item.mainStatus == 1 ? "正常" : item.mainStatus == 2 ? "封禁" : "-"),
        d: common_vendor.o(($event) => $options.openEdit(item.id, item.name), index),
        e: index
      });
    }),
    c: $data.triggered,
    d: common_vendor.o((...args) => $options.downCallback && $options.downCallback(...args)),
    e: $data.type == "add"
  }, $data.type == "add" ? {
    f: common_vendor.sr("inputClose", "ad5000a2-1,ad5000a2-0"),
    g: common_vendor.o($options.mainClose),
    h: common_vendor.o($options.handleEdit),
    i: common_vendor.o(($event) => $data.mainName = $event),
    j: common_vendor.p({
      focus: false,
      ["before-close"]: true,
      mode: "input",
      title: $data.title,
      value: $data.mainName,
      placeholder: "请输入企业主体名称",
      modelValue: $data.mainName
    })
  } : {}, {
    k: $data.type == "edit"
  }, $data.type == "edit" ? {
    l: common_vendor.p({
      type: "closeempty"
    }),
    m: common_vendor.o((...args) => $options.addclose && $options.addclose(...args)),
    n: common_vendor.o(($event) => $data.mainName = $event),
    o: common_vendor.p({
      placeholder: "请输入主体名称",
      modelValue: $data.mainName
    }),
    p: common_vendor.o(($event) => $data.mainStatus = $event),
    q: common_vendor.p({
      clear: false,
      localdata: [{
        text: "正常",
        value: 1
      }, {
        text: "被封",
        value: 2
      }],
      modelValue: $data.mainStatus
    }),
    r: common_vendor.o((...args) => $options.handleEdit && $options.handleEdit(...args))
  } : {}, {
    s: common_vendor.sr("inputDialog", "ad5000a2-0"),
    t: common_vendor.p({
      ["mask-click"]: false,
      type: "dialog",
      borderRadius: "10px",
      ["background-color"]: "#fff"
    }),
    v: common_vendor.o((...args) => $options.openEditData && $options.openEditData(...args)),
    w: common_vendor.o((...args) => $options.handleRemove && $options.handleRemove(...args)),
    x: common_vendor.o((...args) => $options.close && $options.close(...args)),
    y: common_vendor.sr("editHandle", "ad5000a2-5"),
    z: common_vendor.p({
      ["background-color"]: "#fff"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ad5000a2"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mainInfo/index.js.map
