// pages/add_household_contacts/index.js
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
    PageShow: false,
    RemindShow: 'none',  //是否出现提示
    RemindText: '',  //提示文字
    RemindTime: 1000, //提示存在时间(ms)
    credentials:
    ['身份证'], //证件类型
    sex: ['男', '女'],//性别选择  
    UserData: {},
    household_contacts: {
      credentials_type:'身份证',
      address: '',
      mail: '',
      yb_cardid:'',
      jz_cardid:'',
    },
    BtnDisabled: false, //添加按钮能否点击
    start_date: common.formatDate(common.DateAddORSub("y", "-", 120)), //生日选择日期开始
    end_date: common.formatDate(common.DateAddORSub("d", "+", 0)),  //生日选择日期结束
    IfUpdate: false,//是否是修改
    select_credentials_index:0,//默认选择身份证
  },
  onLoad: function (options) {
    //console.log(options);
   
    //如果是修改联系人
    if (options.IfUpdate) {
      wx.setNavigationBarTitle({
        title: '修改常用就诊人'
      })
      var household_contacts = {
        address: options.address,
        birthday: options.birthday,
        city: options.city,
        credentials_no: options.credentials_no,
        credentials_type: options.credentials_type,
        mail: options.mail,
        name: options.name,
        phone: options.phone,
        province: options.province,
        sex: options.sex,
        yb_cardid: options.yb_cardid,
        jz_cardid: options.jz_cardid,
      }
      //设置证件类别的选中
      var credentials = this.data.credentials;
      for (var x in credentials) {
        if (credentials[x] == options.credentials_type) {
          this.setData({
            select_credentials_index: x,
          })
        }
      }
      //设置性别的选中
      var sex = this.data.sex;
      for (var x in sex) {
        if (sex[x] == options.sex) {
          this.setData({
            select_sex_index: x,
          })
        }
      }
      this.setData({
        autoid: options.autoid,
        household_contacts: household_contacts,
        IfUpdate: options.IfUpdate,
      })
    } else {
     
      wx.setNavigationBarTitle({
        title: '添加常用就诊人'
      })
    }


  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    var that = this;
    var IfUpdate = this.data.IfUpdate;
    var household_contacts = this.data.household_contacts;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          ScrollHeight: res.windowHeight - 40, //设置可滑动区域
        });
      }
    })
    //获取用户id
    var UserData = wx.getStorageSync(app.globalData.setStorage.prefix + 'UserData');

    //console.log(UserData);
    var that = this;
    if (UserData) {
      that.setData({
        UserData: UserData,
      })
      that.LoadData();  //获取页面数据
    } else {
      co(function* () {
        result = yield common.GetUserData();
        UserData = result.data;
        that.setData({
          UserData: UserData,
        })

        that.LoadData();  //获取页面数据
      });

    }

    
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭

  },
  LoadData:function(){
    var that = this;
    var UserData = this.data.UserData;
    var prefix = app.globalData.setStorage.prefix;
    var household_contacts = this.data.household_contacts;
    var IfUpdate = this.data.IfUpdate;
    //如果是修改
    if (!IfUpdate){
      //如果用户位置是自动定位
      if (UserData.hasOwnProperty('Userlocation') && !IfUpdate) {
        household_contacts.region_condition = "自动定位";
        household_contacts.city = UserData.Userlocation.location_city;
        household_contacts.province = UserData.Userlocation.location_province;
      }
      //如果用户自己选择了位置
      var SelectRegion = wx.getStorageSync("SelectRegion");
      //console.log(SelectRegion);
      if (SelectRegion) {
        household_contacts.region_condition = "用户选择";
        household_contacts.city = SelectRegion.city;
        household_contacts.province = SelectRegion.province;
        //console.log(res)

        wx.removeStorageSync("SelectRegion")
      }
    }
    
    that.setData({
      household_contacts: household_contacts,
      PageShow:true,
    })
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
  //捕捉医保卡输入框的值
  YbCardIdInput: function (e) {
    //console.log(e);
    var household_contacts = this.data.household_contacts;
    household_contacts.yb_cardid = e.detail.value;
    this.setData({
      household_contacts: household_contacts
    })
  },
  //捕捉就诊卡输入框的值
  JzCardIdInput: function (e) {
    //console.log(e);
    var household_contacts = this.data.household_contacts;
    household_contacts.jz_cardid = e.detail.value;
    this.setData({
      household_contacts: household_contacts
    })
  },
  //选择证件类型
  bindPickerCredentials: function (e) {
    //console.log(e);
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
  //添加家庭联系人
  AddHouseholdContacts: function () {
    var that = this;
    this.setData({
      BtnDisabled: true,
    })
    
    var UserData = this.data.UserData;
    var household_contacts = this.data.household_contacts;  //联系人资料
    //console.log(household_contacts);return;
    if (!household_contacts.hasOwnProperty('name')) {
      this.ShowRemind("姓名不能为空");
      that.setData({
        BtnDisabled: false,
      })
    }
    else if (!household_contacts.hasOwnProperty('credentials_type')) {
      this.ShowRemind("请选择证件类型");
      that.setData({
        BtnDisabled: false,
      })
    }
    else if (!household_contacts.hasOwnProperty('credentials_no')) {
      this.ShowRemind("证件号为空");
      that.setData({
        BtnDisabled: false,
      })
    }
    else if (!household_contacts.hasOwnProperty('sex')) {
      this.ShowRemind("请选择性别");
      that.setData({
        BtnDisabled: false,
      })
    }
    /*
    else if (!household_contacts.hasOwnProperty('birthday')) {
      this.ShowRemind("请选择生日");
      that.setData({
        BtnDisabled: false,
      })
    }
    */
    else if (!household_contacts.hasOwnProperty('province')) {
      this.ShowRemind("请选择地区");
      that.setData({
        BtnDisabled: false,
      })
    }
    else if (!household_contacts.hasOwnProperty('phone')) {
      this.ShowRemind("手机号为空");
      that.setData({
        BtnDisabled: false,
      })
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
        that.setData({
          BtnDisabled: false,
        })
      }
      else if (!is_credentials) {
        this.ShowRemind(household_contacts.credentials_type + "号不正确");
        that.setData({
          BtnDisabled: false,
        })
      }
      else if (!is_phone) {
        this.ShowRemind("手机号不正确");
        that.setData({
          BtnDisabled: false,
        })
      }
      else {

        var IfUpdate = this.data.IfUpdate;
        //console.log(IfUpdate);
        //如果是添加联系人
        if (!IfUpdate) {
          wx.request({
            url: 'https://f.12590.com/procedure/SlowDiseaseTreasure_Port.php',
            data: {
              action: 'AddFamilyUser',
              user_id: UserData.openid,
              household_contacts: household_contacts,
            },
            method: 'GET',
            // header: {}, // 设置请求的 header
            success: function (res) {
              //console.log(res);
              if (res.data.msg == "success") {
                that.ShowRemind("成功添加家庭联系人");
                //1s之后跳转到家庭联系人页面
                setTimeout(function () {
                  wx.navigateBack({
                    data: '1'
                  })
                }, 1000)
              } else {
                that.ShowRemind("用户已经存在");
              }

            },
            fail: function (res) {
              // fail
            },
            complete: function (res) {
              // complete
              that.setData({
                BtnDisabled: false,
              })
            }
          });

        }
        //如果是修改联系人
        else {
          var autoid = this.data.autoid;
          wx.request({
            url: 'https://f.12590.com/procedure/SlowDiseaseTreasure_Port.php',
            data: {
              action: 'UpdateFamilyUser',
              autoid: autoid,
              household_contacts: household_contacts,
            },
            method: 'GET',
            // header: {}, // 设置请求的 header
            success: function (res) {
              console.log(res);

              if (res.data.msg == "success") {
                that.ShowRemind("修改成功");
                //1s之后跳转到家庭联系人页面
                setTimeout(function () {
                  wx.navigateBack({
                    data: '1'
                  })
                }, 1000)
              } else {
                that.ShowRemind("修改失败");
              }

            },
            fail: function (res) {
              // fail
            },
            complete: function (res) {
              // complete
              that.setData({
                BtnDisabled: false,
              })
            }
          });
        }


      }
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