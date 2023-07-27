<template>
  <div>
    <el-card shadow="never" class="margin-30">
      <div slot="header">
        <!-- 新增文章和修改文章实际上是同一个页面,显示由articleId是否存在判断 -->
        <span>{{ articleId ? "修改文章" : "新增文章" }}</span>
      </div>
      <!-- el-form表单中存在规则校验,因此要添加:rules="rules"
      label-width 是提示文本的宽度 -->
      <el-form
        ref="articleForm"
        :model="article"
        :rules="rules"
        label-width="120px"
        size="mini"
      >
        <!-- :span是每个元素所占此row比例，一行是24
             :gutter是该row内元素之间的间隙，也就是col占6，gutter占6中的20px -->
        <el-row :gutter="20">
          <el-col :span="6">
            <!-- label 为标签文本 也可以叫提示文本
                 prop 是表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的   -->
            <el-form-item label="作者" prop="author">
              <el-input v-model="article.author" placeholder="请输入作者名称" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="标题" prop="title">
              <el-input v-model="article.title" clearable placeholder="请输入标题名称" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="是否显示">
              <!-- isShow (integer, optional): 是否显示: 0 否; 1 是 , -->
              <!-- 此处使用了el-switch组件,是一个开关组件,开启状态时值为1,关闭状态时值为0 -->
              <el-switch
                v-model="article.isShow"
                :active-value="1"
                :inactive-value="0"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第二行 摘要 文本域 此处注意文本域依旧使用el-input 但其中的type属性应当写为"textarea" -->
        <el-row :gutter="20">
          <el-col :span="13" :offset="0">
            <el-form-item label="摘要" prop="summary">
              <!-- 此处clearable指是否可清空选项,设置后在输入框后出现一个有叉号的清空图标
                ps: 文本域中设置但未生效,可能无法使用 -->
              <el-input
                v-model="article.summary"
                type="textarea"
                placeholder="摘要"
                clearable
                :rows="3"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第三行 封面图片上传 使用el-upload组件 -->
        <el-row :gutter="20">
          <el-col :span="6" :offset="0">
            <el-form-item label="封面图片">
              <el-upload
                ref="coverImgUplaod"
                :action="uploadFileOss"
                :headers="token"
                :on-success="coverImgSucc"
                :before-upload="beforeCoverImgUpload"
              >
                <!-- 上传图片展示 如果没有图片只显示上传按钮,有图片时展示图片 -->
                <img
                  v-if="article.coverImg"
                  width="80"
                  height="80"
                  :src="article.coverImg"
                >
                <el-button
                  v-else
                  size="small"
                  type="primary"
                >点击上传</el-button>
                <!-- 上传图片限制 提示文本 -->
                <div slot="tip" class="el-upload__tip">
                  只能上传jpg/png文件，且不超过500kb
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第四行 切换富文本类型 为一个Radio 单选框 -->
        <el-row :gutter="20">
          <!-- offset	栅格左侧的间隔格数 此处仅为展示,故值为0 -->
          <el-col :span="12" :offset="0">
            <el-form-item label="切换富文本类型">
              <!-- editorType (integer, optional): 编辑器类型: 0 富文本; 1 markdown , -->

              <!-- 单选框 绑定值为 article.editorType 改变时就调用 editorTypeChange 方法 -->
              <el-radio
                v-model="article.editorType"
                :label="0"
                @change="editorTypeChange"
              >富文本</el-radio>
              <el-radio
                v-model="article.editorType"
                :label="1"
                @change="editorTypeChange"
              >markdown</el-radio>
              <span
                style="color: #e6a23c"
              ><i class="el-icon-warning-outline" />
                注意!切换编辑器会清空编辑内容</span>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 第五行 富文本编辑器  -->
        <el-row :gutter="20">
          <el-col :span="24">
            <div v-if="article.editorType === 0">
              <Tinymce v-model="article.content1" />
            </div>
            <div v-else>
              <mavon-editor
                ref="mavonEditorRef"
                v-model="article.content1"
                @imgAdd="$imgAdd"
              />
            </div>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button type="primary" @click="doAddOrUpdateArticle">{{
            articleId ? "修改文章" : "新增文章"
          }}</el-button>
          <el-button @click="goBack">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import Tinymce from '@/components/Tinymce'
