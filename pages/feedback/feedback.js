Page({
  data: {
    array:[],
    assignArr: [],
    openid: "",
    token: "",
    index: 0,
    items: [
      { name: '延迟安装', value: '延迟安装', checked: 'true' },
      { name: '取消安装', value: '取消安装', },
    ],
    reasons: [
      { name: '和用户协商推迟', value: '和用户协商推迟', checked: 'true' },
      { name: '用户要求推迟', value: '用户要求推迟' },
      { name: '用户要求取消', value: '用户要求取消' },
    ],
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  onLoad: function (options) {
    console.log("onload");
    var that = this
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        var openid = res.data;
        that.setData({
          openid: openid
        })
        wx.getStorage({
          key: 'token',
          success: function (res1) {
            var token = res1.data;
            that.setData({
              token: token
            })
            //获取任务列表
            wx.request({
              url: 'https://microservice.gmair.net/install-mp/assign/feedbacklist',
              header: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
              },
              method: "GET",
              data: { wechatId: that.data.openid, access_token: that.data.token },
              success: function (res) {
                if (res.data.responseCode == "RESPONSE_OK") {
                  var utils = require('../../utils/util.js')
                  var tmparray = res.data.data;
                  var namearray = [];
                  var assignid_arr = [];
                  for (var index in tmparray) {
                    var time = utils.formatTime(tmparray[index].assignDate / 1000, 'Y/M/D h:m:s')
                    namearray[index] = tmparray[index].consumerConsignee + " " + time;
                    assignid_arr[index] = tmparray[index].assignId
                  }
                  that.setData({
                    array: namearray,
                    assignArr: assignid_arr
                  })
                }
              }
            })
          },
        })
      },
    })
   
        },

  feedSubmit: function (e) {
    var that = this
    console.log("feed参数" + that.data.assignArr[e.detail.value.taskPicker]);
    var phone = e.detail.value.phoneinput;
    if(phone==""){
      wx.showToast({
        title: "请输入电话号码",
        icon: 'loading',
        duration: 1000
      })
    }else{
    wx.request({
      url: 'https://microservice.gmair.net/install-mp/feedback/create',
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      method: "POST",
      data: { assignId: that.data.assignArr[e.detail.value.taskPicker], memberPhone: e.detail.value.phoneinput, status: e.detail.value.stateRadio, feedbackContent: e.detail.value.reasonRadio, access_token: that.data.token },
      success: function (res) {
        if (res.data.responseCode == "RESPONSE_OK") {
          wx.navigateTo({
            url: '../index/index',
          })
          wx.showToast({
            title: "反馈成功",
            icon: 'success',
            duration: 1000
          })
        } else {
          wx.showToast({
            title: "反馈失败",
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