// pages/getphoto/getphoto.js
Page({
  data: {
    imageWidth: 110,
    img_arr: [],
    picpath: [],
    qrcode:"",
  },
  onLoad:function(options){
    var that = this
    console.log("传过来的二维码"+options.qrcode);
    that.setData({
      qrcode:options.qrcode
    })
  },
  up: function (i) {
    var that = this;
    var data = {
      access_token: getApp().globalData.token
    }
    wx.uploadFile({
      url: 'https://microservice.gmair.net/install-mp/pic/upload',
      filePath: that.data.img_arr[i],
      name: 'fileName', //文件对应的参数名字(key) 
      header: { "Content-Type": "multipart/form-data" },
      formData: data,  //其它的表单信息  
      success: function (res) {
        i++
        var path = res.data;
        var newPic = [path];
        if (i == that.data.img_arr.length) {
          //  console.log(res)
          wx.showModal({
            title: '提示',
            content: '提交成功!',
            success: function (res) {
           //   that.onLoad();
              console.log("path " + path + " newpic" + newPic)
              that.setData({
                'picpath': that.data.picpath.concat(newPic)
              });
              // wx.navigateBack({
              //   delta: 1
              // })
            }
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
            img_arr: that.data.img_arr.concat(res.tempFilePaths)
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
    var imgs = this.data.img_arr;
    var index = e.currentTarget.dataset.index;
    imgs.splice(index, 1);
    this.data.picpath.splice(index, 1);
    this.setData({ img_arr: imgs });
    console.log("delete" + index);
  },
  upconfirm: function () {
    //   this.up(0);
    var that = this
    wx.request({
      url: 'https://microservice.gmair.net/install-mp/snapshot/create',
      header: {
        "Content-Type": "application/x-www-form-urlencoded;"
      },
      method: "POST",
      data: { wechatId: getApp().globalData.openid, qrcode: that.data.qrcode, picPath: that.data.picpath.toString(), access_token: getApp().globalData.token },
      success: function (res) {
        console.log("上传图片参数 picpath" + that.data.picpath.toString());
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
        }
      }
    })
  },
})