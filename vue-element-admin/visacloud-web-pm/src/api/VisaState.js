import request from '@/utils/request'

// VisaInfoForm
export function getCountry() {
  return request({
    method: 'GET',
    url: 'rest/dict.query.country/v1',
    headers: {
      'Content-type': 'multipart/form-data'
    },
    params: { fetch_num: 300 }
  })
}
export function getDict(dictType) {
  return request({
    method: 'GET',
    url: 'rest/dict.query.type/v1',
    headers: {
      'Content-type': 'multipart/form-data'
    },
    params: { dict_type: dictType }
  })
}
export function getDetails(orderNo) {
  return request({
    method: 'GET',
    url: 'rest/customer.list.query/v1',
    headers: {
      'Content-type': 'multipart/form-data'
    },
    params: { opt_order_no: orderNo }
  })
}
export function getVisaType(country_code) {
  return request({
    method: 'GET',
    url: 'rest/dict.query.visaType/v1',
    headers: {
      'Content-type': 'multipart/form-data'
    },
    params: { country_code: country_code }
  })
}

export function getVisaCenter(country_code) {
  return request({
    method: 'GET',
    url: 'rest/dict.query.visaCenter/v1',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    params: { country_code: country_code }
  })
}

// 办签进度分页查询
export function visaStatusPage(paramsObj) {
  return request({
    method: 'POST',
    url: 'rest/visaStatus.pagination/v1',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    params: paramsObj
  })
}

// 办签进度更新
export function visaStatusUpdate(paramsObj) {
  return request({
    method: 'POST',
    url: 'rest/visaStatus.update/v1',
    headers: {
      'Content-type': 'application/json'
    },
    data: paramsObj
  })
}

// 客人资料查询   接口错误
// export function visaUserResource(paramsObj) {
//   return request({
//     method: 'POST',
//     url: 'rest/visaStatus.queryUserResource/v1',
//     headers: {
//       'Content-type': 'application/x-www-form-urlencoded'
//     },
//     params: paramsObj
//   })
// }
// 客人收资料的图片
export function visaUserPapers(userId) {
  return request({
    method: 'GET',
    url: 'rest/visaStatus.selectPapers/v1',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    params: {
      customer_dbid: userId
    }
  })
}

