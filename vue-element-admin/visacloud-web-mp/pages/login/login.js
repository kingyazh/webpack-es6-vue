import { SUCCESSCODE } from '../../utils/consts.js'
import { httpgetjson } from '../../utils/http.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    captcha: '',
    src: '',
    checklogin: false,
    inter: null,
    time: 60,
    msg: '获取验证码'
  },
  /**
   * 登录
   */
  formSubmit: function (e) {
    let _this = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          var params = e.detail.value;
          params.mp_token = res.code;

          wx.setStorageSync('user', params);
          wx.showLoading({
            title: '正在登录',
            mask: true
          });
          //发起网络请求
          _this.login(params).then(result => {
            wx.hideLoading();
            wx.redirectTo({
              url: '/pages/list/list',
            })
          }).catch(err => {
            wx.hideLoading();
            wx.showToast({
              icon: 'none',
              title: '登录失败',
            })
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '微信授权失败，请重试',
          })
        }
      }
    });
  },
  /**
   * 手机号输入
   */
  bindPhoneInput: function (e) {
    this.setData({ phone: e.detail.value });
  },
  bindCaptchaInput: function (e) {
    this.setData({ captcha: e.detail.value });
  },
  /**
   * 发送验证码
   */
  bingSendMsg: function () {
    if (!/\d{11}/.test(this.data.phone)) {
      return;
    }
    if (!this.data.inter) {
      wx.showLoading({
        title : '发送中...',
        mask:true
      })
      this.sendMsg().then(() => {
        wx.hideLoading()
        wx.showToast({
          title: '发送成功',
        })
        let inter = setInterval(() => {
          let thistime = this.data.time - 1;
          if (thistime == 0) {
            clearInterval(this.data.inter);
            this.setData({
              inter: null,
              time: 60,
              msg: '获取验证码'
            })
          } else {
            this.setData({
              time: thistime,
              msg: thistime + 's后重发'
            })
          }
        }, 1000)
        this.setData({
          inter: inter,
          time: 60,
          msg: '60s后重发'
        })
      }).catch(error => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '发送失败',
        })
      })
    }
  },
  /**
   * 请求后台发送验证码
   */
  sendMsg: function () {
    return new Promise((resolve, reject) => {
      httpgetjson('system.verify.sms', {
        phone: this.data.phone,
        captcha: this.data.captcha
      }).then(result => {
        if (result.data.code == SUCCESSCODE) {
          resolve();
        } else {
          reject();
        }
      }).catch(err => {
        reject();
        wx.showToast({
          icon: 'none',
          title: '请求后台异常',
        })
      })
    })
  },
  /**
   * 刷新验证码
   */
  refreshCaptcha: function () {
    httpgetjson('system.verify.captcha', {}).then(result => {
      this.setData({ src: result.data });
    }).catch(err => {
      wx.showToast({
        icon: 'none',
        title: '请求后台异常',
      })
    })
  },
  /**
   * 请求后台 登录
   */
  login: function (params) {
    return new Promise((resolve, reject) => {
      httpgetjson('system.custoemr.login', params).then(result => {
        if (result.header.rest_code == SUCCESSCODE) {
          resolve(result.data);
        } else {
          reject();
        }
      }).catch(err => {
        console.log(err);
        reject();
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.clearStorageSync();
    if(options.scene){
      var scene = decodeURIComponent(options.scene)
      let token = [scene.substring(0,8),scene.substring(8,12),scene.substring(12,16),scene.substring(16,20),scene.substring(20,scene.length)].join('-');
      console.log('token 解析：', scene, token);
      // 二维码场景
      wx.setStorageSync("token", scene);
      wx.redirectTo({
        url: '/pages/list/list',
      })
    } else {
      let _this = this;
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.showLoading();
            //发起网络请求
            _this.login({ mp_token: res.code }).then(result => {
              console.log('直接登录成功');
              wx.hideLoading();
              wx.redirectTo({
                url: '/pages/list/list',
              })
            }).catch(err => {
              wx.hideLoading();
              _this.refreshCaptcha();
              _this.setData({ checklogin: true });
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: '微信授权失败，请重试',
            })
          }
        }
      });
    }
  },
})