// app.js
require('./utils/v-request.js');
import './utils/eventBus'

App({
  onLaunch() {
    wx.cloud.init({
      env: "cloud1-4ghvvksf319af77b"
    })
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null,
    currIndex: 0
  },
  onMyEvent: function(data) {
    console.log("接收到的全局事件数据：", data);
  },
  // onHide() {
  //   wx.clearStorage()
  // }
})
