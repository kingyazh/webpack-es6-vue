/* eslint-disable */
<template>
    <el-container>
        <el-main class="padding-small">
            <h4 class="part_title">查 询</h4>
            <el-form :model="queryForm" ref="searchUser" label-width="130px" status-icon>
                <el-row :gutter="20">
                    <el-col :span="10" :offset="2">
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="queryForm.name" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="手机号" prop="phone">
                            <el-input v-model="queryForm.phone" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="10" :offset="2">
                        <el-form-item label="角色" prop="role">
                            <el-select v-model="queryForm.role" placeholder="请选择" filterable clearable >
                                <el-option v-for="item in systemRoleList" :key="item.role_id" :label="item.role_name" :value="item.role_id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="queryForm.email" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="10" :offset="2">
                        <el-form-item label="创建日期" prop="insertDate">
                            <el-date-picker style="width:100%"
                                v-model="insertDate"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="timestamp">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item label="状态" prop="state">
                            <el-select v-model="queryForm.user_state" placeholder="请选择" clearable>
                                <el-option v-for="item in userStateList" :key="item.code" :label="item.value" :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col style="text-align:right" :span="20" :offset="2">
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('searchUser')">查询</el-button>
                            <el-button @click="resetForm('searchUser')">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <h4 class="part_title">列 表</h4>
            <el-row class="system_operate">
                <el-button type="primary" @click="showNewUserDialog">新增</el-button>
                <el-button type="primary" @click="userSetting('can')">启用</el-button>
                <el-button type="primary" @click="userSetting('cannot')">禁用</el-button>
                <el-button type="primary" @click="userSetting('delete')">删除</el-button>
            </el-row>
            <!--// 列表-->
            <el-table :data="userList" border header-cell-class-name="table-head-th" :row-key="getRowKeys"
                      :expand-row-keys="expandsRow" @expand-change="GetDetails" ref="multipleTable" @selection-change="handleSelectionChange">
                <el-table-column align="center" type="selection">
                </el-table-column>
                <el-table-column align="center" label="姓名" prop="name">
                </el-table-column>
                <el-table-column align="center" label="角色" prop="role">
                    <template slot-scope="scope">
                        <div :key="role.role_id" v-for="role in scope.row.roleList">
                            {{role['role_name']}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="手机号" prop="phone">
                </el-table-column>
                <el-table-column align="center" label="邮箱" prop="email">
                </el-table-column>
                <el-table-column align="center" label="创建时间" prop="insert_date" :formatter="formatRowDate">
                </el-table-column>
                <el-table-column align="center" width="100" label="状态" prop="user_state_name">
                </el-table-column>

                <el-table-column width="300" label="操作" align="center">
                    <!--// 点击编辑时的弹出框-->
                    <template slot-scope="scope">
                        <el-popover
                            :ref="scope.row['dbid']+'Edit'"
                            popper-class="edit-user-popover"
                            placement="right"
                            width="400"
                            trigger="click">
                            <h4 class="part_title">编辑用户信息</h4>
                            <el-form :model="editUserData" ref="editUserInfo" label-width="100px" status-icon>
                                <el-row :gutter="20">
                                    <el-col :span="22">
                                        <el-form-item label="姓名" prop="name" :rules="[{ required: true, message: '必填，不能为空', trigger: 'blur' }]">
                                            <el-input v-model="editUserData['dbid']" placeholder="" style="display: none;"></el-input>
                                            <el-input v-model="editUserData.name" placeholder=""></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="22">
                                        <el-form-item label="手机" prop="phone" :rules="[{ required: true, message: '必填，不能为空', trigger: 'blur' },{ pattern: /^1[3456789]\d{9}$/, message: '目前只支持中国大陆的手机号码' }]">
                                            <el-input v-model="editUserData.phone" placeholder=""  style="width: 100%;"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="22">
                                        <el-form-item label="邮箱" prop="email">
                                            <el-input v-model="editUserData.email" placeholder=""  style="width: 100%;"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="22">
                                        <el-form-item label="角色" prop="role">
                                            <el-select v-model="editUserData.role" placeholder="请选择" multiple clearable>
                                                <el-option v-for="item in systemRoleList" :key="item.role_id" :label="item.role_name" :value="item.role_id">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col style="text-align:center" :span="20" :offset="2">
                                        <el-form-item>
                                            <el-button type="primary" @click="submitForm('editUserInfo',scope.row)">保存</el-button>
                                            <el-button @click="resetForm('editUserInfo',scope.row['dbid']+'Edit')">取消</el-button>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                            <el-button type="primary" size="mini" slot="reference" @click="openEditUser(scope.row,scope.$index)">编辑</el-button>
                        </el-popover>
                        <el-button type="danger" plain size="mini" @click="submitForm('deleteChosenUser', scope.row)">删除</el-button>
                        <el-button :type="scope.row['user_state_name']==='禁用'?'primary':'danger'" :plain="scope.row['user_state_name']==='禁用'?false:true" size="mini" @click="submitForm('forbidChosenUser', scope.row)">{{scope.row['user_state_name']==='禁用'?'启用':'禁用'}}</el-button>

                        <el-popover
                            popper-class="edit-user-popover"
                            :ref="scope.row['dbid']+'PWD'"
                            placement="right"
                            width="400"
                            trigger="click">
                            <h4 class="part_title">修改用户密码</h4>
                            <el-form :model="editUserData" ref="changeUserPWD" :rules="rulesCheckPWD" label-width="130px" status-icon>
                                <el-row :gutter="20">
                                    <el-col :span="22">
                                        <el-form-item label="密码" prop="password">
                                            <el-input type="password" v-model="editUserData.password" placeholder="" auto-complete="off"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="22">
                                        <el-form-item label="密码确认" prop="checkPassword">
                                            <el-input type="password" v-model="editUserData.checkPassword" placeholder="" auto-complete="off"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col style="text-align:center" :span="20" :offset="2">
                                        <el-form-item>
                                            <el-button type="primary" @click="submitForm('changeUserPWD',scope.row)">保存</el-button>
                                            <el-button @click="resetForm('changeUserPWD',scope.row['dbid']+'PWD')">取消</el-button>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                            <el-button type="primary" size="mini" slot="reference">重置密码</el-button>
                        </el-popover>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.page_num" :page-sizes="[page.page_size]" layout="total, sizes, prev, pager, next" :total="page.total" style="padding:10px;text-align:right">
            </el-pagination>
        </el-main>

        <!--// 新建用户弹出层-->
        <el-dialog title="新增商家用户" :visible.sync="addNewUserDialog">
            <el-form :model="addUserData" ref="addUserInfo" :rules="addNewUserRules" label-width="100px" status-icon>
                <el-row :gutter="20">
                    <el-col :span="22">
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="addUserData.name" placeholder=""></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="22">
                        <el-form-item label="手机" prop="phone">
                            <el-input v-model="addUserData.phone" placeholder="" style="width: 100%;"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="22">
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="addUserData.email" placeholder=""  style="width: 100%;"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="22">
                        <el-form-item label="角色" prop="role">
                            <el-select v-model="addUserData.role" placeholder="请选择" multiple clearable >
                                <el-option v-for="item in systemRoleList" :key="item.role_id" :label="item.role_name" :value="item.role_id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                <el-col :span="22">
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="addUserData.password" placeholder="" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
                <el-row :gutter="20">
                    <el-col :span="22">
                        <el-form-item label="密码确认" prop="checkAddPassword">
                            <el-input type="password" v-model="addUserData.checkAddPassword" placeholder="" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col style="text-align:center" :span="20" :offset="2">
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('addUserInfo')">保存</el-button>
                            <el-button @click="resetForm('addUserInfo'),addNewUserDialog = false">取消</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
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
.el-select,.el-date-picker {
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
  import { getDict } from '@/api/DictionaryTool'
  import { userPagination, systemRoleList, resetPwdSystem, eidtUserState, editSystemUser, addSystemUser, checkEmailExists, checkPhoneExists } from '@/api/UserManage'
  export default {
    data() {
      // 密码校验
      let validatePass = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入密码'));
        } else {
          if (this.editUserData.checkPassword !== '') {
            this.$refs.changeUserPWD.validateField('checkPassword');
          }
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.editUserData.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      let validateAddPass = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入密码'));
        } else {
          if(this.addUserData.checkAddPassword !== ''){
            this.$refs.addUserInfo.validateField('checkAddPassword');
          }
          callback();
        }
      };
      let validateAddPass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.addUserData.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

      const phoneExistValidator = (rule, value, callback) => {
        if (value) {
          checkPhoneExists({
            phone: value
          }).then(resp => {
            if (resp.status === 200) {
              if (resp.data['code'] === '10000') {
                callback();
              } else {
                callback(new Error('手机号码已存在，换一个号码再试'))
              }
            }
          })
        } else {
           if (this.addUserData.email) {
            callback();
          } else {
            callback(new Error('手机号码和邮箱不能全部为空'));
          }
        }
      }
      const emailExistValidator = (rule, value, callback) => {
        if (value) {
          checkEmailExists({
            email: value
          }).then(resp => {
            if (resp.status === 200) {
              if (resp.data['code'] === '10000') {
                callback();
              } else {
                callback(new Error('邮箱已存在，换一个邮箱再试'))
              }
            }
          })
        } else {
          if (this.addUserData.phone) {
            callback();
          } else {
            callback(new Error('手机号码和邮箱不能全部为空'));
          }
        }
      }
      return {
        userList: [],
        page: {
          page_num: 1,
          page_size: 10,
          total: 0
        },
        queryForm: {
          name: '',
          phone: '',
          email: '',
          state: '',
          role: '',
          insert_date_start: '',
          insert_date_end: '',
          page_num: 1,
          page_size: 10
        },
        editUserData:{},
        insertDate:[],
        userStateList: [],
        systemRoleList: [],
        editCurrentUser: -1,
        // 获取row的key值
        getRowKeys(row) {
          return row.opt_order_no
        },
        expandsRow: [],
        userChoose: [],
        addUserData:{},
        addNewUserDialog: false,
        addNewUserRules: {
          name:[
            { required: true, message: '必填，不能为空', trigger: 'blur' }
          ],
          phone:[
            { pattern: /^1[3456789]\d{9}$/, message: '目前只支持中国大陆的手机号码' },
            { required: true, trigger: 'blur', validator: phoneExistValidator }
          ],
          email:[
            { pattern: /^\w+\@+[0-9a-zA-Z]+\.(com|com.cn|edu|hk|cn|net|live|xin|cc|co|org|edu)$/, message: '填写正确的邮箱', trigger: 'blur' },
            { required: true, trigger: 'blur', validator: emailExistValidator }
          ],
          role:[
            { type:'array',required: true, message: '必填，不能为空', trigger: 'change' }
          ],
          password: [
            { required: true, message: '必填，不能为空', trigger: 'blur' },
            { validator: validateAddPass, trigger: 'blur' }
          ],
          checkAddPassword: [
            { validator: validateAddPass2, trigger: 'blur' }
          ]
        },
        multipleSelection: [],
        rulesCheckPWD: {
          password: [
            { required: true, message: '必填，不能为空', trigger: 'blur' },
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPassword: [
            { validator: validatePass2, trigger: 'blur' }
          ]
        }
      }
    },
    computed: {

    },
    watch:{
      insertDate:{
        handler:function(val){
          if(val){
            this.$set(this.queryForm,'insert_date_start',val[0]);
            this.$set(this.queryForm,'insert_date_end',val[1]);
          }
        },
        deep:true
      },
    },
    methods: {
	  showNewUserDialog() {
        this.addNewUserDialog = true
        this.addUserData = {}
      },
      userListFn() {
        const paramsObj = Object.assign({}, this.queryForm)
        for(let objKey in paramsObj){
          if(!paramsObj[objKey]){
            delete paramsObj[objKey];
          }
        }
        userPagination(paramsObj).then((res) => {
          !res.data ? '' : this.$set(this.$data, 'userList', res.data.list)
          this.$set(this.$data, 'page', res.data.page)
          this.$set(this.queryForm, 'page_num', res.data.page.page_num)
          this.$set(this.queryForm, 'page_size', res.data.page.page_size)
        }).catch((err) => {
          console.log(err)
        })
      },
      // 所有表单提交
      submitForm(formName,item) {
        this.$set(this.$data, 'expandsRow', [])//    闭合所有已打开的操作单号下的内容
        // 当前选中用户所在数组中的位置
        let userIndex = !item?'':this.userList.indexOf(item)

        if(!this.$refs[formName]){
          if(formName==='deleteChosenUser'){// 删除选中用户
            eidtUserState(item['dbid'],3).then((res)=>{
              if (userIndex > -1) {
                // 当删除成功后 当前界面dom也有删除操作
                this.userList.splice(userIndex, 1);
              }
            }).catch((err) => {
              console.log(err)
            })
          }else if(formName==='forbidChosenUser'){// 禁止选中用户
            // console.log('forbidChosenUser', item);
            let stateCode = (!item.user_state || item.user_state == '1')?2:1
            eidtUserState(item['dbid'],stateCode).then((res)=>{
              if (userIndex > -1) {
                // 当禁用成功后 当前界面dom也有按钮有状态变化
                this.userList[userIndex]['user_state'] = stateCode
                this.userList[userIndex]['user_state_name'] = item['user_state_name']==='启用'?'禁用':'启用'
              }
            }).catch((err) => {
              console.log(err)
            })
          }
        }else{
          this.$refs[formName].validate(valid => {
            if (valid) {
              if(formName==='searchUser'){// 查询符合条件的用户列表
                this.$set(this.queryForm, 'page_num', 1)
                this.userListFn()
              }else if(formName==='editUserInfo'){// 编辑用户信息
                let roleArray = [], editDateObj = Object.assign({},this.editUserData);
                // this.editUserData['role'].forEach((role,index)=>{
                //   // 其实 openEditUser 方法已经将里面结构改变，这个地方做的判断暂时留着
                //   if(typeof role === 'string'){
                //     roleArray.push({'role_id':role})
                //   }else{
                //     roleArray.push({'role_id':role['role_id']})
                //   }
                // })

                roleArray = this.editUserData.role.map((val,b)=>{
                  return {role_id:val}
                })

                editDateObj['role'] = roleArray
                delete editDateObj['user_state']
                delete editDateObj['user_state_name']
                delete editDateObj['roleList']
                editSystemUser(editDateObj).then((res) => {
                  // 当修改成功后 当前界面dom也有修改操作
                  this.$set(this.userList,userIndex,this.editUserData)
                  // 关闭 popover
                  if(item){
                    let layerID = item['dbid']+'Edit'
                    this.$refs[layerID].doClose()
                  }
                }).catch((err) => {
                  console.log(err)
                })
              }else if(formName==='changeUserPWD'){// 编辑用户密码
                console.log(item);
                let userId = item['dbid'], passwordStr = this.editUserData['checkPassword']
                resetPwdSystem(userId,passwordStr).then((res) => {
                  // 关闭 popover
                  if(item){
                    let layerID = item['dbid']+'PWD'
                    this.$refs[layerID].doClose()
                  }
                }).catch((err) => {
                  console.log(err)
                })
              }else if(formName==='addUserInfo'){// 新建用户信息
                let paramsObj = Object.assign({},this.addUserData);
                paramsObj.role = this.addUserData.role.map((val,b)=>{
                  return {role_id:val}
                })
                delete paramsObj.checkAddPassword
                addSystemUser(paramsObj).then((res) => {
                  // 关闭 弹出框
                  this.addNewUserDialog = false
                  this.userListFn()
                }).catch((err) => {
                  console.log(err)
                })
              }
            } else {
              console.log('error submit!!')
              return false
            }
          })
        }
      },
      // 所有表单重置和取消功能，包含关闭某些弹出框
      resetForm(formName,id) {
        this.$refs[formName].resetFields()
        // 关闭 popover
        if(id){
          this.$refs[id].doClose()
        }
        if(formName === 'searchUser'){
          this.queryForm.user_state = ''
          this.insertDate = []
        }
      },
      // 编辑弹出层 点击保存
      editUserForm(){
        editSystemUser().then((res) => {
        }).catch((err) => {
          console.log(err)
        })
      },
      handleUserEdit(index, row) {

      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
        this.$set(this.queryForm, 'page_size', val)
        this.userListFn()
      },
      handleCurrentChange(val) {
        this.$set(this.queryForm, 'page_num', val)
        this.userListFn()
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
      GetsystemRole() {
        return systemRoleList()
      },
      GetDict(dict_type) {
        return getDict(dict_type)
      },
      expandsRowOpt() {
        this.expandsRow.push()
      },
      openAddUser(){

      },
      openEditUser(user,index){
        this.editCurrentUser = index
        let thisUserInfo = Object.assign({},user);
        // 角色的多选部分需要将之前的数组结构为纯数组形式
        let roleArray = []
        thisUserInfo['roleList'].forEach((role)=>{
          if(typeof role === 'object'){
            roleArray.push(role['role_id'])
          }else{
            roleArray.push(role)
          }
        })
        thisUserInfo['role'] = roleArray
        this.$set(this.$data,'editUserData',thisUserInfo)
      },
      addNewUser(){
        addSystemUser(paramsObj).then((res) => {
          !res.data ? '' : this.$set(this.$data, 'userList', res.data.list)
          this.$set(this.$data, 'page', res.data.page)
          this.$set(this.queryForm, 'page_num', res.data.page.page_num)
          this.$set(this.queryForm, 'page_size', res.data.page.page_size)
        }).catch((err) => {
          console.log(err)
        })
      },
      userSetting(set){
        if(this.multipleSelection.length){
          let paramsUserId = this.multipleSelection.join(',')
          if(set === 'can'){
            eidtUserState(paramsUserId,1).then((res) => {
              this.changeSelectState()
            }).catch((err) => {
              console.log(err)
            })
          }else if(set === 'cannot'){
            eidtUserState(paramsUserId,2).then((res) => {
              this.changeSelectState()
            }).catch((err) => {
              console.log(err)
            })
          }else if(set === 'delete'){
            eidtUserState(paramsUserId,3).then((res) => {
              this.changeSelectState('delete')
            }).catch((err) => {
              console.log(err)
            })
          }
        }
      },
      // 格式row的日期
      formatRowDate(row,key) {
        return row[key.property]?window.UtilObj.formatUnixTimestamp(row[key.property], 'yyyy年MM月dd日'):''
      },
      handleSelectionChange(val,index) {
        let selectUserId = []
        val.forEach((user)=>{
          selectUserId.push(user['dbid'])
        })
        this.$set(this.$data,'multipleSelection',selectUserId)
      },
      checkPWD:(a,b,c)=>{
        console.log(a, b, c);
      },
      changeSelectState(method){
        let tempUserList = [], tempMultipleSelection = [];
        for(let i=0;i<this.userList.length;i++){
          tempUserList[this.userList[i]['dbid']] = {index:i}
        }
        for(let j=0;j<this.multipleSelection.length;j++){
          if(tempUserList[this.multipleSelection[j]]){
            let userIndex = tempUserList[this.multipleSelection[j]].index
            if(method=='delete'){
              this.userList.splice(userIndex,1)
            }else{
              // 当禁用成功后 当前界面dom也有按钮有状态变化
              this.userList[userIndex]['user_state_name'] = this.userList[userIndex]['user_state_name']==='启用'?'禁用':'启用'
            }
          }
        }
      }
    },
    mounted() {
      this.userListFn()
      this.$axios
        .all([this.GetDict('user_state'), this.GetsystemRole()])
        .then(this.$axios.spread((userStateResp, systemRoleResp) => {
          this.$set(this.$data,'userStateList',!userStateResp.data ? [] : userStateResp.data)
          this.$set(this.$data,'systemRoleList',!systemRoleResp.data ? [] : systemRoleResp.data)
        })).catch((err) => {
        console.log(err)
      })
    },
    destroyed() {

    }
  }
</script>