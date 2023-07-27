<template>
  <div>
    <el-card shadow="never" class="margin-30">
      <div slot="header">
        <!-- 素材上传 采用el-upload组件
             action	必选参数，上传的地址
             on-success	文件上传成功时的钩子
             headers	设置上传的请求头部 (需上传token) -->
        <el-upload
          ref="upload"
          action="/lejuAdmin/material/uploadFileOssSave"
          :on-success="matarialUploadSucc"
          :headers="token"
        >
          <!-- 通过 slot 你可以传入自定义的上传按钮类型 和文字提示
          可通过设置 limit 和 on-exceed 来限制上传文件的个数和定义超出限制时的行为
          可通过设置 before-remove 来阻止文件移除操作。 -->
          <el-button slot="trigger" size="small" type="primary">素材上传</el-button>
          <div slot="tip" class="el-upload__tip">jpg/png files with a size less than 500kb</div>
        </el-upload>

      </div>
      <el-row :gutter="20">
        <el-col
          v-for="item in list"
          :key="item.id"
          style="width:20%"
        >
          <el-card shadow="never" style="margin-bottom:20px">
            <div slot="header">
              <span>创建时间:{{ item.createTime }}</span>
            </div>
            <!-- <img width="280" height="300" :src="item.ossUrl" alt=""> -->
            <el-image style="width:280px;height:300px" :src="item.ossUrl" fit="fill" :preview-src-list="srcList" />

            <el-button type="danger" size="mini" @click="doDel(item.id)">删除</el-button>
          </el-card>

        </el-col>
      </el-row>

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
import mix from '@/mixin/index'
import { findMaterialByPage, delMaterial } from '@/api/content/matarial/index'
export default {
  name: 'Matarial',
  // mixin 混入分页器数据
  mixins: [mix],
  data() {
    return {
      list: [],
      srcList: []
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
    // 页面初始化时调用获取素材
    this.getMatarialList()
  },
  mounted() {
  },
  methods: {

    matarialUploadSucc(res) {
      const { success, message } = res
      if (success) {
        // 更新数据
        this.getMatarialList()
        // 清除列表
        this.$refs.upload.clearFiles()
      } else {
        this.$message.error(message)
      }
    },
    async getMatarialList() {
      const res = await findMaterialByPage(this.pageParams.start, this.pageParams.limit)
      const { success, data, message } = res
      if (success) {
        this.list = data.rows
        this.srcList = data.rows.map(item => item.ossUrl)
        this.pageParams.total = data.total
        this.total = data.total
      } else {
        this.$message.error(message)
      }
    },
    doDel(id) {
      // console.log(id)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 若点击的是确定 发送删除请求 并将返回结果解构 最后弹出提示框(删除成功)
        const res = await delMaterial(id)
        const { success, message } = res
        if (success) {
          // 更新数据
          this.getMatarialList()
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
      this.getMatarialList()
    },
    handleCurrentChange(val) {
      this.pageParams.start = val
      this.getMatarialList()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
