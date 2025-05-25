"use strict";
const util_request = require("./request.js");
function getLineList() {
  return util_request.request({
    url: "/taskLineInfoApi/getTaskLineInfoList",
    method: "get"
  });
}
function getNoticeInfo() {
  return util_request.request({
    url: "/taskNoticeInfoApi/getNoticeInfo",
    method: "get"
  });
}
function editNoticeInfo(data) {
  return util_request.request({
    url: "/taskNoticeInfoApi/editNoticeInfo",
    method: "post",
    data
  });
}
function wxLogin(params) {
  return util_request.request({
    url: "/taskUserInfoApi/wxUserLogin",
    method: "post",
    data: params
  });
}
function getUserInfoList(params) {
  return util_request.request({
    url: "/taskUserRoleApi/getUserInfoList",
    method: "get",
    data: params
  });
}
function getRoleList() {
  return util_request.request({
    url: "/taskUserRoleApi/getRoleList",
    method: "get"
  });
}
function getGroupList() {
  return util_request.request({
    url: "/taskUserRoleApi/getGroupList",
    method: "get"
  });
}
function editUserInfo(params) {
  return util_request.request({
    url: "/taskUserRoleApi/editUserInfo",
    method: "post",
    data: params
  });
}
function editGroupInfo(params) {
  return util_request.request({
    url: "/taskGroupInfoApi/editGroupInfo",
    method: "post",
    data: params
  });
}
function removeGroupInfo(id) {
  return util_request.request({
    url: `/taskGroupInfoApi/removeGroupInfo/${id}`,
    method: "post"
  });
}
function getSalesmanList() {
  return util_request.request({
    url: "/taskSalesmanApi/getSalesmanList",
    method: "get"
  });
}
function editSalesmanInfo(params) {
  return util_request.request({
    url: "/taskSalesmanApi/editSalesmanInfo",
    method: "post",
    data: params
  });
}
function removeSalesmanInfo(id) {
  return util_request.request({
    url: `/taskSalesmanApi/removeSalesmanInfo/${id}`,
    method: "post"
  });
}
function getMainList() {
  return util_request.request({
    url: "/taskMainInfoApi/getMainList",
    method: "get"
  });
}
function editMainInfo(params) {
  return util_request.request({
    url: "/taskMainInfoApi/editMainInfo",
    method: "post",
    data: params
  });
}
function removeMainInfo(id) {
  return util_request.request({
    url: `/taskMainInfoApi/removeMainInfo/${id}`,
    method: "post"
  });
}
function getWChatList(params) {
  return util_request.request({
    url: "/taskWChatInfoApi/getWChatList",
    method: "get",
    data: params
  });
}
function editWChatInfo(params) {
  return util_request.request({
    url: "/taskWChatInfoApi/editWChatInfo",
    method: "post",
    data: params
  });
}
function getSelectMainList() {
  return util_request.request({
    url: "/taskWChatInfoApi/getMainList",
    method: "get"
  });
}
function getSelectSalesmanList() {
  return util_request.request({
    url: "/taskWChatInfoApi/getSalesmanList",
    method: "get"
  });
}
function getTask() {
  return util_request.request({
    url: "/taskMissionInfoApi/getNowTask",
    method: "get"
  });
}
function createTask(params) {
  return util_request.request({
    url: "/taskMissionInfoApi/createTask",
    method: "post",
    data: params
  });
}
function addMissionInfo(params) {
  return util_request.request({
    url: "/taskCustomerLogApi/addMissionInfo",
    method: "post",
    data: params
  });
}
function getMineMissionList() {
  return util_request.request({
    url: "/taskCustomerLogApi/getMineMissionInfo",
    method: "get"
  });
}
function addCustomerInfo(params) {
  return util_request.request({
    url: "/taskCustomerLogApi/addCustomerInfo",
    method: "post",
    data: params
  });
}
function removeMission(data) {
  return util_request.request({
    url: `/taskCustomerLogApi/removeMissionInfo`,
    method: "post",
    data
  });
}
function removeCustomerNew(data) {
  return util_request.request({
    url: `/taskCustomerLogApi/removeCustomer`,
    method: "post",
    data
  });
}
function removeCustomer(id) {
  return util_request.request({
    url: `/taskCustomerLogApi/removeCustomerInfo/${id}`,
    method: "post"
  });
}
function getTotalData(params) {
  return util_request.request({
    url: "/taskTotalApi/getTotalList",
    method: "get",
    data: params
  });
}
function getHomeTotalData(params) {
  return util_request.request({
    url: "/homeApi/getTotalData",
    method: "get",
    data: params
  });
}
function getHomeUserTotalList(params) {
  return util_request.request({
    url: "/homeApi/getUserTotal",
    method: "get",
    data: params
  });
}
function getUserTotalList(params) {
  return util_request.request({
    url: "/taskTotalApi/getUserTotalList",
    method: "get",
    data: params
  });
}
function auditStatus(data) {
  return util_request.request({
    url: `/taskCustomerLogApi/auditStatus`,
    method: "post",
    data
  });
}
function getAboutMission(data) {
  return util_request.request({
    url: "/taskCustomerLogApi/aboutMission",
    method: "post",
    data
  });
}
function deleteMission(data) {
  return util_request.request({
    url: "/taskTotalApi/deleteMission",
    method: "post",
    data
  });
}
function performanceList(data) {
  return util_request.request({
    url: "/performance/listSum",
    method: "post",
    data
  });
}
function performanceAdd(data) {
  return util_request.request({
    url: "/performance/add",
    method: "post",
    data
  });
}
function getUserInfo(params) {
  return util_request.request({
    url: "/taskUserInfoApi/userInfo",
    method: "get",
    data: params
  });
}
function getTaskList(params) {
  return util_request.request({
    url: "/taskMissionInfoApi/getTask",
    method: "get",
    data: params
  });
}
function getPerformanceDetail(data) {
  return util_request.request({
    url: "/performance/detail",
    method: "post",
    data
  });
}
function deletePerformance(id) {
  return util_request.request({
    url: "/performance/delete/" + id,
    method: "delete"
  });
}
function perUpdate(data) {
  return util_request.request({
    url: "/performance/update",
    method: "put",
    data
  });
}
function getPerformance(id) {
  return util_request.request({
    url: "/performance/get/" + id,
    method: "get"
  });
}
function testUserInfo(params) {
  return util_request.request({
    url: "/taskUserInfoApi/testUserInfo?openId=" + params.code + "&lineId=" + params.lineId,
    method: "get"
  });
}
function getMineMissionRank(params) {
  return util_request.request({
    url: "/taskCustomerLogApi/getMineMissionRank",
    method: "get",
    data: params
  });
}
function removeTaskUserMission(data) {
  return util_request.request({
    url: "/taskCustomerLogApi/removeTaskUserMission",
    method: "post",
    data
  });
}
function removeWChatInfo(data) {
  return util_request.request({
    url: "/taskWChatInfoApi/removeWChatInfo",
    method: "post",
    data
  });
}
function getUserTotalListDetail(params) {
  return util_request.request({
    url: "/taskTotalApi/getUserTotalListDetail",
    method: "get",
    data: params
  });
}
function getVerifyWord(params) {
  return util_request.request({
    url: "/taskCustomerLogApi/verifyWord",
    method: "get",
    data: params
  });
}
function getTotalInfo(data) {
  return util_request.request({
    url: "/taskCustomerLogApi/totalInfo",
    method: "post",
    data
  });
}
function deleteUser(params) {
  return util_request.request({
    url: "/taskUserInfoApi/deleteUser",
    method: "get",
    data: params
  });
}
function getAllPerformance(data) {
  return util_request.request({
    url: "/performance/allPerformance",
    method: "post",
    data
  });
}
exports.addCustomerInfo = addCustomerInfo;
exports.addMissionInfo = addMissionInfo;
exports.auditStatus = auditStatus;
exports.createTask = createTask;
exports.deleteMission = deleteMission;
exports.deletePerformance = deletePerformance;
exports.deleteUser = deleteUser;
exports.editGroupInfo = editGroupInfo;
exports.editMainInfo = editMainInfo;
exports.editNoticeInfo = editNoticeInfo;
exports.editSalesmanInfo = editSalesmanInfo;
exports.editUserInfo = editUserInfo;
exports.editWChatInfo = editWChatInfo;
exports.getAboutMission = getAboutMission;
exports.getAllPerformance = getAllPerformance;
exports.getGroupList = getGroupList;
exports.getHomeTotalData = getHomeTotalData;
exports.getHomeUserTotalList = getHomeUserTotalList;
exports.getLineList = getLineList;
exports.getMainList = getMainList;
exports.getMineMissionList = getMineMissionList;
exports.getMineMissionRank = getMineMissionRank;
exports.getNoticeInfo = getNoticeInfo;
exports.getPerformance = getPerformance;
exports.getPerformanceDetail = getPerformanceDetail;
exports.getRoleList = getRoleList;
exports.getSalesmanList = getSalesmanList;
exports.getSelectMainList = getSelectMainList;
exports.getSelectSalesmanList = getSelectSalesmanList;
exports.getTask = getTask;
exports.getTaskList = getTaskList;
exports.getTotalData = getTotalData;
exports.getTotalInfo = getTotalInfo;
exports.getUserInfo = getUserInfo;
exports.getUserInfoList = getUserInfoList;
exports.getUserTotalList = getUserTotalList;
exports.getUserTotalListDetail = getUserTotalListDetail;
exports.getVerifyWord = getVerifyWord;
exports.getWChatList = getWChatList;
exports.perUpdate = perUpdate;
exports.performanceAdd = performanceAdd;
exports.performanceList = performanceList;
exports.removeCustomer = removeCustomer;
exports.removeCustomerNew = removeCustomerNew;
exports.removeGroupInfo = removeGroupInfo;
exports.removeMainInfo = removeMainInfo;
exports.removeMission = removeMission;
exports.removeSalesmanInfo = removeSalesmanInfo;
exports.removeTaskUserMission = removeTaskUserMission;
exports.removeWChatInfo = removeWChatInfo;
exports.testUserInfo = testUserInfo;
exports.wxLogin = wxLogin;
//# sourceMappingURL=../../.sourcemap/mp-weixin/util/api.js.map
