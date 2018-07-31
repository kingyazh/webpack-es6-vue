<template>
  <div class="dashboard-container">
    <component :is="currentRole"></component>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminFillVisa from './admin'
import editorFillVisa from './editor'

export default {
  name: 'visaTemplate',
  components: { adminFillVisa, editorFillVisa },
  data() {
    return {
      currentRole: 'adminFillVisa'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'adminFillVisa'
      // 有权限后开发的组件在 editor 文件夹中
      // this.currentRole = 'editorFillVisa'
    }
  }
}
</script>
