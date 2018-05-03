Page({
  onLoad:function()
  {
   /* var identity = wx.getStorageSync('wxysidentity');
    if (identity == '医生')
    {
      wx.redirectTo({
        url: '../patient_management/index',
      })

    } else if (identity == '管理员' || identity == '患者'){
      wx.switchTab({
        url: '../Health_headlines/index',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }*/
   
  },
  stoichToH:function(e)
  {
    var me = e.currentTarget.dataset.me;
    wx.setStorageSync('wxysidentity', me);
   if(me=='医生')
   {
     wx.redirectTo({
       url: '../doctor_login/index',
     })

   }else
   {
     wx.switchTab({
       url: '../Health_headlines/index',
       success: function (res) { },
       fail: function (res) { },
       complete: function (res) { },
     })
   }
  
     
 
  }

})