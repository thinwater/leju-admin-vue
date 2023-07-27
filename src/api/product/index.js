import request from '@/api/request'
// 获取列表
function productList(start, limit, data) {
  return request({
    url: `/lejuAdmin/product/productsByPage/${start}/${limit}`, // 相对路径
    method: 'post',
    data
  })
}
// 获取分类
function getAllCategory() {
  return request({
    url: `/lejuAdmin/category/getAllCategory`, // 相对路径
    method: 'get'
  })
}
function findAllBrand() {
  return request({
    url: `/lejuAdmin/brand/findAllBrand`, // 相对路径
    method: 'get'
  })
}
// 删除商品
function productDelete(id, data) {
  return request({
    url: `/lejuAdmin/product/del/${id}`, // 相对路径
    method: 'delete',
    data
  })
}

// 添加商品和sku
function addProductAndSkus(data) {
  return request({
    url: `/lejuAdmin/product/addProductAndSkus`, // 相对路径
    method: 'post',
    data
  })
}
// 更新商品和sku
function updateProductAndSkus(data) {
  return request({
    url: `/lejuAdmin/product/updateProductAndSkus`, // 相对路径
    method: 'post',
    data
  })
}
// 商品详情
function productDetail(id) {
  return request({
    url: `/lejuAdmin/product/productSkusDetail/${id}`, // 相对路径
    method: 'get'
  })
}
// 是否最新
function switchNewStatus(data) {
  return request({
    url: '/lejuAdmin/product/switchNewStatus', // 相对路径
    method: 'post',
    data
  })
}
// 是否预告
function switchPreviewStatus(data) {
  return request({
    url: '/lejuAdmin/product/switchPreviewStatus', // 相对路径
    method: 'post',
    data
  })
}
// 是否推荐状态
function switchRecommendStatus(data) {
  return request({
    url: '/lejuAdmin/product/switchRecommandStatus', // 相对路径
    method: 'post',
    data
  })
}

// 是否审核状态
function switchVerifyStatus(data) {
  return request({
    url: '/lejuAdmin/product/switchVerifyStatus', // 相对路径
    method: 'post',
    data
  })
}

// 是否发布状态
function switchPublishStatus(data) {
  return request({
    url: '/lejuAdmin/product/switchPublishStatus', // 相对路径
    method: 'post',
    data
  })
}

export default {
  productList,
  productDelete,
  addProductAndSkus,
  productDetail,
  updateProductAndSkus,
  switchNewStatus,
  switchPreviewStatus,
  switchRecommendStatus,
  switchVerifyStatus,
  switchPublishStatus,
  getAllCategory,
  findAllBrand
}
