Page({
  data: {
    imageSrc: '',
    inputText: '',
    styles: ['Original', 'Grayscale', 'Sepia', '黑白', '人物抠图', '漫画'],
    selectedStyle: 'Original',
    canvasWidth: 0,
    canvasHeight: 0,
    baseImg: '',
    test1: '1',
    display_scroll: false
  },
  onShow(){
    if (typeof this.getTabBar === 'function' && this.getTabBar()){
      this.getTabBar().setData({
        selected: 2
      })
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
              canvasWidth: imageInfo.width,
              canvasHeight: imageInfo.height
            });
          }
        });
      }
    });
  },

  conversionAddress() {
    const that = this;
    wx.getFileSystemManager().readFile(
      {
        filePath: that.data.imageSrc,
        encoding: "base64",
        success: function(res) {
          // that.data.baseImg.push('data:image/png;base64,' + res.data);
          that.upCont(that.data.inputText, that.data.baseImg);
        }

      }
    )
  },

  upCont: function () {
    const that = this;
    let base64 = wx.getFileSystemManager().readFileSync(this.data.imageSrc, 'base64');
    
    wx.request({
        url: "http://39.105.8.203/graywordmeme",
        method: "POST",
        data: {
            img: base64,
            text: this.data.inputText
        },
        header: {
            'Content-Type': 'application/json'
        },
        success: (res) => {
            let base64Data = res.data.result;
            let filePath = `${wx.env.USER_DATA_PATH}/modified_image.png`; // 保存图像到小程序的用户数据路径

            // Convert base64 to ArrayBuffer manually
            let binaryString = atob (base64Data); // Decode base64 to binary string
            let len = binaryString.length;
            let buffer = new ArrayBuffer(len);
            let view = new Uint8Array(buffer);
            for (let i = 0; i < len; i++) {
                view[i] = binaryString.charCodeAt(i);
            }

            wx.getFileSystemManager().writeFile({
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


  test: function (baseImg, inputTest){
    const that = this;
    // debugger;
    wx.request({
      url: "https://emoji-generator-114452-5-1327830118.sh.run.tcloudbase.com/add",
      data: {
        num1: 100,
        num2: 200
      },
      header:{
        'Content-Type':'application/json'
      },
      method: "POST",
      "responseType": "arraybuffer",
      success:(res) => {
        // data.test = res;
        let test1 = res;
        debugger;
        wx.showToast({
          title: `"${test1}"`,
          icon: 'success',
          duration: 2000
        });
      },
      fail:function(err) {
        debugger;
        wx.showLoading({
          title: `"${err}"`
        });
      }
    })
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
      fail() {
        console.log(err)
        wx.showToast({
          title: 'Save failed',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },
  hide_scroll(e){
    setTimeout(function (){
      this.setData({
        display_scroll: false
      })
    }.bind(this), )
  },
  show_scroll(e){
    setTimeout(function (){
      this.setData({
        display_scroll: true
      })
    }.bind(this), )
  }
});
