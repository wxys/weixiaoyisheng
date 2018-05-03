// pages/Follow_report/index.js
// pages/my_attention/index.js 

var WxParse = require('../../wxParse/wxParse.js');
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
  data: {
    selectPerson: true,
    selectTime_hidden:true,
    selectArea: false,
    currentTab: 0, 
    use_drug_tab:0,
    alerttype:'alerttype',
    isxialaleft: 0,
    isxialaright: 0,
    xialaleftshow: 0,
    xialarightshow: 0,
    isnull:0
  },
  //点击选择类型
  clickPerson: function () {
    var selectPerson = this.data.selectPerson;
    if (selectPerson == true) {
      this.setData({
        selectArea: true,
        selectPerson: false,
      })
    } else {
      this.setData({
        selectArea: false,
        selectPerson: true,
      })
    }
  },
  clickTime:function()
  {
    var selectTime = this.data.selectTime_hidden;
    console.log(selectTime);
    if (selectTime == true) {
      this.setData({
        selectArea: true,
        selectTime_hidden: false,
      })
    } else {
      this.setData({
        selectArea: false,
        selectTime_hidden: true,
      })
    }

  },
  //点击切换
  mySelect: function (e) {
    this.setData({
      firstPerson: e.target.dataset.me,
      selectPerson: true,
      selectArea: false,
    })
    this.showList();
  },
  selectTime:function(e)
  {
    this.setData({
      selectTime: e.target.dataset.me,
      selectTime_hidden: true,
      selectArea: false,
    })
    this.showList();
  },
  showList:function()
  {
    //获取当前的姓名  和日期
    var clickPerson = this.data.firstPerson;
    var clickTime = this.data.selectTime;
    //console.log(clickTime);
    var all_follow_report = this.data.all_follow_report;
   for(var i=0;i<all_follow_report.length;i++)
   {
     if (all_follow_report[i].name == clickPerson && all_follow_report[i].create_time.substring(0, 10) == clickTime )
     {
       this.setData({
         showList: all_follow_report[i]

       })
       //console.log(11);
       break;
     }
   }
 
   console.log(this.data.showList);

  },
  /** 
   * 滑动切换tab 
   */
  bindChange: function (e) {

    var that = this;
    that.setData({ currentTab: e.detail.current });

  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  } ,
  swichusedrug: function (e) {
    var that = this;
    if (this.data.use_drug_tab === e.target.dataset.usedrug) {
      return false;
    } else {
      that.setData({
        use_drug_tab: e.target.dataset.usedrug
      })
    }

  },
  onLoad: function (options) {
    //获取本地的存储
    this.setData({
      loading:true
    })
    var _this = this;
    var UserData = wx.getStorageSync(app.globalData.setStorage.prefix + 'UserData');
    console.log(publicFun.req_link());
    wx.request({
      url: publicFun.req_link(),
      data: {
        'openid': UserData.openid,
        'action': 'getReport',
      },
      header: {
        'Content-Type': 'application/json'
      },

      success: function (res) {
        var res_data = res.data;
        console.log(res_data);
        if (res_data.state == 0) {
          _this.setData({
            isnull:1
          })
        }else if (res_data.state == 1) {
          /*
          //获取用户的随访记录
          //用户  、日期 、    两个分类
          var name_arr = [];
          var time_arr = [];
          //console.log(res_data);
          for (var i = 0; i < res_data.date.length; i++) {
            if (i == 0) {
              name_arr.push(res_data.date[i].name);
              time_arr.push(res_data.date[i].create_time.substring(0, 10));
            } else {
              for (var j = 0; j < name_arr.length; j++) {
                if (res_data.date[i].name == name_arr[j]) {
                  break;
                }
              }
              if (j >= name_arr.length) {
                name_arr.push(res_data.date[i].name);
              }
              for (var j = 0; j < time_arr.length; j++) {
                if (res_data.date[i].create_time.substring(0, 10) == time_arr[j]) {
                  break;
                }
              }
              if (j >= time_arr.length) {
                time_arr.push(res_data.date[i].create_time.substring(0, 10));
              }
            }
          }
          _this.setData({
            name_arr: name_arr,
            time_arr: time_arr,
            all_follow_report: res_data.date,
            selectTime: time_arr[time_arr.length-1],
            firstPerson: name_arr[name_arr.length-1]
          })
          _this.showList();
          */

        }

        _this.setData({
          loading: false
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
    //拿着用户的openid 去查询
    //获取全家人的家庭随访报告


  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  alert_close:function(){
    var that=this;
    that.setData({
      alerttype: 'alerttype'
    })
  },
  showAlert: function (e) {
    var that = this;
    var typeautoid = e.currentTarget.dataset.typeautoid;
    var typeid = e.currentTarget.dataset.typeid;
    console.log(typeautoid);
    //获取医生资料
    wx.request({
      url: 'https://f.12590.com/medication/index.php',
      data: {
        action: 'getPrompt',
        typeautoid: typeautoid,
        typeid: typeid
      },
      method: 'GET',
      // header: {}, // 设置请求的 header
      success: function (res) {
        //console.log(res);
        WxParse.wxParse('content', 'html', res.data.content, that);
        that.setData({
          alert_title: res.data.title,
          alerttype: ''
        })
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    });

    //that.setData({
      //alerttype: ''
    //})
  },
  clickTopSelectLeft: function () {
    var that = this;
    //console.log(that);
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
  clickTopSelectRight:function(){
    var that=this;
    //console.log(that);
    if (that.data.isxialaright) {
      that.setData({
        isxialaright: 0,
        xialarightshow:0
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
  topSelectShouqi:function(){
    var that=this;
    that.setData({
      xialaleftshow:0,
      xialarightshow:0,
      isxialaleft:0,
      isxialaright:0
    })
  }
})