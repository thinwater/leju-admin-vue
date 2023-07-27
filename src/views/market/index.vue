<template>
  <div class="market_main">
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
        :data="marketList"
        border
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" fixed="left" />
        <el-table-column label="商品图片" width="150">
          <template slot-scope="scope">
            <!-- <router-link></router-link> -->
            <img :src="scope.row.pic" class="table_img">
          </template>
        </el-table-column>
        <el-table-column align="center" prop="productSn" label="活动时间" width="300">
          <template slot-scope="scope">
            <p>开始时间: {{ scope.row.promotionStartTime }}</p>
            <p>结束时间: {{ scope.row.promotionEndTime }}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="productSn" label="是否过期" width="100">
          <template slot-scope="scope">
            <p>{{ judgeTime(scope.row.promotionStartTime,scope.row.promotionEndTime) }}</p>

          </template>
        </el-table-column>
        <el-table-column align="center" prop="name" label="商品名称" width="300" />
        <!-- <el-table-column align="center" prop="sort" label="排序" width="150" /> -->
        <el-table-column align="center" prop="brandName" label="品牌名称" width="250" />

        <el-table-column align="center" prop="price" label="商品价格" width="150" />
        <el-table-column
          align="center"
          prop="productCategoryName"
          label="商品类别"
          width="150"
        />
        <!-- doing -->

        <el-table-column
          align="center"
          prop="createTime"
          label="创建时间"
          width="350"
        />

        <el-table-column fixed="right" align="center" label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="goDelete(scope.row)"
            >
              <span style="color: red">删除</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-card>
    <detail-com ref="detail" @success="detailSuccess" />

  </div>
</template>

<script>
import marketApi from '@/api/market/index'
import detailCom from '@/views/market/components/detail'

export default {
  name: 'MarketList',
  components: { detailCom },
  data() {
    return {
      marketList: [],
      loading: false
    }
  },
  computed: {
    showList() {
      return this.marketList
    }
  },
  created() {
    this.getMarketList()
  },
  methods: {
    judgeTime(startTime, endTime) {
      // console.log(new Date(endTime).getTime())
      var num = new Date().getTime() - new Date(endTime).getTime()
      return num > 0 ? '过期' : '否'
    },
    getMarketList() {
      this.loading = true
      marketApi.getMarketList().then(res => {
        if (res.success) {
          this.marketList = res.data.items
        }
        this.loading = false
      })
    },
    goAdd() {
      this.$refs.detail.openDetail()
    },
    detailSuccess(v) {
      this.getMarketList()
    },
    goDelete(row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        marketApi
          .deleteMarketProduct(row.recommendId)
          .then((res) => {
            if (res.success) {
              this.getMarketList()
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
    }
  }
}
</script>
<style lang="scss" scoped>
.market_main {
  .card {
    margin: 30px;
  }

   .table_img {
    width: 100px;
    height: 100px;
  }
}
</style>
