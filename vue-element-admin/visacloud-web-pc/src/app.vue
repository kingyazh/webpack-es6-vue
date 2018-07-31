<template>
    <div id="app">
        <el-container>
            <CommHeader></CommHeader>
            <el-container class="main-body">
                <CommAside></CommAside>
                <el-main class="main-content">
                    <Breadcrumb></Breadcrumb>

                    <transition name="router-fade">
                        <router-view></router-view>
                    </transition>
                </el-main>
            </el-container>
            <CommFooter></CommFooter>

            <el-button class="go_home" icon="el-icon-back" v-on:click="routerHome" size="small" v-if="!pageHome">首页</el-button>
        </el-container>
    </div>
</template>

<script>
    import CommHeader from './components/Header/header'
    import CommFooter from './components/Fooder/footer'
    import Breadcrumb from './components/breadcrumb'
    import CommAside from './components/Aside/aside'
    export default {
        name: 'App',
        components: {
            CommHeader,
            CommFooter,
            Breadcrumb,
            CommAside
        },
        data(){
            return {
                pageHome:false,
            }
        },
        watch:{
            "$route":"currentHome"
        },
        methods:{
            routerHome(){
                this.$router.push('/');
            },
            currentHome(){
                this.$route.path=='\/'?this.$set(this.$data,'pageHome',true):this.$set(this.$data,'pageHome',false);
            },
        },
        mounted(){

        }
    }
</script>

<style scoped lang="scss">

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }
    .el-container{
        display: block;
    }
    .main-body{
        display: flex;
        flex-direction: row;
        justify-content:space-between;
    }
    .el-main {
        margin: 0;
        padding:0;
        min-height: 500px;
    }
    .main-content{
        margin-left: 0;
        margin-right: 0;
    }
    .go_home{
        position: fixed;
        left:6px;
        bottom: 10px;
        z-index: 5;
        padding:9px 5px;
    }

</style>
