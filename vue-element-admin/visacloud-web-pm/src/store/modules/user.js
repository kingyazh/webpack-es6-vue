// import { loginByUsername, phoneSendMessage, phoneVerifyMessage, verifyCompanyName, enterpriseRegist, enterpriseRegistPhone, getUserInfo, logout } from '@/api/login'
import { loginByUsername, getUserInfo } from '@/api/login'
// import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    user_name: '',
    avatar: '',
    phone: '',
    email: '',
    enterprise_code: '',
    enterprise_name: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_USER_NAME: (state, user_name) => {
      state.user_name = user_name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PHONE: (state, phone) => {
      state.phone = phone
    },
    SET_EMAIL: (state, email) => {
      state.email = email
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      // const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(userInfo).then(response => {
          // console.log(userInfo['xAuthToken'])
          // const data = response.data
          // commit('SET_TOKEN', data.token)
          // 记录在全局变量中，窗口刷新后，变量重置为cookie中记录的，所以采用sessionStorage存储，因为从校验码就获取token，所以从接口第一次带token时就传给所有接口，不在登录这里操作
          commit('SET_TOKEN', userInfo['xAuthToken'])
          setToken('admin')
          // setToken(data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // LoginByUsername({ commit }, userInfo) {
    //   const username = userInfo.username.trim()
    //   return new Promise((resolve, reject) => {
    //     loginByUsername(username, userInfo.password).then(response => {
    //       const data = response.data
    //       commit('SET_TOKEN', data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(response => {
          if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
            reject('error')
          }
          const data = response.data.user_info

          if (data.roleList && data.roleList.length > 0) { // 验证返回的roles是否是一个非空数组
            const roleId = []
            data.roleList.forEach((role) => {
              roleId.push(role.role_id)
            })
            commit('SET_ROLES', roleId)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_NAME', data.name)
          commit('SET_USER_NAME', data.user_name)
          commit('SET_AVATAR', !data.avatar ? 'http://tours.caissa.com.cn/static/images/comment/photo01.jpg' : data.avatar)
          commit('SET_PHONE', data.phone)
          commit('SET_EMAIL', data.email)
          commit('SET_INTRODUCTION', data.introduction)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        //
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resolve()
        //

        // logout(state.token).then(() => {
        //   commit('SET_TOKEN', '')
        //   commit('SET_ROLES', [])
        //   removeToken()
        //   resolve()
        // }).catch(error => {
        //   reject(error)
        // })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit }, role) {
      return new Promise(resolve => {
        // commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(response => {
          const data = response.data.user_info
          const roleId = []
          data.roleList.forEach((role) => {
            roleId.push(role.role_id)
          })
          commit('SET_ROLES', roleId)
          commit('SET_NAME', data.userName)
          commit('SET_AVATAR', !data.avatar ? 'http://tours.caissa.com.cn/static/images/comment/photo01.jpg' : data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve()
        })
      })
    }
  }
}

export default user
