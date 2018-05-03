// pages/online_consultant/tuwen_online_consultant_pay/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    RemindShow: 'none',  //是否出现提示
    RemindTime: '2000',
    PBRQ:"",
    PBRQ_y:"",
    WEEKDAY:"",
    TIME:"",
    HX:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.setData({
      PBMXXH: options.PBMXXH,
      PBRQ: options.PBRQ,
      PBRQ_y: options.PBRQ_y,
      HX: options.HX,
      WEEKDAY:options.WEEKDAY,
      TIME:options.TIME,
    })
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface_htc.php',
      data: {
        action: 'MoreFamily',
        openid:'oJKz_0FGSgflXEWAq_DigG8D_gg8',
        //openid: that.data.UserData.openid
      },
      method: 'GET',
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log(res);
        var FamilyMember = res.data.MoreFamilyData;

        //查找默认联系人
        for (var x in FamilyMember) {
          if (FamilyMember[x].IsDefault == "默认") {
            var SeekingPerson = {
              family_user_autoid: FamilyMember[x].Family_User_Autoid, 
              seeking_person: FamilyMember[x].User_Name, //就诊人
              certificate_type: FamilyMember[x].Card_Type, //证件类型
              certificate_number: FamilyMember[x].Card_Type_Id, //证件号
              phone: FamilyMember[x].User_Phone, //手机号
              sex: FamilyMember[x].User_Sex, //性别
              yb_cardid: FamilyMember[x].YB_CardId,//医保卡号
              jz_cardid: FamilyMember[x].JZ_CardId,//就诊卡号
            };
          }
        }
        //console.log(res.data.User_List);

        that.setData({
          FamilyMember: FamilyMember,
          SeekingPerson: SeekingPerson,
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
  //选择就诊联系人
  bindPickerChange: function (e) {
    //console.log(e);
    var FamilyMember = this.data.FamilyMember;
    var idx = e.detail.value;
    var SeekingPerson = {
      family_user_autoid: FamilyMember[idx].Family_User_Autoid, //就诊人id
      seeking_person: FamilyMember[idx].User_Name, //就诊人
      certificate_type: FamilyMember[idx].Card_Type, //证件类型
      certificate_number: FamilyMember[idx].Card_Type_Id, //证件号
      phone: FamilyMember[idx].User_Phone, //手机号
      sex: FamilyMember[idx].User_Sex, //性别
    };

    this.setData({

      SeekingPerson: SeekingPerson,

    });
  },
  querenyuyue:function(){
    var that=this;
    //console.log(that);
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface_htc.php', //仅为示例，并非真实的接口地址
      data: {
        action: 'querenyuyue',
        PBMXXH: that.data.PBMXXH,
        PBRQ: that.data.PBRQ,
        WEEKDAY: that.data.WEEKDAY,
        TIME: that.data.TIME,
        HX: that.data.HX,
        family_user_autoid:that.data.SeekingPerson.family_user_autoid, //就诊人id
        user_name:that.data.SeekingPerson.seeking_person, //就诊人
        card_type:that.data.SeekingPerson.certificate_type, //证件类型
        card_type_id:that.data.SeekingPerson.certificate_number, //证件号
        user_phone:that.data.SeekingPerson.phone, //手机号
        user_sex:that.data.SeekingPerson.sex, //性别
        consultation_type:"1",//咨询类型：1、语音咨询；2视频咨询

        doctor_list_autoid:"1",
        doctor_name:"朱勇",
        open_id:"oJKz_0FGSgflXEWAq_DigG8D_gg8",

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        that.ShowRemind(res.data.error);
      },
      fail: function (res) {
        console.log(res.data)
      }
    })
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
})