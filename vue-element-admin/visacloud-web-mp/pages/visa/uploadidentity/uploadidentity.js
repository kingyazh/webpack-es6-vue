import {
  httppostjson, httpgetjson
} from '../../../utils/http.js'
import { SUCCESSCODE, getimageurl } from '../../../utils/consts.js'
import {
  Base64,clone
} from '../../../utils/util.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dbid: '',
    frontExampleUrl: getimageurl('idf.png'),
    backExampleUrl: getimageurl('idb.png'),
    radioItems: [{
      name: '还未办理身份证',
      value: '1',
    }, {
      name: '身份证丢失',
      value: '2',
    }],
    dataInfo : {
      noIdentity : '0',
      noIdentityType: '',
      noIdentityTypeName : ''
    },
    frontSrc: '',
    backSrc: ''
  },
  changeNoIdentity: function(e) {
    var dataInfo = this.data.dataInfo;
    dataInfo.noIdentity = e.detail.value ? '1' : '0';
    if (!e.detail.value){
      dataInfo.noIdentityType = '';
      dataInfo.noIdentityTypeName = '';
    }
    this.setData({
      dataInfo: dataInfo
    })
  },
  radioChange: function(e) {
    var dataInfo = this.data.dataInfo;
    dataInfo.noIdentityType = e.detail.value;
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      if (radioItems[i].value == e.detail.value) dataInfo.noIdentityTypeName = radioItems[i].name;
    }
    this.setData({
      dataInfo: dataInfo
    })
  },
  showMenu: function(e) {
    var _this = this;
    let itemList = ['拍照', '选择照片'];
    let imagetype = e.currentTarget.dataset.type;
    if ((imagetype == 'idf' && !!_this.data.frontSrc) || (imagetype == 'idb' && !!_this.data.backSrc)) {
      itemList.push('查看');
    }
    wx.showActionSheet({
      itemList: itemList,
      success: function(data) {
        if (data.tapIndex == 2) {
          var current = imagetype == 'idf' ? _this.data.frontSrc : _this.data.backSrc;
          if (!!current) {
            // wx.previewImage({
            //   urls: [current],
            // })
            wx.redirectTo({
              url: '/pages/visa/cardconfirm/cardconfirm?dbid=' + _this.data.dbid + '&card_type=' + imagetype + '&src=' + current,
            })
          }
        } else {
          var sourceType = data.tapIndex == 0 ? ['camera'] : ['album'];
          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: sourceType, // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              wx.navigateTo({
                url: '/pages/wx-cropper/index?url=' + res.tempFilePaths[0] + '&dbid=' + _this.data.dbid + '&card_type=' + imagetype,
              })
            }
          })
        }
      },
      fail: function(err) {
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      dbid: options.dbid
    })
    this.init();
  },

  init: function () {
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
          frontSrc: custInfo.image_identityF_url ? custInfo.image_identityF_url : '',
          backSrc: custInfo.image_identityB_url ? custInfo.image_identityB_url : '',
          dataInfo: {
            noIdentity: custInfo.noIdentity ? custInfo.noIdentity : '0',
            noIdentityType: custInfo.noIdentityType ? custInfo.noIdentityType : '',
            noIdentityTypeName: custInfo.noIdentityTypeName ? custInfo.noIdentityTypeName : ''
          }
        })
      }
      wx.hideLoading();
    }).catch(err => {
      console.log(err);
      wx.hideLoading();
    })
  },

  saveIdentity : function(){
    var _this = this;
    // 调用后台保存
    // 整合参数
    let params = clone(_this.data.dataInfo);
    if (params.noIdentity == '1' && params.noIdentityType == ''){
      wx.showToast({
        title: '请选择没有身份证的原因', icon:'none'
      })
      return ;
    }
    var custInfo = wx.getStorageSync('custInfo:' + _this.data.dbid);
    params.enterprise_order_dbid = custInfo.enterprise_order_dbid;
    params.customer_id = custInfo.dbid;
    httppostjson('mp.customer.save', {
      json_data: new Base64().encode(JSON.stringify(params)),
      is_submit: 0
    }).then(data => {
      if (data.data.code == SUCCESSCODE) {
        // 保存成功，返回上一步
        wx.showToast({
          title: '保存成功'
        })
        _this.refreshPrevPage();
        wx.navigateBack()
      } else {
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        })
      }
    }).catch(err => {
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      })
    })
  },

  refreshPrevPage: function () {
    var pages = getCurrentPages();
    var infoPage = pages.filter(page => {
      return page.route == 'pages/visa/infoform/infoform';
    });
    if (infoPage.length > 0) {
      infoPage[0].reloadPage({
        step: infoPage[0].data.step,
        orderid: infoPage[0].data.orderid, // 订单id
        dbid: infoPage[0].data.dbid, // 客人id
        name: infoPage[0].data.name
      })
    }
  },

  previewImage : function(e){
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      urls: [src],
    })
  }
})