import request from '@/utils/request'

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

export function optOrderList(paramsObj) {
  return request({
    method: 'POST',
    url: 'rest/optOrder.pagination/v1',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    params: paramsObj
  })
}
