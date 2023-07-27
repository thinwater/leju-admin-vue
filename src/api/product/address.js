import request from '@/api/request'
// 获取列表
function getAddressList() {
  return request({
    url: `/lejuAdmin/companyAddress/addressList`, // 相对路径
    method: 'get'
  })
}
// 收货默认
function setReceiveOne(data) {
  return request({
    url: `/lejuAdmin/companyAddress/setReceiveOne`, // 相对路径
    method: 'post',
    data
  })
}
// 设置发货默认
function setSendOne(data) {
  return request({
    url: `/lejuAdmin/companyAddress/setSendOne`, // 相对路径
    method: 'post',
    data
  })
}
// 更新地址信息
function updateAddress(data) {
  return request({
    url: `/lejuAdmin/companyAddress/update`, // 相对路径
    method: 'post',
    data
  })
}
// 删除地址信息
function deleteAddress(id) {
  return request({
    url: `/lejuAdmin/companyAddress/${id}`, // 相对路径
    method: 'delete'
  })
}
// 获取地址明细
function addressDetail(id) {
  return request({
    url: `/lejuAdmin/companyAddress/${id}`, // 相对路径
    method: 'get'
  })
}
// 获取地址明细
function saveAddress(data) {
  return request({
    url: `/lejuAdmin/companyAddress/save`, // 相对路径
    method: 'post',
    data
  })
}
export default {
  getAddressList,
  setReceiveOne,
  setSendOne,
  updateAddress,
  deleteAddress,
  addressDetail,
  saveAddress
}
