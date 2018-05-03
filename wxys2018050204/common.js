//common.js
//引入co函数支持
const Promise = global.Promise = require('libs/es6-promise.js')
const regeneratorRuntime = global.regeneratorRuntime = require('libs/runtime.js')
const co = require('libs/co.js')
var app = getApp(); //获取全局的应用实例



//调用接口，获取用户openid
function GetUserId_1() {
  return new Promise(function (resolve, reject) {
    var program_parameter = app.globalData.program_parameter;  //小程序配置数据
    var prefix = app.globalData.setStorage.prefix;  //缓存存储前缀。
    //console.log(program_parameter);
    wx.login({
      success: function (res) {
        var code = res.code;
        wx.request({
          url: 'https://h5.12590.com/SlowDiseaseTreasure/reqFour.php',
          header: {
            'Content-Type': 'application/json'
          },
          data: {
            'action': 'GetUserOpenId',
            'appid': program_parameter.appid,
            'secret': program_parameter.secret,
            'js_code': code,
            'grant_type': 'authorization_code'
          },
          success: function (res) {
            console.log(res);
            //该用户还未授权过 个人信息
            var UserData = {
              "openid": res.data.openid,
            };
            wx.setStorageSync(prefix + "user_openid", res.data);
            resolve({
              data: res.data
            })
         
          }
        });
      }
    });

  });
}

//调用接口，获取用户openid
function GetUserId() {
  return new Promise(function (resolve, reject) {
    var program_parameter = app.globalData.program_parameter;  //小程序配置数据
    var prefix = app.globalData.setStorage.prefix;  //缓存存储前缀。
    //console.log(program_parameter);
    wx.login({
      success: function (res) {
        var code = res.code;
        wx.request({
          url: 'https://h5.12590.com/SlowDiseaseTreasure/reqFour.php',
          header: {
            'Content-Type': 'application/json'
          },
          data: {
            'action': 'GetUserOpenId',
            'appid': program_parameter.appid,
            'secret': program_parameter.secret,
            'js_code': code,
            'grant_type': 'authorization_code'
          },
          success: function (res) {
            console.log(res);
            //该用户还未授权过 个人信息
            var UserData = {
              "openid": res.data.openid,
            };
          //将用户数据存储到本地
            wx.setStorageSync(prefix + "UserData", UserData);
            resolve({
             data: res.data
            })
          }
        });
      }
    });

  });
}
//获取用户资料
function getUserInfo() {

  return new Promise(function (resolve, reject) {
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "" 这个 scope

    wx.getUserInfo({
      success: function (res) {
       
      },
      //请求获取用户接口调用完毕（无论失败与否）
      complete: function (res) {
        //console.log(res)
        var result = res;
        resolve({
          data: res
        })
      },
      fail: function (res) {
        //console.log(res)
        /*
        wx.showModal({
          title: '提醒',
          content: '若不使用微信授权，则无法使用健康收藏夹的共享功能',
          cancelText:'不授权',
          confirmText:'授权',
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  //console.log(res)

                }
              })
            } else if (res.cancel) {
              
            }

          }
        })
       */
        resolve({
          data: {}
        })
      }
    });//获取用户资料结束


  });
}


function getUserData()
{

}
//获取用户资料2
function getUserInfo2() {

  return new Promise(function (resolve, reject) {
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "" 这个 scope

    wx.getUserInfo({
      success: function (res) {

      },
      //请求获取用户接口调用完毕（无论失败与否）
      complete: function (res) {
        console.log(res)
        var result = res;
        resolve({
          data: res
        })
      },
      fail: function (res) {
        resolve({
          data: {
            msg:'用户拒绝获取头像等资料'
          }
        })
       
      }
    });//获取用户资料结束


  });
}

//检查用户是否是会员通过userid
function CheckVipMemberByUserId(){
  var prefix = app.globalData.setStorage.prefix;
  var UserData = wx.getStorageSync(prefix + "UserData");
  //console.log(UserData);
  return new Promise(function (resolve, reject) {
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface_ysc.php', //仅为示例，并非真实的接口地址
      data: {
        "action":'CheckVipMemberByUserId',
        "userid": UserData.openid,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //console.log(res)
        resolve({
          data: res,
        })
      }
    })

  })
}

