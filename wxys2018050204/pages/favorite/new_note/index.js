// pages/new_note/index.js
//引用公共文件
var common = require('../../common.js');
//引入图片预加载组件
const ImgLoader = require('../../img-loader/img-loader.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    UserData: {},
    PageShow: false,
    ImgLoadNum: 1, //图片加载次数
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
    // 页面显示
    var config = common.procedure_config(); //获取小程序配置数据
    var that = this;
    //获取用户openid
    wx.getStorage({
      key: 'UserData',
      success: function (res) {
        //console.log(res);
        if (res.data) {
          that.setData({
            UserData: res.data,
          });
        }
      },
      complete: function () {
        var UserData = that.data.UserData;//本地存储用户数据
        //console.log(UserData);

        //如果没有用户相关数据
        if (!UserData.hasOwnProperty('openid')) {
          //获取用户登录态信息
          wx.login({
            success: function (res) {
              var code = res.code;
              wx.request({
                url: 'https://f.12590.com/SlowDiseaseTreasure/interface.php',
                header: {
                  'Content-Type': 'application/json'
                },
                data: {
                  'action': 'GetUserOpenId',
                  'appid': config.appid,
                  'secret': config.secret,
                  'js_code': code,
                  'grant_type': 'authorization_code',

                },
                success: function (res) {
                  //console.log(res);
                  //将用户数据存储到本地
                  UserData.openid = res.data.openid;
                  UserData.phone ="13888888888";
                  wx.setStorage({
                    key: "UserData",
                    data: UserData,
                  });
                  //更新数据
                  that.setData({
                    UserData: UserData,
                  });
                },
                complete: function () {
                  that.LoadData();
                }
              });

            }
          });

        } else {

          that.LoadData();
        }


      }
    });
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
  //加载数据
  LoadData: function () {
    var UserData = this.data.UserData;
    //console.log(UserData);
    var that = this;
    var ImgLoadNum = this.data.ImgLoadNum;  //图片加载次数
    //获取科室及医院列表
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface.php',
      data: {
        action: 'GetNoteList',
      },
      method: 'GET',
      success: function (res) {
        //console.log(res)
        var NoteList=[
          {
            "note_id":'1',
            "note_title":'短信标题短信标题短信标题短信标题短信标题短信标题',
            "ImgUrl":'https://f.12590.com/SlowDiseaseTreasure/icon/kouqiangke.jpg',
            "note_time": '05-13',
          },
          {
            "note_id": '2',
            "note_title": '短信标题短信标题短信标题短信标题短信标题短信标题',
            "ImgUrl": 'https://f.12590.com/SlowDiseaseTreasure/icon/kouqiangke.jpg',
            "note_time": '05-13',
          }
        ];
        if (ImgLoadNum == 1) {
          //设置图片预加载效果
          var NoteCoverList = common.genImgData(NoteList); //短信封面图片列表
        } else {
          var NoteCoverList = common.LoadedImgData(NoteList);  //短信封面图片列表
        }
        that.setData({
          NoteList: NoteList,
          NoteCoverList: NoteCoverList,
          PageShow: true,
        });
        //初始化图片预加载组件，并指定统一的加载完成回调

        //图片预加载
        that.imgLoader = new ImgLoader(that, that.ImageOnLoad.bind(that))
        //console.log(NoteCoverList);
        that.LoadImages(NoteCoverList); 
        //记录图片加载次数
        ImgLoadNum = ImgLoadNum + 1;
        that.setData({
          ImgLoadNum: ImgLoadNum,
        })

        //加载完数据停止下拉刷新
        wx.stopPullDownRefresh();
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete

      }
    });
  },
  /*
    图片加载回调
  */
  //加载图片
  LoadImages(arr) {
    //console.log(arr);
    var that = this;
    //同时发起全部图片的加载
    if (arr) {
      arr.forEach(item => {
        //console.log(item.url);
        this.imgLoader.load(item.url)
      })
    }

  },
  //加载完成后的回调
  ImageOnLoad(err, data) {
    console.log('图片加载完成', err, data.src)
    if (this.data.NoteCoverList) {
      const NoteCoverList = this.data.NoteCoverList.map(item => {
        if (item.url == data.src) {
          item.loaded = true
        }
        return item
      })
      this.setData({
        NoteCoverList,
      })
    }
  },
})