// pages/getphoto/getphoto.js
Page({
  data: {
    imageWidth: 110,
    img_arr: [],
    preview_arr:[],
    picpath: [],
    qrcode:"",
    openid: "",
    token: "",
    latitude:"",
    longitude:"",
    items: [
      { name: 1, value: '是', checked: 'true' },
      { name: 0, value: '否', },
    ],
    ways:[
      { name: '玻璃', value: '玻璃', checked: 'true' },
      { name: '墙体', value: '墙体', },
    ]
  },
  onLoad:function(options){
    var that = this
    console.log("传过来的二维码"+options.qrcode);
    that.setData({
      qrcode:options.qrcode
    })
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
          },
        })
      },
    })
  },
  up: function (i) {
    wx.showLoading({
      title: '上传中',
    })
    var that = this;
    var data = {
      access_token: that.data.token
    }
    // console.log("上传图片token" + getApp().globalData.token)
    wx.uploadFile({
      url: 'https://microservice.gmair.net/install-mp/pic/upload',
      filePath: that.data.img_arr[i],
      name: 'fileName', //文件对应的参数名字(key) 
      header: { "Content-Type": "multipart/form-data" },
      formData: data,  //其它的表单信息  
      success: function (res) {
        i++
        var path = JSON.parse(res.data).data;
        var newPic = [path];
        that.setData({
          'picpath': that.data.picpath.concat(newPic)
        });
        if (i == that.data.img_arr.length) {
          //  console.log(res)
          
          console.log("图片路径concat后 " + that.data.picpath)
          wx.hideLoading({
          })
          that.setData({
            img_arr:[]
          })
         
        } else if (i < that.data.img_arr.length) {//若图片还没有传完，则继续调用函数  
          that.up(i)
        }
      },
      fail: function (res) {
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
            img_arr: that.data.img_arr.concat(res.tempFilePaths),
            preview_arr: that.data.preview_arr.concat(res.tempFilePaths)
          }),
            that.up(0);
          // num = that.data.img_arr.length
        }
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
    var imgs = this.data.preview_arr;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    this.data.picpath.splice(index, 1);
    this.setData({ preview_arr: imgs });
    console.log("delete" + index);
  },
  submitLocation: function (e) {
    var that =this
    wx.request({
      url: 'https://microservice.gmair.net/install-mp/snapshot/create',
      header: {
        "Content-Type": "application/x-www-form-urlencoded;"
      },
      method: "POST",
      data: { wechatId: that.data.openid, qrcode: that.data.qrcode, picPath: that.data.picpath.toString(), access_token: that.data.token, latitude: that.data.latitude, longitude: that.data.longitude, net: e.detail.value.netRadio, installType: e.detail.value.wayRadio },
      success: function (res) {
        console.log("latitude" + that.data.latitude + "longitude" + that.data.longitude);
        console.log("上传图片参数 picpath" + JSON.stringify(that.data.picpath));
        if (res.data.responseCode == "RESPONSE_OK") {
          console.log("成功保存路径");
          wx.navigateTo({
            url: '../index/index',
          })
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1000
          })
        } else {
          wx.showToast({
            title: '提交失败',
            icon: 'none',
            duration: 1000
          })
        }
      }, fail: function (e) {
        wx.showToast({
          title: '获取地理位置失败，请重新提交',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  bindSaveTap: function (e) {
    var that = this
    console.log("net" + e.detail.value.netRadio + " " + e.detail.value.wayRadio)
    var latitude="";
    var longitude="";
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        latitude = res.latitude
        longitude = res.longitude
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        console.log("latitude" + latitude + "longitude" + longitude);
        that.submitLocation(e);
          },fail:function(res){
        that.submitLocation(e);
            wx.showToast({
              title: '网络错误！',
              icon: 'none',
              duration: 1000
            })
          }
        })
    //   this.up(0);
  },

 
  // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
    var that = this
    var index = e.currentTarget.dataset.index;
    console.log("当前图片下标"+index);
    //所有图片
    var imgs = that.data.preview_arr;
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      urls: imgs
    })
  }
})