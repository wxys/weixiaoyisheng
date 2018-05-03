// pages/pay_member/index.js
//获取全局的应用实例
var app = getApp();
//引用公共文件
var common = require('../../common.js');
Page({
  data:{
    UserData:{},
    RemindShow: 'none',  //是否出现提示
    RemindText: '',  //提示文字
    RemindTime: 1000,//提示文字保留时间
  },
  onLoad:function(options){
     // 页面初始化 options为页面跳转所带来的参数
    var that=this;
    var pages_object = getCurrentPages();//获取当前页面栈
    var prefix = app.globalData.setStorage.prefix;
    //获取用户id
    var UserData = wx.getStorageSync(prefix + 'UserData');
    this.setData({
      UserData: UserData,
      pages: pages_object.length,//页面栈数
    })
    
   
    var order;
    //获取本地存储数据
    wx.getStorage({
      key: prefix+'order_list',
      success: function(res) {
       //console.log(res);
        order=res.data;
        that.setData({
          order:order,
        });
      },
      complete:function(){
        if(!order.hasOwnProperty('paySign') ){
          console.log('下单失败');
        }
      }
    });


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
  //支付订单
  PayOrder: function () {
    var prefix = app.globalData.setStorage.prefix;
    var UserData = this.data.UserData;
    var requestPaymentData = this.data.order;  //下单成功返回的微信数据数组
    //console.log(requestPaymentData);
    var pages = this.data.pages;
    //console.log(pages);
    var that = this;
    //发起微信支付请求
    wx.requestPayment(
      {
        'appId': requestPaymentData.appid,
        'timeStamp': requestPaymentData.timeStamp,
        'nonceStr': requestPaymentData.nonceStr,
        'package': requestPaymentData.package,
        'signType': requestPaymentData.signType,
        'paySign': requestPaymentData.paySign,
        'success': function (res) {
          //console.log(res.errMsg);
          //如果支付成功
          if (res.errMsg == "requestPayment:ok") {
            UserData.MemberInformation = "会员订户";
            UserData.memberinformation = "会员订户";
            //console.log(UserData);
            wx.setStorageSync('UserData', UserData);
            wx.setStorageSync(app.globalData.setStorage.prefix + 'UserData',UserData);
            //console.log(wx.getStorageSync('UserData'));
            //console.log(wx.getStorageSync(prefix + "order_list"));
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            })
            setTimeout(function () {
              //返回上一个页面
              wx.navigateBack({
                delta: 2
              })
            }, 2000)
            
          }
        },
        'fail': function (res) {
          //console.log(res)
          if (res.errMsg == "requestPayment:fail" || res.errMsg == "requestPayment:fail cancel"){
            that.ShowRemind("取消支付");
          }else{
            that.ShowRemind("支付失败");
          }
         
        }
      })


  },
  //取消订单
  CancelOrder: function () {
    //返回我的会员页面（不刷新）
    wx.navigateBack({
      delta: 1,
    });
    //移除订单存储数据
    wx.removeStorage({
      key: 'order_list',
      success: function(res) {
      } 
    })
   
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
})