//检查用户新接口
function CheckVipMemberByUserId2() {
  var prefix = app.globalData.setStorage.prefix;
  var UserData = wx.getStorageSync(prefix + "UserData");
  console.log(UserData);
  return new Promise(function (resolve, reject) {
    wx.request({
      url: 'https://h5.12590.com/SlowDiseaseTreasure/interface_ysc.php', //仅为示例，并非真实的接口地址
      data: {
        "action": 'CheckVipMemberByUserId2',
        "userid": UserData.openid,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        wx.setStorage({
          key: 'SMDC_UserData',
          data: res.data,
        })
        resolve({
          data: res,
        })
      }
    })

  })
}
//检查用户是否是会员通过手机号
function CheckVipMemberByPhone(phone) {
  var prefix = app.globalData.setStorage.prefix;
  var UserData = wx.getStorageSync(prefix + "UserData");
  //console.log(UserData);
  return new Promise(function (resolve, reject) {
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface_ysc.php', //仅为示例，并非真实的接口地址
      data: {
        "action": 'CheckVipMemberByPhone',
        "phone": phone,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //console.log(res)
        resolve({
          data: res,
        })
      }
    })

  })
}
//用户激活手机号码绑定
function UpVipMemberByPhone(phone) {
  var prefix = app.globalData.setStorage.prefix;
  var UserData = wx.getStorageSync(prefix + "UserData");
  //console.log(UserData);
  return new Promise(function (resolve, reject) {
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface.php', //仅为示例，并非真实的接口地址
      data: {
        "action": 'binding',
        "phone": phone,
        "openid": UserData.openid,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        resolve({
          data: res,
        })
      }
    })

  })
}

//判断用户身份通过二维码
function CheckVipMemberByEwm(data){
  return new Promise(function (resolve, reject) {
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface_ysc.php?action=IsFamily', //仅为示例，并非真实的接口地址
      data: data,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //console.log(res)
        resolve({
          data: res,
        })
      }
    })

  })
}
//发送短信验证码接口
function SendMessage(data) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/Demo/SendTemplateSMS.php', //仅为示例，并非真实的接口地址
      data: data,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //console.log(res)
        resolve({
          data: res,
        })
      }
    })

  })

}
//发送短信验证码接口(统一版)
function SendMessageUnify(data) {
  return new Promise(function (resolve, reject) { 
    wx.request({
      url: 'https://f.12590.com/SlowDiseaseTreasure/interface.php?action=SendMessage', //仅为示例，并非真实的接口地址
      data: data,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        resolve({
          data: res,
        })
      }
    })
  
  })

}

