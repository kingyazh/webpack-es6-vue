import request from '@/utils/request'

export function userPagination(paramsObj) {
  return request({
    method: 'GET',
    url: 'rest/system.user.pagination/v1',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    params: paramsObj
  })
}
// 角色 select 选项
export function systemRoleList() {
  return request({
    method: 'GET',
    url: 'rest/system.role.list/v1'
  })
}
// 用户密码重置
export function resetPwdSystem(id, new_password) {
  return request({
    method: 'POST',
    url: 'rest/system.user.resetPwd/v1',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    params: {
      user_id: id,
      new_password: new_password
    }
  })
}
// 用户状态变更，1-启用，2-禁用，3-删除
export function eidtUserState(id, state) {
  return request({
    method: 'POST',
    url: 'rest/system.user.state/v1',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    params: {
      customer_id: id,
      state: state
    }
  })
}
// 用户信息修改
export function editSystemUser(paramsObj) {
  return request({
    method: 'POST',
    url: 'rest/system.user.edit/v1',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    params: { user_info: window.Base64.encode(JSON.stringify(paramsObj)) }
  })
}
// 用户信息新增
export function addSystemUser(paramsObj) {
  return request({
    method: 'POST',
    url: 'rest/system.user.add/v1',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    params: { user_info: window.Base64.encode(JSON.stringify(paramsObj)) }
  })
}
