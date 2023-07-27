<template>
  <div class="return-order-main">
    <el-card shadow="never" class="margin-30">
      <div slot="header">
        <span>条件查询</span>
      </div>
      <el-form ref="form" :model="searchReturnOrder" label-width="80px" size="mini">
        <el-row :gutter="20">
          <el-col :span="6" :offset="0">
            <el-form-item label="订单编号">
              <el-input v-model="searchReturnOrder.orderSn" placeholder="请输入订单编号" />
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="0">
            <!-- status (string, optional): 申请状态：0->待处理；1->退货中；2->已完成；3->已拒绝 -->
            <el-form-item label="退单状态">
              <el-select v-model="searchReturnOrder.status" clearable>
                <el-option
                  v-for="item in returnOrderStatus"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>

            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6" :offset="18">
            <el-form-item>
              <el-button @click="resetReturnSearch">重置</el-button>
              <el-button type="primary" @click="doSearchReturnOrder">搜索</el-button>
            </el-form-item>
          </el-col>

        </el-row>

      </el-form>

    </el-card>
    <el-card shadow="never" class="margin-30">
      <el-table :data="list" border stripe>
        <el-table-column
          type="index"
          label="#"
          width="50"
          align="center"
        />
        <el-table-column
          prop="orderSn"
          label="订单编号"
          width="200"
          align="center"
        />
        <el-table-column
          label="退单状态"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <!--  status (string, optional): 申请状态：0->待处理；1->退货中；2->已完成；3->已拒绝 -->
            <el-tag v-if="scope.row.status===0" type="warning" size="mini" effect="dark">待处理</el-tag>
            <el-tag v-else-if="scope.row.status===1" type="info" size="mini" effect="dark">退货中</el-tag>
            <el-tag v-else-if="scope.row.status===2" type="success" size="mini" effect="dark">已完成</el-tag>
            <el-tag v-else type="danger" size="mini" effect="dark">已拒绝</el-tag>

          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述"
          width="300"
          align="center"
        />
        <el-table-column
          prop="reason"
          label="退单原因"
          width="300"
          align="center"
        />
        <el-table-column
          prop="productName"
          label="商品名称"
          width="400"
          align="center"
        />
        <el-table-column
          prop="productAttr"
          label="商品属性"
          width="400"
          align="center"
        />
        <el-table-column
          fixed="right"
          label="操作"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-view" @click="goReturnDetail(scope.row.id)">查看退单</el-button>

          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page.sync="pageParams.start"
        :page-sizes="pageParams.pageSizes"
        :page-size="pageParams.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageParams.total"
        background
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </el-card>
  </div>
</template>
<script>
import { findReturnApply } from '@/api/order/returnOrder/index'
import { filterNullStr } from '@/utils/index'
import mix from '@/mixin/index'
export default {
  name: 'ReturnList',
  mixins: [mix],
  data() {
    return {
      //  status (string, optional): 申请状态：0->待处理；1->退货中；2->已完成；3->已拒绝
      returnOrderStatus: [
        {
          text: '待处理',
          value: 0
        },
        {
          text: '退货中',
          value: 1
        },
        {
          text: '已完成',
          value: 2
        },
        {
          text: '已拒绝',
          value: 3
        }

      ],
      searchReturnOrder: {},
      list: []
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
    this.getReturnOrderList()
  },
  mounted() {
  },
  methods: {
    async getReturnOrderList() {
      const params = filterNullStr(this.searchReturnOrder)
      const res = await findReturnApply(this.pageParams.start, this.pageParams.limit, params)
      const { success, data, message } = res
      if (success) {
        this.list = data.rows
        this.pageParams.total = data.total
      } else {
        this.$message.error(message)
      }
    },
    goReturnDetail(id) {
      this.$router.push({ name: 'orderBackDetail', params: { id }})
    },
    doSearchReturnOrder() {
      this.pageParams.start = 1
      this.getReturnOrderList()
    },
    resetReturnSearch() {
      this.searchReturnOrder = this.$options.data().searchReturnOrder
      this.pageParams.start = 1
      this.pageParams.limit = 10
      this.getReturnOrderList()
    },
    sizeChange(val) {
      this.start = 1
      this.limit = val
      this.getReturnOrderList()
    },
    currentChange(val) {
      this.start = val
      this.getReturnOrderList()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
