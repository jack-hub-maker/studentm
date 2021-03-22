// import Vue from 'vue'
// import App from './App.vue'
// import router from './router'
// import './plugins/element.js'

// Vue.config.productionTip = false

// import axios from 'axios'
// Vue.prototype.$http = axios.create({
//   baseURL:'http://127.0.0.1:3001/api/'
// })

// new Vue({
//   router,
//   render: h => h(App)
// }).$mount('#app')

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
//// 按需导入的element库
import './plugins/element.js'
import './styles/index.less'

import axios from 'axios'
// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:3001/api/'

// 请求在到达服务器之前，先会调用use中的这个回调函数来添加请求头信息
axios.interceptors.request.use(config => {
  // console.log(config)
  let usertoken = window.sessionStorage.getItem('token')
  // 为请求头对象，添加token验证的Authorization字段
  // config.headers.Authorization = window.sessionStorage.getItem('token')
  config.headers.Authorization = `Bearer ${usertoken}`
  // 在最后必须 return config
  return config
})
Vue.prototype.$http = axios
//时间过滤器
Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal*1000)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
Vue.use(ElementUI)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

