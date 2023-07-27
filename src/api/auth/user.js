// 引入封装好的axios
import request from '@/api/request'

// 获取用户列表
export function findUsersByPage(start, limit, data) {
  return request({
    url: `/admin/sysAuth/user/findUsersByPage/${start}/${limit}`,
    method: 'POST',
    data
  })
}
// 保存用户权限
export function saveUserRoles(data) {
  return request({
    url: '/admin/sysAuth/user/saveUserRoles',
    method: 'POST',
    data
  })
}
// 更新用户权限
export function updateUserRoles(data) {
  return request({
    url: '/admin/sysAuth/user/updateUserRoles',
    method: 'PUT',
    data
  })
}
// 删除用户权限
export function removeUser(id) {
  return request({
    url: `/admin/sysAuth/user/removeUser/${id}`,
    method: 'DELETE'
  })
}
/**
 * 根据用户id获取角色
 * @param {} userId
 */
export function findUserInfo(userId) {
  return request({
    url: `/admin/sysAuth/user/${userId}`,
    method: 'GET'
  })
}
