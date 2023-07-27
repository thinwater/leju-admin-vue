<template>
  <div class="ads_main">
    <el-card class="card" shadow="never">
      <div slot="header">
        <el-button
          type="primary"
          size="small"
          @click="goAdd"
        >新增</el-button>
      </div>
      <!-- 品牌列表 -->

      <el-table
        v-loading="loading"
        :data="adsList"
        border
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" fixed="left" />

        <el-table-column align="center" label="广告图片" width="200">
          <template slot-scope="scope">

            <img :src="scope.row.pic" class="table_img">
          </template>
        </el-table-column>
        <el-table-column align="center" label="时间" width="250">
          <template slot-scope="scope">
            <p>开始时间:{{ scope.row.startTime }}</p>
            <p>结束时间:{{ scope.row.endTime }}</p>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="name"
          label="广告名称"
          width="250"
        />
        <el-table-column
          align="center"
          prop="clickCount"
          label="点击数"
          width="150"
        />
        <el-table-column
          align="center"
          prop="orderCount"
          label="下单数"
          width="150"
        />
        <el-table-column
          align="center"
          prop="type"
          label="轮播位置"
          width="150"
        >
          <template slot-scope="scope">
            <p v-if="scope.row.type===0">首页轮播</p>
            <p v-else>其他</p>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="url"
          label="链接地址"
          width="150"
        />
        <el-table-column
          align="center"
          prop="note"
          label="备注"
          width="150"
        />

        <el-table-column align="center" label="上下线状态" :width="180">
          <template slot-scope="scope">
            <p>
              {{ scope.row.status===1?"上线":"下线" }}
            </p>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="goEdit(scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              size="small"
              @click="goDelete(scope.row)"
            ><span style="color: red">删除</span></el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-card>
    <detail-com ref="detail" @success="detailSuccess" />

  </div>
</template>

<script>
import adsApi from '@/api/advertisement/index'
import detailCom from '@/views/market/advertisement/components/detail'

export default {
  name: 'MarketAdvertisement',
  components: { detailCom },
  data() {
    return {
      adsList: [],
      loading: false
    }
  },
  created() {
    this.getAdsList()
  },
  methods: {
    getAdsList() {
      this.loading = true
      adsApi.getAds().then(res => {
        if (res.success) {
          this.loading = false
          this.adsList = res.data.items
        } else {
          this.$message.error('获取列表失败')
          this.loading = false
        }
      })
    },
    goDelete(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        adsApi
          .deleteAds(row.id)
          .then((res) => {
            if (res.success) {
              this.getAdsList()
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            } else {
              this.$message.error(res.message)
            }
          })
          .catch((res) => {
            this.$message.error(res.message)
          })
      }).catch(rej => {
        console.log(rej)
      })
    },
    goAdd() {
      this.$refs.detail.openDetail()
    },
    goEdit(item) {
      this.$refs.detail.openDetail(item)
    },
    // 增加或者删除成功触发的钩子
    detailSuccess() {
      this.getAdsList()
    }

  }
}
</script>
<style lang="scss" scoped>
.ads_main {
  .card {
    margin: 30px;
  }

   .table_img {
    width: 100px;
    height: 100px;
  }
}
</style>
