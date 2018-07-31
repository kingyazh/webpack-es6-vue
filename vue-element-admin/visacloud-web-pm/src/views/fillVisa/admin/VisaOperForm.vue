<template>
    <el-container>
        <el-header class="visa_info" :data="OptOrderInit">
            <el-row class="title" type="flex" align="center" justify="space-between">
                <el-col :span="4">
                    <span>国家：{{OptOrderInit.country_name}}</span>
                </el-col>
                <el-col :span="4">
                    <span>签证类型：{{OptOrderInit.visa_type_name}}</span>
                </el-col>
                <el-col :span="7">
                    <span>团号/订单号：{{OptOrderInit.team_no}}</span>
                </el-col>
                <el-col :span="5">
                    <span>要证/出发日期：{{OptOrderInit.leave_date}}</span>
                </el-col>
                <el-col :span="5">
                    <span>送签地：{{OptOrderInit.visa_center_name}}</span>
                </el-col>
            </el-row>
        </el-header>





        <el-main class="padding-small">
            <template>
                <formTable :formRule="formRules" :formElementsData="formElements" :formElementsValue="!OptOrderInit.json_data?{}:OptOrderInit.json_data" :formParams="FormParams" />
            </template>
        </el-main>








    </el-container>
</template>
<style lang="scss" scoped>
    .visa_info{
        margin: 0 2rem;
        line-height:60px;
        background-color: #409EFF;
        color: #fff;
    }
    .el-main {
        /*margin: 0 2rem 2rem;*/
        background-color: #ffffff;
        color: #333;
        text-align: center;
        // line-height: 160px;
    }
    .title{
        font-size: 14px;
        .el-col {
            text-align: left;
            span {
                line-height: 40px;
            }
        }
    }
</style>
<script>
  /* eslint-disable */
    import formTable from "@/components/Form/formTable";
    import {getOptOrderInit,getOptOrderModel} from "@/api/FillVisa";
    export default {
        components: {formTable},
        data() {
            return {
                activeIndex: "0",
                formdata: {},


                FormParams:{
                    opt_order_no:this.$route.params.id
                },
                OptOrderInit:[],
                formElements:[],
                formRules:{}

            };
        },
        methods: {
            //  made the form table
            // madeFormTable(){
            //
            // }

        },
        watch:{
            formElements:function(){
                //  注释掉验证，先做表单提交
                // let formRules = UtilObj.makeRules(this.formElements['domains']);
                // this.$set(this.$data, "formRules", formRules);
                // console.log(formRules);
            },
        },
        created:function () {
            // console.log(this.FormParams);
            this.$axios
                .all([getOptOrderInit(this.FormParams),getOptOrderModel(this.FormParams)])
                .then(this.$axios.spread((OptOrderInitResp,OptOrderModelResp) => {
                    console.log(OptOrderInitResp, OptOrderModelResp);
                    // if(OptOrderInitResp['request']['responseURL'].indexOf('/toLogin')>-1 || OptOrderModelResp['request']['responseURL'].indexOf('/toLogin')>-1){
                    //     window.location.href = OptOrderInitResp['request']['responseURL'];
                    // }
                    // 维护操作单信息 表的简要内容
                    OptOrderInitResp.data.leave_date = UtilObj.formatUnixTimestamp(OptOrderInitResp.data.leave_date,'yyyy-MM-dd');
                    this.$set(this.$data, "OptOrderInit", !OptOrderInitResp.data ? [] : OptOrderInitResp.data);
                    this.$set(this.$data, "formElements", !OptOrderModelResp.data ? [] : OptOrderModelResp.data);
                }))
                .catch(error => {
                    console.log(error);
                });
        },
        mounted: function () {

        }
    };
</script>


<style scoped lang="scss">

</style>

