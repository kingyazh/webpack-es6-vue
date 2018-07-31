<template>
   <div style="margin-top: 10%;">
    <el-form autoComplete="on" :model="formData" ref="step2Form" :rules="step2" label-width="110px" >
      <el-row :gutter="24">
        <el-col :span="10" :offset="7">
          <el-form-item label="企业名称" prop="enterprise_name">
            <el-input type="text" v-model="formData.enterprise_name" autoComplete="on" placeholder="企业名称" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="6" :offset="7">
          <el-form-item label="联系人" prop="contactor">
            <el-input type="text" v-model="formData.contactor" placeholder="联系人" />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="sex" >
            <el-radio v-model="formData.sex" label="1">先生</el-radio>
            <el-radio v-model="formData.sex" label="2">女士</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="10" :offset="7">
          <el-form-item label="管理密码" prop="password">
            <el-input type="password" v-model="formData.password" placeholder="管理密码" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="10" :offset="7">
          <el-form-item label="邮箱" prop="email">
            <el-input type="text" v-model="formData.email" placeholder="邮箱" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="10" :offset="7">
          <div style="text-align:center; margin:20px">
            <el-button @click="submit" type="primary" size="large">注册</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>

export default {
  props: ['setStepNum', 'submitForm'],
  data() {
    const enterpriseNameValidator = (rule, value, callback) => {
      console.log(value)
    }
    return {
      formData: {},
      step2: {
        enterprise_name: [
          { required: true, message: '必填，不能为空', trigger: 'blur', validator: enterpriseNameValidator }
        ],
        captcha_code: [
          { required: true, message: '必填，不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    validateEnterpriseName() {

    },
    submit() {
      this.$refs['step1Form'].validate(result => {
        if (result) {
          this.submitForm()
          this.$router.push({ name: 'regist3' })
        } else {
          console.log(result)
        }
      })
    }
  },
  mounted() {
    this.setStepNum(2)
  }
}
</script>