/* 图片加载组件 */
//图片预加载
function genImgData(arr) {
  //console.log(arr);
  if (arr) {
    let ImgData = arr;

    return ImgData.map(item => {
      return {
        url: item.ImgUrl,
        loaded: false
      }
    })
  }

}
//图片缓存
function LoadedImgData(arr) {
  if (arr) {
    let ImgData = arr;
    return ImgData.map(item => {
      return {
        url: item.ImgUrl,
        loaded: true
      }
    })
  }

}
//获取当前的日期时间 格式“yyyy-MM-dd HH:MM:SS”
function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  var hours = date.getHours() ;
  var minutes = date.getMinutes() + 1;
  var seconds = date.getSeconds() + 1;
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  if (hours >= 0 && hours <= 9) {
    hours = "0" + hours;
  }
  if (minutes >= 0 && minutes <= 9) {
    minutes = "0" + minutes;
  }
  if (seconds >= 0 && seconds <= 9) {
    seconds = "0" + seconds;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
    + " " + hours + seperator2 + minutes
    + seperator2 + seconds;
  return currentdate;
}
//日期加减
function DateAddORSub(interval, type, number) {
  /* 
   * 功能:实现Script的Date加减功能. 
   * 参数:interval,字符串表达式，表示要添加的时间间隔. 
     d：天数 m：月份 y：年份
   * 参数:number,数值表达式，表示要添加的时间间隔的个数. 
   * 参数:type,加减类型. 
   * 返回:新的时间对象. 
   * var newDate =DateAddORSub("d","+",5); 
   */
  var date = new Date();
  switch (interval) {
    case "y": {
      if (type == "+") {
        date.setFullYear(date.getFullYear() + number);
      } else {
        date.setFullYear(date.getFullYear() - number);
      }
      return date;
      break;
    }
    case "q": {
      if (type == "+") {
        date.setMonth(date.getMonth() + number * 3);
      } else {
        date.setMonth(date.getMonth() - number * 3);
      }
      return date;
      break;
    }
    case "m": {
      if (type == "+") {
        date.setMonth(date.getMonth() + number);
      } else {
        date.setMonth(date.getMonth() - number);
      }
      return date;
      break;
    }
    case "w": {
      if (type == "+") {
        date.setDate(date.getDate() + number * 7);
      } else {
        date.setDate(date.getDate() - number * 7);
      }
      return date;
      break;
    }
    case "d": {
      if (type == "+") {
        date.setDate(date.getDate() + number);
      } else {
        date.setDate(date.getDate() - number);
      }
      return date;
      break;
    }
    case "h": {
      if (type == "+") {
        date.setHours(date.getHours() + number);
      } else {
        date.setHours(date.getHours() - number);
      }
      return date;
      break;
    }
    case "m": {
      if (type == "+") {
        date.setMinutes(date.getMinutes() + number);
      } else {
        date.setMinutes(date.getMinutes() - number);
      }
      return date;
      break;
    }
    case "s": {
      if (type == "+") {
        date.setSeconds(date.getSeconds() + number);
      } else {
        date.setSeconds(date.getSeconds() - number);
      }
      return date;
      break;
    }
    default: {
      if (type == "+") {
        date.setDate(d.getDate() + number);
      } else {
        date.setDate(d.getDate() - number);
      }
      return date;
      break;
    }
  }
}
//日期显示格式“yyyy-MM-dd”  
function formatDate(date) {
  ;
  var year = date.getFullYear();       //年  
  var month = date.getMonth() + 1;     //月  
  var day = date.getDate();            //日  
  return year + "-" + month + "-" + day;
}
//日期显示格式“yyyy-MM-dd HH:MM:SS” 
function formatDate2(date) {
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
    + " " + date.getHours() + seperator2 + date.getMinutes()
    + seperator2 + date.getSeconds();
  return currentdate;
}

//中文验证
function isChinese(str) {
  if (/^[\u3220-\uFA29]+$/.test(str)) {
    return true;
  } else {
    return false;
  }
}

//手机号验证
function isMobile(s) {
  var patrn = /^\s*(14\d{9}|15\d{9}|18\d{9}|13[0-9]\d{8})\s*$/;
  if (!patrn.exec(s)) {
    return false;
  }
  return true;
}

