// pages/subscribe_success/index.js
//获取全局的应用实例
var app = getApp();
//引用公共文件
var common = require('../../common.js');
Page({
  data: {},
  onLoad: function (options) {
    //console.log(options)
    // 页面初始化 options为页面跳转所带来的参数
    var prefix = app.globalData.setStorage.prefix;
    this.setData({
      pay_type: options.pay_type
    })
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          ScrollHeight: res.windowHeight - 40, //设置
        });
      }
    })
    //获取预约数据
    wx.getStorage({
      key: prefix+'subscribe_list',
      success: function (res) {
        //console.log(res);
        that.setData({
          subscribe_list: res.data,
        })
      },
      complete: function () {

      }
    });
    //获取预约人数据
    wx.getStorage({
      key: prefix+'SeekingPerson',
      success: function (res) {
        //console.log(res);
        that.setData({
          SeekingPerson: res.data,
        })
      },
      complete: function () {

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
  GoMySubscribe: function () {
    wx.reLaunch({
      url: '../my_subscribe/index',
    })
  },
})