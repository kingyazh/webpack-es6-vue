<template>
  <div width="75%">
    <el-container>
      <el-main class="padding-small" style="padding-bottom:80px;">
        <el-steps :active="stepNum" simple>
          <el-step title="填写手机号" icon="el-icon-edit"></el-step>
          <el-step title="完善信息" icon="el-icon-upload"></el-step>
          <el-step title="注册成功" icon="el-icon-picture"></el-step>
        </el-steps>
        <router-view :setStepNum="setStepNum" :setFormData="setFormData" :getFormData="getFormData" />
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stepNum: 0,
      formData: {}
    }
  },
  methods: {
    setStepNum(stepNum) {
      if (this.stepNum === stepNum - 1) {
        this.stepNum = stepNum
      }
      return this.stepNum
    },
    setFormData(data) {
      if (data) {
        Object.keys(data).forEach(f => {
          this.formData[f] = data[f]
        })
      }
      return this.formData
    },
    getFormData() {
      return this.formData
    }
  }
}
</script>
