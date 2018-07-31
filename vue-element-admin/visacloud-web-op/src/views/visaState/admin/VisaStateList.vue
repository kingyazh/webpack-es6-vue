/* eslint-disable */
<template>
    <el-container>
        <el-main class="padding-small">
            <h4 class="part_title">查 询</h4>
            <el-form :model="queryForm" ref="queryForm" label-width="130px" status-icon>
                <el-row :gutter="20">
                    <el-col :span="10" :offset="2">
                        <el-form-item label="团号" prop="team_no">
                            <el-input v-model="queryForm.team_no" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="客人姓名" prop="customer_name">
                            <el-input v-model="queryForm.customer_name" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="10" :offset="2">
                        <el-form-item label="订单号" prop="visa_order_no">
                            <el-input v-model="queryForm.visa_order_no" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="护照号" prop="passport_no">
                            <el-input v-model="queryForm.passport_no" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col v-if="currentTab==99" :span="10" :offset="2">
                        <el-form-item label="当前办理节点" prop="current_progress">
                            <el-select ref="currentProgress" v-model="queryForm.current_progress" placeholder="请选择" clearable @change="changeFn">
                                <el-option v-for="item in currentProgressOptions" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col v-if="currentTab==2" :span="10" :offset="2">
                        <el-form-item label="收资料操作人" prop="receive_user">
                            <el-input v-model="queryForm.receive_user" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col v-if="currentTab==3" :span="10" :offset="2">
                        <el-form-item label="审核资料操作人" prop="audit_user">
                            <el-input v-model="queryForm.audit_user" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col v-if="currentTab==5" :span="10" :offset="2">
                        <el-form-item label="递交资料操作人" prop="submit_user">
                            <el-input v-model="queryForm.submit_user" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col v-if="currentTab==6" :span="10" :offset="2">
                        <el-form-item label="出签资料操作人" prop="record_result_user">
                            <el-input v-model="queryForm.record_result_user" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col v-if="currentTab==7" :span="10" :offset="2">
                        <el-form-item label="资料返还操作人" prop="return_user">
                            <el-input v-model="queryForm.return_user" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="客人状态" prop="customer_status">
                            <el-select v-model="queryForm.customer_status" placeholder="请选择" clearable>
                                <el-option v-for="item in customerStatusOptions" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="10" :offset="2">
                        <el-form-item v-if="currentTab==99" label="状态更新日期" prop="last_update"><!--// 状态更新-->
                            <el-date-picker
                                v-model="insertTempDate['last_update']"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="timestamp">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item v-if="currentTab==2" label="收资料更新日期" prop="receive"><!--// 收资料操-->
                            <el-date-picker
                                v-model="insertTempDate['receive']"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="timestamp">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item v-if="currentTab==3" label="审核资料日期" prop="audit"><!--// 审核资料-->
                            <el-date-picker
                                v-model="insertTempDate['audit']"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="timestamp">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item v-if="currentTab==5" label="递交资料日期" prop="submit"><!--// 递交材料-->
                            <el-date-picker
                                v-model="insertTempDate['submit']"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="timestamp">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item v-if="currentTab==6" label="出签更新日期" prop="record_result"><!--// 出签管理-->
                            <el-date-picker
                                v-model="insertTempDate['record_result']"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="timestamp">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item v-if="currentTab==5" label="出签结果" prop="visa_result">
                            <el-select v-model="queryForm.visa_result" placeholder="请选择" clearable @change="changeFn">
                                <el-option v-for="item in visaResultOptions" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="currentTab==7" :gutter="20">
                    <el-col :span="10" :offset="2">
                        <el-form-item label="资料返还日期" prop="express">
                            <el-date-picker
                                v-model="insertTempDate['express']"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="timestamp">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="资料返还类型" prop="return_type">
                            <el-select v-model="queryForm.return_type" placeholder="请选择" clearable @change="changeFn">
                                <el-option v-for="item in returnTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row v-if="currentTab==7" :gutter="20">
                    <el-col :span="10" :offset="2">
                        <el-form-item label="资料返还操作日期" prop="return">
                            <el-date-picker
                                v-model="insertTempDate['return']"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="timestamp">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col style="text-align:right" :span="20" :offset="2">
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('queryForm')">查询</el-button>
                            <el-button @click="resetForm('queryForm')">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <el-row class="visa-state-tags">
                <el-button :type="currentTab==99?'primary':''" @click="handleTabClick(99)">全部</el-button>
                <el-button :type="currentTab==2?'primary':''" @click="handleTabClick(2)">收资料</el-button>
                <el-button :type="currentTab==3?'primary':''" @click="handleTabClick(3)">审核资料</el-button>
                <el-button :type="currentTab==4?'primary':''" @click="handleTabClick(4)" disabled>约签</el-button>
                <el-button :type="currentTab==5?'primary':''" @click="handleTabClick(5)">递交资料</el-button>
                <el-button :type="currentTab==6?'primary':''" @click="handleTabClick(6)">出签管理</el-button>
                <el-button :type="currentTab==7?'primary':''" @click="handleTabClick(7)">资料返还</el-button>
            </el-row>

            <h4 class="part_title">列 表</h4>
            <el-row class="system_operate">
                <el-button v-if="currentTab==99" type="primary" size="small" @click="multipleSelectOpen">批量维护办理进度</el-button>
                <el-button v-else type="primary" size="small" @click="$message({message:'还没做'})">导出</el-button>
            </el-row>
            <el-table :data="visaStatusList" border header-cell-class-name="table-head-th" :row-key="getRowKeys" ref="multipleTable" @selection-change="handleSelectUser">
                <el-table-column :key="Math.random()" v-if="currentTab==99" align="center" type="selection">
                </el-table-column>
                <!--<el-table-column v-if="currentTab!=99" align="center" label="序号" type="index">-->
                <!--</el-table-column>-->
                <el-table-column :key="Math.random()" align="center" label="客人姓名" prop="customer_name">
                </el-table-column>
                <el-table-column :key="Math.random()" align="center" label="护照号" prop="passport_no">
                </el-table-column>
                <el-table-column :key="Math.random()" align="center" label="客人状态" prop="customer_status">
                    <template slot-scope="customerRow">
                        {{customerStatusData[customerRow.row.customer_status]}}
                    </template>
                </el-table-column>
                <el-table-column :key="Math.random()" align="center" label="团号/订单号" prop="team_no">
                </el-table-column>
                <el-table-column :key="Math.random()" align="center" label="要证/出发日期" prop="certificate_date" :formatter="formatRowDate">
                </el-table-column>
                <el-table-column :key="Math.random()" align="center" label="办签人数" prop="person_num">
                </el-table-column>
                <el-table-column :key="Math.random()" align="center" label="送签地" prop="visa_center_name">
                </el-table-column>
                <el-table-column :key="Math.random()" v-if="currentTab==99" align="center" label="签证类型" prop="visa_type_name">
                </el-table-column>
                <el-table-column :key="Math.random()" v-if="currentTab==2" align="center" label="提交申请表时间" prop="init_date" :formatter="formatRowDateTime">
                </el-table-column>
                <el-table-column :key="Math.random()" v-if="currentTab==2 || currentTab==3" align="center" label="收资料操作时间" prop="receive_date" :formatter="formatRowDateTime">
                </el-table-column>
                <el-table-column :key="Math.random()" v-if="currentTab==2 || currentTab==3" align="center" label="收资料操作人" prop="receive_user">
                </el-table-column>
                <el-table-column :key="Math.random()" v-if="currentTab==3 || currentTab==5" align="center" label="审核资料操作时间" prop="audit_date" :formatter="formatRowDateTime">
                </el-table-column>
                <el-table-column :key="Math.random()" v-if="currentTab==3 || currentTab==5" align="center" label="审核资料操作人" prop="audit_user">
                </el-table-column>
                <el-table-column :key="Math.random()" v-if="currentTab==5 || currentTab==6" align="center" label="递交资料操作时间" prop="submit_date" :formatter="formatRowDateTime">
                </el-table-column>
                <el-table-column :key="Math.random()" v-if="currentTab==5 || currentTab==6" align="center" label="递交资料操作人" prop="submit_user">
                </el-table-column>
                <el-table-column :key="Math.random()" v-if="currentTab==7" align="center" label="上一办理节点" prop="visa_result">
                  <template slot-scope="scope">
                      {{visaResultOptions.filter(item=>{return item.code == scope.row.visa_result}).length > 0 ? visaResultOptions.filter(item=>{return item.code == scope.row.visa_result})[0].value : ''}}
                  </template>
                </el-table-column>
                <el-table-column :key="Math.random()" v-if="currentTab==6 || currentTab==7" align="center" :label="currentTab==6 ? '出签结果操作时间' : '上一节点操作时间'" prop="record_result_date" :formatter="formatRowDateTime">
                </el-table-column>
                <el-table-column :key="Math.random()" v-if="currentTab==6 || currentTab==7" align="center" :label="currentTab==6 ? '出签结果操作人' : '上一办理节点操作人'" prop="record_result_user">
                </el-table-column>
                <el-table-column :key="Math.random()" v-if="currentTab==7" align="center" label="资料返还类型" prop="return_type">
                  <template slot-scope="scope">
                      {{returnTypeOptions.filter(item=>{return item.value == scope.row.return_type}).length > 0 ? returnTypeOptions.filter(item=>{return item.value == scope.row.return_type})[0].label : ''}}
                  </template>
                </el-table-column>
                <el-table-column :key="Math.random()" v-if="currentTab==7" align="center" label="资料返还日期" prop="return_date" :formatter="formatRowDate">
                </el-table-column>
                <el-table-column :key="Math.random()" v-if="currentTab==7" align="center" label="快递信息" prop="express_number">
                    <template slot-scope="scope">
                        {{scope.row.express_company}} {{scope.row.express_number}}
                    </template>
                </el-table-column>
                <el-table-column :key="Math.random()" v-if="currentTab==7" align="center" label="资料返还操作时间" prop="return_insert_date" :formatter="formatRowDateTime">
                </el-table-column>
                <el-table-column :key="Math.random()" v-if="currentTab==7" align="center" label="资料返还操作人" prop="return_user">
                </el-table-column>
                <!--<el-table-column :key="Math.random()" v-if="currentTab==99" align="center" label="收资料操作人" prop="visa_type_name">-->
                <!--</el-table-column>-->
                <!--<el-table-column align="center" label="当前办理节点" prop="current_progress" :formatter="formatRowProgress">-->
                <el-table-column :key="Math.random()" v-if="currentTab!=7" width="120" align="center" label="当前办理节点" prop="current_progress">
                    <!--// 点击编辑时的弹出框-->
                    <template slot-scope="scope">
                        <el-popover
                            popper-class="edit-user-popover"
                            placement="right"
                            width="500"
                            trigger="hover">
                            <el-table :data="scope.row.status_list" border header-cell-class-name="table-head-th">
                                <el-table-column align="center" label="办理节点" prop="progress">
                                    <template slot-scope="progress">
                                        {{currentProgressData[progress.row.progress]}}
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="办理状态" prop="status_name">
                                    <template slot-scope="progress">
                                        {{progress.row.status_name}}
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="操作人" prop="update_user">
                                </el-table-column>
                                <el-table-column align="center" width="100" label="操作时间" prop="update_date" :formatter="formatRowDateTime">
                                </el-table-column>
                                <el-table-column align="center" label="备注信息" prop="memo">
                                </el-table-column>
                            </el-table>
                            <span slot="reference" style="display:block;padding:10px 0;color:#409EFF">{{currentProgressData[scope.row.current_progress]}}<br>({{scope.row.current_progress_name}})</span>
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column :key="Math.random()" v-if="currentTab!=7" align="center" label="办理状态更新时间" prop="last_update_date" :formatter="formatRowDateTime">
                </el-table-column>
                <el-table-column :key="Math.random()" v-if="currentTab==99" width="180" label="操作" align="center">
                    <template slot-scope="scope">
                        <el-row>
                            <el-button type="primary" plain size="mini" @click="userStateOperateEdit(scope.$index, scope.row)">维护办理进度</el-button>
                        </el-row>
                        <el-row v-if="scope.row.current_progress != '1' && scope.row.return_type!='2'">
                            <el-button type="primary" plain size="mini" @click="userStateBackEdit(scope.$index, scope.row)">回退办理进度</el-button>
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.page_num" :page-sizes="[page.page_size]" layout="total, sizes, prev, pager, next" :total="page.total" style="padding:10px;text-align:right">
            </el-pagination>
        </el-main>


        <!--// 批量维护办理进度 弹出层操作界面-->
        <el-dialog title="" class="state-dialog" :visible.sync="userStateOperateDialog" @open="userStateDefaultSelection" @close="resetDialog">
            <el-row slot="title">
                <i class="el-icon-question" @click="handleInfoDialog"></i>
            </el-row>
            <el-row v-if="stepOne" class="step-one">
                <h5 v-if="statusUpdateData.save_type == 1" class="state-title"><i>01</i>选择办理进度</h5>
                <h5 v-else class="state-title state-title-warn"><i>!</i>回退办理进度</h5>
                <el-form :model="userStateOperateData" ref="userStateOperate" label-width="100px" status-icon>
                    <el-table :data="currentProgressOptions.filter(v => (statusUpdateData.save_type == '2' || v.value != 1) && v.value != 4 && v.value != 99)" class="table-no-border" :border="false" :show-header="false" :row-key="getRowKeys" ref="userStateOperateTable" @select="handleSelectState">
                        <el-table-column align="center" :selectable='userStateSelectAble' type="selection" width="30">
                        </el-table-column>
                        <el-table-column label="办理进度" prop="label">
                            <template slot-scope="scope">
                                {{scope.row.label}}
                                <span v-if="scope.row.value == 1">（未收资料）</span>
                                <span v-else-if="scope.row.value == 2">（确认收到客人资料，可以开始办理签证）</span>
                                <span v-else-if="scope.row.value == 3">（客人资料符合使馆要求）</span>
                                <span v-else-if="scope.row.value == 5">（客人资料已递交至使馆/签证中心）</span>
                                <span v-else-if="scope.row.value == 6">（维护客人的出签结果）</span>
                                <span v-else-if="scope.row.value == 7">（退还客人资料）</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-row>
                        <el-col v-if="statusUpdateData.save_type=='2'" :span="16" class="danger-text">说明：系统将自动删除所选办理状态后的已维护的办理状态信息，办理状态回退后，客人将看不到已回退的状态！</el-col>
                        <el-col :span="statusUpdateData.save_type=='2' ? 8 : 24" class="dialog-btn">
                            <el-button type="primary" @click="submitForm('userStateOperate')" :disabled="stepInit>6">
                                {{statusUpdateData.save_type == 1?stepInit>6?'流程已结束':'下一步':''}}
                                {{statusUpdateData.save_type == 2?'确定':''}}
                            </el-button>
                            <el-button @click="resetForm('userStateOperate'),userStateOperateDialog = false">取消</el-button>
                        </el-col>
                    </el-row>
                </el-form>
            </el-row>
            <el-row v-if="!stepOne && stepTwo>0" class="step-two">
                <h5 class="state-title"><i>02</i>
                    <span v-if="stepTwo == 2">收资料</span>
                    <span v-else-if="stepTwo == 3">审核资料</span>
                    <span v-else-if="stepTwo == 5">客人资料已递交至使馆/签证中心</span>
                    <span v-else-if="stepTwo == 6">维护客人的出签结果</span>
                    <span v-else-if="stepTwo == 7">退还客人资料</span>
                </h5>
                <div v-if="stepTwo == 2 || stepTwo == 3">
                    <el-form :model="statusUpdateData" ref="step_2" label-width="100px" status-icon>
                        <table class="info-show-table">
                            <tr>
                                <th>资料类别</th>
                                <th>资料名称</th>
                                <th>资料要求</th>
                                <th width="40%">图片</th>
                            </tr>
                            <tr>
                                <td rowspan="2">必备资料</td>
                                <td>身份证</td>
                                <td>
                                    <p>1、清晰拍摄正反面身份证，不能反光</p>
                                    <p>2、请露出四个边角，不要压边拍摄</p>
                                </td>
                                <td class="img">
                                    <img v-if="customerImageInfo.identityF_image_url" :src="customerImageInfo.identityF_image_url" alt="身份证正面" @mouseover="imgHoverFn" @mouseout="imgOutFn">
                                    <img v-if="customerImageInfo.identityB_image_url" :src="customerImageInfo.identityB_image_url" alt="身份证反面" @mouseover="imgHoverFn" @mouseout="imgOutFn">
                                </td>
                            </tr>
                            <tr>
                                <td>护照</td>
                                <td>
                                    <p>1、有效期离出发日期应至少还有6个月</p>
                                    <p>2、请露出四个边角，不要压边拍摄，不要反光</p>
                                </td>
                                <td class="img">
                                    <img v-if="customerImageInfo.passport_image_url" :src="customerImageInfo.passport_image_url" alt="护照首页" @mouseover="imgHoverFn" @mouseout="imgOutFn">
                                </td>
                            </tr>
                            <tr>
                                <td>选择资料</td>
                                <td>其他资料</td>
                                <td>
                                    <p>1、如果您有其他需要补充的资料可拍照上传</p>
                                </td>
                                <td class="img">
                                    <img v-for="other in customerImageInfo.otherMaterialList" :key="other.image_other" :src="other.image_other_url" alt="其他资料" @mouseover="imgHoverFn" @mouseout="imgOutFn">
                                </td>
                            </tr>
                        </table>
                        <el-row class="dialog-btn">
                            <el-form-item>
                                <el-button type="primary" @click="submitForm('step_2')">下载图片</el-button>
                                <el-button type="primary" @click="submitForm('step_2')">{{stepTwo==2?'收资料':'资料合格'}}</el-button>
                                <el-button @click="userStateOperateDialog = false">取消</el-button>
                            </el-form-item>
                        </el-row>
                    </el-form>
                </div>

                <div v-if="stepTwo == 5">
                    <el-form :model="statusUpdateData" ref="step_5" label-width="100px" status-icon>
                        <el-row class="step-form">
                            <el-col :span="22">
                                <el-form-item label="办理结果" prop="visa_result">
                                    <el-select v-model="statusUpdateData.submit_result" placeholder="请选择" clearable >
                                        <el-option v-for="item in [{code:'1',value:'完成'}]" :key="item.code" :label="item.value" :value="item.code">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col class="dialog-btn">
                                <el-form-item>
                                    <el-button type="primary" @click="submitForm('step_5')">确定</el-button>
                                    <el-button @click="resetForm('step_5')">取消</el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>

                <div v-if="stepTwo == 6">
                    <el-form :model="statusUpdateData" ref="step_6" label-width="100px" status-icon>
                        <el-row class="step-form">
                            <el-col :span="22">
                                <el-form-item label="出签结果" prop="visa_result">
                                    <el-radio v-for="radio in visaResultOptions" v-model="statusUpdateData.visa_result" :key="radio.code" :label="radio.code" border>{{radio.value}}</el-radio>
                                    <!--<el-radio v-model="statusUpdateData.visa_result" label="1" border>拒签</el-radio>-->
                                    <!--<el-radio v-model="statusUpdateData.visa_result" label="1" border>撤签</el-radio>-->
                                </el-form-item>
                            </el-col>
                            <el-col>
                                <el-form-item label="备注" prop="visa_result">
                                    <el-input v-model="statusUpdateData.visa_result_memo" placeholder=""  style="width: 100%;"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col class="dialog-btn">
                                <el-form-item>
                                    <el-button type="primary" @click="submitForm('step_6')">确定</el-button>
                                    <el-button @click="resetForm('step_6')">取消</el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>

                <div v-if="stepTwo == 7">
                    <el-form :model="statusUpdateData" ref="step_7" label-width="110px" status-icon>
                        <el-row class="step-form">
                            <el-col :span="22">
                                <el-form-item label="返回类型" prop="return_type">
                                    <el-radio v-for="radio in returnTypeOptions" v-model="statusUpdateData.return_type" :key="radio.value" :label="radio.value" border>{{radio.label}}</el-radio>
                                    <!--<el-radio v-model="statusUpdateData.result" label="3" border>正常办理退资料-退单退资料</el-radio>-->
                                </el-form-item>
                            </el-col>
                            <el-col>
                                <el-form-item label="资料返还日期" prop="return_date" :rules="[{ required: true, message: '必填，不能为空', trigger: 'blur' }]">
                                    <el-date-picker v-model="statusUpdateData.return_date" format="yyyy 年 MM 月 dd 日" value-format="timestamp" class="width-all" type="date" placeholder="选择日期" :clearable="false">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col>
                                <el-form-item label="快递公司" prop="express_company">
                                    <el-input v-model="statusUpdateData.express_company" placeholder=""  style="width: 100%;"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col>
                                <el-form-item label="快递单号" prop="express_number">
                                    <el-input v-model="statusUpdateData.express_number" placeholder=""  style="width: 100%;"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col class="dialog-btn">
                                <el-form-item>
                                    <el-button type="primary" @click="submitForm('step_7')">确定</el-button>
                                    <el-button @click="resetForm('step_7')">取消</el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </el-row>

        </el-dialog>

        <el-dialog title="办理进度说明" :visible.sync="StateInfoDialog" width="45%" >
            <el-row>
                <h6>操作说明：</h6>
                <p>1、只可选择未维护的办理进度；</p>
                <p>2、勾选某一个办理进度，系统自动将该进度前未维护的办理进度全部选中；</p>
                <p>3、若批量维护多个办理进度，系统自动将所选进度前，未维护的办理进度信息（办理状态、办理时间）设置为系统默认值；</p>
                <table class="info-show-table">
                    <tr>
                        <th>办理进度</th>
                        <th>办理状态</th>
                        <th>办理时间</th>
                    </tr>
                    <tr>
                        <td>收资料</td>
                        <td>资料已收</td>
                        <td>系统当前时间</td>
                    </tr>
                    <tr>
                        <td>审核资料</td>
                        <td>资料合格</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>递交资料</td>
                        <td>使馆受理中</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>出签结果</td>
                        <td>出签</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>资料返还</td>
                        <td>资料已寄出</td>
                        <td></td>
                    </tr>
                </table>
            </el-row>
            <!--<el-row>-->
                <!--<el-button type="primary" @click="submitForm('')">下一步</el-button>-->
                <!--<el-button @click="resetForm(''),StateInfoDialog = false">取消</el-button>-->
            <!--</el-row>-->
        </el-dialog>

    </el-container>
