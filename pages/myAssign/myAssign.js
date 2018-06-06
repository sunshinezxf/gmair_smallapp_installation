// pages/myAssign/myAssign.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    clientHeight:600,
    date: '2018-06-01', 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var utils = require('../../utils/util.js')
    var time = utils.formatTime0(new Date());
    // 再通过setData更改Page()里面的data，动态更新页面的数据  
    this.setData({
      date: time
    });  
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.windowHeight);
        that.setData({
          clientHeight: res.windowHeight-100,
        });
      }
    });
  },
  toPhoto:function(e){
    wx.navigateTo({
      url: '../getphoto/getphoto?qrcode=' + '35A108A477465',
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
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  }, 
})