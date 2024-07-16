Component({
  data: {
    currIndex: 0,
    menu: [{
        name: "home",
        icon: "icon-home",
        pagePath: "/pages/index/index"
      },
      {
        name: "edit",
        icon: "icon-manage",
        pagePath: "/pages/edit_image/edit_image"
      }
    ]
  },
  attached(){
  },
  methods:{
    async tabClick(e) {
      let {
        index
      } = e.currentTarget.dataset;
     
      if(this.data.currIndex !== index){
        this.setData({
          currIndex: index,
        }, () => {
          let pagePath = this.data.menu[index].pagePath;
          wx.switchTab({
            url: pagePath,
          });
        })
      }

    }
    
  }
  
})
