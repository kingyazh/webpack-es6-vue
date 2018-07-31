import {
  baseUrl,
  version
} from './consts.js'

const httpstaticget = (url) => {
  return new Promise((resolve, reject) => {
    console.log('http request url: ', url)
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'x-auth-token': wx.getStorageSync("token") //读取token
      },
      success: function(res) {
        console.log('http response : ', res)
        if (res.statusCode == 200) {
          if (res.header.rest_code == '99999') {
            reject(res.header.rest_message);
          } else if (res.header.rest_code == '20000') { // 无登录权限
            wx.redirectTo({
              url: '/pages/login/login',
            })
            wx.showToast({
              title: '登录信息失效', icon: 'none'
            })
            resolve(res);
          } else {
            resolve(res);
          }
        } else {
          reject(res);
        }
      },
      fail: function(res) {
        reject(res);
      }
    })
  })
}

const httpgetjson = (url, param) => {
  return new Promise((resolve, reject) => {
    console.log('http request url: ', url)
    console.log('http request param: ', param)
    console.log('http request token : ', wx.getStorageSync("token"))
    wx.request({
      url: baseUrl + url + version, //仅为示例，并非真实的接口地址
      method: 'GET',
      data: param,
      header: {
        'x-auth-token': wx.getStorageSync("token") //读取token
      },
      success: function(res) {
        if (!!res.header['x-auth-token']) {
          wx.setStorageSync('token', res.header['x-auth-token'])
          console.log('set token :', res.header['x-auth-token'])
        }
        console.log('http response : ', res)
        if (res.statusCode == 200) {
          if (res.header.rest_code == '99999') {
            reject(res.header.rest_message);
          } else if (res.header.rest_code == '20000') { // 无登录权限
            if (url != 'system.custoemr.login') {
              wx.redirectTo({
                url: '/pages/login/login',
              })
              wx.showToast({
                title: '登录信息失效',icon:'none'
              })
            }
            resolve(res);
          } else {
            resolve(res);
          }
        } else {
          reject(res);
        }
      },
      fail: function(res) {
        reject(res);
      }
    })
  })
}

const httppostjson = (url, param) => {
  return new Promise((resolve, reject) => {
    console.log('http request url: ', url)
    console.log('http request param: ', param)
    console.log('http request token : ', wx.getStorageSync("token"))
    wx.request({
      url: baseUrl + url + version, //仅为示例，并非真实的接口地址
      method: 'POST',
      data: param,
      header: {
        'x-auth-token': wx.getStorageSync("token"), //读取token
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        console.log('http response : ', res)
        if (res.statusCode == 200) {
          if (res.header.rest_code == '99999') {
            reject(res.header.rest_message);
          } else if (res.header.rest_code == '20000') { // 无登录权限
            wx.redirectTo({
              url: '/pages/login/login',
            })
            wx.showToast({
              title: '登录信息失效', icon: 'none'
            })
            resolve(res);
          } else {
            resolve(res);
          }
        } else {
          reject(res);
        }
      },
      fail: function(res) {
        reject(res);
      }
    })
  })
}

const httpuploadocr = (filepath, filename, param) => {
  return new Promise((resolve, reject) => {
    console.log('http request filepath: ', filepath)
    console.log('http request filename: ', filename)
    console.log('http request param: ', param)
    console.log('http request token : ', wx.getStorageSync("token"))
    wx.uploadFile({
      url: baseUrl + 'system.image.ocr' + version,
      filePath: filepath,
      name: filename,
      formData: param,
      header: {
        'x-auth-token': wx.getStorageSync("token") //读取token
      },
      success: function(res) {
        console.log('http response : ', res)
        if (res.statusCode == 200) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function(res) {
        reject(res);
      }
    })
  })
}

module.exports = {
  httpstaticget,
  httpgetjson,
  httppostjson,
  httpuploadocr
}