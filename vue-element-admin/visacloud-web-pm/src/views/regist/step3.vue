<template>
  <div style="margin-top: 10%;">
    <el-row :gutter="24" justify="space-between">
      <el-col :span="4" :offset="10">
        <div style="text-align:center">
          <img :src="okpng" />
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="24" justify="space-between">
      <el-col :span="6" :offset="9">
        <div style="text-align:center; font-size:30px;font-weight:bold;">
        恭喜您，商户注册成功!
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-top:5%" >
      <el-col :span="10" :offset="6">
        <div style="font-size:25px;font-weight:bold;">现在您可以:</div>
        <div class="suggest-tetx">1. 登录系统免费办理泰国和日本签证；</div>
        <div class="suggest-tetx">2. 关注闪签微信公众号，将您的签证订单导入或添加至闪签系统，开始办理签证；</div>
        <div class="suggest-tetx">3. 将闪签平台分享给同行。</div>
      </el-col>
      <el-col :span="8">
        <img :src="qrcodepng" width="100px" height="100px" style="padding:5px; margin-left:15px; margin-top:8px" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import okpng from '@/image/ok.png'
import qrcodepng from '@/image/qrcode.png'

export default {
  props: ['setStepNum'],
  data() {
    return {
      okpng,
      qrcodepng
    }
  },
  mounted() {
    this.setStepNum(3)
  }
}
</script>

<style scoped>
.suggest-tetx {
  margin-left: 38px;
}
</style>
