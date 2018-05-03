//  pages/medical_examination_report/index.js
//引用公共文件 
var common = require('../../common.js');
//var WxParse = require('../../wxParse/wxParse.js');
//获取全局的应用实例
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isxialaleft: 0,
    isxialaright: 0,
    xialaleftshow: 0,
    xialarightshow: 0,
    contentList:1,
    
    ksjc:'',
    zs:'',
    jy: '',
    familyname1: '',
    examineDate1: '',
    familyname: '',
    examineDate: '',
    isnull:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      loading:true
    })
    var that=this;
    var UserData = wx.getStorageSync(app.globalData.setStorage.prefix + 'UserData');
    console.log(UserData.openid);
    wx.request({
      url: 'https://f.12590.com/medication/index.php',
      data: {
        action: 'getTjbg1',
        phone: UserData.phone,
        openid: UserData.openid,
      },
      method: 'GET',
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res.data);
        if (res.data.isnull){
          that.setData({
            isnull: 1, loading: false
          })
        }else{
          that.setData({
           
            familyname1: res.data.family[0].cumname,
            examineDate1: res.data.TJtime[0].examineDate,
            familyname: res.data.family,
            examineDate: res.data.TJtime, 
            ksjc: res.data.TJBG.rs,
            zs: res.data.TJBG.zs,
            jy: res.data.TJBG.jy,
            loading:false
          })
        }
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
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
  
  },
  clickTopSelectLeft: function () {
    var that = this;
    console.log(that);
    if (that.data.isxialaleft) {
      that.setData({
        isxialaleft: 0,
        xialaleftshow: 0
      })
    } else {
      that.setData({
        isxialaleft: 1,
        xialaleftshow: 1,
        isxialaright: 0,
        xialarightshow: 0
      })
    }
  },
  clickTopSelectRight: function () {
    var that = this;
    //console.log(that);
    if (that.data.isxialaright) {
      that.setData({
        isxialaright: 0,
        xialarightshow: 0
      })
    } else {
      that.setData({
        isxialaright: 1,
        xialarightshow: 1,
        isxialaleft: 0,
        xialaleftshow: 0
      })
    }
  },
  topSelectShouqi: function () {
    var that = this;
    that.setData({
      xialaleftshow: 0,
      xialarightshow: 0,
      isxialaleft: 0,
      isxialaright: 0
    })
  },
  clickContentListButton:function(e){
    //console.log(e);
    var that=this;
    if (that.data.contentList==e.target.dataset.buttonnum){

    }else{
      that.setData({
        contentList: e.target.dataset.buttonnum
      })
    }
  },
  selectName:function(e){
    var that = this;
    var UserData = wx.getStorageSync(app.globalData.setStorage.prefix + 'UserData');
    //console.log(e);
    wx.request({
      url: 'https://f.12590.com/medication/index.php',
      data: {
        action: 'getTjbg1',
        phone: UserData.phone,
        openid: UserData.openid,
        name: e.currentTarget.dataset.name,
        sex: e.currentTarget.dataset.sex,
        lsh: e.currentTarget.dataset.lsh
      },
      method: 'GET',
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res.data);
        //console.log(res.data.TJtime);
        //return false;
        that.setData({
          familyname1: e.currentTarget.dataset.name,
          examineDate1: res.data.TJtime[0].examineDate,
          examineDate: res.data.TJtime,
          ksjc: res.data.TJBG.rs,
          zs: res.data.TJBG.zs,
          jy: res.data.TJBG.jy
        })
        that.topSelectShouqi();
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    });
  },
  selectTime: function (e) {
    var that = this;
    var UserData = wx.getStorageSync(app.globalData.setStorage.prefix + 'UserData');
    //console.log(e);
    that.setData({
      examineDate1: e.currentTarget.dataset.examinedate,
    })
    wx.request({
      url: 'https://f.12590.com/medication/index.php',
      data: {
        action: 'getTjbg1',
        openid: UserData.openid,
        sex: e.currentTarget.dataset.sex,
        lsh: e.currentTarget.dataset.lsh
      },
      method: 'GET',
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res.data);
        that.setData({
          examineDate1: e.currentTarget.dataset.examineDate,
          ksjc: res.data.TJBG.rs,
          zs: res.data.TJBG.zs, 
          jy: res.data.TJBG.jy
        })
        that.topSelectShouqi();
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    });
  }
})