import {
  httpgetjson,
  httppostjson
} from '../../../utils/http.js';
import {
  Base64,
  formatDate,
  dateToString,
  stringToDate, clone
} from '../../../utils/util.js'
import {
  SUCCESSCODE
} from '../../../utils/consts.js'

var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    step: 1,
    cityArrayJson: {}, // key type为city的comp的name，value ，当前comp对应的二维数组
    list: [], // 全部表单comps组件
    requireList: [], // 上传 - 必填资料
    otherList: [], // 上传 - 其他资料
    custInfo: {}, // 客人信息原始数据
    selectIndex: {}, // 申请表 - picker控件索引
    dataInfo: {}, // 申请表 - 修改中的数据
    processList: [], // 办理状态
    checkOutList: [], // 出签配送
    isShowModal : false // 是否打开modal
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      step: options.step,
      orderid: options.orderid, // 订单id
      dbid: options.dbid, // 客人id
      name: options.name,
      cityJson: app.globalData.cityJson
    })
    wx.setNavigationBarTitle({
      title: options.name,
    })
    this.reloadPage(options);
  },

  reloadPage: function(options) {
    var _this = this;
    // 清除所有的缓存
    wx.removeStorageSync('formData:' + options.dbid);
    wx.removeStorageSync('custInfo:' + options.dbid);
    // 第一步 和 第二步 需要查询界面渲染基本数据和客人数据
    if (options.step == 1 || options.step == 2) {
      wx.showLoading();
      // 查询界面渲染基本数据
      httpgetjson('mp.customer.model', {
        customer_id: options.dbid
      }).then(data => {
        wx.hideLoading();
        if (data.data && data.data.length > 0) {
          // 处理formData
          var formData = _this.handleFormData(data.data);
          // 将动态表单数据放入storage，以便ocr界面获取
          wx.setStorageSync('formData:' + options.dbid, formData);

          // -----查询客人现有信息
          wx.showLoading({
            mask: true
          });
          httpgetjson('mp.customer.init', {
            customer_id: options.dbid
          }).then(data => {
            if (data.data && typeof data == 'object') {
              // 将客人现有信息放入storage，以便保存时比对
              var custInfo = clone(data.data);
              wx.setStorageSync('custInfo:' + options.dbid, custInfo);
              _this.setData({
                custInfo: custInfo
              });
              // 初始化数据
              _this.initBaseData(formData, custInfo, options.dbid, options.orderid);
            }
            wx.hideLoading();
          }).catch(err => {
            console.log(err);
            wx.hideLoading();
          })
          // -----查询客人现有信息
        }
      }).catch(err => {
        console.log(err);
        wx.hideLoading();
        wx.showToast({
          title: '基础信息查询失败',
          icon: 'none'
        })
      })
    }
    // 第三步 ，只需要查询办签状态
    if (options.step == 3) {
      wx.showLoading({
        mask: true
      });
      // 查询客人办签状态
      httpgetjson('mp.visa.state', {
        customer_id: options.dbid
      }).then(data => {
        if (!!data.data && typeof data.data == 'object') {
          var status_list = data.data.status_list;
          if (!!status_list && status_list.length > 0) {
            status_list = status_list.map(status => {
              status.update_date = formatDate(new Date(status.update_date))
              return status;
            })
            _this.setData({
              processList: status_list.filter(status => {
                // 目前状态，按照 5以及5一下的状态，为办理中
                return status.progress <= 5
              }),
              checkOutList: status_list.filter(status => {
                // 大于 5 的状态为，出签/配送
                return status.progress > 5
              })
            })
          }
        }
        wx.hideLoading();
      }).catch(err => {
        console.log(err);
        wx.hideLoading();
      })
    }
  },

  handleFormData: function(formdata) {
    var _this = this;
    var navigators = formdata[0].navigators;
    var domains = formdata[1].domains;
    // 处理navigator里边的表单 - 拍平表单。把 row 和 component 合为一行
    navigators = navigators.map(item => {
      if (!!item.rows) {
        item.comps = _this.handleRows(item.rows);
        delete item.rows;
      }
      return item;
    });
    domains = domains.map(item => {
      if (!!item.rows) {
        item.comps = _this.handleRows(item.rows);
        delete item.rows;
      }
      return item;
    })
    return {
      navigators: navigators,
      domains: domains
    }
  },
  /**
   * 拍扁了表单
   * 原数据结构，rows --> components (--> items)(--> children --> rows --> components)
   * 手机端模板，每个row 只有一个component， 所以将 row 与 component 拍扁为一层
   */
  handleRows: function(rows) {
    return rows.map(row => {
      if (!!row.components && row.components.length > 0) {
        let comp = row.components[0];
        for (var name in row) {
          if (name != 'components') comp[name] = row[name];
        }
        if (!!comp.items) {
          comp.items = comp.items.map(child => {
            if (!!child.children) {
              child.children = child.children.map(childRow => {
                if (!!childRow.components && childRow.components.length > 0) {
                  let childComp = childRow.components[0];
                  for (var name in childRow) {
                    if (name != 'components') childComp[name] = childRow[name];
                  }
                  return childComp;
                }
                return null;
              }).filter(item => {
                return !!item
              })
            }
            return child;
          })
        }
        return comp;
      }
      return null;
    }).filter(item => {
      return !!item
    })
  },

  initBaseData: function(baseData, custInfo, dbid, orderid) {
    var _this = this;
    // 初始化表单界面的跳转信息
    var navigators = baseData.navigators.map(item => {
      var params = '&orderid=' + orderid + '&dbid=' + dbid;
      if (item.type == 'identity') {
        item.finished = (custInfo.noIdentity == '1' && custInfo.noIdentityType != '') || item.required != '1' || _this.checkCompsValid(item.comps, custInfo);
        item.url = '/pages/visa/uploadidentity/uploadidentity?' + params;
      } else if (item.type == 'passport') {
        item.finished = _this.checkCompsValid(item.comps, custInfo);
        item.url = '/pages/visa/uploadpassport/uploadpassport?' + params;
      } else if (item.type == 'image') {
        item.finished = true;
        item.url = '/pages/visa/uploadothers/uploadothers?' + params;
      }
      return item;
    });
    // 初始化填表界面 动态表单数据
    var domains = baseData.domains;
    var selectIndex = {};
    var dataInfo = {};
    var cityArrayJson = {};
    for (var name in custInfo) {
      dataInfo[name] = custInfo[name];
    }
    _this.formatDateToString(domains, dataInfo);
    // 初始化 填表中的 默认值
    domains.forEach(item => {
      if (!!item.comps && item.comps.length > 0) {
        _this.setDefaultData(item.comps, selectIndex, dataInfo, cityArrayJson);
      }
    })
    // console.log('页面初始化selectIndex：', selectIndex);
    // console.log('页面初始化dataInfo：', dataInfo);
    // console.log('页面初始化cityArrayJson：', cityArrayJson);
    _this.setData({
      requireList: navigators.filter(item => {
        return item.required == 1
      }),
      otherList: navigators.filter(item => {
        return item.required != 1
      }),
      selectIndex: selectIndex,
      cityArrayJson: cityArrayJson,
      list: _this.checkDomains(domains, dataInfo),
      dataInfo: dataInfo
    })
  },

  setDefaultData: function(comps, selectIndex, dataInfo, cityArrayJson) {
    var _this = this;
    comps.forEach(comp => {
      // 处理默认值（向下递归处理一层）
      if (comp.type == 'radio') {
        let selectItems = comp.items;
        for (let i = 0; i < selectItems.length; i++) {
          var item = selectItems[i];
          if (!dataInfo[comp.name]) { // 如果当前客人信息中没有对应字段的值
            // 没值状态，根据模板设定的默认值处理
            if (item.checked == '1') {
              dataInfo[comp.name] = item.value;
              if (!!item.children) {
                // 如果选中的默认值 有子组件，需要递归处理子组件
                _this.setDefaultData(item.children, selectIndex, dataInfo, cityArrayJson);
              }
            }
          }
        }
      }
      if (comp.type == 'select') {
        let selectItems = comp.items;
        for (let i = 0; i < selectItems.length; i++) {
          var item = selectItems[i];
          if (dataInfo[comp.name] !== undefined && dataInfo[comp.name] !== '') {
            // 有值状态，根据已有的值处理默认值 - 主要处理index
            if (item.value == dataInfo[comp.name]) {
              selectIndex[comp.name] = i;
              if (!!item.children) {
                // 如果选中的默认值 有子组件，需要递归处理子组件
                _this.setDefaultData(item.children, selectIndex, dataInfo, cityArrayJson);
              }
            }
          } else {
            // 没值状态，根据模板设定的默认值处理，以及对应的index
            if (item.checked == '1') {
              selectIndex[comp.name] = i;
              dataInfo[comp.name] = item.value;
              if (!!item.children) {
                // 如果选中的默认值 有子组件，需要递归处理子组件
                _this.setDefaultData(item.children, selectIndex, dataInfo, cityArrayJson);
              }
            }
          }
        }
      }
      if (comp.type == 'city') {
        // 需要处理多列选择器的选择列，二维数组。第一列为全部省数据，第二列需要根据第一列选中的省，动态更改市数据。
        let cityJson = _this.data.cityJson;
        let array1 = []; // 省数据
        cityJson.forEach(city => {
          array1.push({
            name: city.name,
            code: city.code
          });
        })
        let value1 = dataInfo[comp.name]; // 默认选中的省
        let value2 = dataInfo[comp.name_city]; // 默认选中的市
        if (!!value1 && !!value2) {
          // 如果有默认值，
          // 有默认值的情况下，计算二维数组 和 对应的index
          var index1 = 0;
          var index2 = 0;
          for (let i = 0; i < array1.length; i++) {
            let item = array1[i];
            if (item.name == value1) { // 获取对应默认省的index，以及对应的市列表，
              index1 = i;
              let array2 = cityJson[i].cities; // 市列表数据
              array2.forEach((item, index) => {
                if (item.name == value2) {
                  index2 = index; // 对应市的index
                }
              })
              selectIndex[comp.name] = [index1, index2];
              cityArrayJson[comp.name] = [array1, array2];
              break;
            }
          }
        } else {
          // 没有默认值，省市默认index为0，直接取index为0的省的对应市数据。
          // 没默认值的情况下，默认选第一个，index 默认为 0 ；
          let array2 = cityJson[0].cities;
          selectIndex[comp.name] = [0, 0];
          cityArrayJson[comp.name] = [array1, array2];
        }
      }
    });
  },
  /**
   * 判断每一块表单，是否填写完毕
   * 
   * 根据表单中每个组件是否必填，并且是否有值 来判断。
   */
  checkDomains: function(domains, dataInfo, id) {
    var _this = this;
    return domains.map(domain => {
      if (!id || domain.id == id) {
        domain.finished = _this.checkCompsValid(domain.comps, dataInfo);
      }
      return domain;
    })
  },
  /**
   * 判断所有必填组件是否已经填写
   * 如果有子组件，需要递归处理
   */
  checkCompsValid: function(comps, params) {
    var _this = this;
    return comps.every(comp => {
      if (params[comp.name] !== undefined && params[comp.name] !== '') {
        // 已填写，判断子组件是否over
        // 判断选中项是否有children ，如果有，递归判断是否必填
        if (!!comp.items && comp.items.length > 0) {
          var selectOne = comp.items.filter(item => {
            return item.value == params[comp.name];
          })
          if (!!selectOne && selectOne.length > 0) {
            var select = selectOne[0];
            if (!!select.children && select.children.length > 0) {
              return _this.checkCompsValid(select.children, params);
            }
          }
        }
        return true;
      } else {
        // 未填写，判断是否必填
        return comp.required != '1';
      }
    })
  },

  changeTab: function(e) {
    let step = e.currentTarget.dataset.step;
    this.setData({
      step: step
    });
    this.reloadPage({
      step: step,
      orderid: this.data.orderid, // 订单id
      dbid: this.data.dbid, // 客人id
      name: this.data.name
    })
  },

  /**
   * 切换panel
   * 1、保存现有的打开了的panel中的数据 - 异步提交后台
   * 2、切换打开状态
   */
  kindToggle: function(e) {
    var id = e.currentTarget.dataset.id,
      _this = this,
      list = this.data.list;
    // 保存open 的panel 中的表单数据
    if (list.some(item => {
        return !!item.open;
      })) {
      _this.saveOpenPart();
    }
    // 切换打开状态
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  },
  /**
   * picker 单列 选中事件
   */
  bindSelectChange: function(e) {
    // e.detail.value 为选中项目的index
    var _this = this;
    var name = e.currentTarget.dataset.comp.name;
    var items = e.currentTarget.dataset.comp.items;
    var dataInfo = _this.data.dataInfo;
    var selectIndex = _this.data.selectIndex;
    var cityArrayJson = _this.data.cityArrayJson;
    selectIndex[name] = e.detail.value;
    let value = items[e.detail.value].value;
    dataInfo[name] = value;
    // 清空未选中的选项的 子组件 对应的值
    // 为选中的选项的 子组件 设置对应的默认值
    // 防止冲突，开两个循环，顺序处理
    if (!!items) {
      items.forEach(item => {
        if (item.value != value) {
          if (!!item.children) {
            item.children.forEach(child => {
              dataInfo[child.name] = '';
              if (!!child.name_city) {
                dataInfo[child.name_city] = '';
              }
            })
          }
        }
      })
      items.forEach(item => {
        if (item.value == value) {
          if (!!item.children) {
            _this.setDefaultData(item.children, selectIndex, dataInfo, cityArrayJson);
          }
        }
      })
    }
    // 计算是否填写完毕
    var panelid = e.currentTarget.dataset.panelid;
    _this.setData({
      selectIndex: selectIndex,
      dataInfo: dataInfo,
      cityArrayJson: cityArrayJson,
      list: _this.checkDomains(_this.data.list, dataInfo, panelid)
    });
  },

  /**
   * picker 双列，选中事件
   */
  bindMultiSelectChange: function(e) {
    // e.detail.value 为选中项目的index数组
    var _this = this;
    var name = e.currentTarget.dataset.comp.name;
    var name_city = e.currentTarget.dataset.comp.name_city;
    var dataInfo = _this.data.dataInfo;
    var selectIndex = _this.data.selectIndex;
    selectIndex[name] = e.detail.value;
    var cityArray = _this.data.cityArrayJson[name];
    dataInfo[name] = cityArray[0][e.detail.value[0]].name;
    dataInfo[name_city] = cityArray[1][e.detail.value[1]].name;
    // 计算是否填写完毕
    var panelid = e.currentTarget.dataset.panelid;
    _this.setData({
      selectIndex: selectIndex,
      dataInfo: dataInfo,
      list: _this.checkDomains(_this.data.list, dataInfo, panelid)
    });
  },

  /**
   * picker 多列，列选中事件 （动态修改联动列的数据）
   */
  bindMultiSelectColumnChange: function(e) {
    var _this = this;
    var name = e.currentTarget.dataset.comp.name;
    let column = e.detail.column;
    let index = e.detail.value; // 选中的index
    if (column == 0) { // 选中列为第一列，需要动态修改第二列的 市 数据。
      var cityArrayJson = _this.data.cityArrayJson;
      var cityArray = cityArrayJson[name];
      let cityJson = _this.data.cityJson;
      let array2 = cityJson[index].cities;
      cityArray[1] = array2;
      cityArrayJson[name] = cityArray;
      _this.setData({
        cityArrayJson: cityArrayJson
      })
    }
  },
  /**
   * switch 开关事件
   */
  bindSwitchChange: function(e) {
    // e.detail.value 为 true or false
    var _this = this;
    var name = e.currentTarget.dataset.comp.name;
    var items = e.currentTarget.dataset.comp.items;
    var dataInfo = _this.data.dataInfo;
    var selectIndex = _this.data.selectIndex;
    var cityArrayJson = _this.data.cityArrayJson;
    let value = e.detail.value ? '1' : '0';
    dataInfo[name] = value;
    // 清空未选中的选项的 子组件 对应的值
    // 为选中的选项的 子组件 设置对应的默认值
    // 防止冲突，开两个循环，顺序处理
    if (!!items) {
      items.forEach(item => {
        if (item.value != value) {
          if (!!item.children) {
            item.children.forEach(child => {
              dataInfo[child.name] = '';
              if (!!child.name_city) {
                dataInfo[child.name_city] = '';
              }
            })
          }
        }
      })
      items.forEach(item => {
        if (item.value == value) {
          if (!!item.children) {
            _this.setDefaultData(item.children, selectIndex, dataInfo, cityArrayJson);
          }
        }
      })
    }
    // 计算是否填写完毕
    var panelid = e.currentTarget.dataset.panelid;
    _this.setData({
      selectIndex: selectIndex,
      dataInfo: dataInfo,
      cityArrayJson: cityArrayJson,
      list: _this.checkDomains(_this.data.list, dataInfo, panelid)
    });
  },
  /**
   * 日期 选中事件
   */
  bindDateChange: function(e) {
    var _this = this;
    var name = e.currentTarget.dataset.comp.name;
    var dataInfo = this.data.dataInfo;
    dataInfo[name] = e.detail.value;
    // 计算是否填写完毕
    var panelid = e.currentTarget.dataset.panelid;
    _this.setData({
      dataInfo: dataInfo,
      list: _this.checkDomains(_this.data.list, dataInfo, panelid)
    });
  },
  /**
   * input输入框 input事件
   */
  bindInput: function(e) {
    var _this = this;
    var name = e.currentTarget.dataset.comp.name;
    var dataInfo = this.data.dataInfo;
    dataInfo[name] = e.detail.value;
    // 计算是否填写完毕
    var panelid = e.currentTarget.dataset.panelid;
    _this.setData({
      dataInfo: dataInfo,
      list: _this.checkDomains(_this.data.list, dataInfo, panelid)
    });
  },
  /**
   * 校验表单填写是否已经合格
   * 1、必填（递归校验）
   */
  checkValid: function(comps, params, errors) {
    var _this = this;
    comps.forEach(comp => {
      // 校验必填项
      if (params[comp.name] !== undefined && params[comp.name] !== '') {
        // 已填写，判断子组件必填项
        // 判断选中项是否有children ，如果有，递归判断是否必填
        if (!!comp.items && comp.items.length > 0) {
          var selectOne = comp.items.filter(item => {
            return item.value == params[comp.name];
          })
          if (!!selectOne && selectOne.length > 0) {
            var select = selectOne[0];
            if (!!select.children && select.children.length > 0) {
              _this.checkValid(select.children, params, errors);
            }
          }
        }
      } else {
        // 未填写，判断是否必填
        if (comp.required == '1') errors.push(comp.row_label);
      }
    })
  },
  /**
   * 保存打开的单个part - 不校验，仅仅收起打开的panel
   */
  saveOpenPart: function() {
    var _this = this;
    // 保存参数
    let params = clone(_this.data.dataInfo);
    // console.log('处理后的params：', JSON.stringify(params));
    _this.formatStringToDate(params);
    console.log('Base64加密前的params：', params)
    // 调用后台保存
    var json_data = new Base64().encode(JSON.stringify(params));
    var reqParams = {
      json_data: json_data,
      is_submit: 0
    };
    httppostjson('mp.customer.save', reqParams).then(data => {
      if (data.data.code == SUCCESSCODE) {} else {
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        })
      }
    }).catch(err => {
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      })
    })
  },
  /**
   * 保存第一步（仅仅改变状态）
   */
  saveCard: function(e) {
    var _this = this;
    // 校验是否必填
    var valid = _this.data.requireList.every(item => {
      return !!item.finished;
    })
    var custInfo = _this.data.custInfo;
    if (!valid) {
      wx.showToast({
        title: '请上传必备资料',
        icon: 'none'
      })
      return;
    } else if (custInfo.customer_fill_state == 1) {
      var json_data = new Base64().encode(JSON.stringify({
        enterprise_order_dbid: custInfo.enterprise_order_dbid,
        customer_id: custInfo.dbid,
        customer_fill_state: 2
      }));
      var reqParams = {
        json_data: json_data,
        is_submit: 0
      };
      httppostjson('mp.customer.save', reqParams).then(data => {
        if (data.data.code == SUCCESSCODE) {
          // 保存成功
          // 进入第二步
          wx.showToast({
            title: '保存成功'
          })
          _this.setData({
            step: 2
          });
          _this.reloadPage({
            step: 2,
            orderid: _this.data.orderid, // 订单id
            dbid: _this.data.dbid, // 客人id
            name: _this.data.name
          })
        } else {
          wx.showToast({
            title: '保存失败',
            icon: 'none'
          })
        }
      }).catch(err => {
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        })
      })
    } else {
      _this.setData({
        step: 2
      });
      _this.reloadPage({
        step: 2,
        orderid: _this.data.orderid, // 订单id
        dbid: _this.data.dbid, // 客人id
        name: _this.data.name
      })
    }
  },
  /**
   * 提交所有信息 - 包括校验
   */
  submitAllInfo: function(e) {
    var _this = this;
    // 保存参数
    let params = clone(_this.data.dataInfo);
    // 校验必填项
    var errors = [];
    _this.data.list.forEach(item => {
      _this.checkValid(item.comps, params, errors)
    })
    console.log('errors', errors);
    if (errors.length > 0) {
      wx.showToast({
        title: '申请表内容不完整，请补全标红信息',
        icon: 'none'
      })
      return;
    }
    _this.setData({
      isShowModal: true
    })
  },

  formatStringToDate : function(params){
    var _this = this;
    _this.data.list.forEach(row => {
      row.comps.forEach(comp=>{
        if(comp.type == 'date'){
          if (params[comp.name] !== undefined && params[comp.name] !== '') {
            params[comp.name] = stringToDate(params[comp.name]);
          }
        }
        if(!!comp.items && comp.items.length > 0){
          comp.items.forEach(item=>{
            if(!!item.children && item.children.length > 0){
              item.children.forEach(child=>{
                if (child.type == 'date') {
                  if (params[child.name] !== undefined && params[child.name] !== '') {
                    params[child.name] = stringToDate(params[child.name]);
                  }
                }
              })
            }
          })
        }
      })
    })
  },

  formatDateToString: function (domains, params) {
    domains.forEach(row => {
      row.comps.forEach(comp => {
        if (comp.type == 'date') {
          if (params[comp.name] !== undefined && params[comp.name] !== '') {
            params[comp.name] = dateToString(params[comp.name]);
          }
        }
        if (!!comp.items && comp.items.length > 0) {
          comp.items.forEach(item => {
            if (!!item.children && item.children.length > 0) {
              item.children.forEach(child => {
                if (child.type == 'date') {
                  if (params[child.name] !== undefined && params[child.name] !== '') {
                    params[child.name] = dateToString(params[child.name]);
                  }
                }
              })
            }
          })
        }
      })
    })
  },

  onUnload: function() {
    var pages = getCurrentPages();
    var lastPage = pages.filter(page => {
      return page.route == 'pages/list/list';
    });
    if (lastPage.length > 0) {
      lastPage[0].refreshData();
    }
  },

  cancelM : function(){
    this.setData({
      isShowModal : false
    })
  },

  confirmM : function(){
    var _this = this;
    // 保存参数
    let params = clone(_this.data.dataInfo);
    params.customer_fill_state = 3;
    // console.log('处理后的params：', JSON.stringify(params));
    _this.formatStringToDate(params);
    console.log('Base64加密前的params：', params)
    // 调用后台保存
    var json_data = new Base64().encode(JSON.stringify(params));
    var reqParams = {
      json_data: json_data,
      is_submit: 1
    };
    _this.setData({
      isShowModal: false
    })
    wx.showLoading({
      title: '提交中...', mask : true
    })
    httppostjson('mp.customer.save', reqParams).then(data => {
      wx.hideLoading();
      if (data.data.code == SUCCESSCODE) {
        // 保存成功
        // 进入第二步
        wx.showToast({
          title: '提交成功'
        })
        _this.setData({
          step: 3
        });
        _this.reloadPage({
          step: 3,
          orderid: _this.data.orderid, // 订单id
          dbid: _this.data.dbid, // 客人id
          name: _this.data.name
        })
      } else {
        wx.showToast({
          title: '提交失败',
          icon: 'none'
        })
      }
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: '提交失败',
        icon: 'none'
      })
    })
  },

  onShow : function(){
    // 动态修改客人姓名
    wx.setNavigationBarTitle({
      title: this.data.custInfo.full_name_cn || this.data.name,
    })
  }
})