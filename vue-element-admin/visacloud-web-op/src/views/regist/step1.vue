<template>
  <div style="margin-top: 10%;">
    <el-form autoComplete="on" :model="formData" ref="step1Form" label-width="110px" :rules="step1" >
      <el-row :gutter="24">
        <el-col :span="7" :offset="8">
          <el-form-item label="手机号" prop="phone">
            <el-input type="text" v-model="formData.phone" autoComplete="on" placeholder="手机号" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="5" :offset="8">
          <el-form-item label="图形验证码" prop="captcha_code">
            <el-input type="text" v-model="formData.captcha_code" placeholder="图形验证码" />
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <img :src="captchaImg" @click="changeCaptcha" alt="图形验证码" style="cursor:pointer">
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="5" :offset="8">
          <el-form-item label="短信验证码" prop="sms_code">
            <el-input type="text" v-model="formData.sms_code" placeholder="短信验证码" />
          </el-form-item>
        </el-col>
        <el-col :span="3" class="captcha_img">
          <el-button @click="sendSmsCode" :disabled="smsDisabled" >{{btn_text}}</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="8" :offset="8">
          <div style="text-align:center; margin:20px">
            <el-button @click="nextStep" type="primary" size="large">下一步</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { getCaptcha } from '@/api/captcha'
import RegistAPI from '@/api/Regist'

export default {
  props: ['setStepNum', 'setFormData'],
  data() {
    return {
      formData: {},
      btn_text: '发送短信验证码',
      captchaImg: '',
      smsDisabled: false,
      step1: {
        phone: [
          { required: true, message: '必填，不能为空', trigger: 'blur' },
          { pattern: /^\d{11}$/, message: '手机号只能是11位数字', trigger: 'blur' }
        ],
        captcha_code: [
          { required: true, message: '必填，不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    nextStep() {
      this.setFormData(this.formData)

      this.step1['sms_code'] = [
        { required: true, message: '必填，不能为空', trigger: 'blur' }
      ]

      this.$refs['step1Form'].validate(result => {
        if (result) {
          RegistAPI.verifySmsCode({
            phone: this.formData.phone,
            sms_code: this.formData.sms_code
          }).then(resp => {
            if (resp.status === 200) {
              if (resp.data.code === '10000') {
                this.$router.push({ name: 'regist2' })
              } else {
                this.$message.error(resp.data.message)
              }
            }
          })
        } else {
          console.log(result)
        }
      })
    },
    sendSmsCode() {
      console.log('发送短信验证码')
      this.smsDisabled = true
      this.$refs['step1Form'].validate(result => {
        const that = this
        RegistAPI.loginSmsSend({
          phone: this.formData.phone,
          captcha: this.formData.captcha
        }).then(resp => {
          if (resp.status === 200) {
            this.$message({
              message: '短信已发送到您的手机，请注意查收',
              type: 'success'
            })
            let leftSec = 60
            const c = setInterval(() => {
              leftSec--
              that.btn_text = leftSec + '秒后可重新发送'
              if (leftSec < 1) {
                clearInterval(c)
                this.btn_text = '发送短信验证码'
                this.smsDisabled = false
              }
            }, 1000)
          } else {
            this.smsDisabled = false
          }
        }).catch(e => {
          this.smsDisabled = false
        })
      })
    },
    changeCaptcha() {
      getCaptcha('138x40').then(resp => {
        this.captchaImg = resp.data
      })
    }
  },
  mounted() {
    this.changeCaptcha()
    this.setStepNum(1)
  }
}
</script>
