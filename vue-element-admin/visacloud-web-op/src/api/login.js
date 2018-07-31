import request from '@/utils/request'
//
// export function loginByUsername(username, password) {
//   const data = {
//     username,
//     password
//   }
//   return request({
//     url: '/login/login',
//     method: 'post',
//     data
//   })
// }
//
export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}
//
// export function getUserInfo(token) {
//   return request({
//     url: '/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

//
export function loginByUsername(param) {
  return request({
    url: 'rest/system.user.login/v1',
    method: 'POST',
    headers: {
      'Content-type': 'multipart/form-data'
    },
    params: {
      login_name: param.username,
      password: param.password,
      captcha: param.captchaCode,
      login_type: 1
    }
  })
}

// 用户注册短信发送
export function phoneSendMessage(number, captcha) {
  return request({
    url: 'rest/system.verify.sms.login/v1',
    method: 'get',
    headers: {
      'Content-type': 'multipart/form-data'
    },
    params: {
      phone: number,
      captcha: captcha
    }
  })
}
// 用户注册手机验证
export function phoneVerifyMessage(number, code) {
  return request({
    url: 'rest/system.verify.phone/v1',
    method: 'post',
    headers: {
      'Content-type': 'multipart/form-data'
    },
    params: {
      phone: number,
      sms_code: code
    }
  })
}

// 验证公司名称
export function verifyCompanyName(name) {
  return request({
    url: 'rest/enterprise.regist.verifyName/v1',
    method: 'post',
    headers: {
      'Content-type': 'multipart/form-data'
    },
    params: {
      enterprise_name: name
    }
  })
}

// 公司注册
export function enterpriseRegist(number, code) {
  return request({
    url: 'rest/enterprise.regist.submit/v1',
    method: 'post',
    headers: {
      'Content-type': 'multipart/form-data'
    },
    params: {
      phone: number,
      sms_code: code
    }
  })
}

// 公司注册手机验证
export function enterpriseRegistPhone(number, code) {
  return request({
    url: 'rest/enterprise.regist.phone/v1',
    method: 'post',
    headers: {
      'Content-type': 'multipart/form-data'
    },
    params: {
      phone: number,
      sms_code: code
    }
  })
}

// 获取当前用户信息
export function getUserInfo() {
  return request({
    url: 'rest/system.currentUser.get/v1',
    method: 'get',
    headers: {
      'Content-type': 'multipart/form-data'
    }
  })
}

