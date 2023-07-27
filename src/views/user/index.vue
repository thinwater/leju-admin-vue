<template>
  <div class="user_main">
    <el-card class="card" shadow="never">
      <div slot="header">
        注册用户列表
      </div>
      <el-table
        v-loading="loading"
        :data="userList"
        border
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" fixed="left" />
        <el-table-column
          align="center"
          prop="username"
          label="用户名"
          width="200"
        />
        <el-table-column
          align="center"
          prop="username"
          label="头像"
          width="200"
        >
          <template slot-scope="scope">
            <el-avatar style="width:60px;height:60px" size="small" :src="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="nickname"
          label="昵称"
          width="150"
        />
        <el-table-column
          align="center"
          prop="realname"
          label="真实姓名"
          width="200"
        />
        <el-table-column
          align="center"
          prop="sex"
          label="性别"
          width="200"
        />
        <el-table-column
          align="center"
          prop="phone"
          label="电话"
          width="200"
        />
        <el-table-column
          align="center"
          prop="email"
          label="邮箱"
          width="200"
        />
        <el-table-column
          align="center"
          prop="birthday"
          label="生日"
          width="200"
        />
        <el-table-column
          align="center"
          prop="createTime"
          label="注册时间"
        />
        <!-- <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="goEdit(scope.row)"
            >编辑</el-button>
            <el-button
              type="text"
              size="small"
              @click="goDelete(scope.row)"
            ><span style="color: red">删除</span></el-button>
          </template>
        </el-table-column> -->

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
import userApi from '@/api/user/index'
import mixin from '@/mixin/index'
export default {
  name: 'UserList',
  mixins: [mixin],
  data() {
    return {
      userList: [],
      loading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // getUserList() {
    //   this.loading = true
    //   userApi.getUserList(this.pageParams.currentPage, this.pageParams.size).then(res => {
    //     if (res.success) {
    //       this.userList = res.data.rows
    //       // console.log(JSON.stringify(res.data.rows))
    //       this.pageParams.total = res.data.total
    //     }
    //     this.loading = false
    //   })
    // },
    async getList() {
      // 开启进度条
      this.loading = true
      // 调用 findArticles 方法 获取文章
      // 此处的 pageParams 以及其内部数据位 mixin 混入, 如有需要, 可前往 '@/mixin/index' 处修改
      // console.log(this.pageParams)
      const res = await userApi.getUserList(this.pageParams.start, this.pageParams.limit)

      // 关闭进度条
      this.loading = false

      const { success, data, message } = res
      if (success) {
        this.userList = data.rows
        this.pageParams.total = data.total
      } else {
        this.$message.error(message)
      }
      // console.log(this.pageParams)
    },
    //   分页size改变
    handleSizeChange(val) {
      this.pageParams.start = 1
      this.pageParams.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.pageParams.start = val
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.user_main {
  .card {
    margin: 30px;
  }

   .table_img {
    width: 100px;
    height: 100px;
  }
}
</style>
