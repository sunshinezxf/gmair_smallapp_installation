Page({
  data: {
    openid:"",
    token:"",
    menus: [
      {
        "name": "安装手册",
        "url": '../image/guidance.png',
        "index":1
      },
      {
        "name": "图片采集",
        "url": '../image/collect.png',
        "index": 2
      },
      {
        "name": "安装反馈",
        "url": '../image/feedback.png',
        "index": 3
      },
      {
        "name": "我的任务",
        "url": '../image/assign.png',
        "index": 4
      }
    ],
    process_name: [],
    process_id: [],
    process_code: [],
    process_date: [],
  },
  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    console.log("onload");
    var that = this
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        var app = getApp()
        var openid = res.data;
        that.setData({
          openid: openid
        })
      },
    }),
      wx.getStorage({
        key: 'token',
        success: function (res) {
          var app = getApp()
          var token = res.data;
          that.setData({
            token: token
          })
          wx.request({
            url: 'https://microservice.gmair.net/install-mp/assign/list',
            header: {
              "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            },
            method: "GET",
            data: { wechatId: that.data.openid, access_token: that.data.token, status: 2 },
            success: function (res) {
              if (res.data.responseCode == "RESPONSE_OK") {
                var tmparray = res.data.data;
                var namearray = [];
                var assignid_arr = [];
                var code_arr = [];
                var date_arr = [];
                console.log("processing" + tmparray.length);
                var utils = require('../../utils/util.js')
                for (var index in tmparray) {
                  namearray[index] = tmparray[index].consumerConsignee;
                  assignid_arr[index] = tmparray[index].assignId
                  console.log("pro id" + assignid_arr[index]);
                  code_arr[index] = tmparray[index].codeValue
                  var time = utils.formatTime(tmparray[index].assignDate / 1000, 'Y/M/D')
                  date_arr[index] = time
                }
                that.setData({
                  process_name: namearray,
                  process_id: assignid_arr,
                  process_code: code_arr,
                  process_date: date_arr

                })
              }
            }
          });
        }
      })
 
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  toPhoto: function (e) {
    var current = e.currentTarget.dataset.current;
   var code = this.data.process_code[current];
   console.log('to photo code'+code);
    wx.navigateTo({
      url: '../getphoto/getphoto?qrcode=' + code,
    })
  },
  jump: function (e) {
    //console.log("点击事件" + e.target.dataset.current);
    var i = e.target.dataset.current
    if(i==1){
      wx.navigateTo({
        url: '../manual/manual'
      })
    }
    else if(i==2){
      wx.navigateTo({
        url: '../photo/photo'
      })
    } 
    else if (i == 3) {
      wx.navigateTo({
        url: '../feedback/feedback'
      })
    }
    else if (i == 4) {
      wx.navigateTo({
        url: '../myAssign/myAssign'
      })
    }
   
  },

})