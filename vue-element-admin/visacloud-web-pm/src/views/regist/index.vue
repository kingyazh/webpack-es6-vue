<template>
  <el-container>
    <el-main class="padding-small" style="padding-bottom:80px;">
      <el-steps :active="stepNum" simple>
        <el-step title="填写手机号" icon="el-icon-edit"></el-step>
        <el-step title="完善信息" icon="el-icon-upload"></el-step>
        <el-step title="注册成功" icon="el-icon-picture"></el-step>
      </el-steps>
      <router-view :setStepNum="setStepNum" :setFormData="setFormData" :submitForm="submitForm" />
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      stepNum: 1,
      formData: {}
    }
  },
  methods: {
    setStepNum(stepNum) {
      this.stepNum = stepNum
    },
    setFormData(data) {
      if (data) {
        Object.keys(data).forEach(f => {
          console.log(f)
          this.formData[f] = data[f]
        })
      }
    },
    submitForm() {
      console.log('表单提交')
    }
  }
}
</script>
