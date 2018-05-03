// pages/doctor_list/index.js
//引用公共文件
var common = require('../../common.js');
Page({

  /**
   * 页面的初始数据
   */

  data: {

    RemindShow: 'none',  //是否出现提示
    RemindText: '',
    RemindTime: '1000',
    limit_start:0,
    limit_num: 10,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var pages_object = getCurrentPages();//获取当前页面栈
    var data = this.data;
    
    //获取常见科室页面数据
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface.php',
      data: {
        action: 'TjDoctor',
        classid: options.common_departments_id,
        common_diseases_name: options.common_diseases_name,
        limit_start: data.limit_start,
        limit_num: data.limit_num,

      },
      method: 'GET',
      // header: {}, // 设置请求的 header
      success: function (res) {
        //console.log(res);
        that.setData({
          pages: pages_object.length,//页面栈数
          DoctorList: res.data.our_expert,
          common_departments_id: options.common_departments_id,
        });

      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    });
    
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  //自定义提示栏
  ShowRemind: function (text) {
    var RemindTime = this.data.RemindTime;
    var that = this;
    this.setData({
      RemindShow: '',
      RemindText: text,
    });
    setTimeout(function () {
      that.setData({
        RemindShow: 'none',
        RemindText: '',
      });
    }, RemindTime)
  },
  SkipPage: function (e) {
    var pages = this.data.pages;
    common.ToPages(pages,
e.target.dataset.url);
  },
})