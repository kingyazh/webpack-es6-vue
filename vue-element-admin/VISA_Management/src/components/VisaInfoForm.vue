<template>
    <el-container>

        <el-main :class="searchBarFixed == true ? 'fixedSpace' :''">
            <el-row id="tab_menu" :class="searchBarFixed == true ? 'isFixed' :''">
                <el-col :span="24">
                    <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
                        <template v-for="(form,index) in UserFormElements.domains">
                            <el-menu-item :key="index" :index="index+''">{{form.title}}</el-menu-item>
                        </template>
                    </el-menu>
                </el-col>
            </el-row>


            <template>
                <formTable :formRule="formRules" :formElementsData="UserFormElements" :formElementsValue="!UserVisaInit.json_data?{}:UserVisaInit.json_data" :formParams="FormParams" />
            </template>
        </el-main>



        <!--<el-main>-->
            <!--<el-form ref="form" label-position="right" :model="formdata" size="mini" label-width="140px">-->
                <!--<template v-for="(form,index) in formRulesInfo">-->
                    <!--<div :key="index">-->
                        <!--<h4 class="title02" :id="baseHash + '#' + index">{{form.title}}</h4>-->
                        <!--<div>-->
                            <!--<template v-for="(row, rowIndex) in form.rows">-->
                                <!--<el-form-item :key="rowIndex" :label="row.row_label" :required="row.star_tag == 1" label-width="20vw">-->
                                    <!--<span slot="label">-->
                                        <!--<el-tooltip :content="row.tool_tip" placement="left">-->
                                            <!--<span>{{row.row_label}}</span>-->
                                        <!--</el-tooltip>-->
                                    <!--</span>-->
                                    <!--<template v-for="(com, comIndex) in row.components">-->
                                        <!--<comp :key="comIndex" :root="com" :formdata="formdata" />-->
                                    <!--</template>-->
                                <!--</el-form-item>-->
                            <!--</template>-->
                        <!--</div>-->
                    <!--</div>-->
                <!--</template>-->
                <!--<el-row type="flex" justify="center">-->
                    <!--<el-col :span="6" class="btn-group">-->
                        <!--<el-form-item label-width="auto">-->
                            <!--<el-button type="primary" @click="submit">提交</el-button>-->
                            <!--<el-button>取消</el-button>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                <!--</el-row>-->
            <!--</el-form>-->
        <!--</el-main>-->
    </el-container>
</template>
<script>
// import comp from "./Comp";
import formTable from "./formTable";
export default {
    components: {formTable},
    data() {
        return {
            activeIndex: "0",
            formdata: {},

            searchBarFixed:false,
            FormParams:{
                enterprise_code:this.$route.params.enterpriseId,
                visa_order_no:this.$route.params.visaOrderNo,
                passport_no:this.$route.params.passportNo,
            },
            formRules:{},
            UserVisaInit:[],
            UserFormElements:[],

            anchorObj:{},
            anchorCache:[]
        };
    },
    watch:{
        anchorObj:function (val) {
            // console.log(Object.values(val));
            this.$set(this.$data,'anchorCache',Object.values(val))
        }
    },
    methods: {

        //  get optFrom data
        getUserOrderInit() {
            return this.$axios.get(window.API_ROOT + 'rest/customer.update.init/v1', { params: this.FormParams });
            // return this.$axios.get('./data/customer.update.init_v1_enterprise_code=caissa_visa_order_no=DF18051809268119_passport_no=G50298395.json', { params: this.FormParams });
        },
        //  get optFrom form elements
        getUserOrderModel() {
            return this.$axios.get(window.API_ROOT + 'rest/customer.update.model/v1', { params: this.FormParams });
            // return this.$axios.get('./data/customer.update.model-v1-enterprise_code=caissa-visa_order_no=DF18051809268119-passport_no=G50298395.json', { params: this.FormParams });
        },


        handleSelect: function (key, keyPath) {
            var anchor = this.$el.querySelector('#'+this.UserFormElements.domains[key].id)
            document.documentElement.scrollTop = anchor.offsetTop-50;
        },
        handleScroll:function () {
            let _this=this;
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            let offsetTop = document.querySelector('#tab_menu').offsetTop;
            if (scrollTop > offsetTop) {
                this.searchBarFixed = true
            } else {
                this.searchBarFixed = false
            }

            //  页面滚动使菜单变样式
            !this.UserFormElements.domains?'':this.UserFormElements.domains.forEach(function (name) {
                let anchorObjHeight = document.querySelector('#'+ name['id']).offsetTop-50;
                _this.$set(_this.anchorObj,[name.id],anchorObjHeight);
            });
            this.anchorCache.forEach(function (value, index) {
                if (scrollTop > value) {
                    _this.$set(_this.$data,'activeIndex',index.toString());
                }
            });

        }
    },
    created(){
        this.$axios
            .all([this.getUserOrderInit(),this.getUserOrderModel()])
            .then(this.$axios.spread((UserVisaInitResp,UserVisaModelResp) => {
                // 维护操作单信息 表的简要内容
                this.$set(this.$data, "UserFormElements", !UserVisaModelResp.data ? [] : UserVisaModelResp.data);

                // 所有英文字段字母全部大写
                if(UserVisaInitResp.data){
                    if(UserVisaInitResp.data['json_data']){
                        Object.keys(UserVisaInitResp.data['json_data']).filter(function(fn){
                            let suffix = '_en';
                            return fn.indexOf(suffix, fn.length - suffix.length) > 0;
                        }).forEach((fn) => {
                            let v = UserVisaInitResp.data['json_data'][fn]
                            if('string' === typeof(v)){
                                UserVisaInitResp.data['json_data'][fn] = v.toUpperCase();
                            }
                        });
                    }

                    this.$set(this.$data, "UserVisaInit", UserVisaInitResp.data);
                }

            }));
    },
    mounted: function () {


        window.addEventListener('scroll', this.handleScroll);
    },
    destroyed () {
        window.removeEventListener('scroll', this.handleScroll)
    }
};
</script>


<style scoped lang="scss">
    .isFixed{
        position: fixed;
        width: 100%;
        top:0;
        left:0;
        z-index: 100;
        background:#FFFFFF;
        .el-menu{
            padding:0 3rem;
        }
    }
    .fixedSpace{
        padding: 4rem 0 0;
    }
    .el-header{
        height: auto;
    }
    .el-menu{
        height: 3rem;
        background: transparent;
    }
    .el-menu-item{
        height: 3rem;
    }
    .visa_info{
        margin: 0 2rem;
        line-height:60px;
        background-color: #409EFF;
        color: #fff;
    }
    .el-main {
        margin: 0 2rem 2rem;
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

