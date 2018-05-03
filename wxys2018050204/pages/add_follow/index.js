// pages/add_follow/indx.js
// pages/patient_data/index.js
// pages/my_attention/index.js
//引入co函数支持
const Promise = global.Promise = require('../../libs/es6-promise')
const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
var app = getApp(); //获取全局的应用实例
//引用公共文件
var common = require('../../common.js');
var publicFun = require('../../config.js');
//引入图片预加载组件
const ImgLoader = require('../../img-loader/img-loader.js');
Page({

  /**
   * 页面的初始数据mySelect
   */
  data: {
    selectPerson: true,
    firstPerson: '科室选择',
    selectArea: false,
    loading: true,
    selectDArea: false,
    selectdisease: true,
    firstdisease: "疾病选择",
    imagenone:27,
    diseaseSelect:[],
    _num:27,
    quchong:[],
    disea:'',
   
    condition:27,

  },
  topSelectShouqi: function () {
    var that = this;
    that.setData({
      xialaleftshow: 0,
      xialarightshow: 0,
      isxialaleft: 0,
      isxialaright: 0
    })
  },
  //点击选择类型
  clickPerson: function () {
    var selectPerson = this.data.selectPerson;
    if (selectPerson == true) {
      this.setData({
        selectArea: true,
        selectPerson: false,
      })
    } else {
      this.setData({
        selectArea: false,
        selectPerson: true,
      })
    }
  },
  clickdisease: function () {
    var selectdisease = this.data.selectdisease;
    if (selectdisease == true) {
      this.setData({
        selectDArea: true,
        selectdisease: false,
      })
    } else {
      this.setData({
        selectDArea: false,
        selectdisease: true,
      })
    }

  },
  //点击切换
  


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
       
        console.log(res);
        _this.setData({
          height: res.windowHeight*2-156
        })


      }
    })
    this.loadData();
     
    
  },
  mySelect: function (e) {
   
   
    //var clickeds = e.target.dataset.idx;
   
    this.setData({
      _num: e.target.dataset.idx,
      imagenone: e.target.dataset.idx,
      condition: e.target.dataset.idx,
    })
   

  },
  //点击选择类型
  clickPerson: function () {

    var selectPerson = this.data.selectPerson;
    if (selectPerson == true) {
      this.setData({
        selectArea: true,
        selectPerson: false,
      })
    } else {
      this.setData({
        selectArea: false,
        selectPerson: true,
      })
    }
  },
  sdisease:function(e){
    var _this=this;
    var index = e.target.dataset.key;
    var disea = this.data.disea;
    disea = e.target.dataset.desdata;
    var finarr = [];

    var findisease = [];
    if (disea[index].set == 1) {
      
      wx.showModal({
        title: '提示',
        content: "是否取消选择？",
        success: function (res) {
          if (res.confirm) {
            //console.log(111111);
            disea[index].set = 0;
           // console.log(disea);
            _this.setData({
              disease: disea,
            })         
            findisease = disea;
           // console.log(findisease);
          
            finarr.splice(0, finarr.length);
            for (var i = 0; i < findisease.length; i++) {
              if (findisease[i].set == 1) {
                finarr.push(findisease[i]);
              }
            }
            console.log(finarr);
            _this.setData({
              finish: finarr,
            })



          }else{
            findisease = disea;
            // console.log(findisease);

            finarr.splice(0, finarr.length);
            for (var i = 0; i < findisease.length; i++) {
              if (findisease[i].set == 1) {
                finarr.push(findisease[i]);
              }
            }
            console.log(finarr);
            _this.setData({
              finish: finarr,
            })
          }
        }
      })
      
    } else if (disea[index].set == 0) {
      disea[index].set = 1; 
      _this.setData({
        disease: disea,
      }) 
      var findisease = e.target.dataset.desdata;
      //console.log(findisease);
      var finarr = this.data.finish;
      finarr.splice(0, finarr.length);
      for (var i = 0; i < findisease.length; i++) {
        if (findisease[i].set == 1) {
          finarr.push(findisease[i]);
        }
      }
      _this.setData({
        finish: finarr,
      })
   }
    
    //console.log(this.disease);
    
    
     
  },
  //获取宽度
   
  //已选择
 
  deletesed:function(e){
    var disid = e.target.dataset.deletesed;
    var disname = e.target.dataset.diselectname;
    var quchongs = this.data.quchong;
    var diseaseSelectd = e.target.dataset.diseaseselect;
    for (var i = 0; i < diseaseSelectd.length ;i++){
      if (diseaseSelectd[i].disid == disid){
        diseaseSelectd.splice(i,1);
      }
   }
    for (var j = 0; j < quchongs.length; j++) {
      if (quchongs[j] == disname) {
        quchongs.splice(j, 1);
      }
    }
    this.setData({
      diseaseSelect: diseaseSelectd,
    })
  },
  //疾病确认
  sure: function (e) {
    var diseaseSelect = e.target.dataset.diseasesure;
    console.log(diseaseSelect);
    wx.request({
      url: publicFun.follow(),
      data: {
        action: 'addfollow',
        suredisease: diseaseSelect
      },
      header: {
        'content-type': 'application/json' // 默认值
      }

    })
    // console.log(suredisease);
  },
  clickTime: function () {
    var selectTime = this.data.selectTime_hidden;
    console.log(selectTime);
    if (selectTime == true) {
      this.setData({
        selectArea: true,
        selectTime_hidden: false,
      })
    } else {
      this.setData({
        selectArea: false,
        selectTime_hidden: true,
      })
    }

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

  }, loadData: function () {
    var _this = this;
    wx.request({
      url: publicFun.follow(),
      data: {
        action: 'getproject'
      },
      header: {
        'content-type': 'application/json' // 默认值
      }, success: function (res) {
        console.log(res.data);
        var linshiproject = res.data.department;
        for (var i = 0; i < linshiproject.length;i++){
          linshiproject[i].isset=0;
        }
        var finarr = [];
        var findisease = res.data.disease;
        finarr.splice(0, finarr.length);
        for (var j = 0; j < findisease.length; j++) {
          if (findisease[j].set == 1) {
            finarr.push(findisease[j]);
          }
        }
        _this.setData({
          loading: false,
          project: linshiproject,
          disease: res.data.disease,
          finish: finarr
        })
        // firstPerson: res.data[0].name, firstdisease: res.data[0].child[0].name
      }

    })
   
  }
})