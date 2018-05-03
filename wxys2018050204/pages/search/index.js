// pages/search/index.js
var Config = require('../../config.js');
var req_link = Config.req_link();
Page({
  data: {
    ShowIndex: '',
    ShowResult: 'none',
    focus:true,
  },
  onLoad: function (options) {
   
    if (options.is_userCollect==1)
    {
     this.setData({
       is_userCollect:1
     })
    }else{
      this.setData({
        is_userCollect:0
      })
    }
  },
  onReady: function () {
    // 页面渲染完成
    //获取用户的信息
    var userPhone = wx.getStorageSync('SMDC_UserData');
   if(userPhone)
   {
     var search_list = wx.getStorageSync('search_list');
     console.log(search_list);
     //获取本地存的最近搜索
     this.setData({
       openid: userPhone.openid,
       search_list: search_list

     });
     this.LoadData();
   }else{
     //页面跳转到登录页面
     wx.redirectTo({
       url: '../login/login'
     })
   }
  },
  onShow: function () {
    // 页面显示
    //this.LoadData();
    // 页面初始化 options为页面跳转所带来的参数
  
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  LoadData:function()
  {
    var that = this;
    //获取热门搜索数据
    wx.request({
      url: req_link, //仅为示例，并非真实的接口地址
      data: {
        action: 'GetAllSection',
        openid:that.data.openid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        that.setData({
          AllSection: res.data,
        });
      },
      complete: function () {

      },
    });
  },

  //搜索框捕捉输入内容
  SearchInput: function (e) {
    //console.log(e.detail.value);
    if(e){
       var search_content = e.detail.value;
    }else{
      var search_content = this.data.search_content;
    }
   
    var _this= this;
    if (search_content) {
      var ShowIndex = 'none';
      var ShowResult = '';
    }
    else {
      var ShowIndex = '';
      var ShowResult = 'none';
    }
    this.setData({
      search_content: search_content,
      ShowIndex: ShowIndex,
      ShowResult: ShowResult,
    });
    wx.request({
      url: req_link, //仅为示例，并非真实的接口地址
      data: {
        action: 'userSearch',
        openid:  _this.data.openid,
        
        search_content: search_content
    
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
       
        _this.setData({
          search_result: res.data,
          is_section:0,
          ShowResult:""
        });
      },
      complete: function () {

      },
    });
  },
  //搜索框离开焦点，保存搜索数据（这边设置本地存储最多保存10个，超过会覆盖最先的记录）
  SureSearchInput: function (e) {
    var userPhone = this.data.openid;
    var search_list = this.data.search_list; //获取保存的搜索记录数组
    var search_content = this.data.search_content; //输入框的内容
    var _same = 0;  //记录搜索记录中是否有相同内容
    var _save;  //记录是否要保存搜索记录
    var key;  //键值
    //如果有缓存搜索记录
    if (search_list) {
      key = search_list.length;
    }
    //没有则新建一个数组
    else {
      var search_list = new Array();
      key = 0;
    }
    //console.log(key);
    //搜索输入框有内容
    if (search_content) {
      //如果已经缓存了10个搜索数据，则把最早的删除，再向后插入
      if (search_list.length == 10) {
        search_list.splice(0, 1);  //删除最早的数据
        key = 9;  //更新键值
      }
      //先判断下是否有重复内容数据
      if (search_list.length > 0) {
        for (var x in search_list) {
          if (search_list[x].search_content == search_content) {
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
        console.log(search_list.length);
        if (search_list.length > 0) {
          var newarray = { id: key + 1, search_content: search_content };
          search_list[key] = newarray;
        }
        else {
          var newarray = [{ id: key + 1, search_content: search_content }];
          search_list = newarray;
        }
        //将搜索数据存储到本地
        wx.setStorage({
          key: "search_list",
          data: search_list,
        });
        this.setData({
          search_list: search_list
        })
      }

      //将搜索数据保存到数据库
      wx.request({
        url: req_link, //仅为示例，并非真实的接口地址
        data: {
          action: 'SaveSearch',
          openid: userPhone,
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
      //更新页面数据
      this.onShow();
    }

  },
  //清除搜索框的内容
  ClearSearch: function () {
    var search_content = "";
    //更新页面数据
    this.setData({
      search_content: search_content,
      ShowIndex: '',
      ShowResult: 'none',
    });
  },
  //清除最近搜索记录
  ClearSearchReacord: function () {
    var search_list = new Array();
    //将搜索数据存储到本地
    wx.setStorage({
      key: "search_list",
      data: search_list,
    });
    //更新页面数据
   this.setData({
     search_list:search_list
   })
  },
  //点击最近搜索和热门搜索可以设置顶部搜索框内容
  SetSearch:function(e){
    console.log(e);
    var value=e.currentTarget.dataset.value;
    console.log(value);
    this.setData({
      search_content: value, //设置搜索输入框内容
      focus: true,  //使搜索输入框聚焦
    });
    this.SearchInput();
  },
})