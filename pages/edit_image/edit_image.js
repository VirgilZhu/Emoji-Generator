// index.js
Page({
  data: {
    imagePath: '',
    editText: ''
  },
  
  chooseImage: function() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        // tempFilePath 可以作为 img 标签的 src 属性显示图片
        const tempFilePath = res.tempFilePaths[0];
        that.setData({
          imagePath: tempFilePath
        });
      }
    });
  },
  
  addText: function() {
    this.setData({
      editText: '这是添加的文字'
    });
  },
  
  applyFilter: function() {
    // 在这里实现滤镜效果
  }
});
