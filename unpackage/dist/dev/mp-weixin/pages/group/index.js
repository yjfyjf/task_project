"use strict";
const common_vendor = require("../../common/vendor.js");
const util_api = require("../../util/api.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      title: "",
      groupId: "",
      groupName: null,
      groupList: [],
      triggered: false
    };
  },
  onLoad() {
    this.getGroupList();
  },
  methods: {
    async downCallback() {
      this.triggered = true;
      await this.getGroupList();
      this.triggered = false;
    },
    handleRemove() {
      let that = this;
      common_vendor.index.showModal({
        title: "警告",
        content: "确定删除该分组信息吗",
        success(handle) {
          if (handle.confirm) {
            that.$refs.editHandle.close();
            util_api.removeGroupInfo(that.groupId).then((res) => {
              common_vendor.index.showModal({
                title: "提示",
                content: "操作成功",
                showCancel: false,
                success() {
                  that.getGroupList();
                }
              });
            });
          }
        }
      });
    },
    async getGroupList() {
      await util_api.getGroupList().then((res) => {
        this.groupList = res.data;
      });
    },
    openAdd() {
      this.title = "添加分组";
      this.groupName = "";
      this.groupId = "";
      this.$refs.inputDialog.open();
    },
    openEdit(id, item) {
      this.groupId = id;
      this.groupName = item;
      this.$refs.editHandle.open("bottom");
    },
    openEditData() {
      this.title = "编辑分组";
      this.$refs.editHandle.close();
      this.$refs.inputDialog.open();
    },
    handleEdit() {
      let that = this;
      if (!that.groupName) {
        common_vendor.index.showToast({
          title: "分组名称不能为空",
          icon: "none",
          mask: true
        });
        return;
      }
      this.$refs.inputDialog.close();
      let params = {
        id: this.groupId,
        name: this.groupName
      };
      util_api.editGroupInfo(params).then((res) => {
        if (res.code == 200) {
          common_vendor.index.showToast({
            title: "操作成功",
            icon: "none",
            mask: true
          });
          that.getGroupList();
        }
      });
    },
    groupClose() {
      this.$refs.inputClose.close();
    }
  }
};
if (!Array) {
  const _easycom_uni_popup_dialog2 = common_vendor.resolveComponent("uni-popup-dialog");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_popup_dialog2 + _easycom_uni_popup2)();
}
const _easycom_uni_popup_dialog = () => "../../uni_modules/uni-popup/components/uni-popup-dialog/uni-popup-dialog.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_popup_dialog + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.openAdd && $options.openAdd(...args)),
    b: common_vendor.f($data.groupList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.text),
        b: common_vendor.t(item.num || "--"),
        c: common_vendor.o(($event) => $options.openEdit(item.value, item.text), index),
        d: index
      };
    }),
    c: common_assets._imports_0$1,
    d: $data.triggered,
    e: common_vendor.o((...args) => $options.downCallback && $options.downCallback(...args)),
    f: common_vendor.sr("inputClose", "191b8d1f-1,191b8d1f-0"),
    g: common_vendor.o($options.groupClose),
    h: common_vendor.o($options.handleEdit),
    i: common_vendor.o(($event) => $data.groupName = $event),
    j: common_vendor.p({
      ["before-close"]: true,
      mode: "input",
      title: $data.title,
      value: $data.groupName,
      placeholder: "请输入名称",
      modelValue: $data.groupName
    }),
    k: common_vendor.sr("inputDialog", "191b8d1f-0"),
    l: common_vendor.p({
      type: "dialog"
    }),
    m: common_vendor.o((...args) => $options.openEditData && $options.openEditData(...args)),
    n: common_vendor.o((...args) => $options.handleRemove && $options.handleRemove(...args)),
    o: common_vendor.sr("editHandle", "191b8d1f-2"),
    p: common_vendor.p({
      ["background-color"]: "#fff"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-191b8d1f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/group/index.js.map
