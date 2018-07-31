<template>
  <el-container>
    <el-main class="padding-small" style="padding-bottom:80px;">
      <h4 class="part_title">订单信息</h4>
      <el-form :model="order" ref="order_form" label-width="130px" :rules="order_rule" status-icon>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="订单号" prop="visa_order_no">
              <el-input v-model="order.visa_order_no" placeholder="订单号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="团号" prop="team_no">
              <el-input v-model="order.team_no" placeholder="团号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="出行日期" prop="leave_date">
              <el-date-picker v-model="order.leave_date" align="center" type="date" placeholder="出行日期" :picker-options="leave_date_opt" value-format="timestamp" :style="{width: '100%'}" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="签证国家" prop="country_code">
              <el-select v-model="order.country_code" placeholder="请选择" filterable clearable :style="{width: '100%'}" @change="onSelectCountry">
                <el-option v-for="country in country_list" :key="country.country_code" :label="country.country_cn_name" :value="country.country_code" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="签证类型" prop="visa_type_code">
              <el-select v-model="order.visa_type_code" placeholder="请选择" filterable clearable :style="{width: '100%'}" >
                <el-option v-for="visa_type in visa_type_list" :key="visa_type.visa_type" :label="visa_type.visa_type_name" :value="visa_type.visa_type" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="送签地" prop="visa_center_code">
              <el-select v-model="order.visa_center_code" placeholder="请选择" filterable clearable :style="{width: '100%'}" >
                <el-option v-for="visa_center in visa_center_list" :key="visa_center.visa_center_code" :label="visa_center.visa_center_name" :value="visa_center.visa_center_code" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="联系人" prop="contactor">
              <el-input v-model="order.contactor" placeholder="联系人" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号" prop="contactor_phone">
              <el-input v-model.number="order.contactor_phone" placeholder="手机号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="办签人数">
              <el-input :value="this.customers.length" readonly="true" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
        <el-col :span="24">
            <el-form-item label="备注" prop="memo">
              <el-input v-model="order.memo" placeholder="备注" type="textarea" :rows="3" max="150" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col style="text-align:right" :span="22" :offset="1">
            <el-form-item>
              <el-button type="primary" @click="updateOrder('order_form')">保存</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <h6 class="part_title" style="line-height: 2rem; background-color: #69c0f9;">办签人信息</h6>
      <el-table :data="customers" border header-cell-class-name="table-head-th" ref="order_table">
        <el-table-column align="center" type="index" width="42px" :index="indexMethod" />
        <el-table-column align="center" label="姓名" prop="full_name" />
        <el-table-column align="center" label="性别" prop="sex" />
        <el-table-column align="center" label="出生日期" prop="birthday" :formatter="dateFormatter"/>
        <el-table-column align="center" label="护照号" prop="passport_no" />
        <el-table-column align="center" label="手机号" prop="phone" />
        <el-table-column align="center" label="补录状态" prop="customer_fill_state_name" />
        <el-table-column align="center" width="150" label="操作">
          <template slot-scope="{row}">
            <el-button @click="deleteCustomer(row)" type="danger" v-if="row.customer_fill_state != '3'" icon="el-icon-delete" size="small" circle />
          </template>
        </el-table-column>
      </el-table>
      <el-button @click="addCustomer" size="mini" type="primary" icon="el-icon-edit" style="margin-top: 8px;" v-if="isVaildOrder">添加客人</el-button>
      <div class="div_submit" v-if="isVaildOrder">
        <el-popover placement="top" trigger="click">
          <div>
            <img :src="qrcodePath" />
          </div>
          <el-button @click="updateQrcodePath" icon="el-icon-edit" size="large" slot="reference" type="primary">修改办签人信息</el-button>
        </el-popover>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { getConutryList, getVisaType, getVisaCenter } from '@/api/DictionaryTool'
import OrderAPI from '@/api/OrderAPI'
import { Base64 } from 'js-base64'

