<template>
  <div v-if="orderDetail.orderBase" class="order-detail-main">
    <el-card shadow="never" class="margin-30">
      <el-steps :active="orderDetail.orderBase.status+1">
        <el-step title="待付款" :description="orderDetail.orderBase.createTime" />
        <el-step title="待发货" :description="orderDetail.orderBase.paymentTime" />
        <el-step title="已发货" :description="orderDetail.orderBase.deliveryTime" />
        <el-step v-if="orderDetail.orderBase.status!==4" title="已完成" :description="orderDetail.orderBase.receiveTime" />
        <el-step v-if="orderDetail.orderBase.status!==3" title="退货" :description="orderDetail.orderBase.finishTime" />
      </el-steps>
      <el-divider />
      <div class="common-title">
        <h3>
          订单信息:
          <el-tag v-if="orderDetail.orderBase.status===0" type="danger" effect="dark">待付款</el-tag>
          <el-tag v-else-if="orderDetail.orderBase.status===1" type="info" effect="dark">待发货</el-tag>
          <el-tag v-else-if="orderDetail.orderBase.status===2" type="info" effect="dark">已发货</el-tag>
          <el-tag v-else-if="orderDetail.orderBase.status===3" type="success" effect="dark">已完成</el-tag>
          <el-tag v-else-if="orderDetail.orderBase.status===4" type="warning" effect="dark">退货</el-tag>
          <el-tag v-else effect="dark"> 无效订单</el-tag>
        </h3>
      </div>
      <el-row :gutter="20">
        <el-col :span="6" :offset="0">
          <span>订单金额:</span>
          <span style="color:red;">{{ orderDetail.orderBase.totalAmount }}</span>
        </el-col>
        <el-col :span="6" :offset="0">
          <span>订单编号:</span>
          <span>{{ orderDetail.orderBase.orderSn }}</span>
        </el-col>
        <el-col :span="6" :offset="0" />
        <el-col :span="6" :offset="0" />
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" :offset="0" />
        <el-col :span="6" :offset="0" />
      </el-row>
      <el-divider />
      <div class="common-title">
        <h3> 收货人信息: </h3>
      </div>
      <el-row :gutter="20">
        <el-col :span="6" :offset="0">
          <span>收货人:</span>
          <span style="color:red;">{{ orderDetail.orderBase.totalAmount }}</span>
        </el-col>
        <el-col :span="6" :offset="0">
          <span>用户姓名:</span>
          <span>{{ orderDetail.orderBase.orderSn }}</span>
        </el-col>
        <el-col :span="6" :offset="0" />
        <el-col :span="6" :offset="0" />
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" :offset="0" />
        <el-col :span="6" :offset="0" />
      </el-row>
      <el-divider />
      <div class="common-title">
        <h3> 商品信息: </h3>
      </div>
      <el-table :data="orderDetail.orderItems" border stripe>
        <el-table-column
          prop="productName"
          label="商品名称"
          width="300"
        />
        <el-table-column

          label="商品图片"
          width="300"
        >
          <template slot-scope="scope">
            <img width="80" height="80" :src="scope.row.productSkuPic" alt="">
          </template>
        </el-table-column>
        <el-table-column

          label="是否退货"
          width="300"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.isReturn===0?"否":"是" }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="productBrand"
          label="品牌"
          width="300"
        />
        <el-table-column
          prop="productPrice"
          label="价格"
          width="300"
        />
        <el-table-column
          prop="productQuantity"
          label="商品数量"
          width="300"
        />
        <el-table-column
          prop="totalPrice"
          label="小计"
          width="300"
        />
      </el-table>

      <el-divider />
      <div class="common-title">
        <h3>费用信息: </h3>
      </div>
      <el-row :gutter="20">
        <el-col :span="6" :offset="0">
          <span>运费金额:</span>
          <span style="color:red;">0</span>
        </el-col>
        <el-col :span="6" :offset="0">
          <span>订单总金额:</span>
          <span style="color:red;">{{ orderDetail.orderBase.totalAmount }}</span>
        </el-col>
        <el-col :span="6" :offset="0">
          <span>实际金额:</span>
          <span style="color:red;">{{ orderDetail.orderBase.payAmount }}</span>
        </el-col>
        <el-col :span="6" :offset="0">

          0<span>促销优化金额:</span>
          <span style="color:red;">0</span>
        </el-col>
      </el-row>
      <div v-if="orderDetail.orderBase.status ===1">
        <el-form ref="form" :model="sendForm" :rules="rules" label-width="80px" size="mini">
          <el-row :gutter="20">
            <el-col :span="6" :offset="0">
              <el-form-item label="物流公司" prop="deliveryCompany">
                <el-select v-model="sendForm.deliveryCompany" clearable>
                  <el-option

                    label="邮政"
                    value="邮政"
                  />
                  <el-option

                    label="韵达"
                    value="韵达"
                  />
                  <el-option

                    label="圆通"
                    value="圆通"
                  />
                </el-select>

              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0">
              <el-form-item label="物流单号" prop="deliverySn">
                <el-input v-model="sendForm.deliverySn" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item>
            <el-button type="primary" @click="doSend">确认发货</el-button>

          </el-form-item>
        </el-form>
      </div>
      <el-divider />

      <div v-if="orderDetail.orderBase.status !== 0 || orderDetail.orderBase.status !== 1">
        <div class="common-title">
          <h3>物流信息:{{ orderDetail.orderBase.deliveryCompany }}[{{ orderDetail.orderBase.deliverySn }}] </h3>
        </div>
        <!-- <el-table :data="" border stripe>
          <el-table-column v-for="col in columns"
            :prop="col.id"
            :key="col.id"
            :label="col.label"
            :width="col.width">
          </el-table-column>
        </el-table> -->

      </div>

      <el-divider />
    </el-card>

  </div>
</template>
<script>
import { orderDetail, sendDone } from '@/api/order/index'
export default {
  name: 'OrderDetail',
  mixins: [],
  data() {
    return {
      orderId: '',
      orderDetail: {},
      sendForm: {},
      rules: {
        deliveryCompany: [{ required: true, message: '物流公司', trigger: 'blur' }],
        deliverySn: [{ required: true, message: '物流单号', trigger: 'blur' }]
      }
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
    this.orderId = this.$route.params.id
    this.getOrderDetail()
  },
  mounted() {
  },
  methods: {
    async getOrderDetail() {
      const res = await orderDetail(this.orderId)
      const { success, data, message } = res
      if (success) {
        this.orderDetail = data.orderDetail
      } else {
        this.$message.error(message)
      }
    },
    async doSend() {
      this.sendForm.orderId = this.orderId
      const res = await sendDone(this.sendForm)
      const { success, message } = res
      if (success) {
        // 更新数据
        this.getOrderDetail()
      } else {
        this.$message.error(message)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.order-detail-main{
  .el-steps{
    padding: 50px 200px;
    background-color: #fff;
  }
}
</style>
