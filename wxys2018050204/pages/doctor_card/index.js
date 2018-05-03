// pages/doctor_card/index.js
//获取全局的应用实例
//获取全局的应用实例
var app = getApp();
//引用公共文件
var common = require('../../common.js');
//引入co函数支持
const Promise = global.Promise = require('../../libs/es6-promise')
const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
//获取全局的应用实例
var app = getApp();
//引用公共文件
var common = require('../../common.js');
var Config = require('../../config.js');
Page({
  data: {
    UserData: {},
    doctor_card_data:
    {
      "saying_list": [
        {
          "saying_content": '您的健康，是我微笑的最大动力。',
          "saying_time": '2017-05-08',
        },
      ],

    },
    RemindShow: 'none',  //是否出现提示
    RemindText: '',  //提示文字
    RemindTime: 1000,//提示显示时间
    PageShow: false,
    Collect: false,
    AttentionBtnDisabled: false,
    CancelAttentionBtnDisabled: false,
    ShowMoreText:false,
  },
  onLoad: function (options) {
    var prefix = app.globalData.setStorage.prefix;
    
    //console.log(options);
    var pages_object = getCurrentPages();//获取当前页面栈
    var doctor_data = {
      "doctor_cover": options.doctor_cover,
      "doctor_name": options.doctor_name,
      "doctor_position": options.doctor_position,
      "doctor_departments": options.doctor_departments,
      "doctor_hospital": options.doctor_hospital,
      "doctor_id": options.doctor_id,
      "hospital_id": options.hospitalId,
      "department_id": options.departmentId,
    };
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        that.setData({
          doctor_data: doctor_data,
          ScrollHeight: res.windowHeight -290 - 80,
          pages: pages_object.length,//页面栈数
        })

      }
    })

    //获取用户id
    var UserData = wx.getStorageSync(app.globalData.setStorage.prefix + 'UserData');
    if (UserData) {
      that.setData({
        UserData: UserData,
      })
      that.LoadData();
    } else {
      co(function* () {
        var result = yield common.GetUserId();
        UserData = result.data;
        that.setData({
          UserData: UserData,
        })
        that.LoadData();
      });

    }


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
  LoadData: function () {
    var that = this;
    var data = this.data;
    var Collect = data.Collect;
    //console.log(data);
    //获取医生名片数据
    wx.request({
      url: Config.inter(),
      data: {
        action: 'Doctor_Card',
        hospitalid: data.doctor_data.hospital_id,
        doctorid: data.doctor_data.doctor_id,
        classid: data.doctor_data.department_id,
        openid: data.UserData.openid
      },
      method: 'GET',
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res);
        if (res.data.Attention == "已收藏") {
          Collect = true;
        }
        console.log(res.data);
      var doctor_introduce=res.data.doctor.introduce;
      var doctor_good_at = res.data.doctor.doctor_good_at;
        var doctor_introduce_cut='';
        var doctor_good_at_cut='';
        //这边对医生介绍进行字符串截取
        if (doctor_introduce){
          doctor_introduce_cut = common.CutStr(doctor_introduce, 40);
        }
        if (doctor_good_at)
        {
          doctor_good_at_cut= common.CutStr(doctor_good_at,40 );
        }
       
        that.setData({
          clinic_guide: res.data.clinic_guide,
          Collect: Collect,
          //doctor_good_at: res.data.doctor.doctor_good_at,
          doctor_good_at: res.data.doctor.doctor_good_at,
          doctor_good_at_show: doctor_good_at,
          is_show_more_goodAt:false,
          is_show_more_doctor_introduce: false,
          doctor_introduce: doctor_introduce,
          doctor_introduce_cut: doctor_introduce_cut,
          doctor_introduce_show: doctor_introduce_cut,
          doctor_good_at_cut: doctor_good_at_cut,
          doctor_good_at_show: doctor_good_at_cut,
          PageShow: true,
        })
        console.log(doctor_good_at_cut);
        console.log(doctor_good_at);
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
  //收藏医生
  AttentionDoctor: function () {
    var me = this;
    this.setData({
      AttentionBtnDisabled: true,
    })
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface.php',
      data: {
        action: 'Collect',
        openid: me.data.UserData.openid,
        hospitalid: me.data.doctor_data.hospital_id,
        classid: me.data.doctor_data.department_id,
        doctorid: me.data.doctor_data.doctor_id,
        collecttype: 3
      },
      method: 'GET',
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res.data+"aaaaaaaaa");
        if (res.data.result != 1) {
          me.ShowRemind("收藏失败");
          return;
        } else {
          me.ShowRemind("收藏成功");
          me.setData({
            Collect: true,
          })
        }

      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
        me.setData({
          AttentionBtnDisabled: false,
        })
      }
    })

  },

  //取消收藏医生
  CancelAttentionDoctor: function () {
    //console.log(this.data);
    var me = this;
    this.setData({
      CancelAttentionBtnDisabled: true,
    })
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface.php',
      data: {
        action: 'CancelCollect',
        openid: me.data.UserData.openid,
        hospitalid: me.data.doctor_data.hospital_id,
        classid: me.data.doctor_data.department_id,
        doctorid: me.data.doctor_data.doctor_id,
        collecttype: 3
      },
      method: 'GET',
      // header: {}, // 设置请求的 header
      success: function (res) {
        //console.log(res);
        me.ShowRemind(res.data.msg);
        if (res.data.result != 1) {
          me.ShowRemind("取消收藏失败");
        } else {
          me.ShowRemind("成功取消收藏");
          me.setData({
            Collect: false,
          })

        }

      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
        me.setData({
          CancelAttentionBtnDisabled: false,
        })
      }
    })
  },

  //转发页面
  onShareAppMessage: function () {
    console.log("aaa");
    var doctor_data = this.data.doctor_data;
    return {
      title: '微笑医生推荐',
      path: 'pages/doctor_card/index?doctor_cover=' + doctor_data.doctor_cover + '&doctor_name=' + doctor_data.doctor_name + '&doctor_position=' + doctor_data.doctor_position + '&doctor_departments=' + doctor_data.doctor_departments + '&doctor_hospital=' + doctor_data.doctor_hospital + '&doctor_subscribe_number=' + doctor_data.doctor_hospital + '&doctor_id=' + doctor_data.doctor_id + '&hospitalId=' + doctor_data.hospital_id + '&departmentId=' + doctor_data.department_id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //跳转页面
  SkipPage: function (e) {
    var pages = this.data.pages;
    common.ToPages(pages, e.target.dataset.url);
  },
   ShowMoreTextGoodAt: function (e) {
    console.log(e);
    var data = this.data;
    var is_show_more_goodAt = data.is_show_more_goodAt;
    if (is_show_more_goodAt) {
      this.setData({
        is_show_more_goodAt: false,
        doctor_good_at_show: e.currentTarget.dataset.text_cut
      })
    } else {
      this.setData({
        is_show_more_goodAt: true,
        doctor_good_at_show: e.currentTarget.dataset.text
      })
    }
  },

  ShowMoreText:function(e){
    console.log(e);
    var data=this.data;
    var ShowMoreText = data.ShowMoreText;
    if (ShowMoreText){
      this.setData({
        ShowMoreText:false,
        doctor_introduce_show:e.currentTarget.dataset.text_cut
      })
    }else{
      this.setData({
        ShowMoreText: true,
        doctor_introduce_show: e.currentTarget.dataset.text
      })
    }
  },
})