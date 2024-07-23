const app = getApp();

Page({
  data: {
    imageSrc: '',
    originSrc: '',
    inputText: '',
    page:'mainPage',
    styles: ['Original', 'Grayscale', '生命历程', '黑白', '人物抠图', '漫画'],
    selectedStyle: 'Original',
    textorigin:'请输入文字',
    selectedStyleCN: '原图',
    selectedStyleIndex: -1,
    secondimageEnable: 'false',
    fixEnable:'false',
    textEnable:'false',
    canvasWidth: 0,
    canvasHeight: 0,
    baseImg: '',
    test1: '1',
    isHidden: true,
    count: '0',
    imgWidth:0,
    imgHeight:0,
    imgTop:0,
    imgLeft:0,
    isCroper:true,
    // 裁剪框 宽高
    cutW: 50,
    cutH: 50,
    cutL: 50,
    cutT: 0,
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
        currIndex: 1
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
              selectedStyleCN: '无'
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
  getImagePosition() {
    return new Promise((resolve, reject) => {
      wx.createSelectorQuery()
        .select('#myImage')
        .boundingClientRect()
        .exec((res) => {
          const rect = res[0];
          if (rect) {
            // const height = (rect.width * this.data.canvasHeight)/this.data.canvasWidth
            // height = Math.min(500, height)
            this.setData({
              imgWidth: rect.width,
              imgHeight: Math.min(500, (rect.width * this.data.canvasHeight)/this.data.canvasWidth),
              imgTop: rect.top,
              imgLeft: rect.left
            });
            resolve(rect); // 操作成功，调用 resolve
            //debugger
            console.log(this.data.imgHeight)
          } else {
            reject(new Error('Failed to get image position')); // 失败，调用 reject
          }
        });
    });
  },

  croperStart(e){
    this.croperX = e.touches[0].clientX
    this.croperY = e.touches[0].clientY
  },
  croperMove(e){
    var self = this
    var dragLengthX = (e.touches[0].clientX-self.croperX)
    var dragLengthY = (e.touches[0].clientY-self.croperY)
    var minCutL = Math.max(0, self.data.imgLeft)
    // var minCutT = Math.max(0, self.data.imgTop)
    var minCutT = 0
    // var maxCutL = Math.min(750 * self.deviceRatio - self.data.cutW, self.data.imgLeft + self.data.imgWidth - self.data.cutW)
    var maxCutL =  self.data.imgLeft + self.data.imgWidth - self.data.cutW
    // var maxCutT = Math.min(self.imgViewHeight - self.data.cutH, self.data.imgTop + self.data.imgHeight - self.data.cutH)
    // var maxCutT = self.data.imgTop + self.data.imgHeight - self.data.cutH
    var maxCutT = self.data.imgHeight - self.data.cutH
    var newCutL = self.data.cutL + dragLengthX
    var newCutT = self.data.cutT + dragLengthY
    // debugger
    if (newCutL < minCutL) newCutL = minCutL
    if (newCutL > maxCutL) newCutL = maxCutL
    if (newCutT < minCutT) newCutT = minCutT
    if (newCutT > maxCutT) newCutT = maxCutT
    this.setData({
      cutL: newCutL,
      cutT: newCutT,
    })
    // console.log(newCutL)
    // console.log(newCutT)
    // console.log(maxCutT)

    self.croperX = e.touches[0].clientX
    self.croperY = e.touches[0].clientY
  },
  dragPointStart(e) {
    this.dragStartX = e.touches[0].clientX;
    this.dragStartY = e.touches[0].clientY;
    this.initDragCutW = this.data.cutW;
    this.initDragCutH = this.data.cutH;
  },
  dragPointMove(e) {
    const imgLeft = this.data.imgLeft;
    const imgTop = this.data.imgTop;
    const imgWidth = this.data.imgWidth;
    const imgHeight = this.data.imgHeight;
    // console.log(this.data.imgLeft)
    // console.log(this.data.imgTop)
    // console.log(this.data.imgWidth)
    // console.log(this.data.imgHeight)
    if (isNaN(imgLeft) || isNaN(imgTop) || isNaN(imgWidth) || isNaN(imgHeight)) {
      console.error('Image properties are not valid:', {
        imgLeft, imgTop, imgWidth, imgHeight
      });
      return;
    }

    const maxDragX = imgLeft + imgWidth;
    const maxDragY = imgTop + imgHeight;
    // const maxDragX = 10000000;
    // const maxDragY = 10000000;
    const dragMoveX = Math.min(e.touches[0].clientX, maxDragX);
    const dragMoveY = Math.min(e.touches[0].clientY, maxDragY);
    const dragLengthX = dragMoveX - this.dragStartX;
    const dragLengthY = dragMoveY - this.dragStartY;
    // console.log(dragMoveX)
    // console.log(dragMoveY)
    // console.log(maxDragX)
    // console.log(maxDragY)
    // debugger
    if (dragLengthX + this.initDragCutW >= 0 && dragLengthY + this.initDragCutH >= 0) {
      this.setData({
        cutW: this.initDragCutW + dragLengthX,
        cutH: this.initDragCutH + dragLengthY
      });
    }
  },

  competeCrop(){
    var self=this
    // wx.showLoading({
    //   title: '截取中',
    //   mask: true,
    // })
    // var initRatio =(this.data.canvasHeight * this.data.canvasWidth)/( this.data.imgHeight * this.data.imgWidth)
    //图片截取大小
    var sX = (self.data.cutL - self.data.imgLeft) * this.data.canvasWidth / this.data.imgWidth
    var sY = (self.data.cutT - self.data.imgTop + 104 ) * this.data.canvasHeight / this.data.imgHeight
    var sW = self.data.cutW * this.data.canvasWidth / this.data.imgWidth
    var sH = self.data.cutH *  this.data.canvasHeight / this.data.imgHeight
    console.log(this.data.imgTop)
    console.log(this.data.cutH)
    console.log(this.data.cutL)
    console.log(this.data.cutT)
    console.log(this.data.cutW)
    console.log(this.data.canvasWidth)
    console.log(this.data.canvasHeight)
    console.log(this.data.imgWidth)
    console.log(this.data.imgHeight)
    self.setData({
      // isCroper: false,
      canvasWidth: sW,
      canvasHeight: sH
    })
    console.log(sW)
    console.log(sH)
    var ctx = wx.createCanvasContext('tempCanvas')
    ctx.drawImage(self.data.imageSrc, sX, sY, sW, sH, 0, 0, sW, sH)
    ctx.draw()
    //保存图片到临时路径
    self.saveImgUseTempCanvas()
    
  },
  saveImgUseTempCanvas: function() {
    var that = this;
    
    // 获取 canvas 上下文
    var ctx = wx.createCanvasContext('tempCanvas');
    
    // 假设你已经在 canvas 上绘制了需要的内容
    // 这里不重复绘制过程，仅展示如何保存和更新 imageSrc
    
    // 调用 canvasToTempFilePath 将 canvas 内容保存为临时文件
    wx.canvasToTempFilePath({
      canvasId: 'tempCanvas',
      x: 0,
      y: 0,
      width: this.data.canvasWidth,
      height: this.data.canvasHeight,
      destWidth: this.data.canvasWidth,
      destHeight: this.data.canvasHeight,
      success: function(res) {
        // res.tempFilePath 为保存后的图片的本地临时路径
        that.setData({
          imageSrc: res.tempFilePath,
          originSrc: res.tempFilePath,
          page: "mainPage"
        });
        
        // 如果有需要，可以在这里做进一步处理，例如上传图片等
      },
      fail: function(err) {
        console.log('canvasToTempFilePath error: ', err);
      }
    });
  },

  cancelCrop(){
    const that = this
    that.setData({
      page: "mainPage"
    })
  },
  startCrop(){
    const that = this
    that.setData({
      page: "cropPage"
    });
    that.getImagePosition()
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
        case 'cannot':
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
        case 'trance':
            requestPayload = {
                img: base64
            };
            break;
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
