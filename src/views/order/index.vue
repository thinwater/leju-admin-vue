<template>
  <div class="order-list-main">
    <el-card shadow="never" class="margin-30">
      <div slot="header">
        <span>条件查询</span>
      </div>
      <el-form ref="form" :model="searchOrder" label-width="80px" size="mini">
        <el-row :gutter="20">
          <el-col :span="6" :offset="0">
            <el-form-item label="订单编号">
              <el-input v-model="searchOrder.orderSn" placeholder="请输入订单编号" />
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="0">
            <el-form-item label="订单类型">
              <!-- orderType (integer, optional): 订单类型：0->正常订单；1->秒杀订单 , -->
              <el-select v-model="searchOrder.orderType" clearable>
                <el-option
                  label="正常订单"
                  :value="0"
                />
                <el-option
                  label="秒杀订单"
                  :value="1"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="0">

            <el-form-item label="支付方式">
              <!-- payType (integer, optional): 支付方式：0->未支付；1->支付宝；2->微信 , -->
              <el-select v-model="searchOrder.payType" clearable>
                <el-option
                  label="未支付"
                  :value="0"
                />
                <el-option
                  label="支付宝"
                  :value="1"
                />
                <el-option
                  label="微信"
                  :value="2"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="0">

            <el-form-item label="订单状态">
              <!-- status (integer, optional): 订单状态：0->待付款；1->待发货；2->已发货；3->已完成；4->退货；5->无效订单 -->
              <el-select v-model="searchOrder.status" clearable>
                <el-option
                  v-for="item in orderStatusOptions"
                  :key="item.text"
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
              <el-button @click="resetSearch">重置</el-button>
              <el-button type="primary" @click="doSearchOrder">搜索</el-button>
            </el-form-item>
          </el-col>

        </el-row>

      </el-form>

    </el-card>
    <!-- 表格 -->
    <el-card shadow="never" class="margin-30">

      <el-table :data="orderList" border stripe>
        <el-table-column
          type="index"
          align="center"
          label="#"
          width="50"
        />
        <el-table-column
          prop="orderSn"
          align="center"
          label="订单编号"
          width="200"
        />
        <el-table-column
          align="center"
          label="支付方式"
          width="200"
        >
          <template slot-scope="scope">
            <!-- payType (integer, optional): 支付方式：0->未支付；1->支付宝；2->微信 , - -->
            <el-button v-if="scope.row.payType === 1" type="primary" size="mini">
              支付宝&nbsp;<svg-icon icon-class="zhifubao" />
            </el-button>
            <el-button v-else-if="scope.row.payType === 2" class="my-weixin" type="primary" size="mini">
              微信&nbsp;<svg-icon icon-class="weixin" />
            </el-button>
            <el-button v-else type="info" size="mini">未支付</el-button>

            <!-- <svg-icon icon-class="zhifubao" class-name="zhifubao-class" />
            <svg-icon v-else-if="scope.row.payType === 2" icon-class="weixin" class-name="weixin-class" />
            <el-button v-else type="info" size="mini">未支付</el-button> -->

          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="订单状态"
          width="200"
        >
          <template slot-scope="scope">
            <!-- status (integer, optional): 订单状态：0->待付款；1->待发货；2->已发货；3->已完成；4->退货；5->无效订单 -->
            <el-tag v-if="scope.row.status===0" type="danger" effect="dark">待付款</el-tag>
            <el-tag v-else-if="scope.row.status===1" type="info" effect="dark">待发货</el-tag>
            <el-tag v-else-if="scope.row.status===2" type="info" effect="dark">已发货</el-tag>
            <el-tag v-else-if="scope.row.status===3" type="success" effect="dark">已完成</el-tag>
            <el-tag v-else-if="scope.row.status===4" type="warning" effect="dark">退货</el-tag>
            <el-tag v-else effect="dark"> 无效订单</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="200"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-view" @click="goOrderDetail(scope.row.id)">查看订单</el-button>

          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="text-align:left;margin-top:20px;"
        :current-page="pageParams.start"
        :page-sizes="pageParams.pageSizes"
        :page-size="pageParams.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageParams.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

  </div>
</template>
<script>
import { findOrdersByPage } from '@/api/order/index'
import { filterNullStr } from '@/utils/index'
import mix from '@/mixin/index'
export default {
  name: 'OrderList',
  mixins: [mix],
  data() {
    return {
      searchOrder: {},
      //   <!-- status (integer, optional): 订单状态：0->待付款；1->待发货；2->已发货；3->已完成；4->退货；5->无效订单 -->
      // 数据字典
      orderStatusOptions: [
        {
          text: '待付款',
          value: 0
        },

        {
          text: '待发货',
          value: 1
        },
        {
          text: '已发货',
          value: 2
        },
        {
          text: '已完成',
          value: 3
        },
        {
          text: '退货',
          value: 4
        },
        {
          text: '无效订单',
          value: 5
        }
      ],
      orderList: []
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
    this.getOrderList()
  },
  mounted() {
  },
  methods: {
    async getOrderList() {
      const params = filterNullStr(this.searchOrder)
      const res = await findOrdersByPage(this.pageParams.start, this.pageParams.limit, params)
      const { success, data, message } = res
      if (success) {
        this.orderList = data.rows
        this.pageParams.total = data.total
      } else {
        this.$message.error(message)
      }
    },
    goOrderDetail(id) {
      this.$router.push({ name: 'orderDetail', params: { id }})
    },
    doSearchOrder() {
      this.pageParams.start = 1
      this.getOrderList()
    },
    resetSearch() {
      this.searchOrder = this.$options.data().searchOrder
      this.pageParams.start = 1
      this.pageParams.limit = 10
      this.getOrderList()
    },
    // 每页几条数据发生改变
    handleSizeChange(val) {
      this.pageParams.start = 1
      this.pageParams.limit = val
      this.getOrderList()
    },
    // 页码发生改变
    handleCurrentChange(val) {
      this.pageParams.start = val
      this.getOrderList()
    }
  }
}
</script>
<style lang="scss" scoped>
.order-list-main{
  .zhifubao-class{
    background-color: blue;
    font-size: 30px;
    // padding: 5px 10px;
  }
  .weixin-class{
    background-color: rgb(1, 1, 1);
  }
  .my-weixin{
    background-color: #67c23a;
  }
}
</style>
