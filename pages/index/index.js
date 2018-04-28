var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['美国', '中国', '巴西', '日本'],
    taskvalue:[],
    index: 0,
    currentTab: 0,
    imageWidth: 110,
    img_arr:[],
    items: [
      { name: '延迟安装', value: '延迟安装', checked: 'true' },
      { name: '取消安装', value: '取消安装', },
    ],
    reasons: [
      { name: '和用户协商推迟', value: '和用户协商推迟', checked: 'true' },
      { name: '用户要求推迟', value: '用户要求推迟'},
      { name: '用户要求取消', value: '用户要求取消'},
    ],
    config: {
      pvshow: "",
      gpshow:"none"
    },
  },
  show: "",
  openid: "",
  token:"",
  scanurl: null,
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.openid = res.data;
      },
    }),
      wx.getStorage({
        key: 'token',
        success: function (res) {
          that.token = res.data;
        },
      })
    //获取任务列表
    wx.request({
      url: 'https://microservice.gmair.net/installation/assign/feedbacklist',
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      method: "GET",
      data: {wechatId:that.openid},
      success: function (res) {
        if (res.responseCode=="ResponseCode.RESPONSE_OK"){
          that.setData({
            array: res.data.data,
            taskvalue: res.data.value
          })
        }
      }
    }),
    that.setData({
      logo: "../image/upload.png"
    })
  },

  feedSubmit: function (e) {  
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    wx.request({
      url: 'https://microservice.gmair.net/installation/feedback/create',
      header: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
      },
      method: "POST",
      data: { assignId: e.detail.value.taskPicker, memberPhone: e.detail.value.phoneinput, status: e.detail.value.stateRadio, feedbackContent: e.detail.value.reasonRadio },
      success: function (res) {
        if (res.data.status == 0) {
          wx.showToast({
            title: res.data.info,
            icon: 'loading',
            duration: 1500
          })
        } else {
          wx.showToast({
            title: res.data.info,//这里打印出登录成功
            icon: 'success',
            duration: 1000
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '服务器网络错误!',
          icon: 'loading',
          duration: 1500
        })
      }
    })
  },

  //滑动切换
  swiperTab: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  //点击切换
  clickTab: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  scanclick: function () {
    var that = this;
    var show;
    var arr=[];
    wx.scanCode({
      success: (res) => {
        this.show =  res.result;
        this.scanurl=res.result;
        arr=this.show.split("/");
        if(arr.length>0){
          that.setData({
            show: arr[arr.length-1],
            scanurl: res.result
          })
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
        }
      },
      fail: (res) => {
        wx.showToast({
          title: '扫描失败',
          icon: 'none',
          duration: 2000
        })
      },
      complete: (res) => {
      }
    })
  },
  scanSubmit: function (e) {
    var that = this;
    var value = e.detail.value.scaninput;
    if(value==""){
      wx.showToast({
        title: '请输入二维码',
        icon: 'none',
        duration: 2000
      })
    }else{
      wx.request({
        url: 'https://microservice.gmair.net/installation/assign/qrcode',
        header: {
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        method: "POST",
        data: {qrcode:value},
        success: function (res) {
          if (res.responseCode=="RESPONSE_OK"){//二维码是存在的
            that.setData({
              config: {
                pvshow: "none",
                gpshow: ""
              },
            })
          } else if (res.responseCode=="RESPONSE_NULL"){//带货安装
          var orderid = res.data.orderid;
            wx.showModal({
              title: '提示',
              content: '是否是带货安装？',
              success: function (res) {
                if (res.confirm) {
                  wx.request({
                    url: 'https://microservice.gmair.net/installation/assign/withmachine',
                    header: {
                      "Content-Type": "application/x-www-form-urlencoded;"
                    },
                    method: "POST",
                    data: { wechatId: this.openid, qrcode:value},
                    success: function (res) {
                      that.setData({
                        config: {
                          pvshow: "none",
                          gpshow: ""
                        },
                      })
                    }
                  })
                } else {
                  wx.showToast({
                    title: '请重新扫描二维码',
                    duration: 1500
                  })
                }
              }
            })
          }else{//不存在
            wx.showToast({
              title: '二维码不存在！',
              icon: 'loading',
              duration: 1500
            })
          }
        },
        fail: function () {
          wx.showToast({
            title: '服务器网络错误!',
            icon: 'loading',
            duration: 1500
          })
        }
      })
   
  }
  },

  upconfirm: function () {
    this.up(0);
  },
  up: function (i) {
    var that = this;
    var data = {
      // openid: app.openid,
      // program_id: app.program_id,
     //  only_num: only_num
    }
    wx.uploadFile({
      url: 'https://microservice.gmair.net/installation/pic/upload',
      filePath: that.data.img_arr[i],
      name: 'fileName', //文件对应的参数名字(key)  
      formData: data,  //其它的表单信息  
      success: function (res) {
        i++
        if (i == that.data.img_arr.length) {
            console.log(res)
              wx.showModal({
                title: '提示',
                content: '提交成功!',
                success: function (res) {
                  that.onLoad()
                  wx.navigateBack({
                    delta: 1
                  })
                }
              })
        } else if (i < that.data.img_arr.length) {//若图片还没有传完，则继续调用函数  
          that.up(i)
        }
      },
      fail:function(res){
        wx.showModal({
          title: '提示',
          icon: 'none',
          content: '提交失败,请重新提交!',
        })
      }
    })
  },  
  upimg: function () {
    var that = this;
    if (this.data.img_arr.length < 8) {
      wx.chooseImage({
        sizeType: ['original'],
        success: function (res) {
          that.setData({
            img_arr: that.data.img_arr.concat(res.tempFilePaths)
          })
          // num = that.data.img_arr.length
        }
      });
      wx.previewImage({
        urls: that.data.images
      });
    } else {
      wx.showToast({
        title: '最多上传7张图片',
        icon: 'loading',
        duration: 3000
      });
    }
  }, 
  deleteImg: function (e) {
    var imgs = this.data.img_arr; 
    var index = e.currentTarget.dataset.index; 
    imgs.splice(index, 1);        
    this.setData({ img_arr: imgs }); 
    console.log("delete"+index);
  },
    
})

