Page({
  data: {
    imageSrc: '',
    inputText: '',
    styles: ['Original', 'Grayscale', 'Sepia', '黑白'],
    selectedStyle: 'Original',
    canvasWidth: 0,
    canvasHeight: 0,
    baseImg: '',
    test1: '1'
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
        filePath: that.imageSrc,
        encodeing: "base64",
        success: function(res) {
          // that.data.baseImg.push('data:image/png;base64,' + res.data);
          that.upCont(that.data.inputText, that.data.baseImg);
        }

      }
    )

  },

  upCont: function (){
    const that = this;
    let base64 = wx.getFileSystemManager().readFileSync(this.data.imageSrc, 'base64')
    // console.log(base64);
    // console.log(this.data.inputText);
    wx.request({
      url: "http://127.0.0.1:5000/graywordmeme",
      method: "POST",
      data: {
        img: base64,
        text: this.data.inputText
      },
      header:{
        'Content-Type':'application/json'
      },
      // responseType: "arraybuffer",
      success:(res) =>{
              let base64 ="data:image/png;base64," + res.data.result;
              var imgPath = wx.env.USER_DATA_PATH + 'temp' + '.png';
              var imageData = base64.replace(/^data:image\/\w+;base64,/, "");
              var fs = wx.getFileSystemManager();
              fs.writeFileSync(imgPath, imageData, "base64");
              // console.log(url);
              that.setData({
                imageSrc : imgPath, 
              })  
              console.log(this.data.imageSrc);  
      }
    });
    console.log(this.data.imageSrc);

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
  // test() {
  //   const that = this;
  //   const result =  wx.cloud.callContainer({
  //     "config": {
  //       "env": "prod-4g06jpu1405b6a90"
  //     },
  //     "path": "/add",
  //     "header": {
  //       "X-WX-SERVICE": "emoji-generator",
  //       "content-type": "application/json"
  //     },
  //     "method": "POST",
  //     "data": {
  //       "num1": 1,
  //       "num2": 3
  //     },
  //     "responseType": "arraybuffer",
  //     success: (res) => {
  //       console.log(res.data.result);
  //       that.setData({
  //         test1 : res.data.result
  //       });
  //       console.log(this.data.test1);
  //     }
  
  //   });
  //   console.log(this.data.test1);
  //   // debugger;
  //   // console.log(result);
  //   // debugger;
  //   // let test1 = ret;

  //   // wx.showToast({
  //   //           title: `"${test1}"`,
  //   //           icon: 'success',
  //   //           duration: 2000
  //   //         });
  // },


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
    wx.downloadFile({    //  下载图片到本地
      url: this.data.imageSrc,    //  下载的图片地址
        success(res) {
          if (res.statusCode === 200) {
            wx.saveImageToPhotosAlbum({      //  保存到系统相册
              filePath: res.tempFilePath,       //   图片图片地址
              success(res) {
                wx.showToast({
                  title: 'Image saved!',
                  icon: 'success',
                  duration: 2000
                })
              }
            })
          }
        }
      })
  },
});
