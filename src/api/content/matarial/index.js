
import request from '@/api/request'
/**
 * 获取素材
 * @param {*} start 起始值
 * @param {*} limit 每页上限
 * @returns
 */
export function findMaterialByPage(start, limit) {
  return request({
    url: `/lejuAdmin/material/findMaterialByPage/${start}/${limit}`
  })
}
export function delMaterial(id) {
  return request({
    url: `/lejuAdmin/material/delMaterial/${id}`,
    method: 'delete'
  })
}
