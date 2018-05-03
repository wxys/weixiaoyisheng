// pages/inform/index.js
//引用公共文件
var common = require('../../common.js');
//引入co函数支持
const Promise = global.Promise = require('../../libs/es6-promise')
const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
//获取全局的应用实例
var app = getApp();
Page({
  data:{
    PageShow:'none',
    UserData:{},
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that=this;

    //获取用户id
    var UserData = wx.getStorageSync(app.globalData.setStorage.prefix + 'UserData');
    if (UserData) {
      that.setData({
        UserData: UserData,
      })
      
      that.LoadData();
      
    } else {
      co(function* () {
       var result = yield common.GetUserData();
        UserData = result.data;
        that.setData({
          UserData: UserData,
        })
        
        that.LoadData();
        
      });

    }

  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  LoadData:function(){
    var that = this;
    var UserData = this.data.UserData;
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface.php', //仅为示例，并非真实的接口地址
      data: {
        action: 'Inform',
        openid: UserData.openid,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //console.log(res);
        that.setData({
          inform: res.data.inform,
          PageShow:'',
        });
      },
      complete: function () {
        //加载完数据停止下拉刷新
        wx.stopPullDownRefresh();
      },
    });
  }
})