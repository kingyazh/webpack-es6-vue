<template>
    <el-container>
        <el-main>
            <el-form :model="formData" ref="VisaForm" size="mini" label-position="right" label-width="190px">
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
                            <!--<template v-for="(item, comIndex) in input.components">-->
                            <!--<formElement @updateformdata="updateForm" :key="comIndex" :elelabel="input.row_label" :ele="item" :elementValue="formElementsValue"/>-->
                            <!--</template>-->

                            <template v-for="(ele, comIndex) in input.components">
                                <el-row type="flex" :gutter="20">


                                    <template v-if="ele.type == 'text' && ele.translatable == 1">
                                        <el-col :span="10">
                                            <el-form-item :prop="ele.name+'_cn'" :label="!ele.comp_label?'':ele.comp_label" :label-width="!ele.comp_label?'':'100px'">
                                                <div slot="label">
                                                    <span v-if="ele.required == 1 && !!ele.comp_label" style="color: #f56c6c">*</span>
                                                    <el-tooltip :content="!ele.tool_tip?ele.comp_label:ele.tool_tip" placement="left">
                                                        <span>{{ele.comp_label}}</span>
                                                    </el-tooltip>
                                                </div>
                                                <el-input :name="ele.name+'_cn'" v-model="formData[ele.name+'_cn']" :placeholder="'中文'" @blur="translateCh2En(ele.name)"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="!ele.comp_label?10:6">
                                            <el-form-item :prop="ele.name+'_en'" :rules="[{required:!!Number(ele.required),message:'必填项，不能为空'},{pattern:evalTo(ele.limit),message:!ele.limit_msg?'必填项，不能为空':ele.limit_msg}]">
                                                <el-input :name="ele.name+'_en'" v-model="formData[ele.name+'_en']" :placeholder="'英文'" @focus="translateCh2En(ele.name)" class="en_case"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </template>

                                    <template v-if="ele.type == 'text' && ele.translatable == 2">
                                        <el-col :span="10">
                                            <el-form-item :prop="ele.name+'_cn'" :label="!ele.comp_label?'':ele.comp_label" :label-width="!ele.comp_label?'':'100px'">
                                                <div slot="label">
                                                    <span v-if="ele.required == 1 && !!ele.comp_label" style="color: #f56c6c">*</span>
                                                    <el-tooltip :content="!ele.tool_tip?ele.comp_label:ele.tool_tip" placement="left">
                                                        <span>{{ele.comp_label}}</span>
                                                    </el-tooltip>
                                                </div>
                                                <el-input :name="ele.name+'_cn'" v-model="formData[ele.name+'_cn']" :placeholder="'中文'" @blur="translateCh2PY(ele.name)"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="!ele.comp_label?10:6">
                                            <el-form-item :prop="ele.name+'_en'" :rules="[{required:!!Number(ele.required),message:'必填项，不能为空'},{pattern:evalTo(ele.limit),message:!ele.limit_msg?'必填项，不能为空':ele.limit_msg}]">
                                                <el-input :name="ele.name+'_en'" v-model="formData[ele.name+'_en']" :placeholder="'拼音'" @focus="translateCh2PY(ele.name)" class="en_case"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </template>

                                    <template v-else-if="(ele.type == 'text' && ele.translatable == 0) || (ele.type == 'text' && !ele.translatable)">
                                        <el-col :span="10">
                                            <el-form-item :prop="ele.name" :label="!ele.comp_label?'':ele.comp_label" :label-width="!ele.comp_label?'':'100px'" :rules="[{required:!!Number(ele.required),message:'必填项，不能为空'},{pattern:evalTo(ele.limit),message:!ele.limit_msg?'必填项，不能为空':ele.limit_msg}]">
                                                <el-input :name="ele.name" v-model="formData[ele.name]" :placeholder="ele.placeholder||ele.comp_label" class="en_case"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </template>

                                    <template v-else-if="ele.type == 'hidden'">
                                        <el-col :span="10">
                                            <el-form-item>
                                                <el-input type="hidden" :name="ele.name" v-model="formData[ele.name]" style="display: none;"></el-input>
                                            </el-form-item>
                                        </el-col>

                                    </template>

                                    <template v-else-if="ele.type == 'date'">
                                        <el-col :span="10">
                                            <el-form-item :label="ele.label" :prop="ele.name" :label-width="!ele.comp_label?'':'80px'" :rules="[{type:'number',required:!!Number(ele.required),message:'必填项，不能为空'}]">
                                            <span slot="label" v-if="ele.comp_label">
                                                <el-tooltip :content="!ele.tool_tip?ele.comp_label:ele.tool_tip" placement="left">
                                                    <span>{{ele.comp_label}}</span>
                                                </el-tooltip>
                                            </span>
                                                <el-date-picker :name="ele.name" v-model="formData[ele.name]" format="yyyy 年 MM 月 dd 日" value-format="timestamp" class="width-all" type="date" placeholder="选择日期" :clearable="false">
                                                </el-date-picker>
                                            </el-form-item>
                                        </el-col>
                                    </template>

                                    <template v-else-if="ele.type == 'datetime'">
                                        <el-col :span="10">
                                            <el-form-item :label="ele.label" :prop="ele.name" :rules="[{type:'number',required:!!Number(ele.required),message:'必填项，不能为空'}]">
                                                <el-date-picker :name="ele.name" v-model="formData[ele.name]" class="width-all" type="datetime" value-format="timestamp" placeholder="选择日期和时间">
                                                </el-date-picker>
                                            </el-form-item>
                                        </el-col>
                                    </template>

                                    <template v-else-if="ele.type == 'time'">
                                        <el-col :span="10">
                                            <el-form-item :label="ele.label" :prop="ele.name" :rules="[{type:'number',required:!!Number(ele.required),message:'必填项，不能为空'}]">
                                                <el-time-picker :name="ele.name" v-model="formData[ele.name]" class="width-all" value-format="timestamp" placeholder="任意时间">
                                                </el-time-picker>
                                            </el-form-item>
                                        </el-col>
                                    </template>

                                    <template v-else-if="ele.type == 'textfield'">
                                        <el-col :span="10">
                                            <el-form-item :label="ele.label" :prop="ele.name" :rules="[{required:!!Number(ele.required),message:'必填项，不能为空'}]">
                                                <el-input :name="ele.name" v-model="formData[ele.name]" type="textarea" :rows="3" :placeholder="ele.label"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </template>

                                    <template v-else-if="ele.type == 'select'">
                                        <el-col :span="10">
                                            <el-form-item :label="ele.label" :prop="ele.name" :label-width="!ele.comp_label?'':'100px'" :rules="[{required:!!Number(ele.required),message:'必填项，不能为空',trigger:'change'}]">
                                                <span slot="label" v-if="ele.comp_label">
                                                    <el-tooltip :content="!ele.tool_tip?ele.comp_label:ele.tool_tip" placement="left">
                                                        <span>{{ele.comp_label}}</span>
                                                    </el-tooltip>
                                                </span>
                                                <el-select :name="ele.name" v-model="formData[ele.name]" :filterable="ele.items.length>15?true:false" :placeholder="ele.label" @change="eleChange($event,'',ele)">
                                                    <el-option v-for="item in ele.items" :key="item.value" :label="item.label" :value="item.value">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                    </template>

                                    <template v-else-if="ele.type == 'mselect'">
                                        <el-col :span="10">
                                            <el-form-item :label="ele.label" :prop="ele.name" :rules="[{required:!!Number(ele.required),message:'必填项，不能为空',trigger:'change'}]">
                                                <el-select :name="ele.name" v-model="formData[ele.name]" multiple :placeholder="ele.label" @change="eleChange($event,'',ele)">
                                                    <el-option v-for="item in ele.items" :key="item.value" :label="item.label" :value="item.value">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                    </template>

                                    <template v-else-if="ele.type == 'radio'">
                                        <el-col :span="20">
                                            <el-form-item :label="ele.label" :prop="ele.name" align="left" :rules="[{required:!!Number(ele.required),message:'必填项，不能为空',trigger:'change'}]">
                                                <el-radio :name="ele.name" v-model="formData[ele.name]" v-for="(item,index) in ele.items" :key="item.value" :label="item.value" border @change="eleChange($event,index,ele)">{{item.label}}</el-radio>
                                            </el-form-item>
                                        </el-col>
                                    </template>

                                    <template v-else-if="ele.type == 'checkbox'">
                                        <el-col :span="20">
                                            <el-form-item :label="ele.label" :prop="ele.name" align="left" :rules="[{required:!!Number(ele.required),message:'必填项，不能为空',trigger:'change'}]">
                                                <el-checkbox-group v-model="formData[ele.name]">
                                                    <el-checkbox :name="ele.name" v-for="(item,index) in ele.items" :key="item.value" :label="item.value" @change="eleChange($event,index,ele)">{{item.label}}</el-checkbox>
                                                </el-checkbox-group>
                                            </el-form-item>
                                        </el-col>

                                    </template>


                                </el-row>
                                <!--// 联动子元素为数组时调用，例如：某些 radio 下的子元素-->
                                <template v-if="['radio','checkbox','select'].indexOf(ele.type)>-1 && ele.items" v-for="(eleChild,index) in ele.items">
                                    <template v-if="Array.isArray(eleChild.children)">
                                        <template v-for="(children,eleIndex) in eleChild.children">
                                            <!--<formElement v-show="formData[ele.name] == eleChild.value" @updateformdata="updateForm" :elelabel="!children.comp_label?'':children.comp_label" :ele="children" :elementValue="formElementsValue"/>-->
                                            <el-row type="flex" :gutter="20" v-show="formData[ele.name] == eleChild.value">

                                                <template v-if="children.type == 'text' && children.translatable == 1">
                                                    <el-col :span="10">
                                                        <el-form-item :prop="children.name+'_cn'" :label="!children.comp_label?'':children.comp_label" :label-width="!children.comp_label?'':'100px'">
                                                            <span slot="label">
                                                                <span v-if="children.required == 1 && !!children.comp_label" style="color: #f56c6c">*</span>
                                                                <el-tooltip :content="!children.tool_tip?children.comp_label:children.tool_tip" placement="left">
                                                                    <span>{{children.comp_label}}</span>
                                                                </el-tooltip>
                                                            </span>
                                                            <el-input :name="children.name+'_cn'" v-model="formData[children.name+'_cn']" :placeholder="'中文'" @blur="translateCh2En(children.name)"></el-input>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="!children.comp_label?10:6">
                                                        <el-form-item :prop="children.name+'_en'" :ref="children.name+'_en'" :rules="[{required:!!Number(children.required),message:'必填项，不能为空'},{pattern:evalTo(children.limit),message:!children.limit_msg?'必填项，不能为空':children.limit_msg}]">
                                                            <el-input :name="children.name+'_en'" v-model="formData[children.name+'_en']" :placeholder="'英文'" @focus="translateCh2En(children.name)" class="en_case"></el-input>
                                                        </el-form-item>
                                                    </el-col>
                                                </template>

                                                <template v-if="children.type == 'text' && children.translatable == 2">
                                                    <el-col :span="10">
                                                        <el-form-item :prop="children.name+'_cn'" :label="!children.comp_label?'':children.comp_label" :label-width="!children.comp_label?'':'100px'">
                                                            <span slot="label">
                                                                <span v-if="children.required == 1 && !!children.comp_label" style="color: #f56c6c">*</span>
                                                                <el-tooltip :content="!children.tool_tip?children.comp_label:children.tool_tip" placement="left">
                                                                    <span>{{children.comp_label}}</span>
                                                                </el-tooltip>
                                                            </span>
                                                            <el-input :name="children.name+'_cn'" v-model="formData[children.name+'_cn']" :placeholder="'中文'" @blur="translateCh2PY(children.name)"></el-input>
                                                        </el-form-item>
                                                    </el-col>
                                                    <el-col :span="!children.comp_label?10:6">
                                                        <el-form-item :prop="children.name+'_en'" :ref="children.name+'_en'" :rules="[{required:!!Number(children.required),message:'必填项，不能为空'},{pattern:evalTo(children.limit),message:!children.limit_msg?'必填项，不能为空':children.limit_msg}]">
                                                            <el-input :name="children.name+'_en'" v-model="formData[children.name+'_en']" :placeholder="'拼音'" @focus="translateCh2PY(children.name)" class="en_case"></el-input>
                                                        </el-form-item>
                                                    </el-col>
                                                </template>

                                                <template v-else-if="(children.type == 'text' && children.translatable == 0) || (children.type == 'text' && !children.translatable)">
                                                    <el-col :span="10">
                                                        <el-form-item :prop="children.name" :ref="children.name" :label="!children.comp_label?'':children.comp_label" :label-width="!children.comp_label?'':'100px'" :rules="[{required:!!Number(children.required),message:'必填项，不能为空'},{pattern:evalTo(children.limit),message:!children.limit_msg?'必填项，不能为空':children.limit_msg}]">
                                                            <el-input :name="children.name" v-model="formData[children.name]" :placeholder="children.placeholder||children.comp_label" class="en_case"></el-input>
                                                        </el-form-item>
                                                    </el-col>
                                                </template>

                                                <template v-else-if="children.type == 'date'">
                                                    <el-col :span="10">
                                                        <el-form-item :label="children.label" :prop="children.name" :ref="children.name" :label-width="!children.comp_label?'':'80px'" :rules="[{type:'number',required:!!Number(children.required),message:'必填项，不能为空'}]">
                                                            <span slot="label" v-if="children.comp_label">
                                                                <el-tooltip :content="!children.tool_tip?children.comp_label:children.tool_tip" placement="left">
                                                                    <span>{{children.comp_label}}</span>
                                                                </el-tooltip>
                                                            </span>
                                                            <el-date-picker :name="children.name" v-model="formData[children.name]" format="yyyy 年 MM 月 dd 日" value-format="timestamp" class="width-all" type="date" placeholder="选择日期" :clearable="false">
                                                            </el-date-picker>
                                                        </el-form-item>
                                                    </el-col>
                                                </template>

                                                <template v-else-if="children.type == 'datetime'">
                                                    <el-col :span="10">
                                                        <el-form-item :label="children.label" :prop="children.name" :ref="children.name" :rules="[{type:'number',required:!!Number(children.required),message:'必填项，不能为空'}]">
                                                            <el-date-picker :name="children.name" v-model="formData[children.name]" class="width-all" type="datetime" value-format="timestamp" placeholder="选择日期和时间">
                                                            </el-date-picker>
                                                        </el-form-item>
                                                    </el-col>
                                                </template>

                                                <template v-else-if="children.type == 'time'">
                                                    <el-col :span="10">
                                                        <el-form-item :label="children.label" :prop="children.name" :ref="children.name" :rules="[{type:'number',required:!!Number(children.required),message:'必填项，不能为空'}]">
                                                            <el-time-picker :name="children.name" v-model="formData[children.name]" class="width-all" value-format="timestamp" placeholder="任意时间">
                                                            </el-time-picker>
                                                        </el-form-item>
                                                    </el-col>
                                                </template>

                                                <template v-else-if="children.type == 'textfield'">
                                                    <el-col :span="10">
                                                        <el-form-item :label="children.label" :prop="children.name" :ref="children.name" :rules="[{required:!!Number(children.required),message:'必填项，不能为空'}]">
                                                            <el-input :name="children.name" v-model="formData[children.name]" type="textarea" :rows="3" :placeholder="children.label"></el-input>
                                                        </el-form-item>
                                                    </el-col>
                                                </template>

                                                <template v-else-if="children.type == 'select'">
                                                    <el-col :span="10">
                                                        <el-form-item :label="children.label" :prop="children.name" :ref="children.name" :label-width="!children.comp_label?'':'100px'" :rules="[{required:!!Number(children.required),message:'必填项，不能为空',trigger:'change'}]">
                                                            <span slot="label" v-if="children.comp_label">
                                                                <el-tooltip :content="!children.tool_tip?children.comp_label:children.tool_tip" placement="left">
                                                                    <span>{{children.comp_label}}</span>
                                                                </el-tooltip>
                                                            </span>
                                                            <el-select :name="children.name" v-model="formData[children.name]" :filterable="children.items.length>15?true:false" :placeholder="children.label" @change="eleChange($event,'',children)">
                                                                <el-option v-for="item in children.items" :key="item.value" :label="item.label" :value="item.value">
                                                                </el-option>
                                                            </el-select>
                                                        </el-form-item>
                                                    </el-col>
                                                </template>

                                                <template v-else-if="children.type == 'mselect'">
                                                    <el-col :span="10">
                                                        <el-form-item :label="children.label" :prop="children.name" :ref="children.name" :rules="[{required:!!Number(children.required),message:'必填项，不能为空',trigger:'change'}]">
                                                            <el-select :name="children.name" v-model="formData[children.name]" multiple :placeholder="children.label" @change="eleChange($event,'',children)">
                                                                <el-option v-for="item in children.items" :key="item.value" :label="item.label" :value="item.value">
                                                                </el-option>
                                                            </el-select>
                                                        </el-form-item>
                                                    </el-col>
                                                </template>

                                                <template v-else-if="children.type == 'radio'">
                                                    <el-col :span="20">
                                                        <el-form-item :label="children.label" :prop="children.name" :ref="children.name" align="left" :rules="[{required:!!Number(children.required),message:'必填项，不能为空',trigger:'change'}]">
                                                            <el-radio :name="children.name" v-model="formData[children.name]" v-for="(item,index) in children.items" :key="item.value" :label="item.value" border @change="eleChange($event,index,children)">{{item.label}}</el-radio>
                                                        </el-form-item>
                                                    </el-col>
                                                </template>

                                                <template v-else-if="children.type == 'checkbox'">
                                                    <el-col :span="20">
                                                        <el-form-item :label="children.label" :prop="children.name" :ref="children.name" align="left" :rules="[{required:!!Number(children.required),message:'必填项，不能为空',trigger:'change'}]">
                                                            <el-checkbox-group v-model="formData[children.name]">
                                                                <el-checkbox :name="children.name" v-for="(item,index) in children.items" :key="item.value" :label="item.value" @change="eleChange($event,index,children)">{{item.label}}</el-checkbox>
                                                            </el-checkbox-group>
                                                        </el-form-item>
                                                    </el-col>

                                                </template>
                                            </el-row>

                                        </template>
                                    </template>
                                    <!--// 联动子元素不为数组时调用，例如：checkbox 下的子元素-->
                                    <template v-if="typeof eleChild.children=='object' && !Array.isArray(eleChild.children)">
                                        <!--<formElement v-show="[...formData[ele.name]].indexOf(eleChild.value)>-1" @updateformdata="updateForm" :elelabel="true" :ele="eleChild.children" :elementValue="formElementsValue"/>-->

                                        <el-row type="flex" :gutter="20" v-show="[...formData[ele.name]].indexOf(eleChild.value)>-1">

                                            <template v-if="eleChild.children.type == 'text' && eleChild.children.translatable == 1">
                                                <el-col :span="10">
                                                    <el-form-item :prop="eleChild.children.name+'_cn'" :label="!eleChild.children.comp_label?'':eleChild.children.comp_label" :label-width="!eleChild.children.comp_label?'':'100px'">
                                                        <span slot="label">
                                                            <span v-if="eleChild.children.required == 1 && !!eleChild.children.comp_label" style="color: #f56c6c">*</span>
                                                            <el-tooltip :content="!eleChild.children.tool_tip?eleChild.children.comp_label:eleChild.children.tool_tip" placement="left">
                                                                <span>{{eleChild.children.comp_label}}</span>
                                                            </el-tooltip>
                                                        </span>
                                                        <el-input :name="eleChild.children.name+'_cn'" v-model="formData[eleChild.children.name+'_cn']" :placeholder="'中文'" @blur="translateCh2En(eleChild.children.name)"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="!eleChild.children.comp_label?10:6">
                                                    <el-form-item :prop="eleChild.children.name+'_en'" :ref="eleChild.children.name+'_en'" :rules="[{required:!!Number(eleChild.children.required),message:'必填项，不能为空'},{pattern:evalTo(eleChild.children.limit),message:!eleChild.children.limit_msg?'必填项，不能为空':eleChild.children.limit_msg}]">
                                                        <el-input :name="eleChild.children.name+'_en'" v-model="formData[eleChild.children.name+'_en']" :placeholder="'英文'" @focus="translateCh2En(eleChild.children.name)" class="en_case"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </template>

                                            <template v-if="eleChild.children.type == 'text' && eleChild.children.translatable == 2">
                                                <el-col :span="10">
                                                    <el-form-item :prop="eleChild.children.name+'_cn'" :label="!eleChild.children.comp_label?'':eleChild.children.comp_label" :label-width="!eleChild.children.comp_label?'':'100px'">
                                                        <span slot="label">
                                                            <span v-if="eleChild.children.required == 1 && !!eleChild.children.comp_label" style="color: #f56c6c">*</span>
                                                            <el-tooltip :content="!eleChild.children.tool_tip?eleChild.children.comp_label:eleChild.children.tool_tip" placement="left">
                                                                <span>{{eleChild.children.comp_label}}</span>
                                                            </el-tooltip>
                                                        </span>
                                                        <el-input :name="eleChild.children.name+'_cn'" v-model="formData[eleChild.children.name+'_cn']" :placeholder="'中文'" @blur="translateCh2PY(eleChild.children.name)"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="!eleChild.children.comp_label?10:6">
                                                    <el-form-item :prop="eleChild.children.name+'_en'" :ref="eleChild.children.name+'_en'" :rules="[{required:!!Number(eleChild.children.required),message:'必填项，不能为空'},{pattern:evalTo(eleChild.children.limit),message:!eleChild.children.limit_msg?'必填项，不能为空':eleChild.children.limit_msg}]">
                                                        <el-input :name="eleChild.children.name+'_en'" v-model="formData[eleChild.children.name+'_en']" :placeholder="'拼音'" @focus="translateCh2PY(eleChild.children.name)" class="en_case"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </template>

                                            <template v-else-if="(eleChild.children.type == 'text' && eleChild.children.translatable == 0) || (eleChild.children.type == 'text' && !eleChild.children.translatable)">
                                                <el-col :span="10">
                                                    <el-form-item :prop="eleChild.children.name" :ref="eleChild.children.name" :label="!eleChild.children.comp_label?'':eleChild.children.comp_label" :label-width="!eleChild.children.comp_label?'':'100px'" :rules="[{required:!!Number(eleChild.children.required),message:'必填项，不能为空'},{pattern:evalTo(eleChild.children.limit),message:!eleChild.children.limit_msg?'必填项，不能为空':eleChild.children.limit_msg}]">
                                                        <el-input :name="eleChild.children.name" v-model="formData[eleChild.children.name]" :placeholder="eleChild.children.placeholder||eleChild.children.comp_label" class="en_case"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </template>

                                            <template v-else-if="eleChild.children.type == 'date'">
                                                <el-col :span="10">
                                                    <el-form-item :label="eleChild.children.label" :ref="eleChild.children.name" :prop="eleChild.children.name" :label-width="!eleChild.children.comp_label?'':'80px'" :rules="[{type:'number',required:!!Number(eleChild.children.required),message:'必填项，不能为空'}]">
                                                        <span slot="label" v-if="eleChild.children.comp_label">
                                                            <el-tooltip :content="!eleChild.children.tool_tip?eleChild.children.comp_label:eleChild.children.tool_tip" placement="left">
                                                                <span>{{eleChild.children.comp_label}}</span>
                                                            </el-tooltip>
                                                        </span>
                                                        <el-date-picker :name="eleChild.children.name" v-model="formData[eleChild.children.name]" format="yyyy 年 MM 月 dd 日" value-format="timestamp" class="width-all" type="date" placeholder="选择日期" :clearable="false">
                                                        </el-date-picker>
                                                    </el-form-item>
                                                </el-col>
                                            </template>

                                            <template v-else-if="eleChild.children.type == 'datetime'">
                                                <el-col :span="10">
                                                    <el-form-item :label="eleChild.children.label" :ref="eleChild.children.name" :prop="eleChild.children.name" :rules="[{type:'number',required:!!Number(eleChild.children.required),message:'必填项，不能为空'}]">
                                                        <el-date-picker :name="eleChild.children.name" v-model="formData[eleChild.children.name]" class="width-all" type="datetime" value-format="timestamp" placeholder="选择日期和时间">
                                                        </el-date-picker>
                                                    </el-form-item>
                                                </el-col>
                                            </template>

                                            <template v-else-if="eleChild.children.type == 'time'">
                                                <el-col :span="10">
                                                    <el-form-item :label="eleChild.children.label" :prop="eleChild.children.name" :ref="eleChild.children.name" :rules="[{type:'number',required:!!Number(eleChild.children.required),message:'必填项，不能为空'}]">
                                                        <el-time-picker :name="eleChild.children.name" v-model="formData[eleChild.children.name]" class="width-all" value-format="timestamp" placeholder="任意时间">
                                                        </el-time-picker>
                                                    </el-form-item>
                                                </el-col>
                                            </template>

                                            <template v-else-if="eleChild.children.type == 'textfield'">
                                                <el-col :span="10">
                                                    <el-form-item :label="eleChild.children.label" :prop="eleChild.children.name" :ref="eleChild.children.name" :rules="[{required:!!Number(eleChild.children.required),message:'必填项，不能为空'}]">
                                                        <el-input :name="eleChild.children.name" v-model="formData[eleChild.children.name]" type="textarea" :rows="3" :placeholder="eleChild.children.label"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </template>

                                            <template v-else-if="eleChild.children.type == 'select'">
                                                <el-col :span="10">
                                                    <el-form-item :label="eleChild.children.label" :prop="eleChild.children.name" :ref="eleChild.children.name" :label-width="!eleChild.children.comp_label?'':'100px'" :rules="[{required:!!Number(eleChild.children.required),message:'必填项，不能为空',trigger:'change'}]">
                                                        <span slot="label" v-if="eleChild.children.comp_label">
                                                            <el-tooltip :content="!eleChild.children.tool_tip?eleChild.children.comp_label:eleChild.children.tool_tip" placement="left">
                                                                <span>{{eleChild.children.comp_label}}</span>
                                                            </el-tooltip>
                                                        </span>
                                                        <el-select :name="eleChild.children.name" v-model="formData[eleChild.children.name]" :filterable="eleChild.children.items.length>15?true:false" :placeholder="eleChild.children.label" @change="eleChange($event,'',eleChild.children)">
                                                            <el-option v-for="item in eleChild.children.items" :key="item.value" :label="item.label" :value="item.value">
                                                            </el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </el-col>
                                            </template>

                                            <template v-else-if="eleChild.children.type == 'mselect'">
                                                <el-col :span="10">
                                                    <el-form-item :label="eleChild.children.label" :prop="eleChild.children.name" :ref="eleChild.children.name" :rules="[{required:!!Number(eleChild.children.required),message:'必填项，不能为空',trigger:'change'}]">
                                                        <el-select :name="eleChild.children.name" v-model="formData[eleChild.children.name]" multiple :placeholder="eleChild.children.label" @change="eleChange($event,'',eleChild.children)">
                                                            <el-option v-for="item in eleChild.children.items" :key="item.value" :label="item.label" :value="item.value">
                                                            </el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </el-col>
                                            </template>

                                            <template v-else-if="eleChild.children.type == 'radio'">
                                                <el-col :span="20">
                                                    <el-form-item :label="eleChild.children.label" :prop="eleChild.children.name" :ref="eleChild.children.name" align="left" :rules="[{required:!!Number(eleChild.children.required),message:'必填项，不能为空',trigger:'change'}]">
                                                        <el-radio :name="eleChild.children.name" v-model="formData[eleChild.children.name]" v-for="(item,index) in eleChild.children.items" :key="item.value" :label="item.value" border @change="eleChange($event,index,eleChild.children)">{{item.label}}</el-radio>
                                                    </el-form-item>
                                                </el-col>
                                            </template>

                                            <template v-else-if="eleChild.children.type == 'checkbox'">
                                                <el-col :span="20">
                                                    <el-form-item :label="eleChild.children.label" :prop="eleChild.children.name" :ref="eleChild.children.name" align="left" :rules="[{required:!!Number(eleChild.children.required),message:'必填项，不能为空',trigger:'change'}]">
                                                        <el-checkbox-group v-model="formData[eleChild.children.name]">
                                                            <el-checkbox :name="eleChild.children.name" v-for="(item,index) in eleChild.children.items" :key="item.value" :label="item.value" @change="eleChange($event,index,eleChild.children)">{{item.label}}</el-checkbox>
                                                        </el-checkbox-group>
                                                    </el-form-item>
                                                </el-col>

                                            </template>
                                        </el-row>
                                    </template>
                                </template>
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
            <!-- // this is a layer for view the pdf -->
            <!--<div v-if="!!pdfLink">-->
            <!--<iframe class="pdfIframe" :src="pdfLink" frameborder="0"></iframe>-->
            <!--<div></div>-->
            <!--</div>-->
        </el-main>
    </el-container>