/*
根据〖中华人民共和国国家标准 GB 11643-1999〗中有关公民身份号码的规定，公民身份号码是特征组合码，由十七位数字本体码和一位数字校验码组成。排列顺序从左至右依次为：六位数字地址码，八位数字出生日期码，三位数字顺序码和一位数字校验码。
    地址码表示编码对象常住户口所在县(市、旗、区)的行政区划代码。
    出生日期码表示编码对象出生的年、月、日，其中年份用四位数字表示，年、月、日之间不用分隔符。
    顺序码表示同一地址码所标识的区域范围内，对同年、月、日出生的人员编定的顺序号。顺序码的奇数分给男性，偶数分给女性。
    校验码是根据前面十七位数字码，按照ISO 7064:1983.MOD 11-2校验码计算出来的检验码。
 
出生日期计算方法。
    15位的身份证编码首先把出生年扩展为4位，简单的就是增加一个19或18,这样就包含了所有1800-1999年出生的人;
    2000年后出生的肯定都是18位的了没有这个烦恼，至于1800年前出生的,那啥那时应该还没身份证号这个东东，⊙﹏⊙b汗...
下面是正则表达式:
 出生日期1800-2099  (18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])
 身份证正则表达式 /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i            
 15位校验规则 6位地址编码+6位出生日期+3位顺序号
 18位校验规则 6位地址编码+8位出生日期+3位顺序号+1位校验位
 
 校验位规则     公式:∑(ai×Wi)(mod 11)……………………………………(1)
                公式(1)中： 
                i----表示号码字符从由至左包括校验码在内的位置序号； 
                ai----表示第i位置上的号码字符值； 
                Wi----示第i位置上的加权因子，其数值依据公式Wi=2^(n-1）(mod 11)计算得出。
                i 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
                Wi 7 9 10 5 8 4 2 1 6 3 7 9 10 5 8 4 2 1
 
*/
//身份证号合法性验证 
//支持15位和18位身份证号
//支持地址编码、出生日期、校验位验证
function IdentityCodeValid(code) {
  var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
  var tip = "";
  var pass = true;

  if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
    tip = "身份证号格式错误";
    pass = false;
  }

  else if (!city[code.substr(0, 2)]) {
    tip = "地址编码错误";
    pass = false;
  }
  else {
    //18位身份证需要验证最后一位校验位
    if (code.length == 18) {
      code = code.split('');
      //∑(ai×Wi)(mod 11)
      //加权因子
      var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      //校验位
      var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
      var sum = 0;
      var ai = 0;
      var wi = 0;
      for (var i = 0; i < 17; i++) {
        ai = code[i];
        wi = factor[i];
        sum += ai * wi;
      }
      var last = parity[sum % 11];
      if (parity[sum % 11] != code[17]) {
        tip = "校验位错误";
        pass = false;
      }
    }
  }
  return pass;
}

//随机数
function MathRand(length) {
  var Num = "";
  for (var i = 0; i < length; i++) {
    Num += Math.floor(Math.random() * 10);
  }
  return Num;
}


//
function NavigateTo(url) {
  var _url = url;
  wx.navigateTo({
    url: _url,
  })
}
function RedirectTo(url) {
  wx.redirectTo({
    url: url
  })
}
//灵活性跳转页面
function ToPages(pages, url) {
  if (pages < 5) {
    wx.navigateTo({
      url: url,
      fail: function () {

      }

    });
  } else {
    wx.redirectTo({
      url: url,
      fail: function () {

      }

    });
  }
}
/** 
   * js截取字符串，中英文都能用 
   * @param str：需要截取的字符串 
   * @param len: 需要截取的长度 
   */
function CutStr(str, len) {
  var str_length = 0;
  var str_len = 0;
  var str_cut = new String();
  str_len = str.length;
  for (var i = 0; i < str_len; i++) {
    var a = str.charAt(i);
    str_length++;
    /*
    if (escape(a).length > 4) {
      //中文字符的长度经编码之后大于4 
      str_length++;
    }
    */
    str_cut = str_cut.concat(a);
    if (str_length >= len) {
      str_cut = str_cut.concat("...");
      return str_cut;
    }
  }
  //如果给定字符串小于指定长度，则返回源字符串； 
  if (str_length < len) {
    return str;
  }
}

module.exports = {
  DateAddORSub: DateAddORSub,
  genImgData: genImgData,
  LoadedImgData: LoadedImgData,
  getNowFormatDate: getNowFormatDate,
  formatDate: formatDate,
  formatDate2: formatDate2,
  isChinese: isChinese,
  isMobile: isMobile,
  IdentityCodeValid: IdentityCodeValid,
  dentityCodeValid: IdentityCodeValid,
  MathRand: MathRand,
  GetUserId: GetUserId,
  CheckVipMemberByPhone: CheckVipMemberByPhone,
  CheckVipMemberByUserId: CheckVipMemberByUserId,
  CheckVipMemberByUserId2: CheckVipMemberByUserId2,
  UpVipMemberByPhone: UpVipMemberByPhone,
  CheckVipMemberByEwm:CheckVipMemberByEwm,
  getUserInfo: getUserInfo,
  getUserInfo2: getUserInfo2,
  SendMessage: SendMessage,
  SendMessageUnify: SendMessageUnify,
  NavigateTo: NavigateTo,
  RedirectTo: RedirectTo,
  ToPages: ToPages,
  CutStr: CutStr,
  GetUserId_1: GetUserId_1
}