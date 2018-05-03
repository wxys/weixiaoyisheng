//引用公共文件
// pages/login/index.js
var common = require('../../common.js');
//获取全局的应用实例
var app = getApp();
//引入co函数支持
const Promise = global.Promise = require('../../libs/es6-promise')
const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
Page({
  data: {
    PageShow: false,
    UserData: {},
    RemindShow: 'none',  //是否出现提示
    RemindText: '',  //提示文字
    RemindTime: 1000, //提示存在时间(ms)
    send_msg: '发送验证码',
    current_time: 60,
    input_phone: '',
    SendCodeDisabled: false,
    BtnDisabled: false,
    password_focus: false,
    verification_code: '',
    valid_time: '',
    isSending: false,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options);
    var pages_object = getCurrentPages();//获取当前页面栈
    //设置通过二维码扫描进来的参数
    this.setData({
      scene: options.scene,//二维码参数
      pages: pages_object.length,//页面栈数
      type: options.type,
    })
    var that = this;
    //获取用户id
    co(function* () {
     var result = yield common.GetUserId();
      var UserData = result.data;
      that.setData({
        UserData: UserData,
        phone: UserData.phone
      })
      that.CheckIdentity();
     // that.checkUserInfo();  //检查是否获得用户头像等数据
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
  //检查是否得到用户数据授权
  checkUserInfo: function () {
    var UserData = this.data.UserData;
    var that = this;
    if (!UserData.hasOwnProperty('userInfo')) {
      //如果有获取登录
      if (app.globalData.hasLogin === false) {
        wx.login({
          success: function (res) {
            that.getUserInfo();
          }
        })
      } else {
        that.getUserInfo();
      }

    } else {
      //身份判断
      that.CheckIdentity();
    }

  },
  //获取用户资料111
  getUserInfo: function () {
    var that = this;
    var UserData = this.data.UserData;

    var prefix = app.globalData.setStorage.prefix;  //获得本地存储数据前缀
   
      that.CheckIdentity();
   

  },
  /*
      如果是通过扫描进来的，根据不同用户身份跳转不同页面
      * 1、如果是主卡用户（即第一次通过带参链接、二维码访问小程序的）
        进到登录页面，则自动登录，跳转到收藏夹首页。（可以使用全部功能）
      * 3、如果是通过其他路径的用户
      * 1、如果是会员身份，则自动跳过登录，跳转到收藏夹首页
      * 2、如果不是，则停留在登录页面。
   */

  CheckIdentity: function () {
    var UserData = this.data.UserData;
    var prefix = app.globalData.setStorage.prefix;  //获得本地存储数据前缀
    var that = this;
    var RemindTime = this.data.RemindTime;
    //如果是通过二维码进来
    if (this.data.scene) {
      var scene = decodeURIComponent(this.data.scene);;
      console.log("通过二维码");
      let _data = scene.split("&");; //由JSON字符串转换为JSON对象
      //console.log(_data[0]);
      var data = {
        "onlykey": _data[0],
        "phone": _data[1],
        "openid": UserData.openid,
      }
      //判断用户身份通过二维码
      co(function* () {
        result = yield common.CheckVipMemberByEwm(data);
        var res = result.data;
        console.log(res);
        //如果用户本身就是会员
        //如果二维码已经超过了扫描次数限制
        if (res.data.right == 0) {
          that.ShowRemind("该二维码已达到扫描次数限制");
          setTimeout(function () {
            //不是非会员跳转到收藏夹页面
            if (res.data.membermsg.member_information != "非会员") {
              wx.switchTab({ url: '../favorite/note_collect/index' });//跳转到收藏夹页面
            }
            else {
              wx.redirectTo({
                url: '../login/index?type=login',
              })
            }
          }, RemindTime);
        } else {
          //如果是主卡用户（即第一次扫描这个二维码），则继承二维码参数中的手机号，并在数据库中将该用户的openid和这个手机号绑定 
          if (res.data.maincard == 1) {
            UserData.MemberInformation = "中国移动健康中心会员";
            UserData.phone = _data[1];
            //保存用户数据
            wx.setStorageSync(prefix + "UserData", UserData)
            wx.switchTab({ url: '../favorite/note_collect/index' });//跳转到收藏夹页面
          }
          /*
          //如果不是第一次
          else {
            UserData.MemberInformation = "中国移动健康中心会员副卡";
            //保存用户数据
            wx.setStorageSync(prefix + "UserData", UserData)
            //如果用户上面拒绝授权头像、昵称等数据 
            if (!UserData.hasOwnProperty('userInfo')) {
              wx.redirectTo({
                url: '../favorite/favorite_share_copy_attention/index?&phone=' + _data.phone,
              })
            } else {
              wx.redirectTo({ url: '../favorite/favorite_share_copy/index?phone=' + _data.phone });//跳转到主卡用户的共享收藏夹页面
            }

        }*/

        }

      });

    }
    //如果是要登录（从别的页面跳转过来的）
    else if (this.data.type) {
      wx.setNavigationBarTitle({
        title: '',
      })
      this.setData({
        PageShow: true,
      })

    } else {
      console.log("不是通过二维码");
      //通过openid判断用户身份
      co(function* () {
       var  result = yield common.CheckVipMemberByUserId();
        var res = result.data;
        var userInfo=[];
       // 
        UserData.MemberInformation = res.data.member_information;
        if (res.data.member_information == "会员订户" || res.data.member_information == "中国移动健康中心会员") {
          UserData.phone = res.data.member_phone;
                  
                
        }
     //  userInfo.nickName="";
      // UserData = userInfo;
        //将用户数据存储到本地
      //  console.log(res);
      //  console.log("aaaaaaaa");
        console.log(UserData);
        wx.setStorageSync(prefix + 'UserData', UserData);
        that.DifSkipPage();
      });

    }
  },
  //根据不同身份跳转
  DifSkipPage: function () {
    var UserData = this.data.UserData;
    //console.log(UserData);
    wx.switchTab({ url: '../my_attention/index' });//跳转到跳转到收藏夹页面
    if (UserData.MemberInformation != "非会员") {
     // wx.switchTab({ url: '../favorite/note_collect/index' });//跳转到跳转到收藏夹页面
      wx.switchTab({ url: '../my_attention/index' });//跳转到跳转到收藏夹页面
    }
    else {
      wx.setNavigationBarTitle({
        title: '',
      })
      this.setData({
        PageShow: true,
      })
    }

  },
  //监听输入手机号输入框变化
  PhoneInputChacnge: function (e) {
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
  //点击发送验证码
  SendCode: function () {
    var that = this;
    var prefix = app.globalData.setStorage.prefix;
    var phone = this.data.phone;
    var CheckPhone = this.CheckPhone(phone);
    var UserData = this.data.UserData;
    var pages = that.data.pages;//当前页面栈数
    this.setData({
      SendCodeDisabled: true,
    })
    if (CheckPhone) {
      var verification_code = that.MathRand(6);//6位随机验证码
      //console.log(verification_code);
      co(function* () {
       var result = yield common.CheckVipMemberByPhone(phone);
        var res = result.data;
        console.log(res);
        if (res.data.member_information == "会员订户" || res.data.member_information == "中国移动健康中心会员") {
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
           var result = yield common.SendMessage(data);
            res = result.data;
            //console.log(res);
            if (res.data.error_msg == "success") {
              that.ShowRemind("短信已发送");
              var d = new Date();
              var valid_time = d.getTime() + (5 * 60 * 1000);
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
            }
            else if (res.data.error_code == "160040") {
              that.ShowRemind("已超出单日短信发送上限");
              that.setData({
                SendCodeDisabled: false,
              });
              return;
            }
            else {
              that.ShowRemind("短信发送失败");
              that.setData({
                SendCodeDisabled: false,
              });
            }
          });

        } else {
          that.ShowRemind("暂不对非订户开放");
          /*
          setTimeout(function () {
            //跳转到页面
            common.ToPages(pages, '../buy_member/index?phone=' + phone);
          }, 1000)
          */
          that.setData({
            SendCodeDisabled: false,
          });
        }
      });

    } else {
      that.setData({
        SendCodeDisabled: false,
      });
    }


  },
  //监听输入验证码输入框变化
  CodeInputChacnge: function (e) {
    //console.log(e);
    this.setData({
      _verification_code: e.detail.value,
    })
    //如果输入了6位验证码则自动收起键盘
    if (e.detail.cursor == 6) {
      //收起键盘
      wx.hideKeyboard()
      //自动取消聚焦输入验证码
      this.setData({
        password_focus: false,
      })
    }
  },
  //监测输入的是否是手机号
  isMobile: function (s) {
    var patrn = /^\s*(14\d{9}|15\d{9}|18\d{9}|13[0-9]\d{8})\s*$/;
    if (!patrn.exec(s)) {
      return false;
    }
    return true;
  },
  MathRand: function (length) {
    var Num = "";
    for (var i = 0; i < length; i++) {
      Num += Math.floor(Math.random() * 10);
    }
    return Num;
  },
  //用户登录
  UserLogin: function () {
    //先屏蔽按钮点击
    this.setData({
      BtnDisabled: true,
    });
    var that = this;
    var phone = this.data.phone;
    var RemindTime = this.data.RemindTime;
    var UserData = this.data.UserData;
    var verification_code = this.data.verification_code;//本地缓存的验证码
    var valid_time = this.data.valid_time;
    var pages = that.data.pages;
    var prefix = app.globalData.setStorage.prefix;//本地存储前缀
    var _verification_code = that.data._verification_code;  //用户输入的验证码

    //获取本地缓存的验证码
    var code_arr = wx.getStorageSync(prefix + "PatientLogin_code_arr");
    console.log(code_arr);
    //如果有缓存患者登录的验证码
    if (code_arr) {
      verification_code = code_arr.verification_code;  //本地缓存的验证码
      valid_time = code_arr.valid_time//本地缓存验证码的过期时间
    }
    //检查输入的手机号是否正确
    var CheckPhone = that.CheckPhone(phone);
    if (CheckPhone) {
      var d = new Date();
      var time = d.getTime();
      //检查输入的验证码是否正确
      if (_verification_code == verification_code && time < valid_time) {
        wx.request({
          url: 'https://f.12590.com/SlowDiseaseTreasure/interface_ysc.php', //仅为示例，并非真实的接口地址
          data: {
            user_id: UserData.openid,
            phone: phone,
            action: "BindPhone",
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res);
            //解除按钮屏蔽点击
            that.setData({
              BtnDisabled: false,
            });
            UserData.MemberInformation = res.data.Member.member_information;
            //更新用户会员信息
            if (res.data.msg == "success") {
              that.ShowRemind("登录成功");
              UserData.phone = phone;
              UserData.LoginSuccess = true;
              //将用户数据存储到本地
              wx.setStorageSync(prefix + 'UserData', UserData);
              //返回上一个页面
              setTimeout(function () {
                if (pages > 1) {
                  wx.navigateBack({
                    delta: 1
                  });
                } else {
                  wx.switchTab({ url: '../favorite/note_collect/index' });
                }

              }, RemindTime)

            }

          }
        })

      }
      // 如果是验证码已失效
      else if (_verification_code == verification_code && time > valid_time) {
        that.ShowRemind("验证码已失效");
        //解除按钮屏蔽点击
        that.setData({
          BtnDisabled: false,
        });
      }

      else {
        that.ShowRemind("请输入正确的验证码");
        //解除按钮屏蔽点击
        that.setData({
          BtnDisabled: false,
        });
      }

    } else {
      that.setData({
        BtnDisabled: false,
      });
    }


  },
  CheckPhone: function (phone) {
    //console.log(phone.length)
    //判断系是否已经输入11位手机号
    if (phone) {
      //如果输入了11位手机号
      if (phone.length == 11) {
        //判断输入的手机号是否正确
        var isMobile = this.isMobile(phone);
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
  //跳转页面
  SkipPage: function (e) {
    var pages = this.data.pages;
    common.ToPages(pages, e.currentTarget.dataset.url);
  },
})
