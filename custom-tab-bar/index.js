const app = getApp()

Component({
  data: {
    currIndex: app.globalData.currIndex,
    menu: [{
        name: "文字meme",
        icon: "icon-yishuzi",
        pagePath: "/pages/edit_text/edit_text"
      },
      {
        name: "表情包",
        icon: "icon-emoji",
        pagePath: "/pages/edit_image/edit_image"
      },
      // {
      //   name: "ECNU",
      //   icon: "icon-manage",
      //   pagePath: "/pages/ecnulion/ecnu"
      // },
      // {
      //   name: "动图",
      //   icon: "icon-manage", // todo
      //   pagePath: "/pages/gifs/gifs"
      // }
    ]
  },
  attached(){
  },
  methods:{
    tabClick(e) {
      // let {
      //   index
      // } = e.currentTarget.dataset;
      const index = e.currentTarget.dataset.index;

     
      if(this.data.currIndex !== index){
        app.globalData.currIndex = index;
        // app.globalData.eventBus.emit('currIndexChange', index);
        app.onMyEvent(index);
        this.setData({
          currIndex: index,
        }, () => {
          const pagePath = this.data.menu[index].pagePath;
          wx.switchTab({
            url: pagePath,
          });
        });
      }
    }
  }
})
