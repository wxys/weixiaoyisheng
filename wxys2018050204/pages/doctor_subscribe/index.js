// pages/doctor_subscribe/index.js
//获取全局的应用实例
var app = getApp();
//引用公共文件
var common = require('../../common.js');
//引入co函数支持
const Promise = global.Promise = require('../../libs/es6-promise')
const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co');
var publicFun=require('../../config.js');
Page({
  data: {
    UserData: {},
    RemindShow: 'none',  //是否出现提示
    RemindText: '',  //提示文字
    RemindTime: 1000,//提示显示时间
    SchedulingNo: {}, //排班号
    IfTotal: true,
    PickShow: 'none',  //是否显示排班号情况
    Collect: false,
    scheduling: {}, //所有排班
    scheduling_keyuyue: {}, //可预约排班
    scheduling_show: [], //显示的排班
    PageShow: false,
    limit_start: 0,
    limit_num: 3,
    AttentionDisabled: false,
    CancelAttentionDisabled: false,
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    //console.log(options);
    var pages_object = getCurrentPages();//获取当前页面栈
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          ScrollHeight: res.windowHeight - 85,
         
        })

      }
    })
    //
    this.setData({
      pages:pages_object.length,//页面栈数
      doctor_data: {
        doctor_cover: options.doctor_cover,
        doctor_name: options.doctor_name,
        doctor_position: options.doctor_position,
        doctor_departments: options.doctor_departments,
        doctor_hospital: options.doctor_hospital,
        doctor_subscribe_number: options.doctor_subscribe_number,
        doctor_id: options.doctor_id,
        hospitalId: options.hospitalId,
        departmentId: options.departmentId
      },
    });
    var that = this;

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          date_scroll: res.windowWidth - 27, //设置排班可滑动区域
        });
      }
    });


  },
  CheckIdentity: function () {
    var UserData = this.data.UserData;
    var prefix = app.globalData.setStorage.prefix;  //获得本地存储数据前缀
    var that = this;
    var RemindTime = this.data.RemindTime;
  
      co(function* () {
        var result = yield common.CheckVipMemberByUserId();
        var res = result.data;
        var userInfo = [];
        console.log(res.data);

        that.setData({
          unInfo: res.data.unInfo
        })
        UserData.MemberInformation = res.data.member_information;
        if (res.data.member_information == "会员订户" || res.data.member_information == "中国移动健康中心会员") {
          UserData.phone = res.data.member_phone;
        }
  
        console.log(UserData);
        wx.setStorageSync(prefix + 'UserData', UserData);
       
      });

    
  },
 
  onReady: function () {
    // 页面渲染完成
  },

  onShow: function () {
    // 页面显示

   
    co(function* () {
      var result = yield common.GetUserId();
      var UserData = result.data;
      that.setData({
        UserData: UserData,
        phone: UserData.phone
      })
      that.CheckIdentity();
      // that.checkUserInfo();  //检查是否获得用户头像等数据
    });


    var that = this;
    //获取用户id
    var UserData = wx.getStorageSync(app.globalData.setStorage.prefix + 'UserData');
    //console.log(UserData);
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
  getUserInfo: function () {

    var that = this;
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
        // that.showM();

      }
    })

  },
  LoadData: function () {
   
 
   
    var that = this;
    var data = this.data;
    var Collect = data.Collect;
    //获取排班信息
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface.php',
      data: {
        action: 'doctor_subscribe',
        openid: data.UserData.openid,
        hospitalid: data.doctor_data.hospitalId,
        doctorid: data.doctor_data.doctor_id,
        classid: data.doctor_data.departmentId,
        limit_start: data.limit_start,
        limit_num: data.limit_num,
      },
      method: 'GET',
      // header: {}, // 设置请求的 header
      success: function (res) {
        //console.log(res);
        if (res.data.Attention == "已收藏") {
          Collect = true;
        }
        that.setData({
          scheduling: res.data.scheduling,
          scheduling_keyuyue: res.data.scheduling_keyuyue,
          scheduling_show: res.data.scheduling,
          our_expert: res.data.our_expert,//推荐医生
          Collect: Collect,//是否收藏医生
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
  },
  //可预约排班 点击查看排号情况
  ViewScheduling: function (e) {
    var that = this;
    if (e.currentTarget.dataset.id) {
      var scheduling_id = e.currentTarget.dataset.id; //预约排班ID
      //console.log(e.currentTarget.dataset.id);
      this.setData({
        PickShow: '',
        scheduling_date: e.currentTarget.dataset.date, //排班日期
        scheduling_week: e.currentTarget.dataset.week, //排班是星期几
        scheduling_noon: e.currentTarget.dataset.noon, //排班 上午/下午
        scheduling_type: e.currentTarget.dataset.type, //排班类型
        inspecting_fee: e.currentTarget.dataset.fee,//诊疗费
        scheduling_id: e.currentTarget.dataset.id
      })
      //获取当前排班排号情况

      wx.request({
        url: 'https://f.12590.com/SlowDiseaseTreasure/interface.php',
        data: {
          action: 'SchedulingNo',
          schedulingno: e.currentTarget.dataset.id,
          hospitalid: that.data.doctor_data.hospitalId
        },
        method: 'GET',
        // header: {}, // 设置请求的 header
        success: function (res) {
          that.setData({
            SchedulingNo: res.data.SchedulingNo
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
      SchedulingNo:'',//清除排班号情况
      PickShow: 'none',
    })
  },
  //点击显示可预约排班
  ShowCanScheduling: function () {
    var me = this;
    this.setData({
      IfTotal: false,
      scheduling_show: me.data.scheduling_keyuyue
    })
  },
  //点击显示全部排班
  ShowTotalScheduling: function () {
    var me = this;
    this.setData({
      IfTotal: true,
      scheduling_show: me.data.scheduling
    })
  },

  //点击排班号拿到相关数据跳转至预约确认界面
  SchedulingDoctor: function (e) {
var  that =this;
    wx.getSetting({

      success: res => {

        //这里打印res 得到authSetting数组里scope 三条相关信息都是true 如果拒绝授权
        if (res.authSetting['scope.userInfo'] == false) {
          wx.openSetting({
            success: (res) => {
              if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
                that.getUserInfo();
              }
            }, fail: function (res) {

            }
          }) 


          }

      }
    })
   
  
    
    var data = this.data;
    var that = this;
    var UserData = this.data.UserData;
    var pages = this.data.pages;
    var prefix = app.globalData.setStorage.prefix;
    //console.log(e);
    //console.log(data);
    this.setData({
      scheduling_no_id: e.currentTarget.dataset.id,
    });
    var subscribe_time = data.scheduling_date + "（" + data.scheduling_week + "）" + data.scheduling_noon + " 第" + e.currentTarget.dataset.no + " " + e.currentTarget.dataset.no_time;
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
          console.log(data.UserData);
        

          //that.getUserInfo();   判断用户 是否 已经 授权 过  
          if (!1) {
            console.log(data.UserData);
            //提示要先登录
            that.ShowRemind("请先登录");
            setTimeout(function () {
              common.ToPages(pages, '../login/index?user_id=' + data.UserData.openid);
            }, 2000)
            //2s之后跳转到登录界面
          
            return;
          }
          //如果有，则把预约数据存到本地，并跳转至预约页面
          else {
            console.log(UserData);
            //判断下是否是会员，不是会员跳转到购买会员的页面
            if (UserData.MemberInformation != "会员订户" && UserData.MemberInformation != "健康俱乐部" && UserData.MemberInformation != "中国移动健康中心会员") {
              //提示要购买会员。
              that.ShowRemind("请先购买会员");

              /*
              //2s之后跳转到购买会员页面
              setTimeout(function () {
                common.ToPages(pages, '../buy_member/index?phone=' + UserData.phone);
              }, 2000)
              */
              //2s之后跳转到购买会员页面
              setTimeout(function () {
                wx.redirectTo({
                  url: '../buy_member/index?phone=' + UserData.phone,
                })               
              }, 2000)
              return;
            }
            //要增加的数组
            var subscribe_list = {
              doctor_data: data.doctor_data, //预约医生数据
              subscribe_time: subscribe_time,  //预约时段
              scheduling_type: data.scheduling_type, //预约门诊类型
              inspecting_fee: data.inspecting_fee, //诊查费

              hospitalId: data.doctor_data.hospitalId,
              scheduling_id: data.scheduling_id,
              scheduling_no_id: e.currentTarget.dataset.id
            };
            //将订单数据存储到本地（通过链接跳转会造成编码问题）
            wx.setStorage({
              key: prefix+"subscribe_list",
              data: subscribe_list,
            });
            //console.log(data.UserData);
            /**
             * 20171212
             * huangtianci  添加验证会员是否到期
            co(function* () {
              var result = yield common.CheckVipMemberByUserId2();
              var res = result.data;
              if (res.data.member_information == "会员订户到期" && res.data.member_information == "中国移动健康中心会员到期") {
                //提示要会员到期请先购买会员。
                console.log(111);
                that.ShowRemind("请先1111");
                //2s之后跳转到购买会员页面
                setTimeout(function () {
                  common.ToPages(pages, '../buy_member/index?phone=' + UserData.phone);
                }, 2000)
              }
            });
             */
            //先去数据库看下该用户是否曾经实名认证过
            wx.request({
              url: 'https://f.12590.com/SlowDiseaseTreasure/interface.php',
              data: {
                action: 'Check_User',
                openid: data.UserData.openid,
                time: data.UserData.expiration_time
              },
              method: 'GET',
              // header: {}, // 设置请求的 header
              success: function (res) {
                //console.log(res);
                //console.log(111);
                var pages = that.data.pages;
                //如果有实名数据
                console.log(res);
                if (res.data.result == 1) {
                  //跳转到预约确认页面
                  common.ToPages(pages, '../subscribe/index');

                }
                else {

                  //跳转到实名认证页面
                  wx.redirectTo({
                    url: '../subscribe_attestation/index',
                  });
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
        } else {
          //console.log('用户点击取消')
          that.setData({
            scheduling_no_id: 0,
          });
        }
      }
    })

  },

  //收藏医生
  AttentionDoctor: function () {
    var me = this;
    var AttentionDisabled = this.data.AttentionDisabled;
    if (!AttentionDisabled){
      this.setData({
        AttentionDisabled:true,
      })
      wx.request({
        url: 'https://f.12590.com/SlowDiseaseTreasure/interface.php',
        data: {
          action: 'Collect',
          openid: me.data.UserData.openid,
          hospitalid: me.data.doctor_data.hospitalId,
          classid: me.data.doctor_data.departmentId,
          doctorid: me.data.doctor_data.doctor_id,
          collecttype: 3
        },
        method: 'GET',
        // header: {}, // 设置请求的 header
        success: function (res) {
          //console.log(res)
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
            AttentionDisabled: false,
          })
        }
      })
    }
    

  },

  //取消收藏医生
  CancelAttentionDoctor: function () {
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
          hospitalid: me.data.doctor_data.hospitalId,
          classid: me.data.doctor_data.departmentId,
          doctorid: me.data.doctor_data.doctor_id,
          collecttype: 3
        },
        method: 'GET',
        // header: {}, // 设置请求的 header
        success: function (res) {

          if (res.data.result != 1) {
            me.ShowRemind("取消收藏失败");
            return
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

  //分享
  onShareAppMessage: function () {
    var doctor_data = this.data.doctor_data;
    var that = this;
    return {
      title: "微笑医生推荐",
      path: 'pages/doctor_subscribe/index?doctor_cover=' + doctor_data.doctor_cover + "&doctor_name=" + doctor_data.doctor_name + "&doctor_position=" + doctor_data.doctor_position + "&doctor_departments=" + doctor_data.doctor_departments + "&doctor_hospital=" + doctor_data.doctor_hospital + "&doctor_subscribe_number=" + doctor_data.doctor_subscribe_number + "&doctor_id=" + doctor_data.doctor_id + "&hospitalId=" + doctor_data.hospitalId + "&departmentId=" + doctor_data.departmentId,
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
        that.ShowRemind("分享失败")
      }
    }
  },
  //跳转页面
  SkipPage: function (e) {
    var pages = this.data.pages;
    common.ToPages(pages, e.currentTarget.dataset.url);
  },


})