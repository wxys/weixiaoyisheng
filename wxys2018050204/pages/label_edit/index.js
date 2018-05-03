// pages/favorite/label_edit/index.js
//获取全局的应用实例
var app = getApp();
//引用公共文件
var common = require('../../../common.js');
Page({
  /**
   * 页面的初始数据
   */
   data:{
    PageShow:false,
    RemindShow: 'none',  //是否出现提示
    RemindText: '',
    RemindTime: '1000',
    InputHasBorder:false,
    LabelEditWidth:70,
    ShowDeleteLabel:false,
    DeleteNoteLabelIndex:-1,
    laebl_name:'',
    OperateDisabled:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options);
    var prefix = app.globalData.setStorage.prefix;
    //获取用户id
    var UserData = wx.getStorageSync(prefix + 'UserData');
    this.setData({
      UserData: UserData,
      msg_id: options.msg_id,
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
    var that = this;
    var UserData = this.data.UserData;
    var msg_id = this.data.msg_id;
    //获取便签数据
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface_ysc.php',
      data: {
        action: 'init_label',
        userid: UserData.openid,
        msg_id: msg_id,
      },
      method: 'GET',
      success: function (res) {
        console.log(res);
        that.setData({
          LabelList: res.data,
          PageShow:true,
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },
  //监听添加标签输入
  EditLabelInput:function(e){
    //console.log(e)
    var label_content = e.detail.value;
    //var LabelEditWidth = this.data.LabelEditWidth;
    //console.log(label_content);
    if (label_content){
      //console.log("有内容");
      this.setData({
        InputHasBorder: true,
      })
      if (label_content.length>4){
        //非中文个数
        var notchineseCnt = label_content.replace(/[^\x00-\xff]/g, '').length;

        var LabelEditWidth = ((label_content.length - notchineseCnt) * 15) + (notchineseCnt*8) + 10;

        this.setData({
          LabelEditWidth: LabelEditWidth,
          
        })
      }
      
    }else{
      //console.log("空");
      this.setData({
        InputHasBorder: false,
        LabelEditWidth:70,
      })
    }
  },
  //点击删除文章标签
  DeleteNoteLabelIndex:function(e){
    //console.log(e);
    var idx=e.target.dataset.idx;
    this.setData({
      DeleteNoteLabelIndex:idx,
    })
  },
  //删除文章标签
  DeleteNoteLabel:function(e) {
    //console.log(e);
    var id = e.target.dataset.id;
    var msg_id = this.data.msg_id;
    var UserData = this.data.UserData;
    var that = this;
    var OperateDisabled = this.data.OperateDisabled;
    if (!OperateDisabled){
      that.setData({
        OperateDisabled:true,
      })
      //删除文章标签
      wx.request({
        url: 'https://f.12590.com/SlowDiseaseTreasure/interface_ysc.php',
        data: {
          action: 'add_label2',
          msg_id: msg_id,
          is_up: 0,
          label_id: id,
        },
        method: 'GET',
        success: function (res) {
          console.log(res);
          if (res.data.errcode == "500009") {
            that.setData({
              DeleteNoteLabelIndex: -1,
            })
            that.ShowRemind(res.data.errmsg);
            that.onShow();
          } else {
            that.ShowRemind(res.data.errmsg);
          }

        },
        fail: function (res) {
          // fail
        },
        complete: function (res) {
          // complete
          that.setData({
            OperateDisabled: false,
          })
        }
      });
    }
    //console.log(id);
   
  },
  //操作我的标签
  OperateAllLabel:function(e){
    var id = e.target.dataset.id;
    var msg_id = this.data.msg_id;
    var UserData = this.data.UserData;
    var that = this;
    var OperateDisabled = this.data.OperateDisabled;
    if (!OperateDisabled){
      that.setData({
        OperateDisabled: true,
      })
      wx.request({
        url: 'https://f.12590.com/SlowDiseaseTreasure/interface_ysc.php',
        data: {
          action: 'add_label2',
          msg_id: msg_id,
          is_up: 1,
          label_id: id,
        },
        method: 'GET',
        success: function (res) {
          console.log(res);
          if (res.data.errcode) {

            that.setData({
              DeleteNoteLabelIndex: -1,
            })
            that.ShowRemind(res.data.errmsg);
            that.onShow();
          } else {
            that.ShowRemind("操作失败");
          }

        },
        fail: function (res) {
          // fail
        },
        complete: function (res) {
          // complete
          that.setData({
            OperateDisabled: false,
          })
        }
      });
    }
    

  },
  //点击隐藏删除按钮
  CancelDeleteIndex:function(){
    this.setData({
      DeleteNoteLabelIndex: -1,
    })
  },
  //添加标签
  AddLabelFinish:function(e){
    var msg_id = this.data.msg_id;
    var UserData = this.data.UserData;
    var that=this;
    var OperateDisabled = this.data.OperateDisabled;
    //console.log(e);
    var label_name = e.detail.value;
    if (!label_name){
      this.ShowRemind("请输入标签内容");
      return;
    }else{
      if (!OperateDisabled) {
        that.setData({
          OperateDisabled: true,
        })
        //保存文字标签数据
        wx.request({
          url: 'https://f.12590.com/SlowDiseaseTreasure/interface_ysc.php',
          data: {
            action: 'add_label',
            userid: UserData.openid,
            msg_id: msg_id,
            label_name: label_name,
          },
          method: 'GET',
          success: function (res) {
            //console.log(res);
            if (res.data.errcode == "500008") {
              that.setData({
                laebl_name: '',
              })
              that.ShowRemind(res.data.errmsg);
              that.onShow();
            } else {
              that.ShowRemind(res.data.errmsg);
            }
          },
          fail: function (res) {
            // fail
          },
          complete: function (res) {
            // complete
            that.setData({
              OperateDisabled: false,
            })
          }
        });
      }
      
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
})

