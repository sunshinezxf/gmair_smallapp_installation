// pages/myAssign/myAssign.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    clientHeight:550,
    date: '2018-06-01', 
    assign_name:[],
    assign_id:[],
    assign_code:[],
    process_name: [],
    process_id: [],
    process_code: [],
    process_date:[],
    finished:0,
    closed:0,
    assign_list: []
  },
  getAssigned: function (e) {
    var that = this
    wx.request({
      url: 'https://microservice.gmair.net/install-mp/assign/list',
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      method: "GET",
      data: { wechatId: that.data.openid, access_token: that.data.token, status: 1 },
      success: function (res) {
        if (res.data.responseCode == "RESPONSE_OK") {
          var tmparray = res.data.data;
          var namearray = [];
          var assignid_arr = [];
          var code_arr = [];
          console.log("array size" + tmparray.length);
          for (var index in tmparray) {
            namearray[index] = tmparray[index].consumerConsignee;
            assignid_arr[index] = tmparray[index].assignId
            code_arr[index] = tmparray[index].codeValue
          }
          that.setData({
            assign_name: namearray,
            assign_id: assignid_arr,
            assign_code: code_arr,
            assign_list: res.data.data
          })
        } else if (res.data.responseCode == "RESPONSE_NULL"){
          that.setData({
            assign_name: [],
            assign_id: [],
            assign_code: [],
            assign_list: []
          })
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    let utils = require('../../utils/util.js')
    var time = utils.formatTime0(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据  
    this.setData({
      date: time
    });  
    console.log('调用onload方法')
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
            that.getAssigned();
          },
        })
      },
    })

  },
 assign_list: function(status) {
   let that = this;
   wx.request({
     url: 'https://microservice.gmair.net/install-mp/assign/list',
     header: {
       "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
     },
     method: "GET",
     data: { wechatId: that.data.openid, access_token: that.data.token, status: status },
     success: function(res) {
       res = res.data;
       if(res.responseCode == 'RESPONSE_OK') {
        let assign_list = res.data;
        let utils = require('../../utils/util.js')
        for(let i = 0; i < res.data.length; i ++) {
          let date = utils.formatTime(res.data[i].assignDate / 1000, 'Y-M-D');
          assign_list[i].createAt = date;
          console.log("[date]" + date)
          console.log(JSON.stringify(assign_list[i]))
        }
         that.setData({
           assign_list: assign_list
         });
       }else {
         that.setData({
           assign_list: []
         })
       }
     }
   })
 },
 getProcessing:function(e){
   var that = this
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
           process_date: date_arr,
           assign_list: res.data.data
         })
         let assign_list = res.data;
         for (let i = 0; i < res.data.length; i++) {
           let date = utils.formatTime(res.data[i].assignDate / 1000, 'Y/M/D');
           assign_list[i].createAt = date;
         }
         that.setData({
           assign_list: assign_list
         });
       } else if (res.data.responseCode == "RESPONSE_NULL") {
         that.setData({
           process_name: [],
           process_id: [],
           process_code: [],
           process_date: [],
           assign_list: []
         })
     }
     }
   });
 },
 getNum:function(e){
   var that = this
   wx.request({
     url: 'https://microservice.gmair.net/install-mp/assign/list',
     header: {
       "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
     },
     method: "GET",
     data: { wechatId: that.data.openid, access_token: that.data.token, status: 3 },
     success: function (res) {
       if (res.data.responseCode == "RESPONSE_OK") {
         var tmparray = res.data.data;
         that.setData({
           finished: tmparray.length
         })
       }
     }
   });
   wx.request({
     url: 'https://microservice.gmair.net/install-mp/assign/list',
     header: {
       "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
     },
     method: "GET",
     data: { wechatId: that.data.openid, access_token: that.data.token, status: 4 },
     success: function (res) {
       if (res.data.responseCode == "RESPONSE_OK") {
         var tmparray = res.data.data;
         that.setData({
           closed: tmparray.length
         })
       }
     }
   });
 },

  toPhoto:function(e){
    var current = e.currentTarget.dataset.current;
    var code = this.data.process_code[current];
    console.log('to photo code' + code);
    wx.navigateTo({
      url: '../getphoto/getphoto?qrcode=' + code,
    })
  },
  chooseDate:function(e){
    var date0 = e.detail.value.datePicker0;
    var date1 = e.detail.value.datePicker1;
    var date2 = e.detail.value.datePicker2;
    console.log(date0+" "+date1+" "+date2);
  },

  //滑动切换
  swiperTab: function (e) {
    var that = this;
    var current = e.detail.current
    that.setData({
      currentTab: e.detail.current
    });
    console.log('current'+current);
    if (current == 0) {
      that.getAssigned();
    } else if (current == 1) {
      that.getProcessing();
    } else if (current == 2) {
      that.getNum();
    }
  },
  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      var current = e.target.dataset.current
      that.setData({
        currentTab: current
      })
     if(current==0){
       that.getAssigned();
     }else if(current == 1){
       that.getProcessing();
     }else if(current==2){
       that.assign_list(3);
     }
    }
  },
  toPhoto:function(e){
    var that = this;
    const index = e.currentTarget.dataset.current
    var code_arr = that.data.process_code;
    var code = code_arr[index];
    console.log(code)
    wx.navigateTo({
      url: '../getphoto/getphoto?qrcode=' + code,
    })
  },
  bindDateChange: function (e) {
    var that = this
    const index = e.target.dataset.current
    var id_arr = that.data.assign_id;
    var assignId= id_arr[index];
    var date = e.detail.value+" "+"00:00:00";
    console.log('chooseDate' + e.detail.value + id_arr[index]);
    wx.request({
      url: 'https://microservice.gmair.net/install-mp/assign/date',
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      method: "POST",
      data: { assignId: assignId, access_token: that.data.token, installDate: date },
      success: function (res) {
        if (res.data.responseCode == "RESPONSE_OK") {
          // that.onLoad();
          // wx.showToast({
          //   title: '选择成功',
          // })
          that.onLoad();
        }else{
          wx.showToast({
            title: '修改失败',
            icon:'none'
          })
        }
      }
    });
  }, 
})