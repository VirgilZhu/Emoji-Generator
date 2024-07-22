Page({
  data: {
    styleOptions: ['Style 1', 'Style 2', 'Style 3'],
    selectedStyle: 'Style 1',
    textBoxes: [''],
    imageUrl: ''
  },
  onShow(){
    if (typeof this.getTabBar === 'function' && this.getTabBar()){
      this.getTabBar().setData({
        currIndex: 0
      });
    }
  },
  onStyleChange(e) {
    const selectedStyle = this.data.styleOptions[e.detail.value];
    let textBoxes = [];

    // 根据选择的样式设置文本框数量
    if (selectedStyle === 'Style 1') {
      textBoxes = [''];
    } else if (selectedStyle === 'Style 2') {
      textBoxes = ['', ''];
    } else if (selectedStyle === 'Style 3') {
      textBoxes = ['', '', ''];
    }

    this.setData({
      selectedStyle: selectedStyle,
      textBoxes: textBoxes
    });
  },

  onTextInput(e) {
    const index = e.currentTarget.dataset.index;
    const value = e.detail.value;
    const textBoxes = this.data.textBoxes;
    textBoxes[index] = value;

    this.setData({
      textBoxes: textBoxes
    });
  },

  submitText() {
    let requestData = {};
    let url = '';

    // 根据样式选择设置请求数据和路由
    if (this.data.selectedStyle === 'Style 1') {
      requestData = { text: this.data.textBoxes[0] };
      url = '/aceattorney';
    } else if (this.data.selectedStyle === 'Style 2') {
      requestData = {
        text1: this.data.textBoxes[0],
        text2: this.data.textBoxes[1]
      };
      url = '/colorful';
    } else if (this.data.selectedStyle === 'Style 3') {
      // 处理第三种样式的数据（假设有三个文本框）
      requestData = {
        text1: this.data.textBoxes[0],
        text2: this.data.textBoxes[1],
        text3: this.data.textBoxes[2]
      };
      url = '/your-third-style-route'; // 替换为第三种样式的路由
    }

    wx.request({
      url: `https://your-server-endpoint.com${url}`, // 替换为你的后端接口
      method: 'POST',
      data: requestData,
      success: res => {
        if (res.data && res.data.imageUrl) {
          this.setData({
            imageUrl: res.data.imageUrl
          });
        }
      },
      fail: err => {
        console.error('提交文本失败', err);
      }
    });
  },

  saveImage() {
    wx.downloadFile({
      url: this.data.imageUrl,
      success: res => {
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              wx.showToast({
                title: '保存成功',
                icon: 'success'
              });
            },
            fail: err => {
              wx.showToast({
                title: '保存失败',
                icon: 'none'
              });
            }
          });
        }
      },
      fail: err => {
        console.error('下载图片失败', err);
      }
    });
  }
});
