/* eslint-disable */
<template>
    <el-container>
        <el-main class="padding-small">
            <h4 class="part_title">查 询</h4>
            <el-form :model="queryForm" ref="queryForm" label-width="130px" status-icon>
                <el-row :gutter="20">
                    <el-col :span="10" :offset="2">
                        <el-form-item label="操作单号" prop="opt_order_no">
                            <el-input v-model="queryForm.opt_order_no" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="团号/订单号" prop="team_no">
                            <el-input v-model="queryForm.team_no" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20" v-if="showVisaType">
                    <el-col :span="10" :offset="2">
                        <el-form-item label="送签地" prop="visa_center_code">
                            <el-select v-model="queryForm.visa_center_code" placeholder="请选择" clearable>
                                <el-option v-for="item in visaCenterOptions" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="签证类型" prop="visa_type">
                            <el-select v-model="queryForm.visa_type" placeholder="请选择" clearable>
                                <el-option v-for="item in visaTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                 <el-row :gutter="20">
                    <el-col :span="10" :offset="2">
                        <el-form-item label="客人护照号" prop="passport_no">
                            <el-input v-model="queryForm.passport_no" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="客人姓名" prop="customer_name">
                            <el-input v-model="queryForm.customer_name" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="10" :offset="2">
                        <el-form-item label="操作状态" prop="opt_status">
                            <el-select v-model="queryForm.opt_status" placeholder="请选择" clearable>
                                <el-option v-for="item in optStatusOptions" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col style="text-align:right" :span="20" :offset="2">
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('queryForm')">查询</el-button>
                            <el-button v-on:click="resetForm('queryForm')">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <h4 class="part_title">列 表</h4>
            <el-table :data="optOrderList" border header-cell-class-name="table-head-th" :row-key="getRowKeys"
                      :expand-row-keys="expandsRow" @expand-change="GetDetails">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-table :data="props.row.customerList" border header-cell-class-name="table-head-th">
                            <!--<el-table-column align="center" type="index" label="序号" width="60">-->
                            <!--</el-table-column>-->
                            <el-table-column align="center" prop="customer_name" label="客人姓名">
                            </el-table-column>
                            <el-table-column align="center" prop="passport_no" label="护照号">
                            </el-table-column>
                            <el-table-column align="center" prop="customer_status" label="客人状态">
                            </el-table-column>
                            <el-table-column align="center" prop="case_code" label="M码">
                            </el-table-column>
                            <el-table-column align="center" prop="fill_user" label="填表人">
                            </el-table-column>
                            <el-table-column align="center" prop="fill_time" label="填表时间">
                            </el-table-column>
                            <el-table-column align="center" prop="fill_status" label="填表状态">
                            </el-table-column>
                            <el-table-column align="center" label="操作" width="160">
                                <template slot-scope="scope">
                                    <el-button size="small" plain type="primary" @click="handleInfoEdit(scope.$index, scope.row,props.row.enterprise_code,props.row.visa_order_no)">补录</el-button>
                                    <!--<el-button size="small" plain @click="handleInfoShow(scope.$index, scope.row)">查看</el-button>-->
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <!--<el-table-column align="center" label="序号" type="index">-->
                <!--</el-table-column>-->
                <el-table-column align="center" label="操作单号" prop="opt_order_no">
                </el-table-column>
                <el-table-column align="center" label="要证/出发日期" prop="leave_date" :formatter="formatRowDate">
                </el-table-column>
                <el-table-column align="center" label="团号/订单号" prop="team_no">
                </el-table-column>
                <el-table-column align="center" label="办签人数" prop="person_num">
                </el-table-column>
                <el-table-column align="center" label="国家" prop="country_name">
                </el-table-column>
                <el-table-column align="center" label="送签地" prop="visa_center_name">
                </el-table-column>
                <el-table-column align="center" label="签证类型" prop="visa_type_name">
                </el-table-column>
                <el-table-column align="center" label="操作状态" prop="opt_status_name">
                </el-table-column>
                <el-table-column width="180" label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" plain @click="handleOperEdit(scope.$index, scope.row)">维护操作单信息</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.page_num" :page-sizes="[page.page_size]" layout="total, sizes, prev, pager, next" :total="page.total" style="padding:10px;text-align:right">
            </el-pagination>
        </el-main>
    </el-container>
</template>
<style scoped lang="scss">
.el-main {
    /*margin: 0 1rem 2rem;*/
    background-color: #ffffff;
    color: #333;
    text-align: center;
    // line-height: 160px;
}
.el-select {
    width: 100%;
}
.el-table {
    width: 100%;
    line-height: 1.9rem;
}
.el-table__expanded-cell {
    background: #f9f9dd;
}

.el-table__expanded-cell:hover {
    background-color: #f9f9dd !important;
}

.el-table--enable-row-hover
    .el-table__body
    tr:hover
    > .el-table__expanded-cell {
    background: #f9f9dd;
}
</style>

