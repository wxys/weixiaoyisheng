// pages/index/index.js
//引入co函数支持
const Promise = global.Promise = require('../../libs/es6-promise')
const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
var app = getApp(); //获取全局的应用实例
//引用公共文件
var common = require('../../common.js');
// 引入SDK核心类
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
// 实例划API核心类
var demo = new QQMapWX({
  key: 'HJ7BZ-UGBW3-5DV3R-3SZOD-7OKMJ-EDBGI' // 必填
});

var Config = require('../../config.js');
//引入图片预加载组件
const ImgLoader = require('../../img-loader/img-loader.js')

Page({
  data: {
    movies: [{ url: 'https://h5.12590.com//SlowDiseaseTreasure/icon/banner_01.png',thing:'showspkt' }, 
      { url: 'https://h5.12590.com/SlowDiseaseTreasure/icon/banner_03.png', thing: 'showspkt'  }] ,
    UserData: {},
    ImgLoadNum: 1, //图片加载次数
    RemindShow: 'none',  //是否出现提示
    RemindText: '',
    RemindTime: '1000',
    ShowIndexDefault: true,  //默认显示标准首页
    PageShow: false,
    AcceptLogin: true,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var pages_object = getCurrentPages();//获取当前页面栈
    this.setData({
      pages: pages_object.length,//页面栈数
    });
  },
  showspkt:function()
  {
    wx.navigateTo({
      url: '../banner_h5/index',
    })

  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    var that = this;
    //获取用户id
    var UserData = wx.getStorageSync(app.globalData.setStorage.prefix + 'UserData')
    if (UserData) {
      that.setData({
        UserData: UserData,
      })
      that.CheckIdentity();  //验证用户身份
    } else {
      co(function* () {
        var result = yield common.GetUserId();
        UserData = result.data;
        that.setData({
          UserData: UserData,
        })
        that.CheckIdentity();  //验证用户身份
      });





    }

  },

  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  CheckIdentity:function(){
    var UserData = this.data.UserData;
    var that=this;
    var prefix = app.globalData.setStorage.prefix;
    co(function* () {
     var result = yield common.CheckVipMemberByUserId();
      var res = result.data;
      console.log(res);
      UserData.MemberInformation = res.data.member_information;
      UserData.memberinformation = res.data.member_information;
      UserData.expiration_time = res.data.expiration_time;
   
        UserData.phone = res.data.member_phone;
        //将用户数据存储到本地
        wx.setStorageSync(prefix + 'UserData', UserData);
        console.log(wx.getStorageSync(app.globalData.setStorage.prefix + 'UserData'));
        that.LoadData();
 
    });
  },

  LoadData: function () {
    var that = this;
    var UserData = this.data.UserData;
    var ImgLoadNum = this.data.ImgLoadNum;  //图片加载次数
    var Userlocation = UserData.Userlocation; //用户归属地数据
    var city;
    if (Userlocation) {
      city = Userlocation.city;
    }
    //获取科室及医院列表
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface.php',
      data: {
        action: 'subscribe_erke',
        phone: UserData.phone,
        openid: UserData.openid,
        Userlocation: Userlocation,
      },
      method: 'GET',
      success: function (res) {
       // console.log(res);
        Userlocation = res.data.Userlocation;
        if (!UserData.Userlocation) {
          if (Userlocation) {

          } else {
            //调用微信API获取位置
            //that.GetLocation();
          }
        }

        if (ImgLoadNum == 1) {
          //设置图片预加载效果
          var DepartmentsList = common.genImgData(res.data.Departments);//首页推荐分类科室
          var HospitalList = common.genImgData(res.data.Hospital);//热门医院列表
          
        } else {
          var DepartmentsList = common.LoadedImgData(res.data.Departments);//首页推荐分类科室
          var HospitalList = common.LoadedImgData(res.data.Hospital);//热门医院列表


        }

        
        that.setData({
          Departments: res.data.Departments,
          Hospital: res.data.Hospital,
          DepartmentsList: DepartmentsList,
          HospitalList: HospitalList,
          
          PageShow: true,
        });
       // console.log("cccc");
        //初始化图片预加载组件，并指定统一的加载完成回调

        //图片预加载
        that.imgLoader = new ImgLoader(that, that.ImageOnLoad.bind(that))
        //console.log(that);
        that.LoadImages(DepartmentsList);
        that.LoadImages(HospitalList);
       
        //记录图片加载次数
        ImgLoadNum = ImgLoadNum + 1;
        that.setData({
          ImgLoadNum: ImgLoadNum,
        })
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading() //完成停止加载
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete

      }
    });
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.onShow();
  },
  //首页切换为专家名片
  ShowIndexProfessor: function () {
    this.setData({
      ShowIndexDefault: false,
    })
  },
  //首页切换为默认
  ShowIndexDefault: function () {
    this.setData({
      ShowIndexDefault: true,
    })
  },
  /*
    图片加载回调
  */
  //加载图片
  LoadImages(arr) {
    //console.log(arr);
    var that = this;
    //同时发起全部图片的加载
    if (arr) {
      arr.forEach(item => {
        //console.log(item.url);
        this.imgLoader.load(item.url)
      })
    }

  },
  //加载完成后的回调
  ImageOnLoad(err, data) {
    //console.log('图片加载完成', err, data.src)
    const DepartmentsList = this.data.DepartmentsList.map(item => {
      if (item.url == data.src) {
        item.loaded = true
      }
      return item
    })
    const HospitalList = this.data.HospitalList.map(item => {
      if (item.url == data.src) {
        item.loaded = true
      }
      return item
    })
    this.setData({
      DepartmentsList,
      HospitalList,

    })

    


  },
  SetFInish: function (result, data) {

  },
  //获取归属地
  GetLocation: function () {
    var latitude; //纬度
    var longitude; //经度
    var that = this;
    var UserData = that.data.UserData;//本地存储用户数据      
    var condition;  //获取位置情况
    var location_province;  //获取位置省份
    var location_city;  //获取位置城市
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res);
        latitude = res.latitude;
        longitude = res.longitude;  //经度
      },
      complete: function () {
        if (latitude) {
          // 调用接口
          demo.reverseGeocoder({
            location: {
              latitude: latitude,
              longitude: longitude,
            },
            success: function (res) {
              //console.log(res);
            },
            fail: function (res) {
              //console.log(res);
            },
            complete: function (res) {
              //console.log(res);
              condition = "定位位置";
              location_province = res.result.address_component.province;
              location_city = res.result.address_component.city;
              //要增加的数组
              var Userlocation = {
                condition: condition,
                location_city: location_city,
                location_province: location_province,
              };
              UserData.Userlocation = Userlocation;
              //将用户位置保存储到本地
              wx.setStorage({
                key: "UserData",
                data: UserData,
                complete: function () {
                  that.LoadData();//刷新页面数据
                }
              });

              that.setData({
                UserData: UserData,
              });
            }
          });
        }
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
  //分享
  onShareAppMessage: function () {
    return {
      title: '微笑医生',
      path: 'pages/index/index',
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },



  //跳转页面
  SkipPage: function (e) {
    var pages = this.data.pages;
    common.ToPages(pages, e.currentTarget.dataset.url);
  },
})