</template>
<style scoped lang="scss">
.el-main {
    /*margin: 0 1rem 2rem;*/
    background-color: #ffffff;
    color: #333;
    text-align: center;
    // line-height: 160px;
}
.el-select {
    width: 100%;
}
.el-table {
    width: 100%;
    line-height: 1.9rem;
}
.el-table__expanded-cell {
    background: #f9f9dd;
}

.el-table__expanded-cell:hover {
    background-color: #f9f9dd !important;
}

.el-table--enable-row-hover
    .el-table__body
    tr:hover
    > .el-table__expanded-cell {
    background: #f9f9dd;
}
</style>

<script>
  /* eslint-disable */
  import { getCountry, getDict, getDetails, getVisaType, getVisaCenter, visaStatusPage, visaStatusUpdate, visaUserPapers } from '@/api/VisaState'
  export default {
    data() {
      return {
        visaStatusList: [],
        page: {
          page_num: 1,
          page_size: 10,
          total: 0
        },
        queryForm: {
          customer_name: '',
          team_no: '',
          passport_no: '',
          visa_order_no: '',
          customer_status: '1',
          last_update_date_from: '',
          last_update_date_end: '',
          // 设置为 99 全部时，返回数组为空
          current_progress: '',
          receive_user: '',
          receive_date_from: '',
          receive_date_end: '',
          audit_user: '',
          audit_date_from: '',
          audit_date_end: '',
          submit_user: '',
          submit_date_from: '',
          submit_date_end: '',
          record_result_user: '',
          record_result_date_from: '',
          record_result_date_end: '',
          visa_result: '',
          return_user: '',
          return_date_from: '',
          return_date_end: '',
          return_type: '',
          express_date_from: '',
          express_date_end: '',
          page_num: 1,
          page_size: 10
        },
        statusUpdateData:{
          // 客人dbid - 2018年07月30日16:21:36 新增
          customer_dbid : '',
          // 客人办签状态dbid
          dbid:'',
          // 操作类型 1:正向操作；2：回退操作
          save_type:'1',
          // 收资料操作人
          receive_user:'',
          // 收资料操作日期
          receive_date:'',
          // 审核资料操作人
          audit_user:'',
          // 审核资料操作日期
          audit_date:'',
          // 递交资料操作人
          submit_user:'',
          // 递交资料操作日期
          submit_date:'',
          // 递交资料结果
          submit_result:'1',
          // 递交资料结果备注
          submit_result_memo:'',
          // 出签资料操作人
          record_result_user:'',
          // 出签资料操作日期
          record_result_date:'',
          // 出签结果 1:出签;2:拒签;3:撤签
          visa_result:'1',
          // 出签结果备注
          visa_result_memo:'',
          // 资料返还操作人
          return_user:'',
          // 资料返还日期
          return_date:'',
          // 资料返还类型  1:正常办理退资料;2:退单退资料
          return_type:'1',
          // 快递公司
          express_company:'',
          // 快递单号
          express_number:''
        },
        visaResultOptions: [],
        returnTypeOptions: [],
        currentProgressOptions: [],
        customerStatusOptions: [],
        visaCountryOptions: [],
        currentProgressData: {},
        customerStatusData: {},
        insertTempDate:[],
        activeName:'',
        currentTab:99,
        userStateOperateDialog: false,
        StateInfoDialog: false,
        userStateOperateData: {},
        imgBigShow:false,
        countryCode:'',
        // 操作步骤只有2步
        stepOne:true,
        stepTwo:0,
        // 用户已经走到的步骤
        stepInit:0,
        // 获取row的key值
        getRowKeys(row) {
          return row.opt_order_no
        },
        expandsRow: [],
        // 客人图片信息 - 仅单行处理时展示 - 2018年07月30日17:06:31
        customerImageInfo : {}
      }
    },
    computed: {
      showVisaType: function() {
        const country_code = this.queryForm.country_code
        this.GetVisaType(country_code)
        this.GetVisaCenter(country_code)
        return !!country_code
      }
    },
    watch:{
      insertTempDate:function (val) {
        for (let key in val){
          this.$set(this.queryForm,key+'_date_from',val[key][0])
          this.$set(this.queryForm,key+'_date_end',val[key][1])
          // console.log(key + '_date_from',this.queryForm[key + '_date_from']);
        }
      }
    },
    methods: {
      changeFn(row){
        // console.log(row);
      },
      visaStatusListFn(country) {
        // this.visaStatusList = [] 
        const paramsObj = Object.assign({}, this.queryForm)
        for(var key in paramsObj){
          if(!paramsObj[key]){
            delete paramsObj[key];
          }
        }
        paramsObj['country_code'] = country
        visaStatusPage(paramsObj).then((res) => {
          !res.data ? '' : this.$set(this.$data, 'visaStatusList', res.data.list)
          this.$set(this.$data, 'page', res.data.page)
          this.$set(this.queryForm, 'page_num', res.data.page.page_num)
          this.$set(this.queryForm, 'page_size', res.data.page.page_size)
        }).catch((err) => {
          console.log(err)
        })
      },
      visaStatusOperateFn(formName){
        // 当前操作步骤
        this.$set(this.statusUpdateData,'current_progress',this.stepTwo)
        // 每一步的操作的操作人 key 不同，这个地方 帅哥 用operate_user做判断，前端不用处理了
        // if(formName === 'step_2'){
        //   this.$set(this.statusUpdateData,'receive_user',this.$store.getters.user_name)
        // }else if(formName === 'step_3'){
        //   this.$set(this.statusUpdateData,'audit_user',this.$store.getters.user_name)
        // }else if(formName === 'step_5'){
        //   this.$set(this.statusUpdateData,'submit_user',this.$store.getters.user_name)
        // }else if(formName === 'step_6'){
        //   this.$set(this.statusUpdateData,'record_result_user',this.$store.getters.user_name)
        // }else if(formName === 'step_7'){
        //   this.$set(this.statusUpdateData,'return_user',this.$store.getters.user_name)
        // }
        this.$set(this.statusUpdateData,'operate_user',this.$store.getters.user_name)
        const paramsObj = Object.assign({}, this.statusUpdateData), paramsArray=[], paramsIdArray=paramsObj['dbid'].split(',')
        for(var key in paramsObj){
          if(!paramsObj[key]){
            delete paramsObj[key];
          }
        }
        // 拆成数组形式传参
        for(let i=0;i<paramsIdArray.length;i++){
          const userObject = Object.assign({}, paramsObj)
          userObject['dbid'] = paramsIdArray[i]
          paramsArray.push(userObject)
        }

        visaStatusUpdate(paramsArray).then((res) => {
          // 减少接口请求，是否可以本地更新数据
          this.visaStatusListFn(this.countryCode)
          // 清除表单选项
          this.resetForm(formName)
          this.userStateOperateDialog = false
          // visaStatusList
        }).catch((err) => {
          console.log(err)
        })
      },
      submitForm(formName,item) {
        this.$set(this.$data, 'expandsRow', [])//    闭合所有已打开的操作单号下的内容
        this.$refs[formName].validate(valid => {
          if (valid) {
            if(formName === 'userStateOperate'){
              if(this.statusUpdateData.save_type == '1'){
                if(this.stepTwo == '1'){
                  // 未选择办理节点，给出提示
                  this.$message({
                    message:'请选择办理节点！',
                    type : 'warning'
                  })
                } else {
                  // 关闭第一步，打开第二步
                  this.$set(this.$data,'stepOne',false)
                  // 如果是收资料页面，需要获取一下资料图片
                  if((this.stepTwo == '2' || this.stepTwo == '3') && !!this.statusUpdateData.customer_dbid){
                    visaUserPapers(this.statusUpdateData.customer_dbid).then(data=>{
                      if(data.data && data.data.length > 0){
                        this.$set(this.$data, 'customerImageInfo', data.data[0]);
                      }
                    })
                  }
                }
              }else{
                this.visaStatusOperateFn(formName)
              }
            }else if(formName.indexOf('step_')>-1){
              this.visaStatusOperateFn(formName)
            }else if(formName === 'queryForm'){
              this.$set(this.queryForm, 'page_num', 1)
              this.visaStatusListFn(this.countryCode)
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm(formName) {
        this.$set(this.$data,'stepOne',true)
        this.$set(this.$data,'stepTwo',0)
        this.userStateOperateDialog = false
        this.$refs[formName].resetFields()
        if(formName == 'queryForm'){
          for (let key in this.insertTempDate){
            this.$set(this.queryForm,key+'_date_from','')
            this.$set(this.queryForm,key+'_date_end','')
            this.$set(this.insertTempDate,key,'')
          }
        }
      },
      // 设置默认已经维护到的进度为选中状态
      userStateDefaultSelection(){
        this.$nextTick(function () {
          for(let i=0;i<this.currentProgressOptions.length;i++){
            if(this.currentProgressOptions[i].value <= (this.stepInit-0+1)){
              this.$refs.userStateOperateTable.toggleRowSelection(this.currentProgressOptions[i],true);
            }
          }
        })
      },
      // 设置已经维护到的进度为不可选
      userStateSelectAble(row){
        if(this.statusUpdateData.save_type == '1'){
          if(row.value <= this.stepInit){
            return false
          }else return true
        }else{
          if(row.value == 1) return false
          if(row.value > this.stepInit+1){
            return false
          }else return true
        }

        // return true
      },
      // 维护办理进度 单行
      userStateOperateEdit(index,row){
        // 打开dialog时，清空客人图片信息
        this.$set(this.$data, 'customerImageInfo', {})
        // 打开第一步
        this.$set(this.$data,'stepOne',true)
        // 设置客人DBID
        this.$set(this.statusUpdateData,'customer_dbid',row['customer_dbid'])
        // 设置客人状态id
        this.$set(this.statusUpdateData,'dbid',row['dbid'])
        // 设置最新处理步骤
        this.$set(this.$data,'stepInit',row['current_progress']==3?4:row['current_progress'])
        // 默认选中下一步，减少操作
        this.$set(this.$data,'stepTwo',row['current_progress']==3?5:row['current_progress']-0+1)
        // 保存类型 正向
        this.$set(this.statusUpdateData,'save_type','1')
        this.userStateOperateDialog = true
      },
      // 回退办理进度 单行
      userStateBackEdit(index,row){
        this.$set(this.statusUpdateData,'dbid',row['dbid'])
        this.$set(this.$data,'stepInit',row['current_progress']-1)
        this.$set(this.statusUpdateData,'save_type','2')
        this.userStateOperateDialog = true
      },
      // 关闭dialog时，清空数据
      resetDialog : function () {
          this.stepTwo=0
          this.stepOne=true
          this.$set(this.statusUpdateData,'dbid','')
          this.$set(this.statusUpdateData,'customer_dbid','')
      },
      handleOperEdit(index, row) {
        this.$router.push({
          path: `/fillvisa/visaOper/${row.opt_order_no}`
        })
      },
      handleInfoEdit(index, row, enterpriseId, visaOrderNo) {
        this.$router.push({
          path: `/fillvisa/visaInfo/${enterpriseId}/${visaOrderNo}/${row.passport_no}`
        })
      },
      handleInfoShow(index, row, enterpriseId, visaOrderNo) {
        this.$router.push({
          path: `/fillvisa/visaInfo/${enterpriseId}/${visaOrderNo}/${row.passport_no}`
        })
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
        this.$set(this.queryForm, 'page_size', val)
        this.visaStatusListFn(this.countryCode)
      },
      handleCurrentChange(val) {
        this.$set(this.queryForm, 'page_num', val)
        this.visaStatusListFn(this.countryCode)
      },
      GetDetails(row, expandRows) {
        this.expandsRow[0] === row.opt_order_no ? this.$set(this.$data, 'expandsRow', []) : this.$set(this.$data, 'expandsRow', [row.opt_order_no])
        if (expandRows.indexOf(row) >= 0) {
          // this.$axios.get(window.API_ROOT + 'rest/customer.list.query/v1', { params: { opt_order_no: row.opt_order_no }})
          getDetails(row.opt_order_no).then(resp => {
            // !resp.data ? '' : row.customerList = resp.data;
            //  此处最好不要覆盖customerList下的数据，现在没有双向绑定，所以视图没有变化，但是数据已变，有更好的方法处理
            !resp.data ? '' : resp.data.opt_order_no = row.opt_order_no
            this.$set(row, 'customerList', resp.data.list)
          })
        }
      },
      GetCountry() {
        return getCountry()
      },
      GetDict(dict_type) {
        return getDict(dict_type)
      },
      expandsRowOpt() {
        this.expandsRow.push()
      },
      // 格式row的日期
      formatRowDate(row,key) {
        return row[key.property]?window.UtilObj.formatUnixTimestamp(row[key.property], 'yyyy年MM月dd日'):''
      },
      formatRowDateTime(row,key) {
        return row[key.property]?window.UtilObj.formatUnixTimestamp(row[key.property], 'yyyy-MM-dd hh:mm:ss'):''
      },
      // 格式row的办理节点为中文
      formatRowProgress(row) {
        return this.currentProgressData[row.current_progress]
      },
      handleTabClick(tabId){
        this.currentTab = tabId
        this.queryForm.have_progress = tabId
        this.resetForm('queryForm')
        this.submitForm('queryForm')
      },
      // 列表选择多个用户
      handleSelectUser(user) {
        const selectUserId = []
        this.stepInit = user.length?user['0']['current_progress']:'1'
        for(let i=0;i<user.length;i++){
          selectUserId.push(user[i]['dbid'])
          if(this.stepInit<user[i]['current_progress']){ // 列表选择时，以选中用户中状态最大的为基准
            this.stepInit = user[i]['current_progress']
          }
        }
        this.stepTwo = this.stepInit==3?this.stepInit-0+2:this.stepInit-0+1
        if(user.length == 1){
          // 仅仅只有一人的时候，需要设置客人DBID（用来查询图片）
          this.$set(this.statusUpdateData,'customer_dbid',user[0]['customer_dbid'])
        } else {
          this.$set(this.statusUpdateData,'customer_dbid', '')
        }
        this.$set(this.statusUpdateData,'dbid',selectUserId.join(','))
      },
      handleSelectState(items,current){
        const originIndex=this.currentProgressOptions.indexOf(current),originLength=this.currentProgressOptions.length;
        for (let i = 0; i < originLength; i++) {
          if(i<=originIndex){
            if(items.indexOf(current)>-1){
              this.$refs.userStateOperateTable.toggleRowSelection(this.currentProgressOptions[i],true);
              // 显示第二步的标题用
              this.stepTwo = current.value
            }else{
              this.$refs.userStateOperateTable.toggleRowSelection(this.currentProgressOptions[originIndex],false);
              // 显示第二步的标题用，第4步 约签 不需要
              this.stepTwo = this.currentProgressOptions[originIndex-1].value==4?3:this.currentProgressOptions[originIndex-1].value
            }
          }else{
            this.$refs.userStateOperateTable.toggleRowSelection(this.currentProgressOptions[i],false);
          }
        }
        // console.log(items);
      },
      handleInfoDialog(){
        this.StateInfoDialog = true
        // this.$confirm('确认关闭？')
        //   .then(_ => {
        //     done();
        //   })
        //   .catch(_ => {});
      },
      // 鼠标放到图片上时触发的事件
      imgHoverFn(item){
        // console.log(item.target.height,item.target.width,item.target.x,item.target.y);
        item.target.className = 'img-big-show'
      },
      imgOutFn(item){
        item.target.className = ''
      },
      multipleSelectOpen(){
        let selectLen = this.statusUpdateData.dbid.split(',').length
        // 点击按钮时需要有选项的提醒
        if(!this.statusUpdateData.dbid && selectLen<=1){
          this.$confirm('必须选择一项')
            .then(_ => {
              done();
            })
            .catch(_ => {});
          return false
        }else{
          // 打开dialog时，清空客人图片信息
          this.$set(this.$data, 'customerImageInfo', {})
          // 打开第一步
          this.$set(this.$data,'stepOne',true)
          this.$set(this.statusUpdateData,'save_type','1')
          this.userStateOperateDialog = true
        }
      }
    },
    created(){
      this.countryCode = this.$route.query['country_code']
      this.visaStatusListFn(this.countryCode)
      this.$axios
        .all([this.GetDict('visa_result'), this.GetDict('return_type'), this.GetDict('current_progress'), this.GetDict('customer_status')])
        .then(this.$axios.spread((visaResultResp, returnTypeResp,currentProgressResp,customerStatusResp) => {
          // 出签结果
          this.visaResultOptions = !visaResultResp.data ? [] : visaResultResp.data
          // 资料返还类型
          this.returnTypeOptions = !returnTypeResp.data ? [] : returnTypeResp.data.map(item => { return { label: item.value, value: item.code } })
          // 当前进度
          this.currentProgressOptions = !currentProgressResp.data ? [] : currentProgressResp.data.map(item => {
            this.$set(this.currentProgressData,item.code,item.value)
            return { label: item.value, value: item.code }
          })
          // 客人状态
          this.customerStatusOptions = [{label:'全部',value:''}].concat(!customerStatusResp.data ? [] : customerStatusResp.data.map(item => {
            this.$set(this.customerStatusData,item.code,item.value)
            return { label: item.value, value: item.code }
          }))
        })).catch((err) => {
        console.log(err)
      })
    },
    mounted() {
    },
    destroyed() {

    }
  }
</script>