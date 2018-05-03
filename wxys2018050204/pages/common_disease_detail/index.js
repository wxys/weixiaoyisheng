// pages/common_disease_detail/index.js
//获取全局的应用实例
var app = getApp();
//引用公共文件
var common = require('../../common.js');
//引入co函数支持
const Promise = global.Promise = require('../../libs/es6-promise')
const regeneratorRuntime = global.regeneratorRuntime = require('../../libs/runtime')
const co = require('../../libs/co')	
Page({
  data: {
    UserData:{},
    limit_start: 0,
    limit_num: 3,
    //常见疾病
    /*
    page_data:
    {
      //诊疗指南
      clinic_guide: [
        {
          clinic_guide_id: '1',
          clinic_guide_title: '就诊指南发发发发发发发发发发发呆灌灌灌灌灌发发',
          clinic_guide_introduce: '介绍',
          is_essence: false,
          clinic_guide_introduce: '1235'
        },
        {
          clinic_guide_id: '2',
          clinic_guide_title: '门诊攻略|骨科就诊小贴士',
          clinic_guide_introduce: '介绍',
          is_essence: true,
          clinic_guide_introduce: '235'
        },
       
      ],
      //推荐专家
      our_expert: [
        {
          doctor_cover: "http://smsy.12581258.com/SlowDiseaseTreasure/icon/doctor.png",
          doctor_name: "林章树",
          doctor_position: "主任医师",
          doctor_departments: "呼吸内科",
          doctor_hospital: "福建省立医院",
          doctor_subscribe_number: 0,
          doctor_id: 131,
          hospitalId: 1,
          departmentId: 28,
          doctor_start: 9.1,
          doctor_good_at: '擅长：呼吸内科'
        },
        {
          doctor_cover: "http://smsy.12581258.com/SlowDiseaseTreasure/icon/doctor.png",
          doctor_name: "候建明",
          doctor_position: "主任医师",
          doctor_departments: "内分泌科",
          doctor_hospital: "福建省立医院",
          doctor_subscribe_number: 0,
          doctor_id: 88,
          hospitalId: 1,
          departmentId: 27,
          doctor_start: 9.1,
          doctor_good_at: '擅长：内分泌科'
        },
        {
          doctor_cover: "http://smsy.12581258.com/SlowDiseaseTreasure/icon/doctor.png",
          doctor_name: "陈文昌",
          doctor_position: "主任医师",
          doctor_departments: "骨科",
          doctor_hospital: "福建省立医院",
          doctor_subscribe_number: 0,
          doctor_id: 13,
          hospitalId: 1,
          departmentId: 1,
          doctor_start: 9.1,
          doctor_good_at: '擅长：骨科'
        }
      ],
      //推荐医院
      recommend_hospital: [
        {
          'recommend_hospital_id': '1',
          'recommend_hospital_name': '中国人民解放军总医院301医院',
          'recommend_hospital_level': '三级甲等',
          'recommend_hospital_cover': '../../images/hospital_1.png',
          'Departments': [
            {
              "DepartmentsName":'骨科',
            },
            {
              "DepartmentsName": '儿外科',
            },
            {
              "DepartmentsName": '妇科',
            }
          ],
        },
        {
          'recommend_hospital_id': '2',
          'recommend_hospital_name': '中国人民解放军总医院301医院',
          'recommend_hospital_level': '三级甲等',
          'recommend_hospital_cover': '../../images/hospital_1.png',
          'subscribe_quantity': '20.1万',
        },
        {
          'recommend_hospital_id': '3',
          'recommend_hospital_name': '中国人民解放军总医院301医院',
          'recommend_hospital_level': '三级甲等',
          'recommend_hospital_cover': '../../images/hospital_1.png',
          'subscribe_quantity': '20.1万',
        }
      ],
      //科室常见检查
      common_check: [
        {
          common_check_id: '1',
          common_check_text: '颈椎间孔挤压试验',
        },
        {
          common_check_id: '2',
          common_check_text: '侧屈椎间孔挤压试验',
        },
        {
          common_check_id: '3',
          common_check_text: '后仰椎间孔挤压试验',

        }
      ]
    },
    */

  },
  onLoad: function (options) {
    var that = this;
    var data = this.data;
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      common_departments_id: options.common_departments_id,
      common_diseases_name: options.common_diseases_name,
      common_diseases_id: options.common_diseases_id,
    })
    //动态设置常见科室标题
    wx.setNavigationBarTitle({
      title: options.common_diseases_name
    })

    //获取用户id
    var UserData = wx.getStorageSync(app.globalData.setStorage.prefix + 'UserData');
    if (UserData) {
      that.setData({
        UserData: UserData,
      })
      that.LoadData();
    } else {
      co(function* () {
        result = yield common.GetUserId();
        UserData = result.data;
        that.setData({
          UserData: UserData,
        })
        that.LoadData();
      });

    }


  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  LoadData:function(){
    var pages_object = getCurrentPages();//获取当前页面栈
    var that = this;
    var data = this.data;
    
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface.php',
      data: {
        action: 'DiseaseToDoctor',
        Diseaseid: data.common_diseases_id,
        limit_start: data.limit_start,
        limit_num: data.limit_num,
      },
      method: 'GET',
      // header: {}, // 设置请求的 header
      success: function (res) {
        //console.log(res);
        that.setData({
          pages: pages_object.length,//页面栈数
          page_data: res.data,

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
  //跳转页面

  SkipPage: function (e) {
    //console.log(e)
    var pages = this.data.pages;
    common.ToPages(pages, e.currentTarget.dataset.url);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var data = this.data;
    return {
      title: data.common_diseases_name,
      path: 'pages/common_disease_detail/index?common_diseases_name=' + data.common_diseases_name + "&common_departments_id=" + data.common_departments_id + "&common_diseases_id=" + data.common_diseases_id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})