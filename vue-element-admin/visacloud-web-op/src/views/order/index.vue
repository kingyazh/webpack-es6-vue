<template>
  <div class="dashboard-container">
    <component :is="currentRole"></component>
  </div>
</template>


<<script>
import OrderManage from './OrderList'

export default {
  name: 'Order',
  components: {
    OrderManage
  }
}
</script>
