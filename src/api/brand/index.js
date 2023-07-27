import request from '@/api/request'

function addBrand(data) {
  return request({
    url: '/lejuAdmin/brand/addBrand', // 相对路径
    method: 'post',
    data
  })
}
// 查询全部
function brandList() {
  return request({
    url: '/lejuAdmin/brand/findAllBrand', // 相对路径
    method: 'get'
  })
}
// 分页查询
function brandPageList(start, limit) {
  return request({
    url: `/lejuAdmin/brand/findBrandByPage/${start}/${limit}`, // 相对路径
    method: 'get'
  })
}
function deleteBrand(id) {
  return request({
    url: `/lejuAdmin/brand/delBrand/${id}`, // 相对路径
    method: 'delete'
  })
}
function switchShowStatus(data) {
  return request({
    url: `/lejuAdmin/brand/switchShowStatus`, // 相对路径
    method: 'post',
    data
  })
}
function updateBrand(data) {
  return request({
    url: `/lejuAdmin/brand/updateBrand`, // 相对路径
    method: 'post',
    data
  })
}

export default {
  addBrand,
  brandList,
  switchShowStatus,
  updateBrand,
  deleteBrand,
  brandPageList
}
