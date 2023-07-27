<template>
  <div>
    <!-- Dialog 对话框弹框 -->
    <!-- visible	是否显示 Dialog，支持 .sync 修饰符 -->
    <el-dialog
      title="新增地址"
      :visible.sync="dialogVisible"
      width="65%"
      @close="doClose"
    >
      <el-form
        ref="form"
        :model="address"
        :rules="rules"
        label-width="120px"
        size="mini"
      >
        <el-row :gutter="20">
          <el-col :span="10" :offset="0">
            <el-form-item label="地址名称" prop="addressName">
              <el-input v-model="address.addressName" placeholder="请输入地址名称" />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="0">
            <el-form-item label="收货人姓名" prop="name">
              <el-input v-model="address.name" placeholder="请输入收货人姓名" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10" :offset="0">
            <el-form-item label="收货人手机号">
              <el-input v-model="address.phone" placeholder="请输入收货人手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="0">
            <el-form-item label="邮政编码">
              <el-input v-model="address.postCode" placeholder="请输入邮政编码" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10" :offset="0">
            <el-form-item label="收货地址">
              <el-cascader
                v-model="selectedOptions"
                style="width:100%"
                size="mini"
                :options="regionData"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="0">
            <el-form-item label="详细地址">
              <el-input v-model="address.detailAddress" placeholder="请输入详细地址" />
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="doCancle">取 消</el-button>
        <el-button type="primary" @click="doAddAddress">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  regionData,
  codeToText
} from 'element-china-area-data'
import { saveAddress, companyAddress, updateAddress } from '@/api/order/address/index'
export default {
  mixins: [],
  data() {
    return {
      addressId: '', // 用于编辑地址
      dialogVisible: false,
      address: {
        // 此处可以填写新地址栏时的默认值
        // addressName: '123321'
      },
      // 规则校验地址与收货人姓名必填
      rules: {
        addressName: [{ required: true, message: '地址名称必填', trigger: 'blur' }],
        name: [{ required: true, message: '收货人姓名必填', trigger: 'blur' }]
      },
      // 地址默认值 天津市 市辖区 河东区
      regionData,
      selectedOptions: ['12', '1201', '120102']
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
  },
  mounted() {
  },
  methods: {
    // 获取地址详情 用于编辑地址
    async getCompanyAddressDetail() {
      const res = await companyAddress(this.addressId)
      const { success, data, message } = res
      if (success) {
        this.address = data.address
        this.selectedOptions = data.address.cityCode.split(',')
      } else {
        this.$message.error(message)
      }
    },
    // 打开方法 若id存在则运行 获取地址详情 的方法 , 若没有就呈现空表单
    open(id) {
      this.dialogVisible = true
      // console.log('id==>', id)
      if (id) {
        this.addressId = id
        this.getCompanyAddressDetail()
      }
    },
    // 重置数据 从$option里获取地址和地址代码
    resetData() {
      this.address = this.$options.data().address
      console.log(this.address)
      this.selectedOptions = this.$options.data().selectedOptions
    },
    // 新增地址 定义一个api用于切换当前是 新建表单 还是 编辑表单
    // 有id 就是更新表单 否则就是 保存表单
    doAddAddress() {
      let api = null
      if (this.addressId) {
        api = updateAddress
      } else {
        api = saveAddress
      }
      // validate	对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise
      // 即此处调用表单的校验检测,若通过校验,就发送数据
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          // 获取需要上传的数据 此处依次是 地址编码 省/直辖市 市 区
          this.address.cityCode = this.selectedOptions.join(',')
          this.address.province = codeToText[this.selectedOptions[0]]
          // console.log(this.address.province)
          this.address.city = codeToText[this.selectedOptions[1]]
          this.address.region = codeToText[this.selectedOptions[2]]
          const res = await api(this.address)
          const { success, message } = res
          if (success) {
            // 1. 关闭对话框
            this.dialogVisible = false
            // 2. 更新数据
            this.$emit('updateList')
            // 3. 清空表单
            this.resetData()
          } else {
            this.$message.error(message)
          }
        } else {
          this.$message.error('请注意表单校验！！！')
        }
      })
    },
    doClose() {
      this.resetData()
    },
    doCancle() {
      // dialog 内部应该有监听 dialogVisible 如果时false 自动触发close事件
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
