<template>
    <el-container>

        <el-main :class="searchBarFixed == true ? 'padding-small fixedSpace' :'padding-small'">
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

    </el-container>
</template>
<script>
  /* eslint-disable */
import formTable from "@/components/Form/formTable";
import {getDict,getConutryList,getCityList,getVisaCenter,getVisaType} from "@/api/DictionaryTool";
import VisaTemplate from "@/api/VisaTemplate";
//{templateModel,templateInit,templateSave}
export default {
    components: {formTable},
    data() {
        return {
            activeIndex: "0",
            formdata: {},

            searchBarFixed:false,
            FormParams:{
              country_code:this.$route.query['country_code']
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
            } else{
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
    created:function(){
        this.$axios
            .all([VisaTemplate.templateInit(this.FormParams),VisaTemplate.templateModel(this.FormParams)])
            .then(this.$axios.spread((templateInitResp,templateModelResp) => {
                // 维护操作单信息 表的简要内容
                this.$set(this.$data, "UserFormElements", !templateModelResp.data ? [] : templateModelResp.data);

                const getFormRules = UtilObj.makeRules(this.UserFormElements['domains']);
                this.$set(this.$data, "formRules", getFormRules);

                // 所有英文字段字母全部大写
                if(templateInitResp.data){
                    if(templateInitResp.data['json_data']){
                        Object.keys(templateInitResp.data['json_data']).filter(function(fn){
                            let suffix = '_en';
                            return fn.indexOf(suffix, fn.length - suffix.length) > 0;
                        }).forEach((fn) => {
                            let v = templateInitResp.data['json_data'][fn]
                            if('string' === typeof(v)){
                                templateInitResp.data['json_data'][fn] = v.toUpperCase();
                            }
                        });
                    }

                    this.$set(this.$data, "UserVisaInit", templateInitResp.data);
                }

            }))
            .catch(error => {
                console.log(error);
            });
    },
    mounted: function () {
        console.log(this.$route.params.enterpriseId);

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
        flex:1;
        width: 100%;
        top:0;
        left:auto;
        z-index: 100;
        background:#FFFFFF;
        .el-menu{
            /*padding:0 10px;*/
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
        /*margin: 0 2rem 2rem;*/
        padding:10px;
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

