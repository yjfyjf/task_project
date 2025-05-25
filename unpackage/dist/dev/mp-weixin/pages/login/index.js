"use strict";
const common_vendor = require("../../common/vendor.js");
const util_request = require("../../util/request.js");
const util_api = require("../../util/api.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      avatarUrl: "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0",
      fileUrl: null,
      userName: null,
      name: null,
      lineInfo: null,
      company: "--",
      disabled: false
    };
  },
  onLoad(option) {
    this.company = option.company;
    this.lineInfo = common_vendor.index.getStorageSync("line");
    this.testUserInfo();
  },
  methods: {
    testUserInfo() {
      common_vendor.index.showLoading({
        noConflict: true
      });
      common_vendor.wx$1.login({
        success: async (res) => {
          common_vendor.index.__f__("log", "at pages/login/index.vue:62", res);
          const loginRes = await util_api.testUserInfo({ code: res.code, lineId: this.lineInfo.id });
          let userInfo = loginRes.data[0];
          this.userName = userInfo.userName;
          this.name = userInfo.name;
          if (userInfo.statusFlag == 3) {
            this.disabled = true;
            common_vendor.index.showToast({
              title: "该账号已离职，无法登录",
              icon: "none",
              mask: true
            });
            return;
          }
          if (userInfo.checkFlag == 0) {
            this.disabled = true;
            common_vendor.index.showToast({
              title: "该账号待审核，请等待管理员审核",
              icon: "none",
              mask: true
            });
            return;
          }
          if (userInfo.checkFlag == 2) {
            this.disabled = true;
            common_vendor.index.showToast({
              title: "该账号审核不通过",
              icon: "none",
              mask: true
            });
            return;
          }
          common_vendor.index.__f__("log", "at pages/login/index.vue:94", loginRes, "loginRes");
        },
        complete() {
          common_vendor.index.hideLoading({
            noConflict: true
          });
        }
      });
    },
    getUserName(data) {
      this.userName = data.detail.value;
    },
    onChooseAvatar(e) {
      const temUrl = e.detail.avatarUrl;
      this.avatarUrl = e.detail.avatarUrl;
      common_vendor.index.uploadFile({
        url: util_request.base_url + "/commonApi/uploadFileData",
        filePath: temUrl,
        name: "file",
        success: (res) => {
          const resData = JSON.parse(res.data);
          this.fileUrl = resData.data;
        }
      });
    },
    handleLogin() {
      let that = this;
      let params = {
        avatarUrl: this.fileUrl,
        userName: this.userName,
        name: this.name,
        lineId: this.lineInfo.id,
        code: ""
      };
      common_vendor.wx$1.login({
        success: async (res) => {
          common_vendor.index.__f__("log", "at pages/login/index.vue:131", res);
          params.code = res.code;
          const loginRes = await util_api.wxLogin(params);
          that.loginShow(loginRes.data);
        }
      });
    },
    loginShow(data) {
      if (data == null) {
        common_vendor.index.showModal({
          title: "提示",
          content: "注册成功，请等待管理员审核",
          showCancel: false,
          success() {
            common_vendor.index.navigateBack({
              delta: 1
            });
          }
        });
      } else {
        common_vendor.index.setStorageSync("userInfo", data);
        common_vendor.index.showToast({
          icon: "success",
          title: "登录成功",
          success() {
            setTimeout(() => {
              common_vendor.index.switchTab({
                url: "/pages/home/index"
              });
            }, 1e3);
          }
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.avatarUrl,
    b: common_vendor.o((...args) => $options.onChooseAvatar && $options.onChooseAvatar(...args)),
    c: common_assets._imports_0,
    d: common_vendor.t($data.company),
    e: common_assets._imports_0$1,
    f: common_assets._imports_2,
    g: common_vendor.o((...args) => $options.getUserName && $options.getUserName(...args)),
    h: $data.userName,
    i: common_vendor.o(($event) => $data.userName = $event.detail.value),
    j: common_assets._imports_2,
    k: $data.name,
    l: common_vendor.o(($event) => $data.name = $event.detail.value),
    m: common_vendor.n($data.disabled ? "buttonClass btn" : "buttonClass"),
    n: $data.disabled,
    o: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-d08ef7d4"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/index.js.map
