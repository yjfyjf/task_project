import request from '@/util/request'

//获取线路列表
export function getLineList() {
	return request({
		url: '/taskLineInfoApi/getTaskLineInfoList',
		method: 'get'
	})
}

//获取公告信息
export function getNoticeInfo() {
	return request({
		url: '/taskNoticeInfoApi/getNoticeInfo',
		method: 'get'
	})
}

//发布公告
export function editNoticeInfo(data) {
	return request({
		url: '/taskNoticeInfoApi/editNoticeInfo',
		method: 'post',
		data: data
	})
}

//微信登录
export function wxLogin(params) {
	return request({
		url: '/taskUserInfoApi/wxUserLogin',
		method: 'post',
		data: params
	})
}

//获取用户列表
export function getUserInfoList(params) {
	return request({
		url: '/taskUserRoleApi/getUserInfoList',
		method: 'get',
		data: params
	})
}

//获取角色列表
export function getRoleList() {
	return request({
		url: '/taskUserRoleApi/getRoleList',
		method: 'get'
	})
}

//获取分组列表
export function getGroupList() {
	return request({
		url: '/taskUserRoleApi/getGroupList',
		method: 'get'
	})
}

//编辑用户
export function editUserInfo(params) {
	return request({
		url: '/taskUserRoleApi/editUserInfo',
		method: 'post',
		data: params
	})
}

//编辑分组信息
export function editGroupInfo(params) {
	return request({
		url: '/taskGroupInfoApi/editGroupInfo',
		method: 'post',
		data: params
	})
}

//删除分组信息
export function removeGroupInfo(id) {
	return request({
		url: `/taskGroupInfoApi/removeGroupInfo/${id}`,
		method: 'post'
	})
}

//获取业务员列表
export function getSalesmanList() {
	return request({
		url: '/taskSalesmanApi/getSalesmanList',
		method: 'get'
	})
}

//编辑业务员信息
export function editSalesmanInfo(params) {
	return request({
		url: '/taskSalesmanApi/editSalesmanInfo',
		method: 'post',
		data: params
	})
}

//删除业务员
export function removeSalesmanInfo(id) {
	return request({
		url: `/taskSalesmanApi/removeSalesmanInfo/${id}`,
		method: 'post'
	})
}

//获取主体列表
export function getMainList() {
	return request({
		url: '/taskMainInfoApi/getMainList',
		method: 'get'
	})
}

//编辑主体信息
export function editMainInfo(params) {
	return request({
		url: '/taskMainInfoApi/editMainInfo',
		method: 'post',
		data: params
	})
}

//删除主体信息
export function removeMainInfo(id) {
	return request({
		url: `/taskMainInfoApi/removeMainInfo/${id}`,
		method: 'post'
	})
}

//获取微信列表
export function getWChatList(params) {
	return request({
		url: '/taskWChatInfoApi/getWChatList',
		method: 'get',
		data: params
	})
}

//编辑微信用户信息
export function editWChatInfo(params) {
	return request({
		url: '/taskWChatInfoApi/editWChatInfo',
		method: 'post',
		data: params
	})
}

//获取主体下拉列表
export function getSelectMainList() {
	return request({
		url: '/taskWChatInfoApi/getMainList',
		method: 'get'
	})
}

//获取业务员下拉列表
export function getSelectSalesmanList() {
	return request({
		url: '/taskWChatInfoApi/getSalesmanList',
		method: 'get'
	})
}

//获取当前任务
export function getTask() {
	return request({
		url: '/taskMissionInfoApi/getNowTask',
		method: 'get'
	})
}

//创建任务
export function createTask(params) {
	return request({
		url: '/taskMissionInfoApi/createTask',
		method: 'post',
		data: params
	})
}

//获取微信任务列表
export function getWChatInfoList() {
	return request({
		url: '/taskCustomerLogApi/getWChatList',
		method: 'get'
	})
}

//添加任务
export function addMissionInfo(params) {
	return request({
		url: '/taskCustomerLogApi/addMissionInfo',
		method: 'post',
		data: params
	})
}

//获取我的任务
export function getMineMissionList() {
	return request({
		url: '/taskCustomerLogApi/getMineMissionInfo',
		method: 'get'
	})
}

//添加客户
export function addCustomerInfo(params) {
	return request({
		url: '/taskCustomerLogApi/addCustomerInfo',
		method: 'post',
		data: params
	})
}

//删除微信任务
export function removeMission(data) {
	return request({
		url: `/taskCustomerLogApi/removeMissionInfo`,
		method: 'post',
		data: data
	})
}

