Page({
  data: {
    imageSrc: '',
    originSrc: '',
    inputText: '',
    styles: ['Original', 'Grayscale', '生命历程', '黑白', '人物抠图', '漫画'],
    selectedStyle: 'Original',
    canvasWidth: 0,
    canvasHeight: 0,
    baseImg: '',
    test1: '1',
    display_scroll: false,
    isHidden: true,
    count: '0'
  },
  onShow(){
    if (typeof this.getTabBar === 'function' && this.getTabBar()){
      this.getTabBar().setData({
        currIndex: 1
      });
    }
  },
  chooseImage() {
    const that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths;
        wx.getImageInfo({
          src: tempFilePaths[0],
          success(imageInfo) {
            that.setData({
              imageSrc: tempFilePaths[0],
              originSrc: tempFilePaths[0],
              canvasWidth: imageInfo.width,
              canvasHeight: imageInfo.height,
              isHidden: false
            });
          }
        });
      }
    });
  },

  conversionAddress() {
    const that = this;
    wx.getFileSystemManager().readFile({
      filePath: that.data.imageSrc,
      encoding: "base64",
      success: function(res) {
        that.upCont(that.data.inputText, that.data.baseImg);
      }
    });
  },

  upCont: function () {
    const that = this;
    const fs = wx.getFileSystemManager();
    let base64 = fs.readFileSync(this.data.originSrc, 'base64');
    
    wx.request({
      url: "https://39.105.8.203/graywordmeme", // 使用 HTTPS
      method: "POST",
      data: {
        img: base64,
        text: this.data.inputText
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: (res) => {
        console.log('Request succeeded:', res);
        let base64Data = res.data.result;

        // 检查 base64Data 是否为有效的 Base64 字符串
        if (!base64Data || !/^[A-Za-z0-9+/=]+$/.test(base64Data)) {
          console.error('Invalid Base64 string:', base64Data);
          wx.showToast({
            title: 'Invalid Base64 data',
            icon: 'error',
            duration: 2000
          });
          return;
        }

        let filePath = `${wx.env.USER_DATA_PATH}/modified_image.png`;

        // 使用 wx.base64ToArrayBuffer 将 base64 编码的数据转换为 ArrayBuffer
        let buffer = wx.base64ToArrayBuffer(base64Data);

        fs.writeFile({
          filePath: filePath,
          data: buffer,
          encoding: 'binary',
          success: () => {
            that.setData({
              imageSrc: filePath,
            });
            wx.showToast({
              title: 'Image modified successfully!',
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
        wx.showToast({
          title: 'Request failed',
          icon: 'error',
          duration: 2000
        });
      }
    });
  },

  always_test: function () {
    const that = this;
    const fs = wx.getFileSystemManager();
    let base64 = fs.readFileSync(this.data.originSrc, 'base64');
    const type = this.data.selectedStyle;
    let requestPayload = {};
    let requestType = type;
    switch (type) {
        case 'graywordmeme':
            requestPayload = {
                img: base64,
                text: this.data.inputText
            };
            break;
        case 'always':
            requestPayload = {
                img: base64
            };
            break;
        case 'fightsunuo':
            requestPayload = {
                img: base64
            };
            break;
        case 'animegen_gqj':
            requestPayload = {
                img: base64,
                type: "宫崎骏"
            };
            requestType = "animegen";
            break;
        case 'animegen_xhc':
            requestPayload = {
                img: base64,
                type: "新海诚"
            };
            requestType = "animegen";
            break;
        case 'animegen_rbf':
            requestPayload = {
                img: base64,
                type: "日本风肖像"
              };
              requestType = "animegen";
              break;
        case 'animegen_smf':
            requestPayload = {
                img: base64,
                type: "素描风肖像"
            };
            requestType = "animegen";
            break;
        case 'bodysegment':
            requestPayload = {
                img: base64
            };
            break;
        default:
            requestPayload = { img: base64 }; // 默认情况下只发送图片
            break;
    }
    
    wx.request({
      url: "http://39.105.8.203/" + requestType,
      // url: "http://127.0.0.1:5000/" + requestType,
      method: "POST",
      data: requestPayload,
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
              imageSrc: filePath, // 更新 imageSrc 为本地文件路径
            });
            wx.showToast({
              title: 'Image modified successfully!',
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

  style_select(e) {
    const type = e.currentTarget.dataset.type; 
    this.setData({
      selectedStyle: type
    });
    console.log(this.data.selectedStyle);
  },

  inputTextChange(e) {
    this.setData({
      inputText: e.detail.value
    });
  },

  applyText() {
    wx.showToast({
      title: `Text "${this.data.inputText}" added!`,
      icon: 'success',
      duration: 2000
    });
  },

  selectStyleChange(e) {
    this.setData({
      selectedStyle: this.data.styles[e.detail.value]
    });
  },

  saveImage() {
    const { imageSrc } = this.data;

    if (!imageSrc) {
      wx.showToast({
        title: 'No image to save',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    wx.saveImageToPhotosAlbum({
      filePath: imageSrc,
      success() {
        wx.showToast({
          title: 'Image saved!',
          icon: 'success',
          duration: 2000
        });
      },
      fail(err) {
        console.log(err);
        wx.showToast({
          title: 'Save failed',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  hide_scroll(e) {
    setTimeout(function () {
      this.setData({
        display_scroll: false
      });
    }.bind(this), 0);
  },

  show_scroll(e) {
    setTimeout(function () {
      this.setData({
        display_scroll: true
      });
    }.bind(this), 0);
  }
});
