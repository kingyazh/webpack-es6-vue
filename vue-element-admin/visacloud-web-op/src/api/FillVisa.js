import request from '@/utils/request'

// VisaInfoForm
// get optFrom data
export function getUserOrderInit(params) {
  return request({
    url: 'rest/customer.update.init/v1',
    method: 'get',
    params: params
  })
}
// get optFrom form elements
export function getUserOrderModel(params) {
  return request({
    url: 'rest/customer.update.model/v1',
    method: 'get',
    params: params
  })
}
// VisaOperForm
// get optFrom data
export function getOptOrderInit(params) {
  return request({
    url: 'rest/optOrder.update.init/v1',
    method: 'get',
    params: params
  })
}
// get optFrom form elements
export function getOptOrderModel(params) {
  return request({
    url: 'rest/optOrder.update.model/v1',
    method: 'get',
    params: params
  })
}

// 泰国 VisaInfoForm
export function getVisaFormModelTH(params) {
  return request({
    url: 'rest/customer.add.model/v1',
    method: 'get',
    params: params
  })
}
export function getVisaFormInitTH(params) {
  return request({
    url: 'rest/customer.group.init/v1',
    method: 'get',
    params: params
  })
}

