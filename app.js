App({
  globalData: {
    appid: 'wx95ce2e722268919b'
  }, 
  onLaunch: function () {
    //APP启动时，会首先调用login接口获取用户的code，根据code换取用户的openid
    wx.login({
      success: function (res) {
        if (res.code) {
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
              if(code == "RESPONSE_OK"){
                var openid = res.data.data;
                wx.setStorage({
                  key: 'openid',
                  data: openid,
                  success: function (res) {
                  }
                })
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
                        wx.setStorage({
                          key: 'token',
                          data: token,
                          success: function (res) {
                            console.log('token存入缓存'+token)
                          }
                        })
                      }else{
                        // var app = getApp()
                        // app.globalData.token = "";
                        console.log('登录失败！' + res.errMsg)
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
    
  },
  onHide: function () {
    
  },
  globalData: {
    hasLogin: false
  }
});