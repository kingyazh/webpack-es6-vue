<template>
    <el-container>
        <!--<el-aside>左侧菜单预留</el-aside>-->
        <el-container>
            <el-main class="padding-none">
                <optOrderList></optOrderList>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import optOrderList from './VisaList'
    export default {
        name: 'Home',
        components: {
            optOrderList
        }
    }
</script>

<style scoped lang="scss">
    .el-main {
        /*margin:0 2rem 2rem;*/
        background-color: #FFFFFF;
        color: #333;
        text-align: center;
        line-height: 160px;
    }

    body > .el-container {
        margin-bottom: 40px;
    }

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        line-height: 260px;
    }

    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    }

</style>