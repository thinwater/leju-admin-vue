<template>
  <div>
    <el-card shadow="never" class="margin-30">
      <div slot="header">
        <span>分类管理</span>
      </div>
      <h2>全部分类：</h2>
      <el-table :data="categoryList" border stripe row-key="id" :tree-props="{children: 'subCategory'}">
        <el-table-column
          prop="name"
          align="center"
          label="菜单名称"
          width="200"
        />
        <el-table-column
          align="center"
          label="ICON"
          width="200"
        >
          <template slot-scope="scope">
            <img width="80" height="80" :src="scope.row.icon" alt="">
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="分类名称"
          width="200"
        />
        <el-table-column
          prop="sort"
          align="center"
          label="排序"
          width="200"
        />
        <el-table-column
          align="center"
          label="显示状态"
          width="200"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.showStatus === 1?"显示":'不显示' }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="导航栏展示"
          width="200"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.navStatus === 1?"显示":'不显示' }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          align="center"
          label="描述"
          width="200"
        />
        <el-table-column
          prop="createTime"
          align="center"
          label="时间"
          width="200"
        />
      </el-table>

    </el-card>

  </div>
</template>
<script>
import productApi from '@/api/product/index'
import mix from '@/mixin/index'
export default {
  name: 'ProductName',
  mixins: [mix],
  data() {
    return {
      categoryList: []
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
    this.getAllCategoryList()
  },
  mounted() {
  },
  methods: {
    async getAllCategoryList() {
      const res = await productApi.getAllCategory()
      const { success, data, message } = res
      if (success) {
        // this.categoryList = data.items
        data.items.forEach(item => {
          this.categoryList.push({
            ...item.category,
            subCategory: item.children
          })
        })

        // console.log(' this.categoryList=>', this.categoryList)
      } else {
        this.$message.error(message)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
