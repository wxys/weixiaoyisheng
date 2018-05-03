// pages/favorite/note_search/index.js
//获取全局的应用实例
var app = getApp();
//引用公共文件
var common = require('../../../common.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    SearchResultShow:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var pages_object = getCurrentPages();//获取当前页面栈
    var prefix = app.globalData.setStorage.prefix;
    //获取用户id
    var UserData = wx.getStorageSync(prefix + 'UserData');
    var that = this;
    this.setData({
      pages: pages_object.length,//页面栈数
      UserData: UserData,

    })
    var NoteCollectData = this.data.NoteCollectData;
    console.log(NoteCollectData);
    //获取所有文章数据
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface_ysc.php',
      data: {
        action: 'NoteCollectData',
        userid: UserData.openid,
      },
      method: 'GET',
      success: function (res) {
        console.log(res);
        that.setData({
          NoteCollectData: res.data.NoteCollectData,
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
  //跳转页面
  SkipPage: function (e) {
    var pages = this.data.pages;
    common.ToPages(pages, e.currentTarget.dataset.url);
  },
  //查看收藏数据，通过科室
  ViewCollectByDepartment:function(e){
    var index = e.currentTarget.dataset.index;
    var NoteCollectData = this.data.NoteCollectData;
    var NoteList = NoteCollectData.department_classify[index].data;
    var subject_name = NoteCollectData.department_classify[index].subject_name;
    this.setData({
      NoteList: NoteList,
      SearchText: subject_name,
      SearchResultShow:true,
    })
  },
  //查看收藏数据，通过标签
  ViewCollectByLabel: function (e) {
    var index = e.currentTarget.dataset.index;
    var NoteCollectData = this.data.NoteCollectData;
    var NoteList = NoteCollectData.label_classify[index].data;
    var subject_name = NoteCollectData.label_classify[index].subject_name;
    this.setData({
      NoteList: NoteList,
      SearchText: subject_name,
      SearchResultShow: true,
    })
  },
  //取消搜索
  CancelSearch:function(){
    this.setData({
      NoteList: [],
      SearchText: "",
      SearchResultShow: false,
    })
  },
  
  //搜索框捕捉输入内容
  SearchInput: function (e) {
    //console.log(SearchText);
    var SearchText = e.detail.value;
    this.setData({
      SearchText: SearchText,
    })
  },
  
  //点击搜索
  SearchNoteCollect:function(){
    var SearchText = this.data.SearchText;
    var UserData = this.data.UserData;
    var NoteList=[];
    var that=this;
    console.log(SearchText);
    //调用接口，查询短信文章数据
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface_ysc.php',
      data: {
        action: 'SearchData',
        userid: UserData.openid,
        search_content: SearchText,
      },
      method: 'GET',
      success: function (res) {
        console.log(res);
        NoteList = res.data.SearchData;
        that.setData({
          NoteList: NoteList,
        })
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    });
    this.setData({
      SearchText: SearchText,
      SearchResultShow: true,
    })
    
  }
})