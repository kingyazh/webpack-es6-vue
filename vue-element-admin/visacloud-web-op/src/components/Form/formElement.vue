<template>
    <div>
        <el-row type="flex" :gutter="20">
            <template v-if="ele.type == 'text' && ele['translatable'] == 1">
                <el-col :span="!domainIndex?10:22">
                    <el-form-item :prop="ele.name+'_cn'" :label="!ele.comp_label?'':ele.comp_label" :label-width="!ele.comp_label?'':'100px'">
                        <span v-if="ele.comp_label" slot="label">
                            <span v-if="ele.required == 1 && !!ele.comp_label" style="color: #f56c6c">*</span>
                            <el-tooltip :content="!ele.tool_tip?ele.comp_label:ele.tool_tip" placement="left">
                                <span>{{ele.comp_label}}</span>
                            </el-tooltip>
                        </span>
                        <el-input :name="ele.name+'_cn'" v-model="VisaFormEle[ele.name+'_cn']" :placeholder="'中文'" @blur="translateCh2En(ele.name)"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="!ele.comp_label?10:6">
                    <el-form-item :prop="ele.name+'_en'">
                        <el-input :name="ele.name+'_en'" v-model="VisaFormEle[ele.name+'_en']" :placeholder="'英文'" @focus="translateCh2En(ele.name)" class="en_case"></el-input>
                    </el-form-item>
                </el-col>
            </template>

            <template v-if="ele.type == 'text' && ele['translatable'] == 2">
                <el-col :span="!domainIndex?10:22" :gutter="20">
                    <el-form-item :prop="ele.name+'_cn'" :label="!ele.comp_label?'':ele.comp_label" :label-width="!ele.comp_label?'':'100px'">
                        <span v-if="ele.comp_label" slot="label">
                            <span v-if="ele.required == 1 && !!ele.comp_label" style="color: #f56c6c">*</span>
                            <el-tooltip :content="!ele.tool_tip?ele.comp_label:ele.tool_tip" placement="left">
                                <span>{{ele.comp_label}}</span>
                            </el-tooltip>
                        </span>
                        <el-input :name="ele.name+'_cn'" v-model="VisaFormEle[ele.name+'_cn']" :placeholder="'中文'" @blur="translateCh2PY(ele.name)"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="!ele.comp_label?10:6">
                    <el-form-item :prop="ele.name+'_en'">
                        <el-input :name="ele.name+'_en'" v-model="VisaFormEle[ele.name+'_en']" :placeholder="'拼音'" @focus="translateCh2PY(ele.name)" class="en_case"></el-input>
                    </el-form-item>
                </el-col>
            </template>

            <template v-else-if="(ele.type == 'text' && ele['translatable'] == 0) || (ele.type == 'text' && !ele['translatable'])">
                <el-col :span="!domainIndex?10:22">
                    <el-form-item :prop="ele.name" :label="!ele.comp_label?'':ele.comp_label" :label-width="!ele.comp_label?'':'100px'">
                        <el-input :name="ele.name" v-model="VisaFormEle[ele.name]" :placeholder="ele.placeholder||ele.comp_label" :value="ele.default_value"></el-input>
                    </el-form-item>
                </el-col>
            </template>

            <template v-else-if="(ele.type == 'hidden')">
                <el-col :span="!domainIndex?10:22" :style="ele.type == 'hidden'?'display:none;':''">
                    <el-form-item :prop="ele.name">
                        <el-input :name="ele.name" v-model="VisaFormEle[ele.name]" :value="ele.default_value"></el-input>
                    </el-form-item>
                </el-col>
            </template>
            <template v-else-if="(ele.type == 'hidden' && ele['translatable'] == 0) || (ele.type == 'hidden' && !ele['translatable'])">
                    <el-input type="hidden" :name="ele.name" v-model="VisaFormEle[ele.name]" :value="ele.default_value" style="display:none"></el-input>
            </template>

            <template v-else-if="ele.type == 'date'">
                <el-col :span="!domainIndex?10:22">
                    <el-form-item :label="ele.label" :prop="ele.name" :label-width="!ele.comp_label?'':'80px'" :rules="[{type:'number',required:!!Number(ele.required),message:!ele['limit_msg']?'必填项，不能为空':ele['limit_msg']}]">
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
                <el-col :span="!domainIndex?10:22">
                    <el-form-item :label="ele.label" :prop="ele.name" :rules="[{type:'number',required:!!Number(ele.required),message:!ele['limit_msg']?'必填项，不能为空':ele['limit_msg']}]">
                        <el-date-picker :name="ele.name" v-model="VisaFormEle[ele.name]" class="width-all" type="datetime" value-format="timestamp" placeholder="选择日期和时间">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </template>

            <template v-else-if="ele.type == 'time'">
                <el-col :span="!domainIndex?10:22">
                    <el-form-item :label="ele.label" :prop="ele.name" :rules="[{type:'number',required:!!Number(ele.required),message:!ele['limit_msg']?'必填项，不能为空':ele['limit_msg']}]">
                        <el-time-picker :name="ele.name" v-model="VisaFormEle[ele.name]" class="width-all" value-format="timestamp" placeholder="任意时间">
                        </el-time-picker>
                    </el-form-item>
                </el-col>
            </template>

            <template v-else-if="ele.type == 'textfield'">
                <el-col :span="!domainIndex?10:22">
                    <el-form-item :label="ele.label" :prop="ele.name">
                        <el-input :name="ele.name" v-model="VisaFormEle[ele.name]" type="textarea" :rows="3" :placeholder="ele.label"></el-input>
                    </el-form-item>
                </el-col>
            </template>

            <template v-else-if="ele.type == 'select'">
                <el-col :span="!domainIndex?10:22">
                    <el-form-item :label="ele.label" :prop="ele.name" :label-width="!ele.comp_label?'':'100px'">
                        <span slot="label" v-if="ele.comp_label">
                            <el-tooltip :content="!ele.tool_tip?ele.comp_label:ele.tool_tip" placement="left">
                                <span>{{ele.comp_label}}</span>
                            </el-tooltip>
                        </span>
                        <el-select :name="ele.name" v-model="VisaFormEle[ele.name]" :filterable="ele.items.length>15?true:false" :placeholder="ele.label" @change="eleChange($event,'',ele)">
                            <!--<el-option v-for="item in ele.items" v-if="defaultValue(item.checked,ele.name,item.value)" :key="item.value" :label="item.label" :value="item.value">-->
                            <el-option v-for="item in ele.items" :selected="item.checked?'true':''" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </template>

            <template v-else-if="ele.type == 'mselect'">
                <el-col :span="!domainIndex?10:22">
                    <el-form-item :label="ele.label" :prop="ele.name" :rules="[{type:'array',required:!!Number(ele.required),trigger:'change',message:!ele['limit_msg']?'必填项，不能为空':ele['limit_msg']}]">
                        <el-select :name="ele.name" v-model="VisaFormEle[ele.name]" multiple :placeholder="ele.label" @change="eleChange($event,'',ele)">
                            <el-option v-for="item in ele.items" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </template>

            <template v-else-if="ele.type == 'radio'">
                <el-col :span="20">
                    <el-form-item :label="ele.label" :prop="ele.name" align="left">
                        <el-radio :name="ele.name" v-model="VisaFormEle[ele.name]" v-for="(item,index) in ele.items" :key="item.value" :label="item.value" border @change="eleChange($event,index,ele)">{{item.label}}</el-radio>
                    </el-form-item>
                </el-col>
            </template>

            <template v-else-if="ele.type == 'checkbox'">
                <el-col :span="20">
                    <el-form-item :label="ele.label" :prop="ele.name" align="left" :rules="[{type:'array',required:!!Number(ele.required),trigger:'change',message:!ele['limit_msg']?'必填项，不能为空':ele['limit_msg']}]">
                        <el-checkbox-group v-model="VisaFormEle[ele.name]">
                            <el-checkbox :name="ele.name" v-for="(item,index) in ele.items" :key="item.value" :label="item.value" @change="eleChange($event,index,ele)">{{item.label}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-col>
            </template>

        </el-row>
        <template v-for="(child, index) in eleChildren">
            <formElement v-show="child['index']===eleIndex" v-if="hideEleRule(child['index']===eleIndex)" @updateformdata="updateVisaFormEle" :key="index" :ele="child" :elementValue="elementValue" />
        </template>
    </div>
</template>
<script>
    /*eslint-disable*/
    import {translateCh2EnApi,translateCh2PYApi} from "@/api/DictionaryTool";
    export default {
        name: "formElement",
        props: ["domainName","domainIndex","elelabel","ele","elementValue","setHideEleKey"],
        data() {
            return {
                VisaFormEle:{},
                VisaFormEleRule:{},

                formDataChildCache:[],//存储所有子级
                // formDataNullCache:{},//存储未选中的子级
                // formDataChildCache:{},

                eleIndex:-1 //获取联动选项的父元素的 index，更新时触发 eleChildren
            };
        },
        beforeUpdate(){

        },
        computed: {
            eleChildren:function(){
                let childrenItem=[],_this=this,fatherName=this.ele['name'],allChild=[];
                if(!!this.ele.items && Array.isArray(this.ele.items)){
                    this.ele.items.forEach(function (d,i) {
                        if(!!d.children){

                            if(Array.isArray(d.children)){
                                // console.log(fatherName,d,d.label,d.children);
                                d.children.forEach(function (child) {
                                    child['index'] = i;
                                    child['father'] = fatherName;
                                    child['fatherValue'] = d['value'];
                                })
                                childrenItem = [...childrenItem,...d.children];
                            }else{
                                d.children['index']=i;
                                d.children['father'] = fatherName;
                                d.children['fatherValue'] = d['value'];
                                childrenItem.push(d.children);
                            }
                        }
                    });
                }
                allChild = [...this.formDataChildCache,...childrenItem];
                this.$set(this.$data,'formDataChildCache',allChild);
                // console.log(fatherName,this.formDataChildCache);
                return childrenItem;
            },
            eleDataChange:function () {

            }
        },
        watch:{
            VisaFormEle:{
                //  解决方法一、需要用到深度监听，因为VisaForm 是新增属性，且内部属性值进行改变，所以无法监听到（推荐方法）
                handler:function(val){
                    // console.log(val);
                    if(val.hasOwnProperty(this.ele.name+'_en') && val[this.ele.name+'_en']){
                        val[this.ele.name+'_en'] = val[this.ele.name+'_en'].toUpperCase();
                    }
                  // console.log(this.domainName, this.domainIndex);
                    if(this.domainName){
                      this.$emit('updateformdata',{[this.domainName]:{[this.domainIndex]:val}});
                    }else{
                      this.$emit('updateformdata',val);//传入的事件名称只能使用小写，不能使用大写的驼峰规则命名，并不是必然，但data后新增属性，数据更新就无法触发$emit，改为小写就好了。so 小写吧
                    }
                },
                deep:true
            },
            VisaFormEleRule:{
                handler:function(val){
                    this.$emit('updateformrules',val);
                },
                deep:true
            },
            setHideEleKey:{
                handler:function(val){
                    // console.log(val);
                },
                deep:true
            }
        },
        methods: {
            //  当select、mselect、checkbox、radio 等选中时，event为选择select时的option的值，index为checkbox、radio的index
            eleChange:function(event,index,ele){
                // console.log(event,index,ele);
                let eleIndex = -1,_this=this,currentEle,childrenNode;
                currentEle=!ele?this.ele:ele;
                if(currentEle.type === "radio"){
                    event?eleIndex=index:eleIndex=-1;
                    this.$set(this.$data, "eleIndex", eleIndex);
                }else{
                    if(!index){
                        (currentEle.items).forEach(function (v,i) {
                            if(Object.values(v).indexOf(event)>-1){
                                eleIndex=i;
                                _this.$set(_this.$data, "eleIndex", eleIndex);
                            }
                        })
                    }else{
                        if(Object.keys(currentEle.items[index]).indexOf('children') > -1){
                            event?eleIndex=index:eleIndex=-1;
                            this.$set(this.$data, "eleIndex", eleIndex);
                        }
                    }
                }

                // childrenNode = this.ele['items'][this.eleIndex]['children'];
                // for(let i=0,len=childrenNode.length;i<len;i++){
                //     console.log(childrenNode[i]);
                // }
                // this.saveCancelEleKey(currentEle,this.eleIndex);

                this.clearItemValue(currentEle,this.eleIndex);
            },

            //  所有表单元素初始
            initEleData:function (item) {
                let _this = this;
                let itemSelf = !item?this.ele:item;
                let {name,type,translatable,items} = itemSelf;
                let initValue = !this.elementValue?'':this.elementValue[name];
                let itemType = type && type.toString();
                let itemTranslatable = !translatable?0:Number(translatable);
                if(itemType == 'text'){
                    initValue = !initValue?'':initValue;
                    if(itemTranslatable === 1 || itemTranslatable === 2){
                        if(!this.elementValue){
                            this.$set(this.VisaFormEle, name+'_cn', '');
                            this.$set(this.VisaFormEle, name+'_en', '');
                        }else{
                            this.$set(this.VisaFormEle, name+'_cn', !this.elementValue[name+'_cn']?'':this.elementValue[name+'_cn']);
                            this.$set(this.VisaFormEle, name+'_en', !this.elementValue[name+'_en']?'':this.elementValue[name+'_en']);
                        }
                    }else {
                        this.$set(this.VisaFormEle, name, initValue);
                    }
                }else if(itemType == 'checkbox' || itemType == 'mselect'){
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
                }else if(itemType == 'radio' || itemType == 'select'){
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
                }else if(itemType == 'mun'){
                    initValue = !initValue?0:initValue;
                    this.$set(this.VisaFormEle, name, initValue);
                }else {
                    initValue = !initValue?'':initValue;
                    this.$set(this.VisaFormEle, name, initValue);
                }
            },
            //  set the select or radio or checkbox default value for form rules
          // 在select 中选择后，居然又遍历了一次，所以导致无法修改选择的选项，注释掉，备用
            defaultValue(checked,name,value,more){
              // console.log(checked, name, value, more);
                // if(checked && !more){
                //     // console.log(name,value,more);
                //     this.$set(this.VisaFormEle,name,value);
                // }else if(checked && Array.isArray(this.VisaFormEle[name])){
                //     // this.$set(this.VisaFormEle,name,[value]);
                //     // if(this.VisaFormEle[name].indexOf(value)<0){
                //     //     let arrayMore = this.VisaFormEle[name].push(value);
                //     //     this.$set(this.VisaFormEle,name,arrayMore);
                //     // }
                //     // console.log(this.VisaFormEle[name]);
                // }
                return true;
            },
            //  父组件中的自定义绑定事件，因为子组件中有自身调用，所以需要在这里重新把父组件的事件重新再次声明，
            updateVisaFormEle:function (data) {
                // console.log(data);
                let updateData = Object.assign({},this.VisaFormEle, data);
                this.$set(this.$data,'VisaFormEle',updateData);
            },
            updateChildRules:function (data) {
                let updateData = Object.assign({},this.VisaFormEleRule, data);
                this.$set(this.$data,'VisaFormEleRule',updateData);

            },
            saveChild:function(child){
                console.log(child['name']);
                return true;
            },
            //  切换选项后，存储隐藏的子元素的key
            clearItemValue:function(currentEle,originEleIndex){
                // console.log(originEleIndex);
                let _this=this,currentChildren=currentEle['items'],theName=currentEle['name'];
                if(originEleIndex>-1 || (this.ele['type']==='checkbox'&&originEleIndex===-1)){
                    for(let i = 0,len=currentChildren.length; i < len; i++) {
                        // if(currentChildren[i]['father']=name && currentChildren[i]['index']!=originEleIndex){

                        //mselect checkbox 的反选项
                        if(Array.isArray(_this.VisaFormEle[theName]) && _this.VisaFormEle[theName].indexOf(currentChildren[i]['value'])<0){
                            //mselect checkbox 的反选项
                            if(Array.isArray(currentChildren[i]['children'])){
                                let otherItem = currentChildren[i]['children'];
                                for(let j = 0,len=otherItem.length; j < len; j++){
                                    _this.itemValueNull(otherItem[j]);
                                }
                            }else{
                                _this.itemValueNull(currentChildren[i]['children']);
                            }
                        }
                        // console.log(currentChildren[i],currentChildren[i]['index'], originEleIndex);
                        if(typeof _this.VisaFormEle[theName]==='string' && i!=originEleIndex){
                            // console.log(currentChildren[i]['children']);
                            if(Array.isArray(currentChildren[i]['children'])){
                                let otherItem = currentChildren[i]['children'];
                                for(let j = 0,len=otherItem.length; j < len; j++){
                                    // console.log(otherItem[j]['name']);
                                    _this.itemValueNull(otherItem[j]);
                                }
                            }else{
                                _this.itemValueNull(currentChildren[i]['children']);
                            }
                        }
                    }
                }

                return true;
            },
            itemValueNull:function(item){
                if(!!item&&!!item['name']){
                    this.$set(this.VisaFormEle,item['name'],'');
                    // console.log(item);
                    if(item['translatable']){
                        this.$set(this.VisaFormEle,item['name']+'_cn','');
                        this.$set(this.VisaFormEle,item['name']+'_en','');
                    }
                    // console.log(this.VisaFormEle,item['name'],this.VisaFormEle[item['name']]);
                }
            },
            hideEleRule(hideEle){
                return (!this.setHideEleKey && !hideEle)?false:true;
            },
            evalTo:function(item){
                item = !item?'':eval(`\/${item}\/`);
                return item;
            },
            //  汉译英接口
            translateCh2En:function (name) {
                if(this.VisaFormEle[name+'_cn'] && !this.VisaFormEle[name+'_en']){
                    translateCh2EnApi({ text: this.VisaFormEle[name+'_cn']})
                        .then(resp => {
                            !resp.data ? '' : this.$set(this.VisaFormEle,name+'_en',resp.data);
                        })
                }
            },
            //  汉译拼音接口
            translateCh2PY:function (name) {
                if(this.VisaFormEle[name+'_cn'] && !this.VisaFormEle[name+'_en']){
                    translateCh2EnApi({ text: this.VisaFormEle[name+'_cn']})
                        .then(resp => {
                            !resp.data ? '' : this.$set(this.VisaFormEle,name+'_en',resp.data);
                        })
                }
            },
            //  自动翻译接口
            autoTranslate:function (ele) {
                if(!!ele['translatable'] && ele['translatable'] == '1' && !!this.VisaFormEle[ele.name+'_en']){
                    this.translateCh2En(ele.name);
                }
                if(!!ele['translatable'] && ele['translatable'] == '2' && !!this.VisaFormEle[ele.name+'_en']){
                    this.translateCh2PY(ele.name);
                }
            },
        },
        beforeCreate(){
            // console.log('创建前');
        },
        created(){
            // this.setInitEleRule(this.ele);
        },
        beforeUpdate(){
            // this.setInitEleRule(this.ele);
        },
        mounted(){
            // console.log('加载');
            // console.log(this.setHideEleKey);
            this.$nextTick(function () {
                this.initEleData(this.ele);
            })
        },
        beforeDestroy(){
        },
        destroyed(){
            // console.log('销毁');
        }
    };
</script>
<style scoped lang="scss">
    .el-select,
    .width-all{
        width: 100%;
    }
</style>

