<template>
  <div class="app-container">
    <upload-excel-component :on-success='handleSuccess' :before-upload="beforeUpload"></upload-excel-component>
    <div style="text-align: center; margin: 6px;">
      <span style="font-size: 8px; color: gray; text-decoration: underline"><a href='/public/order_import_template.xlsx'>模板下载</a></span>
    </div>
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;" :stripe="true" :show-overflow-tooltip="true" header-align="center">
      <el-table-column v-for='item of tableHeader' :prop="item" :label="item" :key='item' />
      <!-- 
      <el-table-column label="操作" v-if="tableHeader.length > 0">
      </el-table-column>
      -->
    </el-table>
    <div style="text-align: center; margin-top: 30px;">
      <el-button @click="submitAll" icon="el-icon-edit" size="large" type="primary">全部提交</el-button>
    </div>
  </div>
</template>

<script>
import UploadExcelComponent from './components/UploadExcel/index.vue'
import { getDict, getConutryList, getCityList } from '@/api/DictionaryTool'
import OrderAPI from '@/api/OrderAPI'

export default {
  name: 'uploadExcel',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: [],
      country_map: {},
      visa_type_map: {},
      city_map: {}
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: '上传的文件不能大于1M',
        type: 'warning'
      })
      return false
    },
    submitAll() {
      const data = []
      const that = this
      if (this.tableData && this.tableData.length > 0) {
        this.tableData.forEach(row => {
          data.push(that.randerRow(row))
        })
      }

      OrderAPI.addEnterpriseOrder(data).then(resp => {
        if (resp.status === 200) {
          const result = resp.data.result
          const succNum = result['success'] ? result['success'].length : 0
          const repetNum = result['repetition'] ? result['repetition'].length : 0
          const errorNum = result['error'] ? result['error'].length : 0

          let msg = '操作成功！'
          if (succNum > 0) {
            msg += succNum + '笔订单成功！'
          }
          if (repetNum > 0) {
            msg += repetNum + '笔订单重复已忽略！'
          }
          if (errorNum > 0) {
            msg += errorNum + '笔订单失败！'
          }

          this.$confirm(msg, '提示', {
            confirmButtonText: '继续添加',
            cancelButtonText: '返回列表',
            type: 'warning'
          }).then(() => {
            that.order_list = [{ customer_number: 1, view: {}, editable: true }]
          }).catch(() => {
            that.$router.push({ name: 'OrderManage' })
          })
        }
      })
    },
    handleSuccess({ results, header }) {
      if (results.length > 30) {
        this.$message({
          message: '一次不能导入超过30笔订单',
          type: 'error'
        })
        return false
      }

      const rows = []
      if (results) {
        results.forEach(result => {
          const country_code = this.country_map[result['签证国家']]
          result['签证国家'] = country_code ? result['签证国家'] : ''
          const visa_type_code = country_code + this.visa_type_map[result['签证类型']]
          result['签证类型'] = this.visa_type_map[result['签证类型']] ? result['签证类型'] : ''
          const visa_center_code = country_code + this.city_map[result['送签地']]
          result['送签地'] = this.city_map[result['送签地']] ? result['送签地'] : ''

          const leave_date = result['出行日期'] ? Date.parse(result['出行日期']) : ''

          rows.push({
            ...result,
            country_code,
            visa_type_code,
            visa_center_code,
            leave_date
          })
        })
      }

      console.log(rows)

      this.tableData = rows
      this.tableHeader = header
    },
    randerRow(row) {
      if (!row['订单号']) {
        this.$alert('订单号不能为空', '错误信息', { type: 'error' })
        return false
      } else if (!row.country_code) {
        this.$alert('签证国家不能为空', '错误信息', { type: 'error' })
        return false
      } else if (!row.visa_type_code) {
        this.$alert('签证类型不能为空', '错误信息', { type: 'error' })
        return false
      } else if (!row.visa_center_code) {
        this.$alert('送签地不能为空', '错误信息', { type: 'error' })
        return false
      } else if (!row.leave_date) {
        this.$alert('出行日期不能为空', '错误信息', { type: 'error' })
        return false
      } else if (!row['联系人']) {
        this.$alert('联系人不能为空', '错误信息', { type: 'error' })
        return false
      } else if (!row['联系人手机号']) {
        this.$alert('联系人手机号不正确', '错误信息', { type: 'error' })
        return false
      } else if (!row['办签人数']) {
        this.$alert('办签人数不能为空', '错误信息', { type: 'error' })
        return false
      }

      return {
        order_data: {
          visa_order_no: row['订单号'],
          team_no: row['团号'],
          country_code: row.country_code,
          visa_type_code: row.visa_type_code,
          visa_center_code: row.visa_center_code,
          leave_date: row.leave_date,
          contactor: row['联系人'],
          contactor_phone: row['联系人手机号'],
          memo: row['备注']
        },
        customer_num: row['办签人数']
      }
    }
  },
  mounted() {
    Promise.all([getConutryList(), getCityList(), getDict('visa_type_code')]).then(([CountryList, CityList, VisaTypeCodeList]) => {
      if (CountryList.status === 200) {
        CountryList.data.forEach(country => {
          this.country_map[country.country_cn_name] = country.country_code
        })
      }
      if (VisaTypeCodeList.status === 200) {
        VisaTypeCodeList.data.forEach(code => {
          this.visa_type_map[code.value] = code.code
        })
      }
      if (CityList.status === 200) {
        CityList.data.forEach(city => {
          this.city_map[city.city_name] = city.city_code
        })

        console.log(this.city_map)
      }
    })
  }
}
</script>
