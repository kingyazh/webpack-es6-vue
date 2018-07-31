<template>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :model="currentRouter">{{currentRouter}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
    export default {
        data(){
            return {
                currentRouter:'',
            }
        },
        watch:{
            "$route":"breadcrumbTitle"
        },
        methods:{
            breadcrumbTitle(){
                this.$set(this.$data,'currentRouter',this.$route.name);
            },
        },
        mounted(){
            this.breadcrumbTitle();
        }
    }
</script>

<style scoped lang="scss">
    .el-breadcrumb{
        padding: 1rem 1rem;
    }

</style>