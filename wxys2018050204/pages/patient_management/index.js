// pages/patient_management/index.js
//获取全局的应用实例
var app = getApp();
//引用公共文件
var common = require('../../common.js');
Page({
  data: {
    UserData: {},
    PageShow:false,
    IndexShow: '', //显示患者列表
    RecentSearchShow: 'none',  //显示最近搜索
    SearchResultShow: 'none',  //显示搜索结果
    focus: false,
    default_show:0,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var pages_object = getCurrentPages();//获取当前页面栈
    var sys = wx.getSystemInfoSync();

    var prefix = app.globalData.setStorage.prefix;
    //获取用户id
    var UserData = wx.getStorageSync(prefix + 'UserData');
    this.setData({
      UserData: UserData,
      pages: pages_object.length,//页面栈数
      PageScrollHeight:sys.windowHeight-55,
      ScrollHeight: sys.windowHeight - 100,
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    var that = this;
    var prefix = app.globalData.setStorage.prefix;
    //获取用户id
    var patient_search = wx.getStorageSync(prefix + 'patient_search');
    this.setData({
      patient_search: patient_search,
    })
    this.LoadData();
    
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  //页面载入数据
  LoadData: function () {
    var that = this;
    var UserData = this.data.UserData;
    
    //console.log(UserData);
    //获患者列表
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface_ysc.php',
      data: {
        action: 'patient_data',
        userid: UserData.openid,
        
      },
      method: 'GET',
      success: function (res) {
        console.log(res);
        for (var i in res.data.patient_data)
        {
          if (res.data.patient_data[i].patient_groups_id==2)
          {
            res.data.patient_data[i].patient_list.push( {
              "patient_age" : "90岁",
"patient_avatar":"https://wx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEKiboRniba1LnLJqQCICQoZOjYLXiaF17iaFicXjyHuJpLkNAMVP46kVhtvAThdU9tM4RMVKybVQ0gMlUw/0",
"patient_groups_id"  :"2",
"patient_id" : "otaEb0ZpFfv8P0PEt5-gB1R1DWu0",
"patient_name": "吴珠英",
"patient_sex": "女"
            },{
                "patient_age": "37岁",
                "patient_avatar": "https://wx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEKiboRniba1LnLJqQCICQoZOjYLXiaF17iaFicXjyHuJpLkNAMVP46kVhtvAThdU9tM4RMVKybVQ0gMlUw/0",
                "patient_groups_id": "2",
                "patient_id": "otaEb0ZpFfv8P0PEt5-gB1R1DWu0",
                "patient_name": "张毅",
                "patient_sex": "男"
              })
          }
          res.data.patient_data[i].patient_num=3;
        }
        that.setData({
          patient_data: res.data.patient_data,
          PageShow:true,
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

  //点击出现对应分组患者
  ViewPatient:function(e){
    //console.log(e);
    var default_show = this.data.default_show;
    if (e.currentTarget.dataset.idx == default_show){
      this.setData({
        default_show:-1
      })
    }else{
      this.setData({
        default_show: e.currentTarget.dataset.idx
      })
    }
    
    
  },
  //点击搜索框出现最近搜索
  ShowRecentSearch: function () {

    var SearchResultShow = this.data.SearchResultShow;
    //console.log(SearchResultShow);
    if (SearchResultShow == "none") {
      this.setData({
        IndexShow: 'none',
        RecentSearchShow: '',
        SearchResultShow: 'none',
      });
    }
 
  },
  //搜索框捕捉输入内容
  SearchInput: function (e) {
    //console.log(e);
    if (e) {
      var search_content = e.detail.value;
    }

    else {
      var search_content = this.data.search_content;
    }

    //console.log(search_content);
    var UserData = this.data.UserData;
    var that = this;
    var IndexShow = 'none';
    if (search_content != "") {
      var RecentSearchShow = 'none';
      var SearchResultShow = '';
    }
    else {
     
      var RecentSearchShow = '';
      var SearchResultShow = 'none';
    }
    console.log(IndexShow);
    this.setData({
      search_content: search_content,
      IndexShow: IndexShow,
      SearchResultShow: SearchResultShow,
      RecentSearchShow: RecentSearchShow,
    });
    //搜索数据
    
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface_ysc.php', //仅为示例，并非真实的接口地址
      data: {
        action: 'search_patient_data',
        userid: UserData.openid,
        search_content: search_content,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        that.setData({
          search_result: res.data.patient_list,
        
        });
      },
      complete: function () {

      },
    });
    
  },
  //搜索框离开焦点，保存搜索数据（这边设置本地存储最多保存10个，超过会覆盖最先的记录）
  SureSearchInput: function (e) {
    //console.log("搜索框离开焦点");
    var openid = this.data.UserData.openid;
    var prefix = app.globalData.setStorage.prefix;
    var patient_search = this.data.patient_search;  //获取保存的搜索记录数组
    var search_content = this.data.search_content; //输入框的内容
    var _same = 0;  //记录搜索记录中是否有相同内容
    var _save;  //记录是否要保存搜索记录
    var key;  //键值
    //如果有缓存搜索记录
    if (patient_search) {
      key = patient_search.length;
    }
    //没有则新建一个数组
    else {
      var patient_search = new Array();
      key = 0;
    }
    //console.log(key);
    //搜索输入框有内容
    if (search_content) {
      //如果已经缓存了10个搜索数据，则把最早的删除，再向后插入
      if (patient_search.length == 10) {
        patient_search.splice(0, 1);  //删除最早的数据
        key = 9;  //更新键值
      }
      //先判断下是否有重复内容数据
      if (patient_search.length > 0) {
        for (var x in patient_search) {
          if (patient_search[x].search_content == search_content) {
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
        if (patient_search.length > 0) {
          var newarray = { id: key + 1, search_content: search_content };
          patient_search[key] = newarray;
        }
        else {
          var newarray = [{ id: key + 1, search_content: search_content }];
          patient_search = newarray;
        }
        //将搜索数据存储到本地
        wx.setStorageSync(prefix + "patient_search", patient_search)
       
      }

    }
   

  },
  //清除搜索框的内容
  ClearSearch: function () {

    //更新页面数据
    this.setData({
      search_content: "",
      IndexShow: '',
      RecentSearchShow: 'none',
      SearchResultShow: 'none',
    });
  },
  //清除最近搜索记录
  ClearSearchReacord: function () {
    var patient_search = new Array();
    var prefix = app.globalData.setStorage.prefix;
    //将搜索数据存储到本地
    wx.setStorageSync(prefix + "patient_search", patient_search)
     
    //更新页面数据
    this.onShow();
  },
  //点击最近搜索可以设置顶部搜索框内容
  SetSearch: function (e) {
    //console.log(e);
    var value = e.currentTarget.dataset.value;
    this.setData({
      search_content: value, //设置搜索输入框内容
      focus: true,  //使搜索输入框聚焦
    });
    this.SearchInput();
  },
  //跳转页面
  SkipPage: function (e) {
    var pages = this.data.pages;
    common.ToPages(pages, e.currentTarget.dataset.url);
  },
})