// pages/hospital/index.js
//获取全局的应用实例
var app = getApp();
//引用公共文件
var common = require('../../common.js');
Page({
  data: {
    RemindShow: 'none',  //是否出现提示
    RemindText: '',
    RemindTime: '1000',
    PageShow: false,  //是否显示页面
    Collect: false, //用户是否收藏医院
    AttentionDisabled: false,
    CancelAttentionDisabled: false,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options);
    var that = this;
    //动态设置页面标题
    wx.setNavigationBarTitle({
      title: options.hospital,
    });

    var prefix = app.globalData.setStorage.prefix;
    //获取用户id
    var UserData = wx.getStorageSync(prefix + 'UserData');
  
    var sys =wx.getSystemInfoSync();
    this.setData({
      hospital: options.hospital,
      hospitalId: options.hospitalId,
      ScrollHeight: sys.windowHeight-159,
      UserData: UserData,
      first_hierarchy_id: options.deparentmentId
    });

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
  LoadData:function(){
    var UserData = this.data.UserData;
    var Collect = this.data.Collect;
    //console.log(UserData);
    var that = this;
    //获取医院科室
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface.php',
      data: {
        action: 'hospital',
        hospitalid: this.data.hospitalId,
        openid: UserData.openid,
      },
      method: 'GET',
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res);
        if (res.data.Attention=="已收藏"){
          Collect=true;
        }
        console.log(that.data.first_hierarchy_id);
        if (that.data.first_hierarchy_id == '' || that.data.first_hierarchy_id == undefined || that.data.first_hierarchy_id == null)
        {
          that.setData({ first_hierarchy_id:res.data.FirstHierarchy[0].first_hierarchy_id})
        }
        that.setData({
         
          HospitalLogo: res.data.Logo,
          FirstHierarchy: res.data.FirstHierarchy,
          SecondHierarchy: res.data.SecondHierarchy,
          Collect: Collect,
          PageShow:true,
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
  //展开第二层级
  ShowSecondHierarchy: function (e) {
    //console.log(e);
    this.setData({
      first_hierarchy_id: e.currentTarget.dataset.id,
      li_top: e.currentTarget.dataset.top,
    });
  },

  //收藏医院
  CollectHospital: function () {
    var me = this;
    var AttentionDisabled = this.data.AttentionDisabled;//防止重复点击
    if (!AttentionDisabled) {
      this.setData({
        AttentionDisabled: true,
      })
      wx.request({
        url: 'https://f.12590.com/SlowDiseaseTreasure/interface.php',
        data: {
          action: 'Collect',
          openid: me.data.UserData.openid,
          hospitalid: me.data.hospitalId,
          collecttype: 1
        },
        method: 'GET',
        // header: {}, // 设置请求的 header
        success: function (res) {
          //console.log(res)
          me.ShowRemind(res.data.msg);
          if (res.data.result != 1) {
            return;
          }
          me.setData({
            Collect: true,
          })
        },
        fail: function (res) {
          // fail
        },
        complete: function (res) {
          // complete
          me.setData({
            AttentionDisabled: false,
          })
        }
      })
    }
   

  },

  //取消收藏医院
  CancelCollectHospital: function () {
    var me = this;
    var CancelAttentionDisabled = this.data.CancelAttentionDisabled;//防止重复点击
    if (!CancelAttentionDisabled){
      this.setData({
        CancelAttentionDisabled:true,
      })
      wx.request({
        url: 'https://f.12590.com/SlowDiseaseTreasure/interface.php',
        data: {
          action: 'CancelCollect',
          openid: me.data.UserData.openid,
          hospitalid: me.data.hospitalId,
          collecttype: 1
        },
        method: 'GET',
        // header: {}, // 设置请求的 header
        success: function (res) {
          //console.log(res)
          me.ShowRemind(res.data.msg);
          if (res.data.result != 1) {
            return
          }
          me.setData({
            Collect: false,
          })
        },
        fail: function (res) {
          // fail
        },
        complete: function (res) {
          // complete
          me.setData({
            CancelAttentionDisabled:false,
          })
        }
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