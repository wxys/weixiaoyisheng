// pages/add_follow/indx.js
// pages/patient_data/index.js
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
   * 页面的初始数据mySelect
   */
  data: {
   

  },
 
  //点击切换
  


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);

    var _this = this;
    wx.request({
      url: publicFun.follow(),
      data: {
        action: 'getmedmes'
      },
      header: {
        'content-type': 'application/json' // 默认值
      }, success: function (res) {
        console.log(res.data);
        _this.setData({
          wenbwn: res.data,
          id: options.id,
          name: options.name
        })
        // firstPerson: res.data[0].name, firstdisease: res.data[0].child[0].name
      }

    })
    
  },
  
    
    //console.log(this.disease);
    
    
     

  //获取宽度
   
  //已选择
 
  
  //疾病确认
  
  
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

  }, loadData: function () {
    var _this = this;
    wx.request({
      url: publicFun.follow(),
      data: {
        action: 'getmedmes'
      },
      header: {
        'content-type': 'application/json' // 默认值
      }, success: function (res) {
        console.log(res.data);
        _this.setData({
          
        })
        // firstPerson: res.data[0].name, firstdisease: res.data[0].child[0].name
      }

    })
   
  }
})