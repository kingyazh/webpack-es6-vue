import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import axios from 'axios'
import store from './store'

import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog'// error log
import './permission' // permission control
import './mock' // simulation data

// 引入公共方法文件
import Util from './utils/util'
// 引入环境变量的对应地址 测试 or 生产
const API_ROOT = process.env['API_ROOT']
window.API_ROOT = API_ROOT
// 引入公共方法
const UtilObj = new Util()
window.Base64 = new UtilObj.Base64()
window.UtilObj = UtilObj

import * as filters from './filters' // global filters

Vue.prototype.$axios = axios
Vue.use(Element, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
