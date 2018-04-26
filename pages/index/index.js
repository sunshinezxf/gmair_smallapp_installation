var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['美国', '中国', '巴西', '日本'],
    objectArray: [
      {
        id: 0,
        name: '美国'
      },
      {
        id: 1,
        name: '中国'
      },
      {
        id: 2,
        name: '巴西'
      },
      {
        id: 3,
        name: '日本'
      }
    ],
    index: 0,
    currentTab: 0,
    items: [
      { name: '1', value: '延迟安装', checked: 'true' },
      { name: '2', value: '取消安装', },
    ],
    reasons: [
      { name: '1', value: '和用户协商推迟', checked: 'true' },
      { name: '2', value: '用户要求推迟'},
      { name: '3', value: '用户要求取消'},
    ],
    config: {
      pvshow: "",
      gpshow:"none"
    },
  },
  show: "", 
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
    that.setData({
      logo: "../image/upload.png"
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  feedSubmit: function (e) {  
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    wx.request({
      url: 'https://shop.com/home/Login/register',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: { task: e.detail.value.taskPicker, state: e.detail.value.stateRadio, reason: e.detail.value.reasonRadio },
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
    wx.scanCode({
      success: (res) => {
        this.show =  res.result;
        this.scanurl=res.result;
        that.setData({
          show: this.show,
          scanurl: res.result
        })
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: (res) => {
        wx.showToast({
          title: '失败',
          icon: 'fail',
          duration: 2000
        })
      },
      complete: (res) => {
      }
    })
  },
  subCode: function () {
    var that = this;
    that.setData({
      config: {
        pvshow: "none",
        gpshow: ""
      },
    })
  },
  bindSaveTap: function (e) {
    console.log(e)
    var formData = {
      uid: util.getUserID(),
    }
    console.log(formData)
    app.apiFunc.upload_file(app.apiUrl.modify_user, this.data.logo, 'photos', formData,
      function (res) {
        console.log(res);
      },
      function () {
      })
  },  

  chooseImageTap: function () {
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            _this.chooseWxImage('camera')
          }
        }
      }
    })
  },
  chooseWxImage: function (type) {
    let _this = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res);
        _this.setData({
          logo: res.tempFilePaths[0],
        })
      }
    })
  },
  //上传文件
  upload_file: function (url, filePath, name, formData, success, fail) {
    console.log('a=' + filePath)
wx.uploadFile({
      url: rootUrl + url,
      filePath: filePath,
      name: name,
      header: {
        'content-type': 'multipart/form-data'
      }, // 设置请求的 header
      formData: formData, // HTTP 请求中其他额外的 form data
      success: function (res) {
        console.log(res);
        if (res.statusCode == 200 && !res.data.result_code) {
          typeof success == "function" && success(res.data);
        } else {
          typeof fail == "function" && fail(res);
        }
      },
      fail: function (res) {
        console.log(res);
        typeof fail == "function" && fail(res);
      }
    })
  }
})

