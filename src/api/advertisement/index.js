import request from '@/api/request'

function addAds(data) {
  return request({
    url: '/lejuAdmin/advertise/addAds', // 相对路径
    method: 'post',
    data
  })
}
function getAds() {
  return request({
    url: '/lejuAdmin/advertise/adsList', // 相对路径
    method: 'get'

  })
}

function deleteAds(adsId) {
  return request({
    url: `/lejuAdmin/advertise/delAds/${adsId}`, // 相对路径
    method: 'delete'
  })
}
function updateAds(data) {
  return request({
    url: `/lejuAdmin/advertise/updateAds`, // 相对路径
    method: 'post',
    data
  })
}
export default {
  addAds,
  getAds,
  deleteAds,
  updateAds
}
