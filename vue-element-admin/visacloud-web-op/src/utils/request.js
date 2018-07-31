import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
// import { getToken, setToken, setXAuthToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(config => {
  // console.log(config, store, store.getters.token)
  // Do something before request is sent
  if (sessionStorage['xAuthToken']) {
    // console.log('i can get the  token')
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    // config.headers['x-auth-token'] = getToken()
    config.headers['x-auth-token'] = sessionStorage['xAuthToken']
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  // response => response,
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过xmlhttprequest来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    const res = response.headers
    if (res['rest_code'] !== '10000') {
      Message({
        message: `错误码:${res.rest_code},错误信息:${decodeURI(res.rest_message)}`,
        type: 'error',
        duration: 5 * 1000
      })
      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      // 注意本处判断时，条件中的类型，因为eslint用了严格等于，所以类型必须匹配
      if (res['rest_code'] === '20000' || res['rest_code'] === '50008' || res['rest_code'] === '50012' || res['rest_code'] === '50014') {
        // 请自行在引入 MessageBox
        // import { Message, MessageBox } from 'element-ui'
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      }
      return Promise.reject('error')
    } else {
      // 所有接口都有可能带这个token回来，覆盖当前的
      if (res['x-auth-token']) {
        sessionStorage['xAuthToken'] = res['x-auth-token']
      }
      // setXAuthToken(res['x-auth-token'])
      // setToken(res['x-auth-token'])
      // return response.data
      return response
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  })

export default service
