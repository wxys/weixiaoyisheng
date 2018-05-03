//doctor_login.js
//获取全局的应用实例
var app = getApp(); 
//引用公共文件
var common = require('../../common.js');
Page({
  data: {
    UserData: {},
    RemindShow: 'none',  //是否出现提示
    RemindText: '',  //提示文字
    RemindTime: 1000, //提示存在时间(ms)
    PageShow:true,
    password_focus: false,
    password:'',
    BtnDisabled:false,
  },
 onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that=this;
    var prefix = app.globalData.setStorage.prefix;
    //获取用户id
    var UserData = wx.getStorageSync(prefix+ 'UserData');
    this.setData({
      UserData: UserData,
      phone: UserData.phone,
    })
  
  },
  onReady: function () {
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
  //监听输入手机号输入框变化
  PhoneInputChacnge: function (e) {
    this.setData({
      phone: e.detail.value
    })
    //  console.log(e);
    //如果输入了11位手机号则自动收起键盘
    if (e.detail.cursor == 11) {
      //输入密码框聚焦
      this.setData({
        password_focus:true,
      })

    }
  },
  //监听密码输入框变化
  PasswordInputChacnge: function (e) {
    this.setData({
      password: e.detail.value
    })
    //  console.log(e);
    
  },
  //用户点击登录
  UserLogin: function (e) {
    var data = this.data;
    console.log(data);
    var that = this;
    var UserData = this.data.UserData;
    var prefix=app.globalData.setStorage.prefix;
    this.setData({
      BtnDisabled:true,
    })
    if(!data.phone){
      this.ShowRemind("手机号为空");
      this.setData({
        BtnDisabled: false,
      })
    }
    else if (!data.password) {
      this.ShowRemind("密码为空");
      this.setData({
        BtnDisabled: false,
      })
    }
    else if (!common.isMobile(data.phone)){
      this.ShowRemind("手机号不正确");
      this.setData({
        BtnDisabled: false,
      })
    }
    //验证账号密码是否正确
    else {
      wx.request({
        url: 'https://f.12590.com/SlowDiseaseTreasure/interface3.php', //仅为示例，并非真实的接口地址
        data: {
          userid: UserData.openid,
          phone: data.phone,
          password: data.password,
          action: "DoctorUserLogin",
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res);
          //登录成功
          if (res.data.errcode == "400003") {
            UserData.doctor_phone = data.phone,
            setTimeout(function () {
              wx.redirectTo({ url: '../doctor_index/index' });
            }, data.RemindTime);
            wx.setStorageSync(prefix +"UserData", UserData);
          }
          else {
            that.setData({
              BtnDisabled: false,
            })
          }
          
          
          that.ShowRemind(res.data.errmsg);
        }
      });
    }
  },
})
