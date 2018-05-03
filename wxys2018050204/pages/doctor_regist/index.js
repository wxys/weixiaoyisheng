// pages/login/index.js
//获取全局的应用实例
var app = getApp();
//引用公共文件
var common = require('../../common.js');
//引入co函数支持
const Promise = global.Promise = require('../../libs/es6-promise')
const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
Page({
  data: {
    RemindShow: 'none',  //是否出现提示
    RemindText: '',  //提示文字
    RemindTime: 1000, //提示存在时间(ms)
    send_msg: '发送验证码',
    current_time: 60,//验证码倒计时
    phone: '',  //手机号
    password: '',  //密码
    sure_password: '', //确认密码
    _img_code:'', //图形验证码
    _verification_code:'',  //短信验证码
    SendCodeDisabled: false,
    isSending:false,
    BtnDisabled: false,
    set_password_focus: false,
    code_focus: false,//输入短信验证码聚焦
    SendCode: false,//是否显示发送短信验证码窗口
    CodeData: {
      code: '',
      code_src: '',
    }
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    //console.log(options);
    var that = this;
    var prefix = app.globalData.setStorage.prefix;
    //获取用户id
    var UserData = wx.getStorageSync(prefix + 'UserData');
    this.setData({
      UserData: UserData,
      phone: UserData.phone,
    })
    this.GetImgCode();
     
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

  //获取图片验证码
  GetImgCode: function (e) {
    var that = this;
    var UserData = this.data.UserData;

    wx.request({
      url: 'https://f.12590.com/procedure/SlowDiseaseTreasure_Port.php',
      data: {
        action: 'GenerateImgCode',
        user_id: UserData.openid,

      },
      method: 'GET',
      success: function (res) {
        //console.log(res);
        that.setData({
          CodeData: res.data,
        })
      },
      fail: function (res) {

      },
      complete: function (res) {

      },
    })
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
      this.setData({
        set_password_focus: true,
      })


    }
  },
  //监听输入设置密码输入框变化
  PasswordInputChacnge: function (e) {
    this.setData({
      password: e.detail.value
    })
    //  console.log(e);

  },
  //监听输入确认密码输入框变化
  SurePasswordInputChacnge: function (e) {
    this.setData({
      sure_password: e.detail.value
    })
    //  console.log(e);

  },
  //监听输入图形验证码输入框变化
  CodeInputChacnge1: function (e) {
    
    this.setData({
      _img_code: e.detail.value,
    })
    var CodeData = this.data.CodeData;
    //如果输入的图形验证码正确，则出现发送短信验证码的输入框
    if (e.detail.value == CodeData.code) {
      //收起键盘
      wx.hideKeyboard()
      //自动取消聚焦输入验证码
      this.setData({
        //验证码确认窗口
        SendCode: true,
      })

    }
  },
  //监听输入短信验证码输入框变化
  CodeInputChacnge2: function (e) {
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
  //点击发送验证码
  SendCode: function () {
    var that = this;
    var phone = this.data.phone;
    var prefix = app.globalData.setStorage.prefix;//本地存储前缀
    //屏蔽发送按钮点击
    this.setData({
      SendCodeDisabled: true,
    })

    if (common.isMobile(phone)) {
    
      var verification_code = common.MathRand(6);//6位随机验证码
      console.log(verification_code);
      //收起键盘
      wx.hideKeyboard();
      //自动聚焦输入图形验证码
      this.setData({
        code_focus: true,
      })
      //发送医生注册验证码
      var ajax_data = {
        "data": {
          "template_id": "174091",
          "phone": phone,
          "message_parameter": [
            verification_code,
            5
          ]
        }
      };
      //发送验证码
      co(function* () {
       var result = yield common.SendMessageUnify(ajax_data);
        //console.log(result);
        var res = result.data;
        console.log(res);
       
        if (res.data.error_msg == "success") {

          that.ShowRemind("短信已发送");
          var d = new Date();
          var valid_time = d.getTime() + (5 * 60 * 1000);
          var code_arr = {
            verification_code: verification_code,
            valid_time: valid_time,
          };
          wx.setStorage({
            key: prefix + "DoctorRegist_code_arr",
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
      this.ShowRemind("手机号不正确")
      //解除屏蔽发送按钮点击
      this.setData({
        SendCodeDisabled: false,
      })
    }


  },

  //注册
  Regist: function () {
    //先屏蔽按钮点击
    this.setData({
      BtnDisabled: true,
    });
    var that = this;
    var data = this.data;
    var RemindTime = data.RemindTime;
    var UserData = data.UserData;

    var prefix = app.globalData.setStorage.prefix;//本地存储前缀
    var verification_code;//本地缓存的验证码
    var valid_time;
    var _verification_code = that.data._verification_code;  //用户输入的验证码
    var d = new Date();
    var time = d.getTime();
    //获取本地缓存的验证码
    var code_arr = wx.getStorageSync(prefix + "DoctorRegist_code_arr");
    //如果有缓存医生登录的验证码
    if (code_arr) {
      verification_code = code_arr.verification_code;  //本地缓存的验证码
      valid_time = code_arr.valid_time//本地缓存验证码的过期时间
    }
    if(!data.phone){
      this.ShowRemind("手机号为空");
      this.setData({
        BtnDisabled: false,
      });
      return;
    } 
    else if (!data.password){
      this.ShowRemind("密码为空");
      this.setData({
        BtnDisabled: false,
      });
      return;
    }
    else if (data.password.length<6) {
      this.ShowRemind("密码最少为6位数");
      this.setData({
        BtnDisabled: false,
      });
      return;
    }
    else if (!data.sure_password) {
      this.ShowRemind("请再次确认密码");
      this.setData({
        BtnDisabled: false,
      });
      return;
    }
    else if (!common.isMobile(data.phone)) {
      this.ShowRemind("手机号不正确");
      this.setData({
        BtnDisabled: false,
      });
      return;
    }
    else if (data.password != data.sure_password) {
      this.ShowRemind("两次密码不一致");
      this.setData({
        BtnDisabled: false,
      });
      return;
    }
    else if (!data._img_code) {
      this.ShowRemind("图形密码为空");
      this.setData({
        BtnDisabled: false,
      });
      return;
    } 
    else if (data._img_code && !data._verification_code) {
      this.ShowRemind("短信验证码为空");
      this.setData({
        BtnDisabled: false,
      });
      return;
    }
    //进行短信验证码的判断
    else{
     
      //检查输入的验证码是否正确
      if (_verification_code == verification_code && time < valid_time) {
        wx.request({
          url: 'https://f.12590.com/SlowDiseaseTreasure/interface3.php', //仅为示例，并非真实的接口地址
          data: {
            userid: UserData.openid,
            phone: data.phone,
            password: data.password,
            action: "DoctorUserRegister",
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res);
            //注册成功
            if (res.data.errcode == "400006") {
              //存储医生注册的手机号
              UserData.doctor_phone = data.phone,
              wx.setStorageSync(prefix + "UserData", UserData);
              setTimeout(function () {
                wx.redirectTo({ url: '../doctor_regist_complete/index' });
              }, RemindTime);

            }
            //如果是已经被注册过的手机号，跳转到登录页面
            else if (res.data.errcode == "400004") {
              setTimeout(function () {
                wx.redirectTo({ url: '../doctor_login/index' });
              }, RemindTime);
            } else {
              that.setData({
                BtnDisabled: false,
              })
            }
            that.ShowRemind(res.data.errmsg);
          }
        }); 1875919956218795
      }// 如果是验证码已失效
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

      
        
    }
    
    /*
    //获取本地缓存的验证码
    wx.getStorage({
      key: 'code_arr',
      success: function (res) {

      },
      complete: function (res) {
        var _verification_code = that.data._verification_code;  //用户输入的验证码
        //console.log("用户输入的验证码"+_verification_code)
        var verification_code = res.data.verification_code;  //本地缓存的验证码
        //console.log("本地缓存验证码"+verification_code)
        var valid_time = res.data.valid_time


        var d = new Date();
        var time = d.getTime();
        //检查输入的验证码是否正确
        if (_verification_code == verification_code && time < valid_time) {
          wx.request({
            url: 'https://f.12590.com/SlowDiseaseTreasure/interface.php', //仅为示例，并非真实的接口地址
            data: {
              user_id: UserData.openid,
              phone: phone,
              action: "BindPhone",
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              console.log(res.data);
              //解除按钮屏蔽点击
              that.setData({
                BtnDisabled: false,
              });
              if (res.data.msg == "success") {
                that.ShowRemind("成功注册");
                UserData.phone = phone;
                //将用户数据存储到本地
                wx.setStorage({
                  key: "UserData",
                  data: UserData,
                })
                //返回上一个页面
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  })
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

      }

    });
    */


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
  }
})
