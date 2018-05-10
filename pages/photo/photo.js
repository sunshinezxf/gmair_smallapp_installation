Page({
  data: {
    show: "",
    scanurl: "",
    qrcode: "",
  },
  scanclick: function () {
    var that = this;
    var show;
    var arr = [];
    wx.scanCode({
      success: (res) => {
        this.show = res.result;
        this.scanurl = res.result;
        arr = this.show.split("/");
        if (arr.length > 0) {
          that.setData({
            show: arr[arr.length - 1],
            scanurl: res.result
          })
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 1000
          })
        }
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
    var that = this;
    var value = e.detail.value.scaninput;
    if (value == "") {
      wx.showToast({
        title: '请输入二维码',
        icon: 'none',
        duration: 1000
      })
    } else {
      console.log("token" + getApp().globalData.token + " openid" + getApp().globalData.openid);
      wx.request({
        url: 'https://microservice.gmair.net/install-mp/assign/qrcode',
        header: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        method: "GET",
        data: { qrcode: value, access_token: getApp().globalData.token},
        success: function (res) {
          // console.log(JSON.stringify(res));
          if (res.data.responseCode == "RESPONSE_OK") {//二维码是存在的
            that.setData({
              qrcode: value
            })
            wx.navigateTo({
              url: '../getphoto/getphoto?qrcode='+value,
            })
          } else if (res.data.responseCode == "RESPONSE_NULL") {//带货安装
            var orderid = res.data.orderid;
            //console.log("qrcode "+value);
            wx.showModal({
              title: '提示',
              content: '是否是带货安装？',
              success: function (res) {
                if (res.confirm) {
                  wx.request({
                    url: 'https://microservice.gmair.net/install-mp/assign/withmachine',
                    header: {
                      "Content-Type": "application/x-www-form-urlencoded;"
                    },
                    method: "POST",
                    data: { wechatId: getApp().globalData.openid, qrcode: value, access_token: getApp().globalData.token},
                    success: function (res) {
                      that.setData({
                        qrcode: value
                      })
                      wx.navigateTo({
                        url: '../getphoto/getphoto?qrcode='+value,
                      })
                    }
                  })
                } else {
                  wx.showToast({
                    title: '请重新扫描二维码',
                    duration: 1000
                  })
                }
              }
            })
          } else {//不存在
            wx.showToast({
              title: '二维码不存在！',
              icon: 'loading',
              duration: 1000
            })
          }
        },
        fail: function () {
          wx.showToast({
            title: '服务器网络错误!',
            icon: 'loading',
            duration: 1000
          })
        }
      })

    }
  },

})