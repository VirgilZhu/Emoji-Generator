const app = getApp()

Page({
  data: {
    styleOptions: ['Style 1', 'Style 2', 'Style 3'],
    selectedStyle: 'Style 1',
    selectedStyleCN: '无',
    selectedStyleIndex: -1,
    textBoxes: [''],
    imageUrl: '',
    count: '0',
    currIndex: app.globalData.currIndex,
    changeStyle: true
  },
  onLoad(options) {
    const that = this;
    app.onMyEvent = function(data) {
      console.log("接收到的数据：", data);
      that.setData({currIndex: data})
    }
  },
  onShow(){
    this.setData({
      currIndex: app.globalData.currIndex
    });
    if (typeof this.getTabBar === 'function' && this.getTabBar()){
      // app.globalData.currIndex = 0;
      this.getTabBar().setData({
        currIndex: 0
      });
    }
  },
  onLoad() {
    this.updateTextBoxes();
  },
  updateTextBoxes() {
    let textBoxes = [];
    const type = this.data.selectedStyle;
    switch (type) {
      case 'igiari':
        textBoxes = [{value: "" ,placeholder: "输入不超过6个字"}];
        break;
      case 'ba':
        textBoxes = [{value: "", placeholder: '蓝色文字'},{value: "", placeholder: '黑色文字'}];
        break;
      case '5000choyen':
        textBoxes = [{value: "", placeholder: '红色文字'},{value: "", placeholder: '银色文字'}];
        break;
      case 'luxun':
        textBoxes = [{value: "", placeholder: "请输入文字"}];
        break;
      case 'ecnulion':
        textBoxes = [{value: "", placeholder: "输入不超过6个字"}];
        break;
      case 'ecnublackboard':
        textBoxes = [{value: "", placeholder: "输入不超过4个字"}];
        break;
      default:
        break;
    }
    this.setData({
      textBoxes: textBoxes
    });
    console.log(this.data.textBoxes);
  },
  style_select(e) {
    const type = e.currentTarget.dataset.type;
    const typeCN = e.currentTarget.dataset.typecn;
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      selectedStyle: type,
      selectedStyleCN: typeCN,
      selectedStyleIndex: index
    }, () => {
      this.updateTextBoxes();
    });
    console.log(this.data.selectedStyle);
  },
  onTextInput(e) {
    const index = e.currentTarget.dataset.index;
    const value = e.detail.value;
    const textBoxes = this.data.textBoxes.map((item, idx) => {
      if (idx === index) {
        return { ...item, value: value };
      }
      return item;
    });
    // textBoxes[index] = value;
    this.setData({
      textBoxes: textBoxes
    });
  },
  emptyInput(obj) {
    return Object.values(obj).some(value => value === "" || value === null || value === undefined)
  },
  submitText() {
    let requestData = {};
    let requestType = '';
    const type = this.data.selectedStyle;
    const fs = wx.getFileSystemManager();
    const that = this;

    switch (type) {
      case 'igiari':
        requestType = '/aceattorney';
        requestData = {
          text: this.data.textBoxes[0].value
        };
        break;
      case 'ba':
        requestType = '/bluearchive';
        requestData = {
          text1: this.data.textBoxes[0].value,
          text2: this.data.textBoxes[1].value
        };
        break;
      case '5000choyen':
        requestType = '/colorful';
        requestData = {
          text1: this.data.textBoxes[0].value,
          text2: this.data.textBoxes[1].value
        };
        break;
      case 'luxun':
        requestType = '/luxun';
        requestData = {
          text: this.data.textBoxes[0].value
        };
        break;
      case 'ecnulion':
        requestType = '/ecnulion';
        requestData = {
          text: this.data.textBoxes[0].value
        };
        break;
      case 'ecnublackboard':
        requestType = '/ecnublackboard';
        requestData = {
          text: this.data.textBoxes[0].value
        };
        break;
      default:
        break;
    }
    console.log(requestData);
    console.log(this.emptyInput(requestData));
    if (this.emptyInput(requestData)) {
      wx.showToast({
        title: '请输入文字！',
        icon: 'error',
        duration: 2000
      });
      return;
    }

    wx.request({
      url: "http://39.105.8.203/" + requestType,
      // url: "http://127.0.0.1:5000/" + requestType,
      method: "POST",
      data: requestData,
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        let base64Data = res.data.result;
        console.log(res.data.msg)

        // 检查 base64Data 是否为有效的 Base64 字符串
        // if (!base64Data || !/^[A-Za-z0-9+/=]+$/.test(base64Data)) {
        //   console.error('Invalid Base64 string:', base64Data);
        //   wx.showToast({
        //     title: 'Invalid Base64 data',
        //     icon: 'error',
        //     duration: 2000
        //   });
        //   return;
        // }

        let count = this.data.count;
        let filePath = `${wx.env.USER_DATA_PATH}/modified_image${count}.png`; // 保存图像到小程序的用户数据路径
        console.log(filePath);
        this.setData({
          count: parseInt(count) + 1
        });
        console.log(count);
        let oldFilePath = `${wx.env.USER_DATA_PATH}/modified_image${(parseInt(count) - 1)}.png`; // 注意路径 
        console.log(oldFilePath);
        
        // 判断文件/目录是否存在
        fs.access({
          path: oldFilePath,
          success(res) {
            // 文件存在
            console.log(res);
            fs.unlink({
              filePath: oldFilePath,
              success(res) {
                console.log(res);
              },
              fail(res) {
                console.error(res);
              }
            });
          }
        });
        
        // 使用 wx.base64ToArrayBuffer 将 base64 编码的数据转换为 ArrayBuffer
        let buffer = wx.base64ToArrayBuffer(base64Data);

        fs.writeFile({
          filePath: filePath,
          data: buffer,
          encoding: 'binary',
          success: () => {
            that.setData({
              imageUrl: filePath, // 更新 imageSrc 为本地文件路径
            });
            wx.showToast({
              title: '生成成功!',
              icon: 'success',
              duration: 2000
            });
          },
          fail: (err) => {
            console.error('Failed to save modified image:', err);
          }
        });
      },
      fail: (err) => {
        console.error('Request failed:', err);
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
