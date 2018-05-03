// pages/changeUserSection/index.js
var Config = require('../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  loading:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  //获取本地存储
    var userPhone = wx.getStorageSync('SMDC_UserData');
    this.setData({
      openid:userPhone.openid
    })
    this.LoadData();
  },
  LoadData:function(){
    //向服务器请求数据
    var openid = this.data.openid;
    var _this=this;
    wx.request({
      url: Config.req_link() ,
      data:{
        action:'getUserSection',
        openid: openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {    
        //用户现在有的 栏目
       var user_section=res.data.user_section;
       //全部的 栏目
       var all_section=res.data.section;
       var userSection=[];
       //可选择的栏目
       var  chice_section =[];
       if(user_section.length>0)
       {   
         for (var i = 0; i < all_section.length; i++)
        {
           for (var j = 0; j < user_section.length;j++ )
           {
             if (all_section[i].autoid == user_section[j].autoid)
             {
                 break;
             } 
           }
           if (j >= user_section.length) {
             all_section[i].class = "";
           } else {
             all_section[i].class = "click_section";
           }
           chice_section.push(all_section[i]);
         }
         var user_section_class=[];
         for (var j = 0; j < user_section.length; j++)
          {
            if(j%3==0)
            {
              user_section[j].class = "border_0";
            } else if (j % 3 == 1){
              user_section[j].class = "border_1";
            }else
            {
              user_section[j].class = "border_2";
            }
            user_section_class.push(user_section[j]);
           
         }
         user_section = user_section_class;
       }
       console.log(chice_section);
       console.log(user_section);
       chice_section = all_section;
       _this.setData({
         chice_section: chice_section,
         user_section: res.data.user_section,
         loading:false
       })

      }

    })


  },
  navbak:function()
  {
    wx.navigateBack();  
  },
  removeSection:function(e)
  {
    console.log(e);
    var openid = this.data.openid;
    var _this=this;
    wx.request({
      url: Config.req_link(),
      data:{
        action:"dealSection",
        section_id:e.currentTarget.dataset.index,
        openid: openid

      },
      success:function(res)
      {
        wx.showToast({
          title: '修改栏目成功',
        })
        _this.LoadData();

      }
    })

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
  
  }
})