import { getimageurl } from '../../../utils/consts.js'
import {
  httpgetjson
} from '../../../utils/http.js'
import {
  clone
} from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    passportExampleUrl: getimageurl('ppt.png'),
    pptSrc : ''
  },

  showMenu: function (e) {
    var _this = this;
    let itemList = ['拍照', '选择照片'];
    let imagetype = e.currentTarget.dataset.type;
    if (!!_this.data.pptSrc) {
      itemList.push('查看');
    }
    wx.showActionSheet({
      itemList: itemList,
      success: function (data) {
        if (data.tapIndex == 2) {
          if (!!_this.data.pptSrc) {
            // wx.previewImage({
            //   urls: [_this.data.pptSrc],
            // })
            wx.redirectTo({
              url: '/pages/visa/cardconfirm/cardconfirm?dbid=' + _this.data.dbid + '&card_type=' + imagetype + '&src=' + _this.data.pptSrc,
            })
          }
        } else {
          var sourceType = data.tapIndex == 0 ? ['camera'] : ['album'];
          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: sourceType, // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              wx.navigateTo({
                url: '/pages/wx-cropper/index?url=' + res.tempFilePaths[0] + '&dbid=' + _this.data.dbid + '&card_type=' + imagetype,
              })
            }
          })
        }
      },
      fail: function (err) {
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      dbid: options.dbid
    })
    this.init();
  },

  init : function(){
    var _this = this;
    var dbid = _this.data.dbid;
    wx.showLoading({
      mask: true
    });
    httpgetjson('mp.customer.init', {
      customer_id: dbid
    }).then(data => {
      if (data.data && typeof data == 'object') {
        // 将客人现有信息放入storage，以便保存时比对
        var custInfo = clone(data.data);
        wx.setStorageSync('custInfo:' + dbid, custInfo);
        _this.setData({
          pptSrc: custInfo.image_passport_url ? custInfo.image_passport_url : ''
        })
      }
      wx.hideLoading();
    }).catch(err => {
      console.log(err);
      wx.hideLoading();
    })
  },

  previewImage: function (e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      urls: [src],
    })
  }
})