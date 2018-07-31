import request from '@/utils/request'

export default {
  templateModel(paramsObj) {
    return request({
      method: 'GET',
      url: 'rest/customer.template.model/v1',
      headers: {
        'Content-type': 'multipart/form-data'
      },
      params: paramsObj
    })
  },
  templateInit(paramsObj) {
    return request({
      method: 'GET',
      url: 'rest/customer.template.init/v1',
      headers: {
        'Content-type': 'multipart/form-data'
      },
      params: paramsObj
    })
  },
  templateSave(paramsObj) {
    return request({
      method: 'POST',
      url: 'rest/customer.template.save/v1',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      params: { json_data: window.Base64.encode(JSON.stringify(paramsObj)) }
    })
  }
}
