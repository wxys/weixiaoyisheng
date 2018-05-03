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
var publicFun=require('../../config.js');
Page({
  data: {
    UserData: {},
    PageShow: false,
    AcceptLogin: true,
    UserMember:{},
    send_msg: '获取验证码',
    current_time: 60,
    alertnum: 0,
    RemindShow: 'none',  //是否出现提示
    RemindText: '',  //提示文字
    RemindTime: 1000, //提示存在时间(ms)
    phone:'',
    change_tips:'更换手机号'
  },
  onLoad: function (options) {
  
  },
  close_view: function () {
    this.setData({
      show_jihuo: false,
      show_jihuo_fail: false,
      show_jihuo_success: false
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  getUserInfo: function () {
    var that = this;
    wx.getUserInfo({
      success: res => {
        //获取用户基本信息
        app.globalData.userInfo = res.userInfo;
        wx.request({
          url: publicFun.req_link(),
          header: {
            'Content-Type': 'application/json'
          },
          data: {
            'action': 'StoreUserInfo',
            'data': res.userInfo,
            'openid': that.data.UserData.openid
          },
          success: function (res) {
          }
        })
      }, complete: res => {
        that.onShow();
      },
      fail: res => {
        // that.showM();
      }
    })

  },

  onShow: function () {
  console.log(1);
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    var AcceptLogin = this.data.AcceptLogin;
    //获取用户id
    var result='';
 var _this=this;
    co(function* () {
      result = yield common.GetUserId_1();
      var User_openid = wx.getStorageSync(app.globalData.setStorage.prefix + 'user_openid');
      _this.setData({
        session_key: User_openid.session_key,
      })
    })
    var UserData = wx.getStorageSync(app.globalData.setStorage.prefix + 'UserData');
    var identity = wx.getStorageSync('wxysidentity');
    this.setData({
     UserData: UserData,
     identity:identity
   })
  
    

    that.GetUserMember();

  },
  getPhoneNumber: function (e) {
    console.log(1);
    var _this = this;
    console.log(_this.data.session_key);
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      //获取到参数  向服务器请求 获取用户的手机号  
      wx.request({
        url: publicFun.req_link(),
        data: {
          iv: e.detail.iv,
          encryptedData: e.detail.encryptedData,
          session_key: _this.data.session_key,
          openid: _this.data.UserData.openid,
          action: "PhoneVerity"
        },
        header: { 'Content-Type': 'application/json' },
        success: function (res) {
          console.log(res.data);
          var result = JSON.parse(res.data.replace(/(^\s*)|(\s*$)/g, ""));
          //用户手机号码
          var phone = result.phone;
          console.log(result.phone);
          var j = phone.substring(3, 7);
          var s = phone.replace(j, '****');
          if (result.result == '-1') {
            //非用户
            _this.setData({
              show_jihuo_fail: true,
              show_jihuo: false,
              show_phone: s
            })
          } else {
            _this.setData({
              show_jihuo_success: true,
              show_jihuo_fail: false,
              show_jihuo: false,
              show_phone: s
            })
          }

        },
        fail: function (res) { },
        complete: function (res) {
          _this.getUserInfo();
          _this.onShow();



         },
      })

    } else {
      _this.setData({
        show_jihuo: false
      })
    }

  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.onShow();
  },
  
  //获得会员数据
  GetUserMember: function () {
    
    var UserData = this.data.UserData;
    var UserMember = this.data.UserMember;
   // UserData.userInfo.nickName = "aaaa";
    console.log(UserData);
   // console.log("aaaaaaa");
    var informcount = 0;//未读通知数量
    var that = this;
    var prefix = app.globalData.setStorage.prefix;  //缓存存储前缀
    //登录过的用户才判断是否是会员
    co(function* () {
      var result = yield common.CheckVipMemberByUserId2();
      var res = result.data;
   console.log(res);
      UserData.MemberInformation = res.data.member_information;
      if (res.data.member_information == "会员订户"||res.data.member_information=="中国移动健康中心会员"){
        UserMember={
          ExpirationTime:res.data.expiration_time,//到期时间
          DurationDay:res.data.duration_day,//会员持续时间
        }     
        
        if (res.data.member_information != "") {
          UserData.memberinformation = res.data.member_information;
          UserData.memberinformation2 = res.data.member_information2;
          UserData.expiration_time = res.data.expiration_time;
        }
        ///1
      }
   
      if (res.data.member_phone != "") {
        UserData.phone = res.data.member_phone;
      }
      UserData.User_name = res.data.User_name;
      UserData.userInfo = res.data.userinfo;

     
      //将用户数据存储到本地
      wx.setStorageSync(prefix + 'UserData', UserData);
      that.setData({
        UserData: UserData,
        userInfo: res.data.userinfo,
        PageShow: true,
        UserMember: UserMember,
      })
      console.log(that.data.UserData);
    });
  },

  //监听输入手机号输入框变化
  PhoneInputChange: function (e) {
    this.setData({
      phone: e.detail.value
    })
    //  console.log(e);
    //如果输入了11位手机号则自动收起键盘
    if (e.detail.cursor == 11) {
      //收起键盘
      wx.hideKeyboard()

    }
  },
  //监听输入验证码输入框变化
  CodeInputChange: function (e) {
    //console.log(e);
    this.setData({
      _verification_code: e.detail.value,
    })
    //如果输入了6位验证码则自动收起键盘
    if (e.detail.cursor == 6) {
      //收起键盘
      wx.hideKeyboard()
    }
  },
  sendsmscheckcode: function () {
    var that = this;
    var prefix = app.globalData.setStorage.prefix;
    var phone = this.data.phone;
    var CheckPhone = this.CheckPhone(phone);
    var verification_code = common.MathRand(6);//6位随机验证码
    co(function* () {
      var result = yield common.CheckVipMemberByPhone(phone);
      var res = result.data;
      console.log(that.data.UserData);
      if (that.data.change_tips==!'更换手机号'){
        if (res.data.member_information == "中国移动健康中心会员" || phone == '18046050357') {
        } else {
          that.setData({
            changephone: phone,
            alertnum: 3
          })
          return false;
        }
      }
      if (1 == 2) {
      } else {
        //收起键盘
        wx.hideKeyboard();
        //自动聚焦输入验证码
        that.setData({
          password_focus: true,
        })
        var data = {
          phone: phone,
          verification_code: verification_code,
        };
        //发送验证码
        co(function* () {
          if (1 == 2) {
          } else {
            //收起键盘
            wx.hideKeyboard();
            //自动聚焦输入验证码
            that.setData({
              password_focus: true,
            })
            var data = {
              phone: phone,
              verification_code: verification_code,
              kjtt: '2'
            };

            console.log(data);
            //发送验证码
            co(function* () {
              var result = yield common.SendMessage(data);
              var res = result.data;
              console.log(res);
              if (res.data.error_msg == "success") {
                that.ShowRemind("短信已发送");
                var d = new Date();
                var valid_time = d.getTime() + (5 * 60 * 1000);

                //console.log(verification_code);
                var code_arr = {
                  verification_code: verification_code,
                  valid_time: valid_time,
                };
                wx.setStorage({
                  key: prefix + "PatientLogin_code_arr",
                  data: code_arr,
                });
                //短信发送倒计时
                var Countdown = setInterval(function () {
                  var current_time = that.data.current_time;
                  current_time = current_time - 1;
                  if (current_time > 0) {
                    //  console.log(current_time);
                    that.setData({
                      isSending: true,
                      current_time: current_time,
                      send_msg: "重新发送 " + current_time + "s"

                    });
                  } else {
                    clearInterval(Countdown);

                    that.setData({
                      SendCodeDisabled: false,
                      current_time: 60,
                      send_msg: "重新发送",
                      isSending: false,
                    });

                  }
                }, 1000);
              } else {
                that.ShowRemind("本业务仅限中国移动用户使用");
                that.setData({
                  SendCodeDisabled: false,
                });
              }
            });

          }
        });




       

      }
    });

  },
  //验证手机
  CheckPhone: function (phone) {
    //console.log(phone.length)
    //判断系是否已经输入11位手机号
    if (phone) {
      //如果输入了11位手机号
      if (phone.length == 11) {
        //判断输入的手机号是否正确
        var isMobile = common.isMobile(phone);
        if (isMobile) {
          return true;
        }
        else {
          this.ShowRemind("请输入正确的手机号");
        }
      }
      //如果没有输入11位手机号
      else {
        this.ShowRemind("请输入11位手机号");
      }
    } else {
      this.ShowRemind("请输入手机号");
    }
  },
  ChangePhone:function(e){
    console.log(e.currentTarget.dataset.index);
    var that=this;
    that.setData({
      alertnum:1,
      change_tips:e.currentTarget.dataset.index
    })
  },
  hideAlert: function () {
    var that = this;
    that.setData({
      alertnum: 0
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
  changePhoneSbumit: function () {
    var that = this;
    //检查输入的手机号是否正确
    var UserData = this.data.UserData;
    var userInfo = this.data.userInfo;
    var phone = this.data.phone;
    var prefix = app.globalData.setStorage.prefix;
    var time = (new Date()).valueOf();
    var CheckPhone = that.CheckPhone(phone);
    var verification_code = this.data.verification_code;//本地缓存的验证码
    var valid_time = this.data.valid_time;
    var _verification_code = that.data._verification_code;  //用户输入的验证码
    //console.log(this);
    //获取本地缓存的验证码
    var code_arr = wx.getStorageSync(prefix + "PatientLogin_code_arr");

    var ShowSendCode = this.data.ShowSendCode;
    //如果有缓存患者登录的验证码
    if (code_arr) {
      verification_code = code_arr.verification_code;  //本地缓存的验证码
      valid_time = code_arr.valid_time//本地缓存验证码的过期时间
    }
    if (CheckPhone) {
      if (_verification_code == verification_code && time < valid_time) {
        co(function* () {
          wx.request({
            url: 'https://h5.12590.com/SlowDiseaseTreasure/interface_htc.php', //仅为示例，并非真实的接口地址
            data: {
              action: 'updateUserPhone',
              phone: phone,
              openid: that.data.UserData.openid,
              change_tips:that.data.change_tips
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              console.log(res);
              UserData.phone = phone;
              userInfo.User_Phone = phone;
              if (res.data.issuccess == '1') {
                if (that.data.change_tips=='激活会员'){
                  that.ShowRemind("激活成功");
                  that.setData({
                    UserData: UserData,
                    userInfo: userInfo,
                    changephone: phone,
                    changephone: phone,
                    alertnum: 0
                  })
                  
                that.onshow();
                  
                } else {
                  that.setData({
                    UserData: UserData,
                    changephone: phone,
                    alertnum: 2
                  })
                }
              }
            },
            complete: function () {
              that.onShow();
            },
          });
        });


      } else if (_verification_code == verification_code && time > valid_time) {
        that.ShowRemind("验证码已失效");
      } else {
        that.ShowRemind("请输入正确的验证码");
      }
    }

  }
})
