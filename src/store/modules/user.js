import loginApi from '@/api/login'
import router from '@/router'
import { resetRouter } from '@/router'
import Layout from '@/layout'
// import { Message } from 'element-ui'
const getDefaultState = () => {
  return {
    asyncRoutes: [], // 当前用户拥有的权限菜单列表,构建的动态路由
    btnPermissions: [] // 页面按钮级别的路由权限
  }
}

const state = getDefaultState()

const mutations = {
  SET_ASYNC_ROUTES(state, asyncRoutes) {
    state.asyncRoutes = asyncRoutes
  },
  REMOVE_USERINFO(state) {
    state.asyncRoutes = []
    state.btnPermissions = []
    // todo 重置路由
  },
  // 重置按钮级别的权限
  RESET_BTN_PERMI(state, permissions) {
    state.btnPermissions = permissions
  },
  CLEAR_BTN_PEREMI(state) {
    state.btnPermissions = []
  }
}

const actions = {
  // 初始化菜单权限
  getInitMenus({ commit, state }) {
    // 利用返回的权限对象 构建路由对象
    function buildRoutes(routes, pList, pRoute) {
      for (var i = 0; i < pList.length; i++) {
        var p = pList[i]
        // 菜单
        if (p.type === 1) {
          var route = {
            path: p.path,
            name: p.name
          }

          // 重定向
          if (p.redirect) {
            route.redirect = p.redirect
          }
          if (p.meta) {
            route.meta = JSON.parse(p.meta)
          }
          if (p.hidden) {
            route.hidden = true
          }
          if (p.alwaysShow) {
            route.alwaysShow = true
          }
          // console.log(routes)

          // 顶级路由
          if (p.pid === '0') {
            route.component = Layout
            // console.log(route.component)
          } else {
            // 页面路由  /content/article
            // 配置参考: https://cn.vuejs.org/v2/guide/components-dynamic-async.html
            if (p.component) {
              var path = p.component.replace(/^@\/views/, '')
              // 闭包+立即执行  防止path因为懒加载 只显示最后的值
              // import 引入组件 不支持路径是变量
              route.component = ((path) => {
                return (resolve) => {
                  // require 虽然支持变量 但必须有一个根问价夹
                  require([`@/views${path}`], resolve)
                }
              })(path)
            }
          }
          // 为了避免comonent=null 的错误情况出现
          // if (p.component) {
          if (route.component) {
            routes.push(route)
          }

          if (p.children && p.children.length > 0) {
            route.children = []
            // 递归
            buildRoutes(route.children, p.children, route)
          }
          // }
        } else {
          // 按钮类型
          // 把页面的 增删改查的 标识  添加到每一个 route对象的 meta.permissionValues[]
          delete pRoute.children
          if (!pRoute.meta.permissionValues) {
            pRoute.meta.permissionValues = []
          }
          // 按钮权限列表
          pRoute.meta.permissionValues.push(p.permissionValue)
        }
      }
    }
    return new Promise((resolve, reject) => {
      loginApi.getInitMenus().then((res) => {
        if (res.success) {
          // asyncRoutes array
          var routes = [] // 最后生成的数组,暂时为空
          var pList = res.data.permissionList
          // 构建动态路由,递归目的:把数据库给我们的路由权限列表,转换成能用vue-router数据格式,
          buildRoutes(routes, pList)
          routes.push({ path: '*', redirect: '/404', hidden: true })
          // 用于存储新增的动态路由 可以配合sidebar 生成菜单
          // console.log('routes====', routes)
          commit('SET_ASYNC_ROUTES', routes)
          // 新增按钮显示权限bug
          resetRouter()
          // 这里用于构建完整路由
          router.addRoutes(routes)
          resolve()
        } else {
          if (res.code === 20001) {
            reject(res)
          }
        }
      })
    })
  }
}

export default {
  namespaced: true, // vuex命名空间
  state,
  mutations,
  actions
}
