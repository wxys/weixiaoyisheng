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
    UserData: '',
    ImgLoadNum: 1, //图片加载次数
    RemindShow: 'none',  //是否出现提示
    RemindText: '',
    RemindTime: '1000',
    IfRemoveAttentionDoctor: false,
    IfRemoveAttentionDepartments: false,
    IfRemoveAttentionHospital: false,
    IsFinishRemove: true,
    PageShow: false,
    AttentionDepartmentsScrollHeight: 120,
    AcceptLogin: true,
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    user_section: [],
    show_articles: [{
      'autoid': 'all',
      'topic_name': '全部'
    }],
    now_page: 1,
    now_section: 'all'
  },
  close_view:function()
  {
    this.setData({
      show_jihuo:false,
      show_jihuo_fail:false,
      show_jihuo_success:false
    })
    this.setData({

      loading: true
    })
    this.LoadData();
  

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面显示
    var that = this;
    //获取用户id
    var UserData;
    co(function* () {
      var result = yield common.GetUserId();
      //  console.log(Date.parse(new Date())/1000);
      that.setData({
        session_key: result.data.session_key,
      })
      UserData = result.data.openid;
      that.setData({
        UserData: UserData,
      })
      //状态为0  未授权手机号
      if (result.data.state == 0) {
        ////授权获取用户的基本信息
        that.getUserInfo();
      }
      else {
        that.setData({
          loading: true
        })
        that.LoadData();  //载入数据
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getPhoneNumber:function(e){
      var _this=this;
      if (e.detail.errMsg == 'getPhoneNumber:ok') {
        //获取到参数  向服务器请求 获取用户的手机号  
        wx.request({
          url: publicFun.req_link(),
          data: {
            iv: e.detail.iv,
            encryptedData: e.detail.encryptedData,
            session_key: _this.data.session_key,
            openid: _this.data.UserData,
            action: "PhoneVerity"
          },
          header: { 'Content-Type': 'application/json' },
          success: function (res) {
          //  console.log(res.data);
            var result = JSON.parse(res.data.replace(/(^\s*)|(\s*$)/g, ""));
            //用户手机号码
            var phone = result.phone;
          ///  console.log(result.phone);
            var j = phone.substring(3, 7);
            var s = phone.replace(j, '****');
            if (result.result == '-1') {
              //非用户
              _this.setData({
                show_jihuo_fail: true,
                show_jihuo: false,
                show_phone: s
              })
            } else {
              _this.setData({
                show_jihuo_success: true,
                show_jihuo_fail: false,
                show_jihuo: false,
                show_phone: s
              })
            }

          },
          fail: function (res) {

            
           },
          complete: function (res) { 
          
          },
        })

      }else{
        _this.setData({
          show_jihuo: false,
          loading: true
        })
       // console.log(1111);
        _this.LoadData();
      }
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(JSON.stringify(this.data.UserData));
    if (JSON.stringify(this.data.UserData)!='""')
    {
      console.log("不为空");
      this.LoadData();
    }
   
  },
  getUserInfo:function()
  {
 //   console.log(131);
    var that=this;
    wx.getUserInfo({
      success: res => {
        //获取用户基本信息
        app.globalData.userInfo = res.userInfo;
        wx.request({
          url: publicFun.req_link(),
          header: {
            'Content-Type': 'application/json'
          },
          data: {
            'action': 'StoreUserInfo',
            'data': res.userInfo,
            'openid': that.data.UserData
          },
          success: function (res) {
          }
        })
      }, complete: res => {

        that.setData({
          show_jihuo: true
        })
       

      },
      fail: res => {
    
      }
    })

  },
  showM:function()
  {
    var that=this;
    wx.showModal({
      title: '警告',
      content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
      success: function (res) {
        if (res.confirm) {
          wx.openSetting({
            success: (res) => {
              if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
                that.getUserInfo();
              }
            }, fail: function (res) {
              that.showM();
            }
          })

        }
      }
    })

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
  changePhone:function()
  {
    wx.navigateTo({
      url: 'pages/buy_member/index',
    })
  },
  LoadData: function () {
   
    console.log(Date.parse(new Date()) / 1000);
    var that = this;
    var UserData = this.data.UserData;
    var ImgLoadNum = this.data.ImgLoadNum;  //图片加载次数
    //获取科室及医院列表。
    //拿着当前的栏目id  和页数 去获取数据
    var section_id = this.data.now_section;
    var now_page = this.data.now_page;
    var _this = this;

    wx.request({
      url: publicFun.req_link(),
      data: {
        action: 'getIndexData',
        now_page: now_page,
        section: section_id,
        openid: UserData
     
      },
      header: {
        'content-type': 'application/json' // 默认值
      }, success: function (res) {
        console.log(1);
        var data = res.data;
        var user_section_class = [];
        for (var j = 0; j < data.section.length; j++) {
          if (j % 3 == 0) {
            data.section[j].class = "border_0";
          } else if (j % 3 == 1) {
            data.section[j].class = "border_1";
          } else {
            data.section[j].class = "border_2";
          }
          user_section_class.push(data.section[j]);

        }
        data.section = user_section_class;
        var all_obj = {
          'autoid': 'all',
          'topic_name': '全部',
            'class': "border_z"
        };
        data.section.unshift(all_obj);
        _this.setData({
          section: data.section,
          articles: data.articles,
          loading: false
        })
      }
    })
    wx.stopPullDownRefresh();
    wx.hideNavigationBarLoading() //完成停止加载
    //以及获取用户的全部栏目 




  
  },
  stopfw: function () {
    var that = this;
    that.ShowRemind("本服务暂未开通");
  },
  changeSection:function (e) {
    console.log(e);
    var section_id = e.target.dataset.index;
    this.setData({
      now_section: section_id,
      now_page: 1
    })
    this.LoadData();

  },


  /*
    图片加载回调
  */
  //加载图片
  LoadImages(arr) {
    console.log(arr);
    var that = this;
    //同时发起全部图片的加载
    if (arr) {
      arr.forEach(item => {
        //console.log(that.imgLoader.load);
        that.imgLoader.load(item.url);
      })
    }

  },
  //加载完成后的回调
  ImageOnLoad(err, data) {

    if (this.data.AttentionHospitalList) {
      const AttentionHospitalList = this.data.AttentionHospitalList.map(item => {
        if (item.url == data.src) {
          item.loaded = true
        }
        return item
      })
      this.setData({

        AttentionHospitalList,
      })
    }

    if (this.data.AttentionDepartmentsList) {
      const AttentionDepartmentsList = this.data.AttentionDepartmentsList.map(item => {

        if (item.url == data.src) {
          item.loaded = true
        }
        return item
      })
      this.setData({

        AttentionDepartmentsList,
      })
    }


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
  //跳转页面
  SkipPage: function (e) {
    var pages = this.data.pages;
    common.ToPages(pages, e.currentTarget.dataset.url);
  },
  onReachBottom: function (e) {
    var now_page = this.data.now_page + 1;
    this.setData({
      now_page: now_page
    })
    this.LoadData();
  },
  onPullDownRefresh: function () {
    this.LoadData();

  }
})