// pages/online_consultant/yuyin_online_consultant_pay/index.js
//引用公共文件
var common = require('../../../common.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    RemindShow: 'none',  //是否出现提示
    RemindTime: '2000',
    PBRQ:"",
    PBRQ_y:"",
    WEEKDAY:"",
    TIME:"",
    HX:"",
    is_first_enter:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var prefix = app.globalData.setStorage.prefix;
    //获取用户id
    var UserData = wx.getStorageSync(prefix + 'UserData');
    this.setData({
      UserData: UserData,
    })
    console.log(that.data.UserData);
    console.log(11111111111111);
    that.setData({
      PBMXXH: options.PBMXXH,
      PBRQ: options.PBRQ,
      PBRQ_y: options.PBRQ_y,
      HX: options.HX,
      WEEKDAY:options.WEEKDAY,
      TIME:options.TIME,
    })
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface_htc.php',
      data: {
        action: 'MoreFamily',
        //openid:'oJKz_0FGSgflXEWAq_DigG8D_gg8',
        openid: that.data.UserData.openid
      },
      method: 'GET',
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res);
        console.log(2222222222);
        console.log(res.data.MoreFamilyData);
        var FamilyMember = res.data.MoreFamilyData;
        if (FamilyMember){
          //查找默认联系人
          for (var x in FamilyMember) {
            if (FamilyMember[x].IsDefault == "默认") {
              var SeekingPerson = {
                family_user_autoid: FamilyMember[x].Family_User_Autoid, 
                seeking_person: FamilyMember[x].User_Name, //就诊人
                certificate_type: FamilyMember[x].Card_Type, //证件类型
                certificate_number: FamilyMember[x].Card_Type_Id, //证件号
                phone: FamilyMember[x].User_Phone, //手机号
                sex: FamilyMember[x].User_Sex, //性别
                birthday: FamilyMember[x].birthday, //手机号
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
        }else{
          console.log(11111111);
          wx.redirectTo({
            url: '../../add_household_contacts/index'
          })
        }

      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //选择就诊联系人
  bindPickerChange: function (e) {
    //console.log(e);
    var FamilyMember = this.data.FamilyMember;
    var idx = e.detail.value;
    var SeekingPerson = {
      family_user_autoid: FamilyMember[idx].Family_User_Autoid, //就诊人id
      seeking_person: FamilyMember[idx].User_Name, //就诊人
      certificate_type: FamilyMember[idx].Card_Type, //证件类型
      certificate_number: FamilyMember[idx].Card_Type_Id, //证件号
      phone: FamilyMember[idx].User_Phone, //手机号
      sex: FamilyMember[idx].User_Sex, //性别
      birthday: FamilyMember[idx].birthday, //出生日期
    };
    console.log(SeekingPerson);
    this.setData({

      SeekingPerson: SeekingPerson,

    });
  },
  querenyuyue: function () {
    var that = this;
    var isfirstenter = that.data.is_first_enter;
    if (!isfirstenter){
      console.log(222222);
      return false;
    } else {
      console.log(333);
      that.setData({
        is_first_enter: 0,
      })
    }

    var prefix = app.globalData.setStorage.prefix;
    var UserData = wx.getStorageSync(prefix + 'UserData');
    var program_parameter = app.globalData.program_parameter; //获取小程序配置数据
    //生成商户订单号
    var time = (new Date()).valueOf();
    var _timestamp = Math.floor(time / 1000);
    var out_trade_no = _timestamp + common.MathRand(6);
    var body = '语音咨询';
    var dredge_type = '语音咨询';
    var dredge_selected = 90;  //应付金额
    var order_time = common.getNowFormatDate();//下单时间
    var yyxx = {
      PBMXXH: that.data.PBMXXH,
      PBRQ: that.data.PBRQ,
      PBRQ_y: that.data.PBRQ_y,
      WEEKDAY: that.data.WEEKDAY,
      TIME: that.data.TIME,
      HX: that.data.HX,
      family_user_autoid: that.data.SeekingPerson.family_user_autoid, //就诊人id
      user_name: that.data.SeekingPerson.seeking_person, //就诊人
      card_type: that.data.SeekingPerson.certificate_type, //证件类型
      card_type_id: that.data.SeekingPerson.certificate_number, //证件号
      user_phone: that.data.SeekingPerson.phone, //手机号
      user_sex: that.data.SeekingPerson.sex, //性别
      birthday: that.data.SeekingPerson.birthday, //性别
      consultation_type: "2",//咨询类型：1、语音咨询；2视频咨询

      doctor_list_autoid: "1",
      doctor_name: "郑靖",
      open_id: UserData.openid,
    };
    that.setData({
      yyxx: yyxx,
    })
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface_htc.php', //仅为示例，并非真实的接口地址
      data: {
        action: "yuyuesuohao",
        PBMXXH: yyxx.PBMXXH,
        HX: yyxx.HX,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        if (!res.data.errorNo) {
          that.setData({
            is_first_enter: 1,
          })
          that.ShowRemind(res.data.error);
        } else {
          var dredge_data = {
            appid: program_parameter.appid,
            phone: yyxx.user_phone,
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
          that.DredgeMemberOrder();//开通会员下单
        }
      },
      fail: function () {

      }
    })
  },
  //开通会员下单
  DredgeMemberOrder: function () {
    var dredge_data = this.data.dredge_data;
    var prefix = app.globalData.setStorage.prefix;
    var that = this;
    var Pagedata = this.data;
    //  console.log(dredge_data.phone);

    if (typeof (dredge_data.phone) == "undefined") {
      dredge_data.phone = Pagedata.phone;
    }
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
        total_fee: 1, //以分为单位dredge_data.dredge_selected * 100
        spbill_create_ip: '192.168.21.30',
        notify_url: 'https://f.12590.com/SlowDiseaseTreasure/pay.php',
        trade_type: 'JSAPI',
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //console.log(res);
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
        that.setData({
          order_list: order_list,
        })
        that.PayOrder();
        //将订单数据存储到本地（通过链接跳转会造成编码问题）
        // wx.setStorageSync(prefix + "order_list", order_list);
        //跳转到生成订单页面（不关闭）
        //wx.navigateTo({
        //url: '../pay_member/index',
        //});


      },
      fail: function () {
        that.quxiaoyuyue();
      },
      complete: function () {
        that.setData({
          PayDisabled: false,
        })
      },
    });
  },
  //支付订单
  PayOrder: function () {
    var UserData = this.data.UserData;
    var requestPaymentData = this.data.order_list;  //下单成功返回的微信数据数组
    console.log(requestPaymentData);
    var pages = this.data.pages;
    console.log(pages);
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
          console.log(res.errMsg);
          //如果支付成功
          if (res.errMsg == "requestPayment:ok") {
            //UserData.MemberInformation = "会员订户";
            //wx.setStorageSync('UserData', UserData);
            //预约信息插入数据库
            that.insertyuyue();

            /*
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
            */
          }
        },
        'fail': function (res) {
          console.log(res)
          if (res.errMsg == "requestPayment:fail" || res.errMsg == "requestPayment:fail cancel") {
            that.ShowRemind("取消支付");
            that.quxiaoyuyue();
          } else {
            that.ShowRemind("支付失败");
            that.quxiaoyuyue();
          }

        }
      })


  },
  //预约信息插入数据库
  insertyuyue: function () {
    var that = this;
    var dredge_data = this.data.dredge_data;
    var yyxx = this.data.yyxx;
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface_htc.php', //仅为示例，并非真实的接口地址
      data: {
        action: 'querenyuyue',
        PBMXXH: yyxx.PBMXXH,
        PBRQ: yyxx.PBRQ,
        PBRQ_y: yyxx.PBRQ_y,
        WEEKDAY: yyxx.WEEKDAY,
        TIME: yyxx.TIME,
        HX: yyxx.HX,
        family_user_autoid: yyxx.family_user_autoid, //就诊人id
        user_name: yyxx.user_name, //就诊人
        card_type: yyxx.card_type, //证件类型
        card_type_id: yyxx.card_type_id, //证件号
        user_phone: yyxx.user_phone, //手机号
        user_sex: yyxx.user_sex, //性别
        birthday: yyxx.birthday, //性别
        consultation_type: "1",//咨询类型：1、语音咨询；2视频咨询
        out_trade_no: dredge_data.out_trade_no,
        doctor_list_autoid: "1",
        doctor_name: "朱勇",
        open_id: yyxx.open_id,

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.errorNo) {
          that.ShowRemind(res.data.error);
        } else {
          that.quxiaoyuyue();
          that.ShowRemind(res.data.error);
        }

      },
      fail: function () {

      },
      complete: function () {
        that.setData({
          is_first_enter: 1,
        })        
      }
    })
  },
  //取消预约
  quxiaoyuyue: function () {
    var yyxx = this.data.yyxx;
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface_htc.php', //仅为示例，并非真实的接口地址
      data: {
        action: 'quxiaoyuyue',
        PBMXXH: yyxx.PBMXXH,
        HX: yyxx.HX,
        open_id: yyxx.open_id,
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //console.log(res.data);
        //that.ShowRemind(res.data.error);
      },
      fail: function () {

      },
      complete: function () {
        that.setData({
          is_first_enter: 1,
        })
      }
    })
  },
  querenyuyue1:function(){
    var that=this;
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface_htc.php', //仅为示例，并非真实的接口地址
      data: {
        action: 'querenyuyue',
        PBMXXH: that.data.PBMXXH,
        PBRQ: that.data.PBRQ,
        PBRQ_y: that.data.PBRQ_y,
        WEEKDAY: that.data.WEEKDAY,
        TIME: that.data.TIME,
        HX: that.data.HX,
        family_user_autoid:that.data.SeekingPerson.family_user_autoid, //就诊人id
        user_name:that.data.SeekingPerson.seeking_person, //就诊人
        card_type:that.data.SeekingPerson.certificate_type, //证件类型
        card_type_id:that.data.SeekingPerson.certificate_number, //证件号
        user_phone:that.data.SeekingPerson.phone, //手机号
        user_sex: that.data.SeekingPerson.sex, //性别
        birthday: that.data.SeekingPerson.birthday, //出生日期
        consultation_type:"1",//咨询类型：1、语音咨询；2视频咨询

        doctor_list_autoid:"1",
        doctor_name:"朱勇",
        open_id:"oJKz_0FGSgflXEWAq_DigG8D_gg8",

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        that.ShowRemind(res.data.error);
      },
      fail: function (res) {
        console.log(res.data)
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