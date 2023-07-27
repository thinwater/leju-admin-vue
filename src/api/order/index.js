
import request from '@/api/request'
export function findOrdersByPage(start, limit, data) {
  return request({
    url: `/lejuAdmin/order/findOrdersByPage/${start}/${limit}`,
    method: 'post',
    data
  })
}
export function orderDetail(id) {
  return request({
    url: `/lejuAdmin/order/orderDetail/${id}`

  })
}
export function sendDone(data) {
  return request({
    url: `/lejuAdmin/order/sendDone`,
    method: 'post',
    data
  })
}
