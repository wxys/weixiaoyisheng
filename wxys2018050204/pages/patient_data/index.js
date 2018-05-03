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
    loading:true,
    imageshanchu:0,
    deletejilu:"删除记录",
    isshow:1,
    isshowjiben:0,
    jiwangshi:0,
    _num:1,
    imagenone: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  console.log(options);
  var _this = this;
  wx.getSystemInfo({
    success: function (res) {
      console.log(res.windowHeight);
      _this.setData({
        height: res.windowHeight * 2
      })


    }
  })
  },
  changepro:function(e){
    var id = e.target.dataset.id;
    console.log(id);
    this.setData({
      
      _num: id,
      imagenone:id
    })
    var eid = e.target.dataset.panduan;
  
      this.setData({
        isshow: eid,
        isshowjiben: eid,
        jiwangshi: eid,
        binglishi: eid,
        fuzhujiancha: eid,
        yongyao: eid,
        yizhu: eid,
        tijian: eid,
        isshowtixing:eid
      })
   
    
  },
  shanchujulu:function(e){
    var imageshanchu = this.data.imageshanchu;
    if (imageshanchu==0){
      this.setData({
        imageshanchu: 1,
        deletejilu: "取消"
      })
    }else{
      this.setData({
        imageshanchu: 0,
        deletejilu: "删除记录"
      })
    }
    },
  dodelete:function(e){
    var deleteid = e.target.dataset.deleteid;
    var _this=this;
    //console.log(e);
    wx.request({
      url: publicFun.follow(),
      data: {
        action: 'dodelete',
        deleteid: deleteid

      },
      header: {
        'content-type': 'application/json' // 默认值
      }, success: function (res) {
        console.log(res.data);
        _this.setData({
          follow_list: res.data
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
  ,loadData:function(){
    var  _this=this;
    wx.request({
      url: publicFun.follow(),
      data:{
        action:'getsicker'
      },
      header: {
        'content-type': 'application/json' // 默认值
      }, success: function (res) {
        console.log(res.data.info);
        _this.setData({
          sickerInfo:res.data.info,
          follow_list:res.data.follow_list,
          project:res.data.project,
          loading:false
        })

      }
      
    })
    var UserData = wx.getStorageSync(app.globalData.setStorage.prefix + 'UserData');
    wx.request({
      url: 'https://f.12590.com/medication/index.php',
      data: {
        action: 'getTjbg1',
        phone: UserData.phone,
        openid: UserData.openid,
        name: "赵永铭",
        sex: "男",
        lsh: "201804197006"
      },
      method: 'GET',
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res.data);
        //console.log(res.data.TJtime);
        //return false;
        _this.setData({
          familyname1: "赵永铭",
          examineDate1: res.data.TJtime[0].examineDate,
          examineDate: res.data.TJtime,
          ksjc: res.data.TJBG.rs,
          zs: res.data.TJBG.zs,
          jy: res.data.TJBG.jy
        })
       
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