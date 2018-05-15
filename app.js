App({
  globalData: {
    appid: 'wx95ce2e722268919b',
    openid:"",
    token:"",
  }, 
  onLaunch: function () {
    wx.login({
      success: function (res) {
        if (res.code) {
          console.log('登录成功'+res.code);
          //发起网络请求,将code发送到服务端
          wx.request({
            url: 'https://microservice.gmair.net/auth/install/openid',
            header: {
              "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            },
            method: "POST",
            data: {
              code: res.code
            },
            success: function (res) {
              var code = res.data.responseCode;
              if(code=="RESPONSE_OK"){
                var openid = res.data.data;
                console.log("openid " + openid);
                var app = getApp()
                app.globalData.openid = openid;
                wx.request({
                  url: 'https://microservice.gmair.net/oauth/install/token',
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded;"
                  },
                  method: "POST",
                  data: {
                    username: openid,
                    password:"",
                    grant_type:"password",
                    client_secret:"123456",
                    client_id:"client_2"
                  },
                  success: function (res) {
                      var token = res.data.access_token;
                      if (token != "" && token != null) {
                        console.log("token" + token);
                        var app = getApp()
                        app.globalData.token = token;
                      }else{
                        var app = getApp()
                        app.globalData.token = "";
                      }
                    }
                })
              }
            }, fail: function (res){
              console.log("login error:"+res.errMsg);
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  globalData: {
    hasLogin: false
  }
});