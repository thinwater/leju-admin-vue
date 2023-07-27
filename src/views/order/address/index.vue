<template>
  <div>
    <el-card shadow="never" class="margin-30">
      <!-- 新增按钮 -->
      <div slot="header">
        <el-button type="primary" size="mini" @click="goAddAddress">新增</el-button>
      </div>
      <!-- 地址展示表格 -->
      <el-table
        :data="list"
        border
        stripe
      >
        <!-- 编号 -->
        <el-table-column
          type="index"
          label="#"
          width="50"
          align="center"
          fixed="left"
        />
        <!-- 名称 -->
        <el-table-column
          prop="addressName"
          label="地址名称"
          width="200"
          align="center"
        />
        <!-- 设置是否为默认地址 -->
        <el-table-column
          label="默认发货地址"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <!-- sendStatus (integer, optional): 默认发货地址：0->否；1->是 -->
            默认发货地址 <el-switch
              v-model="scope.row.sendStatus"
              :active-value="1"
              :inactive-value="0"
              @change="chagneSendStatus(scope.row.id)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="收货人姓名"
          align="center"
          width="200"
        />
        <el-table-column
          prop="phone"
          label="收货人电话"
          align="center"
          width="150"
        />

        <!-- 地址 第一行是三级联动地址 第二行是详细地址 -->
        <el-table-column
          label="收货人地址"
          width="250"
          align="center"
        >
          <template slot-scope="scope">
            <div contenteditable="true">{{ scope.row.province }} {{ scope.row.city }} {{ scope.row.region }}</div>
            <div>{{ scope.row.detailAddress }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="默认收货地址"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <!-- sendStatus (integer, optional): 默认发货地址：0->否；1->是 -->
            默认发货地址 <el-switch
              v-model="scope.row.receiveStatus"
              :active-value="1"
              :inactive-value="0"
              @change="chagneReceiveStatus(scope.row.id)"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
          width="200"
        />
        <el-table-column
          label="操作"
          width="200"
          align="center"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="goEditAddress(scope.row.id)"
            >编辑</el-button>
            <el-button
              type="text"
              style="color:red"
              size="mini"
              @click="goDeleteAddress(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-card>
    <AddressDetail ref="myDialog" @updateList="getAddressList" />
  </div>
</template>
<script>
import { addressList, setSendOne, deleteAddress, setReceiveOne } from '@/api/order/address/index'
import AddressDetail from './detail/index'
export default {
  name: 'Address',
  components: {
    AddressDetail
  },
  mixins: [],
  data() {
    return {
      list: []

    }
  },
  computed: {
  },
  watch: {
  },
  created() {
    this.getAddressList()
  },
  mounted() {
  },
  methods: {
    async getAddressList() {
      const res = await addressList()
      const { success, data, message } = res
      if (success) {
        this.list = data.items
      } else {
        this.$message.error(message)
      }
      // console.log(this.list)
    },
    // 添加地址 与 修改地址 都是调用myDialog组件里的open方法, 区别仅在于是否传入id
    goAddAddress() {
      this.$refs.myDialog.open()
    },
    goEditAddress(id) {
      this.$refs.myDialog.open(id)
    },
    // 改变默认收货地址 添加后弹出修改成功字样 并重新发送请求获取数据
    async chagneSendStatus(id) {
      const res = await setSendOne({ id })
      const { success, message } = res
      // console.log(success)
      if (success) {
        this.$message.success('成功修改默认发货地址')
        this.getAddressList()
      } else {
        this.$message.error(message)
      }
    },
    async chagneReceiveStatus(id) {
      const res = await setReceiveOne({ id })
      const { success, message } = res
      // console.log(success)
      if (success) {
        this.$message.success('成功修改默认收货地址')
        this.getAddressList()
      } else {
        this.$message.error(message)
      }
    },
    // 删除地址,创建一个弹框 询问是否删除 确认后发送请求并显示是否删除成功
    goDeleteAddress(id) {
      this.$confirm('此操作将永久删除该地址, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await deleteAddress(id)
        const { success, message } = res
        console.log(success)
        if (success) {
          // 更新数据
          this.getAddressList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        } else {
          // 若失败则弹出失败框 显示失败信息
          this.$message.error(message)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }

  }
}
</script>
<style lang="scss" scoped>
</style>
