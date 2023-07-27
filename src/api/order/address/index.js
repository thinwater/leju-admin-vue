
import request from '@/api/request'
/**
 * 请求地址列表
 * @returns 地址列表内容
 */
export function addressList() {
  return request({
    url: '/lejuAdmin/companyAddress/addressList'
  })
}
/**
 * 新增地址
 * @param {*} data 新增地址的数据
 * @returns success , message
 */
export function saveAddress(data) {
  return request({
    url: '/lejuAdmin/companyAddress/save',
    method: 'post',
    data
  })
}
/**
 * 地址明细
 * @param {*} id 地址的id
 * @returns
 */
export function companyAddress(id) {
  return request({
    url: `/lejuAdmin/companyAddress/${id}`
  })
}
/**
 * 更新地址
 * @param {*} data 更新的地址信息
 * @returns
 */
export function updateAddress(data) {
  return request({
    url: `/lejuAdmin/companyAddress/update`,
    method: 'post',
    data
  })
}
/**
 * 设置默认发货
 * @param {*} data 设置默认
 * @returns
 */
export function setSendOne(data) {
  return request({
    url: `/lejuAdmin/companyAddress/setSendOne`,
    method: 'post',
    data
  })
}
/**
 * 删除文章
 * @param {*} id 要删除的文章的id
 * @returns success.massage
 */
export function deleteAddress(id) {
  return request({
    url: `/lejuAdmin/companyAddress/${id}`,
    method: 'delete'
  })
}
export function setReceiveOne(data) {
  return request({
    url: `/lejuAdmin/companyAddress/setReceiveOne`,
    method: 'post',
    data
  })
}
