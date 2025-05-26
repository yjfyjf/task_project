"use strict";
const common_vendor = require("../../common/vendor.js");
const util_api = require("../../util/api.js");
const _sfc_main = {
  data() {
    return {
      perForm: {
        technicalTeam: "",
        technician: "",
        technicianId: "",
        platform: "",
        loanAmount: "",
        commissionRate: "",
        callAgentId: "",
        callAgentName: "",
        assignDate: "",
        processDate: "",
        wechatCode: "",
        wechatId: "",
        wechatName: "",
        customerName: "",
        source: "",
        sourceId: "",
        receivedAmount: "",
        paymentAccount: "",
        remark: ""
      },
      salesmanList: [],
      wChatList: [],
      roleList: [],
      taskList: [],
      lineObj: {},
      id: "",
      type: ""
    };
  },
  async onLoad(option) {
    this.lineObj = common_vendor.index.getStorageSync("line");
    await this.initSalesmanList();
    await this.getWChatDataList();
    await this.getTaskList();
    await this.getUserInfo();
    this.type = option.type;
    if (this.type == "update") {
      this.id = option.id;
      this.getPerformance();
    }
  },
  methods: {
    maskClick(e) {
      common_vendor.index.__f__("log", "at pages/performance/add.vue:106", "maskClick事件:", e);
    },
    getPerformance() {
      util_api.getPerformance(this.id).then((res) => {
        if (res.code == 200) {
          this.perForm = res.data;
        }
      });
    },
    initSalesmanList() {
      util_api.getSelectSalesmanList().then((res) => {
        this.salesmanList = res.data;
      });
    },
    getTaskList() {
      util_api.getTaskList().then((res) => {
        let taskList = [];
        res.data && res.data.length > 0 && res.data.forEach((i) => {
          taskList.push({
            text: i.name,
            value: i.id
          });
        });
        this.$nextTick(() => {
          this.taskList = taskList;
        });
      });
    },
    getUserInfo() {
      util_api.getUserInfo({ lineId: this.lineObj.id }).then((res) => {
        let roleList = [];
        res.data && res.data.length > 0 && res.data.forEach((i) => {
          roleList.push({
            text: i.name,
            value: i.id
          });
        });
        this.$nextTick(() => {
          this.roleList = roleList;
        });
      });
    },
    getWChatDataList() {
      util_api.getWChatList({
        current: 1,
        size: 2e3
      }).then((res) => {
        const wChatList = res.data.records || [];
        let chatList = [];
        wChatList && wChatList.length > 0 && wChatList.forEach((i) => {
          chatList.push({
            text: i.code,
            value: i.id,
            userName: i.userName
          });
        });
        this.$nextTick(() => {
          this.wChatList = chatList;
        });
      });
    },
    codeChange(e) {
      this.wChatList.forEach((i) => {
        if (i.value == e) {
          this.perForm.wechatName = i.userName;
          this.perForm.wechatCode = i.text;
        }
      });
    },
    technicianChange(e) {
      this.salesmanList.forEach((i) => {
        if (i.value == e) {
          this.perForm.technician = i.text;
        }
      });
    },
    sourceChange(e) {
      this.taskList.forEach((i) => {
        if (i.value == e) {
          this.perForm.source = i.text;
        }
      });
    },
    isValidNumber(input) {
      return /^\d*\.?\d+$/.test(input);
    },
    roleChange(e) {
      this.roleList.forEach((i) => {
        if (i.value == e) {
          this.perForm.callAgentName = i.text;
        }
      });
    },
    submit() {
      if (!this.perForm.technicalTeam) {
        return this.showToast("技术战队不能为空");
      }
      if (!this.perForm.technicianId) {
        return this.showToast("技术员不能为空");
      }
      if (!this.perForm.platform) {
        return this.showToast("下款平台不能为空");
      }
      if (!this.perForm.loanAmount) {
        return this.showToast("下款额度不能为空");
      }
      if (!this.perForm.commissionRate) {
        return this.showToast("点位不能为空");
      }
      if (!this.perForm.callAgentId) {
        return this.showToast("话务名字不能为空");
      }
      if (!this.perForm.assignDate) {
        return this.showToast("上人日期不能为空");
      }
      if (!this.perForm.processDate) {
        return this.showToast("办理日期不能为空");
      }
      if (!this.perForm.wechatId) {
        return this.showToast("手机编号不能为空");
      }
      if (!this.perForm.wechatName) {
        return this.showToast("微信名字不能为空");
      }
      if (!this.perForm.customerName) {
        return this.showToast("客户名字不能为空");
      }
      if (!this.perForm.sourceId) {
        return this.showToast("来源不能为空");
      }
      if (!this.perForm.receivedAmount) {
        return this.showToast("到账金额不能为空");
      }
      if (!this.isValidNumber(this.perForm.receivedAmount)) {
        common_vendor.index.showToast({
          title: "金额最多只能2位小数",
          icon: "none"
        });
        return;
      }
      if (!this.perForm.paymentAccount) {
        return this.showToast("收款帐户不能为空");
      }
      let params = JSON.parse(JSON.stringify(this.perForm));
      params.lineId = this.lineObj.id;
      params.id = this.id;
      let submitok = this.type == "update" ? util_api.perUpdate : util_api.performanceAdd;
      submitok(params).then((res) => {
        if (res.code == 200) {
          common_vendor.index.showToast({
            title: "新增成功",
            icon: "none",
            mask: true
          });
          common_vendor.index.navigateBack({ delta: 1 });
        }
      });
    },
    showToast(title) {
      common_vendor.index.showToast({
        title,
        icon: "none",
        mask: true
      });
    }
  }
};
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_uni_forms_item2 = common_vendor.resolveComponent("uni-forms-item");
  const _easycom_uni_data_select2 = common_vendor.resolveComponent("uni-data-select");
  const _easycom_uni_datetime_picker2 = common_vendor.resolveComponent("uni-datetime-picker");
  const _easycom_uni_forms2 = common_vendor.resolveComponent("uni-forms");
  (_easycom_uni_easyinput2 + _easycom_uni_forms_item2 + _easycom_uni_data_select2 + _easycom_uni_datetime_picker2 + _easycom_uni_forms2)();
}
const _easycom_uni_easyinput = () => "../../uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.js";
const _easycom_uni_forms_item = () => "../../uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.js";
const _easycom_uni_data_select = () => "../../uni_modules/uni-data-select/components/uni-data-select/uni-data-select.js";
const _easycom_uni_datetime_picker = () => "../../uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.js";
const _easycom_uni_forms = () => "../../uni_modules/uni-forms/components/uni-forms/uni-forms.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_uni_forms_item + _easycom_uni_data_select + _easycom_uni_datetime_picker + _easycom_uni_forms)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => $data.perForm.technicalTeam = $event),
    b: common_vendor.p({
      placeholder: "请填写技术战队",
      modelValue: $data.perForm.technicalTeam
    }),
    c: common_vendor.p({
      label: "技术战队:",
      ["label-width"]: "80px",
      required: true
    }),
    d: common_vendor.o($options.technicianChange),
    e: common_vendor.o(($event) => $data.perForm.technicianId = $event),
    f: common_vendor.p({
      placeholder: "技术员",
      clear: false,
      localdata: $data.salesmanList,
      modelValue: $data.perForm.technicianId
    }),
    g: common_vendor.p({
      label: "技术员:",
      ["label-width"]: "80px",
      required: true
    }),
    h: common_vendor.o(($event) => $data.perForm.platform = $event),
    i: common_vendor.p({
      placeholder: "请填写下款平台",
      modelValue: $data.perForm.platform
    }),
    j: common_vendor.p({
      label: "下款平台:",
      ["label-width"]: "80px",
      required: true
    }),
    k: common_vendor.o(($event) => $data.perForm.loanAmount = $event),
    l: common_vendor.p({
      type: "digit",
      placeholder: "请填写下款额度",
      modelValue: $data.perForm.loanAmount
    }),
    m: common_vendor.p({
      label: "下款额度:",
      ["label-width"]: "80px",
      required: true
    }),
    n: common_vendor.o(($event) => $data.perForm.commissionRate = $event),
    o: common_vendor.p({
      placeholder: "请填写点位",
      modelValue: $data.perForm.commissionRate
    }),
    p: common_vendor.p({
      label: "点位:",
      ["label-width"]: "80px",
      required: true
    }),
    q: common_vendor.o($options.roleChange),
    r: common_vendor.o(($event) => $data.perForm.callAgentId = $event),
    s: common_vendor.p({
      placeholder: "话务名字",
      localdata: $data.roleList,
      clear: false,
      modelValue: $data.perForm.callAgentId
    }),
    t: common_vendor.p({
      label: "话务名字:",
      ["label-width"]: "80px",
      required: true
    }),
    v: common_vendor.o($options.maskClick),
    w: common_vendor.o(($event) => $data.perForm.assignDate = $event),
    x: common_vendor.p({
      type: "date",
      ["show-confirm"]: false,
      ["clear-icon"]: false,
      modelValue: $data.perForm.assignDate
    }),
    y: common_vendor.p({
      label: "上人日期:",
      ["label-width"]: "80px",
      required: true
    }),
    z: common_vendor.o(($event) => $data.perForm.processDate = $event),
    A: common_vendor.p({
      type: "date",
      modelValue: $data.perForm.processDate
    }),
    B: common_vendor.p({
      label: "办理日期:",
      ["label-width"]: "80px",
      required: true
    }),
    C: common_vendor.o($options.codeChange),
    D: common_vendor.o(($event) => $data.perForm.wechatId = $event),
    E: common_vendor.p({
      placeholder: "手机编号",
      localdata: $data.wChatList,
      clear: false,
      modelValue: $data.perForm.wechatId
    }),
    F: common_vendor.p({
      label: "手机编号:",
      ["label-width"]: "80px",
      required: true
    }),
    G: common_vendor.o(($event) => $data.perForm.wechatName = $event),
    H: common_vendor.p({
      placeholder: "请填写微信名字",
      modelValue: $data.perForm.wechatName
    }),
    I: common_vendor.p({
      label: "微信名字:",
      ["label-width"]: "80px",
      required: true
    }),
    J: common_vendor.o(($event) => $data.perForm.customerName = $event),
    K: common_vendor.p({
      placeholder: "请填写客户名字",
      modelValue: $data.perForm.customerName
    }),
    L: common_vendor.p({
      label: "客户名字:",
      ["label-width"]: "80px",
      required: true
    }),
    M: common_vendor.o($options.sourceChange),
    N: common_vendor.o(($event) => $data.perForm.sourceId = $event),
    O: common_vendor.p({
      placeholder: "来源",
      localdata: $data.taskList,
      clear: false,
      modelValue: $data.perForm.sourceId
    }),
    P: common_vendor.p({
      label: "来源:",
      ["label-width"]: "80px",
      required: true
    }),
    Q: common_vendor.o(($event) => $data.perForm.receivedAmount = $event),
    R: common_vendor.p({
      type: "digit",
      placeholder: "请填写到账金额",
      modelValue: $data.perForm.receivedAmount
    }),
    S: common_vendor.p({
      label: "到账金额:",
      ["label-width"]: "80px",
      required: true
    }),
    T: common_vendor.o(($event) => $data.perForm.paymentAccount = $event),
    U: common_vendor.p({
      placeholder: "请填写收款帐户：",
      modelValue: $data.perForm.paymentAccount
    }),
    V: common_vendor.p({
      label: "收款帐户:",
      ["label-width"]: "80px",
      required: true
    }),
    W: common_vendor.o(($event) => $data.perForm.remark = $event),
    X: common_vendor.p({
      placeholder: "请填写备注",
      modelValue: $data.perForm.remark
    }),
    Y: common_vendor.p({
      label: "备注:",
      ["label-width"]: "80px"
    }),
    Z: common_vendor.sr("baseForm", "82d2bbb5-0"),
    aa: common_vendor.o((...args) => $options.submit && $options.submit(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-82d2bbb5"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/performance/add.js.map
