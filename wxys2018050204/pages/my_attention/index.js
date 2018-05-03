// pages/my_attention/index.js
//引入co函数支持
const Promise = global.Promise = require('../../libs/es6-promise')
const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
var app = getApp(); //获取全局的应用实例
//引用公共文件
var common = require('../../common.js');
var Config = require('../../config.js');
//引入图片预加载组件
const ImgLoader = require('../../img-loader/img-loader.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    UserData: {},
    ImgLoadNum: 1, //图片加载次数
    RemindShow: 'none',  //是否出现提示
    RemindText: '',
    RemindTime: '1000',
    IfRemoveAttentionDoctor: false,
    IfRemoveAttentionDepartments: false,
    IfRemoveAttentionHospital: false,
    IsFinishRemove: true,
    PageShow: false,
    AttentionDepartmentsScrollHeight: 120,
    AcceptLogin: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var pages_object = getCurrentPages();//获取当前页面栈
    this.setData({
      pages: pages_object.length,//页面栈数
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
    // 页面显示
    var that = this;
    //获取用户id
    var UserData = wx.getStorageSync(app.globalData.setStorage.prefix + 'UserData')
    console.log(UserData);
    if (UserData) {
      that.setData({
        UserData: UserData,
      })
      that.LoadData();  //载入数据
    } else {
      co(function* () {
        var result = yield common.GetUserId();
        UserData = result.data;
        that.setData({
          UserData: UserData,
        })
        that.LoadData();  //载入数据
      });

    }
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
  LoadData: function () {
    var that = this;
    var UserData = this.data.UserData;
    var ImgLoadNum = this.data.ImgLoadNum;  //图片加载次数
    //获取科室及医院列表。
    wx.request({
      url: Config.inter(),
      data: {
        action: 'collect_erke',
        phone: UserData.phone,
        openid: UserData.openid,
      },
      method: 'GET',
      success: function (res) {
        console.log(res);
        //console.log(1111111111111111);
        if (ImgLoadNum == 1) {
          //设置图片预加载效果
       
          var AttentionHospitalList = common.genImgData(res.data.UserAttentionData.attention_hospital);//关注医院列表
          var AttentionDepartmentsList = common.genImgData(res.data.UserAttentionData.attention_departments);//关注科室列表
        } else {
         
          var AttentionHospitalList = common.LoadedImgData(res.data.UserAttentionData.attention_hospital);//关注医院列表
          var AttentionDepartmentsList = common.LoadedImgData(res.data.UserAttentionData.attention_departments);//关注科室列表

        }


        that.setData({
          AttentionHospitalList: AttentionHospitalList,
          AttentionDepartmentsList: AttentionDepartmentsList,
          UserAttentionData: res.data.UserAttentionData,
          PageShow: true,
        });
        // console.log("cccc");
        //初始化图片预加载组件，并指定统一的加载完成回调

        //图片预加载
        that.imgLoader = new ImgLoader(that, that.ImageOnLoad.bind(that))
        
      
        that.LoadImages(AttentionHospitalList);
        that.LoadImages(AttentionDepartmentsList);
        //记录图片加载次数
        ImgLoadNum = ImgLoadNum + 1;
        that.setData({
          ImgLoadNum: ImgLoadNum,
        })

      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete

      }
    });
  },
  stopfw:function (){
    var that = this;
    that.ShowRemind("本服务暂未开通");
  },
  
  //取消关注
  delItem: function (e) {
    //console.log(e);
    var that = this;
    var UserData = this.data.UserData;
    var IsFinishRemove = this.data.IsFinishRemove;
    //console.log(IsFinishRemove);
    if (IsFinishRemove) {
      this.setData({
        IsFinishRemove: false,
      })
      wx.request({
        url: Config.inter(),
        data: {
          action: 'CancelCollect',
          openid: UserData.openid,
          hospitalid: e.target.dataset.hospital_id,
          classid: e.target.dataset.departments_id,
          doctorid: e.target.dataset.doctor_id,
          collecttype: e.target.dataset.type,
        },
        method: 'GET',
        // header: {}, // 设置请求的 header
        success: function (res) {
          //console.log(res);
          if (res.data.result == "1") {
            that.ShowRemind("成功取消关注");
            /*
            that.setData({
              IfRemoveAttentionDoctor: false, IfRemoveAttentionDepartments: false,
              IfRemoveAttentionHospital: false,
              AttentionDepartmentsScrollHeight: 120,
              
            })
            */
          } else {
            that.ShowRemind("取消关注失败");
          }

        },
        fail: function (res) {
          // fail
        },
        complete: function (res) {
          // complete
          that.onShow();
          that.setData({
            IsFinishRemove: true,
          })
        }
      });
    }


  },
  //点击我的关注医生管理
  DelteAttentionDoctor: function () {
    this.setData({
      IfRemoveAttentionDepartments: false,
      IfRemoveAttentionHospital: false,
      AttentionDepartmentsScrollHeight: 120,
    })
    var IfRemoveAttentionDoctor = this.data.IfRemoveAttentionDoctor;
    if (IfRemoveAttentionDoctor) {
      this.setData({
        IfRemoveAttentionDoctor: false,
      })

    } else {
      this.setData({
        IfRemoveAttentionDoctor: true,
      })
    }

  },
  //点击我的关注科室管理
  DelteAttentionDepartments: function () {
    this.setData({
      IfRemoveAttentionDoctor: false,
      IfRemoveAttentionHospital: false,
    })
    var IfRemoveAttentionDepartments = this.data.IfRemoveAttentionDepartments;
    if (IfRemoveAttentionDepartments) {
      this.setData({
        AttentionDepartmentsScrollHeight: 120,
        IfRemoveAttentionDepartments: false,
      })

    } else {
      this.setData({
        AttentionDepartmentsScrollHeight: 148,
        IfRemoveAttentionDepartments: true,
      })
    }

  },

  //点击我的关注医院管理
  DelteAttentionHospital: function () {
    this.setData({
      IfRemoveAttentionDoctor: false,
      IfRemoveAttentionDepartments: false,
      AttentionDepartmentsScrollHeight: 120,
    })
    var IfRemoveAttentionHospital = this.data.IfRemoveAttentionHospital;
    if (IfRemoveAttentionHospital) {
      this.setData({
        IfRemoveAttentionHospital: false,
      })

    } else {
      this.setData({
        IfRemoveAttentionHospital: true,
      })
    }

  },
  /*
    图片加载回调
  */
  //加载图片
  LoadImages(arr) {
    console.log(arr);
    var that = this;
    //同时发起全部图片的加载
    if (arr) {
      arr.forEach(item => {
        //console.log(that.imgLoader.load);
        that.imgLoader.load(item.url);
      })
    }

  },
  //加载完成后的回调
  ImageOnLoad(err, data) {

    if (this.data.AttentionHospitalList) {
      const AttentionHospitalList = this.data.AttentionHospitalList.map(item => {
        if (item.url == data.src) {
          item.loaded = true
        }
        return item
      })
      this.setData({

        AttentionHospitalList,
      })
    }
  
    if (this.data.AttentionDepartmentsList) {
      const AttentionDepartmentsList = this.data.AttentionDepartmentsList.map(item => {

        if (item.url == data.src) {
          item.loaded = true
        }
        return item
      })
      this.setData({

        AttentionDepartmentsList,
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
  //跳转页面
  SkipPage: function (e) {
    var pages = this.data.pages;
    common.ToPages(pages, e.currentTarget.dataset.url);
  },
})