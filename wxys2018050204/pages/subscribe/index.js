
// pages/subscribe/index.js
//获取全局的应用实例
var app = getApp();
//引用公共文件
var common = require('../../common.js');
Page({
  data: {
    pay_type_value: ['到院支付'],//支付方式
    pay_type: '到院支付',
    RemindShow: 'none',  //是否出现提示
    RemindText: '',
    RemindTime: '1000',
    BtnDisabled:false,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var data = this.data;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          ScrollHeight: res.windowHeight - 46, //设置排班可滑动区域
        });
      }
    })
    var prefix = app.globalData.setStorage.prefix;
    //获取用户id
    var UserData = wx.getStorageSync(prefix + 'UserData');
    this.setData({
      UserData: UserData,
    })
    //获取预约数据
    var subscribe_list = wx.getStorageSync(prefix + 'subscribe_list');
    this.setData({
      subscribe_list: subscribe_list,
    })
   
    this.LoadData();

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
  LoadData: function () {
    var that = this;

    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface.php',
      data: {
        action: 'MoreFamily',
        openid: that.data.UserData.openid
      },
      method: 'GET',
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res);
        var FamilyMember = res.data.MoreFamilyData;
        
        //查找默认联系人
        for (var x in FamilyMember){
          if (FamilyMember[x].IsDefault=="默认"){
            var SeekingPerson={
              seeking_person: FamilyMember[x].User_Name, //就诊人
              certificate_type: FamilyMember[x].Card_Type, //证件类型
              certificate_number: FamilyMember[x].Card_Type_Id, //证件号
              phone: FamilyMember[x].User_Phone, //手机号
              sex: FamilyMember[x].User_Sex, //性别
              yb_cardid: FamilyMember[x].YB_CardId,//医保卡号
              jz_cardid: FamilyMember[x].JZ_CardId,//就诊卡号
            };
          }
        }
        //console.log(res.data.User_List);
        
        that.setData({
          FamilyMember: FamilyMember,
          SeekingPerson: SeekingPerson,
        });

      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    });
  },
  //选择就诊联系人
  bindPickerChange:function(e){
    //console.log(e);
    console.log(this.data.FamilyMember);
    var FamilyMember = this.data.FamilyMember;
    var idx = e.detail.value;
    var SeekingPerson = {
      seeking_person: FamilyMember[idx].User_Name, //就诊人
      certificate_type: FamilyMember[idx].Card_Type, //证件类型
      certificate_number: FamilyMember[idx].Card_Type_Id, //证件号
      phone: FamilyMember[idx].User_Phone, //手机号
      sex: FamilyMember[idx].User_Sex, //性别
      yb_cardid: FamilyMember[idx].yb_cardid,//医保卡号
      jz_cardid: FamilyMember[idx].jz_cardid,//就诊卡号
    };
    
    this.setData({
      
      SeekingPerson: SeekingPerson,

    });
  },
  //就诊卡号
  JzCardIdInput: function (e) {
    var SeekingPerson = this.data.SeekingPerson;
    SeekingPerson.jz_cardid = e.detail.value;
    this.setData({
      SeekingPerson: SeekingPerson,
    })
  },
  //医保卡号 
  YbCardIdInput: function (e) {
    var SeekingPerson = this.data.SeekingPerson;
    SeekingPerson.yb_cardid = e.detail.value;
    this.setData({
      SeekingPerson: SeekingPerson,
    })
  },

  //支付方式
  bindPickerPayType: function (e) {
    this.setData({
      pay_type: this.data.pay_type_value
    });
    console.log(this.data.pay_type);
  },

  //点击预约，保存用户预约信息，并跳转至预约成功页面
  SureSubscribe: function () {
    this.setData({
      BtnDisabled:true,
    })
    var that = this;
    var subscribe_list = that.data.subscribe_list;
    var SeekingPerson = that.data.SeekingPerson;
    var prefix = app.globalData.setStorage.prefix;
    subscribe_list.order_way = 1;//预约渠道
    subscribe_list.openid = that.data.UserData.openid;
    var pay_type = this.data.pay_type;//预约方式
    if (!pay_type) {
      this.ShowRemind("请选择支付方式");
      that.setData({
        BtnDisabled: false,
      })
      return;
    }
    
    if (!SeekingPerson.hasOwnProperty('seeking_person')) {
      this.ShowRemind("请选择就诊人");
      that.setData({
        BtnDisabled: false,
      })
      return;
    }else{
      wx.setStorage({
        key: prefix+'SeekingPerson',
        data: SeekingPerson,
        success: function(res) {

        },
        fail: function(res) {},
        complete: function(res) {
          wx.request({
            url: 'https://f.12590.com/SlowDiseaseTreasure/interface.php',
            data: {
              action: 'Subscribe_to_Hospital',
              subscribe_list: subscribe_list,
              SeekingPerson: SeekingPerson,
            },
            method: 'GET',
            // header: {}, // 设置请求的 header
            success: function (res) {
              console.log(res)
              if (res.data.result > 0) {
                wx.reLaunch({
                  url: '../subscribe_success/index?pay_type='+pay_type
                })
              }
              else {
                that.ShowRemind("预约失败"); 
                that.setData({
                  BtnDisabled: false,
                })

              };
            },
            fail: function (res) {
              // fail
            },
            complete: function (res) {
              // complete
            }
          });
        },
      })
      
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
})