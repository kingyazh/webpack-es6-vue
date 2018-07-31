<template>
    <div class="el-aside">
        <el-aside style="width:100%">
            <!--<el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">-->
                <!--<el-radio-button :label="false">展开</el-radio-button>-->
                <!--<el-radio-button :label="true">收起</el-radio-button>-->
            <!--</el-radio-group>-->
            <div class="aside-collapse" @click="asideCollapse">
                <i :class="isCollapse?'el-icon-more close':'el-icon-more'"></i>
            </div>
            <el-menu
                    default-active="1-4-1"
                    class="el-menu-vertical-demo"
                    @open="handleOpen"
                    @close="handleClose"
                    :collapse="isCollapse"
                    mode="vertical"
                    :show-timeout="10"
                    :hide-timeout="10"
                    :default-active="$route.path"
                    background-color="#42485b"
                    text-color="#fff"
                    active-text-color="#409EFF"
            >
                <el-submenu index="1">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span slot="title">导航一</span>
                    </template>
                    <el-menu-item-group>
                        <span slot="title">分组一</span>
                        <el-menu-item index="1-1">选项1</el-menu-item>
                        <el-menu-item index="1-2">选项2</el-menu-item>
                    </el-menu-item-group>
                    <el-menu-item-group title="分组2">
                        <el-menu-item index="1-3">选项3</el-menu-item>
                    </el-menu-item-group>
                    <el-submenu index="1-4">
                        <span slot="title">选项4</span>
                        <el-menu-item index="1-4-1">选项1</el-menu-item>
                    </el-submenu>
                </el-submenu>
                <el-menu-item index="2">
                    <i class="el-icon-menu"></i>
                    <span slot="title">导航二</span>
                </el-menu-item>
                <el-menu-item index="3" disabled>
                    <i class="el-icon-document"></i>
                    <span slot="title">导航三</span>
                </el-menu-item>
                <el-menu-item index="4">
                    <i class="el-icon-setting"></i>
                    <span slot="title">导航四</span>
                </el-menu-item>
            </el-menu>
        </el-aside>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                isCollapse: true
            };
        },
        methods: {
            asideCollapse() {
                this.$set(this.$data,'isCollapse',!this.isCollapse);
            },
            handleOpen(){

            },
            handleClose(){

            }
        }
    }
</script>

<style scoped lang="scss">
    .el-aside{
        background-color: #42485b;
    }
    .aside-s{
        width: 50px;
    }
    .horizontal-collapse-transition {
        transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
    }
    .el-menu{
        border-right: 0;
        text-align: left;
    }
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
        /*background-color: rgba(64,158,255,.9);*/
        background-color: #42485b;
    }
    .el-icon-more{
        color: #fff;
    }
    .el-icon-more.close{
        transform: rotate(90deg);
    }
    .aside-collapse{
        padding: 10px 0;
    }
</style>