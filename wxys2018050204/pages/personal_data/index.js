// pages/personal_data/index.js
var app = getApp(); //获取全局的应用实例
Page({
  data:{
    UserData:{},
    Country:[
{'abbreviation':'AO','country_name': '安哥拉'}, 
{'abbreviation':'AF','country_name': '阿富汗'}, 
{'abbreviation':'AL','country_name': '阿尔巴尼亚'}, 
{'abbreviation':'DZ','country_name': '阿尔及利亚'}, 
{'abbreviation':'AD','country_name': '安道尔共和国'}, 
{'abbreviation':'AI','country_name': '安圭拉岛'}, 
{'abbreviation':'AG','country_name': '安提瓜和巴布达'}, 
{'abbreviation':'AR','country_name': '阿根廷'}, 
{'abbreviation':'AM','country_name': '亚美尼亚'}, 
{'abbreviation':'AU','country_name': '澳大利亚'}, 
{'abbreviation':'AT','country_name': '奥地利'}, 
{'abbreviation':'AZ','country_name': '阿塞拜疆'}, 
{'abbreviation':'BS','country_name': '巴哈马'}, 
{'abbreviation':'BH','country_name': '巴林'}, 
{'abbreviation':'BD','country_name': '孟加拉国'}, 
{'abbreviation':'BB','country_name': '巴巴多斯'}, 
{'abbreviation':'BY','country_name': '白俄罗斯'}, 
{'abbreviation':'BE','country_name': '比利时'}, 
{'abbreviation':'BZ','country_name': '伯利兹'}, 
{'abbreviation':'BJ','country_name': '贝宁'}, 
{'abbreviation':'BM','country_name': '百慕大群岛'}, 
{'abbreviation':'BO','country_name': '玻利维亚'}, 
{'abbreviation':'BW','country_name': '博茨瓦纳'}, 
{'abbreviation':'BR','country_name': '巴西'}, 
{'abbreviation':'BN','country_name': '文莱'}, 
{'abbreviation':'BG','country_name': '保加利亚'}, 
{'abbreviation':'BF','country_name': '布基纳法索'}, 
{'abbreviation':'MM','country_name': '缅甸'}, 
{'abbreviation':'BI','country_name': '布隆迪'}, 
{'abbreviation':'CM','country_name': '喀麦隆'}, 
{'abbreviation':'CA','country_name': '加拿大'}, 
{'abbreviation':'CF','country_name': '中非共和国'}, 
{'abbreviation':'TD','country_name': '乍得'}, 
{'abbreviation':'CL','country_name': '智利'}, 
{'abbreviation':'CN','country_name': '中国'}, 
{'abbreviation':'CO','country_name': '哥伦比亚'}, 
{'abbreviation':'CG','country_name': '刚果'}, 
{'abbreviation':'CK','country_name': '库克群岛'}, 
{'abbreviation':'CR','country_name': '哥斯达黎加'}, 
{'abbreviation':'CU','country_name': '古巴'}, 
{'abbreviation':'CY','country_name': '塞浦路斯'}, 
{'abbreviation':'CZ','country_name': '捷克'}, 
{'abbreviation':'DK','country_name': '丹麦'}, 
{'abbreviation':'DJ','country_name': '吉布提'}, 
{'abbreviation':'DO','country_name': '多米尼加共和国'}, 
{'abbreviation':'EC','country_name': '厄瓜多尔'}, 
{'abbreviation':'EG','country_name': '埃及'}, 
{'abbreviation':'SV','country_name': '萨尔瓦多'}, 
{'abbreviation':'EE','country_name': '爱沙尼亚'}, 
{'abbreviation':'ET','country_name': '埃塞俄比亚'}, 
{'abbreviation':'FJ','country_name': '斐济'}, 
{'abbreviation':'FI','country_name': '芬兰'}, 
{'abbreviation':'FR','country_name': '法国'}, 
{'abbreviation':'GF','country_name': '法属圭亚那'}, 
{'abbreviation':'GA','country_name': '加蓬'}, 
{'abbreviation':'GM','country_name': '冈比亚'}, 
{'abbreviation':'GE','country_name': '格鲁吉亚'}, 
{'abbreviation':'DE','country_name': '德国'}, 
{'abbreviation':'GH','country_name': '加纳'}, 
{'abbreviation':'GI','country_name': '直布罗陀'}, 
{'abbreviation':'GR','country_name': '希腊'}, 
{'abbreviation':'GD','country_name': '格林纳达'}, 
{'abbreviation':'GU','country_name': '关岛'}, 
{'abbreviation':'GT','country_name': '危地马拉'}, 
{'abbreviation':'GN','country_name': '几内亚'}, 
{'abbreviation':'GY','country_name': '圭亚那'}, 
{'abbreviation':'HT','country_name': '海地'}, 
{'abbreviation':'HN','country_name': '洪都拉斯'}, 
{'abbreviation':'HK','country_name': '香港'}, 
{'abbreviation':'HU','country_name': '匈牙利'}, 
{'abbreviation':'IS','country_name': '冰岛'}, 
{'abbreviation':'IN','country_name': '印度'}, 
{'abbreviation':'ID','country_name': '印度尼西亚'}, 
{'abbreviation':'IR','country_name': '伊朗'}, 
{'abbreviation':'IQ','country_name': '伊拉克'}, 
{'abbreviation':'IE','country_name': '爱尔兰'}, 
{'abbreviation':'IL','country_name': '以色列'}, 
{'abbreviation':'IT','country_name': '意大利'}, 
{'abbreviation':'JM','country_name': '牙买加'}, 
{'abbreviation':'JP','country_name': '日本'}, 
{'abbreviation':'JO','country_name': '约旦'}, 
{'abbreviation':'KH','country_name': '柬埔寨'}, 
{'abbreviation':'KZ','country_name': '哈萨克斯坦'}, 
{'abbreviation':'KE','country_name': '肯尼亚'}, 
{'abbreviation':'KR','country_name': '韩国'}, 
{'abbreviation':'KW','country_name': '科威特'}, 
{'abbreviation':'KG','country_name': '吉尔吉斯坦'}, 
{'abbreviation':'LA','country_name': '老挝'}, 
{'abbreviation':'LV','country_name': '拉脱维亚'}, 
{'abbreviation':'LB','country_name': '黎巴嫩'}, 
{'abbreviation':'LS','country_name': '莱索托'}, 
{'abbreviation':'LR','country_name': '利比里亚'}, 
{'abbreviation':'LY','country_name': '利比亚'}, 
{'abbreviation':'LI','country_name': '列支敦士登'}, 
{'abbreviation':'LT','country_name': '立陶宛'}, 
{'abbreviation':'LU','country_name': '卢森堡'}, 
{'abbreviation':'MO','country_name': '澳门'}, 
{'abbreviation':'MG','country_name': '马达加斯加'}, 
{'abbreviation':'MW','country_name': '马拉维'}, 
{'abbreviation':'MY','country_name': '马来西亚'}, 
{'abbreviation':'MV','country_name': '马尔代夫'}, 
{'abbreviation':'ML','country_name': '马里'}, 
{'abbreviation':'MT','country_name': '马耳他'}, 
{'abbreviation':'MU','country_name': '毛里求斯'}, 
{'abbreviation':'MX','country_name': '墨西哥'}, 
{'abbreviation':'MD','country_name': '摩尔多瓦'}, 
{'abbreviation':'MC','country_name': '摩纳哥'}, 
{'abbreviation':'MN','country_name': '蒙古'}, 
{'abbreviation':'MS','country_name': '蒙特塞拉特岛'}, 
{'abbreviation':'MA','country_name': '摩洛哥'}, 
{'abbreviation':'MZ','country_name': '莫桑比克'}, 
{'abbreviation':'NA','country_name': '纳米比亚'}, 
{'abbreviation':'NR','country_name': '瑙鲁'}, 
{'abbreviation':'NP','country_name': '尼泊尔'}, 
{'abbreviation':'NL','country_name': '荷兰'}, 
{'abbreviation':'NZ','country_name': '新西兰'}, 
{'abbreviation':'NI','country_name': '尼加拉瓜'}, 
{'abbreviation':'NE','country_name': '尼日尔'}, 
{'abbreviation':'NG','country_name': '尼日利亚'}, 
{'abbreviation':'KP','country_name': '朝鲜'}, 
{'abbreviation':'NO','country_name': '挪威'}, 
{'abbreviation':'OM','country_name': '阿曼'}, 
{'abbreviation':'PK','country_name': '巴基斯坦'}, 
{'abbreviation':'PA','country_name': '巴拿马'}, 
{'abbreviation':'PG','country_name': '巴布亚新几内亚'}, 
{'abbreviation':'PY','country_name': '巴拉圭'}, 
{'abbreviation':'PE','country_name': '秘鲁'}, 
{'abbreviation':'PH','country_name': '菲律宾'}, 
{'abbreviation':'PL','country_name': '波兰'}, 
{'abbreviation':'PF','country_name': '法属玻利尼西亚'}, 
{'abbreviation':'PT','country_name': '葡萄牙'}, 
{'abbreviation':'PR','country_name': '波多黎各'}, 
{'abbreviation':'QA','country_name': '卡塔尔'}, 
{'abbreviation':'RO','country_name': '罗马尼亚'}, 
{'abbreviation':'RU','country_name': '俄罗斯'}, 
{'abbreviation':'LC','country_name': '圣卢西亚'}, 
{'abbreviation':'VC','country_name': '圣文森特岛'}, 
{'abbreviation':'SM','country_name': '圣马力诺'}, 
{'abbreviation':'ST','country_name': '圣多美和普林西比'}, 
{'abbreviation':'SA','country_name': '沙特阿拉伯'}, 
{'abbreviation':'SN','country_name': '塞内加尔'}, 
{'abbreviation':'SC','country_name': '塞舌尔'}, 
{'abbreviation':'SL','country_name': '塞拉利昂'}, 
{'abbreviation':'SG','country_name': '新加坡'}, 
{'abbreviation':'SK','country_name': '斯洛伐克'}, 
{'abbreviation':'SI','country_name': '斯洛文尼亚'}, 
{'abbreviation':'SB','country_name': '所罗门群岛'}, 
{'abbreviation':'SO','country_name': '索马里'}, 
{'abbreviation':'ZA','country_name': '南非'}, 
{'abbreviation':'ES','country_name': '西班牙'}, 
{'abbreviation':'LK','country_name': '斯里兰卡'}, 
{'abbreviation':'SD','country_name': '苏丹'}, 
{'abbreviation':'SR','country_name': '苏里南'}, 
{'abbreviation':'SZ','country_name': '斯威士兰'}, 
{'abbreviation':'SE','country_name': '瑞典'}, 
{'abbreviation':'CH','country_name': '瑞士'}, 
{'abbreviation':'SY','country_name': '叙利亚'}, 
{'abbreviation':'TW','country_name': '台湾省'}, 
{'abbreviation':'TJ','country_name': '塔吉克斯坦'}, 
{'abbreviation':'TZ','country_name': '坦桑尼亚'}, 
{'abbreviation':'TH','country_name': '泰国'}, 
{'abbreviation':'TG','country_name': '多哥'}, 
{'abbreviation':'TO','country_name': '汤加'}, 
{'abbreviation':'TT','country_name': '特立尼达和多巴哥'}, 
{'abbreviation':'TN','country_name': '突尼斯'}, 
{'abbreviation':'TR','country_name': '土耳其'}, 
{'abbreviation':'TM','country_name': '土库曼斯坦'}, 
{'abbreviation':'UG','country_name': '乌干达'}, 
{'abbreviation':'UA','country_name': '乌克兰'}, 
{'abbreviation':'AE','country_name': '阿拉伯联合酋长国'}, 
{'abbreviation':'GB','country_name': '英国'}, 
{'abbreviation':'US','country_name': '美国'}, 
{'abbreviation':'UY','country_name': '乌拉圭'}, 
{'abbreviation':'UZ','country_name': '乌兹别克斯坦'}, 
{'abbreviation':'VE','country_name': '委内瑞拉'}, 
{'abbreviation':'VN','country_name': '越南'}, 
{'abbreviation':'YE','country_name': '也门'}, 
{'abbreviation':'YU','country_name': '南斯拉夫'}, 
{'abbreviation':'ZW','country_name': '津巴布韦'}, 
{'abbreviation':'ZR','country_name': '扎伊尔'}, 
{'abbreviation':'ZM','country_name': '赞比亚'}
]
  },
  onLoad:function(options){
   
  },
  onReady:function(){
    // 页面渲染完成

  },
  onShow:function(){
    // 页面初始化 options为页面跳转所带来的参数。

    var that = this;
   
    var prefix=app.globalData.setStorage.prefix ;
    var UserData = wx.getStorageSync(prefix + 'UserData');
    console.log(UserData);
    if (UserData.userInfo){
      var Country = that.data.Country;
      for (var x in Country) {
        if (Country[x]['abbreviation'] == UserData.userInfo.country) {
          UserData.userInfo.country = Country[x]['country_name'];
        }
      }
    }
console.log(UserData);
    wx.request({
      url: 'https://h5.12590.com/SlowDiseaseTreasure/interface_ysc.php', //仅为示例，并非真实的接口地址
      data: {
        "action": 'getuserinfo',
        "openid": UserData.openid,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        UserData.sex = res.data[0]['User_Sex'];
        that.setData({
          UserData: res.data[0],
        })        
      }
    });
    that.setData({
      UserData: UserData,
    });
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  //获得会员数据
  GetUserMember: function () {

    var UserData = this.data.UserData;
    var UserMember = this.data.UserMember;
    // UserData.userInfo.nickName = "aaaa";
    console.log(UserData);
    // console.log("aaaaaaa");
    var informcount = 0;//未读通知数量
    var that = this;
    var prefix = app.globalData.setStorage.prefix;  //缓存存储前缀
    //登录过的用户才判断是否是会员
    co(function* () {
      var result = yield common.CheckVipMemberByUserId2();
      var res = result.data;
      console.log(res);

      UserData.MemberInformation = res.data.member_information;
      if (res.data.member_information == "会员订户" || res.data.member_information == "中国移动健康中心会员") {
        UserMember = {
          ExpirationTime: res.data.expiration_time,//到期时间
          DurationDay: res.data.duration_day,//会员持续时间
        }
        if (res.data.member_phone != "") {
          UserData.phone = res.data.member_phone;
        }
        if (res.data.member_information != "") {
          UserData.memberinformation = res.data.member_information;
          UserData.memberinformation2 = res.data.member_information2;
          UserData.expiration_time = res.data.expiration_time;
        }
        ///1
      }
      UserData.User_name = res.data.User_name;
      UserData.userInfo = res.data.userinfo;
      //将用户数据存储到本地
      wx.setStorageSync(prefix + 'UserData', UserData);
      that.setData({
        UserData: UserData,
        userInfo: res.data.userinfo,
        PageShow: true,
        UserMember: UserMember,
      })
    });
  },
})
