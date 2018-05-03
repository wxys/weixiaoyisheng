// pages/defTags/index.js
var Config = require('../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:true,
    PageShow:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 //获取本地存储的用户、
    var userPhone = wx.getStorageSync('SMDC_UserData');
    var article_id=options.autoid;
 
  
  this.setData({
    openid: userPhone.openid,
    article_id:article_id
  })
this.LoadData();
  },LoadData:function()
  {
    var _this=this;
    var openid = _this.data.openid;
    var article_id=_this.data.article_id;
    wx.request({
      url: Config.req_link(),
      data:{
        openid: openid,
        article_id: article_id,
        action:'getOTags'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) { 
        var tag=[];
        if (res.data.tag.length>0)
        {
          for(var i=0;i<res.data.tag.length;i++)
          {
            res.data.tag[i].click=0;
          }
        }
        if (res.data.user_tag.length > 0) {
          for (var i = 0; i < res.data.user_tag.length; i++) {
            res.data.user_tag[i].click = 0;
          }
        }
       _this.setData({
         article:res.data.article,
         tag:res.data.tag,
         user_tag: res.data.user_tag,
         loading:false,
         tag_name:''
       }) 

       console.log(_this.data.tag);
      }
    })

  }, DeleteNoteLabel:function(e)
  {
    console.log(e);
    var person = new Object();
    person.target = new Object();
    person.target.dataset = new Object();
   
    console.log(person);
   this.rmTag(e);
  },
 
  //点击删除文章标签
  DeleteNoteLabelIndex: function (e) {
    //console.log(e);
    var idx = e.target.dataset.idx;
    this.setData({
      DeleteNoteLabelIndex: idx,
    })
  },
  AddLabelFinish:function(e)
  {
    var value = e.detail.value;
    var _this=this;
    if(value!="")
    {
    var user_tag=this.data.user_tag;
    var $article_no=0;
    var _this=this;
    var $tag_no=0;
    for(var i=0;i<user_tag.length;i++)
    {
      if (user_tag[i].topic_name==value)
      {  
       for(var j=0;j<this.data.tag.length;j++)
       {
         if (this.data.tag[j].topic_name == value)
         {
          
           break;
         }
       }
       if (j >= this.data.tag.length)
       {
         //该文章还没有  这个标签、
         $article_no=1;
       }
       break;
      }
    }
    if (i >= user_tag.length) 
    {
      //总的标签还没有这个
      $article_no = 1;
    //  $tag_no=1;
    }
    $tag_no = 1;
    if($article_no==1)
    {
      var openid = _this.data.openid;
      var article_id = _this.data.article_id;
      wx.request({
        url: Config.req_link(),
        data:{
          action:"dealTag",
          tag_no: $tag_no,
          article_id: article_id,
          article_no: $article_no,
          new_tag_name: value, 
          openid: openid
        },
        header:{
          'content-type': 'application/json' // 默认值
        }
        ,success:function(res)
        {
          wx.showToast({
            title: '添加成功',
          })
          _this.LoadData();
        
        }
      })
    }
    }
  },
  rmTag:function(e)
  {
    var openid = this.data.openid;
    var value = e.target.dataset.idx;
    var user_tag = this.data.user_tag;
    var tag = this.data.tag;
    var article_id = this.data.article_id;
    var _this=this;
    for(var i=0;i<user_tag.length;i++)
    {
      if (user_tag[i].autoid == value && user_tag[i].isdefault=='1')
      {
        wx.showToast({
          title: '系统默认标签',
        }) 
        break;
      }
    }
    //不是默认的 
    if (i >= user_tag.length)
    {
      wx.showModal({
        title: '提示',
        content: '是否移除这个标签？',
        success: function (res) {
          if (res.confirm) {
           wx.request({
             url: Config.req_link(),
             data:{
               action:'rmTag',
               autoid:value,
               openid: openid,
               article_id: article_id
             },
             success:function(res)
             {
               //移除成功
               for (var j = 0; j < tag.length;j++)
               {
                 if(tag[j].autoid==value)
                 {
                   tag.splice(j,1);
                   break;
                 }

               }
               _this.setData({
                 tag:tag,
                 DeleteNoteLabelIndex: -1
               })
               wx.showToast({
                 title: '移除成功',
               })
             }
           })
          }
        }
      })

    }

    //判断是否是 系统默认的
    

  },
  OperateAllLabel:function(e)
{
  //获取这个的 id 
  
  var value = e.currentTarget.dataset.idx;
    console.log(value);
  
   var tag=this.data.tag;
   console.log(tag);
   //判断这个标签  是否已经在文章的标签中
   for (var i = 0; i < tag.length;i++)
   {
     if(tag[i].autoid ==value)
     {
       this.rmTag(e);

     }
   }
   if(i>=tag.length)
   {
     for(var j=0;j<this.data.user_tag.length;j++)
     {
       if (this.data.user_tag[j].autoid==value)
       {
         var e = {
           detail: {
             value: this.data.user_tag[j].topic_name

           }
         }
         this.AddLabelFinish(e);
         
       }
     }
    
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
  
  }
})