<template>
    <view class="pages">
        <view class="content">
            <uni-forms class="form-content" ref="baseForm">
                <uni-forms-item class="form-item" label="技术战队:" label-width="80px" required>
                    <uni-easyinput v-model="perForm.technicalTeam" placeholder="请填写技术战队" />
                </uni-forms-item>
                <uni-forms-item class="form-item" label="技术员:" label-width="80px" required>
                    <uni-data-select placeholder="技术员" v-model="perForm.technicianId" :clear="false" :localdata="salesmanList" @change="technicianChange"></uni-data-select>
                </uni-forms-item>

                <uni-forms-item class="form-item" label="下款平台:" label-width="80px" required>
                    <uni-easyinput v-model="perForm.platform" placeholder="请填写下款平台" />
                </uni-forms-item>
                <uni-forms-item class="form-item" label="下款额度:" label-width="80px" required>
                    <uni-easyinput type="digit" v-model="perForm.loanAmount" placeholder="请填写下款额度" />
                </uni-forms-item>
                <uni-forms-item class="form-item" label="点位:" label-width="80px" required>
                    <uni-easyinput v-model="perForm.commissionRate" placeholder="请填写点位" />
                </uni-forms-item>
                <uni-forms-item class="form-item" label="话务名字:" label-width="80px" required>
                    <uni-data-select placeholder="话务名字" :localdata="roleList" :clear="false" v-model="perForm.callAgentId" @change="roleChange"></uni-data-select>
                </uni-forms-item>
                <uni-forms-item class="form-item" label="上人日期:" label-width="80px" required>
                    <uni-datetime-picker type="date" :show-confirm="false" :clear-icon="false" @maskClick="maskClick" v-model="perForm.assignDate"></uni-datetime-picker>
                </uni-forms-item>
                <uni-forms-item class="form-item" label="办理日期:" label-width="80px" required>
                    <uni-datetime-picker type="date" v-model="perForm.processDate"></uni-datetime-picker>
                </uni-forms-item>
                <uni-forms-item class="form-item" label="手机编号:" label-width="80px" required>
                    <uni-data-select placeholder="手机编号" :localdata="wChatList" :clear="false" v-model="perForm.wechatId" @change="codeChange"></uni-data-select>
                </uni-forms-item>
                <uni-forms-item class="form-item" label="微信名字:" label-width="80px" required>
                    <uni-easyinput v-model="perForm.wechatName" placeholder="请填写微信名字" />
                </uni-forms-item>
                <uni-forms-item class="form-item" label="客户名字:" label-width="80px" required>
                    <uni-easyinput v-model="perForm.customerName" placeholder="请填写客户名字" />
                </uni-forms-item>
                <uni-forms-item class="form-item" label="来源:" label-width="80px" required>
                    <uni-data-select placeholder="来源" :localdata="taskList" :clear="false" v-model="perForm.sourceId" @change="sourceChange"></uni-data-select>
                </uni-forms-item>
                <uni-forms-item class="form-item" label="到账金额:" label-width="80px" required>
                    <uni-easyinput type="digit" v-model="perForm.receivedAmount" placeholder="请填写到账金额" />
                </uni-forms-item>
                <uni-forms-item class="form-item" label="收款帐户:" label-width="80px" required>
                    <uni-easyinput v-model="perForm.paymentAccount" placeholder="请填写收款帐户：" />
                </uni-forms-item>
                <uni-forms-item class="form-item" label="备注:" label-width="80px">
                    <uni-easyinput v-model="perForm.remark" placeholder="请填写备注" />
                </uni-forms-item>
            </uni-forms>
        </view>
        <div class="btn" @click="submit">确 认 添 加</div>
    </view>
</template>
<script>
import { getSelectSalesmanList, getWChatList, getTaskList, getUserInfo, performanceAdd, getPerformance, perUpdate } from '@/util/api';

