// pages/reservation_record/index.js
//获取全局的应用实例
var app = getApp();
//引用公共文件
var common = require('../../common.js');
Page({
  data: {
    UserData: {},
    doctor_data:{},
    PageShow:false,
    IndexShow: '', //显示患者列表
    RecentSearchShow: 'none',  //显示最近搜索
    SearchResultShow: 'none',  //显示搜索结果
    focus: false,
    default_show:0,
    top_1: "background: #169bd5; color: white;",
    top_2: "border: 1px solid black;",
    show_weikaishi:"",
    show_yijieshu:"none",
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var pages_object = getCurrentPages();//获取当前页面栈
    var sys = wx.getSystemInfoSync();
    var doctor_data = {
  "doctor_cover":"http://smsy.12581258.com/SlowDiseaseTreasure/icon/doctor.png",
      "doctor_name": "朱勇",
      "doctor_position": "西岸门诊",
      "doctor_departments": "全科医生",    
    };
    var prefix = app.globalData.setStorage.prefix;
    //获取用户id
    var UserData = wx.getStorageSync(prefix + 'UserData');
    this.setData({
      UserData: UserData,
      doctor_data: doctor_data,
      pages: pages_object.length,//页面栈数
      PageScrollHeight:sys.windowHeight-40,
      ScrollHeight: sys.windowHeight - 100,
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    var that = this;
    var prefix = app.globalData.setStorage.prefix;
    //获取用户id
    var patient_search = wx.getStorageSync(prefix + 'patient_search');
    this.setData({
      patient_search: patient_search,
    })
    this.LoadData();
    
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  //页面载入数据
  LoadData: function () {
    var that = this;
    var UserData = this.data.UserData;
    
    //console.log(UserData);
    //获患者列表
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface_ysc.php',
      data: {
        action: 'patient_data',
        userid: UserData.openid,
        
      },
      method: 'GET',
      success: function (res) {
        //console.log(res);
        that.setData({
          patient_data: res.data.patient_data,
          PageShow:true,
        })
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    });
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface_htc.php', //仅为示例，并非真实的接口地址
      data: {
        action: 'online_consultation_order_list1',
        doctor_list_autoid: '1'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //console.log(res.data)
        //console.log(res.data.data1)
        //onsole.log(res.data.data2)
        that.setData({
          weikaishi: res.data.data1,
          yijieshu: res.data.data2,
        })
      }
    })
  },
  showyijieshu: function () {
    var that = this;
    that.setData({
      show_weikaishi: "none",
      show_yijieshu: "",
      top_1: "border: 1px solid black;",
      top_2: "background: #169bd5; color: white;",
    })
  },
  showweikaishi: function () {
    var that = this;
    that.setData({
      show_weikaishi: "",
      show_yijieshu: "none",
      top_1: "background: #169bd5; color: white;",
      top_2: "border: 1px solid black;",
    })
  }

})