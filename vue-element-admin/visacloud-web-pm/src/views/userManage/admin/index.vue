<template>
  <UserManage v-if="routerPath.indexOf('/userManage')"></UserManage>
</template>

<script>
  import UserManage from './UserManage'

  export default {
    name: 'VisaList-admin',
    components: {
      UserManage
    },
    data() {
      return {
        // lineChartData: lineChartData.newVisitis
        routerPath: ''
      }
    },
    methods: {
      handleSetLineChartData(type) {
        // this.lineChartData = lineChartData[type]
      }
    },
    created: function() {
      // this.$set(this.$data, 'routerPath', this.$route.path)
    },
    beforeMount: function() {
      // console.log('beforeMount')
      // console.log(this.$route)
    },
    mounted: function() {
      // console.log('fuck')
      // console.log(this.$route)
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 132px;
  }
}
</style>