</template>
<script>
    // import formElement from "./formElement";
    export default {
        // components: { formElement },
        name: "formTable",
        props: ["formRule","formElementsData","formElementsValue","formParams"],
        data() {
            return {
                formData: {},
                formRules:{},
                // formChildData:{},
                formElementsJsonData:{},
                formDataNullCache:{},
                formDataChildCache:{},
                eleIndex:-1,
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
            },
            formElementsJsonData:{
                handler:function(val,oldval){
                    let _this = this,originEleIndex;
                    //  从接口读取的表单结构，数据不会变，所以此处只会调用一次
                    //  遍历所有节点
                    val.domains.forEach(function (domain) {
                        domain.rows.forEach(function (row) {
                            row.components.forEach(function (component,comIndex) {
                                //  在递归中插入改动数据，数据中有值用数据中的值，无值的用默认值
                                if(!_this.formData[component.name]){
                                    !component['default_value']?'':_this.$set(_this.formData,component.name,component['default_value']);
                                }
                                _this.autoTranslate(component);
                                //  radio、checkbox、select、more select
                                if(Array.isArray(component.items)){
                                    component.items.forEach(function (item,itIndex) {
                                        //  在递归中插入改动数据，数据中有值用数据中的值，无值的用默认值
                                        if(!!item['checked'] && !_this.formData[component.name]){
                                            _this.$set(_this.formData,component.name,item['value']);
                                        }
                                        //  在递归中插入改动数据，关于联动属性有值时，加载联动子级内容
                                        if(component.type=='radio' || component.type=='checkbox'){
                                            if(_this.formData[component.name] && _this.formData[component.name].indexOf(item.value)>-1){// 字符串包含时indexOf都为0（效率比==低），数组包含时indexOf大于-1
                                                // console.log(component.name,_this.formData[component.name] , item.value);
                                                _this.eleChange(item.value,itIndex,component);
                                            }
                                        }else if(component.type=='select'){
                                            if(_this.formData[component.name] == item.value){
                                                // console.log(component.name,_this.formData[component.name] , item.value);
                                                _this.eleChange(item.value,'',component);
                                            }
                                        }
                                        //  因为父级遍历时已经将子级遍历一遍，再次遍历时覆盖掉了之前的值，此值为最后值
                                        // if(!!item.children && _this.formData[component.name] != item.value){
                                            // _this.saveCancelEleKey(component,originEleIndex);
                                        // }
                                        _this.autoTranslate(item);
                                        if(Array.isArray(item.children)){
                                            item.children.forEach(function (child) {
                                                //  在递归中插入改动数据，数据中有值用数据中的值，无值的用默认值
                                                if(!_this.formData[child.name]){
                                                    _this.autoTranslate(child);
                                                    !child['default_value']?'':_this.$set(_this.formData,child.name,child['default_value']);
                                                }
                                                // console.log(child);
                                            })
                                        }
                                    })
                                }
                            })
                        })
                    })
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
                // let paramsObj = {json_data:encodeURIComponent(JSON.stringify(this.formData))};
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

                    // console.log(_this.formDataNullCache);
                    // console.log(_this.formDataNullCache['occupation']);
                    //  删除已隐藏的 input
                    if(!!_this.formDataNullCache[objKey]){
                        Object.keys(_this.formDataNullCache[objKey]).forEach(function (v) {
                            //  很遗憾这种方法也不好使，跟某些描述有很大出入
                            // if(!!_this.$refs[v]){
                            //     if(Array.isArray(_this.$refs[v])){
                            //         _this.$refs[v].forEach(function (ref) {
                            //             console.log(ref);
                            //             ref.clearValidate();
                            //         })
                            //     }else{
                            //         console.log(_this.$refs[v]);
                            //         _this.$refs[v].clearValidate();
                            //     }
                            // }

                            if(/^.*_date$/.test(v) || /^.*_begin$/.test(v) || /^.*_end$/.test(v)){
                                _this.$set(_this.formData,v,1365098709);
                            }else{
                                _this.$set(_this.formData,v,'1365098709');
                            }
                            delete postFormData[v];
                        });
                    }

                    //  以上删除的只是隐藏的 input，而未填写的中文 input 也需要清空
                    if(postFormData[objKey]=='null'){
                        delete postFormData[objKey];
                    }

                }

                //  校验表单
                this.$refs.VisaForm.validate((valid,data) => {
                    console.log(postFormData);
                    if (valid) {
                        //  删掉某些等于特殊值的数据
                        for(let key in this.formData){
                            if(this.formData[key]=='null' || this.formData[key]=='1365098709'){
                                delete this.formData[key];
                            }

                        }
                        let paramsObj = {json_data:this.Base64().encode(JSON.stringify(postFormData))};
                        this.$axios({
                            method: 'POST',
                            url: url,
                            data: Util.paramsStr(paramsObj)
                        }).then((res) => {
                            // this.page = res.data.page;
                            // !res.data.url?this.$router.push('/'):window.location.href = res.data.url;
                            !res.data.url?this.$router.push('/'):window.open(window.API_ROOT + res.data.url.replace('/visacloud/',''));
                        }).catch((err) => {
                            console.log(err)
                        });
                    } else {
                        //  删掉某些等于特殊值的数据
                        for(let key in this.formData){
                            if(this.formData[key]=='null' || this.formData[key]=='1365098709'){
                                delete this.formData[key];
                            }

                        }
                        for(let v in data){
                            // console.log(this.$refs[v]);
                            console.log(v + ', ' + data[v]['0'].message +' !!');
                        }
                        return false;
                    }
                });
                // console.log(postFormData);

            },
            submitForm(url) {
                // let paramsObj = {json_data:encodeURIComponent(JSON.stringify(this.formData))};
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
                    //  删除已隐藏的 input
                    if(!!_this.formDataNullCache[objKey]){
                        Object.keys(_this.formDataNullCache[objKey]).forEach(function (v) {
                            delete postFormData[v];
                        });
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
                    data: Util.paramsStr(paramsObj)
                }).then((res) => {
                    !res.data.url?this.$router.push('/'):window.open(window.API_ROOT + res.data.url.replace('/visacloud/',''));
                }).catch((err) => {
                    console.log(err)
                });

            },
            //  导出预览功能，还没开始用
            exportViewForm(url){
                let paramsObj = {json_data:JSON.stringify(this.formData)};
                //  此处为弹出层准备，弹出层带关闭，带下载
                this.$set(this.$data,'pdfLink',`${url}?${Util.paramsStr(paramsObj)}`);
                //  现在只在新窗口打开
                window.open(`${url}?${Util.paramsStr(paramsObj)}`);
                // window.location.href = `${url}?${Util.paramsStr(paramsObj)}`;
            },
            //  重置已经填好的表单
            resetForm() {
                this.$refs['VisaForm'].resetFields();
            },
            //  子组件给父组件传值用的绑定事件
            updateForm(data){
                // this.$nextTick(() => {
                //  再次更新验证规则，因为会有联动的子元素
                // let VisaFormEleRules = Object.assign({},this.formRules);
                // this.$set(this.$data, "formRules", VisaFormEleRules);

                // let formData = Object.assign(this.formChildData, data);
                let formData = Object.assign(this.formRules, data);

                // this.$set(this.$data, "formChildData", formData);
                this.$set(this.$data, "formRules", formData);
                // });
            },
            //  当select、mselect、checkbox、radio 等选中时，event为选择select时的option的值，index为checkbox、radio的index
            eleChange:function(event,index,ele){
                let eleIndex = -1,_this=this;
                if(ele.type === "radio"){
                    event?eleIndex=index:eleIndex=-1;
                    this.$set(this.$data, "eleIndex", eleIndex);
                }else{
                    if(!index){
                        (ele.items).forEach(function (v,i) {
                            if(Object.values(v).indexOf(event)>-1){
                                eleIndex=i;
                                _this.$set(_this.$data, "eleIndex", eleIndex);
                            }
                        })
                    }else{
                        if(Object.keys(ele.items[index]).indexOf('children') > -1){
                            event?eleIndex=index:eleIndex=-1;
                            this.$set(this.$data, "eleIndex", eleIndex);
                        }
                    }
                }
                //  eleIndex 在 checkbox 时，选中其中一个时值为 checkbox的索引号，取消时为-1；radio时，选中其中一个时为索引号，始终为其中之一的索引号；select始终为索引号
                //  以下的方法为，切换时要清空已填好的input，现在改为提交时清空，未提交时数据还在input框中，所以注释掉
                //  this.clearEleValue(ele.items[this.eleIndex],ele.name);
                //  取未选中的，因为 ele.items 一定是数组



                this.saveCancelEleKey(ele,this.eleIndex);
            },
            //  所有表单元素初始
            initEleData:function () {
                let elementObj = this.formElementsValue;
                for(let key in elementObj){
                    if(!elementObj.hasOwnProperty(key)) continue;//跳过继承的属性
                    this.$set(this.formData,key,elementObj[key]);
                }
            },
            //  切换选项后，存储隐藏的子元素的key
            saveCancelEleKey:function(ele,originEleIndex){
                // console.log(ele,ele.items[originEleIndex]);
                let _this = this,deleteCache=0,onlyEleValue='';
                if(Array.isArray(ele.items)){
                    ele.items.forEach(function (item,index) {
                        if(originEleIndex != index){
                            if(!!item.children){
                                deleteCache++;
                                onlyEleValue=item.value;
                            }
                            if(Array.isArray(_this.formData[ele.name]) && _this.formData[ele.name].indexOf(item.value)<0){      //checkbox 和 多选
                                if(!!item.children){
                                    _this.clearEleValue(item,ele.name,ele.items[originEleIndex]);
                                }
                            }else if(typeof _this.formData[ele.name] == 'string' && _this.formData[ele.name] != item.value){      //radio 和 select
                                // console.log(ele.items[originEleIndex]);
                                if(!!item.children){
                                    if(Array.isArray(ele.items[index].children)){
                                        _this.clearEleValue(item,ele.name,ele.items[originEleIndex]);
                                    }
                                }
                            }

                        }
                    })
                    if(deleteCache === 1 && (_this.formData[ele.name].indexOf(onlyEleValue)<0 || _this.formData[ele.name] != onlyEleValue)){
                        // console.log('未选择');
                    }else if(deleteCache === 0){
                        // console.log('已选择');
                        _this.clearEleValue(false,ele.name,ele.items[originEleIndex]);
                    }
                }else{
                    console.warn(ele.name + 'it is not Array!!!');
                }
            },
            //  切换选项后，清空子元素中的内容
            clearEleValue:function(ele,name,originEle){
                if(name == 'inviter_type'){
                    // console.log(name,ele,originEle);
                }
                let _this = this,replayName,replayNameEn;
                if(!!ele){
                    // _this.$set(_this.formDataNullCache,name,{});
                    let eleNullCache;
                    if(Array.isArray(ele.children)){
                        ele.children.forEach(function (v,i) {
                            if(v.translatable==1 || v.translatable==2){
                                eleNullCache = Object.assign({},_this.formDataNullCache[name],{[v.name+'_cn']:'',[v.name+'_en']:''});
                                _this.$set(_this.formDataNullCache,name,eleNullCache);
                            }else{
                                // console.log(v.name, _this.formDataNullCache[name]);
                                eleNullCache = Object.assign({},_this.formDataNullCache[name],{[v.name]:''});
                                _this.$set(_this.formDataNullCache,name,eleNullCache);
                            }
                        });
                    }else{
                        if(ele.children.translatable==1 || ele.children.translatable==2){
                            eleNullCache = Object.assign({},_this.formDataNullCache[name],{[ele.children.name+'_cn']:'',[ele.children.name+'_en']:''});
                            _this.$set(_this.formDataNullCache,name,eleNullCache);
                        }else{
                            eleNullCache = Object.assign({},_this.formDataNullCache[name],{[ele.children.name]:''});
                            _this.$set(_this.formDataNullCache,name,eleNullCache);
                        }
                    }
                }else{
                    delete _this.formDataNullCache[name];
                }

                //  因为  现职业  下的子级，name 一样，导致存储在 formDataNullCache 包含此字段的name，在最后会被清除掉，所以暂时留下  现职业 这个字段的所有值
                // delete _this.formDataNullCache['occupation'];

                if(!!originEle && Array.isArray(originEle.children)){
                    originEle.children.forEach(function (child) {

                        if(typeof _this.formDataNullCache[name] == 'object'){
                            delete _this.formDataNullCache[name][child.name];
                            delete _this.formDataNullCache[name][child.name+'_cn'];
                            delete _this.formDataNullCache[name][child.name+'_en'];
                        }
                    })
                }
                console.log(_this.formDataNullCache);
            },
            //  转换字符串为正则 或 js代码
            evalTo:function(item){
                item = !item?'':eval(`\/${item}\/`);
                return item;
            },
            //  汉译英接口
            translateCh2En:function (name) {
                if(this.formData[name+'_cn'] && !this.formData[name+'_en']){
                    this.$axios.get(window.API_ROOT + 'rest/translate.chinese.english/v1', {params:{ text: this.formData[name+'_cn']}})
                        .then(resp => {
                            !resp.data ? '' : this.$set(this.formData,name+'_en',resp.data);
                        })
                }
            },
            //  汉译拼音接口
            translateCh2PY:function (name) {
                if(this.formData[name+'_cn'] && !this.formData[name+'_en']){
                    this.$axios.get(window.API_ROOT + 'rest/translate.chinese.pinyin/v1', {params:{ text: this.formData[name+'_cn']}})
                        .then(resp => {
                            !resp.data ? '' : this.$set(this.formData,name+'_en',resp.data);
                        })
                }
            },
            //  自动翻译接口
            autoTranslate:function (ele) {
                if(!!ele.translatable && ele.translatable == '1' && !!this.formData[ele.name+'_en']){
                    this.translateCh2En(ele.name);
                }
                if(!!ele.translatable && ele.translatable == '2' && !!this.formData[ele.name+'_en']){
                    this.translateCh2PY(ele.name);
                }
            },
            //  Base64
            Base64:function(){
                return new Util.Base64();
            }
        },
        beforeCreate(){

        },
        created () {
            //  把从父组件带过来的参数合并进提交的表单中
            this.$set(this.$data, "formData", (this.formParams));
        },
        beforeUpdate:function(){
            //  从父组件需要更新的值传给子组件时，只能在 beforeUpdate、updated 数据更新的地方拿到
            this.$set(this.$data,'formData',this.formElementsValue);
            this.$set(this.$data,'formElementsJsonData',this.formElementsData);
        },
        updated: function () {
            this.$nextTick(function () {

            })
        },
        beforeMount(){
            // console.log('beforeMount',this.formElementsData);
        },
        mounted() {

            // console.log('mounted',this.formElementsData);
            // this.initEleData();
        },
        beforeDestroy(){
            // console.log('beforeDestroy',this.formElementsData);
        }
    };
</script>
<style scoped lang="scss">
    .el-select,
    .width-all{
        width: 100%;
    }
</style>

