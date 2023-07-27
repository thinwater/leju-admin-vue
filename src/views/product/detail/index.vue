<template>
  <div class="detail-main">
    <el-steps :active="step" finish-status="success">
      <el-step title="商品基本信息" />
      <el-step title="添加库存信息" />
      <el-step title="添加移动端详情" />
    </el-steps>

    <!-- 大表单 -->
    <el-card shadow="never" class="margin-30">
      <el-form ref="form" :model="product" :rules="rules" label-width="80px" size="mini">
        <div v-show="step === 1">
          <div class="common-title">
            <h6 class="title">基本信息</h6>
            <el-divider />
          </div>
          <el-row :gutter="20">
            <el-col :span="8" :offset="0">
              <el-form-item label="商品名称" prop="name">
                <el-input v-model="product.name" />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0">
              <el-form-item label="商品编码" prop="productSn">
                <el-input v-model="product.productSn" />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0">
              <el-form-item label="商品分类" prop="productCategory">
                <el-select v-model="product.productCategoryId" clearable>
                  <el-option
                    v-for="item in categoryList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8" :offset="0">
              <el-form-item label="商品品牌" prop="brand">
                <el-select v-model="product.brandId" clearable>
                  <el-option
                    v-for="item in brandList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="common-title">
            <h6 class="title">商品属性</h6>
            <el-divider />
          </div>
          <el-row :gutter="20">
            <el-col :span="8" :offset="0">
              <el-form-item label="商品原价">
                <el-input-number
                  v-model="product.originalPrice"
                  style="width: 100%"
                  size="mini"
                  :controls="true"
                  controls-position="both"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0">
              <el-form-item label="促销类型">
                <!-- // 促销类型：
                0->没有促销使用原价;1->使用促销价；2->使用会员价；3->使用阶梯价格；4->使用满减价格；5->限时购 ,
                'promotionType': 0, -->
                <el-select
                  v-model="product.promotionType"
                  disabled
                  style="width: 100%"
                  placeholder="促销类型"
                  clearable
                >
                  <el-option
                    v-for="item in promotionTypeList"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8" :offset="0" />
            <el-col :span="8" :offset="0" />
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8" :offset="0">
              <el-form-item label="审核状态">
                <!-- 'verifyStatus': 0, //  审核状态：0->未审核；1->审核通过 , -->
                <el-switch
                  v-model="product.verifyStatus"
                  :active-value="1"
                  :inactive-value="0"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0">
              <el-form-item label="上架状态">
                <!-- // 上架状态：0->下架；1->上架 ,'publishStatus': 0, -->
                <el-switch
                  v-model="product.publishStatus"
                  :active-value="1"
                  :inactive-value="0"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8" :offset="0">
              <el-form-item label="缩略图">
                <el-upload
                  class="avatar-uploader"
                  :action="uploadFileOss"
                  :show-file-list="false"
                  :on-success="handleCoverImgSuccess"
                  :headers="token"
                >
                  <img v-if="product.pic" :src="product.pic" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>

          <div class="common-title">
            <h6 class="title">其他信息</h6>
            <el-divider />
          </div>
          <el-row :gutter="20">
            <el-col :span="8" :offset="0" />
            <el-col :span="8" :offset="0" />
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8" :offset="0" />
            <el-col :span="8" :offset="0" />
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8" :offset="0">
              <el-form-item label="产品服务">
                <!--  //  以逗号分割的产品服务：1->无忧退货；2->快速退款；3->免费包邮 ,
    'serviceIds': 'string', // 1,2 -->
                <el-checkbox-group v-model="product.serviceIds">
                  <el-checkbox label="1" name="type">无忧退货</el-checkbox>
                  <el-checkbox label="2" name="type">快速退款</el-checkbox>
                  <el-checkbox label="3" name="type">免费包邮</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-show="step === 2">
          <div class="common-title">
            <h6 class="title">商品sku信息</h6>
            <el-divider />
          </div>
          <el-row :gutter="20">
            <el-col :span="8" :offset="0">
              <el-form-item label="标题" prop="detailTitle">
                <el-input
                  v-model="product.detailTitle"
                  placeholder="标题"
                  size="mini"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item label="副标题">
                <el-input
                  v-model="product.detailDesc"
                  placeholder="副标题"
                  size="mini"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24" :offset="0">
              <el-form-item label="画册图片">
                <el-upload
                  ref="albumPicsRef"
                  :action="uploadFileOss"
                  list-type="picture-card"
                  :headers="token"
                  :on-success="albumPicsUploadSuccess"
                  :file-list="albumPicList"
                >
                  <i slot="default" class="el-icon-plus" />
                  <div slot="file" slot-scope="{ file }">
                    <img
                      class="el-upload-list__item-thumbnail"
                      :src="file.url"
                      alt=""
                    >
                    <span class="el-upload-list__item-actions">
                      <span
                        class="el-upload-list__item-preview"
                        @click="handlePictureCardPreview(file)"
                      >
                        <i class="el-icon-zoom-in" />
                      </span>
                      <span
                        v-if="!disabled"
                        class="el-upload-list__item-delete"
                        @click="handleDownload(file)"
                      >
                        <i class="el-icon-download" />
                      </span>
                      <span
                        v-if="!disabled"
                        class="el-upload-list__item-delete"
                        @click="handleRemove(file)"
                      >
                        <i class="el-icon-delete" />
                      </span>
                    </span>
                  </div>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="sku设置">
                <div v-show="tempSkuColor.arr.length">
                  <span>颜色：</span>
                  <el-checkbox-group
                    v-model="tempSkuColor.selectedArr"
                    style="display: inline"
                  >
                    <el-checkbox
                      v-for="item in tempSkuColor.arr"
                      :key="item"
                      :label="item"
                    >
                      {{ item }}
                      <el-button
                        type="text"
                        style="color: red; margin-left: 10px"
                        size="mini"
                        @click="removeOption('color',item)"
                      >删除</el-button>
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
                <div v-show="tempSkuSize.arr.length">
                  <span>大小：</span>
                  <el-checkbox-group
                    v-model="tempSkuSize.selectedArr"
                    style="display: inline"
                  >
                    <el-checkbox
                      v-for="item in tempSkuSize.arr"
                      :key="item"
                      :label="item"
                    >
                      {{ item }}
                      <el-button
                        type="text"
                        style="color: red; margin-left: 10px"
                        size="mini"
                        @click="removeOption('size', item)"
                      >删除</el-button>
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
                <el-input
                  v-model="tempSkuColor.text"
                  style="width: 220px"
                  placeholder="颜色描述：比如土豪金"
                  size="mini"
                  clearable
                />
                <el-button
                  type="default"
                  style="margin-left: 20px"
                  size="mini"
                  @click="createSkuOption('color')"
                >创建颜色选项</el-button>
                <el-input
                  v-model="tempSkuSize.text"
                  style="width: 220px; margin-left: 20px"
                  placeholder="大小描述：比如128g"
                  size="mini"
                  clearable
                />
                <el-button
                  type="default"
                  style="margin-left: 20px"
                  size="mini"
                  @click="createSkuOption('size')"
                >创建大小选项</el-button>
                <el-button
                  type="primary"
                  style="margin-left: 200px"
                  size="mini"
                  @click="buildSkuList"
                >生成SKU列表</el-button>
                <el-button
                  type="primary"
                  style="margin-left: 20px"
                  size="mini"
                >新增SKU</el-button>
                <!-- 表格 -->
                <el-table v-if="pmsSkuStockList.length" style="margin-top:10px;" :data="pmsSkuStockList" border stripe>
                  <el-table-column
                    fixed="left"
                    type="index"
                    align="center"
                    label="#"
                    width="50"
                  />
                  <el-table-column
                    align="center"
                    label="图片"
                    width="80"
                  >
                    <template slot-scope="scope">
                      <el-upload
                        :ref="`uploadSkuImg_${scope.row.tempId}`"
                        class="avatar-uploader"
                        :action="uploadFileOss"
                        :headers="token"
                        :on-success="handleSkuImgSuccess"
                        @click.native="uploadClickEvent(scope.row.tempId)"
                      >
                        <img v-if="scope.row.pic" width="40" height="40" :src="scope.row.pic">
                        <i v-else class="el-icon-plus avatar-uploader-icon2" />
                      </el-upload>
                    </template>
                  </el-table-column>

                  <el-table-column
                    align="center"
                    label="颜色"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.color" size="mini" clearable />
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    label="大小"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.size" size="mini" clearable />
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    label="库存"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.stock" size="mini" clearable />
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    label="预警库存"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.lowStock" size="mini" clearable />
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    label="锁定库存"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.lockStock" size="mini" clearable />
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    label="sku编码"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.skuCode" size="mini" clearable />
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    label="价格"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.price" size="mini" clearable />
                    </template>
                  </el-table-column>
                  <el-table-column
                    align="center"
                    label="销量"
                    width="200"
                  >
                    <template slot-scope="scope">
                      <el-input v-model="scope.row.sale" size="mini" clearable />
                    </template>
                  </el-table-column>
                  <el-table-column
                    fixed="right"
                    align="center"
                    label="操作"
                    width="200"
                  >
                    <template>
                      <el-button type="text" size="mini" style="color:red">删除</el-button>

                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>

            </el-col>
          </el-row>
        </div>
        <div v-show="step === 3">第三页</div>
      </el-form>
      <el-button
        v-if="step !== 1"
        type="default"
        size="mini"
        @click="preStep"
      >返回上一步</el-button>
      <el-button v-if="step !== 3" type="primary" size="mini" @click="nextStep">
        {{ step === 1 ? '下一步，填写库存信息' : '下一步，填写移动端详情' }}
      </el-button>
      <el-button v-else type="primary" size="mini" @click="doAddProductAndSkus">提交保存</el-button>
    </el-card>
  </div>