//删除微信任务(新)
export function removeCustomerNew(data) {
	return request({
		url: `/taskCustomerLogApi/removeCustomer`,
		method: 'post',
		data: data
	})
}

//删除客户信息
export function removeCustomer(id) {
	return request({
		url: `/taskCustomerLogApi/removeCustomerInfo/${id}`,
		method: 'post'
	})
}

//获取统计数据
export function getTotalData(params) {
	return request({
		url: '/taskTotalApi/getTotalList',
		method: 'get',
		data: params
	})
}

//获取首页统计数据
export function getHomeTotalData(params) {
	return request({
		url: '/homeApi/getTotalData',
		method: 'get',
		data: params
	})
}

//获取首页用户排行列表
export function getHomeUserTotalList(params) {
	return request({
		url: '/homeApi/getUserTotal',
		method: 'get',
		data: params
	})
}

//获取用户添加记录
export function getUserTotalList(params) {
	return request({
		url: '/taskTotalApi/getUserTotalList',
		method: 'get',
		data: params
	})
}

//删除详情
export function removeDetailInfo(id) {
	return request({
		url: `/taskMainInfoApi/removeMainInfo/${id}`,
		method: 'post',
	})
}

// 任务通过
export function auditStatus(data) {
	return request({
		url: `/taskCustomerLogApi/auditStatus`,
		method: 'post',
		data: data
	})
}

//获取任务相关列表
export function getAboutMission(data) {
	return request({
		url: '/taskCustomerLogApi/aboutMission',
		method: 'post',
		data: data
	})
}

// 删除任务相关列表
export function deleteMission(data) {
	return request({
		url: '/taskTotalApi/deleteMission',
		method: 'post',
		data: data
	})
}

// 业绩相关列表
export function performanceList(data) {
	return request({
		url: '/performance/listSum',
		method: 'post',
		data: data
	})
}

// 新增业绩
export function performanceAdd(data) {
	return request({
		url: '/performance/add',
		method: 'post',
		data: data
	})
}


//获取话务员
export function getUserInfo(params) {
	return request({
		url: '/taskUserInfoApi/userInfo',
		method: 'get',
		data: params
	})
}

//获取任务分组
export function getTaskList(params) {
	return request({
		url: '/taskMissionInfoApi/getTask',
		method: 'get',
		data: params
	})
}

// 获取业绩详情列表
export function getPerformanceDetail(data) {
	return request({
		url: '/performance/detail',
		method: 'post',
		data: data
	})
}

// 删除业绩
export function deletePerformance(id) {
	return request({
		url: '/performance/delete/' + id,
		method: 'delete',
	})
}

// 编辑业绩
export function perUpdate(data) {
	return request({
		url: '/performance/update',
		method: 'put',
		data: data
	})
}


// 获取业绩详情
export function getPerformance(id) {
	return request({
		url: '/performance/get/' + id,
		method: 'get',
	})
}

// 判断是否注册通过
export function testUserInfo(params) {
	return request({
		url: '/taskUserInfoApi/testUserInfo?openId=' + params.code + '&lineId=' + params.lineId,
		method: 'get',
	})
}

// 添加任务获取添加数、邀请数、排名
export function getMineMissionRank(params) {
	return request({
		url: '/taskCustomerLogApi/getMineMissionRank',
		method: 'get',
		data: params
	})
}

// 删除单个任务
export function removeTaskUserMission(data) {
	return request({
		url: '/taskCustomerLogApi/removeTaskUserMission',
		method: 'post',
		data: data
	})
}

// 删除单个微信
export function removeWChatInfo(data) {
	return request({
		url: '/taskWChatInfoApi/removeWChatInfo',
		method: 'post',
		data: data
	})
}


// 获取统计列表页面左上角明细按钮的数据
export function getUserTotalListDetail(params) {
	return request({
		url: '/taskTotalApi/getUserTotalListDetail',
		method: 'get',
		data: params
	})
}


// 获取是否为验证口令
export function getVerifyWord(params) {
	return request({
		url: '/taskCustomerLogApi/verifyWord',
		method: 'get',
		data: params
	})
}

// 获取是否为验证口令
export function getTotalInfo(data) {
	return request({
		url: '/taskCustomerLogApi/totalInfo',
		method: 'post',
		data: data
	})
}

// 删除用户
export function deleteUser(params) {
	return request({
		url: '/taskUserInfoApi/deleteUser',
		method: 'get',
		data: params
	})
}

// 获取业绩详情接口
export function getAllPerformance(data) {
	return request({
		url: '/performance/allPerformance',
		method: 'post',
		data: data
	})
}