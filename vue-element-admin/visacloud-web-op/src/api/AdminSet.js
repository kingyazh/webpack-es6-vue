import request from '@/utils/request'

// 获取当前用户信息
export default {
  getCurrentUser() {
    return request({
      method: 'GET',
      url: 'rest/system.currentUser.get/v1',
      headers: {
        'Content-type': 'text/plain'
      }
    })
  },
  // 当前用户密码重置
  resetPwdCurrent(param) {
    return request({
      method: 'POST',
      url: 'rest/system.currentUser.resetPwd/v1',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      params: param
    })
  },
  // 修改当前用户手机--发送短信验证码
  sendVerificationCode(param) {
    return request({
      method: 'POST',
      url: 'rest/system.currentUser.sendVerificationCode/v1',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      params: param
    })
  },
  // 修改当前用户手机--保存用户手机号
  updateUserPhone(param) {
    return request({
      method: 'POST',
      url: 'rest/system.currentUser.updateUserPhone/v1',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      params: param
    })
  },
  // 修改当前用户邮箱--点击保存，发送邮箱激活链接
  sendActiveEmail(param) {
    return request({
      method: 'POST',
      url: 'rest/system.currentUser.sendActiveEmail/v1',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      params: param
    })
  },
  // 当前用户信息修改-目前只传用户姓名，只修改用户姓名
  changeName(paramsObj) {
    return request({
      method: 'POST',
      url: 'rest/system.currentUser.change/v1',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      params: { user_info: window.Base64.encode(JSON.stringify(paramsObj)) }
    })
  }
}
