<template>
  <div>
    <el-dialog
      style="margin-top: -100px"
      width="80%"
      title="热销详情"
      :visible.sync="open"
    >
      <div class="brandDetail_main">
        <el-card class="search-main card" shadow="never">
          <div slot="header">
            <span>条件查询</span>
          </div>
          <el-row :gutter="20">
            <el-col :span="4" :offset="0">
              <el-input
                v-model="search.name"
                class="search-input"
                size="mini"
                placeholder="商品名称/模糊查询"
              />
            </el-col>
            <el-col :span="4" :offset="0">
              <el-input
                v-model="search.productSn"
                class="search-input"
                size="mini"
                placeholder="商品货号"
              />
            </el-col>
            <el-col :span="4" :offset="0">
              <el-select
                v-model="search.brandId"
                class="search-input"
                size="mini"
                clearable
                placeholder="品牌"
              >
                <el-option
                  v-for="item in brandList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-col>
            <el-col :span="4" :offset="0">
              <el-select
                v-model="search.publishStatus"
                class="search-input"
                size="mini"
                clearable
                placeholder="上架状态"
              >
                <el-option label="上架" value="1" />
                <el-option label="未上架" value="0" />
              </el-select>
            </el-col>
            <el-col :span="4" :offset="0">
              <el-select
                v-model="search.verifyStatus"
                class="search-input"
                size="mini"
                clearable
                placeholder="审核状态"
              >
                <el-option label="审核" value="1" />
                <el-option label="未审核" value="0" />
              </el-select>
            </el-col>
            <el-col :span="4" :offset="0">
              <el-button
                type="default"
                size="mini"
                @click="doReset"
              >重置
              </el-button>
              <el-button
                type="primary"
                size="mini"
                @click="doSearch"
              >搜索</el-button>
            </el-col>
          </el-row>
        </el-card>
        <!-- 商品列表 -->
        <el-card class="card table_main" shadow="never">
          <div slot="header">商品列表</div>
          <!-- 添加的商品信息 -->
          <el-radio-group
            v-model="productId"
            style="width: 100%"
            @change="radioChange"
          >
            <el-table
              ref="productTable"
              v-loading="loading"
              :data="productList"
              border
              style="width: 100%"
            >
              <el-table-column type="index" label="序号" fixed="left" />
              <el-table-column label="选择" align="center" width="100">
                <template slot-scope="scope">
                  <el-radio :label="scope.row.id"><span /></el-radio>
                </template>
              </el-table-column>
              <!-- 商品列表内容 -->
              <el-table-column label="商品图片" align="center" width="200">
                <template slot-scope="scope">
                  <!-- <router-link></router-link> -->
                  <img :src="scope.row.pic" class="table_img">
                </template>
              </el-table-column>
              <el-table-column align="center" label="商品名称">
                <template slot-scope="scope">
                  <p>{{ scope.row.name }}</p>
                  <p>
                    品牌: {{ scope.row.brandName }} | {{ scope.row.brandEname }}
                  </p>
                  <p>{{ scope.row.description }}</p>
                </template>
              </el-table-column>

              <el-table-column align="center" label="商品价格" width="200">
                <template slot-scope="scope">
                  <p>原价: {{ scope.row.originalPrice | money }}</p>
                  <p>现价: {{ scope.row.price | money }}</p>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="productCategoryName"
                label="商品类别"
                width="200"
              />
              <!-- <el-table-column
            align="center"
            prop="keywords"
            label="关键词"
            width="150"
          /> -->
              <el-table-column
                align="center"
                prop="weight"
                label="重量"
                width="180"
              />
            </el-table>
          </el-radio-group>

          <el-pagination
            :current-page="pageParams.currentPage"
            :page-sizes="pageParams.pageSizes"
            :page-size="pageParams.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageParams.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-card>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="open = false">取 消</el-button>
        </div>
      </div></el-dialog>
    <!-- 编辑最热商品 -->

    <el-dialog title="编辑限时活动" :visible.sync="isEditOpen" width="50%">
      <el-row :gutter="10">
        <el-form
          ref="form"
          :model="form"
          :inline="true"
          label-width="100px"
          size="mini"
        >
          <el-col :span="12" :offset="0">
            <el-form-item label="商品原价">
              <!-- <el-input
                v-model="productDetail.price"
                class="myInput"
                disabled
              /> -->
              <span>{{ productDetail.price }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item label="商品名称">
              <span>{{ productDetail.name }}</span>

              <!-- <el-input v-model="productDetail.name" class="myInput" disabled /> -->
            </el-form-item>
          </el-col>

          <!-- 需要编辑的内容 -->
          <el-col :span="12" :offset="0">
            <el-form-item label="促销价格">
              <el-input-number v-model="form.promotionPrice" class="myInput" />
            </el-form-item>
          </el-col>

          <el-col :span="12" :offset="0">
            <el-form-item label="排序">
              <el-input-number v-model="form.sort" class="myInput" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="form.promotionStartTime"
                class="myInput"
                type="datetime"
                placeholder="开始时间"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="form.promotionEndTime"
                class="myInput"
                type="datetime"
                placeholder="开始时间"
                value-format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item label="活动限购数量">
              <el-input v-model="form.promotionPerLimit" class="myInput" />
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item label="商品图片">
              <img
                style="width: 150px; height: 150px"
                :src="productDetail.pic"
                alt=""
              >
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer">
        <el-button @click="isEditOpen = false">取消</el-button>
        <el-button
          type="primary"
          :loading="couldNext"
          @click="onSubmit"
        >确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixin from '@/mixin/index'
import marketApi from '@/api/market/index'
import productApi from '@/api/product/index'
import brandApi from '@/api/brand/index'

export default {
  name: 'AdsDetail',
  mixins: [mixin],
  data() {
    return {
      // 是否显示
      isEditOpen: false,

      productId: '', // radio选中 商品id
      loading: false,
      search: {
        productSn: '',
        publishStatus: '',
        verifyStatus: '',
        name: ''
      }, // 搜索栏
      searchForm: {
        productSn: '',
        publishStatus: '',
        verifyStatus: '',
        name: ''
      }, // 搜索栏
      couldNext: false, // 是否可以下一步
      productList: [], // 商品列表
      brandList: [], // 商标列表

      open: false, // 打开编辑页面
      form: {
        productId: '', // 商品ID
        promotionPrice: '',
        promotionPerLimit: '',
        sort: '',
        promotionStartTime: '',
        promotionEndTime: ''
      }, // 添加限时活动的form
      productDetail: {} // 编辑商品的详情
    }
  },
  created() {
    this.getBrandList()
    this.getProductList()
  },
  methods: {
    radioChange(v) {
      this.isEditOpen = true
      this.productList.forEach((item) => {
        if (item.id === v) {
          this.productDetail = Object.assign({}, item)
        }
      })
      this.form = {}

      this.productId = v
    },

    // 获取品牌列表
    getBrandList() {
      brandApi
        .brandList()
        .then((res) => {
          this.brandList = res.data.items
        })
        .catch((rej) => {
          console.log('error', rej)
        })
    },
    // 获取商品列表
    getProductList() {
      const sendSearch = {}
      for (const key in this.searchForm) {
        // 如果搜索框有的内容
        if (this.searchForm[key]) {
          sendSearch[key] = this.searchForm[key]
        }
      }
      this.loading = true
      //   get数组传参， 第一个是页数，第二个是每页显示几个
      productApi
        .productList(this.pageParams.currentPage, this.pageParams.size, {
          ...sendSearch
        })
        .then((res) => {
          // sort改为默认0
          this.productList = res.data.rows
          this.pageParams.total = res.data.total
          this.loading = false
        })
        .catch((rej) => {
          console.log(rej)
          this.loading = false
        })
    },
    openDetail() {
      this.open = true
    },
    doReset() {
      this.search = this.$options.data().search
      this.searchForm = this.$options.data().searchForm
    },
    // 搜索按钮
    doSearch() {
      this.pageParams.currentPage = 1
      this.searchForm = Object.assign({}, this.search)
      this.getProductList()
    },
    onSubmit() {
      this.$confirm(`是否确认新增最热推荐商品?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log('ss')
          this.couldNext = true // 打开btn  loding
          marketApi
            .addMarkProduct({
              ...this.form,
              productId: this.productId

            })
            .then((res) => {
              console.log('res', res)
              if (res.success) {
                this.isEditOpen = false // 关闭编辑弹窗
                this.open = false // 关闭新增弹窗
                this.productId = ''
                this.$emit('success')
                this.$message.success('添加成功')
              } else {
                this.$message.error('添加失败')
              }
              this.couldNext = false
            })
          // // 填写确定后的业务逻辑
          // const recommendProducts = this.selectProduct.map(item => {
          //     return { sort: item.sort, productId: item.id }
          // })
          // marketApi.addMarkProduct({
          //     recommendProducts
          // }).then(res => {
          //     if (res.success) {
          //         this.$emit('success')
          //         this.couldNext = false
          //     } else {
          //         this.$message.error('添加失败')
          //         this.couldNext = false
          //     }
          // })
        })
        .catch((rej) => {
          console.log('取消')
        })
    },
    // 分页处理
    handleSizeChange(val) {
      this.pageParams.size = val
      this.pageParams.currentPage = 1
      this.getProductList()
    },
    // 页面切换钩子
    handleCurrentChange(val) {
      this.pageParams.currentPage = val
      this.getProductList()
    }

    // changeRadio(val) {
    //     console.log('val', val)
    // }
  }
}
</script>

<style lang="scss" scoped>
.brandDetail_main {
  position: relative;
  height: 750px;
  overflow: auto;
  // background-color: red;

  .table_main {
    height: 500px;
    overflow: auto;
  }
  .card {
    margin: 30px;
  }
  .table_img {
    width: 50px;
    height: 50px;
  }
}
.myInput {
  width: 100%;
}
</style>
