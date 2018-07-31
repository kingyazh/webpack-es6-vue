<template>
  <el-menu class="navbar" mode="horizontal">
    <!--<hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>-->

    <breadcrumb class="breadcrumb-container"></breadcrumb>

    <div class="right-menu">
      <error-log class="errLog-container right-menu-item"></error-log>

      <el-tooltip effect="dark" :content="$t('navbar.screenfull')" placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip>

      <lang-select class="international right-menu-item"></lang-select>

      <el-tooltip effect="dark" :content="$t('navbar.theme')" placement="bottom">
        <theme-picker class="theme-switch right-menu-item"></theme-picker>
      </el-tooltip>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              {{$t('navbar.dashboard')}}
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item>
            <span @click="editMyInfoDialog" style="display:block;">修改个人信息</span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span @click="editMyPWDDialog" style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">{{$t('navbar.logOut')}}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>


    <!--// 编辑当前用户信息 弹出层-->
    <el-dialog :title="dialogTitle" :visible.sync="editMyDataDialog">
      <el-form v-if="dialogMethod!=='phone'" :model="editMyData" ref="editMyName" :rules="addNewUserRules" label-width="120px" status-icon>
        <el-row v-if="dialogMethod==='info'" :gutter="20">
          <el-col :span="15">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="editMyData.name" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" @click="submitForm('editMyName')">保存</el-button>
          </el-col>
        </el-row>
        <el-row v-if="dialogMethod==='info'" :gutter="20">
          <el-col :span="15">
            <el-form-item label="手机" prop="phone">
              <el-input v-model="editMyData.phone" placeholder="" style="width: 100%;" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" @click="submitForm('editMyPhone')">修改</el-button>
          </el-col>
        </el-row>
        <el-row v-if="dialogMethod==='info'" :gutter="20">
          <el-col :span="15">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="editMyData.email" placeholder="" style="width: 100%;" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" @click="submitForm('editMyEmail')">修改</el-button>
          </el-col>
        </el-row>
        <!-- // 修改密码 -->
        <el-row v-if="dialogMethod==='pwd'" :gutter="20">
          <el-col :span="22">
            <el-form-item label="请输入原密码" prop="old_password">
              <el-input type="password" v-model="editMyData.old_password" placeholder="" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="dialogMethod==='pwd'" :gutter="20">
          <el-col :span="22">
            <el-form-item label="请输入新密码" prop="new_password">
              <el-input type="password" v-model="editMyData.new_password" placeholder="" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="dialogMethod==='pwd'" :gutter="20">
          <el-col :span="22">
            <el-form-item label="新密码确认" prop="checkAddPassword">
              <el-input type="password" v-model="editMyData.checkAddPassword" placeholder="" auto-complete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="dialogMethod==='pwd'" :gutter="20">
          <el-col style="text-align:center">
            <el-button type="primary" @click="submitForm('saveNewPWD')">修改</el-button>
            <el-button @click="resetForm('editMyName')">取消</el-button>
          </el-col>
        </el-row>

        <el-row v-if="dialogMethod==='info'" :gutter="20">
          <el-col :span="15">
            &nbsp;
          </el-col>
          <el-col :span="3">
            <el-button @click="resetForm('editMyName')">取消</el-button>
          </el-col>
        </el-row>
      </el-form>

      <!-- // 修改手机号 -->
      <el-form v-if="dialogMethod==='phone'" :model="editMyData" ref="editMyPhone" :rules="addNewUserRules" label-width="120px" status-icon>
        <el-row :gutter="20">
          <el-col :span="15">
            <el-form-item label="请输入手机号" prop="edit_phone">
              <el-input v-model="editMyData.edit_phone" placeholder="" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!--<el-row :gutter="20">-->
          <!--<el-col :span="15">-->
            <!--<el-form-item label="图形验证码" prop="captcha_code">-->
              <!--<el-input type="text" v-model="editMyData.captcha_code" placeholder="图形验证码" />-->
            <!--</el-form-item>-->
          <!--</el-col>-->
          <!--<el-col :span="5">-->
            <!--<img :src="captchaImg" @click="changeCaptcha" alt="图形验证码" style="cursor:pointer">-->
          <!--</el-col>-->
        <!--</el-row>-->

        <el-row :gutter="20">
          <el-col :span="15">
            <el-form-item label="手机验证码" prop="sms_code">
              <el-input v-model="editMyData.sms_code" placeholder="" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button @click="sendSmsCode" :disabled="smsDisabled">{{btn_text}}</el-button>
          </el-col>
        </el-row>

        <el-row>
          <el-col style="text-align:center">
            <!--<el-form-item>--><!--// 清除 from 内容时，会逐一清除 item 中的 input 内容，如果只有 item ，没有 input，会报错，代码终止执行-->
              <el-button type="primary" @click="submitForm('saveNewPhone')">修改</el-button>
              <el-button @click="resetForm('editMyPhone')">取消</el-button>
            <!--</el-form-item>-->
          </el-col>
        </el-row>
      </el-form>

      <!-- // 修改邮箱 -->
      <el-form v-if="dialogMethod==='email'" :model="editMyData" ref="editMyEmail" :rules="addNewUserRules" label-width="120px" status-icon>
        <el-row :gutter="20">
          <el-col :span="15">
            <el-form-item label="请输入新邮箱" prop="edit_email">
              <el-input v-model="editMyData.edit_email" placeholder="" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col style="text-align:center">
            <el-button type="primary" @click="submitForm('saveNewEmail')">修改</el-button>
            <el-button @click="resetForm('editMyEmail')">取消</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </el-menu>


