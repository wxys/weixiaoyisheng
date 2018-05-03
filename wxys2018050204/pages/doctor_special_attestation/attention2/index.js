// pages/doctor_special_attestation/attention2/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ContentImgList: {
      "breviary": [
        "https://f.12590.com/SlowDiseaseTreasure/images/wxys-1-breviary.jpg",
        "https://f.12590.com/SlowDiseaseTreasure/images/wxys-3-breviary.jpg",

      ],
      "artwork": [
        "https://f.12590.com/SlowDiseaseTreasure/images/wxys-1.jpg",
        "https://f.12590.com/SlowDiseaseTreasure/images/wxys-3.jpg",

      ]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  //预览文章图片
  ViewImage: function (e) {
    //console.log(e);
    var img_url = e.currentTarget.dataset.url;
    var ImgList = this.data.ContentImgList.artwork;
    wx.previewImage({
      current: img_url, // 当前显示图片的http链接
      urls: ImgList // 需要预览的图片http链接列表
    })
  },

})