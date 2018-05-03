//index.js
//引用公共文件
var common = require('../../common.js');
//引入co函数支持
const Promise = global.Promise = require('../../libs/es6-promise')
const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
//获取全局的应用实例
var app = getApp(); 
Page({
  data: {
    UserData: {},
    PageShow: 'none',
    MaxNum:6,//家庭联系人最大数量
    RemindShow: 'none',  //是否出现提示
    RemindText: '',  //提示文字
    RemindTime: 1000, //提示存在时间(ms)
    SlideBtnWidth: 140,//滑动按钮宽度单位（px）
    MinSlideDistance: 30,//最小滑动距离
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    //获取用户id
    var UserData = wx.getStorageSync(app.globalData.setStorage.prefix + 'UserData');
    if (UserData) {
      that.setData({
        UserData: UserData,
      })
      that.LoadData();
    } else {
      co(function* () {
        result = yield common.GetUserId();
        UserData = result.data;
        that.setData({
          UserData: UserData,
        })
        that.LoadData();
      });

    }
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  LoadData:function(){
    var that = this;
    var UserData = this.data.UserData;
    wx.request({
      url: 'https://f.12590.com/procedure/SlowDiseaseTreasure_Port.php',
      data: {
        action: 'GetFamilyUser',
        user_id: UserData.openid,
      },
      method: 'GET',
      // header: {}, // 设置请求的 header
      success: function (res) {
        //console.log(res);
        that.setData({
          household_contacts: res.data
        })

        console.log(that.data.household_contacts);
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
        that.setData({
          PageShow:'',
        })
      }
    });
  },
  //点击添加家庭联系人
  AddHouseholdContacts:function(){
    var MaxNum = this.data.MaxNum;
    var household_contacts = this.data.household_contacts;
    //console.log(household_contacts.length);
    if (household_contacts.length >= MaxNum){
      this.ShowRemind("最多只能添加6个");
      return;
    }else{
      wx.navigateTo({
        url: '../add_household_contacts/index',
      })
    }
  },
  touchS: function (e) {

    var household_contacts = this.data.household_contacts;
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
    for (var x in household_contacts) {
      if (household_contacts[x].txt_style = "left:-140px") {
        household_contacts[x].txt_style = "left:0px";
      }
    }
    this.setData({
      household_contacts: household_contacts,
    });
  },
  touchM: function (e) {
    var MinSlideDistance = this.data.MinSlideDistance;
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;

      var SlideBtnWidth = this.data.SlideBtnWidth;
      var txt_style = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txt_style = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        txt_style = "left:-" + disX + "px";
        if (disX >= MinSlideDistance) {
          //控制手指移动距离最大值为删除按钮的宽度
          txt_style = "left:-" + SlideBtnWidth + "px";
        }

      }

      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;

      var household_contacts = this.data.household_contacts;
      if (index >= 0) {
        household_contacts[index].txt_style = txt_style;
        //更新列表的状态
        this.setData({
          household_contacts: household_contacts
        });
      }
    }
  },

  touchE: function (e) {
    var MinSlideDistance = this.data.MinSlideDistance;
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;

      var SlideBtnWidth = this.data.SlideBtnWidth;

      //如果距离小于最小滑动距离，则不显示
      var txt_style = disX >= MinSlideDistance ? "left:-" + SlideBtnWidth + "px" : "left:0px";

      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var household_contacts = this.data.household_contacts;
      if (index >= 0) {
        household_contacts[index].txt_style = txt_style;
        //更新列表的状态
        this.setData({
          household_contacts: household_contacts
        });
      }
    }
  },

  //设为默认联系人
  SetDefault: function (e) {
    var that=this;
    var UserData = that.data.UserData;
    //获取要设置的id
    var id=e.target.dataset.id;
    wx.request({
      url: 'https://f.12590.com/procedure/SlowDiseaseTreasure_Port.php',
      data: {
        action: 'SetDefaultDFamilyUser',
        id:id,
        user_id:UserData.openid
      },
      method: 'GET',
      // header: {}, // 设置请求的 header
      success: function (res) {
        //console.log(res);
        if (res.data.msg == "success") {
          that.ShowRemind("成功设置");
        } else {
          that.ShowRemind("设置失败");
        }

      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
        that.onShow();
      }
    });
  },

  //删除联系人
  delItem: function (e) {
    
    /*
    //获取列表中要删除项的下标
    var index = e.target.dataset.index;
    var household_contacts = this.data.household_contacts;

    //移除列表中下标为index的项
    household_contacts.splice(index, 1);
    //更新列表的状态
    this.setData({
      household_contacts: household_contacts
    });
    */
    var that=this;
    //获取要删除的id
    var id=e.target.dataset.id;
    wx.request({
      url: 'https://f.12590.com/procedure/SlowDiseaseTreasure_Port.php',
      data: {
        action: 'DelFamilyUser',
        id:id,
      },
      method: 'GET',
      // header: {}, // 设置请求的 header
      success: function (res) {
        //console.log(res);
        if (res.data.msg == "success") {
          that.ShowRemind("成功删除");
        } else {
          that.ShowRemind("删除失败");
        }

      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
        that.onShow();
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
  }

})
