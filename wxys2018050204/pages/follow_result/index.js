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
   * 页面的初始数据
   */
  data: {
    loading: true,
    disease:'',
    time: '',
    diseaseid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options.diseaseid);
    var _this = this;
    this.setData({
      disease: options.disease,
      time: options.time,
      diseaseid: options.id
    })
    wx.request({
      url: publicFun.follow(),
      data: {
        action: 'followlist',
        diseaseid: options.id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        _this.setData({
          followlist: res.data,

        })
        
      }

    })

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
    this.loadData()
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
  , loadData: function () {
    
  }
})