import {
  addArticle,
  productArticle,
  updateArticle
} from '@/api/content/article/index'
import axios from 'axios'
import mix from '@/mixin/index'
export default {
  name: 'ArticleDetail',
  // 此处引入并注册了富文本标记组件
  components: {
    Tinymce
  },
  mixins: [mix],
  data() {
    const checkAge = (rule, value, callback) => {
      console.log(typeof value)
      if (!value) {
        return callback(new Error('请输入年龄'))
      }
      if (!Number.isInteger(value)) {
        return callback(new Error('请输入整数'))
      } else {
        if (value < 18) {
          return callback(new Error('年龄必须大于18岁'))
        } else {
          callback()
        }
      }
    }
    return {
      articleId: '',
      article: {
        editorType: 0,
        coverImg: ''
      },
      // 校验规则
      rules: {
        author: [
          { required: true, message: '请输入作者名称', trigger: 'blur' }
        ],
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        summary: [{ required: false, message: '请输入摘要', trigger: 'blur' }],
        age: [{ validator: checkAge, trigger: 'blur' }]
      }
    }
  },

  watch: {},
  created() {
    // 创建时获取当前文章id 若存在则调用 getArticleDetail 方法获取文章详情
    this.articleId = this.$route.params.id
    if (this.articleId) {
      // 修改
      this.getArticleDetail()
    }
  },
  mounted() {},
  methods: {
    // 获取文章详情
    async getArticleDetail() {
      const res = await productArticle(this.articleId)
      // 将返回值进行解构
      const { success, data, message } = res
      // 若 success 存在,则获取成功,赋值
      // 若不存在,则返回错误信息
      if (success) {
        this.article = data.productArticle
      } else {
        this.$message.error(message)
      }
    },
    // 封面图片上传前的校验
    beforeCoverImgUpload(file) {
      // const isImg = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/webp'
      // 校验上传文件是否是 jpg 和 png格式
      const reg = /^image\/(jpg|png)$/
      const isLt0dot5M = file.size / 1024 / 1024 < 0.5
      const isImg = reg.test(file.type)
      if (!isImg) {
        this.$message.error('上传头像图片只能是 jpg|png 格式!')
      }
      if (!isLt0dot5M) {
        this.$message.error('上传头像图片大小不能超过 1.5MB!')
      }
      // 返回 true 上传 否则不上传
      return isImg && isLt0dot5M
    },
    coverImgSucc(response) {
      const { success, data, message } = response
      if (success) {
        this.article.coverImg = data.fileUrl
        // 清除列表
        this.$refs.coverImgUplaod.clearFiles()
      } else {
        this.$message.error(message)
      }
    },
    editorTypeChange() {
      this.article.content1 = ''
    },
    // markdown 上传图片
    // 绑定@imgAdd event
    $imgAdd(pos, $file) {
      // 第一步.将图片上传到服务器.
      const formdata = new FormData()
      formdata.append('file', $file)
      axios({
        url: 'http://leju.bufan.cloud/lejuAdmin/material/uploadFileOss',
        method: 'post',
        data: formdata,
        headers: this.token
      }).then((res) => {
        // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
        /**
         * $vm 指为mavonEditor实例，可以通过如下两种方式获取
         * 1. 通过引入对象获取: `import {mavonEditor} from ...` 等方式引入后，`$vm`为`mavonEditor`
         * 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
         */
        const { success, data, message } = res.data
        if (success) {
          // $vm.$img2Url(pos, )
          this.$refs.mavonEditorRef.$img2Url(pos, data.fileUrl)
        } else {
          this.$message.error(message)
        }
      })
    },
    async doAddOrUpdateArticle() {
      let api = null
      if (this.articleId) {
        // 修改
        api = updateArticle
      } else {
        // 新增
        api = addArticle
      }
      if (this.article.editorType === 0) {
        this.article.content2 = this.article.content1
      } else {
        // markdown
        this.article.content2 = this.$refs.mavonEditorRef.d_render
      }

      // 对整个表单做校验
      this.$refs.articleForm.validate(async(valid) => {
        if (valid) {
          // 校验成功
          const res = await api(this.article)
          const { success, message } = res
          if (success) {
            // 跳转到文章列表
            this.$router.push({ name: 'Article' })
          } else {
            this.$message.error(message)
          }
        } else {
          // 校验失败
          this.$message.error('请注意表单校验！！！')
        }
      })
    },
    goBack() {
      this.$router.push({ name: 'Article' })
      this.$message.error('您点击了取消')
    }
  }
}
</script>
<style lang="scss" scoped></style>
