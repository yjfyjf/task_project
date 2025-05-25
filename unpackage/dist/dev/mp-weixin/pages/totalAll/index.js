"use strict";
const common_vendor = require("../../common/vendor.js");
const util_api = require("../../util/api.js");
const _sfc_main = {
  data() {
    return {
      categoryList: [],
      categoryNameActive: 0,
      //当前选中active
      scrollTop: 0,
      //scroll-top
      scrollVal: 0,
      //滑动的值
      scrollStatus: true,
      //点击状态，是否能点击
      nodeHeight: [],
      //存储categoryList的top
      windowHeight: 0,
      windowTop: 0,
      subCategoryDetail: {
        todayNum: 0,
        totalNum: 0,
        totalUserInfoVo: []
      }
    };
  },
  mounted() {
    common_vendor.index.getSystemInfo({
      success: (res) => {
        this.windowHeight = res.windowHeight;
        this.windowTop = res.windowTop;
      }
    });
    this.nodeHeight = [];
    let theNode = common_vendor.index.createSelectorQuery().in(this).selectAll(".categoryList");
    theNode.boundingClientRect((data) => {
      data.forEach((item, index) => {
        this.nodeHeight.push({
          top: item.top,
          index
        });
      });
    }).exec();
  },
  async onLoad() {
    await this.getLineList();
  },
  methods: {
    async getLineList() {
      const _this = this;
      await util_api.getLineList().then((res) => {
        if (res.code == 200) {
          let dataList = res.data || [];
          dataList.forEach((i) => {
            i.itemData && i.itemData.length > 0 && i.itemData.forEach((j) => {
              _this.categoryList.push({
                id: j.id,
                name: j.name
              });
            });
          });
          _this.getTotalInfo();
        }
      });
    },
    getTotalInfo() {
      const _this = this;
      let params = {
        lineId: _this.categoryList[_this.categoryNameActive]["id"],
        startTime: _this.initDate() + " 00:00:00",
        endTime: _this.initDate() + " 23:59:59"
      };
      util_api.getTotalInfo(params).then((res) => {
        if (res.code == 200) {
          this.subCategoryDetail.totalNum = res.data.todayNum;
          this.subCategoryDetail.todayNum = res.data.totalNum;
          this.subCategoryDetail.totalUserInfoVo = res.data.totalUserInfoVo;
        }
      });
    },
    initDate() {
      const today = /* @__PURE__ */ new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const day = today.getDate();
      const time = year + "-" + month + "-" + day;
      return time;
    },
    categoryClickEvent(item, index) {
      if (this.scrollStatus) {
        this.scrollStatus = false;
        this.categoryNameActive = index;
        let theNode = common_vendor.index.createSelectorQuery().in(this).selectAll(".categoryList");
        theNode.boundingClientRect((data) => {
          this.scrollTop = this.scrollVal + data[0].top;
          setTimeout(() => {
            this.scrollStatus = true;
          }, 200);
          this.getTotalInfo();
        }).exec();
      }
    },
    scrollEvent(e) {
      if (this.scrollVal < e.detail.scrollTop) {
        this.nodeHeight.forEach((item) => {
          if (this.scrollVal - item.top < 0 && this.scrollVal - item.top > -this.windowHeight) {
            this.categoryNameActive = item.index;
          }
        });
      } else {
        this.nodeHeight.forEach((item) => {
          if (this.scrollVal - item.top > 0 && this.scrollVal - item.top < this.windowHeight) {
            this.categoryNameActive = item.index;
          }
        });
      }
      this.scrollVal = e.detail.scrollTop;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.categoryList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: index,
        c: common_vendor.n($data.categoryNameActive == index ? "categoryNameActive" : ""),
        d: common_vendor.o(($event) => $options.categoryClickEvent(item, index), index)
      };
    }),
    b: $data.categoryList && $data.categoryList.length > 0
  }, $data.categoryList && $data.categoryList.length > 0 ? {
    c: common_vendor.t($data.categoryList[$data.categoryNameActive].name + "今日：" + $data.subCategoryDetail.todayNum + "人； 共计：" + $data.subCategoryDetail.totalNum + "人")
  } : {}, {
    d: common_vendor.f($data.subCategoryDetail.totalUserInfoVo, (sub, idx, i0) => {
      return {
        a: common_vendor.t(sub.name + ":"),
        b: common_vendor.t(sub.todayNum),
        c: idx
      };
    }),
    e: $data.scrollTop,
    f: common_vendor.o((...args) => $options.scrollEvent && $options.scrollEvent(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-3fe41bf5"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/totalAll/index.js.map
