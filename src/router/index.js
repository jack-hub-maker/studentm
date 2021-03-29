import Vue from 'vue'
import VueRouter from 'vue-router'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Echarts from '../views/Echarts.vue'
Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
    //重定向规则自动访问到login
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login, props:true },
    { path: '/register', component: Register },
    { 
    path: '/home', 
    component: Home, 
    },
    { path: '/echarts', component: Echarts },
]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  // next()  放行    next('/login')  强制跳转
  if (to.path === '/register') return next()
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
// const router = new VueRouter({
//   routes
// })

export default router
