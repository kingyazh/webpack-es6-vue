<template>
    <div id="app">
        <CommHeader></CommHeader>
        <Breadcrumb></Breadcrumb>
        <transition name="router-fade">
            <router-view></router-view>
        </transition>
        <CommFooter></CommFooter>


        <el-button class="go_home" icon="el-icon-back" v-on:click="routerHome" size="small" v-if="!pageHome">首页</el-button>
    </div>
</template>

<script>
    import CommHeader from './components/header/header'
    import CommFooter from './components/fooder/footer'
    import Breadcrumb from './components/breadcrumb'
    export default {
        name: 'App',
        components: {
            CommHeader,
            CommFooter,
            Breadcrumb
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

<style>

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }
    .go_home{
        position: fixed;
        left:10px;
        bottom: 10px;
        z-index: 5;
    }

</style>
