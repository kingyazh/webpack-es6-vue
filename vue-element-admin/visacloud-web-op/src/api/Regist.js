import request from '@/utils/request'

export default {
  loginSmsSend(param) {
    return request({
      method: 'POST',
      url: 'rest/system.verify.sms.login/v1',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      params: param
    })
  },
  verifySmsCode(param) {
    return request({
      method: 'POST',
      url: 'rest/system.verify.phone/v1',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      params: param
    })
  },
  verifyEnterpriseName(param) {
    return request({
      method: 'POST',
      url: 'rest/enterprise.regist.verifyName/v1',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      params: param
    })
  },
  registSubmit(param) {
    return request({
      method: 'POST',
      url: 'rest/enterprise.regist.submit/v1',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      params: param
    })
  }
}
