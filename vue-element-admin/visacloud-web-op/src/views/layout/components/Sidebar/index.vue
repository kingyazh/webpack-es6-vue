<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <el-menu
      mode="vertical"
      :show-timeout="0"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <el-row>
        <el-col style="color:#fff;font-size:20px;">
          <div class="aside-collapse" @click="toggleSideBar">
            <i :class="isCollapse?'el-icon-more close':'el-icon-more'"></i>
          </div>
        </el-col>
      </el-row>
      <sidebar-item :routes="permission_routers"></sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    }
  }
}
</script>

<style scoped lang="scss">
  .el-icon-more{
    color: #fff;
  }
  .el-icon-more.close{
    transform: rotate(90deg);
  }
  .aside-collapse{
    padding: 13px 0;
    text-align: center;
    /*background-color: #fff;*/
  }
</style>