export default {
  props: [],
  computed: {
    isVaildOrder() {
      return this.customers.length < 50 && this.order.leave_date > new Date().getTime()
    }
  },
  data() {
    return {
      order: {},
      qrcodePath: '',
      country_list: [],
      visa_type_list: [],
      visa_center_list: [],
      customers: [],
      order_rule: {
        visa_order_no: [{ required: true, message: '必填，不能为空', trigger: 'blur' }],
        leave_date: [{ required: true, message: '必填，不能为空', trigger: 'blur' }],
        country_code: [{ required: true, message: '必填，不能为空', trigger: 'blur' }],
        visa_type_code: [{ required: true, message: '必填，不能为空', trigger: 'blur' }],
        visa_center_code: [{ required: true, message: '必填，不能为空', trigger: 'blur' }],
        contactor: [{ required: true, message: '必填，不能为空', trigger: 'blur' }],
        contactor_phone: [{ required: true, message: '必填，不能为空', trigger: 'blur' }]
      },
      leave_date_opt: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        },
        shortcuts: [{
          text: '明天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '一周后',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }, {
          text: '一月后',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 30)
            picker.$emit('pick', date)
          }
        }, {
          text: '两月后',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 30 * 2)
            picker.$emit('pick', date)
          }
        }]
      }
    }
  },
  methods: {
    dateFormatter(row, column, cellVal) {
      if (cellVal) {
        return window.UtilObj.formatUnixTimestamp(cellVal, 'yyyy年MM月dd日')
      }
    },
    addCustomer() {
      const newCustomerName = '客人'
      OrderAPI.enterpriseAddCustomer({
        order_id: this.order.dbid,
        full_name: newCustomerName
      }).then(resp => {
        if (resp.status === 200) {
          const customer = resp.data
          this.customers.push(customer)
        }
      })
    },
    deleteCustomer(row) {
      if (this.customers.length > 1) {
        this.$confirm('请确认是否删除此订单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          OrderAPI.enterpriseDeleteCustomer(row.dbid).then(resp => {
            if (resp.status === 200) {
              if (resp.data['code'] === '10000') {
                this.customers.splice(this.customers.indexOf(row), 1)
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
              }
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '删除操作已取消'
          })
        })
      } else {
        this.$alert('订单需至少保留1位客人', '操作提示', {
          confirmButtonText: '确定'
        })
      }
    },
    updateQrcodePath() {
      OrderAPI.enterpriseOrderQr({ order_id: this.$route.params['order_id'] }).then(QrcodeResp => {
        if (QrcodeResp.data) {
          this.qrcodePath = QrcodeResp.data
        }
      })
    },
    updateOrder() {
      const order = this.order

      this.$refs['order_form'].validate(result => {
        if (result) {
          OrderAPI.editEnterpriseOrder({
            dbid: order.dbid,
            visa_order_no: order.visa_order_no,
            team_no: order.team_no,
            leave_date: order.leave_date,
            country_code: order.country_code,
            visa_type_code: order.visa_type_code,
            visa_center_code: order.visa_center_code,
            contactor: order.contactor,
            contactor_phone: order.contactor_phone,
            memo: order.memo
          }).then(resp => {
            if (resp.status === 200) {
              this.$message({
                message: '订单修改成功',
                type: 'success'
              })
            }
          })
        }
      })
    },
    indexMethod(idx) {
      return idx + 1
    },
    showLabel(list, val, labelName, valueName) {
      if (list && val) {
        const selectItem = list.find(item => item[valueName] === val)
        return selectItem ? selectItem[labelName] : ''
      }
    },
    formatDate(date) {
      return date ? window.UtilObj.formatUnixTimestamp(date.getTime(), 'yyyy年MM月dd日') : ''
    },
    onSelectCountry(country_code) {
      if (country_code) {
        Promise.all([getVisaType(country_code), getVisaCenter(country_code)]).then(([VisaTypeList, VisaCenterList]) => {
          this.visa_type_list = VisaTypeList.data
          this.visa_center_list = VisaCenterList.data
        })
      }
    }
  },
  mounted() {
    Promise.all([OrderAPI.detailEnterpriseOrder(this.$route.params['order_id'])]).then(([OrderResp]) => {
      if (OrderResp.status === 200 && OrderResp.data && OrderResp.data.order_data) {
        this.order = { ...OrderResp.data.order_data }
        this.customers = OrderResp.data.customers
        Promise.all([getConutryList(), getVisaType(this.order.country_code), getVisaCenter(this.order.country_code)]).then(([CountryList, VisaTypeList, VisaCenterList]) => {
          this.country_list = CountryList.data
          this.visa_type_list = VisaTypeList.data
          this.visa_center_list = VisaCenterList.data
        })
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.div_submit {
  z-index: 9999;
  position: fixed!important;
  right: 42%;
  bottom: 0;
  text-align: center;
  padding-bottom: 16px;
}
</style>
