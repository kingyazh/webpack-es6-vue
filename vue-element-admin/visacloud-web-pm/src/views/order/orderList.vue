<template>
  <el-container>
    <el-main class="padding-small">
      <h4 class="part_title">查 询</h4>
      <el-form :model="queryForm" ref="search_order" label-width="130px" status-icon>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="订单号" prop="visa_order_no">
              <el-input v-model="queryForm.visa_order_no" placeholder="" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="团号" prop="team_no">
              <el-input v-model="queryForm.team_no" placeholder="" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="护照号" prop="passport_no">
              <el-input v-model="queryForm.passport_no" placeholder="" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="签证国家" prop="country_code">
              <el-select v-model="queryForm.country_code" placeholder="请选择" filterable clearable :style="{width: '100%'}" @change="onSelectCountry">
                <el-option label="全部" value="" />
                <el-option v-for="country in country_list" :key="country.country_code" :label="country.country_cn_name" :value="country.country_code" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="签证类型" prop="visa_type_code">
              <el-select v-model="queryForm.visa_type_code" placeholder="请选择" filterable clearable :style="{width: '100%'}" >
                <el-option label="全部" value="" />
                <el-option v-for="visa_type in visa_type_list" :key="visa_type.visa_type" :label="visa_type.visa_type_name" :value="visa_type.visa_type" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="送签地" prop="visa_center_code">
              <el-select v-model="queryForm.visa_center_code" placeholder="请选择" filterable clearable :style="{width: '100%'}" >
                <el-option label="全部" value="" />
                <el-option v-for="visa_center in visa_center_list" :key="visa_center.visa_center_code" :label="visa_center.visa_center_name" :value="visa_center.visa_center_code" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col style="text-align:right" :span="20" :offset="1">
            <el-form-item>
              <el-button type="primary" @click="submitForm">查询</el-button>
              <el-button v-on:click="resetForm('search_order')">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <h4 class="part_title">列 表</h4>
      <el-row class="system_operate">
        <el-button type="primary" @click="toAddOrder">新增订单</el-button>
        <el-button type="primary" @click="toImportOrder">导入订单</el-button>
        <el-button type="primary" @click="deleteOrder">删除订单</el-button>
      </el-row>

      <el-table :data="order_list" border header-cell-class-name="table-head-th" :row-key="getRowKeys" ref="order_table" @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" />
        <el-table-column align="center" label="订单号" prop="visa_order_no" />
        <el-table-column align="center" label="团号" prop="team_no" />
        <el-table-column align="center" label="签证国家" prop="country_name" />
        <el-table-column align="center" label="签证类型" prop="visa_type_name" />
        <el-table-column align="center" label="送签地" prop="visa_center_name" />
        <el-table-column align="center" label="联系人" prop="contactor" />
        <el-table-column align="center" label="联系人手机号" prop="contactor_phone" />
        <el-table-column align="center" label="办签人数" prop="customer_number" :formatter="personFormatter" />
        <el-table-column align="center" label="创建人" prop="insert_user" />
        <el-table-column align="center" label="创建时间" prop="insert_date" :formatter="formatRowDate" />
        <el-table-column align="center" width="150" label="操作">
          <template slot-scope="scope">
            <el-button @click="showDetail(scope.row)" type="text" size="small">查看办签人</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="handleCurrentChange" :current-page="page.page_num" :page-sizes="[page.page_size]" layout="total, sizes, prev, pager, next" :total="page.total" style="padding:10px;text-align:right" />
    </el-main>
  </el-container>
</template>

<script>
import { getConutryList, getVisaType, getVisaCenter } from '@/api/DictionaryTool'
import OrderAPI from '@/api/OrderAPI'
export default {
  props: [],
  data() {
    return {
      queryForm: {
        visa_order_no: '',
        team_no: '',
        passport_no: '',
        country_code: '',
        visa_type_code: '',
        visa_center_code: ''
      },
      page: {
        page_num: 1,
        page_size: 10,
        total: 0
      },
      order_list: [],
      country_list: [],
      visa_type_list: [],
      visa_center_list: [],
      multipleSelection: []
    }
  },
  methods: {
    personFormatter(row) {
      return row.customer_number + ' (未完成:' + row.undone_number + ')'
    },
    handleCurrentChange(currentRow, oldCurrentRow) {
      this.page.page_num = currentRow
      this.submitForm()
    },
    handleSelectionChange(rows) {
      this.multipleSelection = rows
    },
    getRowKeys(row) {
      // console.log(row)
    },
    formatRowDate(row) {
      return window.UtilObj.formatUnixTimestamp(row.insert_date, 'yyyy年MM月dd日')
    },
    submitForm() {
      OrderAPI.getOrderList({
        page_num: this.page.page_num,
        page_size: this.page.page_size,
        visa_order_no: this.queryForm.visa_order_no,
        team_no: this.queryForm.team_no,
        passport_no: this.queryForm.passport_no,
        country_code: this.queryForm.country_code,
        visa_type_code: this.queryForm.visa_type_code,
        visa_center_code: this.queryForm.visa_center_code
      }).then((resp) => {
        this.order_list = resp.data.list
        this.page = resp.data.page
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    onSelectCountry(country_code) {
      Promise.all([getVisaType(country_code), getVisaCenter(country_code)]).then(([VisaTypeList, VisaCenterList]) => {
        this.visa_type_list = VisaTypeList.data
        this.visa_center_list = VisaCenterList.data
      })
    },
    showDetail(row) {
      this.$router.push({ path: '/OrderManage/detail/' + row.dbid })
    },
    deleteOrder() {
      if (this.multipleSelection) {
        const rows = []
        this.multipleSelection.forEach(row => {
          rows.push(row.dbid)
        })
        const that = this

        this.$confirm('此操作将永久删除所选订单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          OrderAPI.deleteEnterpriseOrder(rows).then(resp => {
            if (resp.status === 200) {
              this.$alert('订单删除成功！', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  that.submitForm()
                }
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '删除操作已取消'
          })
        })
      }
    },
    toAddOrder() {
      this.$router.push({ name: 'OrderAdd' })
    },
    toImportOrder() {
      this.$router.push({ name: 'OrderImport' })
    }
  },
  mounted() {
    getConutryList().then(resp => {
      this.country_list = resp.data
    })
    this.submitForm()
  }

}
</script>
