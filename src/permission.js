import router from './router'
// import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import { getToken, clearUserCache } from '@/utils/myAuth' // 从localStorage 中 获取token
import getPageTitle from '@/utils/get-page-title'

import store from '@/store'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // 没有重定向的白名单

router.beforeEach(async(to, from, next) => {
  // 开启顶部进度条
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 获取token
  const hasToken = getToken()

  if (hasToken) {
    // 如果有token 且跳往 登录页面,则默认跳向主页
    // console.log('asyncRoutes', store.state.user.asyncRoutes)
    if (to.path === '/login') {
      next('/')
      NProgress.done()

      return
    }
    // 判断权限
    if (store.state.user.asyncRoutes.length > 0) {
      // 把当前页面的路由权限存入vuex
      if (to.meta && to.meta.permissionValues) {
        // console.log('按钮权限', to.meta.permissionValues)
        // permissionValues 控制页面级别的显示隐藏
        store.commit('user/RESET_BTN_PERMI', to.meta.permissionValues)
      }
      next()
    } else {
      // 重新获取
      await store.dispatch('user/getInitMenus')
        .then(res => {
          // 把当前页面的按钮权限存储再vuex中
          if (to.meta && to.meta.permissionValues) {
            store.commit('user/RESET_BTN_PERMI', to.meta.permissionValues)
          }
          next(to.path)
        }).catch(err => {
          // 如果code等于20001说明 路由有脏数据,需要初始化一次
          if (err.code === 20001) {
            Message.error('权限动态路由出错,请在资源管理初始化路由')
            next()
          } else {
            Message.error('权限动态路由出错')
            clearUserCache()
            next('/login')
          }
          NProgress.done()
        })
    }
  } else {
    console.log('没有token')
    // 清下页面权限
    store.commit('user/CLEAR_BTN_PEREMI')
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
