// pages/gifs/gifs.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

    currIndex: app.globalData.currIndex
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const that = this;
    app.onMyEvent = function(data) {
      console.log("接收到的数据：", data);
      that.setData({currIndex: data})
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      currIndex: app.globalData.currIndex
    });
    if (typeof this.getTabBar === 'function' && this.getTabBar()){
      // app.globalData.currIndex = 3;
      this.getTabBar().setData({
        currIndex: 3
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})