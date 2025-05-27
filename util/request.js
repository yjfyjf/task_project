// 全局请求封装
// export const base_url = "http://123.57.138.175:8080";
export const base_url = "https://www.zflh168.com";
// export const base_url = 'http://127.0.0.1:8080'
// 需要修改token，和根据实际修改请求头
export default (params) => {
  let url = params.url;
  let method = params.method || "get";
  let data = params.data || {};
  let header = {};
  if (method == "post") {
    header = {
      "Content-Type": "application/json",
    };
  }

  Object.keys(data).forEach((key) => {
    if (data[key] === null || data[key] === undefined) {
      delete data[key]; // 删除值为 null 或 undefined 的参数
    }
  });

  // 获取本地token
  if (uni.getStorageSync("userInfo")) {
    header["Authorization"] = uni.getStorageSync("userInfo").token;
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: base_url + url,
      method: method,
      header: header,
      data: data,
      success(response) {
        const res = response;
        // 根据返回的状态码做出对应的操作
        //获取成功
        if (res.statusCode == 200) {
          resolve(res.data);
        } else {
          let userInfo = uni.getStorageSync("userInfo");
          console.log(userInfo, "userInfo");
          if ((userInfo && Object.keys(userInfo).length == 0) || !userInfo) {
            uni.showModal({
              title: "提示",
              content: "请重新登录",
              showCancel: false,
              success(res) {
                setTimeout(() => {
                  uni.reLaunch({
                    url: "/pages/index/index",
                  });
                  clearTimeout();
                }, 500);
              },
            });
            return;
          }
          switch (res.statusCode) {
            case 401:
              uni.clearStorageSync();
              uni.showModal({
                title: "提示",
                content: "请重新登录",
                showCancel: false,
                success(res) {
                  setTimeout(() => {
                    uni.reLaunch({
                      url: "/pages/index/index",
                    });
                    clearTimeout();
                  }, 500);
                },
              });
              break;
            case 404:
              uni.clearStorageSync();
              uni.showToast({
                icon: "error",
                title: "请求地址不存在...",
                duration: 2000,
              });
              break;
            case 400:
              uni.showToast({
                title: res.data.error,
                icon: "none",
                mask: true,
              });
              break;
            case 500:
              if (res.data.error == "请先登录") {
                uni.reLaunch({
                  url: "/pages/index/index",
                });
                break;
              } else {
                uni.showToast({
                  title: res.data.error,
                  icon: "none",
                  mask: true,
                });
                break;
              }

            default:
              // uni.removeStorageSync("userInfo");
              // uni.showModal({
              //   title: "提示",
              //   content: "请重新登录",
              //   showCancel: false,
              //   success(res) {
              //     setTimeout(() => {
              //       uni.reLaunch({
              //         url: "/pages/index/index",
              //       });
              //       clearTimeout();
              //     }, 500);
              //   },
              // });
              break;
          }
        }
      },
      fail(err) {
        console.log(err);
        if (err.errMsg.indexOf("request:fail") !== -1) {
          uni.showToast({
            title: "网络异常",
            icon: "error",
            duration: 2000,
          });
        } else {
          uni.showToast({
            title: "未知异常",
            duration: 2000,
          });
        }
        reject(err);
      },
      complete() {
        // 不管成功还是失败都会执行
        uni.hideLoading({
          noConflict: true,
        });
      },
    });
  }).catch((e) => {});
};
