<template>
  <div class="goods-main">
    <!-- 商品管理介绍 折叠面板 -->
    <el-collapse>
      <el-collapse-item title="商品管理介绍">
        <div>商品管理模块可以对客户端的商品进行增删改查等相关操作,来控制客户端商品的列表展示和商品详情</div>
      </el-collapse-item>
    </el-collapse>
    <!-- 商品条件查询 折叠面板 -->
    <el-collapse class="margin-30">
      <el-collapse-item title="条件查询">
        <el-form ref="form" :model="searchGoods" label-width="80px" size="mini">
          <el-row :gutter="20">
            <el-col :span="6" :offset="0">
              <el-form-item label="商品名称">
                <el-input v-model="searchGoods.name" placeholder="商品名称" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0">
              <el-form-item label="商品货号">
                <el-input v-model="searchGoods.productSn" placeholder="商品货号" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0">
              <el-form-item label="品牌">
                <el-select v-model="searchGoods.brandId" placeholder="品牌" clearable>
                  <el-option
                    v-for="item in brandList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0">
              <el-form-item label="上架状态">
                <!-- // 上架状态：0->下架；1->上架 ,'publishStatus': 0, -->
                <el-select v-model="searchGoods.publishStatus" placeholder="上架状态" clearable>
                  <el-option
                    label="下架"
                    :value="0"
                  />
                  <el-option
                    label="上架"
                    :value="1"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6" :offset="0">
              <el-form-item label="审核状态">
                <!--'verifyStatus': 0, //  审核状态：0->未审核；1->审核通过 , -->
                <el-select v-model="searchGoods.verifyStatus" placeholder="审核状态" clearable>
                  <el-option
                    v-for="item in verifyStatusOptions"
                    :key="item.text"
                    :label="item.text"
                    :value="item.value"
                  />
                </el-select>

              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="12">
              <el-form-item>
                <el-button>重置</el-button>
                <el-button type="primary" @click="doSearchGoods">搜索</el-button>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>

      </el-collapse-item>
    </el-collapse>
    <el-card shadow="never" class="margin-30">
      <!-- 新增 以及 导出excel表格 按钮 -->
      <div slot="header">
        <el-button type="primary" size="mini" @click="goAddGoods">新增</el-button>
        <el-button type="primary" size="mini" @click="exportExcel">导出excel表格</el-button>
      </div>
      <!-- 商品列表 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column
          fixed="left"
          type="index"
          label="#"
          width="50"
          align="center"
        />
        <el-table-column
          label="商品图片"
          width="160"
          align="center"
        >
          <template slot-scope="scope">
            <img width="80" height="80" :src="scope.row.pic" alt="">
          </template>
        </el-table-column>
        <el-table-column
          label="商品名称"
          width="300"
          align="center"
        >
          <template slot-scope="scope">
            <div>名称：{{ scope.row.name }}</div>
            <div>品牌：{{ scope.row.brandName }}</div>
            <div>描述：{{ scope.row.description }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="商品价格"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <div>原价：{{ scope.row.originalPrice }}</div>
            <div>现价：{{ scope.row.price }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="商品类别"
          prop="productCategoryName"
          width="200"
          align="center"
        />
        <el-table-column
          label="标签"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <!-- 'newStatus': 0, // 新品状态:0->不是新品；1->新品 ,新品会在移动端首页推荐 -->
            最新:<el-switch
              v-model="scope.row.newStatus"
              :active-value="1"
              :inactive-value="0"
              @change="doNewStatusUpdate(scope.row.id,scope.row.newStatus)"
            />
            <!--     // 推荐状态；0->不推荐；1->推荐 , -->
            推荐：<el-switch
              v-model="scope.row.recommendStatus"
              :active-value="1"
              :inactive-value="0"
              @change="doRecommandStatusUpdate(scope.row.id,scope.row.recommendStatus)"
            />
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="goEditProduct(scope.row.id)">编辑</el-button>
            <el-button type="text" size="mini" style="color:red;" @click="doDeleteProduct(scope.row.id)">删除</el-button>

          </template>
        </el-table-column>

      </el-table>
      <!-- 分页器 -->
      <el-pagination
        :current-page.sync="pageParams.start"
        :page-sizes="pageParams.pageSizes"
        :page-size="pageParams.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageParams.total"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <skuDetailCom ref="skuDetail" />
  </div>
</template>
<script>
import productApi from '@/api/product/index'
import brandApi from '@/api/brand/index'
import mix from '@/mixin/index'
import skuDetailCom from '@/views/product/components/skuDetail'
export default {
  name: 'GoodsList',
  components: { skuDetailCom },
  mixins: [mix],
  data() {
    return {
      loading: false,
      goodsList: [],
      brandList: [],
      verifyStatusOptions: [
        // 0->未审核；1->审核通过
        {
          text: '未审核',
          value: 0
        },
        {
          text: '审核通过',
          value: 1
        }
      ],
      search: {
        productSn: '',
        publishStatus: '',
        verifyStatus: '',
        name: ''
      },
      searchGoods: {}
    }
  },
  created() {
    this.getGoodsList()
    this.getAllBrandList()
  },
  mounted() {
  },
  methods: {
    switchCode(key, item) {
      var id = item.id
      // 暂存状态，修改失败的时候反选回去
      var tempStatus = item[key] === 0 ? 1 : 0
      let str = ''
      // doing

      // 根据key 选择接口
      switch (key) {
        case 'newStatus':
          str = 'switchNewStatus'
          break
        case 'previewStatus':
          str = 'switchPreviewStatus'
          break
        case 'publishStatus':
          str = 'switchPublishStatus'
          break
        case 'recommendStatus':
          str = 'switchRecommendStatus'
          break
        case 'verifyStatus':
          str = 'switchVerifyStatus'
          break
        default:
          break
      }

      productApi[str]({
        productId: id,
        status: item[key]
      })
        .then((res) => {
          if (res.success) {
            this.$message.success('修改状态成功')
          } else {
            item[key] = tempStatus
            this.$message.error('修改状态失败')
          }
        })
        .catch((rej) => {
          item[key] = tempStatus
          this.$message.error('修改状态失败')
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j] // item.id
      }))
    },
    exportExcel() {
      import('@/vendor/Export2Excel').then(excel => {
        // const tHeader = ['名称', '品牌', '价格']
        // const data = [
        //   ['白酒1', '茅台', '1455'],
        //   ['白酒2', '洋河', '455'],
        //   ['白酒3', '剑南春', '1088'],
        //   ['白酒4', '泸州老窖', '800'],
        //   ['白酒5', '老村子', '455'],
        //   ['白酒6', '江小白', '145']
        // ]
        const tHeader = ['Id', '商品名称-name', '品牌名称-brandName', '商品编号-productSn', 'createTime']
        const filterVal = ['id', 'name', 'brandName', 'productSn', 'createTime']
        const list = this.goodsList
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader, // 表头 必填
          data, // 具体数据 必填
          filename: '商品详情表2', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
      })
    },
    goAddGoods() {
      this.$router.push({ name: 'addProductDetail' })
    },
    // 获取商品列表
    async getGoodsList() {
      const res = await productApi.productList(this.pageParams.start, this.pageParams.limit, this.searchGoods)
      const { success, data, message } = res
      // console.log(data)
      if (success) {
        this.goodsList = data.rows
        this.pageParams.total = data.total
      } else {
        this.$message.error(message)
      }
    },
    // 获取品牌列表
    async getAllBrandList() {
      const res = await brandApi.brandList()
      const { success, data, message } = res
      if (success) {
        this.brandList = data.items
      } else {
        this.$message.error(message)
      }
    },

    doSearchGoods() {
      this.getGoodsList()
    },
    goEditProduct(id) {
      this.$router.push({ name: 'productDetail', params: { id }})
    },
    // 删除商品
    doDeleteProduct(id) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 若点击的是确定 发送删除请求 并将返回结果解构 最后弹出提示框(删除成功)
        const res = await productApi.productDelete(id)
        const { success, message } = res
        if (success) {
          // 更新数据
          this.getGoodsList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        } else {
          // 若失败则弹出失败框 显示失败信息
          this.$message.error(message)
        }
      }).catch(() => {
        // 点击的取消 弹出(已取消删除)信息
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSizeChange(val) {
      this.pageParams.start = 1
      this.pageParams.limit = val
      this.getGoodsList()
    },
    // 页码发生改变
    handleCurrentChange(val) {
      this.pageParams.start = val
      this.getGoodsList()
    },
    async doNewStatusUpdate(id, status) {
      const res = await productApi.switchNewStatus({
        'productId': id,
        'status': status
      })
      const { success, message } = res
      // console.log(success)
      if (success) {
        this.$message.success('成功修改商品标签')
        this.getAddressList()
      } else {
        this.$message.error(message)
      }
      this.getGoodsList()
    },
    async doRecommandStatusUpdate(id, status) {
      const res = await productApi.switchRecommendStatus({
        'productId': id,
        'status': status
      })
      const { success, message } = res
      // console.log(success)
      if (success) {
        this.$message.success('成功修改商品推荐')
        this.getAddressList()
      } else {
        this.$message.error(message)
      }
      this.getGoodsList()
    }
  }
}
</script>
<style lang="scss" scoped>
.goods-main{
  .el-collapse{
    padding-bottom: 20px;
    background-color: #fff;
  }
  ::v-deep .el-collapse-item{
    text-indent: 10px;
  }
}
</style>
