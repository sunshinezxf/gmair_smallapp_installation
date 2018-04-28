App({
  globalData: {
    appid: 'wx95ce2e722268919b',//appid需自己提供，此处的appid我随机编写  

  }, 
  onLaunch: function () {
    wx.login({
      success: function (res) {
        if (res.code) {
          console.log('登录成功');
              //   wx.setStorage({
              //   key: "openid",
              //   data: '123'
              // })
          //发起网络请求,将code发送到服务端
          wx.request({
            url: 'https://microservice.gmair.net/install/auth/openid',
            header: {
              "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            },
            method: "GET",
            data: {
              code: res.code
            },
            success: function (res) {
              var openid = res.data;
              wx.setStorage({
                key: "openid",
                data: openid
              })
              wx.request({
                url: 'https://microservice.gmair.net/oauth/install/token',
                header: {
                  "Content-Type": "application/x-www-form-urlencoded;"
                },
                method: "GET",
                data: {
                  openid: openid
                },
                success: function (res) {
                  var token = res.data.access_token;
                  if(token!=""&&token!=null){
                    wx.setStorage({
                    key: "token",
                    data: token
                  })
                  }
                }
              })
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