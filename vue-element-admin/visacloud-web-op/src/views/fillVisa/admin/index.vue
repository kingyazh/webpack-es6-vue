<template>
  <VisaList v-if="routerPath.indexOf('/visaList/')>-1 && routerQuery.country_code!='TH'"></VisaList>
  <VisaListTH v-else-if="routerQuery.country_code=='TH'"></VisaListTH>
</template>

<script>
  import VisaList from './VisaList'
  import VisaListTH from './VisaListTH'

  export default {
    name: 'VisaList-admin',
    components: {
      VisaList,
      VisaListTH
    },
    data() {
      return {
        // lineChartData: lineChartData.newVisitis
        routerPath: '',
        routerQuery: {}
      }
    },
    methods: {
      handleSetLineChartData(type) {
        // this.lineChartData = lineChartData[type]
      }
    },
    created: function() {
      this.$set(this.$data, 'routerPath', this.$route.path)
      this.$set(this.$data, 'routerQuery', this.$route.query)
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
