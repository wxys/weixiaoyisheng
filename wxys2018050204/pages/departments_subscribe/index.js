// pages/departments_subscribe/index.js
//获取全局的应用实例
var app = getApp();
//引用公共文件
var common = require('../../common.js');
//引入co函数支持
const Promise = global.Promise = require('../../libs/es6-promise')
const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
Page({
  data: {
    PageShow: false,
    date_id: 1,  //默认显示按专家预约
    PickShow: 'none',  //是否显示排班号情况
    RemindShow: 'none',  //是否出现提示
    RemindText: '',  //提示文字
    RemindTime: 1000,//提示文字保留时间
    UserData: {},  //用户数据
    tab_id: 0,  //默认进去是按照专家预约
    navbar: [
      { 'tab_text': '按专家预约', 'tab_id': '0' },
      { 'tab_text': '按日期预约', 'tab_id': '1' },
    ],  //顶部面板切换
    Collect: false,
    AttentionDisabled:false,
    CancelAttentionDisabled:false,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var pages_object = getCurrentPages();//获取当前页面栈
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          pages: pages_object.length,//页面栈数
          ScrollHeight1: res.windowHeight - 50,
          ScrollHeight2: res.windowHeight - 107
        })

      }
    })

    //动态设置页面标题
    wx.setNavigationBarTitle({
      title: options.departments,
    });
    //设置页面参数
    this.setData({
      hospital: options.hospital,//医院名称
      hospitalId: options.hospitalId,//医院Id
      departments: options.departments,//科室名称
      departmentId: options.departmentId//科室Id
    });
    
    

  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
    var that=this;
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
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  LoadData:function(){
    var that=this;
    var data=this.data;
    var Collect = data.Collect;
    var UserData = this.data.UserData;
    var scheduling_week;
    //console.log("加载科室数据")
    //获取医院科室详情
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface.php',
      data: {
        action: 'departments_subscribe2',
        openid: UserData.openid,
        hospitalid: data.hospitalId,
        classid: data.departmentId
      },
      method: 'GET',
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res);
        if (res.data.Attention == "已收藏") {
          Collect = true;
        }
        if (res.data.DoctorByDate){          
        scheduling_week=res.data.DoctorByDate[1].week
        }
        that.setData({
          date_id: 1,//默认按日期预约
          scheduling_week: scheduling_week,
          PickShow: res.data.PickShow,
          DoctorBySpecialist: res.data.DoctorBySpecialist,//按照专家预约的专家数据
          DoctorByDate: res.data.DoctorByDate,//按照日期预约的专家数据
          Collect: Collect,//是否收藏科室
          PageShow:true,
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
  //顶部切换预约方式
  SwitchTab: function (e) {
    //console.log(e);
    this.setData({
      tab_id: e.currentTarget.dataset.id,
    });
  },
  //切换日期选择医生
  SwitchDate: function (e) {
    //console.log(e);
    this.setData({
      date_id: e.currentTarget.dataset.id,  //切换的面板ID
      scheduling_week: e.currentTarget.dataset.week,  //预约星期

    });
  },
  //可预约排班 点击查看排号情况
  ViewScheduling: function (e) {
    var data = this.data;
    var that = this;
    var SchedulingNo = {};

    if (e.currentTarget.dataset.id) {
      //console.log(e.currentTarget.dataset.id);
      this.setData({

        doctor_data: {
          doctor_cover: e.currentTarget.dataset.doctor_cover,//医生头像
          doctor_name: e.currentTarget.dataset.doctor_name,//医生名字
          doctor_position: e.currentTarget.dataset.doctor_position,//医生等级
          doctor_departments: data.departments,  //医生科室
          doctor_hospital: data.hospital,//医生医院       
        },
        scheduling_date: e.currentTarget.dataset.date, //排班日期
        scheduling_noon: e.currentTarget.dataset.noon, //排班 上午/下午
        scheduling_type: e.currentTarget.dataset.type, //排班类型
        inspecting_fee: e.currentTarget.dataset.inspecting_fee, //诊疗费
        scheduling_id: e.currentTarget.dataset.id
      })

      wx.request({
        url: 'https://f.12590.com/SlowDiseaseTreasure/interface.php',
        data: {
          action: 'SchedulingNo1',
          schedulingno: e.currentTarget.dataset.id,
          hospitalid: that.data.hospitalId
        },
        method: 'GET',
        // header: {}, // 设置请求的 header
        success: function (res) {
          //console.log(res)
          that.setData({
            PickShow: '',
            SchedulingData:res.data,  //返回排班情况
            
          });
        },
        fail: function (res) {
          // fail
        },
        complete: function (res) {
          // complete
        }
      });

    }
  },
  //隐藏排班号情况
  HidePick: function () {
    this.setData({
      PickShow: 'none',
    })
  },

  //点击排班号拿到相关数据跳转至预约确认界面
  SchedulingDoctor: function (e) {
    var data = this.data;
    var that = this;
    var pages = that.data.pages;//获得当前页面栈数
    var UserData = this.data.UserData;
    var prefix = app.globalData.setStorage.prefix;
    //console.log(e);
    //console.log(data);
    this.setData({
      scheduling_no_id: e.currentTarget.dataset.id,
    });
    var subscribe_time = data.scheduling_date + "（" + data.scheduling_week + "）" + data.scheduling_noon + " 第" + e.currentTarget.dataset.no + " " + e.currentTarget.dataset.no_time; //预约时段

    var msg_content = "您预约的是：" + data.doctor_data.doctor_name + "（" + data.doctor_data.doctor_position + "）的" + subscribe_time;
    //预约确认
    wx.showModal({
      title: '预约确认',
      content: msg_content,
      success: function (res) {
        //console.log(res);
        if (res.confirm) {
          //console.log('用户点击确定')
          //判断用户是否已经登录
          //如果没有用户数据或者用户手机号
          if (!data.UserData.hasOwnProperty('phone')) {
            
            //提示要登录
            that.ShowRemind("请先登录");

            //2s之后跳转到登录页面
            setTimeout(function () {
              common.ToPages(pages, '../login/index?user_id=' + data.UserData.openid);
            }, 2000)

          }
          //如果有绑定过手机号
          else {
            //判断下是否是会员，不是会员跳转到购买会员的页面
            if (UserData.MemberInformation != "会员订户" && UserData.MemberInformation != "健康俱乐部" && UserData.MemberInformation != "中国移动健康中心会员"){
              //提示要购买会员
              that.ShowRemind("请先购买会员");

              //2s之后跳转到购买会员页面
              setTimeout(function () {
                common.ToPages(pages, '../buy_member/index?phone=' + UserData.phone);
               
              }, 2000)
              
              return;
            }

            //要增加的预约数据
            var subscribe_list = {
              doctor_data: data.doctor_data, //预约医生数据
              subscribe_time: subscribe_time,  //预约时段
              scheduling_type: data.scheduling_type, //预约门诊类型
              inspecting_fee: data.inspecting_fee, //诊查费

              hospitalId: data.hospitalId,
              scheduling_id: data.scheduling_id,
              scheduling_no_id: e.currentTarget.dataset.id
            };
            //将订单数据存储到本地（通过链接跳转会造成编码问题）
            wx.setStorage({
              key: prefix+"subscribe_list",
              data: subscribe_list,
            });


            //先去数据库看下该用户是否曾经实名认证过
            wx.request({
              url: 'https://f.12590.com/SlowDiseaseTreasure/interface.php',
              data: {
                action: 'Check_User',
                openid: data.UserData.openid
              },
              method: 'GET',
              // header: {}, // 设置请求的 header
              success: function (res) {
                //console.log(res);
                
                if (res.data.result == 1) {
                  //跳转到页面
                  common.ToPages(pages, '../subscribe/index');
                }
                else {
                  //跳转到实名认证页面
                  common.ToPages(pages, '../subscribe_attestation/index');
                }

              },
              fail: function (res) {
                // fail
              },
              complete: function (res) {
                // complete
              }
            });

          }
        }
        else {
          //console.log('用户点击取消')
          that.setData({
            scheduling_no_id: 0,
          });
        }
      }
    })

  },
  //收藏科室
  AttentionDepartments: function () {
    var me = this;
    var AttentionDisabled = this.data.AttentionDisabled;
    if (!AttentionDisabled) {
      this.setData({
        AttentionDisabled: true,
      })
      wx.request({
        url: 'https://f.12590.com/SlowDiseaseTreasure/interface.php',
        data: {
          action: 'Collect',
          openid: me.data.UserData.openid,
          hospitalid: me.data.hospitalId,
          classid: me.data.departmentId,
          collecttype: 2
        },
        method: 'GET',
        // header: {}, // 设置请求的 header
        success: function (res) {
          me.ShowRemind(res.data.msg);
          if (res.data.result != 1) {
            return;
          }
          me.setData({
            Collect: true,
          })
        },
        fail: function (res) {
          // fail
        },
        complete: function (res) {
          // complete
          me.setData({
            AttentionDisabled: false,
          })
        }
      })
    }
    

  },

  //取消收藏科室
  CancelAttentionDepartments: function () {
    var me = this;
    var CancelAttentionDisabled = this.data.CancelAttentionDisabled;
    if (!CancelAttentionDisabled) {
      this.setData({
        CancelAttentionDisabled: true,
      })
      wx.request({
        url: 'https://f.12590.com/SlowDiseaseTreasure/interface.php',
        data: {
          action: 'CancelCollect',
          openid: me.data.UserData.openid,
          hospitalid: me.data.hospitalId,
          classid: me.data.departmentId,
          collecttype: 2
        },
        method: 'GET',
        // header: {}, // 设置请求的 header
        success: function (res) {
          me.ShowRemind(res.data.msg);
          if (res.data.result != 1) {
            return
          }
          me.setData({
            Collect: false,
          })
        },
        fail: function (res) {
          // fail
        },
        complete: function (res) {
          // complete
          me.setData({
            CancelAttentionDisabled: false,
          })
        }
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
})

