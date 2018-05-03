// pages/hospital/index.js
//获取全局的应用实例
var app = getApp();
//引用公共文件
var common = require('../../../common.js');
// 引入SDK核心类
var QQMapWX = require('../../../libs/qqmap-wx-jssdk.js');
// 实例划API核心类
var demo = new QQMapWX({
  key: 'HJ7BZ-UGBW3-5DV3R-3SZOD-7OKMJ-EDBGI' // 必填
});
Page({
  data: {
    RemindShow: 'none',  //是否出现提示
    RemindText: '',
    RemindTime: '1000',
    PageShow: false,  //是否显示页面
    Collect: false, //用户是否收藏医院
    AttentionDisabled: false,
    CancelAttentionDisabled: false,
    show_doctor:"",
    show_province:"none",
    show_ks: "none",
    show_choose: "none",
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    //console.log(options);
    var that = this;

    var prefix = app.globalData.setStorage.prefix;
    //获取用户id
    var UserData = wx.getStorageSync(prefix + 'UserData');

    var sys = wx.getSystemInfoSync();
    this.setData({
      hospital: options.hospital,
      hospitalId: options.hospitalId,
      ScrollHeight: sys.windowHeight - 36,
      UserData: UserData,
    });




    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    if (options.type) {
      this.setData({
        _type: options.type
      })
    }
    var sys = wx.getSystemInfoSync();

    //获取缓存地区数据
    var province = wx.getStorageSync(prefix + 'province');
    if (!province) {
      // 调用接口 获取省份列表
      demo.getCityList({
        success: function (res) {
          //console.log(res);
        },
        fail: function (res) {
          //console.log(res);
        },
        complete: function (res) {
          //console.log(res);
          that.setData({
            province: res.result[0],
          })
          that.UserLocationSelected();
        }
      });
    } else {
      that.setData({
        province: province,
      })
      that.UserLocationSelected();
    }






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
    var UserData = this.data.UserData;
    //console.log(this.data);
    var Collect = this.data.Collect;
    //console.log(UserData);
    var that = this;
    //获取医院科室
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface.php',
      data: {
        action: 'hospital',
        //hospitalid: this.data.hospitalId,
        hospitalid: 1,
        openid: UserData.openid,
      },
      method: 'GET',
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res);
        if (res.data.Attention == "已收藏") {
          Collect = true;
        }
        that.setData({
          first_hierarchy_id: res.data.FirstHierarchy[0].first_hierarchy_id,
          HospitalLogo: res.data.Logo,
          FirstHierarchy: res.data.FirstHierarchy,
          SecondHierarchy: res.data.SecondHierarchy,
          Collect: Collect,
          PageShow: true,
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
    if (!CancelAttentionDisabled) {
      this.setData({
        CancelAttentionDisabled: true,
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
            CancelAttentionDisabled: false,
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
  //展开第二层级
  ShowSecondHierarchy: function (e) {
    this.setData({
      first_hierarchy_id: e.currentTarget.dataset.id,
      select_province: e.currentTarget.dataset.province,
    });
    //console.log(e);
    this.GetCity(e.currentTarget.dataset.id);

  },
  //选中城市
  SelectedCity: function (e) {
    var select_province = this.data.select_province;
    var select_city = e.currentTarget.dataset.city;
    var UserData = this.data.UserData;
    var _type = this.data._type;
    var prefix = app.globalData.setStorage.prefix;
    //console.log(_type);
    //console.log(select_city);
    if (_type == "select_region") {
      var SelectRegion = {
        city: select_city,
        province: select_province,
      }
      //将用户位置保存储到本地
      wx.setStorage({
        key: "SelectRegion",
        data: SelectRegion,
      });
    } else {
      var Userlocation = {
        condition: '手动选择位置',
        location_city: select_city,
        location_province: select_province,
      }
      UserData.Userlocation = Userlocation;
      //console.log(UserData)
      //将用户位置保存储到本地
      wx.setStorage({
        key: prefix + "UserData",
        data: UserData,
      });
    }

    //返回上一个页面
    wx.navigateBack({
      delta: 1
    })

  },

  //如果有获取到用户位置，则默认打开是用户位置
  UserLocationSelected: function () {
    var UserData = this.data.UserData;
    var province = this.data.province;
    var prefix = app.globalData.setStorage.prefix;
    //console.log(province);
    var that = this;
    if (UserData.hasOwnProperty('Userlocation')) {
      if (UserData.Userlocation.hasOwnProperty('location_province')) {
        for (var i in province) {
          //console.log(province[i].fullname);
          if (province[i].fullname == UserData.Userlocation.location_province) {

            that.setData({
              first_hierarchy_id: province[i].id,
              select_province: province[i].fullname,
            });
            that.GetCity(province[i].id);
          }
        }
      } else {
        that.setData({
          first_hierarchy_id: province[0].id,
          select_province: province[0].fullname,
        });
        that.GetCity(province[0].id);
      }
    } else {
      that.setData({
        first_hierarchy_id: province[0].id,
        select_province: province[0].fullname,
      });
      that.GetCity(province[0].id);
    }
    this.setData({
      PageShow: true,
    })
    wx.setStorage({
      key: prefix + "province",
      data: province,
    });
  },
  //获取省份城市
  GetCity: function (id) {
    var that = this;
    var location_city;//用户定位位置
    var city;//省份城市
    var select_province = this.data.select_province;  //用户选择的省份
    //console.log(select_province);
    // 调用接口
    demo.getDistrictByCityId({
      id: id, // 对应城市ID
      success: function (res) {
        //console.log(res);
      },
      fail: function (res) {
        //console.log(res);
      },
      complete: function (res) {
        //console.log(res);
        var UserData = that.data.UserData;
        //console.log(UserData);
        city = res.result[0];
        if (UserData.hasOwnProperty('Userlocation')) {
          if (UserData.Userlocation.hasOwnProperty('location_city')) {
            location_city = UserData.Userlocation.location_city;
          }
        }
        if (location_city && UserData.Userlocation.condition) {
          for (var x in city) {
            if (location_city == city[x].fullname) {
              if (UserData.Userlocation.condition == "定位位置") {
                city[x].name = city[x].name + "（自动定位）";
              } else {
                city[x].name = city[x].name + "（当前地区）";
              }
            }
          }
        } else {

        }
        that.setData({
          city: city,
        });

      }
    });
  },
  show_ks: function () {
    var that=this;
    if (that.data.show_ks == '') {
      that.show_doctor();
      return;
    }
    that.setData({
      province_color: "black",
      choose_color: "black",
      ks_color:"#77c197",
      show_doctor: "none",
      show_province: "none",
      show_ks: "",
      show_choose: "none",
    })
  },
  show_province: function () {
    var that = this;
    //console.log(that);
    if (that.data.show_province == '') {
      that.show_doctor();
      return;
    }
    that.setData({
      ks_color: "black",
      choose_color: "black",
      province_color: "#77c197",
      show_doctor: "none",
      show_province: "",
      show_ks: "none",
      show_choose: "none",
    })
  },
  show_choose: function () {
    var that = this;
    //console.log(that);
    if (that.data.show_choose == '') {
      that.show_doctor();
      return;
    }
    that.setData({
      ks_color: "black",
      province_color: "black",
      choose_color: "#77c197",
      show_doctor: "none",
      show_province: "none",
      show_ks: "none",
      show_choose: "",
    })
  },
  show_doctor: function () {
    var that = this;
    that.setData({
      ks_color: "black",
      province_color: "black",
      choose_color: "black",
      show_doctor: "",
      show_province: "none",
      show_ks: "none",
      show_choose: "none",
    })
  }
})