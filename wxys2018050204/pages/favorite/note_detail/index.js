// pages/note_detail/index.js
//引用公共文件
var common = require('../../../common.js');
//引入co函数支持
const Promise = global.Promise = require('../../../libs/es6-promise')
const regeneratorRuntime = global.regeneratorRuntime = require('../../../libs/runtime')
const co = require('../../../libs/co')
//获取全局的应用实例
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    UserData: {},
    PageShow: false,
    RemindShow: 'none',  //是否出现提示
    RemindText: '',  //提示文字
    RemindTime: 1000,//提示显示时间
    nonte_content_font_size: "16px",
    IsCollect: false,
    ShowFontSizeSelect:false,
    DefaultFontSize:2,
    CanUseRichText:true,//能否使用富文本组件
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面显示
    //存储传递参数
    this.setData({
      note_id: options.note_id,
      note_title: options.note_title,
      note_time: options.note_time,
    })
    var that = this;
    
    //获取用户id
    var UserData = wx.getStorageSync(app.globalData.setStorage.prefix + 'UserData');
    if (UserData) {
      that.setData({
        UserData: UserData,
      })
      that.LoadData();
    } else {
      co(function* () {
      var  result = yield common.GetUserId();
        UserData = result.data;
        that.setData({
          UserData: UserData,
        })
        that.LoadData();
      });

    }
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
  //加载短信详细数据
  LoadData: function () {
    var that = this;
    var data = this.data;
    var CanUseRichText = this.data.CanUseRichText;
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface_ysc.php',
      data: {
        action: 'ReadNote',
        note_id: data.note_id,
        userid: data.UserData.openid
      },
      method: 'GET',
      success: function (res) {
        console.log(res);
        if (res.data.Note.Collect == "已收藏") {
          data.IsCollect = true;
        }
        //监测富文本组件能否支持
        if (!wx.canIUse('rich-text')) {
          CanUseRichText=false;

        }
        that.setData({
          Note: res.data.Note,
          IsCollect: data.IsCollect,
          PageShow: true,
          CanUseRichText: CanUseRichText,
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
  //出现选择字体
  ShowFontSizeSelect:function(){
    var ShowFontSizeSelect = this.data.ShowFontSizeSelect;
    if (ShowFontSizeSelect){
      this.setData({
        ShowFontSizeSelect:false,
      })
    }else{
      this.setData({
        ShowFontSizeSelect: true,
      })
    }
  },
  //隐藏选择字体
  HideFontSizeSelect: function () {
    this.setData({
       ShowFontSizeSelect: false,
     })
  },
  //设置短信内容字体
  SetFontSize: function (e) {
    console.log(e);
    if (e.detail.value==1){
      this.setData({
        nonte_content_font_size: "14px"
      })
    }
    if (e.detail.value == 2) {
      this.setData({
        nonte_content_font_size: "16px"
      })
    }
    if (e.detail.value == 3) {
      this.setData({
        nonte_content_font_size: "18px"
      })
    }
    
    this.setData({
      DefaultFontSize: e.detail.value
    })
    
  },
  //取消收藏文章
  CancelCollectNote: function () {
    var that = this;
    var data = this.data;
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface_ysc.php',
      data: {
        action: 'CancelCollectNote',
        note_id: data.note_id,
        userid: data.UserData.openid
      },
      method: 'GET',
      success: function (res) {
        //console.log(res);
        if (res.data.errorNo == "1") {
          that.setData({
            IsCollect: false
          })
          that.ShowRemind("成功取消收藏");
        } else {
          that.ShowRemind("取消收藏失败");
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
  //收藏文章
  CollectNote: function () {
    var that = this;
    var data = this.data;
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface_ysc.php',
      data: {
        action: 'CollectNote',
        note_id: data.note_id,
        userid: data.UserData.openid
      },
      method: 'GET',
      success: function (res) {
        //console.log(res);
        if (res.data.errorNo == "1") {
          that.setData({
            IsCollect: true
          })
          that.ShowRemind("成功收藏");
        } else {
          that.ShowRemind("收藏失败");
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
  /**
   * 用户点击右上角分享(暂不开放)
   */
  /*
  onShareAppMessage: function () {
    var data=this.data;
    return {
      title: data.note_title,
      path: 'pages/favorite/note_detail/index?note_title=' + data.note_title + '&note_id=' + data.note_id + '&note_time=' + data.note_time ,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  */
})