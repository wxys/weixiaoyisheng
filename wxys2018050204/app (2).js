//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    /*
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    */
  },
  //全局变量
  globalData: {
    hasLogin: false,
    AcceptLogin: false,
    //小程序相关参数的配置
    program_parameter: {
      'appid': 'wx991ceea9427bc872',//AppID
      'secret': '22fed7c2b316642b889fea08f5c86153',//AppSecre
      'mch_id': '1267426901',//商户号
      'api_key': 'aRYjgOlxkfDiXfoIsih7e3xmvCnfRQAH',//API密钥
    },
    setStorage: {
      'prefix': 'SMDC_',  //本地存储前缀

    },


  },
  history: [],//用户访问历史记录

})