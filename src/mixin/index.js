import { getToken } from '@/utils/myAuth'
export default {
  data() {
    return {
      pageParams: {
        total: 0,
        start: 1,
        limit: 10,
        pageSizes: [10, 20, 30] // 必须是第一个的整数倍
      },
      loadingOption: {
        background: 'rgba(255,255,255,.9)',
        text: 'loading.....',
        spinner: 'el-icon-loading'
      },
      uploadFileOss: '/lejuAdmin/material/uploadFileOss'
    }
  },
  methods: {

  },
  computed: {
    token() {
      return { token: getToken() }
    },
    headers() {
      const token = getToken()
      const headers = {
        token: token
      }
      return headers
    }
  }
}
