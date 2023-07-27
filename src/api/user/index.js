import request from '@/api/request'

function getUserList(start, limit) {
  return request({
    url: `/lejuAdmin/member/findMembersByPage/${start}/${limit}`, // 相对路径
    method: 'get'
  })
}
function login(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}
function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}
function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export default {
  getUserList,
  login,
  getInfo,
  logout
}

