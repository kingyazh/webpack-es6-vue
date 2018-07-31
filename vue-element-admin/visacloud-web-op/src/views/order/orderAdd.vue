<template>
  <el-container>
    <el-main class="padding-small" style="padding-bottom:80px;">
      <h4 class="part_title">新增订单</h4>
      <el-table :data="order_list"  border header-cell-class-name="table-head-th" ref="order_table" size='mini'>
        <el-table-column align="center" type="index" width="36px" :index="indexMethod" />
        <el-table-column align="center" label="订单号" :render-header="redStar">
          <template slot-scope="{row, $index}">
            <el-input v-if="row.editable" v-model="row.visa_order_no" maxlength="40" :style="{width: '100%'}" />
            <span v-else>{{ row.visa_order_no }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="团号">
          <el-table-column align="center" label="以团为单位申请签证时填写">
            <template slot-scope="{row, $index}">
              <el-input v-if="row.editable" v-model="row.team_no" maxlength="40" :style="{width: '100%'}" />
              <span v-else>{{ row.team_no }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column align="center" label="签证国家" :render-header="redStar">
          <template slot-scope="{row, $index}">
            <el-select v-if="row.editable" v-model="row.country_code" placeholder="请选择" filterable clearable :style="{width: '100%'}" @change="onSelectCountry(row)">
              <el-option v-for="country in country_list" :key="country.country_code" :label="country.country_cn_name" :value="country.country_code" />
            </el-select>
            <span v-else>{{ showLabel(country_list, row.country_code, 'country_cn_name', 'country_code') }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="签证类型" :render-header="redStar">
          <template slot-scope="{row, $index}">
            <el-select v-if="row.editable" v-model="row.visa_type_code" placeholder="请选择" filterable clearable :style="{width: '100%'}">
              <el-option v-for="visa_type in row.view.visa_type_list" :key="visa_type.visa_type" :label="visa_type.visa_type_name" :value="visa_type.visa_type" />
            </el-select>
            <span v-else>{{ showLabel(row.view.visa_type_list, row.visa_type_code, 'visa_type_name', 'visa_type') }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="送签地" :render-header="redStar">
          <template slot-scope="{row, $index}">
            <el-select v-if="row.editable" v-model="row.visa_center_code" placeholder="请选择" filterable clearable :style="{width: '100%'}" >
              <el-option v-for="visa_center in row.view.visa_center_list" :key="visa_center.visa_center_code" :label="visa_center.visa_center_name" :value="visa_center.visa_center_code" />
            </el-select>
            <span v-else>{{ showLabel(row.view.visa_center_list, row.visa_center_code, 'visa_center_name', 'visa_center_code') }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="出行日期" :render-header="redStar" >
          <template slot-scope="{row, $index}">
            <el-date-picker v-if="row.editable" v-model="row.leave_date" align="center" type="date" placeholder="出行日期" :picker-options="leave_date_opt" :style="{width: '100%'}" clearable />
            <span v-else>{{ formatDate(row.leave_date) }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="联系人" :render-header="redStar" >
          <template slot-scope="{row, $index}">
            <el-input v-if="row.editable" v-model="row.contactor" maxlength="10" :style="{width: '100%'}" />
            <span v-else>{{ row.contactor }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="联系人手机号" :render-header="redStar">
          <template slot-scope="{row, $index}">
            <el-input v-if="row.editable" v-model.number="row.contactor_phone" maxlength="16" :style="{width: '100%'}" />
            <span v-else>{{ row.contactor_phone }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="办签人数" :render-header="redStar">
          <template slot-scope="{row, $index}">
            <el-input-number v-if="row.editable" v-model="row.customer_number" :style="{width: '100%'}" :controls="false" :max="50" :min="1" />
            <span v-else>{{ row.customer_number }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注" show-overflow-tooltip>
          <template slot-scope="{row, $index}">
            <el-input v-if="row.editable" v-model="row.memo" maxlength="64" :style="{width: '100%'}" />
            <span v-else>{{ row.memo }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="126px" label="操作">
          <template slot-scope="{row, $index}">
            <el-button @click="row.editable = true" type="warning" size="mini" icon="el-icon-edit" v-if="!row.editable" circle />
            <el-button @click="row.editable = false" type="success" size="mini" icon="el-icon-check" v-else-if="order_list.length > $index + 1" circle />
            <el-button @click="delRow(row)" type="danger" size="mini" icon="el-icon-delete" v-if="order_list.length > 1" circle />
          </template>
        </el-table-column>
      </el-table>
      <el-button @click="addRow" size="mini" type="primary" icon="el-icon-edit" style="margin-top: 8px;" v-if="this.order_list.length < 30">继续添加</el-button>
      <el-row :gutter="24">
        <el-col :span="2" :offset="11" class="div_submit">
          <el-button @click="submitOrder" size="large" type="success">全部保存</el-button>
        </el-col>
      </el-row>
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
      order_list: [
        { customer_number: 1, view: {}, editable: true }
      ],
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
      },
      country_list: []
    }
  },
  methods: {
    showLabel(list, val, labelName, valueName) {
      if (list && val) {
        const selectItem = list.find(item => item[valueName] === val)
        return selectItem ? selectItem[labelName] : ''
      }
    },
    redStar(h, { column, $index }) {
      return h('span', [
        h('span', { 'style': { 'color': 'red', 'font-size': '18px' }}, '*'),
        h('span', column.label)
      ])
    },
    // teamNoMemoRender(h, { column, $index }) {
    //   console.log(column)
    //   return h('div', { 'style': { 'line-height': '25px' }}, [
    //     h('div', { 'style': { 'line-height': '12px' }}, column.label),
    //     h('div', { 'style': { 'line-height': '12px' }}, '以团为单位申请签证时填写')
    //   ])
    // },
    indexMethod(idx) {
      return idx + 1
    },
    onSelectCountry(row) {
      if (row.country_code) {
        Promise.all([getVisaType(row.country_code), getVisaCenter(row.country_code)]).then(([VisaTypeList, VisaCenterList]) => {
          this.$set(row.view, 'visa_type_list', VisaTypeList.data)
          this.$set(row.view, 'visa_center_list', VisaCenterList.data)
        })
      }
    },
    addRow() {
      if (this.vaildateRow(this.order_list[this.order_list.length - 1])) {
        this.order_list[this.order_list.length - 1].editable = false
        this.order_list.push({ customer_number: 1, view: { }, editable: true })
      }
    },
    delRow(row) {
      const that = this
      this.$confirm('请确认是否删除此订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.order_list.splice(that.order_list.indexOf(row), 1)
        that.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        that.$message({
          type: 'info',
          message: '删除操作已取消'
        })
      })
    },
    vaildateRow(row) {
      console.log(row)
      if (!row.visa_order_no) {
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
      } else if (!row.contactor) {
        this.$alert('联系人不能为空', '错误信息', { type: 'error' })
        return false
      } else if (!(row.contactor_phone && (/^1\d{10}$/.test(row.contactor_phone)))) {
        this.$alert('联系人手机号不正确', '错误信息', { type: 'error' })
        return false
      } else if (!row.customer_number) {
        this.$alert('办签人数不能为空', '错误信息', { type: 'error' })
        return false
      }
      return true
    },
    formatDate(date) {
      return date ? window.UtilObj.formatUnixTimestamp(date.getTime(), 'yyyy年MM月dd日') : ''
    },
    submitOrder() {
      let isOk = true
      // 校验每一行数据是否有效
      this.order_list.forEach(row => {
        if (isOk) {
          isOk = isOk && this.vaildateRow(row)
        }
      })

      if (isOk) {
        const param = []
        if (this.order_list && this.order_list.length > 0) {
          this.order_list.forEach(order => {
            const leave_date = order.leave_date ? order.leave_date.getTime() : null
            param.push({
              order_data: {
                visa_order_no: order.visa_order_no,
                team_no: order.team_no,
                country_code: order.country_code,
                visa_type_code: order.visa_type_code,
                visa_center_code: order.visa_center_code,
                leave_date,
                contactor: order.contactor,
                contactor_phone: order.contactor_phone,
                memo: order.memo
              },
              customer_num: order.customer_number
            })
          })

          OrderAPI.addEnterpriseOrder(param).then(resp => {
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

              const that = this
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
        }
      }
    }
  },
  mounted() {
    getConutryList().then((resp) => {
      this.country_list = resp.data
    })
  }
}
</script>

<style lang="scss" scoped>
.div_submit {
  z-index: 9999;
  position: fixed!important;
  bottom: 0;
  text-align: center;
  right: 40%;
  margin: 16px;
}
</style>
