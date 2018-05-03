// pages/subscribe_attestation/index.js
//获取全局的应用实例
var app = getApp();
//引用公共文件
var common = require('../../common.js');
Page({
  data: {
    RemindShow: 'none',  //是否出现提示
    RemindText: '',  //提示文字
    RemindTime: 1500, //提示存在时间(ms)
    credentials:
    ['身份证'], //证件类型
    sex: ['男', '女'],//性别选择  
    UserData: {},
    household_contacts: {},
    start_date:common.formatDate(common.DateAddORSub("y","-",120)), //生日选择日期开始
    end_date:common.formatDate(common.DateAddORSub("d","+",0)),  //生日选择日期结束
    household_contacts: {
      credentials_type: '身份证',
      address: '',
      mail: '',
      yb_cardid: '',
      jz_cardid: '',
    },
  },
  onLoad: function (options) {
    var prefix = app.globalData.setStorage.prefix;
    //获取用户id
    var UserData = wx.getStorageSync(prefix + 'UserData');
    this.setData({
      UserData: UserData,
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面显示
    var that = this;
    var UserData = this.data.UserData;
    // 页面初始化 options为页面跳转所带来的参数
    var household_contacts = this.data.household_contacts;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          ScrollHeight: res.windowHeight - 46, //设置排班可滑动区域
        });
      }
    })
    household_contacts.region_condition = "自动定位";
    if (UserData.hasOwnProperty('Userlocation')) {
      household_contacts.city = UserData.Userlocation.location_city;
      household_contacts.province = UserData.Userlocation.location_province;
    }
    //console.log(res)
    that.setData({
      household_contacts: household_contacts,
    })


    wx.getStorage({
      key: 'SelectRegion',
      success: function (res) {
        household_contacts.region_condition = "用户选择";
        household_contacts.city = res.data.city;
        household_contacts.province = res.data.province;
        //console.log(res)
        that.setData({

          household_contacts: household_contacts,
        })
      },
      complete: function () {
        //清除选择地区数据
        wx.removeStorage({
          key: 'SelectRegion',
          success: function (res) {
          }
        })
      }
    });
    //获取本地数据结束    

  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭

  },
  //捕捉姓名输入框的值
  NameInput: function (e) {
    //console.log(e);
    var household_contacts = this.data.household_contacts;
    household_contacts.name = e.detail.value;
    this.setData({
      household_contacts: household_contacts
    })
  },

  //捕捉证件号输入框的值
  CredentialsNoInput: function (e) {
    //console.log(e);
    var household_contacts = this.data.household_contacts;
    household_contacts.credentials_no = e.detail.value;
    this.setData({
      household_contacts: household_contacts
    })
  },

  //捕捉联系地址输入框的值
  AddressInput: function (e) {
    //console.log(e);
    var household_contacts = this.data.household_contacts;
    household_contacts.address = e.detail.value;
    this.setData({
      household_contacts: household_contacts
    })
  },

  //捕捉手机号输入框的值
  PhoneInput: function (e) {
    //console.log(e);
    var household_contacts = this.data.household_contacts;
    household_contacts.phone = e.detail.value;
    this.setData({
      household_contacts: household_contacts
    })
  },

  //捕捉邮箱输入框的值
  MailInput: function (e) {
    //console.log(e);
    var household_contacts = this.data.household_contacts;
    household_contacts.mail = e.detail.value;
    this.setData({
      household_contacts: household_contacts
    })
  },

  //选择证件类型
  bindPickerCredentials: function (e) {
    var household_contacts = this.data.household_contacts;  //联系人资料
    var credentials = this.data.credentials;  //证件类型
    var index = e.detail.value;
    if (household_contacts) {
      household_contacts.credentials_type = credentials[index]
    } else {
      var household_contacts = {
        credentials_type: credentials[index]
      }
    }
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      select_credentials_index: e.detail.value,
      household_contacts: household_contacts,
    })
  },

  //选择性别
  bindPickerSex: function (e) {
    var household_contacts = this.data.household_contacts;  //联系人资料
    var sex = this.data.sex;  //性别选择
    var index = e.detail.value;
    if (household_contacts) {
      household_contacts.sex = sex[index]
    } else {
      var household_contacts = {
        sex: sex[index]
      }
    }
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      select_sex_index: e.detail.value,
      household_contacts: household_contacts,
    })
  },

  //选择生日
  bindDateChange: function (e) {
    //console.log(e);
    var household_contacts = this.data.household_contacts;  //联系人资料
    if (household_contacts) {
      household_contacts.birthday = e.detail.value
    } else {
      var household_contacts = {
        birthday: e.detail.value
      }
    }
    this.setData({
      household_contacts: household_contacts,
      date: e.detail.value
    })
  },

  //实名认证
  SubscribeAttestation: function () {
    var household_contacts = this.data.household_contacts;  //联系人资料
    var me = this;

    //console.log(household_contacts);
    if (!household_contacts.hasOwnProperty('name')) {
      this.ShowRemind("姓名不能为空");
    }
    else if (!household_contacts.hasOwnProperty('credentials_type')) {
      this.ShowRemind("请选择证件类型");
    }
    else if (!household_contacts.hasOwnProperty('credentials_no')) {
      this.ShowRemind("证件号为空");
    }
    else if (!household_contacts.hasOwnProperty('sex')) {
      this.ShowRemind("请选择性别");
    }
    /*
    else if (!household_contacts.hasOwnProperty('birthday')) {
      this.ShowRemind("请选择生日");
    }
    */
      /*
    else if (!household_contacts.hasOwnProperty('province')) {
      this.ShowRemind("请选择地区");
    }*/
    else if (!household_contacts.hasOwnProperty('phone')) {
      this.ShowRemind("手机号为空");
    } else {
      //验证姓名是否是中文
      var isChinese = common.isChinese(household_contacts.name);
      //验证手机号
      var is_phone = common.isMobile(household_contacts.phone);
      if (household_contacts.credentials_type == "身份证") {
        //验证身份证
        var is_credentials = common.IdentityCodeValid(household_contacts.credentials_no)

      }

      if (!isChinese) {
        this.ShowRemind("姓名请填写中文");
      }
      else if (!is_credentials) {
        this.ShowRemind(household_contacts.credentials_type + "号不正确");
      }
      else if (!is_phone) {
        this.ShowRemind("手机号不正确");
      }
      else {
        household_contacts.openid = me.data.UserData.openid;
        wx.request({
          url: 'https://f.12590.com/SlowDiseaseTreasure/interface.php',
          data: {
            action: 'Insert_Phone',
            // phone: '13123456789'
           // phone: household_contacts.phone
            userData: household_contacts            
          },
          method: 'GET',
          // header: {}, // 设置请求的 header
          success: function (res) {
            console.log(res);
            if (res.data.result != 1) {
              me.showRemind('认证失败');
              return;
            }else{
              //跳转到预约信息页
              wx.redirectTo({
                url: '../subscribe/index',
              });
            }

          },
          fail: function (res) {
            // fail
          },
          complete: function (res) {
            // complete
          }
        });

      }

    }
  },

  //选择地区跳转
  SelectRegion:function(){
    var return_url=encodeURIComponent("../subscribe_attestation/index");
    wx.redirectTo({
      url: "../select_region/index?type=select_region&return_url="+return_url 
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
  }
})