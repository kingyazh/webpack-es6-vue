<template>
<<<<<<< .mine
  <el-container>
    <el-main>
      <h4 class="part_title">查 询</h4>
      <el-form :model="ruleForm" ref="ruleForm" label-width="130px" status-icon>
        <el-row :gutter="20">
          <el-col :span="10" :offset="2">
            <el-form-item label="操作单号" prop="opCode">
              <el-input v-model="ruleForm.opCode" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="团号/订单号" prop="code">
              <el-input v-model="ruleForm.code" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10" :offset="2">
            <el-form-item label="国家" prop="country">
              <el-input v-model="ruleForm.country" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="签证类型" prop="visaType">
              <el-select v-model="ruleForm.visaType" placeholder="请选择">
                <el-option v-for="item in visaOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10" :offset="2">
            <el-form-item label="送签地" prop="signPlace">
              <el-input v-model="ruleForm.signPlace" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="操作状态" prop="status">
              <el-input v-model="ruleForm.status" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col style="text-align:right" :span="20" :offset="2">
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">查询</el-button>
              <el-button v-on:click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <h4 class="part_title">列 表</h4>
      <el-table :data="optOrderList.list" border header-cell-class-name="table-head-th" @cell-click="customerListFn('operationCode9393993494')">
        <el-table-column type="expand">
        <!--<template slot-scope="props">-->
        <!--<el-table :data="props.row.details" border style="width: 100%;" header-cell-class-name="table-head-th">-->
        <!--<el-table-column align="center" prop="id" label="日期" width="180">-->
        <!--</el-table-column>-->
        <!--<el-table-column align="center" prop="name" label="姓名" width="180">-->
        <!--</el-table-column>-->
        <!--<el-table-column align="center" prop="desc" label="地址">-->
        <!--</el-table-column>-->
        <!--</el-table>-->
        <!--</template>-->
        </el-table-column>
        <el-table-column align="center" label="操作单号" prop="opt_order_no">
        </el-table-column>
        <el-table-column align="center" label="要证/出发日期" prop="leave_date">
        </el-table-column>
        <el-table-column align="center" label="团号/订单号" prop="team_no">
        </el-table-column>
        <el-table-column align="center" label="办签人数" prop="person_num">
        </el-table-column>
        <el-table-column align="center" label="国家" prop="country_name">
        </el-table-column>
        <el-table-column align="center" label="送签地" prop="visa_center_name">
        </el-table-column>
        <el-table-column align="center" label="签证类型" prop="visa_type_name">
        </el-table-column>
        <el-table-column align="center" label="操作状态" prop="opt_status_name">
        </el-table-column>
        <el-table-column width="180" label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.page_num" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="40000" style="padding:10px;text-align:right">
      </el-pagination>
    </el-main>
  </el-container>
