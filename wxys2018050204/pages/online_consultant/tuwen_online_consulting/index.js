// pages/online_consultant/tuwen_online_consultant/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ViewPBRQ:"none",
    ViewPBHX:"none",
    Viewcover:"none",
    yishengpaiban:"",
    yishengpaibanhaoxu: "",
    PBMXXH: "",
    PBRQ: "",
    PBRQ_y: "",
    WEEKDAY:"",
    PBKSSJ:"",
    PBJSSJ:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //显示排班日期
  ShowViewPBRQ: function () {
    this.setData({
      ViewPBRQ:"",
      Viewcover:""
    })
    var that = this;
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface_htc.php', //仅为示例，并非真实的接口地址
      data: {
        action: 'getyishengpaiban',
        LX: '1'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //console.log(res.data);
        that.setData({
          yishengpaiban:res.data,
        });
      }
    })
  },
  //隐藏排班日期
  HideViewPBRQ:function(){
    this.setData({
      ViewPBRQ: "none",
      Viewcover: "none"
    })
  },
  //显示排班号序
  ShowViewPBHX:function(e){
    //console.log(e);
    this.setData({
      ViewPBRQ: "none",
      ViewPBHX: "",
      PBMXXH: e.currentTarget.dataset.pbmxxh,
      PBRQ: e.currentTarget.dataset.pbrq,
      PBRQ_y: e.currentTarget.dataset.pbrq_y,
      WEEKDAY:e.currentTarget.dataset.weekday,
      PBKSSJ:e.currentTarget.dataset.pbkssj,
      PBJSSJ:e.currentTarget.dataset.pbjssj,
    })
    var that = this;
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface_htc.php', //仅为示例，并非真实的接口地址
      data: {
        action: 'getpaibanhaoxu',
        PBMXXH: e.currentTarget.dataset.PBMXXH
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //console.log(res.data)
        that.setData({
          yishengpaibanhaoxu: res.data,
        });
      }
    })
  },
  //隐藏排班号序
  HideViewPBHX: function () {
    this.setData({
      ViewPBHX: "none",
      Viewcover: "none"
    })
  }

})