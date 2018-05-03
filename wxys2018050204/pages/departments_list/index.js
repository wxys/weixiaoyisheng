// pages/departments_list/index.js
Page({
  data: {
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface.php',
      data: {
        action: 'departments_list'
      },
      method: 'GET', 
      // header: {}, // 设置请求的 header
      success: function(res){
        //console.log(res)
        that.setData({
          Departments: res.data.Departments
        });

      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
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
  }
})