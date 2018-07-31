import { httpgetjson } from '../../utils/http.js'
import { getflagurl} from '../../utils/consts.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.refreshData()
  },

  onPullDownRefresh : function(){
    this.refreshData(true);
  },

  refreshData: function (pullFlag){
    // 列表页，清除填表的残留缓存
    var list = wx.getStorageInfoSync();
    list.keys.forEach(key => {
      if (key.indexOf('formData') >= 0 || key.indexOf('custInfo') >= 0) {
        wx.removeStorageSync(key);
      }
    })
    wx.showLoading({
      title: '正在加载中...', mask : true
    })
    httpgetjson('mp.customer.orders', {}).then(data => {
      if (!!data.data && data.data.length > 0) {
        this.setData({
          orderList: data.data.map(item => {
            item.icon = getflagurl(item.country_code);
            item.customers = item.customers.map(cus => {
              var param = '&orderid=' + item.dbid + '&dbid=' + cus.dbid + '&name=' + (cus.full_name_cn || '');
              if (cus.customer_fill_state == 1) {
                cus.url = '/pages/visa/infoform/infoform?step=1' + param;
              } else if (cus.customer_fill_state == 2) {
                cus.url = '/pages/visa/infoform/infoform?step=2' + param;
              } else if (cus.customer_fill_state == 3) {
                cus.url = '/pages/visa/infoform/infoform?step=3' + param;
              }
              return cus;
            })
            return item;
          })
        });
        var user = wx.getStorageSync('user');
        wx.setNavigationBarTitle({
          title: data.data[0].contactor + (user.phone ? '(' + user.phone + ')' : ''),
        })
      } else {
        var user = wx.getStorageSync('user');
        wx.setNavigationBarTitle({
          title: user.phone ? user.phone : '',
        })
      }
      wx.hideLoading();
      if (pullFlag) wx.stopPullDownRefresh()
    }).catch(err=>{
      wx.hideLoading();
      if (pullFlag) wx.stopPullDownRefresh()
      wx.showToast({
        title: '查询失败',
        icon : 'none'
      })
    })
  }
});
