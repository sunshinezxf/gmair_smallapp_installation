Page({
  data: {
    
  },
  openid: "",
  onLoad: function (options) {
    var that = this
    var app = getApp()
    var openid =  app.globalData.openid;
    var token = app.globalData.token;
    if(openid!=""&&token!=""){
      wx.redirectTo({
        url: '/pages/index/index'
      })
    }
  
  },
  phonebind: function (e) {
    var that = this
    console.log("openid"+that.openid);
    console.log("memberphone" + e.detail.value.bindphone);
    wx.request({
      url: 'https://microservice.gmair.net/auth/install/bind',
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      method: "POST",
      data: { memberPhone: e.detail.value.bindphone, wechatId:that.openid },
      success: function (res) {
        if (res.data.responseCode=="RESPONSE_OK"){
          console.log(res);
          wx.redirectTo({
            url: '/pages/index/index'
          })
        }
      }
    })
  }

})