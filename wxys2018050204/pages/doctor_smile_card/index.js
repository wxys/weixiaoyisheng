// pages/doctor_smile_card/index.js
//获取全局的应用实例
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    UserData: {},
    DoctorData: {
      "doctor_id": '1',
      "doctor_name": '柯剑',
      "doctor_professional": '主治医师',
      "doctor_hospital": [
        {
          "hospital_name": '福建省立医院',
          "department_name": '儿科',
        }
      ]
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var pages_object = getCurrentPages();//获取当前页面栈
    var sys = wx.getSystemInfoSync();

    var prefix = app.globalData.setStorage.prefix;
    //获取用户id
    var UserData = wx.getStorageSync(prefix + 'UserData');
    this.setData({
      UserData: UserData,
      pages: pages_object.length,//页面栈数
      PageScrollHeight: sys.windowHeight - 55,
    })
    //获取医生资料
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface_ysc.php',
      data: {
        action: 'doctor_info',
        userid: UserData.openid,
      },
      method: 'GET',
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res);
        that.setData({
          DoctorData: res.data.DoctorData,
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


})