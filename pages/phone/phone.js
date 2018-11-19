Page({
  data: {
    openid:"",
    token:""
  },
  
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        var openid = res.data;
        that.setData({
          openid:openid
        })
        wx.getStorage({
          key: 'token',
          success: function(res1) {
            var token = res1.data;
            that.setData({
              token:token
            })
            wx.redirectTo({
               url: '/pages/index/index'
            })
          },
        })
      },
    })
  
  },

  phonebind: function (e) {
    var that = this
    var app = getApp()
    var openid = that.data.openid;
    // var openid = app.globalData.openid;
    console.log("phone页面获取openid"+that.data.openid);
    // console.log("memberphone" + e.detail.value.bindphone);
    wx.request({
      url: 'https://microservice.gmair.net/auth/install/bind',
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      method: "POST",
      data: { memberPhone: e.detail.value.bindphone, wechatId:openid},
      success: function (res) {
        if (res.data.responseCode=="RESPONSE_OK"){
          console.log(res);
          wx.request({
            url: 'https://microservice.gmair.net/oauth/install/token',
            header: {
              "Content-Type": "application/x-www-form-urlencoded;"
            },
            method: "POST",
            data: {
              username: openid,
              password: "",
              grant_type: "password",
              client_secret: "123456",
              client_id: "client_2"
            },
            success: function (res) {
              var token = res.data.access_token;
              if (token != "" && token != null) {
                console.log("token" + token);
                var app = getApp()
                app.globalData.token = token;
              } else {
                var app = getApp()
                app.globalData.token = "";
              }
              wx.redirectTo({
                url: '/pages/index/index'
              })
            }
          })
         
        }else{
         console.log(JSON.stringify(res));
          wx.showModal({
            title: '提示',
            icon: 'none',
            content: '绑定失败，请联系工作人员',
          })
        }
      }
    })
  }

})