// 引入request请求方法
import request from '@/api/request'
/**
 * 获取文章列表
 * @param {*} start 起始页
 * @param {*} limit 每页文章数
 * @param {*} data  查询文章的关键词
 * @returns
 */
export function findArticles(start, limit, data) {
  return request({
    url: `/lejuAdmin/productArticle/findArticles/${start}/${limit}`,
    method: 'post',
    data
  })
}
/**
 * 新增文章
 * @param {*} data 新增的文章数据
 * @returns success, message
 */
export function addArticle(data) {
  return request({
    url: `/lejuAdmin/productArticle/addArticle`,
    method: 'post',
    data
  })
}
/**
 * 文章明细
 * @param {*} id 文章id
 * @returns success,massage,data
 */
export function productArticle(id) {
  return request({
    url: `/lejuAdmin/productArticle/productArticle/${id}`
  })
}
/**
 * 更新文章
 * @param {*} data 文章数据
 * @returns success, message
 */
export function updateArticle(data) {
  return request({
    url: `/lejuAdmin/productArticle/updateArticle`,
    method: 'post',
    data
  })
}
/**
 * 删除文章
 * @param {*} id 文章id
 * @returns success, message
 */
export function delArticle(id) {
  return request({
    url: `/lejuAdmin/productArticle/del/${id}`,
    method: 'delete'
  })
}
/**
 * 更新文章显示状态
 * @param {*} data 文章显示状态
 * @returns success, message
 */
export function changeShowStatus(data) {
  return request({
    url: `/lejuAdmin/productArticle/changeShowStatus`,
    method: 'post',
    data
  })
}