<script>
  /* eslint-disable */
  import { getCountry, getDict, getDetails, getVisaType, getVisaCenter, optOrderList } from '@/api/VisaList'
  export default {
    data() {
      return {
        optOrderList: [],
        page: {
          page_num: 1,
          page_size: 10,
          total: 0
        },
        queryForm: {
          opt_order_no: '',
          team_no: '',
          country_code: this.$route.query['country_code'],
          visa_type: '',
          visa_center_code: '',
          opt_status: '',
          passport_no: '',
          customer_name: '',
          page_num: 1,
          page_size: 10
        },
        optStatusOptions: [],
        visaTypeOptions: [],
        visaCenterOptions: [],
        visaCountryOptions: [],
        // 获取row的key值
        getRowKeys(row) {
          return row.opt_order_no
        },
        expandsRow: []
      }
    },
    computed: {
      showVisaType: function() {
        const country_code = this.queryForm.country_code
        this.GetVisaType(country_code)
        this.GetVisaCenter(country_code)
        return !!country_code
      }
    },
    methods: {
      optOrderListFn() {
        const paramsObj = Object.assign({}, this.queryForm)
        optOrderList(paramsObj).then((res) => {
          !res.data ? '' : this.$set(this.$data, 'optOrderList', res.data.list)
          this.$set(this.$data, 'page', res.data.page)
          this.$set(this.queryForm, 'page_num', res.data.page.page_num)
          this.$set(this.queryForm, 'page_size', res.data.page.page_size)
        }).catch((err) => {
          console.log(err)
        })
      },
      submitForm(formName) {
        this.$set(this.$data, 'expandsRow', [])//    闭合所有已打开的操作单号下的内容
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.$set(this.queryForm, 'page_num', 1)
            this.optOrderListFn()
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      handleOperEdit(index, row) {
        this.$router.push({
          path: `/fillvisa/visaOper/${row.opt_order_no}`
        })
      },
      handleInfoEdit(index, row, enterpriseId, visaOrderNo) {
        this.$router.push({
          path: `/fillvisa/visaInfo/${enterpriseId}/${visaOrderNo}/${row.passport_no}`
        })
      },
      handleInfoShow(index, row, enterpriseId, visaOrderNo) {
        this.$router.push({
          path: `/fillvisa/visaInfo/${enterpriseId}/${visaOrderNo}/${row.passport_no}`
        })
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
        this.$set(this.queryForm, 'page_size', val)
        this.optOrderListFn()
      },
      handleCurrentChange(val) {
        this.$set(this.queryForm, 'page_num', val)
        this.optOrderListFn()
      },
      GetDetails(row, expandRows) {
        this.expandsRow[0] === row.opt_order_no ? this.$set(this.$data, 'expandsRow', []) : this.$set(this.$data, 'expandsRow', [row.opt_order_no])
        if (expandRows.indexOf(row) >= 0) {
          // this.$axios.get(window.API_ROOT + 'rest/customer.list.query/v1', { params: { opt_order_no: row.opt_order_no }})
          getDetails(row.opt_order_no).then(resp => {
            // !resp.data ? '' : row.customerList = resp.data;
            //  此处最好不要覆盖customerList下的数据，现在没有双向绑定，所以视图没有变化，但是数据已变，有更好的方法处理
            !resp.data ? '' : resp.data.opt_order_no = row.opt_order_no
            this.$set(row, 'customerList', resp.data.list)
          })
        }
      },
      GetCountry() {
        return getCountry()
      },
      GetDict(dict_type) {
        return getDict(dict_type)
      },
      GetVisaType(country_code) {
        this.queryForm.visa_type = ''
        return getVisaType(country_code).then(visaTypeResp => {
          this.visaTypeOptions = !visaTypeResp.data ? [] : visaTypeResp.data.map(item => { return { label: item.visa_type_name, value: item.visa_type } })
        })
      },
      GetVisaCenter(country_code) {
        this.queryForm.visa_center_code = ''
        return getVisaCenter(country_code).then(visaCenterResp => {
          this.visaCenterOptions = !visaCenterResp.data ? [] : visaCenterResp.data.map(item => { return { label: item.visa_center_name, value: item.visa_center_code } })
        })
      },
      expandsRowOpt() {
        this.expandsRow.push()
      },
      // 格式row的日期
      formatRowDate(row) {
        return window.UtilObj.formatUnixTimestamp(row.leave_date, 'yyyy年MM月dd日')
      }
    },
    mounted() {
      this.optOrderListFn()
      this.$axios
      // .all([this.getDict('opt_status'), this.getVisaType(), this.getVisaCenter(),this.getCountry()])
        .all([this.GetDict('opt_status'), this.GetCountry()])
        // .then(this.$axios.spread((opeStatusResp, visaTypeResp, visaCenterResp,visaCountryResp) => {
        .then(this.$axios.spread((opeStatusResp, visaCountryResp) => {
          if (opeStatusResp['request']['responseURL'].indexOf('/toLogin') > -1 || visaCountryResp['request']['responseURL'].indexOf('/toLogin') > -1) {
            window.location.href = opeStatusResp['request']['responseURL']
          }
          // 操作状态
          this.optStatusOptions = !opeStatusResp.data ? [] : opeStatusResp.data.map(item => { return { label: item.value, value: item.code } })
          // 签证类型
          // this.visaTypeOptions = !visaTypeResp.data ? [] : visaTypeResp.data.map(item => { return { label: item.visa_type_name, value: item.visa_type } });
          // 签证中心
          // this.visaCenterOptions = !visaCenterResp.data ? [] : visaCenterResp.data.map(item => { return { label: item.visa_center_name, value: item.visa_center_code } });
          // 国家
          this.visaCountryOptions = !visaCountryResp.data ? [] : visaCountryResp.data
        })).catch((err) => {
        console.log(err)
      })
    },
    destroyed() {

    }
  }
</script>