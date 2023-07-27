const LEJU_ADMIN_TOKEN_KEY = 'leju-admin-token-key'
const LEJU_ADMIN_USERINFO = 'leju-admin-userinfo'
import store from '@/store'
/**
 * 保存token
 * @param {*} token String 要保存的token
 */
export function setToken(token) {
  if (!token) return
  window.localStorage.setItem(LEJU_ADMIN_TOKEN_KEY, token)
}
/**
 * 获取token
 * @returns token String 从localStorage获取的token
 */
export function getToken() {
  var tokenStr = window.localStorage.getItem(LEJU_ADMIN_TOKEN_KEY)
  if (!tokenStr || tokenStr === 'undefined' || tokenStr === null) {
    return null
  } else {
    return tokenStr
  }
  // return window.localStorage.getItem(LEJU_ADMIN_TOKEN_KEY)
}
/**
 * 删除token
 */
export function removeToken() {
  window.localStorage.removeItem(LEJU_ADMIN_TOKEN_KEY)
}
/**
 * 保存userinfo
 * @param {*} userinfo JSON 要保存的userinfo
 */
export function setUserinfo(userinfo) {
  try {
    const userinfoStr = JSON.stringify(userinfo)
    window.localStorage.setItem(LEJU_ADMIN_USERINFO, userinfoStr)
  } catch (error) {
    console.log(error)
  }
}
/**
 * 获取本地存储的userinfo
 * @returns 从localStorage获取的userinfo
 */
export function getUserinfo() {
  try {
    const userinfoObj = JSON.parse(window.localStorage.getItem(LEJU_ADMIN_USERINFO))
    // console.log(userinfoObj)
    return userinfoObj
  } catch (error) {
    console.log(error)
  }
}

/**
 * 删除本地的userinfo
 */
export function removeUserinfo() {
  window.localStorage.removeItem(LEJU_ADMIN_USERINFO)
}
// 清除vuex 用户权限路由信息等
export function removeVuexUserInfo() {
  store.commit('user/REMOVE_USERINFO')
}
export function clearUserCache() {
  removeToken()
  removeUserinfo()
  removeVuexUserInfo()
}
