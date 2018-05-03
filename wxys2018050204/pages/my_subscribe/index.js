// pages/my_subscribe/index.js
//引用公共文件
var common = require('../../common.js');
//引入co函数支持
const Promise = global.Promise = require('../../libs/es6-promise')
const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
//获取全局的应用实例
var app = getApp();
Page({
  data: {
    RemindShow: 'none',  //是否出现提示
    RemindText: '',
    RemindTime: '1000',
    CancelBtnDisabled:false,
    PageShow: false,
    AcceptLogin:true,

    StyleTopOne:"background:#169bd5;color:white",
    StyleTopTwo:"",
    currentTab: 0,
    StyleTopThree:"",
    viewyuyin: "none",
    viewshipin: "none",
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
   
  },
  onReady: function () {
    // 页面渲染完成
  },
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
    console.log(that.data);
  },
  onShow: function () {
    // 页面显示
    var that = this;
    //获取用户id
      co(function* () {
       var  result = yield common.GetUserId();
        var UserData = result.data;
        that.setData({
          UserData: UserData,
        })
       
      //  that.CheckIdentity();  //检查用户身份
        that.LoadData();
      });
    

  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.LoadData();
  },
  CheckIdentity: function () {
    var UserData = this.data.UserData;
    var that = this;
    var prefix = app.globalData.setStorage.prefix;
    co(function* () {
     var  result = yield common.CheckVipMemberByUserId();
      var res = result.data;
      that.setData({
        UserData: res.data
      })
      UserData.MemberInformation = res.data.member_information;
      if (res.data.member_information == "会员订户" || res.data.member_information == "中国移动健康中心会员") {
        UserData.phone = res.data.member_phone;
        //将用户数据存储到本地
        wx.setStorageSync(prefix + 'UserData', UserData);
     //   that.LoadData();
      }
      //如果是副卡，提示要登录
      else if (res.data.member_information == "中国移动健康中心会员副卡") {
        that.setData({
          PageShow: true,
        })
      }
      //如果不是会员，跳转到登录页面
      else {
        UserData.phone = res.data.member_phone;
        //将用户数据存储到本地
        wx.setStorageSync(prefix + 'UserData', UserData);
      //  that.LoadData();
      }

    });
   
  },

  //载入页面数据
  LoadData:function(){
    var that = this;
    var UserData = this.data.UserData;
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface.php',
      data: {
        action: 'MyAppointment',
        user_id: UserData.openid,
      },
      method: 'GET',
      success: function (res) { 
        that.setData({
          user_subsvribe:res.data,
          PageShow:true,
        })
        //加载完数据停止下拉刷新
        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        // fail
        console.log(res);
      },
      complete: function (res) {
        // complete
        
      }
    });
 
    console.log(that.data);
  },
  //取消停诊
  CancelSubscribe:function(e){
    //console.log(e);
    var UserData = this.data.UserData;
    var that = this;
    this.setData({
      CancelBtnDisabled: true,
    });
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface.php',
      data: {
        action: 'cancel',
        user_id: UserData.openid,
        YYXH: e.currentTarget.dataset.yyxh,
      },
      method: 'GET',
      success: function (res) {
        //console.log(res);
        if(res.data="success"){
          that.ShowRemind("成功取消预约")
          that.LoadData();
          
        }else{
          that.ShowRemind("取消失败")
          
        }
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
        that.setData({
          CancelBtnDisabled: false,
        });
      }
    });
  },
  //查看停诊通知
  ViewNotice:function(e){
    //console.log(e);
    wx.showModal({
      title: '停诊通知',
      content: e.target.dataset.notice_text,
      showCancel:false,
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
  showguahaoyuyue: function () {
    var that = this;
    that.setData({
      viewyuyin: "none",
      viewshipin: "none",
      PageShow: true,
      StyleTopOne: "background:#169bd5;color:white",
      StyleTopTwo: "",
      StyleTopThree: "",
    })
  },
  showyuyinyuyue: function () {
    var that = this;
    that.setData({
      viewyuyin: "",
      viewshipin: "none",
      PageShow: false,
      StyleTopOne: "",
      StyleTopThree: "",
      StyleTopTwo: "background:#169bd5;color:white"
    })
  },
  showshipinyuyue: function () {

    var that = this;
    that.setData({
      viewyuyin: "none",
      viewshipin: "",
      PageShow: false,
      StyleTopOne: "",
      StyleTopTwo: "",
      StyleTopThree: "background:#169bd5;color:white"
    })
  },

})