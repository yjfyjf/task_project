"use strict";
const common_vendor = require("../common/vendor.js");
const base_url = "https://www.zflh168.com";
const request = (params) => {
  let url = params.url;
  let method = params.method || "get";
  let data = params.data || {};
  let header = {};
  if (method == "post") {
    header = {
      "Content-Type": "application/json"
    };
  }
  Object.keys(data).forEach((key) => {
    if (data[key] === null || data[key] === void 0) {
      delete data[key];
    }
  });
  if (common_vendor.index.getStorageSync("userInfo")) {
    header["Authorization"] = common_vendor.index.getStorageSync("userInfo").token;
  }
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: base_url + url,
      method,
      header,
      data,
      success(response) {
        const res = response;
        if (res.statusCode == 200) {
          resolve(res.data);
        } else {
          let userInfo = common_vendor.index.getStorageSync("userInfo");
          common_vendor.index.__f__("log", "at util/request.js:42", userInfo, "userInfo");
          if (userInfo && Object.keys(userInfo).length == 0 || !userInfo) {
            common_vendor.index.showModal({
              title: "提示",
              content: "请重新登录",
              showCancel: false,
              success(res2) {
                setTimeout(() => {
                  common_vendor.index.reLaunch({
                    url: "/pages/index/index"
                  });
                  clearTimeout();
                }, 500);
              }
            });
            return;
          }
          switch (res.statusCode) {
            case 401:
              common_vendor.index.clearStorageSync();
              common_vendor.index.showModal({
                title: "提示",
                content: "请重新登录",
                showCancel: false,
                success(res2) {
                  setTimeout(() => {
                    common_vendor.index.reLaunch({
                      url: "/pages/index/index"
                    });
                    clearTimeout();
                  }, 500);
                }
              });
              break;
            case 404:
              common_vendor.index.clearStorageSync();
              common_vendor.index.showToast({
                icon: "error",
                title: "请求地址不存在...",
                duration: 2e3
              });
              break;
            case 400:
              common_vendor.index.showToast({
                title: res.data.error,
                icon: "none",
                mask: true
              });
              break;
            case 500:
              common_vendor.index.showToast({
                title: res.data.error,
                icon: "none",
                mask: true
              });
              break;
          }
        }
      },
      fail(err) {
        common_vendor.index.__f__("log", "at util/request.js:118", err);
        if (err.errMsg.indexOf("request:fail") !== -1) {
          common_vendor.index.showToast({
            title: "网络异常",
            icon: "error",
            duration: 2e3
          });
        } else {
          common_vendor.index.showToast({
            title: "未知异常",
            duration: 2e3
          });
        }
        reject(err);
      },
      complete() {
        common_vendor.index.hideLoading({
          noConflict: true
        });
      }
    });
  }).catch((e) => {
  });
};
exports.base_url = base_url;
exports.request = request;
//# sourceMappingURL=../../.sourcemap/mp-weixin/util/request.js.map
