
// pages/personal/index.js  
//引用公共文件 

//引入co函数支持
const Promise = global.Promise = require('../../libs/es6-promise')
const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
//获取全局的应用实例
var app = getApp();
//引用公共文件
var common = require('../../common.js');
var publicFun = require('../../config.js');
// pages/follow/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:true,
    currentTab:0
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  console.log(options);
  this.setData({
    diseaseid:options.id
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
  onShow: function (options) {
    //console.log(options);
    var diseaseId='';
    this.loadData();

  
  }, 
   /** 
   * 点击tab切换 
   */
  swichNav: function (e) {

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },
  powerDrawer:function()
  {
    this.setData({
      show_jihuo:false
    })

  },
  exitE:function()
  {
    this.setData({
      show_jihuo: false,
      newFname:''
    })

  },
  userItap:function(e)
  {

    var _this = this;
    var dataset = e.currentTarget.dataset;
   var value = e.detail.value;
    console.log(e);
    var allproject = this.data.project;
    var i;
    for (i in allproject) {
      if (i == dataset.type) {
        for (var j = 0; j < allproject[i].list.length; j++) {
          if (allproject[i].list[j].id == dataset.idx) {
         
            allproject[i].list[j].answer=value;
          }
        }
      }

    }
    _this.setData({
      project: allproject
    })
    console.log(allproject);

  },
  nameInputChange:function(e)
  {
    var value = e.detail.value;
    this.setData({
      newFname:value
    })

  },
  saveE:function()
  {
    var newFname = this.data.newFname;
    var newType = this.data.newType;
    var diseaseId = this.data.disease.id;
    var _this=this;
    if (newFname != '' && newFname != null && newFname!=undefined)
    {
     
      wx.request({
        url: publicFun.fowxll(),
        data:{
          action:"saveF",
          newFname: newFname,
          newType: newType,
          diseaseId: diseaseId

        }, 
        header: { 'Content-Type': 'application/json' },
        success: function (res)
        {
          if(res.data.state==1)
          {
            //修改  拿到的project   
            var project =_this.data.project;
            var i ;
            for (i in project )
            {
              if (i == newType)
              {

                if (project[i].addlist == null || project[i].addlist == undefined || project[i].addlist =='' )
                {
                  project[i].addlist=[];
                  project[i].addlist.push(newFname);
                }

              }
            }
            _this.setData({
              show_jihuo: false,
              newFname: '',
              project: project
            })

    

          }else{
            _this.setData({
              tips:'操作失败'
            })

          }
          console.log(_this.data.project);
        }
      })

    }else{
      this.setData({
        tips:"请输入内容"
      })
    }

  },
  bindTextAreaBlur: function (e) {
    var yizhu =e.detail.value;
    this.setData({
      yizhu:yizhu
    })
  },
  subthing:function()
  {
    var project = this.data.project;
    var subFlag=true;
    var yizhu=this.data.yizhu;
    var _this=this;
    console.log(yizhu);
    if (yizhu == null || yizhu == undefined || yizhu == '')
    {
      wx.showToast({
        title: '请填写医嘱'
       
      })


    }else{
      var lproject=[];
      for(var i in project)
      {
        for(var j=0;j<project[i].list.length;j++)
        {
          if (project[i].list[j].option.length!=0)
          {
            var k = 0;
            for (; k < project[i].list[j].option.length; k++)
             {
              if (project[i].list[j].option[k].select == 1) {
                lproject.push(JSON.stringify(project[i].list[j]));
                break;

              }
          }
            if (k == project[i].list[j].option.length) {
              
              wx.showToast({
                title: '请填写完整'

              })
              subFlag = false;
              break;
            }
          }
          else{
            lproject.push(JSON.stringify(project[i].list[j]));
            
          }


        }

///1111
      }
      if (subFlag)
      {

      wx.request({
        url: publicFun.fowxll(),
        data:{
          action:"savefollow",
          project: JSON.stringify(lproject),
          yizhu: _this.data.yizhu,
          diseaseId:_this.data.disease.id,
          userId:1

        },
        method:"POST",
        header: { "Content-Type": "application/x-www-form-urlencoded"},
        success: function (res) {
          if(res.data==1)
          {
            wx.showToast({
              title: '成功',
              icon: 'succes',
              duration: 1000,
              mask: true
            })
            wx.navigateTo({ url: "../follow_result/index?id=" + _this.data.disease.id + "&disease=" + _this.data.disease.name}
            
            )

          }
        }
      })

      }

    }
    

  },

  
  addshow:function(e)
  {
    var type = e.currentTarget.dataset.type;
    console.log(e.currentTarget.dataset);
    this.setData({
      show_jihuo:true,
      newType:type
    })

  },
  showOp:function(e)
  {
console.log(e);
var _this=this;
    var dataset = e.currentTarget.dataset;
var allproject=this.data.project;
var i;
    for (i in allproject)
    {
      if (i == dataset.type)
      {
        for (var j=0;j<allproject[i].list.length;j++)
        {
          if (allproject[i].list[j].id == dataset.idx)
          {
            if (allproject[i].list[j].show==1)
            {
              allproject[i].list[j].show = 0;
            }else{
              allproject[i].list[j].show = 1;
            }
            
          }
        }
      }
    }
    _this.setData({
      project: allproject
    })
    console.log(allproject);

  },
  chice:function(e)
  {
    var _this = this;
    var dataset = e.currentTarget.dataset;
    console.log(dataset.option);
    var allproject = this.data.project;
    var i;
    for (i in allproject) {
      if (i == dataset.type) {
        for (var j = 0; j < allproject[i].list.length; j++) {
          if (allproject[i].list[j].id == dataset.idx) {
            for (var k = 0; k < allproject[i].list[j].option.length;k++)
            {
              if (allproject[i].list[j].option[k].option == dataset.option)
              {
                allproject[i].list[j].option[k].select=1;
              }else{
                allproject[i].list[j].option[k].select = 0;
              }
            }

          }
        }
      }
    }
    _this.setData({
      project: allproject
    })
    console.log(allproject);
  },
  loadData:function()
  {
    var diseaseId=this.data.diseaseid;
    var _this=this;
    wx.request({
      url: publicFun.fowxll(),
      data:{
        diseaseId: diseaseId,
        action:'getproject'
      },
      type:'post',
      header: { 'Content-Type': 'application/json' },
      success:function(res)
      {
        console.log(res.data);
        _this.setData({
          loading:false,
          project:res.data.symptom,
          disease: res.data.disease
        })
      }

    })

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