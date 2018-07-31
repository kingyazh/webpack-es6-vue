<template>
    <el-container>

        <el-main :class="searchBarFixed == true ? 'padding-small fixedSpace' :'padding-small'">
            <el-row id="tab_menu" :class="searchBarFixed == true ? 'isFixed' :''">
                <el-col :span="24">
                    <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
                        <template v-for="(form,index) in GroupFormElements.domains">
                            <el-menu-item :key="index" :index="index+''">{{form.title}}</el-menu-item>
                        </template>
                    </el-menu>
                </el-col>
            </el-row>


            <template>
                <formTable :formRule="formRules" :formElementsData="GroupFormElements" :formElementsValue="!GroupFormInit.json_data?{}:GroupFormInit.json_data" :formParams="FormParams" @addNew="new_customers" />
            </template>
        </el-main>

    </el-container>
</template>
<script>
  /* eslint-disable */
// import comp from "./Comp";
import formTable from "@/components/Form/formTable";
import {getVisaFormInitTH,getVisaFormModelTH} from "@/api/FillVisa";
import VisaTemplate from "@/api/VisaTemplate";
export default {
    components: {formTable},
    data() {
        return {
            activeIndex: "0",
            formdata: {},

            searchBarFixed:false,
            FormParams:{
              country_code:this.$route.params.visaOrderNo,
            },
            formRules:{},
            GroupFormInit:[],
            GroupFormElements:[],
          // 可复制的字段，临时存放
            AddFormTemp:{},
            AddFormIndexTemp:1,

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
            var anchor = this.$el.querySelector('#'+this.GroupFormElements.domains[key].id)
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
            !this.GroupFormElements.domains?'':this.GroupFormElements.domains.forEach(function (name) {
                let anchorObjHeight = document.querySelector('#'+ name['id']).offsetTop-50;
                _this.$set(_this.anchorObj,[name.id],anchorObjHeight);
            });
            this.anchorCache.forEach(function (value, index) {
                if (scrollTop > value) {
                    _this.$set(_this.$data,'activeIndex',index.toString());
                }
            });

        },
      new_customers(){
          let newOne = [...this.AddFormTemp.rows],
            newName =  this.AddFormTemp.name ,
            newOrigin = this.AddFormIndexTemp,
            newNO = newOrigin + 1

        this.AddFormIndexTemp = newNO
        // for(let i=0;i<newOne.length;i++){
        //   newOne[i].components.forEach(function (component) {
        //     component.name = newName + '_' + newNO + '_' + component.name.replace(newName+'_'+newOrigin+'_','')
        //   })
        // }
        this.$set(this.AddFormTemp,'rows',newOne)
        delete this.AddFormTemp.type
        this.GroupFormElements['domains'].push(this.AddFormTemp)
        console.log(this.GroupFormElements);
      },
      addGroupModel(){

      }
    },
    created:function(){
        this.$axios
            .all([VisaTemplate.templateInit(this.FormParams),getVisaFormModelTH(this.FormParams)])
            .then(this.$axios.spread((TemplateInitResp,GroupFormResp) => {
                // console.log(TemplateInitResp, GroupFormResp);
                // 维护操作单信息 表的简要内容
              // 如果是要有新增，需要在第一次读取json时把需要新增的部分的key全部修改为有标识的
              let NewGroupFormResp = [], _this=this
              GroupFormResp.data['domains'].map(function (item) {
                if(!item.name){
                  NewGroupFormResp.push(item)
                }else{
                  // for(let i=0;i<item.rows.length;i++){
                  //   item.rows[i].components.forEach(function (component) {
                  //     component.name = item.name + '_1_' + component.name
                  //   })
                  // }
                  _this.$set(_this.$data,'AddFormTemp',Object.assign({},item))
                  NewGroupFormResp.push(item)
                }
                return NewGroupFormResp
              })
              this.$set(this.$data, "GroupFormElements", !GroupFormResp.data ? [] : GroupFormResp.data);
              const getFormRules = window.UtilObj.makeRules(this.GroupFormElements['domains']);
                this.$set(this.$data, "formRules", getFormRules);

                // 所有英文字段字母全部大写
                if(TemplateInitResp.data){
                    if(TemplateInitResp.data['json_data']){
                        Object.keys(TemplateInitResp.data['json_data']).filter(function(fn){
                            let suffix = '_en';
                            return fn.indexOf(suffix, fn.length - suffix.length) > 0;
                        }).forEach((fn) => {
                            let v = TemplateInitResp.data['json_data'][fn]
                            if('string' === typeof(v)){
                                TemplateInitResp.data['json_data'][fn] = v.toUpperCase();
                            }
                        });
                    }

                  this.$set(this.$data, "GroupFormInit", TemplateInitResp.data);
                }

            }))
            .catch(error => {
                console.log(error);
            });
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

