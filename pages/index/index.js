Page({
  data: {
    openid:"",
    token:"",
    menus: [
      {
        "name": "安装手册",
        "url": '../image/guidance.png',
        "index":1
      },
      {
        "name": "图片采集",
        "url": '../image/collect.png',
        "index": 2
      },
      {
        "name": "安装反馈",
        "url": '../image/feedback.png',
        "index": 3
      },
      {
        "name": "第四个",
        "url": '../image/guidance.png',
        "index": 4
      }
    ],

  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    console.log("onload");
    var that = this
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        var app = getApp()
        var openid = res.data;
        app.globalData.openid=openid;
      },
    }),
      wx.getStorage({
        key: 'token',
        success: function (res) {
          var app = getApp()
          var token = res.data;
          app.globalData.token = token;
        }
      })
  },
  jump: function (e) {
    //console.log("点击事件" + e.target.dataset.current);
    var i = e.target.dataset.current
    if(i==1){
      wx.navigateTo({
        url: '../manual/manual'
      })
    }
    else if(i==2){
      wx.navigateTo({
        url: '../photo/photo'
      })
    } 
    else if (i == 3) {
      wx.navigateTo({
        url: '../feedback/feedback'
      })
    }
    else if (i == 4) {
      wx.navigateTo({
        url: '../photo/photo'
      })
    }
   
  },

})