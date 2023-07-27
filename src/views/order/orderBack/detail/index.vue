<template>
  <div>
    <el-card shadow="never" class="margin-30">
      <div class="common-title">
        <h2>
          订单信息:
          <el-tag v-if="returnDetail.status===0" type="warning" size="mini" effect="dark">待处理</el-tag>
          <el-tag v-else-if="returnDetail.status===1" type="info" size="mini" effect="dark">退货中</el-tag>
          <el-tag v-else-if="returnDetail.status===2" type="success" size="mini" effect="dark">已完成</el-tag>
          <el-tag v-else-if="returnDetail.status===3" type="danger" size="mini" effect="dark">已拒绝</el-tag>
        </h2>
      </div>
      <el-row :gutter="20">
        <el-col :span="6" :offset="0">
          <p>
            <span>订单编号:</span>
            <span>{{ returnDetail.orderSn }}</span>
            <router-link :to="{name:'OrderDetail',params:{id:returnDetail.orderId}}">查看订单详情</router-link>
          </p>
        </el-col>
        <el-col :span="6" :offset="0">
          <p>
            <span>退单人姓名:</span>
            <span>{{ returnDetail.returnName }}</span>
          </p>
        </el-col>
        <el-col :span="6" :offset="0" />
        <el-col :span="6" :offset="0" />
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" :offset="0" />

      </el-row>
      <el-row :gutter="20">
        <el-col :span="6" :offset="0" />

      </el-row>
      <el-divider />
      <!--  -->
      <div class="common-title">
        <h2>退货商品:</h2>
      </div>
      <el-table :data="[returnDetail]" border stripe>
        <el-table-column
          label="商品图片"

          align="center"
        >
          <template slot-scope="scope">
            <img width="100" height="100" :src="scope.row.productPic" alt="">
          </template>
        </el-table-column>
        <el-table-column
          label="商品描述"

          align="center"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.productName }}</div>
            <div>品牌：{{ scope.row.productBrand }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="商品价格"
          prop="productPrice"
          align="center"
        />
        <el-table-column
          label="商品属性"
          prop="productAttr"
          align="center"
        />
        <el-table-column
          label="商品数量"
          prop="productCount"
          align="center"
        />
        <el-table-column
          label="总计"
          prop="returnAmount"
          align="center"
        />
      </el-table>
      <el-divider />
      <div class="common-title">
        <h2>用户信息:</h2>
      </div>
      <el-divider />
      <div class="common-title">
        <h2>费用信息:</h2>
      </div>
      <el-row :gutter="20">
        <el-col :span="6" :offset="0" />
        <el-col :span="6" :offset="0" />
      </el-row>
      <div v-if="returnDetail.status === 0">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px" size="mini">
          <el-row :gutter="20">
            <el-col :span="6" :offset="0">
              <el-form-item label="退款金额">
                <el-input v-model="form.returnAmount" />
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0">
              <el-form-item label="处理人" prop="handleMan">
                <el-input v-model="form.handleMan" />
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0">
              <el-form-item label="处理备注" prop="handleNote">
                <el-input v-model="form.handleNote" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item>
            <el-button type="primary" @click="doAgree">同意退款</el-button>
            <el-button>拒绝退款</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-divider />
      <div v-if="returnDetail.status!==0" class="common-title">
        <h2>处理结果:</h2>
      </div>
      <el-row :gutter="20">
        <el-col :span="6" :offset="0" />
        <el-col :span="6" :offset="0" />
        <el-col :span="6" :offset="0" />
      </el-row>

      <el-divider />
      <div v-if="returnDetail.status===1">
        <el-form ref="receiveForm" :model="receiveForm" :rules="receiveRules" label-width="80px" :inline="false" size="normal">
          <el-row :gutter="20">
            <el-col :span="6" :offset="0">
              <el-form-item label="收货人" prop="receiveMan">
                <el-input v-model="receiveForm.receiveMan" />
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0">
              <el-form-item label="收货备注" prop="receiveNote">
                <el-input v-model="receiveForm.receiveNote" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item>
            <el-button type="primary" @click="doAgreeReceive">同意收货</el-button>

          </el-form-item>
        </el-form>
      </div>

    </el-card>

  </div>
</template>
<script>
import { orderReturn, agreeApply, receiveProduct } from '@/api/order/returnOrder/index'
export default {
  name: 'ReturnOrderDetail',
  mixins: [],
  data() {
    return {
      returnOrderId: '',
      returnDetail: {},
      rules: {
        handleMan: [{ required: true, message: 'handleMan必填', trigger: 'blur' }],
        handleNote: [{ required: true, message: 'handleNote必填', trigger: 'blur' }]
      },
      form: {},
      receiveForm: {},
      receiveRules: {
        receiveMan: [{ required: true, message: 'receiveMan必填', trigger: 'blur' }],
        receiveNote: [{ required: true, message: 'receiveNote必填', trigger: 'blur' }]
      }
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
    this.returnOrderId = this.$route.params.id
    this.getReturnOrderDetail()
  },
  mounted() {
  },
  methods: {
    async getReturnOrderDetail() {
      const res = await orderReturn(this.returnOrderId)
      const { success, data, message } = res
      if (success) {
        this.returnDetail = data.orderReturnApply
      } else {
        this.$message.error(message)
      }
    },
    async doAgree() {
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          this.form.id = this.returnOrderId
          const res = await agreeApply(this.returnOrderId, this.form)
          const { success, message } = res
          if (success) {
            this.getReturnOrderDetail()
          } else {
            this.$message.error(message)
          }
        } else {
          this.$message.error('请注意表单校验！！！')
        }
      })
    },
    doAgreeReceive() {
      this.$refs.receiveForm.validate(async(valid) => {
        if (valid) {
          this.receiveForm.id = this.returnOrderId
          const res = await receiveProduct(this.returnOrderId, this.receiveForm)
          const { success, message } = res
          if (success) {
            this.getReturnOrderDetail()
          } else {
            this.$message.error(message)
          }
        } else {
          this.$message.error('请注意表单校验！！！')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
