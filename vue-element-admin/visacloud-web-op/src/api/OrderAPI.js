import request from '@/utils/request'

// 企业订单查询及分页
export default {
  getOrderList(param) {
    return request({
      method: 'POST',
      url: 'rest/enterprise.order.pagination/v1',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      params: param
    })
  },
  // 新增企业订单
  addEnterpriseOrder(paramsObj) {
    const json_data = JSON.stringify(paramsObj)
    return request({
      method: 'POST',
      url: 'rest/enterprise.order.add/v1',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      params: { order_list: window.Base64.encode(json_data) }
    })
  },
  // 修改订单信息
  editEnterpriseOrder(paramsObj) {
    const json_data = JSON.stringify(paramsObj)
    return request({
      method: 'GET',
      url: 'rest/enterprise.order.edit/v1',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      params: { order_data: window.Base64.encode(json_data) }
    })
  },
  // 删除企业订单
  deleteEnterpriseOrder(paramsObj) {
    let orderIds = ''
    if (typeof paramsObj === 'string') {
      orderIds = paramsObj
    } else if (typeof paramsObj === 'object') {
      paramsObj.forEach(e => {
        orderIds = orderIds + (orderIds ? ',' : '') + e
      })
    }
    console.log('delete orderids = ' + orderIds)
    return request({
      method: 'POST',
      url: 'rest/enterprise.order.del/v1',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      params: {
        order_id: orderIds
      }
    })
  },
  // 获取企业订单详情
  detailEnterpriseOrder(order_id) {
    return request({
      method: 'GET',
      url: 'rest/enterprise.order.detail/v1',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      params: { order_id }
    })
  },
  // 新增订单办签人
  enterpriseAddCustomer(paramsObj) {
    return request({
      method: 'GET',
      url: 'rest/enterprise.order.addCustomer/v1',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      params: paramsObj
    })
  },
  // 删除订单办签人
  enterpriseDeleteCustomer(customer_id) {
    return request({
      method: 'GET',
      url: 'rest/enterprise.order.delCustomer/v1',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      params: { customer_id }
    })
  },
  // 生成修改客人信息二维码
  enterpriseOrderQr(param) {
    return request({
      method: 'GET',
      url: 'rest/enterprise.order.mpqrcode/v1',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      params: { ...param, _t: new Date().getTime() }
    })
  },
  getDetails(orderNo) {
    return request({
      method: 'GET',
      url: 'rest/customer.list.query/v1',
      headers: {
        'Content-type': 'multipart/form-data'
      },
      params: { opt_order_no: orderNo }
    })
  },
  getVisaType(country_code) {
    return request({
      method: 'GET',
      url: 'rest/dict.query.visaType/v1',
      headers: {
        'Content-type': 'multipart/form-data'
      },
      params: { country_code: country_code }
    })
  },

  getVisaCenter(country_code) {
    return request({
      method: 'GET',
      url: 'rest/dict.query.visaCenter/v1',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      params: { country_code: country_code }
    })
  }
}
