// pages/Follow_report/index.js
// pages/my_attention/index.js
//引入co函数支持
const Promise = global.Promise = require('../../libs/es6-promise')
const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
var app = getApp(); //获取全局的应用实例
//引用公共文件
var common = require('../../common.js');
var publicFun = require('../../config.js');
//引入图片预加载组件
const ImgLoader = require('../../img-loader/img-loader.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name_arr:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    //获取本地的存储
var _this=this;
   var UserData = wx.getStorageSync(app.globalData.setStorage.prefix + 'UserData');
    console.log(UserData);
    wx.request({
      url: publicFun.req_link(),
      data:{
        'openid': UserData.openid,
        'action':'getReport'
      } ,
      header: {
        'Content-Type': 'application/json'
      },
    
      success: function(res) {
      var res_data=res.data;
      if (res_data.state==0)
     {

      }
       else if (res_data.state == 1)
      {
         //获取用户的随访记录
         //用户  、日期 、    两个分类
         var name_arr=[];
         var time_arr=[];
         console.log(res_data);
         for(var i=0;i<res_data.date.length;i++)
        {
        if(i==0)
        {
          name_arr.push(res_data.date[i].name);
          time_arr.push(res_data.date[i].create_time.substring(0, 10));
        }else
        {
          for (var j=0;j<name_arr.length;j++)
          {
            if (res_data.date[i].name==name_arr[j])
            {
              break;
            }
          }
          if(j>=name_arr.length)
          {
            name_arr.push(res_data.date[i].name);
          }


          for (var j = 0; j < time_arr.length; j++) {
            if (res_data.date[i].create_time.substring(0, 10) == time_arr[j]) {
              break;
            }
          }
          console.log(time_arr.length);
          console.log(j);     
          if (j >= time_arr.length) {
            time_arr.push(res_data.date[i].create_time.substring(0, 10));
          }

        }

        }
         _this.setData({
           name_arr:name_arr,
           time_arr:time_arr
         })
         console.log(name_arr);
         console.log(time_arr);
      }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
   //拿着用户的openid 去查询
   //获取全家人的家庭随访报告

  
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
  
  }
})