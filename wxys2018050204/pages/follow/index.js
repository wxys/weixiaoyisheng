
// pages/personal/index.js  
//引用公共文件 

//引入co函数支持
const Promise = global.Promise = require('../../libs/es6-promise')
const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')
//获取全局的应用实例
var app = getApp();
//引用公共文件
var ratio =8;// 每个刻度所占位的px

var minValueH = 70;// 最小刻度值
var maxValueH = 220;// 最大刻度值
var currentValueH = 80;// 当前刻度值
const SUBS = maxValueH - minValueH;
//ratio = Math.round(500 / (maxValueH-minValueH));



var minValueW = 50;// 最小刻度值
var maxValueW = 140;// 最大刻度值
var currentValueW = 60;// 当前刻度值
const SUBW = maxValueW - minValueW;


var minxlV = 40;// 最小刻度值
var maxxlV = 160;// 最大刻度值
var currentxlV = 40;// 当前刻度值
const SUBxlV = maxxlV - minxlV;

var common = require('../../common.js');
var publicFun = require('../../config.js');

// pages/follow/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:true,
    showHis:0,
    xueya_title: '记录血压值',
    currentTab:0,
    canvasH: 80,
    padding: 0,
    bmi: 22,
    statureVal: 170,
    shuVal: 60,
    xlVal:40,
    show_state:0,
    test_arr:[],
    showXlHis:0,
    tangnaiMax:20,
    tangnaiMin:0,
    tangnaiVal:0,
    tangniaoMax:20,
    tangniaoMin: 0,
    kongfuxuetangMax: 20,
    kongfuxuetangMin: 0,
    tangniaoVal: 0,
   kongfuxuetangVal:0,
   maxshengao: 220,
   minshengao: 120,
   shengaoVal: 120,
   maxtizhong: 150,
   mintizhong: 30,
   tizhongVal: 30,
   maxyaowei:120,
   minyaowei:20,
   yaoweiVal:20,
  imageurl: null,
   isshowimage: 0,
   textareashow:1,
   //  抽屉效果
   menu: false,
   open: false,
   mark: 0,
   newmark: 0,
   startmark: 0,
   endmark: 0,
   windowWidth: wx.getSystemInfoSync().windowWidth,
   staus: 1,
   translate: '',
   saveBtn: 25,
   lookHisBtn: 28,
   selectShow:false,//服用剂量下拉显示
   orginVaole: '克（g）',//服用剂量下拉默认显示
   drugShow: false,//给药频数下拉显示
   drugValue: 'qd(每日一次)',//给药频数下拉默认显示
   drugmargin:40
  },
  uploadimage: function (e) {
    var _this = this;
    var mess = e.currentTarget.dataset.mess;
    wx.chooseImage({
      count: 2,  //最多可以选择的图片总数  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        console.log(e);
        console.log(mess);
        //启动上传等待中... 
        if (mess == 1) {
          _this.setData({
            imageurl: tempFilePaths[0],
            imageurl1: tempFilePaths[1]
          })
        }
        if (mess == 2) {
          _this.setData({
            imageurl2: tempFilePaths[0],
            imageurl3: tempFilePaths[1]
          })
        }
        if (mess == 3) {
          _this.setData({
            imageurl4: tempFilePaths[0],
            imageurl5: tempFilePaths[1]
          })
        }
        if (mess == 4) {
          _this.setData({
            imageurl6: tempFilePaths[0],
            imageurl7: tempFilePaths[1]
          })
        }
        if (mess == 5) {
          _this.setData({
            imageurl8: tempFilePaths[0],
            imageurl9: tempFilePaths[1]
          })
        }
        if (mess == 6) {
          _this.setData({
            imageurl10: tempFilePaths[0],
            imageurl11: tempFilePaths[1]
          })
        }
        if (mess == 7) {
          _this.setData({
            imageurl12: tempFilePaths[0],
            imageurl13: tempFilePaths[1]
          })
        }
        if (mess == 8) {
          _this.setData({
            imageurl14: tempFilePaths[0],
            imageurl15: tempFilePaths[1]
          })
        }
        if (mess == 9) {
          _this.setData({
            imageurll6: tempFilePaths[0],
            imageurll7: tempFilePaths[1]
          })
        }
        if (mess == 10) {
          _this.setData({
            imageurl18: tempFilePaths[0],
            imageurl19: tempFilePaths[1]
          })
        }
      }
    })
  },
  showimages: function (e) {
    var imageurl = e.currentTarget.dataset.imageurl;
    this.setData({
      imageurlbig: imageurl,
      isshowimage: 1,
      textareashow:-1
    })
  },
  isshowbigimage: function (e) {
    this.setData({
      isshowimage: 0,
      textareashow: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  hua:function()
  {
    var self = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        res.windowWidth = res.windowWidth - 210;
        var canW = res.windowWidth;
        self.setData({
          canvasW: canW
        });
        // 1.5 画布宽度
        var canvasWidth = (maxValueH - minValueH) * ratio + self.data.canvasW - self.data.padding * 2;
           canvasWidth = ((maxValueW - minValueW) * ratio + self.data.canvasW - self.data.padding * 2);
        self.setData({
          statureLeft: (currentValueH - minValueH) * (ratio+1),
          ratio: ratio,
          maxValueW:maxValueW,
          maxValueH: maxValueH,
          weightW: canvasWidth,
          weightLeft: (currentValueW - minValueW) * (ratio + 1),
          xlLeft: (currentxlV - minxlV) * (ratio + 1), 
          maxxlV: maxxlV
       


        });
      }
    })

  },
  onLoad: function (options) {
  this.setData({
    diseaseid:1
  })
  this.hua();


  },
  weightRoll: function (e) {
    // 选择的舒张压
    var weightLeft;
    if (e.detail.scrollLeft < 0) {
      e.detail.scrollLeft = 0;
    } else if (e.detail.scrollLeft >= SUBW * (ratio+2)-6) {
      weightLeft = SUBW * (ratio + 2) -6;
    }
    this.setData({
      // 
      shuVal: Math.round(e.detail.scrollLeft / (ratio + 1) + minValueW),
      weightLeft: weightLeft
    
    });
 
  },
  xlRoll: function(e) {
    // 选择的心率
    var weightLeft;
    if (e.detail.scrollLeft < 0) {
      e.detail.scrollLeft = 0;
    } else if (e.detail.scrollLeft >= SUBxlV * (ratio + 2) - 8) {
      e.detail.scrollLeft = SUBxlV * (ratio + 2) -8;
    }
    this.setData({
      xlVal: Math.round(e.detail.scrollLeft / (ratio + 1) + minxlV),
      weightLeft: weightLeft  
    });
  },
  tangnaiRoll:function(e)
  {
    var weightLeft;
    var SUBxlV = this.data.tangnaiMax - this.data.tangnaiMin;
    if (e.detail.scrollLeft < 0) {
      e.detail.scrollLeft = 0;
    } else if (e.detail.scrollLeft >= SUBxlV * (ratio + 2) - 6) {
      e.detail.scrollLeft = SUBxlV * (ratio + 2) - 6;
    }
    this.setData({
      tangnaiVal: Math.round(e.detail.scrollLeft / (ratio + 1) + this.data.tangnaiMin),
      weightLeft: weightLeft
    });

  },
  tangniaoRoll:function(e)
  {
    var weightLeft;
    var SUBxlV = this.data.tangniaoMax - this.data.tangniaoMin;
    if (e.detail.scrollLeft < 0) {
      e.detail.scrollLeft = 0;
    } else if (e.detail.scrollLeft >= SUBxlV * (ratio + 2) - 6) {
      e.detail.scrollLeft = SUBxlV * (ratio + 2) - 6;
    }
    this.setData({
      tangniaoVal: Math.round(e.detail.scrollLeft / (ratio + 1) + this.data.tangniaoMin),
      weightLeft: weightLeft
    });

  },
  kongfuxuetangRoll: function (e) {
    var weightLeft;
    var SUBxlV = this.data.kongfuxuetangMax - this.data.kongfuxuetangMin;
    if (e.detail.scrollLeft < 0) {
      e.detail.scrollLeft = 0;
    } else if (e.detail.scrollLeft >= SUBxlV * (ratio + 2) - 6) {
      e.detail.scrollLeft = SUBxlV * (ratio + 2) - 6;
    }
    this.setData({
     kongfuxuetangVal: Math.round(e.detail.scrollLeft / (ratio + 1) + this.data.tangniaoMin),
      weightLeft: weightLeft
    });

  },

  comebake:function()
  {
    this.setData({
      showHis:0
    })
    this.hua();
  },
  comebakeXl:function()
  {
    this.setData({
      showXlHis: 0,
      xueya_title:"记录心率值"
    })
    this.hua();

  },
  saveXl:function()
  {
    var xlVal =this.data.xlVal;
   
    var xlState = this.getxlState(xlVal);
    var date = this.gettime();
    this.setData({
      xlState: xlState,
      SaveXl: xlVal,
      XlDate: date,
      show_xinlv_state:1,
      xueyatitle:'心率历史历史记录值'
    })
    
    wx.request({
      url: publicFun.fowxll(),
      header: { 'Content-Type': 'application/json' },
      data: {
        action:"savexl",
        xlState: xlState,
        SaveXl: xlVal,
        date: date
        
      },
      success:function(res)
      {

      }
    })
  },
  //左边 一级菜单栏 的点击事件
  showSMenu:function(e)
  {
   var leftMenu=this.data.leftMenu;

   var current = e.currentTarget.dataset.idx;
  for(var i in leftMenu)
  {
  
    if (current== i)
    {
      if (leftMenu[current].isshow == 0) {
        leftMenu[current].isshow = 1;
      } else {
        leftMenu[current].isshow = 0;
      }

    }else{
      leftMenu[i].isshow = 0;
    }
      
  }
   this.setData({
     leftMenu: leftMenu
   })
   //console.log(this.data.leftMenu);

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
    var that = this;
    // 绘制标尺
 
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
      var xueyatitle;
      if (e.target.dataset.current==2)
      {
        xueyatitle ='记录心率值'
      }else{
        xueyatitle = e.currentTarget.dataset.name
      }
      that.setData({
        currentTab: e.target.dataset.current,
        xueya_title: xueyatitle
      })
    }
    console.log(e);
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
  statureRoll: function (e) {
    // 收缩压
    if (e.detail.scrollLeft < 0) {
      e.detail.scrollLeft = 0;
    } else if (e.detail.scrollLeft > SUBS * (ratio + 2) -8) {
      e.detail.scrollLeft = SUBS * (ratio + 2) - 8;
    }
    this.setData({
      shouVal: Math.round(e.detail.scrollLeft / 9 + minValueH)
    });
    console.log(this.data.shouVal);
  },
  shengaoRoll: function (e) {
    // 收缩压
    var SUBS = this.data.maxshengao -this.data.minshengao;
    if (e.detail.scrollLeft < 0) {
      e.detail.scrollLeft = 0;
    } else if (e.detail.scrollLeft > SUBS * (ratio + 2) - 8) {
      e.detail.scrollLeft = SUBS * (ratio + 2) - 8;
    }
    this.setData({
      shengaoVal: Math.round(e.detail.scrollLeft / (ratio + 1) + this.data.minshengao)
    });
  },
 tizhongRoll: function (e) {
    // 收缩压
   var SUBS = this.data.maxtizhong - this.data.mintizhong;
    if (e.detail.scrollLeft < 0) {
      e.detail.scrollLeft = 0;
    } else if (e.detail.scrollLeft > SUBS * (ratio + 2) - 8) {
      e.detail.scrollLeft = SUBS * (ratio + 2) - 8;
    }
    this.setData({
      tizhongVal: Math.round(e.detail.scrollLeft / (ratio + 1) + this.data.mintizhong)
    });
  },
 yaoweiRoll:function(e)
 {
   var SUBS = this.data.maxyaowei - this.data.minyaowei;
   if (e.detail.scrollLeft < 0) {
     e.detail.scrollLeft = 0;
   } else if (e.detail.scrollLeft > SUBS * (ratio + 2) - 8) {
     e.detail.scrollLeft = SUBS * (ratio + 2) - 8;
   }
   this.setData({
     yaoweiVal: Math.round(e.detail.scrollLeft / (ratio + 1) + this.data.minyaowei)
   });

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
  lookHis:function()
  {
    var _this=this;
    wx:wx.request({
      url: publicFun.fowxll(),
      data: {
        action:'getHis'
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      dataType: 'json',
     success: function(res) {
       _this.setData({
         allHis:res.data,
         showHis:1,
         xueya_title:"血压历史记录值"
       })
   
     }

    })


  },
  lookXlHis:function()
  {
    var _this = this;
    wx: wx.request({
      url: publicFun.fowxll(),
      data: {
        action: 'getXlHis'
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      dataType: 'json',
      success: function (res) {
        _this.setData({
          allXlHis: res.data,
          showXlHis: 1,
          xueya_title: "心率历史记录值"
        })

      }
    })

  },
  chiceWineBox:function(e)
  {
    var idx = e.currentTarget.dataset.idx;
    var wine_box_arr = this.data.wine_box_arr;
    for (var i in wine_box_arr)
    {
    
      if(i==idx)
      {
        if (wine_box_arr[i].select == 0)
        {
          wine_box_arr[i].select =1;
        }else{
          wine_box_arr[i].select =0;
        }

      }else
      {
        wine_box_arr[i].select = 0;

      }
    }
    this.setData({
      wine_box_arr: wine_box_arr
    })
  
  },
  chiceuneffect:function(e)
  {
    var idx = e.currentTarget.dataset.idx;
    var daiwen_un_effect = this.data.daiwen_un_effect;
    for (var i=0;i<  daiwen_un_effect.length;i++) {
      if (i == idx) {
        daiwen_un_effect[i].select = e.currentTarget.dataset.op;
          break;
      }    
    }
    this.setData({
      daiwen_un_effect: daiwen_un_effect
    })
    console.log(daiwen_un_effect);
  },
  chicedaiwen_relation: function (e) {
    var idx = e.currentTarget.dataset.idx;
    var daiwen_relation = this.data.daiwen_relation;
    for (var i = 0; i < daiwen_relation.length; i++) {
      if (i == idx) {
        daiwen_relation[i].select = e.currentTarget.dataset.op;
        break;
      }
    }
    this.setData({
      daiwen_relation: daiwen_relation
    })
 
  }, chicedaiwen_attent:function(e)
  {

    var idx = e.currentTarget.dataset.idx;
    var chicedaiwen_attent = this.data.daiwen_attent;
    for (var i = 0; i < chicedaiwen_attent.length; i++) {
      if (i == idx) {
        chicedaiwen_attent[i].select = e.currentTarget.dataset.op;
        break;
      }
    }
    this.setData({
      daiwen_attent: chicedaiwen_attent
    })
  },
  loadData:function()
  {
    var info = wx.getSystemInfoSync();
    var shu_arr=[];
    var shou_arr=[];
    var xl_arr=[];
    var tangnai_arr=[];
    var shengao_arr=[];
    var tizhong_arr=[];
    var yaowei_arr=[];
    for (var i = minValueW; i <maxValueW;i+=10)
    {
      shu_arr.push(i);
    }
    for (var i = minValueH; i < maxValueH; i += 10) {
      shou_arr.push(i);
    }
    for (var i = minxlV; i < maxxlV; i += 10) {
      xl_arr.push(i);
    }
    for (var i = this.data.tangnaiMin; i < this.data.tangnaiMax; i += 10) {
      tangnai_arr.push(i);
    }
    for (var i = this.data.minshengao; i < this.data.maxshengao; i += 10) {
      shengao_arr.push(i);
    }
    for (var i = this.data.mintizhong; i < this.data.maxtizhong; i += 10) {
      tizhong_arr.push(i);
    }
    for (var i = this.data.minyaowei; i < this.data.maxyaowei; i += 10) {
     yaowei_arr.push(i);
    }
    

    //左边菜单栏 
    var leftMenu = [];
    var child;
    child = [{ 'name': '诊室/家庭血压', 'idx': 0 }, { 'name': '24H动态血压', 'idx': 1 }, { 'name': '心率', 'idx': 2 }];
    leftMenu.push({ 'name': '基础数据', 'child': child, 'isshow': 1});
    child = [{ 'name': '用量', 'idx': 24 }, { 'name': '用法', 'idx': 25 }, { 'name': '不良反应（症状体征）', 'idx': 26 }, { 'name': '指标监测', 'idx': 27 }, { 'name': '注意事项', 'idx': 28 }, { 'name': '药物相互作用', 'idx': 29 }];
    leftMenu.push({ 'name': '药物治疗', 'child': child,'isshow': 0});
    child = [{ 'name': '心脏', 'idx': 5 }, { 'name': '血管', 'idx': 6 }, { 'name': '肾脏', 'idx': 7 }, { 'name': '眼底', 'idx': 8 }, { 'name': '脑', 'idx': 9}];
    leftMenu.push({ 'name': '靶器官损害', 'child': child, 'isshow': 0 });
    child = [{ 'name': '吸烟', 'idx': 10 }, { 'name': '糖耐量受损/空腹血糖受损/糖尿病', 'idx': 11 }, { 'name': '血脂异常', 'idx': 12 }, { 'name': '肥胖', 'idx': 13 }, { 'name': '血同型半胱氯酸', 'idx': 14 }];
    leftMenu.push({ 'name': '心血管危险因素', 'child': child, 'isshow': 0 });

    child = [{ 'name': '控盐', 'idx': 15 }, { 'name': '控制体重', 'idx': 16 }, { 'name': '戒烟', 'idx': 17 }, { 'name': '限制饮酒', 'idx': 18 }, { 'name': '定期锻炼', 'idx': 19 }, { 'name': '减轻精神压力', 'idx': 20 }, { 'name': '改善睡眠', 'idx': 21 }];
    leftMenu.push({ 'name': '生活方式干预', 'child': child, 'isshow': 0 });

    child = [{ 'name': '随访结论', 'idx': 22 }, { 'name': '医嘱填写', 'idx': 23 }];
    leftMenu.push({ 'name': '随访结论与医嘱', 'child': child,'isshow':0});
    //左边菜单栏    end   

    //                  限制饮酒  容量 数组 
    var wine_box_arr=[{
      'id':0,
      'name':'无',
      'select':0,
    }, {
        'id': 1,
        'name': '少量',
        'select': 0,
      },
      {
        'id': 2,
        'name': '中等',
        'select': 0,
      },{
        'id': 2,
        'name': '大量',
        'select': 0,
      }
      ];
      //代文药的不良反应 
    var daiwen_un_effect = [{ 'name': '关节痛', "option": ['无', '有'],'select':'2'},
      { 'name': '无力', "option":['无','有'], 'select': '2' },
      { 'name': '背痛', "option":['无','有'], 'select': '2' },
      { 'name': '腹泻', "option":['无','有'], 'select': '2' },
      { 'name': '头晕', "option":['无','有'], 'select': '2' },
      { 'name': '头痛', "option":['无','有'], 'select': '2' },
      { 'name': '失眠', "option":['无','有'], 'select': '2' },
      { 'name': '性欲降低', "option":['无','有'], 'select': '2' },
      { 'name': '恶心', "option":['无','有'], 'select': '2' },
      { 'name': '水肿', "option":['无','有'], 'select': '2' },
      { 'name': '咽炎', "option":['无','有'], 'select': '2' },
      { 'name': '鼻窦炎', "option":['无','有'], 'select': '2' }, 
      { 'name': '上呼吸道感染', "option":['无','有'], 'select': '2' },
      { 'name': '病毒感染', "option":['无','有'], 'select': '2' }
    ];
    //  注意事项 
    var daiwen_attent = [{ "name": "低钠和/或血容量不足","option": ['无', '有'], "select": "2" }, { "name": "肾动脉狭窄", "option": ['无', '有'], "select": "2" }, { "name": "重度肾功能受损（肌酐清除率＜30 ml/min）", "option": ['无', '有'], "select": "2" }, { "name": "胆道梗阻", "option": ['无', '有'], "select": "2" }, { "name": "胆汁淤积", "option": ['无', '有'], "select": "2" },  { "name": "发生血管性水肿，包括喉和声门水肿，引起气道阻塞和/或面部、嘴唇、咽，和/或舌肿胀；曾有使用其他药物 （包括ACE抑制剂）时出现血管性水肿的历史", "option": ['无', '有'], "select": "2" }, { "name": "联合应用血管紧张素II受体拮抗剂（包括代文）与ACE抑制剂或阿利吉仑", "option": ['无', '有'], "select": "2" }, { "name": "糖尿病", "option": ['无', '有'], "select": "2" }, { "name": "低钠和/或血容量不足", "option": ['无', '有'], "select": "2" }]
    var daiwen_relation = [{
      "name": "联合应用保钾利尿剂（如螺内脂、氨苯喋啶、阿米洛利）、钾补充剂、含钾的盐替代品或其他能增加血钾浓度的药物（肝素等）",
      "option": ['无', '有'],
      "select": "2"
    },
      {
        "name": "同时服用非甾体类抗炎药（NSAIDs）包括选择性环氧化酶2抑制剂（COX-2）",
        "option": ['无', '有'],
        "select": "2"
      },
      {
        "name": "联合使用锂剂",
        "option": ['无', '有'],
        "select": "2"
      },
      {
        "name": "合并使用摄取性转运蛋白抑制剂（利福平，环抱霉素）或者外排性转运蛋白抑制剂（利托那韦）",
        "option": ['无', '有'],
        "select": "2"
      }

    ];

   



    this.setData({
      height: info.windowHeight,
      scrolH: info.windowHeight-75.5,
      wine_box_arr: wine_box_arr,
      shu_arr: shu_arr,
      shou_arr: shou_arr,
      xl_arr: xl_arr,
      tangnai_arr: tangnai_arr,
      leftMenu: leftMenu,
      shengao_arr: shengao_arr,
      tizhong_arr: tizhong_arr,
      yaowei_arr: yaowei_arr,
      shouVal:70,
      daiwen_un_effect: daiwen_un_effect,
      daiwen_relation: daiwen_relation,
      daiwen_attent: daiwen_attent,
      translate: 'transform: translateX(100px)',
      menu: true,
      saveBtn: 18,
      lookHisBtn: 20,
      open:true

    })
    console.log(tangnai_arr);
   
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
        wx.setNavigationBarTitle({
          title: _this.data.disease.name+"随访记录"
        })
      }
    })

 var    drug_list=[
      {
        'id':"01",
        'name': "代文",
        "guifan": '每日１次，每次１粒，餐前服用。'
      },
      {
        'id': "02",
        'name':"倍他乐克",
        "guifan":'每日１次，每次１粒，餐前服用。'
    }];

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
  
  }, saveXueya:function()
  {
    //获取     收缩压
    var shouVal = this.data.shouVal;
     //获取 舒张压
    var shuVal = this.data.shuVal;
    var state = this.getState(shouVal, shuVal);
    console.log(shuVal);
   var date =this.gettime();
   this.setData({
     state: state,
     date: date,
     SaveshuVal: shuVal,
     SaveshouVal: shouVal,
     show_state:1
   })
    wx.request({
      url: publicFun.fowxll(),
      data:{
        shuVal : shuVal,
        shouVal: shouVal,
        action:"saveXueya",
        state: state, 
        date: date

      },
      header: { 'Content-Type': 'application/json' },
      success: function (res)
      {



      }
      
    })


  },
  getState:function(val1,val2)
  {

  //  【结论判断规则】
 
   
    
 
  //  5、收缩压大等于180mmHg或者小等于90mmhg结论后都添加“停止随访，建议病人到医院就诊。”
   // 6、舒张压大等于120mmHg或者小等于60mmhg结论后都添加“停止随访，建议病人到医院就诊。”



    var state='';
    if (val1 >= 180 || val1 <= 90 || val2 >= 120 || val2 <= 60) {
      //  4、收缩压大等于180mmHg 或者舒张压大等于110mmHg 判定结论为3级高血压；
      state = '3级高血压';
    } else if (val1 > 90 && val1<=139 && val2> 60 && val2<=89 )
    {
       //  1、收缩压处于90 - 139mmHg，舒张压处于60 - 89mmHg，判定结论为正常血压；
      state ="正常血压";  
    }
    else if ((val1 >= 140 && val1 <= 159) ||(val2 >= 90 && val2 <= 99))
    {
       //2、收缩压140 - 159mmHg 或者舒张压90- 99mmHg判定结论为1级高血压；
 
      state ='1级高血压';
    }
    else if ((val1 >= 160 && val1 <= 179) || (val2 >= 100 && val2 <= 109))
    {
    //3、收缩压160 - 179mmHg 或者舒张压100- 109mmHg判定结论为2级高血压；
      state = '2级高血压';
    }  
  
  return state;
  },
  getxlState:function(val)
  {
    if(val<60)
    {
      return '心动过缓，停止随访，建议病人到医院就诊。';
    }else if(val>=60 && val <100)
    {
      return '正常心率。';

    }else{
      return '心动过速，停止随访，建议病人到医院就诊。';
    }

  },gettime:function()
  {
    var timestamp =  Date.parse(new Date());
    timestamp = timestamp / 1000;
    //获取当前时间
    var n = timestamp *
      1000;

    var date = new Date(n);
    //年
    var Y =
     date.getFullYear();
    //月
    var M = (date.getMonth()  + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日
    var D = date.getDate()
   < 10 ? '0' + date.getDate() :
      date.getDate();
    //时
    var h = date.getHours();
    //分
    var m =   date.getMinutes();
    //秒
    var s =    date.getSeconds();
    return  Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
  },
  // 抽屉效果
  tap_ch: function (e) {
    if (this.data.open) {
      this.setData({
        translate: 'transform: translateX(0)',
        menu: false,
        saveBtn: 25,
        lookHisBtn: 25,
      })
      // this.aport(0,200);
      this.data.open = false;
    } else {
      this.setData({
        translate: 'transform: translateX(100px)',
        menu: true,
        saveBtn: 18,
        lookHisBtn: 20,
      })
      // this.aport(200, 0);
      this.data.open = true;
    }
  },
  tap_start: function (e) {
    this.data.mark = this.data.newmark = e.touches[0].pageX;
    if (this.data.staus == 1) {
      // staus = 1指默认状态
      this.data.startmark = e.touches[0].pageX;
    } else {
      // staus = 2指屏幕滑动到右边的状态
      this.data.startmark = e.touches[0].pageX;
    }

  },
  tap_drag: function (e) {
    /*
     * 手指从左向右移动
     * @newmark是指移动的最新点的x轴坐标 ， @mark是指原点x轴坐标
     */
    this.data.newmark = e.touches[0].pageX;
    if (this.data.mark < this.data.newmark) {
      if (this.data.staus == 1) {
        if (100 * 0.75 > Math.abs(this.data.newmark - this.data.startmark)) {

          if (this.data.translate == "100px") {
            this.setData({
              translate: 'transform: translateX(0px)',
              menu: false,
              saveBtn: 25,
              lookHisBtn: 28,
            })
          } else {
            this.setData({
              translate: 'transform: translateX(100px)',
              menu: true,
              saveBtn: 18,
              lookHisBtn: 20,
            })

          }
        }
      }

    }
    /*
     * 手指从右向左移动
     * @newmark是指移动的最新点的x轴坐标 ， @mark是指原点x轴坐标
     */
    if (this.data.mark > this.data.newmark) {
      if (this.data.staus == 1 && (this.data.newmark - this.data.startmark) > 0) {
        this.setData({
          translate: 'transform: translateX(100px)',
          menu: true,
          saveBtn: 18,
          lookHisBtn: 20,
        })
      } else if (this.data.staus == 2 && this.data.startmark - this.data.newmark < 100) {
        this.setData({
          translate: 'transform: translateX(' + (this.data.newmark + 100 - this.data.startmark) + 'px)',
          menu: false,
          saveBtn: 25,
          lookHisBtn: 28,
        })
      }

    }

    this.data.mark = this.data.newmark;

  },
  tap_end: function (e) {
    console.log(this.data.translate);
    if (this.data.staus == 1 && this.data.startmark < this.data.newmark) {
      if (Math.abs(this.data.newmark - this.data.startmark) < (100 * 0.2)) {
        this.setData({
          translate: 'transform: translateX(0px)',
          menu: false,
          saveBtn: 25,
          lookHisBtn: 28,
        })
        this.data.staus = 1;
      } else {
        this.setData({
          translate: 'transform: translateX(100px)',
          menu: true,
          saveBtn: 18,
          lookHisBtn: 20,
        })
        this.data.staus = 2;
      }
    } else {
      if (Math.abs(this.data.newmark - this.data.startmark) < (100 * 0.2)) {
        this.setData({
          translate: 'transform: translateX(100px)',
          menu: true,
          saveBtn: 18,
          lookHisBtn: 20,
        })
        this.data.staus = 2;
      } else {
        this.setData({
          translate: 'transform: translateX(0px)',
          menu: false,
          saveBtn: 25,
          lookHisBtn: 28,
        })
        this.data.staus = 1;
      }
    }

    this.data.mark = 0;
    this.data.newmark = 0;
  },
  // 运动的计算
  aport: function (oldmargin, newmargin) {
    var step = 5;//步长
    if (newmargin > oldmargin) {//显示菜单
      var timer = setInterval(function () {
        oldmargin = oldmargin + step;
        if (oldmargin == newmargin) {
          clearInterval(timer);
        }
      }, 100);
    } else {//隐藏菜单
      var timer1 = setInterval(function () {
        oldmargin = oldmargin - step;
        if (oldmargin == newmargin) {
          clearInterval(timer1);
        }
      }, 100);
    }

  },
  // 药物治疗
   // 显示隐藏
  showOption: function () {
    if (this.data.selectShow) {
      this.setData({
        selectShow: false,
        drugmargin: 40
      });
    } else {
      this.setData({
        selectShow: true,
        drugmargin: 280
       
      });
    }
  },
  // 设置值
  selectValue: function (e) {
    this.setData({
      orginVaole: e.currentTarget.dataset.value
    });
  },
  //给药频数显示隐藏
  drugNumber:function(){
    if (this.data.drugShow) {
      this.setData({
        drugShow: false
      });
    } else {
      this.setData({
        drugShow: true
      });
    }
  },
  // 设置给药频数值
  drugValue:function(e){
    this.setData({
      drugValue: e.currentTarget.dataset.value
    });
  }
})