"use strict";
const common_vendor = require("../../common/vendor.js");
const util_api = require("../../util/api.js");
const noData = () => "../component/noData.js";
const _sfc_main = {
  components: { noData },
  data() {
    return {
      userInfoList: [],
      pageInfo: {
        current: 1,
        size: 9999
      },
      searchParams: {
        searchStr: null,
        statusFlag: null,
        roleId: null
      },
      roleList: [],
      total: 0,
      dataType: 1,
      editDataInfo: {},
      groupInfoList: [],
      triggered: false,
      options: [
        {
          text: "删除",
          style: {
            backgroundColor: "#db3231"
          }
        }
      ],
      isOpened: "none"
    };
  },
  watch: {
    dataType() {
      this.init();
    },
    "searchParams.statusFlag"() {
      this.init();
    },
    "searchParams.roleId"() {
      this.init();
    }
  },
  onShow() {
  },
  onLoad() {
    this.getUserList();
    this.initRoleData();
    this.initGroupList();
  },
  methods: {
    init() {
      this.userInfoList = [];
      this.getUserList();
    },
    async downCallback() {
      this.triggered = true;
      await this.getUserList();
      this.triggered = false;
    },
    goGroup() {
      common_vendor.index.navigateTo({
        url: "/pages/group/index"
      });
    },
    handleEdit() {
      let that2 = this;
      if (!that2.editDataInfo.name) {
        return that2.hint("姓名不能为空");
      }
      if (!that2.editDataInfo.userName) {
        return that2.hint("微信名不能为空");
      }
      if (!that2.editDataInfo.statusFlag) {
        return that2.hint("请选择状态");
      }
      if (!that2.editDataInfo.checkFlag) {
        return that2.hint("请选择审核状态");
      }
      if (!that2.editDataInfo.roleId) {
        return that2.hint("请选择角色");
      }
      util_api.editUserInfo(this.editDataInfo).then((res) => {
        common_vendor.index.showModal({
          title: "提示",
          content: "操作成功",
          showCancel: false,
          success() {
            that2.$refs.inputDialog.close();
            that2.handleSearch();
          }
        });
      });
    },
    hint(text) {
      common_vendor.index.showToast({
        title: text,
        icon: "none",
        duration: 2e3
      });
    },
    async initGroupList() {
      await util_api.getGroupList().then((res) => {
        this.groupInfoList = res.data;
      });
    },
    closeDialog() {
      this.$refs.inputDialog.close();
    },
    async initRoleData() {
      await util_api.getRoleList().then((res) => {
        this.roleList = res.data;
      });
    },
    handleSearch() {
      this.getUserList();
    },
    async getUserList() {
      if (this.dataType == null || this.dataType == "") {
        common_vendor.index.showToast({
          icon: "error",
          title: "请先选择展示类型"
        });
        return;
      }
      await util_api.getUserInfoList({
        ...this.pageInfo,
        ...this.searchParams,
        checkType: this.dataType
      }).then((res) => {
        if (this.dataType == 1) {
          this.userInfoList = res.data.records;
          this.total = res.data.total;
        } else {
          this.userInfoList = res.data;
        }
      });
    },
    openEdit(item) {
      this.editDataInfo = item;
      this.$refs.inputDialog.open();
    },
    handleRemove() {
      util_api.removeMission({ idList: [this.editDataInfo.openId] }).then((resData) => {
        if (resData.code == 200) {
          common_vendor.index.showToast({
            title: "操作成功",
            icon: "none",
            success() {
              that.getMissionList();
            }
          });
        }
      });
    },
    actionChange() {
    },
    bindClick(item) {
      let _this = this;
      common_vendor.index.showModal({
        title: "警告",
        content: "确定删除该用户吗?",
        success(res) {
          if (res.confirm) {
            util_api.deleteUser({ id: item.id }).then((resData) => {
              if (resData.code == 200) {
                common_vendor.index.showToast({
                  title: "删除成功",
                  icon: "none",
                  success() {
                    _this.isOpened = "done";
                    _this.getUserList();
                  }
                });
              }
            });
          } else {
            common_vendor.index.__f__("log", "at pages/user/index.vue:359", "取消");
          }
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_uni_tag2 = common_vendor.resolveComponent("uni-tag");
  const _easycom_uni_swipe_action_item2 = common_vendor.resolveComponent("uni-swipe-action-item");
  const _easycom_uni_swipe_action2 = common_vendor.resolveComponent("uni-swipe-action");
  const _component_noData = common_vendor.resolveComponent("noData");
  const _easycom_uni_collapse_item2 = common_vendor.resolveComponent("uni-collapse-item");
  const _easycom_uni_collapse2 = common_vendor.resolveComponent("uni-collapse");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_easyinput2 + _easycom_uni_data_select2 + _easycom_uni_tag2 + _easycom_uni_swipe_action_item2 + _easycom_uni_swipe_action2 + _component_noData + _easycom_uni_collapse_item2 + _easycom_uni_collapse2 + _easycom_uni_icons2 + _easycom_uni_forms_item2 + _easycom_uni_forms2 + _easycom_uni_popup2)();
}
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_data_select = () => "../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_tag = () => "../../uni_modules/uni-tag/components/uni-tag/uni-tag.js";
const _easycom_uni_swipe_action_item = () => "../../uni_modules/uni-swipe-action/components/uni-swipe-action-item/uni-swipe-action-item.js";
const _easycom_uni_swipe_action = () => "../../uni_modules/uni-swipe-action/components/uni-swipe-action/uni-swipe-action.js";
const _easycom_uni_collapse_item = () => "../../uni_modules/uni-collapse/components/uni-collapse-item/uni-collapse-item.js";
const _easycom_uni_collapse = () => "../../uni_modules/uni-collapse/components/uni-collapse/uni-collapse.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_forms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_data_select + _easycom_uni_tag + _easycom_uni_swipe_action_item + _easycom_uni_swipe_action + _easycom_uni_collapse_item + _easycom_uni_collapse + _easycom_uni_icons + _easycom_uni_forms_item + _easycom_uni_forms + _easycom_uni_popup)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($options.handleSearch),
    b: common_vendor.o(($event) => $data.searchParams.searchStr = $event),
    c: common_vendor.p({
      suffixIcon: "search",
      placeholder: "请输入搜索关键词",
      modelValue: $data.searchParams.searchStr
    }),
    d: common_vendor.o((...args) => $options.goGroup && $options.goGroup(...args)),
    e: common_vendor.o(($event) => $data.searchParams.statusFlag = $event),
    f: common_vendor.p({
      placeholder: "全部状态",
      localdata: [{
        text: "待审核",
        value: 4
      }, {
        text: "在岗",
        value: 1
      }, {
        text: "休假",
        value: 2
      }, {
        text: "离职",
        value: 3
      }],
      modelValue: $data.searchParams.statusFlag
    }),
    g: common_vendor.o(($event) => $data.searchParams.roleId = $event),
    h: common_vendor.p({
      placeholder: "全部角色",
      localdata: $data.roleList,
      modelValue: $data.searchParams.roleId
    }),
    i: common_vendor.o(($event) => $data.dataType = $event),
    j: common_vendor.p({
      placeholder: "展示类型",
      localdata: [{
        text: "列表",
        value: 1
      }, {
        text: "分组",
        value: 2
      }],
      clear: false,
      modelValue: $data.dataType
    }),
    k: $data.dataType == 1
  }, $data.dataType == 1 ? common_vendor.e({
    l: $data.userInfoList.length > 0
  }, $data.userInfoList.length > 0 ? {
    m: common_vendor.f($data.userInfoList, (item, index, i0) => {
      return {
        a: item.avatarUrl && item.avatarUrl.length > 0 ? "https://www.zflh168.com" + item.avatarUrl : "../../static/mine.png",
        b: item.avatarUrl,
        c: common_vendor.t(item.name),
        d: "79e6a490-6-" + i0 + "," + ("79e6a490-5-" + i0),
        e: common_vendor.p({
          text: item.roleName,
          type: "primary"
        }),
        f: "79e6a490-7-" + i0 + "," + ("79e6a490-5-" + i0),
        g: common_vendor.p({
          text: item.statusFlag == 1 ? "在岗" : item.statusFlag == 2 ? "休假" : item.statusFlag == 3 ? "离职" : "",
          type: item.statusFlag == 1 ? "success" : "error"
        }),
        h: "79e6a490-8-" + i0 + "," + ("79e6a490-5-" + i0),
        i: common_vendor.p({
          inverted: true,
          text: item.groupName,
          type: "error"
        }),
        j: common_vendor.o($options.actionChange, index),
        k: common_vendor.o(($event) => $options.bindClick(item), index),
        l: "79e6a490-5-" + i0 + "," + ("79e6a490-4-" + i0),
        m: "79e6a490-4-" + i0,
        n: common_vendor.o(($event) => $options.openEdit(item), index),
        o: index
      };
    }),
    n: common_vendor.p({
      ["right-options"]: $data.options,
      show: $data.isOpened,
      ["auto-close"]: false
    })
  } : {}) : common_vendor.e({
    o: common_vendor.f($data.userInfoList, (groupItem, groupIndex, i0) => {
      return {
        a: common_vendor.f(groupItem.itemData, (item, index, i1) => {
          return {
            a: item.avatarUrl && item.avatarUrl.length > 0 ? "https://www.zflh168.com" + item.avatarUrl : "../../static/mine.png",
            b: item.avatarUrl,
            c: common_vendor.t(item.name),
            d: "79e6a490-14-" + i0 + "-" + i1 + "," + ("79e6a490-13-" + i0 + "-" + i1),
            e: common_vendor.p({
              text: item.roleName,
              type: "primary"
            }),
            f: "79e6a490-15-" + i0 + "-" + i1 + "," + ("79e6a490-13-" + i0 + "-" + i1),
            g: common_vendor.p({
              text: item.statusFlag == 1 ? "在岗" : item.statusFlag == 2 ? "休假" : item.statusFlag == 3 ? "离职" : "",
              type: item.statusFlag == 1 ? "success" : "error"
            }),
            h: "79e6a490-16-" + i0 + "-" + i1 + "," + ("79e6a490-13-" + i0 + "-" + i1),
            i: common_vendor.p({
              inverted: true,
              text: item.groupName,
              type: "error"
            }),
            j: common_vendor.o($options.actionChange, index),
            k: common_vendor.o(($event) => $options.bindClick(item), index),
            l: "79e6a490-13-" + i0 + "-" + i1 + "," + ("79e6a490-12-" + i0 + "-" + i1),
            m: "79e6a490-12-" + i0 + "-" + i1 + "," + ("79e6a490-11-" + i0),
            n: common_vendor.o(($event) => $options.openEdit(item), index),
            o: index
          };
        }),
        b: groupItem.group,
        c: "79e6a490-11-" + i0 + ",79e6a490-10",
        d: common_vendor.p({
          title: groupItem.group
        })
      };
    }),
    p: common_vendor.p({
      ["right-options"]: $data.options,
      show: $data.isOpened,
      ["auto-close"]: false
    }),
    q: common_vendor.p({
      accordion: true
    }),
    r: $data.userInfoList.length == 0
  }, $data.userInfoList.length == 0 ? {} : {}), {
    s: $data.triggered,
    t: common_vendor.o((...args) => $options.downCallback && $options.downCallback(...args)),
    v: common_vendor.p({
      type: "closeempty"
    }),
    w: common_vendor.o((...args) => $options.closeDialog && $options.closeDialog(...args)),
    x: $data.editDataInfo.avatarUrl
  }, $data.editDataInfo.avatarUrl ? {
    y: "https://www.zflh168.com/" + $data.editDataInfo.avatarUrl
  } : {}, {
    z: common_vendor.o(($event) => $data.editDataInfo.name = $event),
    A: common_vendor.p({
      placeholder: "请输入姓名",
      modelValue: $data.editDataInfo.name
    }),
    B: common_vendor.p({
      label: "姓名:",
      ["label-width"]: "80px",
      required: true
    }),
    C: common_vendor.o(($event) => $data.editDataInfo.userName = $event),
    D: common_vendor.p({
      placeholder: "请输入微信名",
      modelValue: $data.editDataInfo.userName
    }),
    E: common_vendor.p({
      label: "微信名:",
      ["label-width"]: "80px",
      required: true
    }),
    F: common_vendor.o(($event) => $data.editDataInfo.statusFlag = $event),
    G: common_vendor.p({
      clear: false,
      localdata: [{
        text: "在岗",
        value: 1
      }, {
        text: "休假",
        value: 2
      }, {
        text: "离职",
        value: 3
      }],
      modelValue: $data.editDataInfo.statusFlag
    }),
    H: common_vendor.p({
      label: "状态:",
      ["label-width"]: "80px",
      required: true
    }),
    I: common_vendor.o(($event) => $data.editDataInfo.checkFlag = $event),
    J: common_vendor.p({
      clear: false,
      localdata: [{
        text: "待审核",
        value: 0
      }, {
        text: "审核通过",
        value: 1
      }, {
        text: "审核不通过",
        value: 2
      }],
      modelValue: $data.editDataInfo.checkFlag
    }),
    K: common_vendor.p({
      label: "审核状态:",
      ["label-width"]: "80px",
      required: true
    }),
    L: common_vendor.o(($event) => $data.editDataInfo.roleId = $event),
    M: common_vendor.p({
      placeholder: "全部角色",
      localdata: $data.roleList,
      clear: false,
      modelValue: $data.editDataInfo.roleId
    }),
    N: common_vendor.p({
      label: "角色:",
      ["label-width"]: "80px",
      required: true
    }),
    O: common_vendor.o(($event) => $data.editDataInfo.groupId = $event),
    P: common_vendor.p({
      placeholder: "全部分组",
      localdata: $data.groupInfoList,
      clear: false,
      modelValue: $data.editDataInfo.groupId
    }),
    Q: common_vendor.p({
      label: "归属组:",
      ["label-width"]: "80px"
    }),
    R: $data.editDataInfo.haveUserMission == 1
  }, $data.editDataInfo.haveUserMission == 1 ? {
    S: common_vendor.o((...args) => $options.handleRemove && $options.handleRemove(...args))
  } : {}, {
    T: common_vendor.o((...args) => $options.handleEdit && $options.handleEdit(...args)),
    U: common_vendor.sr("baseForm", "79e6a490-19,79e6a490-17"),
    V: common_vendor.sr("inputDialog", "79e6a490-17"),
    W: common_vendor.p({
      type: "dialog"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-79e6a490"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/index.js.map