=======
    <el-container>
        <el-main>
            <h4 class="part_title">查 询</h4>
            <el-form :model="queryForm" ref="queryForm" label-width="130px" status-icon>
                <el-row :gutter="20">
                    <el-col :span="10" :offset="2">
                        <el-form-item label="操作单号" prop="opt_order_no">
                            <el-input v-model="queryForm.opt_order_no" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="团号/订单号" prop="team_no">
                            <el-input v-model="queryForm.team_no" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="10" :offset="2">
                        <el-form-item label="国家" prop="country_code">
                            <el-input v-model="queryForm.country_code" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="签证类型" prop="visa_type">
                            <el-select v-model="queryForm.visa_type" placeholder="请选择">
                                <el-option v-for="item in visaTypeOptions" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="10" :offset="2">
                        <el-form-item label="送签地" prop="visa_center_code">
                            <el-select v-model="queryForm.visa_center_code" placeholder="请选择">
                                <el-option v-for="item in visaCenterOptions" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="操作状态" prop="opt_status">
                            <el-select v-model="queryForm.opt_status" placeholder="请选择">
                                <el-option v-for="item in optStatusOptions" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col style="text-align:right" :span="20" :offset="2">
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('queryForm')">查询</el-button>
                            <el-button v-on:click="resetForm('queryForm')">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <h4 class="part_title">列 表</h4>
            <el-table :data="optOrderList.list" border header-cell-class-name="table-head-th" @expand-change="getDetails">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-table :data="props.row.details" border header-cell-class-name="table-head-th">
                            <el-table-column align="center" label="序号" width="60">
                            </el-table-column>
                            <el-table-column align="center" prop="customer_name" label="客人姓名">
                            </el-table-column>
                            <el-table-column align="center" prop="passport_no" label="护照号">
                            </el-table-column>
                            <el-table-column align="center" prop="customer_status" label="客人状态">
                            </el-table-column>
                            <el-table-column align="center" prop="case_code" label="M码">
                            </el-table-column>
                            <el-table-column align="center" prop="fill_user" label="填表人">
                            </el-table-column>
                            <el-table-column align="center" prop="fill_time" label="填表时间">
                            </el-table-column>
                            <el-table-column align="center" prop="fill_status" label="填表状态">
                            </el-table-column>
                            <el-table-column align="center" label="操作">
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column type="index" align="center" label="序号">
                </el-table-column>
                <el-table-column align="center" label="操作单号" prop="opt_order_no">
                </el-table-column>
                <el-table-column align="center" label="要证/出发日期" prop="leave_date">
                </el-table-column>
                <el-table-column align="center" label="团号/订单号" prop="team_no">
                </el-table-column>
                <el-table-column align="center" label="办签人数" prop="person_num">
                </el-table-column>
                <el-table-column align="center" label="国家" prop="country_name">
                </el-table-column>
                <el-table-column align="center" label="送签地" prop="visa_center_name">
                </el-table-column>
                <el-table-column align="center" label="签证类型" prop="visa_type_name">
                </el-table-column>
                <el-table-column align="center" label="操作状态" prop="opt_status_name">
                </el-table-column>
                <el-table-column width="180" label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button @click="handleEdit(scope.$index, scope.row)">
                            编辑</el-button>
                        <el-button type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.page_num" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="40000" style="padding:10px;text-align:right">
            </el-pagination>
        </el-main>
    </el-container>
