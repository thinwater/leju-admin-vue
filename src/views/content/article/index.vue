<template>
  <div class="article-main">
    <el-card class="margin-30" shadow="never">
      <div slot="header">
        <span>条件查询</span>
      </div>
      <div>
        <el-form ref="form" :model="articleSearch" label-width="80px" size="mini">
          <el-row :gutter="80">
            <el-col :span="6">
              <el-form-item label="作者">
                <el-input v-model="articleSearch.author" placeholder="请输入作者名" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="标题">
                <el-input v-model="articleSearch.title" placeholder="请输入标题名" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="编辑类型">
                <!-- editorType (integer, optional): 编辑器类型: 0 富文本; 1 markdown , -->
                <el-select v-model="articleSearch.editorType" style="width:100%" placeholder="请选择编辑类型">
                  <el-option
                    label="富文本"
                    :value="0"
                  />
                  <el-option
                    label="markdown"
                    :value="1"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6" :offset="18">
              <el-form-item>
                <el-button @click="resetSearch">重置</el-button>
                <el-button type="primary" @click="doSearchArticle">搜索</el-button>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
      </div>
    </el-card>

    <el-card shadow="never" class="margin-30">
      <div slot="header">
        <el-button type="primary" size="mini" @click="goAddArticle">新增</el-button>
      </div>
      <!-- 数据列表 -->
      <el-table
        v-loading="loading"
        :data="articleList"
        border
        stripe
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-table-column
          type="index"
          label="#"
          width="50"
          align="center"
        />
        <el-table-column
          prop="title"
          label="文章标题"
          width="200"
          align="center"
        />
        <el-table-column
          label="展示图片"
          width="260"
          align="center"
        >
          <template slot-scope="scope">
            <!-- scope.row === articleList 数据源数组元素 -->
            <img width="80" height="80" :src="scope.row.coverImg" alt="">
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="添加时间"
          width="260"
          align="center"
        />
        <el-table-column
          prop="author"
          label="文章作者"
          width="260"
          align="center"
        />
        <el-table-column
          label="文章是否展示"
          width="260"
          align="center"
        >
          <template slot-scope="scope">
            <!-- isShow (integer, optional): 是否显示: 0 否; 1 是 , -->
            <el-switch
              v-model="scope.row.isShow"
              :active-value="1"
              :inactive-value="0"
              @change="isShowChange(scope.row.isShow,scope.row.id)"
            />
          </template>
        </el-table-column>
        <el-table-column

          label="编辑器类型"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <!-- editorType (integer, optional): 编辑器类型: 0 富文本; 1 markdown , -->
            <el-button v-if="scope.row.editorType === 0" type="primary" size="mini" plain>富文本</el-button>
            <el-button v-if="scope.row.editorType === 1" type="info" size="mini" plain>markdown</el-button>

          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-view" @click="goEditArticle(scope.row.id)">编辑文章</el-button>
            <el-button style="color:red" type="text" size="mini" @click="doDeleteArticle(scope.row.id)">删除</el-button>

          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
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
import { findArticles, delArticle, changeShowStatus } from '@/api/content/article/index'
import { filterNullStr } from '@/utils/index'
import mix from '@/mixin/index'
export default {
  name: 'Article',
  mixins: [mix],
  data() {
    return {
      loading: false,
      articleSearch: {
        // author: '张三'
      },
      articleList: []
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
    this.getArticleList()
  },
  methods: {
    goAddArticle() {
      this.$router.push({ name: 'addArticle' })
    },
    async getArticleList() {
      // 开启进度条
      this.loading = true
      const params = filterNullStr(this.articleSearch)
      const res = await findArticles(this.pageParams.start, this.pageParams.limit, params)
      // 关闭进度条
      this.loading = false
      const { success, data, message } = res
      if (success) {
        this.articleList = data.rows
        this.pageParams.total = data.total
      } else {
        this.$message.error(message)
      }
    },
    // 重置
    resetSearch() {
      // this.articleSearch = {}
      // this.articleSearch = {
      //   author: '张三'
      // }

      // console.log(this.$options.data())
      this.articleSearch = this.$options.data().articleSearch
      this.pageParams.start = 1
      this.pageParams.limit = 10
      this.getArticleList()
    },
    // 搜索文章
    doSearchArticle() {
      this.pageParams.start = 1
      this.getArticleList()
    },
    // 每页几条数据发生改变
    handleSizeChange(val) {
      this.pageParams.start = 1
      this.pageParams.limit = val
      this.getArticleList()
    },
    // 页码发生改变
    handleCurrentChange(val) {
      this.pageParams.start = val
      this.getArticleList()
    },
    // 去编辑文章
    goEditArticle(articleId) {
      // this.$router.push({ name: 'ArticleAdd', query: { id: articleId }})
      this.$router.push({ name: 'ArticleEdit', params: { id: articleId }})
    },
    // 删除文章
    doDeleteArticle(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 点击的是确定
        const res = await delArticle(id)
        const { success, message } = res
        if (success) {
          // 更新数据
          this.getArticleList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        } else {
          this.$message.error(message)
        }
      }).catch(() => {
        // 点击的取消
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 修改文章显示状态
    async isShowChange(isShow, id) {
      const res = await changeShowStatus({
        isShow,
        id
      })
      const { success, message } = res
      if (success) {
        this.$message.success('状态修改成功')
      } else {
        this.$message.error(message)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.article-main{
  ::v-deep label{
    font-weight: normal;
  }
}
</style>
