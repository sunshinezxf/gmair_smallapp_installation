Page({
  data: {
    array:[],
    assignArr: [],
    openid: "",
    token: "",
    index: 0,
    date: '2018-06-01', 
    showView: true,
    items: [
      { name: '延迟安装', value: '延迟安装', checked: 'true' },
      { name: '取消安装', value: '取消安装', },
    ],
    reasonArr: ['客户无理由退货', '墙体和玻璃都无法安装', '客户不认可安装方式或位置', '安装质量不满意', '产品质量不满意','其他'],
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })  
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  reasonChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  //  点击日期组件确定事件  
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  }, 
  onLoad: function (options) {
    console.log("onload");
    showView: (options.showView == "true" ? true : false)  
    var that = this
    var utils = require('../../utils/util.js')
    var time = utils.formatTime0(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据  
    this.setData({
      date: time
    });  
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
              url: 'https://microservice.gmair.net/install-mp/assign/list',
              header: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
              },
              method: "GET",
              data: { wechatId: that.data.openid, access_token: that.data.token,status:2 },
              success: function (res) {
                if (res.data.responseCode == "RESPONSE_OK") {
                  var tmparray = res.data.data;
                  var namearray = [];
                  var assignid_arr = [];
                  for (var index in tmparray) {
                    var time = utils.formatTime(tmparray[index].assignDate / 1000, 'Y/M/D')
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
    // var phone = e.detail.value.phoneinput;
    // if(phone==""){
    //   wx.showToast({
    //     title: "请输入电话号码",
    //     icon: 'loading',
    //     duration: 1000
    //   })
    // }else{
      if(that.data.showView==true){
        console.log('延迟');
        var date = e.detail.value.datePicker;
        wx.request({
          url: 'https://microservice.gmair.net/install-mp/assign/postpone',
          header: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
          },
          method: "POST",
          data: { assignId: that.data.assignArr[e.detail.value.taskPicker], date:date, access_token: that.data.token },
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
      }else{
        console.log('取消')
        var reason = e.detail.value.reasonPicker;
        wx.request({
          url: 'https://microservice.gmair.net/install-mp/assign/cancel',
          header: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
          },
          method: "POST",
          data: { assignId: that.data.assignArr[e.detail.value.taskPicker], description: reason, access_token: that.data.token },
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
   
    // }
  },

})