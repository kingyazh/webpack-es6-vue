<template>
   <div style="margin-top: 10%;">
    <el-form autoComplete="on" :model="form2Data" ref="step2Form" :rules="step2" label-width="110px" >
      <el-row :gutter="24">
        <el-col :span="8" :offset="8">
          <el-form-item label="企业名称" prop="enterprise_name">
            <el-input type="text" v-model="form2Data.enterprise_name" autoComplete="on" placeholder="企业名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="5" :offset="8">
          <el-form-item label="联系人" prop="contactor">
            <el-input type="text" v-model="form2Data.contactor" placeholder="联系人" />
          </el-form-item>
        </el-col>
        <el-col :span="3" align="bottom" style="line-height: 36px;">
            <el-radio v-model="form2Data.sex" label="1">先生</el-radio>
            <el-radio v-model="form2Data.sex" label="2">女士</el-radio>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="8" :offset="8">
          <el-form-item label="管理密码" prop="password">
            <el-input type="password" v-model="form2Data.password" placeholder="管理密码" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="8" :offset="8">
          <el-form-item label="邮箱" prop="email">
            <el-input type="text" v-model="form2Data.email" placeholder="邮箱" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="8" :offset="8">
          <div style="text-align:center; margin:20px">
            <el-button @click="submit" type="primary" size="large">注册</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import Regist from '@/api/Regist'

export default {
  props: ['setStepNum', 'setFormData', 'getFormData'],
  data() {
    const enterpriseNameValidator = (rule, value, callback) => {
      Regist.verifyEnterpriseName({
        enterprise_name: value
      }).then(resp => {
        if (resp.status === 200) {
          if (resp.data['code'] === '10000') {
            callback()
          } else {
            callback(new Error('企业名称已被占用，换一个再试试'))
          }
        }
      })
    }
    const passwordValidator = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度不能少于6位'))
      } else {
        callback()
      }
    }
    return {
      form2Data: {
        sex: '1'
      },
      validateEnterpriseName: true,
      step2: {
        enterprise_name: [
          { required: true, message: '必填，不能为空', trigger: 'blur' },
          { required: true, trigger: 'blur', validator: enterpriseNameValidator }
        ],
        contactor: [
          { required: true, message: '必填，不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '必填，不能为空', trigger: 'blur' },
          { required: true, trigger: 'blur', validator: passwordValidator }
        ],
        email: [
          { required: true, message: '必填，不能为空', trigger: 'blur' },
          { pattern: /\w+@\w+\.\w/, message: '请输入有效的Email', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submit() {
      const formData = this.setFormData(this.form2Data)

      this.$refs['step2Form'].validate(result => {
        if (result) {
          Regist.registSubmit(formData).then(resp => {
            if (resp.status === 200) {
              if (resp.data && resp.data['code'] === '1000') {
                this.$router.push({ name: 'regist3' })
              } else {
                this.$message.error(resp.data['message'])
              }
            }
          })
        } else {
          console.log(result)
        }
      })
    }
  },
  mounted() {
    if (this.getFormData().phone) {
      this.setStepNum(2)
    } else {
      this.$router.push({ name: 'regist1' })
    }
  }
}
</script>
