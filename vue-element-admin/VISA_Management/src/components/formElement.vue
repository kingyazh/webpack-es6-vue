<template>
    <div>
        <el-row type="flex" :gutter="20">
            <template v-if="ele.type == 'text' && ele.translatable == 1">
                <el-col :span="10">
                    <el-form-item :prop="ele.name+'_cn'" :label="!ele.comp_label?'':ele.comp_label" :label-width="!ele.comp_label?'':'100px'">
                        <span slot="label">
                            <span v-if="ele.required == 1 && !!ele.comp_label" style="color: #f56c6c">*</span>
                            <el-tooltip :content="!ele.tool_tip?ele.comp_label:ele.tool_tip" placement="left">
                                <span>{{ele.comp_label}}</span>
                            </el-tooltip>
                        </span>
                        <el-input :name="ele.name+'_cn'" v-model="VisaFormEle[ele.name+'_cn']" :placeholder="'中文'" @blur="translateCh2En(ele.name)"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="!ele.comp_label?10:6">
                    <el-form-item :prop="ele.name+'_en'" :rules="[{required:!!Number(ele.required),message:!ele['limit_msg']?'必填项，不能为空':ele['limit_msg']},{pattern:evalTo(ele.limit),message:!ele['limit_msg']?'请正确填写':ele['limit_msg']}]">
                        <el-input :name="ele.name+'_en'" v-model="VisaFormEle[ele.name+'_en']" :placeholder="'英文'" @focus="translateCh2En(ele.name)" class="en_case"></el-input>
                    </el-form-item>
                </el-col>
            </template>

            <template v-if="ele.type == 'text' && ele.translatable == 2">
                <el-col :span="10" :gutter="20">
                    <el-form-item :prop="ele.name+'_cn'" :label="!ele.comp_label?'':ele.comp_label" :label-width="!ele.comp_label?'':'100px'">
                        <span slot="label">
                            <span v-if="ele.required == 1 && !!ele.comp_label" style="color: #f56c6c">*</span>
                            <el-tooltip :content="!ele.tool_tip?ele.comp_label:ele.tool_tip" placement="left">
                                <span>{{ele.comp_label}}</span>
                            </el-tooltip>
                        </span>
                        <el-input :name="ele.name+'_cn'" v-model="VisaFormEle[ele.name+'_cn']" :placeholder="'中文'" @blur="translateCh2PY(ele.name)"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="!ele.comp_label?10:6">
                    <el-form-item :prop="ele.name+'_en'" :rules="[{required:!!Number(ele.required),message:!ele['limit_msg']?'必填项，不能为空':ele['limit_msg']},{pattern:evalTo(ele.limit),message:!ele['limit_msg']?'请正确填写':ele['limit_msg']}]">
                        <el-input :name="ele.name+'_en'" v-model="VisaFormEle[ele.name+'_en']" :placeholder="'拼音'" @focus="translateCh2PY(ele.name)" class="en_case"></el-input>
                    </el-form-item>
                </el-col>
            </template>

            <template v-else-if="(ele.type == 'text' && ele.translatable == 0) || (ele.type == 'text' && !ele.translatable)">
                <el-col :span="10">
                    <el-form-item :prop="ele.name" :label="!ele.comp_label?'':ele.comp_label" :label-width="!ele.comp_label?'':'100px'" :rules="[{required:!!Number(ele.required),message:!ele.limit_msg?'必填项，不能为空':ele.limit_msg},{pattern:evalTo(ele.limit),message:!ele.limit_msg?'必填项，不能为空':ele.limit_msg}]">
                        <el-input :name="ele.name" v-model="VisaFormEle[ele.name]" :placeholder="ele.placeholder||ele.comp_label"></el-input>
                    </el-form-item>
                </el-col>
            </template>
            <template v-else-if="(ele.type == 'hidden' && ele.translatable == 0) || (ele.type == 'hidden' && !ele.translatable)">
                    <el-input type="hidden" :name="ele.name" v-model="VisaFormEle[ele.name]" :value="ele.default_value" style="display:none"></el-input>
            </template>

            <template v-else-if="ele.type == 'date'">
                <el-col :span="10">
                    <el-form-item :label="ele.label" :prop="ele.name" :label-width="!ele.comp_label?'':'80px'" :rules="[{type:'number',required:!!Number(ele.required),message:!ele.limit_msg?'必填项，不能为空':ele.limit_msg}]">
                        <span slot="label" v-if="ele.comp_label">
                            <el-tooltip :content="!ele.tool_tip?ele.comp_label:ele.tool_tip" placement="left">
                                <span>{{ele.comp_label}}</span>
                            </el-tooltip>
                        </span>
                        <el-date-picker :name="ele.name" v-model="VisaFormEle[ele.name]" format="yyyy 年 MM 月 dd 日" value-format="timestamp" class="width-all" type="date" placeholder="选择日期" :clearable="false">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </template>

            <template v-else-if="ele.type == 'datetime'">
                <el-col :span="10">
                    <el-form-item :label="ele.label" :prop="ele.name" :rules="[{type:'number',required:!!Number(ele.required),message:!ele.limit_msg?'必填项，不能为空':ele.limit_msg}]">
                        <el-date-picker :name="ele.name" v-model="VisaFormEle[ele.name]" class="width-all" type="datetime" value-format="timestamp" placeholder="选择日期和时间">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </template>

            <template v-else-if="ele.type == 'time'">
                <el-col :span="10">
                    <el-form-item :label="ele.label" :prop="ele.name" :rules="[{type:'number',required:!!Number(ele.required),message:!ele.limit_msg?'必填项，不能为空':ele.limit_msg}]">
                        <el-time-picker :name="ele.name" v-model="VisaFormEle[ele.name]" class="width-all" value-format="timestamp" placeholder="任意时间">
                        </el-time-picker>
                    </el-form-item>
                </el-col>
            </template>

            <template v-else-if="ele.type == 'textfield'">
                <el-col :span="10">
                    <el-form-item :label="ele.label" :prop="ele.name" :rules="VisaFormEleRule[ele.name]">
                        <el-input :name="ele.name" v-model="VisaFormEle[ele.name]" type="textarea" :rows="3" :placeholder="ele.label"></el-input>
                    </el-form-item>
                </el-col>
            </template>

            <template v-else-if="ele.type == 'select'">
                <el-col :span="10">
                    <el-form-item :label="ele.label" :prop="ele.name" :label-width="!ele.comp_label?'':'100px'" :rules="[{required:!!Number(ele.required),message:!ele.limit_msg?'必填项，不能为空':ele.limit_msg,trigger:'change'}]">
                        <span slot="label" v-if="ele.comp_label">
                            <el-tooltip :content="!ele.tool_tip?ele.comp_label:ele.tool_tip" placement="left">
                                <span>{{ele.comp_label}}</span>
                            </el-tooltip>
                        </span>
                        <el-select :name="ele.name" v-model="VisaFormEle[ele.name]" :filterable="ele.items.length>15?true:false" :placeholder="ele.label" @change="eleChange($event)">
                            <el-option v-for="item in ele.items" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </template>

            <template v-else-if="ele.type == 'mselect'">
                <el-col :span="10">
                    <el-form-item :label="ele.label" :prop="ele.name" :rules="[{type:'array',required:!!Number(ele.required),message:'必填项，不能为空',trigger:'change'},]">
                        <el-select :name="ele.name" v-model="VisaFormEle[ele.name]" multiple :placeholder="ele.label" @change="eleChange($event)">
                            <el-option v-for="item in ele.items" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </template>

            <template v-else-if="ele.type == 'radio'">
                <el-col :span="20">
                    <el-form-item :label="ele.label" :prop="ele.name" align="left" :rules="VisaFormEleRule[ele.name]">
                        <el-radio :name="ele.name" v-model="VisaFormEle[ele.name]" v-for="(item,index) in ele.items" :key="item.value" :label="item.value" border @change="eleChange($event,index)">{{item.label}}</el-radio>
                    </el-form-item>
                </el-col>
            </template>

            <template v-else-if="ele.type == 'checkbox'">
                <el-col :span="20">
                    <el-form-item :label="ele.label" :prop="ele.name" align="left" :rules="[{type:'array',required:!!Number(ele.required),message:!ele.limit_msg?'必填项，不能为空':ele.limit_msg}]">
                        <el-checkbox-group v-model="VisaFormEle[ele.name]">
                            <el-checkbox :name="ele.name" v-for="(item,index) in ele.items" :key="item.value" :label="item.value" @change="eleChange($event,index)">{{item.label}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-col>
            </template>

        </el-row>
        <!--<template v-for="(child, index) in eleChildren">-->
            <!--<formElement @updateformdata="updateVisaFormEle" @updateformrules="updateChildRules" :key="index" :ele="child" :elementValue="elementValue" />-->
        <!--</template>-->
    </div>
</template>
<script>
    export default {
        name: "formElement",
        props: ["elelabel","ele","elementValue"],
        data() {
            return {
                VisaFormEle:{},
                VisaFormEleRule:{},

                eleIndex:-1 //获取联动选项的父元素的 index，更新时触发 eleChildren
            };
        },
        beforeUpdate(){

        },
        computed: {
            eleChildren:function(){
                let childrenItem=[],_this=this;
                if(this.eleIndex>-1){
                    var itemsList = this.ele.items[this.eleIndex];
                    if(Object.keys(itemsList).indexOf('children') > -1){
                        if(typeof itemsList.children === 'object'){
                            if(Array.isArray(itemsList.children)){
                                childrenItem = [...childrenItem,...itemsList.children];
                            }else{
                                childrenItem.push(itemsList.children);
                            }
                        }
                    }
                }
                return childrenItem;
            },
            eleDataChange:function () {

            }
        },
        watch:{
            VisaFormEleRule:{
                handler:function(val,oldval){

                },
                deep:true
            },
            VisaFormEle:{
                //  解决方法一、需要用到深度监听，因为VisaForm 是新增属性，且内部属性值进行改变，所以无法监听到（推荐方法）
                handler:function(val,oldval){
                    if(val.hasOwnProperty(this.ele.name+'_en') && val[this.ele.name+'_en']){
                        val[this.ele.name+'_en'] = val[this.ele.name+'_en'].toUpperCase();
                    }
                    //  此处更改数据，自调用时调用的 updateformdata
                    if(Array.isArray(val[this.ele.name]) || Array.isArray(this.ele.items)){
                        let ele = this.ele;
                        ele.items.forEach(function (v,i) {
                            if(!!v.children){
                                if(!v.children.length && val[ele.name].indexOf(v.value)<0){
                                    //  此处更改父级选项时，子级中对象内容需要清空
                                    if(v.children.translatable==1 || v.children.translatable==2){
                                        val[v.children.name+'_cn'] = '';
                                        val[v.children.name+'_en'] = '';
                                    }else{
                                        val[v.children.name] = '';
                                    }
                                }else if(!!v.children.length && val[ele.name].indexOf(v.value)<0){
                                    //  此处更改父级选项时，子级中的数组内容需要清空
                                    v.children.forEach(function (cv,ci) {
                                        val[cv.name] = '';
                                    });
                                }
                            }
                        })
                    }
                    this.$emit('updateformdata',val);//传入的事件名称只能使用小写，不能使用大写的驼峰规则命名，并不是必然，但data后新增属性，数据更新就无法触发$emit，改为小写就好了。so 小写吧
                },
                deep:true
            }
        },
        methods: {
            //  当select、mselect、checkbox、radio 等选中时，event为选择select时的option的值，index为checkbox、radio的index
            eleChange:function(event,index){
                let eleIndex = -1,_this=this;
                if(this.ele.type === "radio"){
                    event?eleIndex=index:eleIndex=-1;
                    this.$set(this.$data, "eleIndex", eleIndex);
                }else{
                    if(!index){
                        (this.ele.items).forEach(function (v,i) {
                            if(Object.values(v).indexOf(event)>-1){
                                eleIndex=i;
                                _this.$set(_this.$data, "eleIndex", eleIndex);
                            }
                        })
                    }else{
                        if(Object.keys(this.ele.items[index]).indexOf('children') > -1){
                            event?eleIndex=index:eleIndex=-1;
                            this.$set(this.$data, "eleIndex", eleIndex);
                        }
                    }
                }
            },
            // valid: function(data) {
            //     const valids = [];
            //     if (data.required) {
            //         valids.push({
            //             required: true,
            //             message: "此为必填项",
            //             trigger: "change"
            //         });
            //     }
            //     valids.push({
            //         validator: (rule, value, callback) => {
            //             if (new RegExp(data.limit).test(value) == false) {
            //                 callback(new Error("输入不符合要求"));
            //             } else {
            //                 callback();
            //             }
            //         },
            //         trigger: "change"
            //     });
            //     return valids;
            // },

            //  所有表单元素初始
            initEleData:function (item) {
                let _this = this;
                let itemSelf = !item?this.ele:item;
                let {name,type,translatable,items,required,limit} = itemSelf;
                let initValue = !this.elementValue?'':this.elementValue[name];
                type = type.toString();
                translatable = !translatable?0:Number(translatable);
                if(type == 'text'){
                    initValue = !initValue?'':initValue;
                    if(translatable == 1 || translatable == 2){
                        if(!this.elementValue){
                            this.$set(this.VisaFormEle, name+'_cn', '');//依然无法对新增属性的数据更新做监听 v-model 可以做到双向绑定，但无法监听数据变化传递给父组件
                            this.$set(this.VisaFormEle, name+'_en', '');
                        }else{
                            this.$set(this.VisaFormEle, name+'_cn', !this.elementValue[name+'_cn']?'':this.elementValue[name+'_cn']);
                            this.$set(this.VisaFormEle, name+'_en', !this.elementValue[name+'_en']?'':this.elementValue[name+'_en']);
                        }
                        //  解决方法二、VisaFormEle 是新增属性，且内部属性值进行改变，所以无法监听到，以下给对象设置新属性的方法，可以解决 watch 不到的情况，非 deep 的状态下
                        // let keyCN = name+'_cn';
                        // let keyEN = name+'_cn';
                        // Object.assign({}, this.VisaFormEle,{keyCN,initValue})
                        // Object.assign({}, this.VisaFormEle,{keyEN,initValue})
                    }else {
                        this.$set(this.VisaFormEle, name, initValue);
                    }
                }else if(type == 'checkbox' || type == 'mselect'){
                    //  读取已存好的数据时，有多级联动的，需要把子级中的信息读取出来
                    if(!initValue){
                        initValue = [];
                        items.forEach(function (v,index) {
                            if(!!v.checked){
                                initValue.push(v.value);
                            }
                        });
                    }else {
                        initValue = initValue.length==0?[]:initValue;
                        items.forEach(function (v,index) {
                            if(Object.keys(v).indexOf('children') > -1 && initValue.indexOf(v.value)>-1){
                                _this.eleChange(true,index);
                            }
                        })
                    }
                    this.$set(this.VisaFormEle, name, initValue);
                }else if(type == 'radio' || type == 'select'){
                    //  读取已存好的数据时，有多级联动的，需要把子级中的信息读取出来
                    if(!initValue){
                        initValue = '';
                        items.forEach(function (v,index) {
                            if(!!v.checked){
                                initValue=v.value;
                            }
                        })
                    }else {
                        initValue = initValue.length==0?'':initValue;
                        items.forEach(function (v,index) {
                            if(Object.keys(v).indexOf('children') > -1 && initValue == v.value){
                                _this.eleChange(v.value,index);
                            }
                        })
                    }
                    this.$set(this.VisaFormEle, name, initValue);
                }else if(type == 'mun'){
                    initValue = !initValue?0:initValue;
                    this.$set(this.VisaFormEle, name, initValue);
                }else {
                    initValue = !initValue?'':initValue;
                    this.$set(this.VisaFormEle, name, initValue);
                }
            },
            setInitEleRule:function(item){
                let itemSelf = !item?this.ele:item;
                let {name,type,translatable,required,limit,limit_msg} = itemSelf;
                let limitReg = !limit?'':eval(`\/${limit}\/`);
                let limitMsg = !limit_msg?'必填项，不能为空':limit_msg;
                let eleRule = [];
                type = type.toString();
                translatable = !translatable?0:Number(translatable);
                // console.log(type);
                if(['radio','check','select','mselect','date'].indexOf(type)>-1){
                    let eleType='';
                    // if(type === 'check' || type === 'mselect') eleType='array';
                    // else if(type === 'date' || type === 'time') eleType='string';
                    // else eleType='string';

                    eleRule.push(
                        {pattern:limitReg,message:limitMsg}
                        );
                    if(type == 'radio'){
                        eleRule.push(
                            {required:!!Number(required),message:limitMsg,trigger:'change'},
                        );
                    }
                    let updateRule = Object.assign({},this.VisaFormEleRule,{[name]:eleRule});
                    this.$set(this.$data, 'VisaFormEleRule', updateRule);
                }else{
                    eleRule.push(
                        {required:!!Number(required),message:'必填项，不能为空',trigger:'blur'},
                        {pattern:limitReg,message:limitMsg}
                    );
                    if(translatable == 1 || translatable == 2){
                        let updateRuleEn = Object.assign({},this.VisaFormEleRule, {[name+'_en']:eleRule});
                        this.$set(this.$data, 'VisaFormEleRule', updateRuleEn);
                    }else{
                        let updateRule = Object.assign({},this.VisaFormEleRule, {[name]:eleRule});
                        this.$set(this.$data, 'VisaFormEleRule', updateRule);
                    }
                }
            },
            //  父组件中的自定义绑定事件，因为子组件中有自身调用，所以需要在这里重新把父组件的事件重新再次声明，
            updateVisaFormEle:function (data) {
                let updateData = Object.assign({},this.VisaFormEle, data);
                this.$set(this.$data,'VisaFormEle',updateData);
            },
            updateChildRules:function (data) {
                let updateData = Object.assign({},this.VisaFormEleRule, data);
                this.$set(this.$data,'VisaFormEleRule',updateData);

            },
            evalTo:function(item){
                item = !item?'':eval(`\/${item}\/`);
                return item;
            },
            translateCh2En:function (name) {
                if(this.VisaFormEle[name+'_cn'] && !this.VisaFormEle[name+'_en']){
                    this.$axios.get(window.API_ROOT + 'rest/translate.chinese.english/v1', {params:{ text: this.VisaFormEle[name+'_cn']}})
                        .then(resp => {
                            !resp.data ? '' : this.$set(this.VisaFormEle,name+'_en',resp.data);
                        })
                }
            },
            translateCh2PY:function (name) {
                if(this.VisaFormEle[name+'_cn'] && !this.VisaFormEle[name+'_en']){
                    this.$axios.get(window.API_ROOT + 'rest/translate.chinese.pinyin/v1', {params:{ text: this.VisaFormEle[name+'_cn']}})
                        .then(resp => {
                            !resp.data ? '' : this.$set(this.VisaFormEle,name+'_en',resp.data);
                        })
                }
            }
        },
        created(){
            // this.setInitEleRule(this.ele);
        },
        beforeUpdate(){
            // this.setInitEleRule(this.ele);
        },
        mounted(){
            console.log('加载');
            this.$nextTick(function () {
                // this.initEleData(this.ele);
            })
        },
        beforeDestroy(){
        },
        destroyed(){
            console.log('销毁');
        }
    };
</script>
<style scoped lang="scss">
    .el-select,
    .width-all{
        width: 100%;
    }
</style>

