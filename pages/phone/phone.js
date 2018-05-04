Page({
  data: {
    
  },
  openid: "",
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'token',
      success: function(res) {
        wx.redirectTo({
          url:'/pages/index/index'
        }
        );
      }
    }),
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        that.openid=res.data;
      },
    })
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
        if (res.responseCode==("RESPONSE_OK")){
          wx.redirectTo({
            url: '/pages/index/index'
          })
        }
      }
    })
  }

})