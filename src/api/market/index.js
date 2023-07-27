import request from '@/api/request'

function getMarketList() {
  return request({
    url: `/lejuAdmin/homeRecommend/findAllRecommends`, // 相对路径
    method: 'get'
  })
}
function deleteMarketProduct(recommendId) {
  return request({
    url: `/lejuAdmin/homeRecommend/delRecommend/${recommendId}`, // 相对路径
    method: 'delete'
  })
}
function addMarkProduct(data) {
  return request({
    url: `/lejuAdmin/homeRecommend/addRecommend`, // 相对路径
    method: 'post',
    data
  })
}

export default {
  getMarketList,
  deleteMarketProduct,
  addMarkProduct
}
