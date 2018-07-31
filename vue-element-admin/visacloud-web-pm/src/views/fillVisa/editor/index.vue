<template>
  <VisaList></VisaList>
</template>

<script>
  import VisaList from './VisaList'

  export default {
    name: 'VisaList-admin',
    components: {
      VisaList
    },
    data() {
      return {
        // lineChartData: lineChartData.newVisitis
      }
    },
    methods: {
      handleSetLineChartData(type) {
        // this.lineChartData = lineChartData[type]
      }
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
    margin-bottom: 32px;
  }
}
</style>
