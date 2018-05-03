// pages/select_region/index.js
//获取全局的应用实例
var app = getApp();
//引用公共文件
var common = require('../../common.js');
// 引入SDK核心类
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
// 实例划API核心类
var demo = new QQMapWX({
  key: 'HJ7BZ-UGBW3-5DV3R-3SZOD-7OKMJ-EDBGI' // 必填
});
Page({
  data: {
    PageShow:false,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    if(options.type){
      this.setData({
        _type:options.type
      })
    }
    var prefix = app.globalData.setStorage.prefix;
    //获取用户id
    var UserData = wx.getStorageSync(prefix + 'UserData');
    var sys=wx.getSystemInfoSync();
    this.setData({
      UserData: UserData,
      ScrollHeight:sys.windowHeight,
    })
  
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
    var _type=this.data._type;
    var prefix = app.globalData.setStorage.prefix;
    //console.log(_type);
    //console.log(select_city);
    if(_type=="select_region"){
      var SelectRegion = {
        city: select_city,
        province: select_province,
      }
      //将用户位置保存储到本地
      wx.setStorage({
        key: "SelectRegion",
        data: SelectRegion,
      });
    }else{
      var Userlocation = {
        condition: '手动选择位置',
        location_city: select_city,
        location_province: select_province,
      }
      UserData.Userlocation = Userlocation;
      //console.log(UserData)
      //将用户位置保存储到本地
      wx.setStorage({
        key: prefix+"UserData",
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
    var province=this.data.province;
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
      PageShow:true,
    })
    wx.setStorage({
      key: prefix+"province",
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
        if (location_city && UserData.Userlocation.condition ) {
          for (var x in city) {
            if (location_city == city[x].fullname) {
              if (UserData.Userlocation.condition == "定位位置") {
                city[x].name = city[x].name + "（自动定位）";
              }else{
                city[x].name = city[x].name + "（当前地区）";
              }
            }
          }
        }else{

        }
        that.setData({
          city: city,
        });

      }
    });
  },
})