export default {
    data() {
        return {
            perForm: {
                technicalTeam: '',
                technician: '',
                technicianId: '',
                platform: '',
                loanAmount: '',
                commissionRate: '',
                callAgentId: '',
                callAgentName: '',
                assignDate: '',
                processDate: '',
                wechatCode: '',
                wechatId: '',
                wechatName: '',
                customerName: '',
                source: '',
                sourceId: '',
                receivedAmount: '',
                paymentAccount: '',
                remark: '',
            },
            salesmanList: [],
            wChatList: [],
            roleList: [],
            taskList: [],
            lineObj: {},
            id: '',
            type: ''
        }
    },
    async onLoad(option) {
        this.lineObj = uni.getStorageSync('line')
        await this.initSalesmanList()
        await this.getWChatDataList()
        await this.getTaskList()
        await this.getUserInfo()
        this.type = option.type
        if (this.type == 'update') {
            this.id = option.id
            this.getPerformance()
        }
    },
    methods: {
        maskClick(e) {
            console.log('maskClick事件:', e);
        },
        getPerformance() {
            getPerformance(this.id).then(res => {
                if (res.code == 200) {
                    this.perForm = res.data
                }
            })
        },
        initSalesmanList() {
            getSelectSalesmanList().then(res => {
                this.salesmanList = res.data
            })
        },
        getTaskList() {
            getTaskList().then(res => {
                res.data && res.data.length > 0 && res.data.forEach(i => {
                    this.taskList.push({
                        text: i.name,
                        value: i.id
                    })
                });
            })
        },
        getUserInfo() {
            getUserInfo({ lineId: this.lineObj.id }).then(res => {
                res.data && res.data.length > 0 && res.data.forEach(i => {
                    this.roleList.push({
                        text: i.name,
                        value: i.id
                    })
                });
            })
        },
        getWChatDataList() {
            getWChatList({
                current: 1,
                size: 2000,
            }).then(res => {
                const wChatList = res.data.records || []
                wChatList && wChatList.length > 0 && wChatList.forEach(i => {
                    this.wChatList.push({
                        text: i.code,
                        value: i.id,
                        userName: i.userName
                    })
                });
            })
        },
        codeChange(e) {
            this.wChatList.forEach(i => {
                if (i.value == e) {
                    this.perForm.wechatName = i.userName
                    this.perForm.wechatCode = i.text
                }
            })
        },
        technicianChange(e) {
            this.salesmanList.forEach(i => {
                if (i.value == e) {
                    this.perForm.technician = i.text
                }
            })
        },
        sourceChange(e) {
            this.taskList.forEach(i => {
                if (i.value == e) {
                    this.perForm.source = i.text
                }
            })
        },
        isValidNumber(input) {
            return /^\d*\.?\d+$/.test(input);
        },
        roleChange(e) {
            this.roleList.forEach(i => {
                if (i.value == e) {
                    this.perForm.callAgentName = i.text
                }
            })
        },
        submit() {
            if (!this.perForm.technicalTeam) {
                return this.showToast('技术战队不能为空')
            }
            if (!this.perForm.technicianId) {
                return this.showToast('技术员不能为空')
            }
            if (!this.perForm.platform) {
                return this.showToast('下款平台不能为空')
            }
            if (!this.perForm.loanAmount) {
                return this.showToast('下款额度不能为空')
            }
            if (!this.perForm.commissionRate) {
                return this.showToast('点位不能为空')
            }
            if (!this.perForm.callAgentId) {
                return this.showToast('话务名字不能为空')
            }
            if (!this.perForm.assignDate) {
                return this.showToast('上人日期不能为空')
            }
            if (!this.perForm.processDate) {
                return this.showToast('办理日期不能为空')
            }
            if (!this.perForm.wechatId) {
                return this.showToast('手机编号不能为空')
            }
            if (!this.perForm.wechatName) {
                return this.showToast('微信名字不能为空')
            }
            if (!this.perForm.customerName) {
                return this.showToast('客户名字不能为空')
            }
            if (!this.perForm.sourceId) {
                return this.showToast('来源不能为空')
            }
            if (!this.perForm.receivedAmount) {
                return this.showToast('到账金额不能为空')
            }
            if (!this.isValidNumber(this.perForm.receivedAmount)) {
                uni.showToast({
                    title: '金额最多只能2位小数',
                    icon: 'none'
                })
                return
            }
            if (!this.perForm.paymentAccount) {
                return this.showToast('收款帐户不能为空')
            }
            let params = JSON.parse(JSON.stringify(this.perForm))
            params.lineId = this.lineObj.id
            params.id = this.id
            let submitok = this.type == 'update' ? perUpdate : performanceAdd
            submitok(params).then(res => {
                if (res.code == 200) {
                    uni.showToast({
                        title: '新增成功',
                        icon: 'none',
                        mask: true
                    })
                    uni.navigateBack({ delta: 1 })
                }
            })
        },
        showToast(title) {
            uni.showToast({
                title: title,
                icon: 'none',
                mask: true
            })
        }
    },
}
</script>
<style lang="scss" scoped>
.pages {
    padding: 22rpx 0 32rpx 0;
    background: #fff;

    .content {
        padding: 4rpx 24rpx 88rpx 24rpx;
    }

    .form-content {
        .form-item {
            margin: 0;
        }
    }

    ::v-deep .uni-forms-item {
        margin-bottom: 10rpx;
        border-bottom: 1px solid #eee;
    }

    .btn {
        background: #2b77f6;
        font-size: 24rpx;
        text-align: center;
        border-radius: 18rpx;
        color: #fff;
        padding: 24rpx 0;
        position: fixed;
        bottom: 0;
        right: 20rpx;
        left: 20rpx;
        z-index: 9;
    }
}

::v-deep .uni-easyinput__content-input {
    height: 66rpx;
    width: 90%;
}

::v-deep .uni-select__selector-item {
    white-space: nowrap;
    font-size: 28rpx;
}

::v-deep .uni-date-editor {
    padding: 16rpx 0 0 0;
}

::v-deep .uni-date-editor {
    padding: 8rpx 0 0 0;
}

::v-deep .uni-date-single {
    height: 50rpx;
}
</style>