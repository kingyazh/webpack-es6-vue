<template>
    <VisaFormCommon v-if="routerPath.indexOf('/visaInfo/')>-1 && routerParams.visaOrderNo!='TH'"></VisaFormCommon>
    <VisaFormTH v-else-if="routerParams.visaOrderNo=='TH'"></VisaFormTH>
</template>

<script>
  import VisaFormCommon from './VisaFormCommon'
  import VisaFormTH from './VisaFormTH'

  export default {
    name: 'VisaForm-Edit',
    components: {
      VisaFormCommon,
      VisaFormTH
    },
    data() {
      return {
        // lineChartData: lineChartData.newVisitis
        routerPath: '',
        routerQuery: {},
        routerParams: {}
      }
    },
    methods: {
      handleSetLineChartData(type) {
        // this.lineChartData = lineChartData[type]
      }
    },
    created: function() {
      // country_code 也是从 visaOrderNo 来取，只是泰国这样
      // console.log(this.$route.params)
      this.$set(this.$data, 'routerPath', this.$route.path)
      this.$set(this.$data, 'routerQuery', this.$route.query)
      this.$set(this.$data, 'routerParams', this.$route.params)
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
