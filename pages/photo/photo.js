Page({
  data: {
    show: "",
    scanurl: "",
    qrcode: "",
    openid: "",
    token: ""
  },
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        var openid = res.data;
        that.setData({
          openid: openid
        })
      },
    });
    wx.getStorage({
      key: 'token',
      success: function (res) {
        var token = res.data;
        that.setData({
          token: token
        })
      },
    })
  },
  scanclick: function () {
    var that = this;
    var show;
    var arr = [];
    wx.scanCode({
      success: (res) => {
        //obtain the scan result
        this.show = res.result;
        this.scanurl = res.result;
        wx.request({
          url: 'https://microservice.gmair.net/install-mp/assign/getValue/byUrl',
          header: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
          },
          method: "GET",
          data: {codeUrl: res.result, access_token: that.data.token},
          success: function(res) {
            res = res.data
            if(res.responseCode == "RESPONSE_OK") {
              that.setData({
                'qrcode': res.data[0].codeValue,
                'show': res.data[0].codeValue
              });
              wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 1000
              })
            }else {
              wx.showToast({
                title: '失败',
                icon: 'none',
                duration: 1000
              })
            }
            
            
          },
          fail: function(res) {
            wx.showToast({
              title: '失败',
              icon: 'none',
              duration: 1000
            })
          }
        });
      },
      fail: (res) => {
        wx.showToast({
          title: '扫描失败',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  scanSubmit: function (e) {
    console.log("hhahhaha")
    var that = this;
    var openid = that.data.openid;
    var token = that.data.token;
    var value = e.detail.value.scaninput;
    if (value == "") {
      wx.showToast({
        title: '请输入二维码',
        icon: 'none',
        duration: 1000
      })
    } else {
      wx.request({
        url: 'https://microservice.gmair.net/install-mp/assign/create',
        header: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        method: 'POST',
        data: {access_token: token, openId: openid, codeValue: that.data.qrcode},
        success: function(res) {
          res = res.data
          wx.navigateTo({
            url: '../getphoto/getphoto?qrcode=' + that.data.qrcode,
          })
        },
        fail: function(res) {
          console.log(JSON.stringify(res));
        }
      })
      //检查是否有该二维码的安装任务，若已存在，则无需重新创建
      
    }
  },

})