import request from '@/utils/request'

// 字典接口
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

export function getConutryList(size = 1000) {
  return request({
    method: 'GET',
    url: 'rest/dict.query.country/v1',
    headers: {
      'Content-type': 'multipart/form-data'
    },
    params: { fetch_num: size }
  })
}

export function getCityList(param) {
  return request({
    method: 'GET',
    url: 'rest/dict.query.city/v1',
    headers: {
      'Content-type': 'multipart/form-data'
    },
    params: param
  })
}

export function getVisaCenter(country_code) {
  return request({
    method: 'GET',
    url: 'rest/dict.query.visaCenter/v1',
    headers: {
      'Content-type': 'multipart/form-data'
    },
    params: { country_code: country_code }
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

export function translateCh2EnApi(param) {
  return request({
    method: 'GET',
    url: 'rest/translate.chinese.english/v1',
    headers: {
      'Content-type': 'multipart/form-data'
    },
    params: param
  })
}
export function translateCh2PYApi(param) {
  return request({
    method: 'GET',
    url: 'rest/translate.chinese.pinyin/v1',
    headers: {
      'Content-type': 'multipart/form-data'
    },
    params: param
  })
}
