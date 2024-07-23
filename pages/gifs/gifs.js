const app = getApp();

Page({
  data: {
    imageSrc: '',
    originSrc: '',
    secondoriginSrc: '',
    inputText: '',
    page:'mainPage',
    // styles: ['Original', 'Grayscale', '生命历程', '黑白', '人物抠图', '漫画'],
    selectedStyle: 'Original',
    selectedStyleCN: '原图',
    selectedStyleIndex: -1,
    textEnable:'false',
    canvasWidth: 0,
    canvasHeight: 0,
    baseImg: '',
    test1: '1',
    isHidden: true,
    count: '0',
    textorigin:'请输入文字',
    currIndex: app.globalData.currIndex
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
      this.getTabBar().setData({
        currIndex: 3
      });
    }
  },
  loadImgOnImage: function () {
    wx.getImageInfo({
      src: this.data.imageSrc,
      success: function (res) {
        this.oldScale = 1
        this.initRatio = res.height / this.data.imgViewHeight
        if (this.initRatio < res.width / (750 * this.data.deviceRatio)) {
          this.initRatio = res.width / (750 * this.data.deviceRatio)
        }

        // 图片显示大小
        this.scaleWidth = (res.width / this.initRatio)
        this.scaleHeight = (res.height / this.initRatio)

        this.initScaleWidth = this.scaleWidth
        this.initScaleHeight = this.scaleHeight
        this.startX = 750 * this.data.deviceRatio / 2 - this.scaleWidth / 2;
        this.startY = this.data.imgViewHeight / 2 - this.scaleHeight / 2;

        this.setData({
          imgWidth: this.scaleWidth,
          imgHeight: this.scaleHeight,
          imgTop: this.startY,
          imgLeft: this.startX
        })
        wx.hideLoading();
      }.bind(this)
    })
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
              isHidden: false,
              selectedStyle: 'Original',
              selectedStyleCN: '原图'
            });
            console.log(that.data.imageSrc)
            //that.getImagePosition();
          }
        });
      }
    });
  },
  
  choosesecondImage() {
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
              secondoriginSrc: tempFilePaths[0],
            });
            console.log(that.data.imageSrc)
            //that.getImagePosition();
          }
        });
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
    let secondbase64 = fs.readFileSync(this.data.secondoriginSrc, 'base64');
    const type = this.data.selectedStyle;
    let requestPayload = {};
    let requestType = type;
    switch (type) {
        case 'confuse':
            requestPayload = {
                img: base64
            };
            break;
        case 'kiss':
            requestPayload = {
                img1: base64,
                img2: secondbase64
            };
            break;
        case 'rub':
          // secondbase64 = fs.readFileSync(this.data.secondoriginSrc, 'base64');
          requestPayload = {
              img1: base64,
              img2: secondbase64
            };
          break;
        case 'punch':
            requestPayload = {
                img: base64
            };
            break;
        case 'play':
            requestPayload = {
                img: base64,
            };
            break;
        case 'guichu':
            requestPayload = {
                img: base64,
                text: this.data.inputText
            };
            break;
        case 'funnymirror':
            requestPayload = {
                img: base64,
              };
              break;
        case 'chasetrain':
            requestPayload = {
                img: base64,
            };
            break;
        case 'flashblind':
            requestPayload = {
                img: base64,
                text: this.data.inputText
            };
            break;
        default:
            requestPayload = { img: base64 }; // 默认情况下只发送图片
            break;
    }
    
    wx.request({
      // url: "http://39.105.8.203/" + requestType,
      url: "http://127.0.0.1:5000/" + requestType,
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
        let filePath = `${wx.env.USER_DATA_PATH}/modified_image${count}.gif`; // 保存图像到小程序的用户数据路径
        console.log(filePath);
        this.setData({
          count: parseInt(count) + 1
        });
        console.log(count);
        let oldFilePath = `${wx.env.USER_DATA_PATH}/modified_image${(parseInt(count) - 1)}.gif`; // 注意路径 
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
  edit_this() {
    const that = this;
    that.setData({
      originSrc: this.data.imageSrc,
      count: parseInt(this.count) + 1
    })
  },
  style_select(e) {
    const type = e.currentTarget.dataset.type; 
    const typeCN = e.currentTarget.dataset.typecn;
    const index = parseInt(e.currentTarget.dataset.index);
    const text = e.currentTarget.dataset.text;
    this.setData({
      selectedStyle: type,
      selectedStyleCN: typeCN,
      selectedStyleIndex: index,
      textEnable: text
    });
    if(this.data.selectedStyle=="guichu"){
      this.setData({
          textorigin: "请输入上、下、左、右四种方向的一种，如果输入错误或不输入则默认为左"
      })
    }
    else {
      this.setData({
        textorigin: "请输入文字"
      })
    }

    console.log(this.data.selectedStyle);
    console.log(this.data.selectedStyleIndex);
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

});