</template>
<script>
import productApi from '@/api/product/index'
// import { getAllCategory, findAllBrand, addProductAndSkus, productSkusDetail } from '@/api/product/index'
import mix from '@/mixin/index'
import { v4 as uuidv4 } from 'uuid'
export default {
  name: 'GoodsDetail',
  mixins: [mix],
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      step: 1,
      product: {
        pic: '',
        serviceIds: [],
        albumPics: []
      },
      categoryList: [],
      brandList: [],
      // 0->没有促销使用原价;1->使用促销价；2->使用会员价；3->使用阶梯价格；4->使用满减价格；5->限时购
      promotionTypeList: [
        {
          text: '没有促销使用原价',
          value: 0
        },
        {
          text: '使用促销价',
          value: 1
        },
        {
          text: '使用会员价',
          value: 2
        },
        {
          text: '使用阶梯价格',
          value: 3
        },
        {
          text: '使用满减价格',
          value: 4
        },
        {
          text: '限时购',
          value: 5
        }
      ],
      tempSkuColor: {
        text: '', // 绑定输入框
        arr: ['玫瑰红', '天空蓝', '土豪金'],
        selectedArr: ['玫瑰红', '天空蓝']
      },
      tempSkuSize: {
        text: '', // 绑定输入框
        arr: ['128g', '256g', '512g'],
        selectedArr: ['128g', '256g']
      },
      pmsSkuStockList: [],
      tempId: '',
      productId: '', // 作为编辑使用
      albumPicList: [], // 回显画册
      rules: {
        name: [{ required: true, message: '商品名称必填', trigger: 'blur' }],
        productSn: [{ required: true, message: '商品编码必填', trigger: 'blur' }],
        detailTitle: [{ required: true, message: '标题必填', trigger: 'blur' }],
        brand: [{ required: true, message: '商品品牌必填', trigger: 'blur' }],
        productCategory: [{ required: true, message: '商品分类必填', trigger: 'blur' }]
      },
      firstPageParams: ['name', 'productSn'],
      secondPageParams: ['detailTitle']
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getCategoryList()
    this.getAllBrandList()
    this.productId = this.$route.params.id
    if (this.productId) {
      this.getProductDetail()
    }
  },
  mounted() {},
  methods: {
    async getProductDetail() {
      const res = await productApi.productDetail(this.productId)
      const { success, data, message } = res
      if (success) {
        this.product = data.product
        // console.log(this.product.albumPics)
        this.product.albumPics = this.product.albumPics.split(',')

        this.pmsSkuStockList = data.skus
        this.product.albumPics.forEach(item => {
          this.albumPicList.push({
            name: item.substring(item.lastIndexOf('/') + 1),
            url: item
          })
        })
      } else {
        this.$message.error(message)
      }
    },
    async getCategoryList() {
      const res = await productApi.getAllCategory()
      const { success, data, message } = res
      if (success) {
        const item = data.items.find((item) => item.category.name === '乐居')
        if (item) {
          this.categoryList = item.children
        }
      } else {
        this.$message.error(message)
      }
    },
    async getAllBrandList() {
      const res = await productApi.findAllBrand()
      const { success, data, message } = res
      if (success) {
        this.brandList = data.items
      } else {
        this.$message.error(message)
      }
    },
    // 缩略图上传成功
    handleCoverImgSuccess(res) {
      const { success, data, message } = res
      if (success) {
        this.product.pic = data.fileUrl
      } else {
        this.$message.error(message)
      }
    },
    // 画册上传成功
    albumPicsUploadSuccess(res) {
      const { success, data, message } = res
      if (success) {
        this.product.albumPics.push(data.fileUrl)
        console.log('画册上传成功', this.product.albumPics)
      } else {
        this.$message.error(message)
      }
    },
    // 删除画册
    handleRemove(file) {
      console.log(file)
      // 1. albumPics 删除响应的数据
      // const url = this.product.albumPics.find(url => url === file.response.data.fileUrl)
      // if (url) {
      //   const index = this.product.albumPics.findIndex(url => url === file.response.data.fileUrl)
      //   this.product.albumPics.splice(index, 1)
      // }

      // 适合少量数据
      this.product.albumPics = this.product.albumPics.filter(
        (url) => url !== file.response.data.fileUrl
      )
      console.log(this.$refs.albumPicsRef)
      this.$refs.albumPicsRef.uploadFiles =
        this.$refs.albumPicsRef.uploadFiles.filter(
          (item) => item.uid !== file.uid
        )
    },
    // 预览画册
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 下载图片
    handleDownload(file) {
      console.log(file)
    },
    // 创建SKU 选项
    createSkuOption(type) {
      if (type === 'color') {
        if (this.tempSkuColor.text !== '') {
          if (this.tempSkuColor.arr.includes(this.tempSkuColor.text)) {
            this.$message.error(this.tempSkuColor.text + '已经存在！！！')
            return
          } else {
            this.tempSkuColor.arr.push(this.tempSkuColor.text)
            // 清空输入框
            this.tempSkuColor.text = ''
          }
        } else {
          this.$message.error('颜色描述不可以为空')
          return
        }
      } else {
        if (this.tempSkuSize.text !== '') {
          if (this.tempSkuSize.arr.includes(this.tempSkuSize.text)) {
            this.$message.error(this.tempSkuSize.text + '已经存在！！！')
            return
          } else {
            this.tempSkuSize.arr.push(this.tempSkuSize.text)
            // 清空输入框
            this.tempSkuSize.text = ''
          }
        } else {
          this.$message.error('大小描述不可以为空')
          return
        }
      }
    },
    // 删除SKU 选项
    removeOption(type, val) {
      if (type === 'color') {
        this.tempSkuColor.arr = this.tempSkuColor.arr.filter(
          (item) => item !== val
        )
        this.tempSkuColor.selectedArr = this.tempSkuColor.selectedArr.filter(
          (item) => item !== val
        )
      } else {
        this.tempSkuSize.arr = this.tempSkuSize.arr.filter(
          (item) => item !== val
        )
        this.tempSkuSize.selectedArr = this.tempSkuSize.selectedArr.filter(
          (item) => item !== val
        )
      }
    },
    // 构建SKU列表
    buildSkuList() {
      for (let i = 0; i < this.tempSkuColor.selectedArr.length; i++) {
        for (let j = 0; j < this.tempSkuSize.selectedArr.length; j++) {
          this.pmsSkuStockList.push({
            tempId: uuidv4(), // 9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d
            'lockStock': 10, // 锁定库存
            'lowStock': 30, // 库存警戒线
            'pic': '', // 图片
            'price': Math.floor(Math.random() * 10000), // 当前价格
            'promotionPrice': 0, // 单品促销价格
            'sale': 0, // 销量
            'skuCode': String(Math.floor(Math.random() * 10000)), // sku的编码,手动填写
            // spData:  [{"key":"颜色","value":"蓝色"},{"key":"容量","value":"32G"}]
            // 'spData': 'string', // sku属性，json格式String类型 ,
            color: this.tempSkuColor.selectedArr[i],
            size: this.tempSkuSize.selectedArr[j],
            'stock': 10000 // 库存
          })
        }
      }
    },
    // sku图片上传成功
    handleSkuImgSuccess(res) {
      const { success, data, message } = res
      if (success) {
        const item = this.pmsSkuStockList.find(item => item.tempId === this.tempId)
        if (item) {
          item.pic = data.fileUrl
          // 清除列表
          this.$refs['uploadSkuImg_' + this.tempId].clearFiles()
          this.tempId = ''
        }
      } else {
        this.$message.error(message)
      }
    },
    uploadClickEvent(tempId) {
      console.log('tempId==>', tempId)
      this.tempId = tempId
    },
    // 新增商品
    async doAddProductAndSkus() {
      // const pmsSkuStockListTemp = []
      console.log('pics', this.product.albumPics.join(','))
      console.log('sku', this.pmsSkuStockList)
      this.pmsSkuStockList.forEach(item => {
        // pmsSkuStockListTemp.push({
        //   ...item,
        //   spData: JSON.stringify([{ key: '颜色', value: item.color }, { key: '大小', value: item.size }])
        // })
        item.spData = JSON.stringify([{ key: '颜色', value: item.color }, { key: '大小', value: item.size }])
      })
      this.product.albumPics = this.product.albumPics.join(',')
      this.product.serviceIds = this.product.serviceIds.join(',')
      console.log('brandNae', this.brandList.find(item => item.id === this.product.brandId))
      this.product.brandName = this.brandList.find(item => item.id === this.product.brandId).name
      console.log('categoryList', this.categoryList)
      this.product.productCategoryName = this.categoryList.find(item => item.id === this.product.productCategoryId).name
      const params = {
        pmsSkuStockList: this.pmsSkuStockList,
        product: this.product
      }
      // 随便写了一个js 用于说明数据类型的
      var product = {
        'pmsSkuStockList': this.pmsSkuStockList,
        'product': {
          'albumPics': 'https://img10.360buyimg.com/n7/jfs/t1/117896/24/35680/30760/6481a804Fe1361d79/3b417b30b7e618d0.jpg,https://img12.360buyimg.com/n7/jfs/t1/212236/25/31381/63324/64818121F205b6682/c2c1aab13e67d770.jpg', // 画册图片，连产品图片限制为5张，以逗号分割 ,会在移动端商品详情页展示
          'brandId': '1661305802848333826', // 关联的 品牌id
          'brandName': '小米', // 品牌名称

          'description': '意式极简北欧轻奢卧室电视柜高款现代北欧储物柜小户',
          // detail是进入详情页展示的内容
          'detailDesc': '家具新品大赏：1件7.5折，2件7.2折，满额', // 副标题 家具新品大赏：1件7.5折，2件7.2折，满额在享2%现金返现，超值好礼送不停！时间：11.14-11.20

          'detailMobileHtml': '移动端展示方式,商品的富文本内容,放到', // 移动端展示方式,商品的富文本内容,放到这个字段
          'detailTitle': '电视柜 意式极简北欧轻奢卧室电视柜', // 标题 简野 电视柜 意式极简北欧轻奢卧室电视柜高款现代北欧储物柜小户型精品家具 卧室电视柜（两门）

          'keywords': '地中海,凳子', // 关键词,逗号分割,  地中海,凳子,xxx

          'name': '简野（JIANYE）ZY-22', // 商品名称 简野（JIANYE）ZY-22
          'newStatus': 1, // 新品状态:0->不是新品；1->新品 ,新品会在移动端首页推荐
          'note': '比如小舅子供货不入账 ,', // 备注,比如小舅子供货不入账 ,
          'originalPrice': 1111110, // 原价
          'pic': 'https://img10.360buyimg.com/n7/jfs/t1/174041/19/38465/61142/647098d1Fc922d653/1d6b63009f663fb9.jpg', // 封面图片
          'previewStatus': 1, // 是否为预告商品：0->不是；1->是 ,
          'price': 111110, // 当前价格

          'productCategoryId': '1308339256886423554', // 分类id
          'productCategoryName': '创意', // 分类名称
          'productSn': '3456566', // 商品编码,需要手填.
          // promotion都可以不填,可以通过营销管理处理
          // 促销类型：0->没有促销使用原价;1->使用促销价；2->使用会员价；3->使用阶梯价格；4->使用满减价格；5->限时购 ,
          'promotionType': 0,
          // 上架状态：0->下架；1->上架 ,
          'publishStatus': 1,
          // 推荐状态；0->不推荐；1->推荐 ,
          'recommendStatus': 1,
          // 销量,不用处理
          'sale': 0,
          //  以逗号分割的产品服务：1->无忧退货；2->快速退款；3->免费包邮 ,
          'serviceIds': '1,2', // 1,2
          'sort': 7777777, // 排序,降序.值越大越靠前
          'stock': 11111110, // 库存
          'subTitle': '级标题', // 二级标题
          'unit': '斤', // 单位,比如 斤/辆/台
          'verifyStatus': 1, //  审核状态：0->未审核；1->审核通过 ,
          'weight': 500 // 商品重量，默认为千克
        }
      }
      console.log(product)

      console.log('params==>', params)
      const res = await productApi.addProductAndSkus(product)
      const { success, message } = res
      if (success) {
        this.$router.push({ name: 'productList' })
      } else {
        this.$message.error(message)
      }
    },
    preStep() {
      this.step--
    },
    nextStep() {
      // 进入下一步前，做表单验证
      let valid_all = true // 要验证的字段是否都验证通过
      let valid_fileds = []
      if (this.step === 1) {
        valid_fileds = this.firstPageParams
      } else if (this.step === 2) {
        valid_fileds = this.secondPageParams
      }
      this.$refs.form.validateField(valid_fileds, (errMsg) => {
        if (errMsg) {
          valid_all = valid_all && false
        } else {
          valid_all = valid_all && true
        }
      })

      if (valid_all) { // 全部验证通过
        this.step++
      } else {
        this.$message.error('请注意表单验证！！！')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.detail-main {
  .el-steps {
    padding: 50px 300px;
    background-color: #fff;
  }
  .common-title {
    .title {
      font-size: 16px;
      font-weight: normal;
      margin: 0;
    }
    .el-divider {
      margin-top: 5px;
    }
  }
  // 文件缩略图
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar-uploader-icon2 {
    font-size: 28px;
    color: #8c939d;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