>>>>>>> .r14
</template>
<style scoped lang="scss">
.el-main {
    margin: 0 2rem 2rem;
    background-color: #ffffff;
    color: #333;
    text-align: center;
    // line-height: 160px;
}
.part_title {
    line-height: 3rem;
    padding: 0 1.5rem;
    margin: 0 0 2rem;
    text-align: left;
    background-color: #409eff;
    color: #ffffff;
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
export default {
    data() {
        return {
            optOrderList: {

<<<<<<< .mine
                },
                customerList:{

                },
                page:{

                },
                ruleForm: {
                    opCode: "",
                    code: "",
                    country: "",
                    visaType: "",
                    signPlace: "",
                    status: ""
                },
                visaOptions: [
                {
                    value: 1,
                    label: "签证类型1"
                },
                {
                    value: 2,
                    label: "签证类型2"
                }
            ],

        }
        },
        methods: {
            optOrderListFn(){
                let paramsObj = {
                    opt_order_no:'oon123',
                    team_no:'tn123',
                    country_code:'US',
                    visa_type:'B1B2',
                    visa_center_code:'BJS',
                    opt_status:1,
                    page_num:1,
                    page_size:10
                };
                this.$axios({
                    method:'POST',
                    url: window.API_ROOT + 'rest/optOrder.pagination/v1',
                    // 传参方式有两种 params 和 data，params 是添加到url的请求字符串中的，data 是添加到请求体（body）中的，主要看接口接受参数的方式，以下两种都可以
                    // params:{
                    //     opt_order_no:'oon123',
                    //     team_no:'tn123',
                    //     country_code:'US',
                    //     visa_type:'B1B2',
                    //     visa_center_code:'BJS',
                    //     opt_status:1,
                    //     page_num:1,
                    //     page_size:10
                    // }
                    data:JSON.stringify(paramsObj)
                }).then((res)=>{
                    this.optOrderList = res.data;
                    this.page = res.data.page;
                }).catch((err)=>{
                    console.log(err)
                });
=======
>>>>>>> .r14
            },
<<<<<<< .mine
            customerListFn(id){
                alert(id);
                let paramsObj = {
                    opt_order_no:id
                };
                this.$axios({
                    method:'POST',
                    url: window.API_ROOT + 'rest/customer.list.query/v1',
                    // 传参方式有两种 params 和 data，params 是添加到url的请求字符串中的，data 是添加到请求体（body）中的，主要看接口接受参数的方式，以下两种都可以
                    // params:{
                    //     opt_order_no:'oon123',
                    //     team_no:'tn123',
                    //     country_code:'US',
                    //     visa_type:'B1B2',
                    //     visa_center_code:'BJS',
                    //     opt_status:1,
                    //     page_num:1,
                    //     page_size:10
                    // }
                    data:JSON.stringify(paramsObj)
                }).then((res)=>{
                    this.optOrderList = res.data;
                    this.page = res.data.page;
                }).catch((err)=>{
                    console.log(err)
                });
            },
=======
            page: {
>>>>>>> .r14

            },
            queryForm: {
                opt_order_no: "",
                team_no: "",
                country_code: "",
                visa_type: "",
                visa_center_code: "",
                opt_status: ""
            },
            optStatusOptions: [],
            visaTypeOptions: [],
            visaCenterOptions: [],
        }
    },
    methods: {
        optOrderListFn() {
            let paramsObj = {
                opt_order_no: 'oon123',
                team_no: 'tn123',
                country_code: 'US',
                visa_type: 'B1B2',
                visa_center_code: 'BJS',
                opt_status: 1,
                page_num: 1,
                page_size: 10
            };
            this.$axios({
                method: 'POST',
                url: window.API_ROOT + 'rest/optOrder.pagination/v1',
                // 传参方式有两种 params 和 data，params 是添加到url的请求字符串中的，data 是添加到请求体（body）中的，主要看接口接受参数的方式，以下两种都可以
                // params:{
                //     opt_order_no:'oon123',
                //     team_no:'tn123',
                //     country_code:'US',
                //     visa_type:'B1B2',
                //     visa_center_code:'BJS',
                //     opt_status:1,
                //     page_num:1,
                //     page_size:10
                // }
                data: JSON.stringify(paramsObj)
            }).then((res) => {
                this.optOrderList = res.data;
                this.page = res.data.page;
            }).catch((err) => {
                console.log(err)
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    console.log(this.queryForm);
                    alert("submit!");
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        handleEdit(index, row) {
            console.log(index, row);
        },
        handleDelete(index, row) {
            console.log(index, row);
            console.log(this.$router);
            if (index == 0) {
                this.$router.push({
                    path: `/VisaInfo/111/${index}`
                });
            }
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        },
        getDetails(row, expandRows) {
            console.log(row, expandRows);
            console.log(expandRows.indexOf(row));
            if (expandRows.indexOf(row) >= 0) {
                this.$axios.get(window.API_ROOT + 'rest/customer.list.query/v1', { params: { opt_order_no: row.opt_order_no } }).then(resp => {
                    console.log(resp);
                })
            }
        },
        getDict(dict_type) {
            return this.$axios.get(window.API_ROOT + 'rest/dict.query.type/v1', { params: { dict_type: dict_type } });
        },
        getVisaType() {
            return this.$axios.get(window.API_ROOT + 'rest/dict.query.visaType/v1');
        },
        getVisaCenter() {
            return this.$axios.get(window.API_ROOT + 'rest/dict.query.visaCenter/v1');
        }
    },
    mounted() {
        this.optOrderListFn();
        this.$axios
            .all([this.getDict('operate_status'), this.getVisaType(), this.getVisaCenter()])
            .then(this.$axios.spread((opeStatusResp, visaTypeResp, visaCenterResp) => {
                console.log(opeStatusResp, visaTypeResp, visaCenterResp);
                // 操作状态
                const data = opeStatusResp.data;
                console.log(data);
                this.optStatusOptions = !opeStatusResp.data ? [] : opeStatusResp.data.map(item => { return { label: item.visa_type_name, value: item.visa_type } });
                // 签证类型
                this.visaTypeOptions = !visaTypeResp.data ? [] : visaTypeResp.data.map(item => { return { label: item.visa_type_name, value: item.visa_type } });
                // 签证中心
                this.visaCenterOptions = !visaCenterResp.data ? [] : visaCenterResp.data.map(item => { return { label: item.visa_type_name, value: item.visa_type } });
            }));
    },
};
</script>