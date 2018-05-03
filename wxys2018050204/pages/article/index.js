
var WxParse = require('../../wxParse/wxParse.js');
var Config = require('../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   // console.log(options);
    var userPhone = wx.getStorageSync('SMDC_UserData');
    if (options.isMsg=="1")
   {

   }
    this.setData({
      article_id: options.autoid,
      openid: userPhone.openid,
      isMsg: options.isMsg,
      isXcxZT: options.isXcxZT,
      loading:true
    })
    this.LoadData();
  },
  LoadData:function()
  {
    var _this=this;
    var article_id = this.data.article_id;
    var isMsg = this.data.isMsg;
    var openid = this.data.openid;
    wx.request({
      url: Config.req_link(),
      data:{
        action:'getArticle',
        article_id: article_id,
        openid: openid,
        isMsg: isMsg,
        isXcxZT: _this.data.isXcxZT
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
       
       // res.data.article[0] = res.data.article;
        if (res.data.article.publisher == 'undefined' || res.data.article.publisher == '' || res.data.article.publisher==null )
        {
          res.data.article.publisher='微笑医生';
        }
        wx.setNavigationBarTitle({
          title: res.data.article.title ,
        })
      
       var content =res.data.article.OriginalText;
       var aa =WxParse.wxParse('content', 'html', content, _this);
      if(res.data.article.department!=null)
      {
        var user_section_class = [];
        for (var j = 0; j < res.data.article.department.length; j++) {
          if (j % 4 == 0) {
            res.data.article.department[j].class = "border_0";
          } else if (j % 3 == 1) {
            res.data.article.department[j].class = "border_1";
          } else if (j % 3 == 2){
            res.data.article.department[j].class = "border_2";
          }else {
            res.data.article.department[j].class = "border_3";
          }
          user_section_class.push(res.data.article.department[j]);

        }
        res.data.article.section = user_section_class;
        console.log(res.data.article.section);
      
      }
        _this.setData({
          article: res.data.article,
          loading:false
          
        })
        console.log(res.data.article);


      }
    })


  },
  collect:function()
  {
    var _this = this;
    var article_id = this.data.article_id;
    var userPhone = this.data.userPhone;
    wx.request({
      url: Config.req_link(),
      data: {
        action: 'collect',
        article_id: article_id,
        userPhone: userPhone
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
     _this.setData({
       is_collect:res.data.is_collect
     })
     if (res.data.is_collect==1)
     {
       wx.showToast({
         title: '收藏成功',
         icon:""
       })
     }else
     {
       wx.showToast({
         title: '取消收藏成功',
         icon: ""
       })

     }
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
  //分享
  ShowRemind:function(t)
  {

  },
  onShareAppMessage: function () {
    var article_id = this.data.article_id;
    var openid = this.data.openid;
    var isMsg = this.data.isMsg;
    var that = this;
    return {
      title: "",
      path: 'pages/article/index?autoid=' + article_id + "&isMsg=" + isMsg + "&isXcxZT=" + that.data.isXcxZT+"&openid=" + openid  ,
      success: function (res) {
        console.log('pages/article/index?autoid=' + article_id + "&isMsg=" + isMsg + "&isXcxZT=" + that.data.isXcxZT + "& openid=" + openid);

        // 分享成功
        that.ShowRemind('pages/article/index?autoid=' + article_id + "&isMsg=" + isMsg + "&isXcxZT=" + that.data.isXcxZT + "&openid=" + openid );
      },
      fail: function (res) {
        // 分享失败
        that.ShowRemind("分享失败")
      }
    }
  },
})