const app = getApp()

Page({
  data: {
    styleOptions: ['Style 1', 'Style 2', 'Style 3'],
    selectedStyle: 'Style 1',
    selectedStyleCN: '无',
    selectedStyleIndex: -1,
    textBoxes: [''],
    imageUrl: '',
    currIndex: app.globalData.currIndex
  },
  onLoad(options) {
    // wx.$event.on("currIndexUpdate", this, (index) => {
    //   console.info(`接收到的内容${text}`)
    //   //修改标题
    //   this.setData({currIndex: index});
    // });
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
      // app.globalData.currIndex = 2;
      this.getTabBar().setData({
        currIndex: 2
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
      // case 'igiari':
      //   textBoxes = [{value: "", placeholder: "输入不超过6个字"}];
      //   break;
      // case 'ba':
      //   textBoxes = [{value: "", placeholder: '蓝色文字'},{value: "", placeholder: '黑色文字'}];
      //   break;
      // case '5000choyen':
      //   textBoxes = [{value: "", placeholder: '红色文字'},{value: "", placeholder: '银色文字'}];
      //   break;
      // case 'luxun':
      //   textBoxes = [{value: "", placeholder: "请输入文字"}];
      //   break;
      case 'ecnulion':
        textBoxes = [{value: "", placeholder: "输入不超过6个字"}];
        break;
      case 'ecnublackboard':
        textBoxes = [{value: "", placeholder: "输入不超过4个字"}];
        break;
      default:
        break;
    }
    // for (let i = 0; i < this.data.num_textboxes; i++) {
    //   textBoxes.push("");
    // }
    this.setData({
      textBoxes: textBoxes
    });
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
    const textBoxes = this.data.textBoxes;
    textBoxes[index] = value;

    this.setData({
      textBoxes: textBoxes
    });
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
          text: this.data.textBoxes[0]
        };
        break;
      case 'ba':
        requestType = '/bluearchive';
        requestData = {
          text1: this.data.textBoxes[0],
          text2: this.data.textBoxes[1]
        };
        break;
      case '5000choyen':
        url = '/colorful';
        requestData = {
          text1: this.data.textBoxes[0],
          text2: this.data.textBoxes[1]
        };
        break;
      case 'luxun':
        requestType = '/luxun';
        requestData = {
          text: this.data.textBoxes[0]
        };
        break;
      case 'ecnulion':
        requestType = '/ecnulion';
        requestData = {
          text: this.data.textBoxes[0]
        };
        break;
      case 'ecnublackboard':
        requestType = '/ecnublackboard';
        requestData = {
          text: this.data.textBoxes[0]
        };
        break;
      default:
        break;
    }

    wx.request({
      url: `http://39.105.8.203${url}`, // 替换为你的后端接口
      method: 'POST',
      data: requestData,
      success: (res) => {
        let base64Data = res.data.result;
        console.log(res.data.msg);
        let filePath = `${wx.env.USER_DATA_PATH}/text_meme.png`;
        console.log(filePath);

        fs.access({
          path: filePath,
          success(res) {
            console.log(res);
            fs.unlink({
              filePath: filePath,
              success(res) {
                console.log(res);
              },
              fail(res) {
                console.error(res);
              }
            });
          }
        });

        let buffer = wx.base64ToArrayBuffer(base64Data);

        fs.writeFile({
          filePath: filePath,
          data: buffer,
          encoding: 'binary',
          success: () => {
            that.setData({
              imageUrl: filePath, 
            });
            wx.showToast({
              title: 'Meme generated successfully!',
              icon: 'success',
              duration: 2000
            });
          },
          fail: (err) => {
            console.error('Failed to save generate meme:', err);
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
