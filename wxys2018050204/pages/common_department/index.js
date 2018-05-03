// pages/common_department/index.js
//获取全局的应用实例
var app = getApp();
//引用公共文件
var common = require('../../common.js');
//引入co函数支持
const Promise = global.Promise = require('../../libs/es6-promise')
const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')	
Page({
  data:{
    UserData:{},
    limit_start:0,
    limit_num:3,
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var data=this.data;
 
    this.setData({
      common_departments_id: options.common_departments_id,
      common_departments_name: options.common_departments_name,
    })
    //动态设置常见科室标题
    wx.setNavigationBarTitle({
      title: options.common_departments_name
    })
    var page_data=this.data.page_data;
    var that=this;
    
    //获取用户id
    var UserData = wx.getStorageSync(app.globalData.setStorage.prefix + 'UserData');
    if (UserData) {
      that.setData({
        UserData: UserData,
      })
      that.LoadData();
    } else {
      co(function* () {
        result = yield common.GetUserId();
        UserData = result.data;
        that.setData({
          UserData: UserData,
        })

      });
      that.LoadData();
    }
   
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  LoadData:function(){
    var that=this;
    var data=this.data;
    //获取常见科室页面数据
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface.php',
      data: {
        action: 'DepartmentsToDoctor',
        classid: data.common_departments_id,
        limit_start: data.limit_start,
        limit_num: data.limit_num,

      },
      method: 'GET',
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res);
        that.setData({
          page_data: res.data,
          
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
  //跳转页面
  SkipPage: function (e) {
    common.NavigateTo(e.currentTarget.dataset.url);

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var data = this.data;
    return {
      title: data.common_departments_name,
      path: 'pages/common_department/index?common_departments_name=' + data.common_departments_name + "&common_departments_id=" + data.common_departments_id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})