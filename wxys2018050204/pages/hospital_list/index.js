// pages/hospital_list/index.js
//获取全局的应用实例
var app = getApp();
//引用公共文件
var common = require('../../common.js');
Page({
  data:{
    UserData:{},
    IndexShow:'', //显示医院列表
    RecentSearchShow:'none',  //显示最近搜索
    SearchResultShow:'none',  //显示搜索结果
    focus:false
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
   wx.getSystemInfo({
     success: function(res) {
      that.setData({
        ScrollHeight: res.windowHeight - 45,
      })
     },
     
   })
   var prefix = app.globalData.setStorage.prefix;
   //获取用户id
   var UserData = wx.getStorageSync(prefix + 'UserData');
   this.setData({
     UserData: UserData,
   })

  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    var that = this;
    var prefix = app.globalData.setStorage.prefix;
    //获取本地存储的搜索数据
    var hospital_search = wx.getStorageSync(prefix + 'hospital_search');
    that.setData({
      hospital_search: hospital_search,
    });
    this.LoadData();
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  LoadData:function(){
    var that=this;
    var Userlocation = this.data.UserData.Userlocation;//用户位置信息
    //console.log(Userlocation);
    //获取医院列表
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface.php',
      data: {
        action: 'hospital_list',
        Userlocation: Userlocation,
      },
      method: 'GET',
      // header: {}, // 设置请求的 header
      success: function (res) {
        //console.log(res);
        that.setData({
          Hospital: res.data.Hospital
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
  //点击搜索框出现最近搜索
  ShowRecentSearch:function(){
    var SearchResultShow=this.data.SearchResultShow;
    //console.log(SearchResultShow);
    if(SearchResultShow=="none"){
      this.setData({
        IndexShow:'none',
        RecentSearchShow: '',
        SearchResultShow: 'none',
      });
    }
   
  },
   //搜索框捕捉输入内容
  SearchInput: function (e) {
    //console.log(e);
    var Userlocation = this.data.UserData.Userlocation;//用户位置信息
    //console.log("搜索框捕捉输入内容");
    if(e){
       var search_content = e.detail.value;
    }
  
    else{
      var search_content = this.data.search_content;
    }
    
    //console.log(search_content);
    var UserData = this.data.UserData;
    var that = this;
    var IndexShow = 'none';
    if (search_content!="") {
      var RecentSearchShow = 'none';
      var SearchResultShow= '';
    }
    else {
      var RecentSearchShow = '';
      var SearchResultShow = 'none';
    }
    //console.log(RecentSearchShow);
   
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface.php', //仅为示例，并非真实的接口地址
      data: {
        action: 'hospital_list',
        hospitalfuzzy: search_content,
        Userlocation: Userlocation,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //console.log(res);
        if (res.data.hasOwnProperty("Hospital")){
          that.setData({
            search_result: res.data.Hospital,
            search_content: search_content,
            IndexShow: IndexShow,
            RecentSearchShow: RecentSearchShow,
            SearchResultShow: SearchResultShow,
          });
        }else{
          that.setData({
            search_result: "",
          });
        }
        
       
      },
      complete: function () {

      },
    });
  },
  //搜索框离开焦点，保存搜索数据（这边设置本地存储最多保存10个，超过会覆盖最先的记录）
  SureSearchInput: function (e) {
    //console.log("搜索框离开焦点");
    var prefix = app.globalData.setStorage.prefix;
    var openid = this.data.UserData.openid;
    var hospital_search = this.data.hospital_search;  //获取保存的搜索记录数组
    var search_content = this.data.search_content; //输入框的内容
    var _same = 0;  //记录搜索记录中是否有相同内容
    var _save;  //记录是否要保存搜索记录
    var key;  //键值
    //如果有缓存搜索记录
    if (hospital_search) {
      key = hospital_search.length;
    }
    //没有则新建一个数组
    else {
      var hospital_search = new Array();
      key = 0;
    }
    console.log(search_content);
    //搜索输入框有内容
    if (search_content) {
      //如果已经缓存了10个搜索数据，则把最早的删除，再向后插入
      if (hospital_search.length == 10) {
        hospital_search.splice(0, 1);  //删除最早的数据
        key = 9;  //更新键值
      }
      //先判断下是否有重复内容数据
      if (hospital_search.length > 0) {
        for (var x in hospital_search) {
          if (hospital_search[x].search_content == search_content) {
            _same++;
          }
        }
        if (_same > 0) {
          _save = false;
        } else {
          _save = true;
        }
      } else {
        _save = true;
      }

      //没有重复内容则保存
      if (_save) {
        //要增加的数组
        if (hospital_search.length > 0) {
          var newarray = { id: key + 1, search_content: search_content };
          hospital_search[key] = newarray;
        }
        else {
          var newarray = [{ id: key + 1, search_content: search_content }];
          hospital_search = newarray;
        }
        //将搜索数据存储到本地
        wx.setStorage({
          key: prefix+"hospital_search",
          data: hospital_search,
        });

      }
      /*
      //将搜索数据保存到数据库
      wx.request({
        url: 'https://f.12590.com/procedure/function.php', //仅为示例，并非真实的接口地址
        data: {
          action: 'SaveSearch',
          user_id: openid,
          search_content: search_content
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          //console.log(res);
        },
        complete: function () {

        },
      });
      */
      //更新页面数据
      this.onShow();
    }
   

  },
  //清除搜索框的内容
  ClearSearch: function () {
    
    //更新页面数据
    this.setData({
      search_content: "",
      IndexShow:'',
      RecentSearchShow: 'none',
      SearchResultShow: 'none',
    });
  },
  //清除最近搜索记录
  ClearSearchReacord: function () {
    var hospital_search = new Array();
    var prefix = app.globalData.setStorage.prefix;
    //将搜索数据存储到本地
    wx.setStorage({
      key: prefix+"hospital_search",
      data: hospital_search,
    });
    //更新页面数据
    this.onShow();
  },
  //点击最近搜索可以设置顶部搜索框内容
  SetSearch:function(e){
    //console.log(e);
    var value=e.currentTarget.dataset.value;
    this.setData({
      search_content:value, //设置搜索输入框内容
      focus: true,  //使搜索输入框聚焦
    });
    this.SearchInput();
  },
})