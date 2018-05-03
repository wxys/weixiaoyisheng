// pages/my_member/index.js
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
    UserData: {},
    dredge_selected: 60,
    dredge_type: '年度黄金会员',
    ShowPayMember: false,
    PageShow: false,
    PayDisabled: false,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数

  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function (options) {
    //console.log(options);
    var that = this;

    //获取用户id
    var UserData = wx.getStorageSync(app.globalData.setStorage.prefix + 'UserData');
    if (UserData) {
      that.setData({
        UserData: UserData,
      })
      that.LoadData();
    } else {
      co(function* () {
       var result = yield common.GetUserId();
        UserData = result.data;
        that.setData({
          UserData: UserData,
          
        })
        that.LoadData();
      });

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
    this.onLoad();
  },
  LoadData: function () {
    var that = this;
    var UserData = that.data.UserData;
    var UserMember, split;
    var prefix = app.globalData.setStorage.prefix;  //缓存存储前缀
    co(function* () {
     var result = yield common.CheckVipMemberByPhone(UserData.phone);
      var res = result.data;
      console.log(res);
      var UserMember={
        duration_day: res.data.duration_day,
        expiration_time: res.data.expiration_time,
      };
    
      that.setData({
        UserMember: UserMember,
        PageShow: true,
      })
    });
  },
  //续费会员
  RenewMember: function () {
    this.setData({
      ShowPayMember: true,
    });
  },
  //放弃续费会员
  CancelRenewMember: function () {
    this.setData({
      ShowPayMember: false,
    });
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
    var program_parameter = app.globalData.program_parameter; //获取小程序配置数据
    var that = this;
    var UserData = this.data.UserData;
    var prefix = app.globalData.setStorage.prefix;
    var time = (new Date()).valueOf();
    //下单时间
    var order_time = this.getNowFormatDate();
    //生成商户订单号
    var _timestamp = Math.floor(time / 1000);
    var out_trade_no = _timestamp + this.MathRand(6);
    //商品名称
    var dredge_type = e.target.dataset.type;
    var body = '微笑医生-' + dredge_type + '-开通';
    var dredge_selected = e.target.dataset.cost;  //应付金额
    //console.log(body);
    wx.request({
      url: 'https://xksp.95105951.com/SlowDiseaseTreasure/interface.php', //仅为示例，并非真实的接口地址
      data: {
        action: 'PlaceOrder',
        appid: program_parameter.appid,
        phone: UserData.phone,
        api_key: program_parameter.api_key,
        openid: UserData.openid,
        mch_id: program_parameter.mch_id,
        body: body,  //商品名称
        out_trade_no: out_trade_no, //商户订单号
        total_fee: dredge_selected * 100, //以分为单位
        spbill_create_ip: '192.168.21.30',
        notify_url: 'https://xksp.95105951.com/SlowDiseaseTreasure/pay.php',
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
          order_name: body,
          order_no: out_trade_no,
          order_time: order_time,
          order_member_type: dredge_type,
          order_price: dredge_selected,
        };
        //console.log(order_list);
        //将订单数据存储到本地（通过链接跳转会造成编码问题）
        wx.setStorageSync(prefix + "order_list", order_list);

        //跳转到生成订单页面（不关闭）
        wx.navigateTo({
          url: '../pay_member/index',
        });

      },
      complete: function () {

      },
    });
  },

  MathRand: function (length) {
    var Num = "";
    for (var i = 0; i < length; i++) {
      Num += Math.floor(Math.random() * 10);
    }
    return Num;
  },
  //获取当前的日期时间 格式“yyyy-MM-dd HH:MM:SS”
  getNowFormatDate: function () {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
      + " " + date.getHours() + seperator2 + date.getMinutes()
      + seperator2 + date.getSeconds();
    return currentdate;
  }
})
