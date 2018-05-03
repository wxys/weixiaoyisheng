// pages/common_disease/index.js
Page({
  data: {
    UserData: {
    },
    
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        //console.log(res.windowHeight)
        that.setData({
          ScrollHeight: res.windowHeight,
        });
      }
    })
    //获取常见疾病数据

    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface.php',
      data: {
        action: 'moreDisease',
      },
      method: 'GET',
      success: function (res) {
        //console.log(res);
        if(res.data.length>0){
          that.setData({
            common_disease: res.data,
            first_hierarchy_id: res.data[0].dempart_id,
            disease: res.data[0].Disease
          })
        }
      },
      fail: function (res) {
        // fail
        console.log(res);
      },
      complete: function (res) {
        // complete

      }
    });

  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭

  },
  //展开第二层级
  ShowSecondHierarchy: function (e) {
    var page_data=this.data;
    this.setData({
      first_hierarchy_id: e.currentTarget.dataset.dempart_id,
      disease: page_data.common_disease[e.currentTarget.dataset.id].Disease
    });
    //console.log(e);
    

  },

})