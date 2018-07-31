import request from '@/utils/request'

export default {
  paginationEnterprise(params) {
    return request({
      method: 'POST',
      url: 'rest/enterprise.mgr.pagination/v1',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      },
      params
    })
  }
}
