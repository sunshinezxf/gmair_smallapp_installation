Page({
  data: {
    array:[],
    assignArr: [],
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
  onLoad: function (options) {
    console.log("onload");
    var that = this
          //获取任务列表
    wx.request({
            url: 'https://microservice.gmair.net/install-mp/assign/feedbacklist',
            header: {
              "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            },
            method: "GET",
            data: { wechatId: getApp().globalData.openid, access_token: getApp().globalData.token },
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
      data: { assignId: that.data.assignArr[e.detail.value.taskPicker], memberPhone: e.detail.value.phoneinput, status: e.detail.value.stateRadio, feedbackContent: e.detail.value.reasonRadio, access_token: getApp().globalData.token },
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