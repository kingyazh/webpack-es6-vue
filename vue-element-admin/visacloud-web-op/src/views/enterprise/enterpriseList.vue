<template>
  <el-container>
    <el-main class="padding-small">
      <h4 class="part_title">查 询</h4>
      <el-form :model="queryForm" ref="search_enterprise" label-width="130px" status-icon>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="企业名称" prop="enterprise_name">
              <el-input v-model="queryForm.enterprise_name" placeholder="" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系人" prop="contact_name">
              <el-input v-model="queryForm.contact_name" placeholder="" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="queryForm.phone" placeholder="" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="申请日期">
              <el-date-picker style="width:100%"
                v-model="apply_date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="timestamp" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="审核状态" prop="review_state">
              <el-select v-model="queryForm.review_state" placeholder="请选择" filterable clearable :style="{width: '100%'}" >
                <el-option label="全部" />
                <el-option v-for="state in review_state_list" :key="state.value" :label="state.value" :value="state.code" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="版本" prop="version">
              <el-select v-model="queryForm.version" placeholder="请选择" filterable clearable :style="{width: '100%'}" >
                <el-option label="全部" />
                <el-option v-for="item in version_list" :key="item.value" :label="item.value" :value="item.code" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <el-col style="text-align:right" :span="21">
            <el-form-item>
              <el-button type="primary" @click="submitForm">查询</el-button>
              <el-button v-on:click="resetForm('search_enterprise')">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <h4 class="part_title">列 表</h4>
      <el-table :data="data_list" border header-cell-class-name="table-head-th" tooltip-effect="dark">
        <el-table-column align="center" label="序号" type="index" width="52px" />
        <el-table-column align="center" label="企业名称" prop="enterprise_name" />
        <el-table-column align="center" label="企业地址" prop="enterprise_addr" />
        <el-table-column align="center" label="联系人" prop="contact_name" />
        <el-table-column align="center" label="手机号" prop="phone" />
        <el-table-column align="center" label="邮箱" prop="email" />
        <el-table-column align="center" label="申请时间" prop="insert_date" :formatter="formatRowDate" />
        <el-table-column align="center" label="版本" prop="version_name" />
        <el-table-column align="center" label="审核状态" prop="review_state_name" />
      </el-table>
      <el-pagination @current-change="handleCurrentChange" :current-page="page.page_num" :page-sizes="[page.page_size]" layout="total, sizes, prev, pager, next" :total="page.total" style="padding:10px;text-align:right" />
    </el-main>
  </el-container>
</template>

<script>
import EnterpriseAPI from '@/api/EnterpriseAPI'
import { getDict } from '@/api/DictionaryTool'

export default {
  data() {
    return {
      queryForm: {},
      apply_date: [],
      data_list: [],
      version_list: [],
      review_state_list: [],
      page: { page_num: 1, page_size: 10, total: 0 }
    }
  },
  methods: {
    submitForm() {
      const params = { ...this.queryForm }
      if (this.apply_date && this.apply_date.length === 2) {
        params['insert_date_start'] = this.apply_date[0]
        params['insert_date_end'] = this.apply_date[1]
      }
      EnterpriseAPI.paginationEnterprise({ ...params, page_num: this.page.page_num, page_size: this.page.page_size }).then(resp => {
        if (resp.status === 200) {
          this.data_list = resp.data.list
          this.page = resp.data.page
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    formatRowDate(row) {
      return window.UtilObj.formatUnixTimestamp(row.insert_date, 'yyyy年MM月dd日')
    },
    handleCurrentChange(currentRow, oldCurrentRow) {
      this.page.page_num = currentRow
      this.submitForm()
    }
  },
  mounted() {
    Promise.all([getDict('version'), getDict('review_state')]).then(([VersionResp, ReviewStateResp]) => {
      if (VersionResp.status === 200) {
        this.version_list = VersionResp.data
      }

      if (ReviewStateResp.status === 200) {
        this.review_state_list = ReviewStateResp.data
      }
    })

    this.submitForm()
  }
}
</script>
