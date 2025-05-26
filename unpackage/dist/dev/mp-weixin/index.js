"use strict";
const common_vendor = require("./common/vendor.js");
const util_api = require("./util/api.js");
const common_assets = require("./common/assets.js");
const tab = () => "./components/wyg-bottom-tab/wyg-bottom-tab.js";
const _sfc_main = {
  components: { tab },
  data() {
    return {
      wChatList: [],
      mineMissionList: [],
      activeData: [],
      missionInfo: {},
      missionName: "",
      client: "",
      sort: 2,
      dataType: 1,
      addType: "",
      drawerWidth: 0,
      searchStr: "",
      current: 1,
      total: 0,
      isShow: false,
      detail: {},
      options: [
        {
          text: "删除",
          style: {
            backgroundColor: "#db3231"
          }
        }
      ],
      isOpened: "none",
      triggered: false,
      triggeredadd: false
    };
  },
  onShow() {
    this.getWChatList();
    this.getMissionList();
  },
  onLoad() {
  },
  methods: {
    actionChange() {
    },
    bindClick(item) {
      let _this = this;
      common_vendor.index.showModal({
        title: "警告",
        content: "确定删除该任务吗?",
        success(res) {
          if (res.confirm) {
            util_api.removeTaskUserMission([item.id]).then((resData) => {
              if (resData.code == 200) {
                common_vendor.index.showToast({
                  title: "操作成功",
                  icon: "none",
                  success() {
                    _this.isOpened = "done";
                    _this.getMissionList();
                  }
                });
              }
            });
          } else {
            common_vendor.index.__f__("log", "at pages/task/index.vue:216", "取消");
          }
        }
      });
    },
    async downCallbackadd() {
      this.triggeredadd = true;
      await this.getMissionList();
      this.triggeredadd = false;
    },
    async downCallback() {
      this.triggered = true;
      await this.getWChatList();
      this.triggered = false;
    },
    getMineMissionRank() {
      util_api.getMineMissionRank().then((res) => {
        if (res.code == 200) {
          this.detail = res.data;
        }
      });
    },
    removeCustomerItem(item) {
      let that = this;
      common_vendor.index.showModal({
        title: "警告",
        content: "确定删除该条数据吗?",
        success(res) {
          if (res.confirm) {
            util_api.removeCustomer(item.id).then((res2) => {
              common_vendor.index.showToast({
                title: "操作成功",
                icon: "none",
                success() {
                  that.getMissionList();
                }
              });
            });
          } else {
            common_vendor.index.__f__("log", "at pages/task/index.vue:256", "取消");
          }
        }
      });
    },
    collapseChange() {
      this.client = "";
    },
    removeItem(item) {
      let that = this;
      common_vendor.index.showModal({
        title: "警告",
        content: "确定清空任务吗?",
        success(res) {
          if (res.confirm) {
            util_api.removeMission([]).then((resData) => {
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
          } else {
            common_vendor.index.__f__("log", "at pages/task/index.vue:283", "取消");
          }
        }
      });
    },
    dialogInputConfirm(item) {
      if (!this.client) {
        common_vendor.index.showToast({
          title: "内容不能为空",
          icon: "none",
          mask: true
        });
        return;
      }
      let params = {
        missionId: item.missionId,
        wxId: item.wchatId,
        userMissionId: item.id,
        customerName: this.client
      };
      let that = this;
      util_api.addCustomerInfo(params).then((res) => {
        that.client = "";
        that.getMissionList();
      });
    },
    async getMissionList() {
      await util_api.getMineMissionList().then((res) => {
        let mineMissionList = res.data;
        mineMissionList.forEach((i) => {
          i.addTotal = 0;
          if (i.taskCustomerLogList && i.taskCustomerLogList.length > 0) {
            i.taskCustomerLogList.forEach((j) => {
              if (j.auditStatus) {
                i.addTotal += 1;
              }
            });
          }
        });
        this.mineMissionList = mineMissionList;
        this.isOpened = "left";
        this.missionName = this.mineMissionList && this.mineMissionList.length > 0 ? this.mineMissionList[0].missionName : "--";
        this.$nextTick(() => {
          this.$refs.collapse.resize();
        });
      });
      this.getMineMissionRank();
    },
    handleCheck(item) {
      const _this = this;
      if (item.trafficName) {
        return;
      }
      let that = this;
      let params = {
        wxId: item.id
      };
      util_api.addMissionInfo(params).then((res) => {
        common_vendor.index.showModal({
          title: "提示",
          content: "添加任务成功",
          showCancel: false,
          success() {
            _this.isShow = false;
            that.getMissionList();
          }
        });
      });
    },
    getStatus(index) {
      if (index == null) {
        return "";
      }
      switch (index) {
        case 1:
          return "正常";
        case 2:
          return "异常";
        case 3:
          return "被封";
      }
    },
    async getWChatList() {
      await util_api.getWChatList({ sort: this.sort, dataType: this.dataType, searchStr: this.searchStr, add: this.addType, size: 99999, current: 1, statusFlag: 1, saleManStatusFlag: 1 }).then((res) => {
        var _a;
        if (res.code == 200) {
          this.wChatList = ((_a = res == null ? void 0 : res.data) == null ? void 0 : _a.records) || [];
          if (this.addType == 1) {
            let wChatList = [];
            this.wChatList.forEach((i) => {
              if (!i.trafficName) {
                wChatList.push(i);
              }
            });
            this.wChatList = wChatList;
          }
          this.total = res.data.total;
        }
      });
    },
    openList() {
      if (this.isShow) {
        return;
      }
      this.drawerWidth = common_vendor.wx$1.getSystemInfoSync().windowWidth;
      this.isShow = true;
    },
    sortClick(e) {
      common_vendor.index.__f__("log", "at pages/task/index.vue:391", e, "添加数");
      common_vendor.index.__f__("log", "at pages/task/index.vue:392", this.sort, "未被添加数");
      if (e == 1 || e == 2) {
        this.current = 1;
        this.wChatList = [];
        this.getWChatList();
      } else if (e == 3) {
        this.wChatList.sort(function(a, b) {
          return a.customerCount - b.customerCount;
        });
      } else if (e == 4) {
        this.wChatList.sort(function(a, b) {
          return b.customerCount - a.customerCount;
        });
      }
    },
    addTypeClick(e) {
      common_vendor.index.__f__("log", "at pages/task/index.vue:408", e, "今日添加数");
      common_vendor.index.__f__("log", "at pages/task/index.vue:409", this.addType, "未被添加数");
      this.current = 1;
      this.wChatList = [];
      this.getWChatList();
    },
    dataTypeClick(e) {
      common_vendor.index.__f__("log", "at pages/task/index.vue:415", e, "未被添加数");
      common_vendor.index.__f__("log", "at pages/task/index.vue:416", this.dataType, "未被添加数");
      this.current = 1;
      this.wChatList = [];
      this.getWChatList();
    },
    pass(item) {
      util_api.auditStatus({ userMissionId: item.id, customerId: item.id }).then((res) => {
        if (res.code == 200) {
          common_vendor.index.showToast({
            title: "已通过",
            icon: "none",
            mask: true
          });
          this.getMissionList();
        }
      });
    },
    closeAdd() {
      this.isShow = false;
    }
  }
};
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_collapse_item2 = common_vendor.resolveComponent("uni-collapse-item");
  const _easycom_uni_swipe_action_item2 = common_vendor.resolveComponent("uni-swipe-action-item");
  const _easycom_uni_swipe_action2 = common_vendor.resolveComponent("uni-swipe-action");
  const _easycom_uni_collapse2 = common_vendor.resolveComponent("uni-collapse");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_uni_list_item2 = common_vendor.resolveComponent("uni-list-item");
  const _easycom_uni_list2 = common_vendor.resolveComponent("uni-list");
  const _component_tab = common_vendor.resolveComponent("tab");
  (_easycom_uni_easyinput2 + _easycom_uni_collapse_item2 + _easycom_uni_swipe_action_item2 + _easycom_uni_swipe_action2 + _easycom_uni_collapse2 + _easycom_uni_data_select2 + _easycom_uni_list_item2 + _easycom_uni_list2 + _component_tab)();
}
const _easycom_uni_easyinput = () => "./uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_collapse_item = () => "./uni_modules/uni-collapse/components/uni-collapse-item/uni-collapse-item.js";
const _easycom_uni_swipe_action_item = () => "./uni_modules/uni-swipe-action/components/uni-swipe-action-item/uni-swipe-action-item.js";
const _easycom_uni_swipe_action = () => "./uni_modules/uni-swipe-action/components/uni-swipe-action/uni-swipe-action.js";
const _easycom_uni_collapse = () => "./uni_modules/uni-collapse/components/uni-collapse/uni-collapse.js";
const _easycom_uni_data_select = () => "./uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_list_item = () => "./uni_modules/uni-list/components/uni-list-item/uni-list-item.js";
const _easycom_uni_list = () => "./uni_modules/uni-list/components/uni-list/uni-list.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_collapse_item + _easycom_uni_swipe_action_item + _easycom_uni_swipe_action + _easycom_uni_collapse + _easycom_uni_data_select + _easycom_uni_list_item + _easycom_uni_list)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.detail.rank > 0
  }, $data.detail.rank > 0 ? {
    b: common_vendor.t("今日邀请：" + ($data.detail.yqNum || 0)),
    c: common_vendor.t($data.detail.rank || "-"),
    d: common_vendor.t("今日新增：" + ($data.detail.addNum || 0))
  } : {}, {
    e: $data.detail.rank == 0
  }, $data.detail.rank == 0 ? {} : {}, {
    f: common_vendor.o((...args) => $options.openList && $options.openList(...args)),
    g: common_vendor.t($data.missionName || "--"),
    h: common_vendor.o((...args) => $options.removeItem && $options.removeItem(...args)),
    i: !$data.isShow
  }, !$data.isShow ? {
    j: common_vendor.f($data.mineMissionList, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.code || "-"),
        b: common_vendor.t("业务员：" + item.userName || "-"),
        c: common_vendor.t("已邀请：" + (item.total || 0) + "; 已添加：" + item.addTotal),
        d: "3dabfb60-4-" + i0 + "," + ("3dabfb60-3-" + i0),
        e: common_vendor.o(($event) => $data.client = $event, item.key),
        f: common_vendor.o(($event) => $options.dialogInputConfirm(item), item.key),
        g: common_vendor.f(item.taskCustomerLogList, (dataItem, dataIndex, i1) => {
          return common_vendor.e({
            a: common_vendor.t(dataItem.customerName),
            b: common_vendor.t((dataItem == null ? void 0 : dataItem.createTime.substring(5, 10)) + " " + (dataItem == null ? void 0 : dataItem.createTime.substring(11, 16))),
            c: dataItem.auditStatus != "已添加"
          }, dataItem.auditStatus != "已添加" ? {
            d: common_vendor.o(($event) => $options.pass(dataItem), dataIndex)
          } : {}, {
            e: dataItem.auditStatus == "已添加"
          }, dataItem.auditStatus == "已添加" ? {} : {}, {
            f: dataItem.auditStatus != "已添加"
          }, dataItem.auditStatus != "已添加" ? {
            g: common_vendor.o(($event) => $options.removeCustomerItem(dataItem), dataIndex)
          } : {}, {
            h: dataIndex
          });
        }),
        h: "3dabfb60-3-" + i0 + "," + ("3dabfb60-2-" + i0),
        i: common_vendor.o($options.actionChange, item.key),
        j: common_vendor.o(($event) => $options.bindClick(item), item.key),
        k: "3dabfb60-2-" + i0 + "," + ("3dabfb60-1-" + i0),
        l: "3dabfb60-1-" + i0 + ",3dabfb60-0",
        m: item.key
      };
    }),
    k: common_vendor.p({
      clearable: false,
      placeholder: "手机号/备注",
      modelValue: $data.client
    }),
    l: common_vendor.p({
      ["right-options"]: $data.options,
      show: $data.isOpened,
      ["auto-close"]: false
    }),
    m: common_vendor.sr("collapse", "3dabfb60-0"),
    n: common_vendor.o($options.collapseChange),
    o: common_vendor.o(($event) => $data.activeData = $event),
    p: common_vendor.p({
      accordion: true,
      modelValue: $data.activeData
    }),
    q: $data.triggered,
    r: common_vendor.o((...args) => $options.downCallback && $options.downCallback(...args))
  } : {}, {
    s: $data.isShow
  }, $data.isShow ? {
    t: common_vendor.o(($event) => $data.searchStr = $event),
    v: common_vendor.p({
      prefixIcon: "search",
      ["confirm-type"]: "search",
      placeholder: "标签/微信名/业务名筛选",
      modelValue: $data.searchStr
    }),
    w: common_assets._imports_0$2,
    x: common_vendor.o((...args) => $options.closeAdd && $options.closeAdd(...args)),
    y: common_vendor.o($options.sortClick),
    z: common_vendor.o(($event) => $data.sort = $event),
    A: common_vendor.p({
      placeholder: "排序",
      localdata: [{
        text: "添加数顺序",
        value: 3
      }, {
        text: "添加数倒序",
        value: 4
      }, {
        text: "编号顺序",
        value: 2
      }, {
        text: "编号倒序",
        value: 1
      }],
      clear: false,
      modelValue: $data.sort
    }),
    B: common_vendor.o($options.dataTypeClick),
    C: common_vendor.o(($event) => $data.dataType = $event),
    D: common_vendor.p({
      placeholder: "数量",
      localdata: [{
        text: "今日添加数",
        value: 1
      }, {
        text: "本周添加数",
        value: 2
      }, {
        text: "本月添加数",
        value: 3
      }],
      clear: false,
      modelValue: $data.dataType
    }),
    E: common_vendor.o($options.addTypeClick),
    F: common_vendor.o(($event) => $data.addType = $event),
    G: common_vendor.p({
      placeholder: "类型",
      localdata: [{
        text: "全部",
        value: ""
      }, {
        text: "未被添加",
        value: 1
      }],
      clear: false,
      modelValue: $data.addType
    }),
    H: common_vendor.f($data.wChatList, (item, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.code),
        b: item.userName
      }, item.userName ? {
        c: common_vendor.t(item.userName || "-")
      } : {}, {
        d: item.salesmanName
      }, item.salesmanName ? {
        e: common_vendor.t(item.salesmanName || "-")
      } : {}, {
        f: item.trafficName
      }, item.trafficName ? {
        g: common_vendor.t(item.trafficName + "任务")
      } : {}, {
        h: common_vendor.t(item.customerCount || 0),
        i: item.id,
        j: common_vendor.o(($event) => $options.handleCheck(item), item.id)
      });
    }),
    I: $data.triggeredadd,
    J: common_vendor.o((...args) => $options.downCallbackadd && $options.downCallbackadd(...args))
  } : {}, {
    K: common_vendor.p({
      id: 3
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-3dabfb60"]]);
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/index.js.map
