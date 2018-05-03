// pages/doctor_multi_sited_license/index.js
//获取全局的应用实例
var app = getApp();
//引用公共文件
var common = require('../../common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    RemindShow: 'none',  //是否出现提示
    RemindText: '',  //提示文字
    RemindTime: 1000, //提示存在时间(ms)
    hospital_id: '',
    hospital_index: '',
    departments_id: '',
    professional_index: '',
    professional_id: '',
    BtnDisabled:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取用户id
    var UserData = wx.getStorageSync(app.globalData.setStorage.prefix + 'UserData');
    console.log(UserData);
    this.setData({
      UserData: UserData,
    })
    //获取医院/科室
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface.php',
      data: {
        action: 'hospital_data',
      },
      method: 'GET',
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res);
        that.setData({
          hospital_data: res.data.hospital_data,
          professional_title_list: res.data.professional_title_list,
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
  //监听用户选择医院
  HospitalSelect: function (e) {
    //console.log(e);
    var hospital_data = this.data.hospital_data;
    //console.log(e.detail.value);
    var that = this;
    that.setData({
      hospital_index: e.detail.value,
      hospital_id: hospital_data[e.detail.value].hospital_id,
      hospital_name: hospital_data[e.detail.value].hospital_name,
      departments_index: 0,
      departments_list: hospital_data[e.detail.value].departments_list,
    })

  },
  //监听用户选择科室
  DepartmentsSelect: function (e) {
    //console.log(e);
    var data = this.data;
    var departments_list = this.data.departments_list;

    this.setData({
      hospital_index: data.hospital_index,
      departments_index: e.detail.value,
      departments_id: departments_list[e.detail.value].departments_id,
      departments_name: departments_list[e.detail.value].departments_name,
    })

  },
  //监听用户选择职称
  ProfessionalTitleSelect: function (e) {
    //console.log(e);
    var data = this.data;
    var professional_title_list = this.data.professional_title_list;
    this.setData({
      professional_index: e.detail.value,
      professional_id: professional_title_list[e.detail.value].professional_id,
      professional_title: professional_title_list[e.detail.value].professional_title,
    })

  },

  //点击保存
  SaveDoctorPractice:function(e){
    console.log(e);
    var type = e.target.dataset.type;
    var data = this.data;
    var UserData = this.data.UserData;
    var prefix = app.globalData.setStorage.prefix;
    var that = this;
    this.setData({
      BtnDisabled: true,
    })
    if (!data.hospital_id) {
      this.ShowRemind("请选择就职医院");
      this.setData({
        BtnDisabled: false,
      })
      return;
    } else if (!data.departments_id) {
      this.ShowRemind("请选择所在科室");
      this.setData({
        BtnDisabled: false,
      })
      return;
    } else if (!data.professional_id) {
      this.ShowRemind("请选择职称");
      this.setData({
        BtnDisabled: false,
      })
      return;
    } else {
      //医生新增执业机构
      var ajax_data = {
        userid: data.UserData.openid,
        hospital_id: data.hospital_id,
        hospital_name: data.hospital_name,
        departments_id: data.departments_id,
        departments_name: data.departments_name,
        professional_id: data.professional_id,
        professional_title: data.professional_title,
      };
      console.log(ajax_data);
      //资料保存
      wx.request({
        url: 'https://f.12590.com/SlowDiseaseTreasure/interface3.php?action=AddDoctorPractice',
        data: ajax_data,
        method: 'GET',
        // header: {}, // 设置请求的 header
        success: function (res) {
          console.log(res);
          
          if (res.data.errcode == "400016") {
            if (type =="SaveSingle"){
              setTimeout(function () {
                wx.redirectTo({ url: '../doctor_index/index' });
              }, data.RemindTime);
              wx.setStorageSync(prefix + "UserData", UserData);
            }
              
          }
          
          that.ShowRemind(res.data.errmsg);
        },
        fail: function (res) {
          // fail
        },
        complete: function (res) {
          // complete
          that.setData({
            BtnDisabled: false,
          })
        }
      });
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
  }
})