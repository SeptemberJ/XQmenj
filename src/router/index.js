import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import Loading from '@/page/Loading'
import Register from '@/page/Register'
import Info from '@/page/Info'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Loading',
      component: Loading
    },
    {
      path: '/Register',
      name: 'Register',
      component: Register
    },
    {
      path: '/Info',
      name: 'Info',
      component: Info
    },
    {path: '*', redirect: '/'}
  ]
})
// 登录控制
router.beforeEach((to, from, next) => {
  next()
  // if (window.localStorage['registerId']) {
  //   next()
  // } else {
  //   next({path: '/Login'})
  // }
})
export default router
// export default new Router({
//   routes: [
//     {
//       path: '/',
//       name: 'HelloWorld',
//       component: HelloWorld
//     }
//   ]
// })