</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'
// import { getCaptcha } from '@/api/captcha'
import AdminSet from '@/api/AdminSet'
// import { getCurrentUser, resetPwdCurrent, sendVerificationCode, updateUserPhone, sendActiveEmail, changeName } from '@/api/AdminSet'

export default {
  data() {
    const validateAddPass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'))
      } else {
        if (this.editMyData.checkAddPassword !== '') {
          this.$refs.editMyName.validateField('checkAddPassword')
        }
        callback()
      }
    }
    const validateAddPass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.editMyData.new_password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialogTitle: '',
      dialogMethod: 'pwd',
      editMyDataDialog: false,
      editMyData: {},
      // verifyPhoneBoolean: false,
      btn_text: '发送短信验证码',
      captchaImg: '',
      smsDisabled: true,
      addNewUserRules: {
        name: [
          { required: true, message: '必填，不能为空', trigger: 'blur' }
        ],
        phone: [
          { pattern: /^1[3456789]\d{9}$/, message: '目前只支持中国大陆的手机号码', trigger: 'blur' }
        ],
        edit_phone: [
          { required: true, message: '手机号、邮箱 必须填一项', trigger: 'blur' },
          { pattern: /^1[3456789]\d{9}$/, message: '目前只支持中国大陆的手机号码' }
        ],
        sms_code: [
          { required: true, message: '请填写验证码', trigger: 'blur' }
        ],
        email: [
          { message: '手机号、邮箱 必须填一项', trigger: 'blur' }
        ],
        edit_email: [
          { required: true, message: '必填，不能为空', trigger: 'blur' },
          { pattern: /^\w+\@+[0-9a-zA-Z]+\.(com|com.cn|edu|hk|cn|net|live|xin|cc|co|org|edu)$/, message: '填写正确的邮箱', trigger: 'blur' }
        ],
        role: [
          { type: 'array', required: true, message: '必填，不能为空', trigger: 'change' }
        ],
        new_password: [
          { validator: validateAddPass, trigger: 'blur' }
        ],
        checkAddPassword: [
          { validator: validateAddPass2, trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    LangSelect,
    ThemePicker
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar'
    ])
  },
  watch: {
    'editMyData.edit_phone': function(val) {
      if ((/^1[3456789]\d{9}$/).test(val)) {
        this.smsDisabled = false
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    editMyInfoDialog() {
      this.dialogTitle = '修改个人资料'
      this.dialogMethod = 'info'
      this.editMyDataDialog = true
    },
    editMyPWDDialog() {
      this.dialogTitle = '修改密码'
      this.dialogMethod = 'pwd'
      this.editMyDataDialog = true
    },
    submitForm(formName) {
      console.log(formName)
      if (formName === 'editMyName') {
        this.$refs['editMyName'].validate(result => {
          if (result) {
            AdminSet.changeName({
              name: this.editMyData.name
            }).then(resp => {
              if (resp.data.code === '10000') {
                this.$store.getters.name = resp.data.user_info.name
                this.editMyDataDialog = false
              } else {
                // 根据返回的 code 判断是否修改成功，未修改成功，进行提示
                this.$confirm('未修改成功，请重来一遍')
                  .then(val => {
                    console.log(val)
                  })
                  .catch(_ => {})
              }
            }).catch(e => {
              console.log(e)
            })
          }
        })
      } else if (formName === 'editMyPhone') {
        this.dialogMethod = 'phone'
      } else if (formName === 'editMyEmail') {
        this.dialogMethod = 'email'
      } else if (formName === 'saveNewPhone') {
        this.$refs['editMyPhone'].validate(result => {
          if (result) {
            AdminSet.updateUserPhone({
              phone: this.editMyData.edit_phone,
              verificationCode: this.editMyData.sms_code
            }).then(resp => {
              if (resp.data.code === '10000') {
                this.$store.getters.phone = resp.data.user_info.phone
                this.editMyDataDialog = false
              } else {
                // 根据返回的 code 判断是否修改成功，未修改成功，进行提示
                this.$confirm('未修改成功，请重来一遍')
                  .then(val => {
                    console.log(val)
                    // this.editMyDataDialog = false
                  })
                  .catch(_ => {})
              }
            }).catch(e => {
              console.log(e)
            })
          }
        })
      } else if (formName === 'saveNewEmail') {
        this.$refs['editMyEmail'].validate(result => {
          if (result) {
            AdminSet.sendActiveEmail({
              email: this.editMyData.edit_email
            }).then(resp => {
              if (resp.data.code === '10000') {
                this.editMyDataDialog = false
              } else {
                // 根据返回的 code 判断是否修改成功，未修改成功，进行提示
                this.$confirm('未修改成功，请重来一遍')
                  .then(val => {
                    console.log(val)
                  })
                  .catch(_ => {})
              }
            }).catch(e => {
              console.log(e)
            })
          }
        })
      } else if (formName === 'saveNewPWD') {
        this.$refs['editMyName'].validate(result => {
          if (result) {
            AdminSet.resetPwdCurrent({
              old_password: this.editMyData.old_password,
              new_password: this.editMyData.new_password
            }).then(resp => {
              if (resp.data.code === '10000') {
                this.editMyDataDialog = false
              } else {
                // 根据返回的 code 判断是否修改成功，未修改成功，进行提示
                this.$confirm('未修改成功，请重来一遍')
                  .then(val => {
                    console.log(val)
                  })
                  .catch(_ => {})
              }
            }).catch(e => {
              console.log(e)
            })
          }
        })
      }

      // 发短信验证码时的验证码
      // if (!this.verifyPhoneBoolean) {
      //   this.dialogMethod = 'phone'
      // }

      // AdminSet.verifyPhoneSmsCode({
      //   phone: this.editMyData.phone,
      //   sms_code: this.editMyData.sms_code
      // }).then(resp => {
      //
      // })
    },
    // 所有表单重置和取消功能，包含关闭某些弹出框
    resetForm(formName) {
      console.log(this.$refs[formName])
      this.$refs[formName].resetFields()
      this.editMyDataDialog = false
    },
    sendSmsCode() {
      // console.log('发送短信验证码')
      this.smsDisabled = true
      this.$refs['editMyPhone'].validate(result => {
        if ((/^1[3456789]\d{9}$/).test(this.editMyData.edit_phone)) {
          const that = this
          AdminSet.sendVerificationCode({
            phone: this.editMyData.edit_phone
          }).then(resp => {
            if (resp.status === 200) {
              this.$message({
                message: '短信已发送到您的手机，请注意查收',
                type: 'success'
              })
              let leftSec = 90
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
        }
      })
    }
    // ,
    // changeCaptcha() {
    //   getCaptcha('138x40').then(resp => {
    //     this.captchaImg = resp.data
    //   })
    // }
  },
  created() {
    // this.changeCaptcha()

    this.editMyData = {
      name: this.$store.getters.name,
      phone: this.$store.getters.phone,
      email: this.$store.getters.email
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
