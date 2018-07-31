import { httpuploadocr, httpgetjson, httppostjson } from '../../../utils/http.js'
import { SUCCESSCODE } from '../../../utils/consts.js'
import {
  Base64
} from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    files : []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      dbid : options.dbid
    })
    var custInfo = wx.getStorageSync('custInfo:' + options.dbid);
    this.setData({
      files: custInfo.otherMaterialList ? custInfo.otherMaterialList : []
    })
  },
  showMenu: function (e) {
    var _this = this;
    let itemList = ['拍照', '选择照片'];
    let imagetype = e.currentTarget.dataset.type;
    wx.showActionSheet({
      itemList: itemList,
      success: function (data) {
        var sourceType = data.tapIndex == 0 ? ['camera'] : ['album'];
        wx.chooseImage({
          // count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: sourceType, // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            _this.uploadImage({
              path: res.tempFilePaths
            });
          }
        })
      },
      fail: function (err) {
      }
    })
  },

  uploadImage: function (params) {
    console.log(JSON.parse(JSON.stringify(params)));
    var _this = this,
      i = params.i ? params.i : 0,
      len = params.path.length,
      success = params.success ? params.success : 0,
      fail = params.fail ? params.fail : 0;
    wx.showLoading({
      title: `上传第${i+1}张...`,
      mask: true
    })
    httpuploadocr(params.path[i], 'file', {
      customer_id: _this.data.dbid,
      image_type: 'other'
    }).then(data => {
      success++;
      let result = JSON.parse(data.data);
      // 识别的证件信息
      let json_data = JSON.parse(result.json_data);
      console.log(json_data);
      let file = json_data.otherMaterialList[0];
      let files = _this.data.files;
      files.push(file);
      _this.setData({
        files: files
      })
      i++;
      console.log(`${len} --- ${i}`);
      if (i == len) {  //当图片传完时，停止调用   
        wx.hideLoading()  
        wx.showToast({
          title: `上传完毕，成功${success}个，失败${fail}个`,icon:'none'
        })
      } else {
        params.i = i;
        params.success = success;
        _this.uploadImage(params);
      }
    }).catch(err => {
      console.log('err', err);
      fail++;
      i++;
      if (i == len) {  //当图片传完时，停止调用    
        wx.hideLoading()
        wx.showToast({
          title: `上传完毕，成功${success}个，失败${fail}个`,
        })
      } else {
        params.i = i;
        params.fail = fail;
        _this.uploadImage(params);
      }
    })
  },

  showImageMenu : function(e){
    var _this = this;
    wx.showActionSheet({
      itemList: ['查看', '删除'],
      success: function (data) {
        if(data.tapIndex == 0){
          wx.previewImage({
            urls: [e.currentTarget.dataset.image.image_other_url],
          })
        }
        if (data.tapIndex == 1){
          _this.deleteImage(e.currentTarget.dataset.image.image_other)
        }
      },
      fail: function (err) {
      }
    })
  },

  deleteImage : function(image_id){
    var _this = this;
    wx.showLoading({
      mask: true
    })
    httpgetjson('system.image.del', {
      image_id: image_id,
    }).then(data => {
      let files = _this.data.files;
      files = files.filter(file=>{
        return file.image_other != image_id;
      })
      _this.setData({
        files: files
      })
      wx.hideLoading()
    }).catch(err => {
      wx.hideLoading()
      console.log('err', err);
    })
  },

  saveOtherCard : function(){
    var _this = this;
    // 调用后台保存
    // 整合参数
    var params = {};
    var custInfo = wx.getStorageSync('custInfo:' + _this.data.dbid);
    params.enterprise_order_dbid = custInfo.enterprise_order_dbid;
    params.customer_id = custInfo.dbid;
    params.otherMaterialList = _this.data.files;
    httppostjson('mp.customer.save', {
      json_data: new Base64().encode(JSON.stringify(params)),
      is_submit: 0
    }).then(data => {
      if (data.data.code == SUCCESSCODE) {
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
  }
})