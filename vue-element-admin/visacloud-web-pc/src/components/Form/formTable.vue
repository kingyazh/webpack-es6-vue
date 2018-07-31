<template>
    <el-container>
        <el-main>
            <el-form :model="formData" :rules="formRule" ref="formData" size="mini" label-position="right" label-width="190px">
                <!--<el-form ref="VisaForm" size="mini" label-position="right" label-width="190px">-->
                <template v-for="(domain,key) in formElementsData.domains">
                    <h4 :id="domain.id" class="part_title">{{domain.title}}</h4>
                    <template v-for="(input,rowIndex) in domain.rows">
                        <el-form-item :label="input.row_label">
                                <span slot="label">
                                    <span v-if="input.star_tag == 1" style="color: #f56c6c">*</span>
                                    <el-tooltip :content="!input.tool_tip?input.row_label:input.tool_tip" placement="left">
                                        <span>{{input.row_label}}</span>
                                    </el-tooltip>
                                </span>
                            <template v-for="(item, comIndex) in input.components">
                                <formElement @updateformdata="updateForm" :key="comIndex" :elelabel="input.row_label" :ele="item" :elementValue="formElementsValue" :setHideEleKey="clearHideEleRule"/>
                            </template>
                        </el-form-item>
                    </template>
                </template>

                <el-row type="flex" :gutter="20" align="center">
                    <el-col :span="12" :offset="6">
                        <template v-for="(button,key) in formElementsData.buttons">
                            <el-button :type="button.type=='cancel'?'info':'primary'" @click="buttonEvent(button)">
                                {{!button.label?'保存':button.label}}
                            </el-button>
                        </template>
                    </el-col>
                </el-row>
            </el-form>

            <!--<div v-if="!!pdfLink">-->
            <!--<iframe class="pdfIframe" :src="pdfLink" frameborder="0"></iframe>-->
            <!--<div></div>-->
            <!--</div>-->
        </el-main>
    </el-container>
</template>
<script>
    import formElement from "./formElement";
    export default {
        UtilObj:window.UtilObj,
        components: { formElement },
        name: "formTable",
        props: ["formRule","formElementsData","formElementsValue","formParams"],
        data() {
            return {
                formData: {},
                formRules:{},
                clearHideEleRule:true,
                pdfLink:''
            };
        },
        computed: {

        },
        watch:{
            formData:{
                //  解决方法一、需要用到深度监听，因为VisaForm 是新增属性，且内部属性值进行改变，所以无法监听到（推荐方法）
                handler:function(val,oldval){
                    // console.log(val);
                },
                deep:true
            }
        },
        methods: {
            buttonEvent(button){
                let url = window.API_ROOT + button.url.replace('/visacloud/','');
                let fn = 'exportDataForm';
                if(button.type=='cancel') fn='resetForm';
                if(button.type=='submit' && !button['check_required']) fn='submitForm';
                // else if(type=='export') fn='exportForm';
                this[fn](url);
            },
            exportDataForm(url) {
                //  给子组件传入销毁隐藏元素的参数
                this.$set(this.$data,'clearHideEleRule',false);

                //  $nextTick 等子组件重新刷新后 执行校验等操作
                this.$nextTick(() => {
                    // let paramsObj = {json_data:encodeURIComponent(JSON.stringify(this.formData))};
                    //  删除值为空的属性
                    let postFormData = Object.assign({},this.formData),
                        objKeyReg=/^.*_en$/,
                        _this=this;

                    for(let objKey in postFormData){
                        //  把所有英文字母转为大写，以后看特殊需求
                        if(objKeyReg.test(objKey)){
                            postFormData[objKey] = postFormData[objKey].toUpperCase();
                        }

                        //  以上删除的只是隐藏的 input，而未填写的中文 input 也需要清空
                        if(postFormData[objKey]=='null'){
                            delete postFormData[objKey];
                        }
                    }

                    //  校验表单
                    this.$refs.formData.validate((valid,data) => {
                        // console.log(postFormData);
                        if (valid) {
                            let paramsObj = {json_data:this.Base64().encode(JSON.stringify(postFormData))};
                            this.$axios({
                                method: 'POST',
                                url: url,
                                data: UtilObj.paramsStr(paramsObj)
                            }).then((res) => {
                                // this.page = res.data.page;
                                // !res.data.url?this.$router.push('/'):window.location.href = res.data.url;
                                !res.data.url?this.$router.push('/'):window.open(window.API_ROOT + res.data.url.replace('/visacloud/','')),this.$router.push('/');
                            }).catch((err) => {
                                console.log(err)
                            });
                        } else {
                            // 校验失败之后的操作
                            this.$set(this.$data,'clearHideEleRule',true);
                            return false;
                        }
                    });
                })
            },
            submitForm(url) {
                //  删除值为空的属性
                let postFormData = Object.assign({},this.formData),
                    objKeyReg=/^.*_en$/,
                    _this=this;

                for(let objKey in postFormData){
                    //  把所有英文字母转为大写，以后看特殊需求
                    if(objKeyReg.test(objKey)){
                        // if(typeof postFormData[objKey] === 'string'){
                        postFormData[objKey] = postFormData[objKey].toUpperCase();
                    }

                    //  以上删除的只是隐藏的 input，而未填写的中文 input 也需要清空
                    if(postFormData[objKey]=='null'){
                        delete postFormData[objKey];
                    }

                }

                let paramsObj = {json_data:this.Base64().encode(JSON.stringify(postFormData))};
                this.$axios({
                    method: 'POST',
                    url: url,
                    data: UtilObj.paramsStr(paramsObj)
                }).then((res) => {
                    !res.data.url?this.$router.push('/'):window.open(window.API_ROOT + res.data.url.replace('/visacloud/','')),this.$router.push('/');
                }).catch((err) => {
                    console.log(err)
                });

            },
            exportForm(url){
                let paramsObj = {json_data:JSON.stringify(this.formData)};
                //  此处为弹出层准备，弹出层带关闭，带下载
                this.$set(this.$data,'pdfLink',`${url}?${UtilObj.paramsStr(paramsObj)}`);
                //  现在只在新窗口打开
                window.open(`${url}?${UtilObj.paramsStr(paramsObj)}`);
                // window.location.href = `${url}?${UtilObj.paramsStr(paramsObj)}`;
            },
            resetForm() {
                this.$refs['VisaForm'].resetFields();
            },
            updateForm(data){
                // console.log(data);
                let VisaFormEle = Object.assign(this.formData, data);
                //  删除值为空的属性
                for(let objKey in VisaFormEle){
                    if(!VisaFormEle[objKey]){
                        delete VisaFormEle[objKey];
                    }
                }
                this.$set(this.$data, "formData", VisaFormEle);
                // });
            },
            updateUnusedKey(data){
                let newCache = Object.assign({},this.hideChildKeyCache, data);
                this.$set(this.$data, "hideChildKeyCache", newCache);
                // console.log(this.hideChildKeyCache);
            },
            //  Base64
            Base64(){
                return new UtilObj.Base64();
            }
        },
        beforeCreate(){
        },
        created () {
            //  把从父组件带过来的参数合并进提交的表单中
            this.$set(this.$data, "formData", (this.formParams));
            //  把从前面带过来的校验规则给当前实例
            this.$set(this.$data, "formRules", this.formRule);
            // console.log(fromRult);
        },
        beforeUpdate:function(){

        },
        updated: function () {
            // this.$nextTick(function () {})
        },
        mounted() {
        }
    };
</script>
<style scoped lang="scss">

</style>

