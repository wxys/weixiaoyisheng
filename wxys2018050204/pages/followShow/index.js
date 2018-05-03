// pages/followShow/index.js
// pages/personal/index.js  
//引用公共文件 

//引入co函数支持
const Promise = global.Promise = require('../../libs/es6-promise')
const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
//获取全局的应用实例
var app = getApp();
//引用公共文件
var common = require('../../common.js');
var publicFun = require('../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab:0
  },
  /** 
* 点击tab切换 
*/
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  //followId
  console.log(options);

  var _this=this;
    wx.request({
      url: publicFun.fowxll(),
      data: {
        action: "getfollow",
        followId: options.id,
      },
      method: "POST",
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
       
        _this.setData({
          loading: false,
          project: res.data.symptom,
          yizhu:res.data.yizhu,
          followI:res.data.follow
         
        })
    
      }
    })
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
  
  }
})