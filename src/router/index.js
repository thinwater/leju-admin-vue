import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
// 静态路由
export const constantRoutes = [
  // 登录页
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  // 404页
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 主页
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Issndex',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '主页', icon: 'dashboard' }
    }]
  },
  // 权限管理
  {
    path: '/auth',
    component: Layout,
    redirect: '/auth/role',
    meta: { title: '权限管理', icon: 'authority' },
    children: [
      // 账号管理
      {
        path: 'user',
        name: 'authUser',
        component: () => import('@/views/auth/user/index'),
        meta: { title: '账号管理', icon: 'account' }
      },
      // 角色管理
      {
        path: 'role',
        name: 'authRole',
        component: () => import('@/views/auth/role/index'),
        meta: { title: '角色管理', icon: 'role' }
      },
      // 资源管理
      {
        path: 'permission',
        name: 'authPermission ',
        component: () => import('@/views/auth/permission/index'),
        meta: { title: '资源管理', icon: 'resources' }
      }
    ]

  }
]
// 区分动态路由  配合权限实现
export const asyncRoutes = [
  // 商品管理
  {
    path: '/product',
    component: Layout,
    redirect: '/product/list',
    alwaysShow: true,
    name: 'product',
    meta: { title: '商品管理', icon: 'el-icon-s-shop' },
    children: [{
      path: 'list',
      name: 'productList',
      component: () => import('@/views/product/index'),
      meta: { title: '商品列表', icon: 'el-icon-shopping-bag-2', componentUrl: '@/views/product/index' }
    },
    {
      path: 'category',
      name: 'productCategory',
      component: () =>
        import('@/views/product/category/index'),
      meta: { title: '商品分类', icon: 'el-icon-menu', componentUrl: '@/views/product/category/index' }
    },
    {
      path: 'brand',
      name: 'productBrand',
      component: () =>
        import('@/views/product/brand/index'),
      meta: { title: '品牌管理', icon: 'el-icon-present', componentUrl: '@/views/product/brand/index' }
    },
    {
      path: 'detail/:id',
      name: 'productDetail',
      // 不在左侧导航栏显示
      hidden: true,
      component: () => import('@/views/product/detail/index'),
      meta: { title: '商品编辑', icon: 'table', activeMenu: '/product/list', componentUrl: '@/views/product/detail/index' }
    },
    {
      path: 'addDetail',
      name: 'addProductDetail',
      // 不在左侧导航栏显示
      hidden: true,
      component: () => import('@/views/product/detail/index'),
      meta: { title: '新增商品', icon: 'table', activeMenu: '/product/list', componentUrl: '@/views/product/detail/index' }
    }
    ]
  },
  // 订单管理
  {
    path: '/order',
    component: Layout,
    redirect: '/order/list',
    name: 'order',
    alwaysShow: true,
    meta: { title: '订单管理', icon: 'el-icon-notebook-1' },
    children: [
      // 订单列表
      {
        path: 'list',
        name: 'orderList',
        component: () => import('@/views/order/index'),
        meta: { title: '订单列表', icon: 'orderList', componentUrl: '@/views/order/index' }
      },
      // 订单详情
      {
        path: 'detail/:id',
        name: 'orderDetail',
        hidden: true,
        component: () => import('@/views/order/detail/index'),
        meta: { title: '订单详情', icon: 'table', activeMenu: '/order/list', componentUrl: '@/views/order/detail/index' }
      },
      // 退单列表
      {
        path: 'back',
        name: 'orderBack',
        component: () => import('@/views/order/orderBack/index'),
        meta: { title: '退单列表', icon: 'returnList', componentUrl: '@/views/order/orderBack/index' }
      },
      // 退单详情
      {
        path: 'backDetail/:id',
        name: 'orderBackDetail',
        component: () => import('@/views/order/orderBack/detail/index'),
        hidden: true,
        meta: { title: '退单详情', icon: 'table', activeMenu: '/order/back', componentUrl: '@/views/order/orderBack/detail/index' }
      },
      // 地址管理
      {
        path: 'address',
        name: 'orderAddress',
        component: () => import('@/views/order/address/index'),
        meta: { title: '地址管理', icon: 'el-icon-location', componentUrl: '@/views/order/address/index' }
      }
    ]
  },
  // 注册用户管理
  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    name: 'user',
    alwaysShow: true, // alwaysShow 设置的是路由菜单栏的父元素是否总是显示
    //            因为只有一个孩子的父元素默认会被隐藏,只显示子元素
    meta: { title: '注册用户管理', icon: 'registeredUsers' },
    children: [{
      // 用户列表
      path: 'userList',
      name: 'UserList',
      component: () => import('@/views/user/index'),
      meta: { title: '用户列表', icon: 'userList', componentUrl: '@/views/user/index' }
    }]
  },
  // 营销管理
  {
    path: '/market',
    component: Layout,
    alwaysShow: true,
    redirect: '/market/list',
    meta: { title: '营销管理', icon: 'market' },
    children: [
      // 限时活动
      {
        path: 'list',
        name: 'marketList',
        component: () => import('@/views/market/index'),
        meta: { title: '用户列表', icon: 'limitTimeActivity', componentUrl: '@/views/market/index' }
      },
      // 广告列表
      {
        path: 'advertisement',
        name: 'marketAdvertisement',
        component: () => import('@/views/market/advertisement/index'),
        meta: { title: '广告列表', icon: 'adList', componentUrl: '@/views/market/advertisement/index' }
      }
    ]
  },
  // 内容管理
  {
    path: '/content',
    component: Layout,
    redirect: '/content/articleList',
    name: 'content',
    meta: { title: '内容管理', icon: 'content' },
    alwaysShow: true,
    children: [
      // 文章列表
      {
        path: 'articleList',
        name: 'articleList',
        component: () => import('@/views/content/article/index'),
        meta: { title: '文章列表', icon: 'articleList', componentUrl: '@/views/content/article/index' }
      },
      {
        path: 'addArticle',
        name: 'addArticle',
        hidden: true,
        component: () => import('@/views/content/article/detail/index'),
        meta: { title: '编辑文章', icon: 'table', activeMenu: '/content/articleList', componentUrl: '@/views/content/article/detail/index' }
      },
      // 修改文章
      {
        path: 'editArticle/:id',
        name: 'editArticle',
        hidden: true,
        component: () => import('@/views/content/article/detail/index'),
        meta: { title: '修改文章', icon: 'table', activeMenu: '/content/articleList', componentUrl: '@/views/content/article/detail/index' }
      },
      // 素材列表
      {
        path: 'materialList',
        name: 'materialList',
        component: () => import('@/views/content/material/index'),
        meta: { title: '素材列表', icon: 'matarial', componentUrl: '@/views/content/material/index' }
      }
    ]
  },
  // 个人中心
  {
    path: '/person',
    component: Layout,
    redirect: '/person/index',
    name: 'person',
    alwaysShow: true,
    meta: { title: '个人中心', icon: 'personalCenter' },
    children: [
      // 个人主页
      {
        path: 'index',
        name: 'personIndex',
        component: () => import('@/views/person/index'),
        meta: { title: '个人主页', icon: 'home', componentUrl: '@/views/person/index' }
      },
      // 个人设置
      {
        path: 'setting',
        name: 'personSetting',
        component: () => import('@/views/person/Setting/index'),
        meta: { title: '个人设置', icon: 'setting', componentUrl: '@/views/person/Setting/index' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()
// 初始化路由,清空生成的动态路由
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
