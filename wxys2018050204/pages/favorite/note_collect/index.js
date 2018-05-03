// pages/note_collect/index.js
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
    RemindShow: 'none',  //是否出现提示
    RemindText: '',  //提示文字
    RemindTime: 1000,//提示显示时间
    subject_index:0,
    tab_id: 0,  //默认进去是我的收藏夹
    navbar: [
      { 'tab_text': '我的收藏夹', 'tab_id': '0' },
      { 'tab_text': '家人共享的收藏夹', 'tab_id': '1' },
    ],  //顶部面板切换
    family_share_collect:[
      {
        "collect_id":1,
        "sharer_phone":'18094159076',
      },
      {
        "collect_id": 2,
        "sharer_phone": '15980574239',
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面显示
    var pages_object = getCurrentPages();//获取当前页面栈
    var res=wx.getSystemInfoSync();
    this.setData({
      pages: pages_object.length,//页面栈数
      ScrollHeight:res.windowHeight-45,
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },
  LoadData:function(){
    var UserData = this.data.UserData;
    //console.log(UserData);
    var that = this;
    var ImgLoadNum = this.data.ImgLoadNum; //图片加载次数
    var prefix = app.globalData.setStorage.prefix;  //缓存存储前缀
    /*更新用户会员信息 */
    co(function* () {
    var  result = yield common.CheckVipMemberByUserId();
      var res = result.data;
      console.log(res);
      UserData.MemberInformation = res.data.member_information;
      //将用户数据存储到本地
      wx.setStorageSync(prefix + 'UserData', UserData);
      //获取短信文章列表
      wx.request({
        url: 'https://f.12590.com/SlowDiseaseTreasure/interface_ysc.php',
        data: {
          action: 'my_collection',
          userid: UserData.openid,
        },
        method: 'GET',
        success: function (res) {
          console.log(res);
          that.setData({
            UserData: UserData,
            NoteList: res.data.NoteList,
            PageShow: true,
          });

        },
        fail: function (res) {
          // fail
        },
        complete: function (res) {
          // complete
        }
      });
    });
   
  },
  //顶部tab切换
  SwitchTab: function (e) {
    //console.log(e);
    this.setData({
      tab_id: e.currentTarget.dataset.id,
    });
  },
  //切换科室
  SwitchNote:function(e){
    this.setData({
      subject_index: e.currentTarget.dataset.index
    })
  },
  //跳转页面
  SkipPage: function (e) {
    var pages = this.data.pages;
    common.ToPages(pages, e.currentTarget.dataset.url);
  },
  //取消收藏文章
  CancelCollectNote: function (e) {
    var that = this;
    var data = this.data;
    var RemindTime = this.data.RemindTime;
    var note_id = e.target.dataset.note_id;
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface_ysc.php',
      data: {
        action: 'CancelCollectNote',
        note_id: note_id,
        userid: data.UserData.openid,
      },
      method: 'GET',
      success: function (res) {
        //console.log(res);
        if (res.data.errorNo == "1") {
          that.ShowRemind("成功取消收藏");
          setTimeout(function(){
            that.LoadData();
          }, RemindTime);
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
})