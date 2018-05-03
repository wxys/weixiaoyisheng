// pages/buy_member/index.js 
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
    UserData: {},
    dredge_selected: 60,
    dredge_type: '年度黄金会员',
    PayDisabled: false,
    phone: '',
    RemindShow: 'none',  //是否出现提示
    RemindShow2: 'none',  //是否出现提示
    RemindText: '',  //提示文字
    RemindText2: '',  //提示文字
    RemindTime: 1000, //提示存在时间(ms)
    send_msg: '发送验证码',
    current_time: 60,
    SendCodeDisabled: false,
    password_focus: false,
    verification_code: '',
    valid_time: '',
    isSending: false,
    ShowSendCode: false,
    sendjh: 'send-btn.jh', 
    sendjhts:'send-btn.jhts',
    isxaorder: '0',//传统订户特殊处理
    tt_list: 0,
    ttdztype:"",
    alertt:"",
    tttdtype:"",
    spkttype:"",
    yewulisttype:"",
    bannerimgtype:"bannerimgtype",
    alertnum: 0,
   
    phone: '',
    change_tips: '更换手机号'
  },
  showspkt: function () {
    wx.navigateTo({
      url: '../banner_h5/index',
    })

  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    console.log(options);
    this.setData({
      Userphone: options.phone
    })
    //console.log(this.data.phone);
    if(this.data.phone=="")
    {
      this.data.ShowSendCode=true;     
    }
  
     var prefix = app.globalData.setStorage.prefix;
    //获取用户id
    var UserData = wx.getStorageSync(prefix + 'UserData');
    this.setData({
      UserData: UserData,
      ShowSendCode: this.data.ShowSendCode
    })

    wx.request({
      url: 'https://h5.12590.com/SlowDiseaseTreasure/interface_htc.php', //仅为示例，并非真实的接口地址
      data: {
        action: 'getiskjtt',
        openid:that.data.UserData.openid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        console.log(res.data[0].iskjtt);
        if(res.data[0].iskjtt=='1'){
          that.setData({
            yewulisttype:"yewulisttype",
            bannerimgtype:"bannerimgtype"
          })
        } else {
          that.setData({
            bannerimgtype: ""
          })
        }
      },
      complete: function () {
      },
    });
  },
  onReady: function () {
    // 页面渲染完成
  },


  onShow: function (options) {
    //console.log(options);
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  PhoneInputChange: function (e) {
    this.setData({
      phone: e.detail.value
    })
    console.log(e.detail.value);
    //如果输入了11位手机号则自动收起键盘
    if (e.detail.cursor == 11) {
      //收起键盘
      wx.hideKeyboard()

    }
  },
 

  //监听输入手机号输入框变化
  PhoneInputChacnge1: function (e) {
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
  //点击切换号码
  ChangePhone: function (e) {
    console.log(e.currentTarget.dataset.index);
    var that = this;
    that.setData({
      alertnum: 1,
      change_tips: e.currentTarget.dataset.index
    })
  },
  hideAlert: function () {
    var that = this;
    that.setData({
      alertnum: 0
    })
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
  //监听输入验证码输入框变化
  CodeInputChacnge1: function (e) {
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
  //选择开通的会员套餐
  SelectDrege: function (e) {
    //console.log(e);
    var dredge_selected = e.currentTarget.dataset.cost;
    var dredge_type = e.currentTarget.dataset.type;
    this.setData({
      dredge_selected: dredge_selected,
      dredge_type: dredge_type,
    })
  },
  //立即开通,//统一下单
  DredgeMember: function (e) {
    //console.log(e);return;
    this.setData({
      PayDisabled: true,
    })
    var program_parameter = app.globalData.program_parameter; //获取小程序配置数据
    var that = this;
    //console.log(that); return;
    var UserData = this.data.UserData;
    var Pagedata = this.data;
    var prefix = app.globalData.setStorage.prefix;
    var time = (new Date()).valueOf();
    //下单时间
    var order_time = common.getNowFormatDate();
    //生成商户订单号
    var _timestamp = Math.floor(time / 1000);
    var out_trade_no = _timestamp + common.MathRand(6);
    //商品名称
    var dredge_type = e.target.dataset.type;
    var body = '康健管家-' + dredge_type + '-开通';
    var dredge_selected = e.target.dataset.cost;  //应付金额
    var phone = this.data.phone;
    //console.log(phone);return;

    var verification_code = this.data.verification_code;//本地缓存的验证码
    var valid_time = this.data.valid_time;
    var _verification_code = that.data._verification_code;  //用户输入的验证码

    //获取本地缓存的验证码
    var code_arr = wx.getStorageSync(prefix + "PatientLogin_code_arr");
 
    var ShowSendCode = this.data.ShowSendCode;
    //如果有缓存患者登录的验证码
    if (code_arr) {
      verification_code = code_arr.verification_code;  //本地缓存的验证码
      valid_time = code_arr.valid_time//本地缓存验证码的过期时间
    }

    //console.log(UserData);
    //console.log(that.data.isxaorder);
    if (UserData.expiration_time) {
      that.data.isxaorder = 1;
    }else{
      that.data.isxaorder = 0;
    }
    //console.log(CheckPhone);
    //console.log(that.data.isxaorder+'121212');

    //检查输入的手机号是否正确
    var CheckPhone = that.CheckPhone(phone);
    if (CheckPhone) {
      var dredge_data = {
        appid: program_parameter.appid,
        //phone: UserData.phone,
        phone: phone,
        api_key: program_parameter.api_key,
        openid: UserData.openid,
        mch_id: program_parameter.mch_id,
        body: body,  //商品名称
        out_trade_no: out_trade_no, //商户订单号
        total_fee: dredge_selected * 100, //以分为单位
        dredge_type: dredge_type,
        dredge_selected: dredge_selected,
        order_time: order_time,
      };
      that.setData({
        dredge_data: dredge_data,
      })
      //如果是切换号码的
      if (ShowSendCode) {
        var d = new Date();
        var time = d.getTime();
        //替换1==1
        //_verification_code == verification_code && time < valid_time
        if (1==1) {
        //  that.DredgeMemberOrder();

         
          if (that.data.isxaorder== "1") {
            that.ShowRemind("您已是手机包月会员");
          } else {
            that.DredgeMemberOrder();
            //console.log(1111111);
          }
        }
        // 如果是验证码已失效
        else if (_verification_code == verification_code && time > valid_time) {
          that.ShowRemind("验证码已失效");
          //解除按钮屏蔽点击
          that.setData({
            PayDisabled: false,
          });

        }
        else {
          that.ShowRemind("请输入正确的验证码");
          //解除按钮屏蔽点击
          that.setData({
            PayDisabled: false,
          });
        }
      }
      //如果是直接根据自己手机号开通会员的
      else {
        if (that.data.isxaorder=="1")
        {
          that.ShowRemind("您已是手机包月会员");
        }else
        {
          that.DredgeMemberOrder();
          //console.log(22222);
        }    
      }
    }
    else {
      this.setData({
        PayDisabled: false,
      })
    }
    //console.log(body);

  },
  //开通会员下单
  DredgeMemberOrder: function () {
    var dredge_data = this.data.dredge_data;
    var prefix = app.globalData.setStorage.prefix;
    var that=this;
    var Pagedata = this.data;
  //  console.log(dredge_data.phone);
  
    if (typeof(dredge_data.phone) == "undefined")
    {
      dredge_data.phone = Pagedata.phone;
    }
    //console.log(222233333);
  
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface.php', //仅为示例，并非真实的接口地址
      data: {
        action: 'PlaceOrder',
        appid: dredge_data.appid,
        phone: dredge_data.phone,
        api_key: dredge_data.api_key,
        openid: dredge_data.openid,
        mch_id: dredge_data.mch_id,
        body: dredge_data.body,  //商品名称
        out_trade_no: dredge_data.out_trade_no, //商户订单号
        total_fee: dredge_data.dredge_selected * 100, //以分为单位
        spbill_create_ip: '192.168.21.30',
        notify_url: 'https://f.12590.com/SlowDiseaseTreasure/pay.php',
        trade_type: 'JSAPI',
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //console.log(res);
        //console.log(66);
        //要增加的数组
        var order_list = {
          appid: res.data.appid,
          nonceStr: res.data.nonceStr,
          package: res.data.package,
          paySign: res.data.paySign,
          signType: res.data.signType,
          timeStamp: res.data.timeStamp,
          order_name: dredge_data.body,
          order_no: dredge_data.out_trade_no,
          order_time: dredge_data.order_time,
          order_member_type: dredge_data.dredge_type,
          order_price: dredge_data.dredge_selected,
          phone: Pagedata.phone,
          
        };
        //将订单数据存储到本地（通过链接跳转会造成编码问题）
        wx.setStorageSync(prefix + "order_list", order_list);
        //console.log(wx.getStorageSync(prefix + "order_list"));
        //console.log(6666);
        //跳转到生成订单页面（不关闭） redirectTo  navigateTo
        wx.navigateTo({
          url: '../pay_member/index',
        });
      },
      complete: function () {
        that.setData({
          PayDisabled: false,
        })
      },
    });
  },
  ttdz_submit:function(){
    var that=this;
    //检查输入的手机号是否正确

    var phone = this.data.phone;
    var phone1 = this.data.phone1;
    var prefix = app.globalData.setStorage.prefix;
    var time = (new Date()).valueOf();
    var CheckPhone = that.CheckPhone(phone);
    var verification_code = this.data.verification_code;//本地缓存的验证码
    var valid_time = this.data.valid_time;
    var _verification_code = that.data._verification_code;  //用户输入的验证码

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
            url: 'https://f.12590.com/SlowDiseaseTreasure/interface_htc.php', //仅为示例，并非真实的接口地址
            data: {
              action: 'setiskjtt',
              dingyue: '1',
              openid: that.data.UserData.openid,
              phone: phone
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              //console.log(res);
              //console.log(phone);
              if (res.data.issuccess == '1') {
                var data = {
                  phone: phone1,
                  kjtt:'1',
                };
                var result=common.SendMessage(data);
                //console.log(result);
                that.ShowRemind("激活成功");
                that.hide_alert();
                that.setData({
                  yewulisttype: "yewulisttype",
                  bannerimgtype:"bannerimgtype"
                })
              }else{
                that.ShowRemind("激活失败");
                //that.hide_alert();
              }
            },
            complete: function () {
            },
          });
        });


      }else  if (_verification_code == verification_code && time > valid_time) {
          that.ShowRemind("验证码已失效");

      }else {
        that.ShowRemind("请输入正确的验证码");
      }
    }
  }, //点击激活微信
  jhwx: function () {
    var that = this;
    var ShowSendCode = this.data.ShowSendCode;
   
    var prefix = app.globalData.setStorage.prefix;
    var code_arr = wx.getStorageSync(prefix + "PatientLogin_code_arr");
    
    var verification_code = code_arr.verification_code;//本地缓存的验证码
    var valid_time = code_arr.valid_time;
    var _verification_code = that.data._verification_code;  //用户输入的验证码
    var Pagedata = this.data;
   // console.log(valid_time);
   // console.log(ShowSendCode);
    if (ShowSendCode) {
      var d = new Date();
      var time = d.getTime();
      
    //  console.log(_verification_code);
      //console.log(verification_code+"aaaaaaaaa");
     // console.log(time);
      //console.log(valid_time);
      if (_verification_code == verification_code && time < valid_time) {
       
      
          co(function* () {
          var result = yield common.UpVipMemberByPhone(Pagedata.phone);
            var res = result.data;
           // console.log(res);
           // console.log("aaaaaaaaaaaaaaa");
            if (res.data.errorNo==1)
            {
              that.setData({
                sendjh: "send-btn.jh",
                sendjhts: 'send-btn.jhts',
              })
              that.ShowRemind("激活成功");
              wx.navigateTo({
                url: '../personal/index',
              });
            }
          });    
      }
      // 如果是验证码已失效
      else if (_verification_code == verification_code && time > valid_time) {
        that.ShowRemind("验证码已失效");
        //解除按钮屏蔽点击
        that.setData({
          PayDisabled: false,
        });

      }
      else {
        that.ShowRemind("请输入正确的验证码");
        //解除按钮屏蔽点击
        that.setData({
          PayDisabled: false,
        });
      }
    }
  },bdcode: function () {
    co(function* () {
      var result = yield common.CheckVipMemberByPhone(phone);
      var res = result.data;
      //console.log(res);
    });
  },
  //点击发送验证码
  SendCode: function () {
    var that = this;
    var prefix = app.globalData.setStorage.prefix;
    var phone = this.data.phone;
    console.log(this.data.phone);
    var CheckPhone = this.CheckPhone(phone);
    var UserData = this.data.UserData;
    var pages = that.data.pages;//当前页面栈数
    this.setData({
      SendCodeDisabled: true,
    })
    if (CheckPhone) {
      var verification_code = common.MathRand(6);//6位随机验证码
      //console.log(verification_code);
      co(function* () {
        var result = yield common.CheckVipMemberByPhone(phone);
        var res = result.data;
        //console.log(res);
        //console.log("aaaa");
        //res.data.member_information == "会员订户" || res.data.member_information == "中国移动健康中心会员"
        if (1==2) {
         /* that.ShowRemind("该号码已是会员");
          that.setData({
            SendCodeDisabled: false,
          })*/
          
        } else {
          if (res.data.member_information == "会员订户" || res.data.member_information == "中国移动健康中心会员")
          {
            //console.log("111111111111");
            that.setData({
              sendjh: "send-btn.jh2",
              sendjhts: 'send-btn.jhts2',
              isxaorder:'1',
            })
          }
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

        }
      });

    } else {
      that.setData({
        SendCodeDisabled: false,
      });
    }
  },
  sendsmscheckcode: function () {
    var that = this;
    var prefix = app.globalData.setStorage.prefix;
    var phone = this.data.phone;
    var CheckPhone = this.CheckPhone(phone);
    var verification_code = common.MathRand(6);//6位随机验证码
    console.log(verification_code);
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
          kjtt:'2'
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
          }else {
            that.ShowRemind2("本业务仅限中国移动用户使用");
            that.setData({
              SendCodeDisabled: false,
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
  showttdz:function(){

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

  //自定义提示栏
  ShowRemind2: function (text) {
    var RemindTime = this.data.RemindTime;
    var that = this;
    this.setData({
      RemindShow2: '',
      RemindText2: text,
    });
    setTimeout(function () {
      that.setData({
        RemindShow2: 'none',
        RemindText2: '',
      });
    }, RemindTime)
  },
  showtt: function () {
    var that = this;
    that.setData({
      alerttype: "alerttype",
      alertt: "alertt"
    })
  },
  showttdz:function(){
    var that=this;
    that.setData({
      ttdztype:"ttdztype",
      alerttype:"alerttype"
    })
  },
  tt_submit: function () {
    var that = this;
    that.setData({
      ttdztype: "",
      alerttype: "",
      alertt: ""
    })    
  },
  hide_alert: function () {
    var that = this;
    that.setData({
      ttdztype: "",
      alerttype: "",
      alertt:"",
      tttdtype:"",
      spkttype:""
    })
  },
  click_tt_list: function (e) {
    var that = this;
    console.log(e);
    if (this.data.tt_list === e.target.dataset.ttlisttype) {
      return false;
    } else {
      that.setData({
        tt_list: e.target.dataset.ttlisttype
      })
    }
  },
  showtttd: function () {
    var that = this;
    console.log(that);
    that.setData({
      tttdtype: "tttdtype",
      alerttype: "alerttype"
    })
  },
  tttd_submit: function () {
    var that = this;
    that.setData({
      ttdztype: "",
      alerttype: "",
      alertt: "",
      tttdtype: "",
      bannerimgtype: ""
    })
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface_htc.php', //仅为示例，并非真实的接口地址
      data: {
        action: 'setiskjtt',
        dingyue:'0',
        openid: that.data.UserData.openid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        if (res.data.issuccess== '1') {
          that.setData({
            yewulisttype: ""
          })
        }
      },
      complete: function () {
      },
    });
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
              change_tips: that.data.change_tips
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              console.log(res);
              UserData.phone = phone;
              userInfo.User_Phone = phone;
              if (res.data.issuccess == '1') {
                if (that.data.change_tips == '激活会员') {
                  that.ShowRemind("激活成功");
                  that.setData({
                    UserData: UserData,
                    userInfo: userInfo,
                    changephone: phone,
                    changephone: phone,
                    alertnum: 0
                  })

              

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
