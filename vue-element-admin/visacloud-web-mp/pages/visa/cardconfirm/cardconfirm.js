import {
  httpuploadocr,
  httppostjson
} from '../../../utils/http.js'
import {
  Base64,
  dateToString,
  stringToDate, clone
} from '../../../utils/util.js'
import {
  SUCCESSCODE
} from '../../../utils/consts.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comps: [],
    selectIndex: {},
    dbid: '',
    dataInfo: {},
    card_type: '',
    src: '',
    isShowModal : false, // 是否打开弹框
    needCheckNames:[], // 需要比对是否有变化的字段（身份证表单和护照表单名字重复的字段）
    diffrentRows : [], // 比对字段中重复的字段信息
    tempParams : {} // 弹框后暂存的保存参数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    // 设置标题头 （身份证正面/反面/护照）
    var imageType = options.card_type;
    var title = '证件信息读取';
    if(imageType == 'idf'){
      title = '身份证正面信息';
    } else if (imageType == 'idb'){
      title = '身份证反面信息';
    } else if (imageType == 'ppt') {
      title = '护照信息读取';
    }
    wx.setNavigationBarTitle({
      title: title,
    })
    var _this = this;
    wx.showLoading({
      title: '正在识别中...'
    })
    if(options.first == '1'){
      httpuploadocr(options.src, 'file', {
        customer_id: options.dbid,
        image_type: imageType
      }).then(data => {
        let result = JSON.parse(data.data);
        // 识别的证件信息
        let json_data = JSON.parse(result.json_data);
        // 获取表单信息
        var formData = wx.getStorageSync('formData:' + options.dbid);
        _this.initBaseData(options, formData, json_data, 'cert');
        wx.hideLoading()
      }).catch(err => {
        wx.hideLoading()
        console.log('err', err);
      })
    } else {
      wx.hideLoading()
      // 获取表单信息
      var formData = wx.getStorageSync('formData:' + options.dbid);
      var json_data = wx.getStorageSync('custInfo:' + options.dbid);
      _this.initBaseData(options, formData, json_data, 'cust');
    }
  },

  initBaseData: function(options, formData, jsonData, datatype) {
    var dataInfo = {};
    for (var name in jsonData) {
      dataInfo[name] = jsonData[name];
    }
    // 判断需要check的表单字段名
    let identityForm = formData.navigators.filter(item => { return item.type == 'identity';})[0];
    let passportForm = formData.navigators.filter(item => { return item.type == 'passport'; })[0];
    let names = identityForm.comps.filter(idcomp=>{
      return passportForm.comps.some(pacomp=>{
        return idcomp.name == pacomp.name;
      })
    }).map(comp=>{
      return comp.name;
    })
    // 根据卡片类型 获取 动态表单
    var card = formData.navigators.filter(item => {
      if (options.card_type == 'idf' || options.card_type == 'idb') {
        return item.type == 'identity';
      } else {
        return item.type == 'passport'
      }
    })[0];
    var comps = card.comps.filter(comp => {
      // 过滤证件正反面
      return !!comp && comp.side == options.card_type;
    });
    if(datatype == 'cust'){
      this.formatDateToString(comps, dataInfo);
    }
    var selectIndex = {};
    this.setDefaultData(comps, selectIndex, dataInfo);
    // console.log('页面初始化selectIndex：', selectIndex);
    // console.log('页面初始化dataInfo：', dataInfo);
    // console.log('页面初始化needCheckNames：', names);
    this.setData({
      comps: comps,
      selectIndex: selectIndex,
      dbid: options.dbid,
      card_type: options.card_type,
      src: options.src,
      dataInfo: dataInfo,
      needCheckNames : names
    })
  },

  formatStringToDate: function (params) {
    var _this = this;
    _this.data.comps.forEach(comp => {
      if (comp.type == 'date') {
        if (params[comp.name] !== undefined && params[comp.name] !== '') {
          params[comp.name] = stringToDate(params[comp.name]);
        }
      }
      if (!!comp.items && comp.items.length > 0) {
        comp.items.forEach(item => {
          if (!!item.children && item.children.length > 0) {
            item.children.forEach(child => {
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
  },

  formatDateToString: function (comps, params) {
    comps.forEach(comp => {
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
  },

  setDefaultData: function(comps, selectIndex, dataInfo) {
    var _this = this;
    comps.forEach(comp => {
      // 处理默认值（向下递归处理一层）
      if (comp.type == 'radio') {
        let selectItems = comp.items;
        for (let i = 0; i < selectItems.length; i++) {
          var item = selectItems[i];
          if (!dataInfo[comp.name]) {
            // 没值状态，根据模板设定的默认值处理
            if (item.checked == '1') {
              dataInfo[comp.name] = item.value;
              if (!!item.children) {
                _this.setDefaultData(item.children, selectIndex, dataInfo);
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
                _this.setDefaultData(item.children, selectIndex, dataInfo);
              }
            }
          } else {
            // 没值状态，根据模板设定的默认值处理
            if (item.checked == '1') {
              selectIndex[comp.name] = i;
              dataInfo[comp.name] = item.value;
              if (!!item.children) {
                _this.setDefaultData(item.children, selectIndex, dataInfo);
              }
            }
          }
        }
      }
    });
  },

  bindSelectChange: function(e) {
    // e.detail.value 为选中项目的index
    var _this = this;
    var name = e.currentTarget.dataset.comp.name;
    var items = e.currentTarget.dataset.comp.items;
    var dataInfo = _this.data.dataInfo;
    var selectIndex = _this.data.selectIndex;
    let value = items[e.detail.value].value;
    selectIndex[name] = e.detail.value;
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
            })
          }
        }
      })
      items.forEach(item => {
        if (item.value == value) {
          if (!!item.children) {
            _this.setDefaultData(item.children, selectIndex, dataInfo);
          }
        }
      })
    }
    _this.setData({
      selectIndex: selectIndex,
      dataInfo: dataInfo
    });
  },

  bindDateChange: function(e) {
    var name = e.currentTarget.dataset.comp.name;
    var dataInfo = this.data.dataInfo;
    dataInfo[name] = e.detail.value;
    this.setData({
      dataInfo: dataInfo
    })
  },

  bindSwitchChange: function(e) {
    // e.detail.value 为 true or false
    var _this = this;
    var name = e.currentTarget.dataset.comp.name;
    var items = e.currentTarget.dataset.comp.items;
    var dataInfo = _this.data.dataInfo;
    var selectIndex = _this.data.selectIndex;
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
            })
          }
        }
      })
      items.forEach(item => {
        if (item.value == value) {
          if (!!item.children) {
            _this.setDefaultData(item.children, selectIndex, dataInfo);
          }
        }
      })
    }
    _this.setData({
      selectIndex: selectIndex,
      dataInfo: dataInfo
    });
  },

  bindInput: function(e) {
    var name = e.currentTarget.dataset.comp.name;
    var dataInfo = this.data.dataInfo;
    dataInfo[name] = e.detail.value;
    this.setData({
      dataInfo: dataInfo
    });
  },

  showImg: function() {
    wx.previewImage({
      urls: [this.data.src],
    })
  },
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
  save: function(e) {
    var _this = this;
    // 保存参数
    let params = clone(_this.data.dataInfo);
    // 校验必填项
    var errors = [];
    var comps = _this.data.comps;
    _this.checkValid(comps, params, errors)
    console.log('errors', errors);
    if (errors.length > 0) {
      wx.showToast({
        title: '证件信息不完整，请将标红信息补充完成',
        icon: 'none'
      })
      return;
    }
    // 校验新保存的值，和，原有的custInfo中 是否冲突
    // check 是否和已有客人数据相同，如果相同，需要弹框选择最终结果
    let needCheckNames = _this.data.needCheckNames;
    let custInfo = wx.getStorageSync('custInfo:' + _this.data.dbid);
    _this.formatDateToString(_this.data.comps, custInfo);
    let diffrentMap = {};
    let diffrentRows = [];
    needCheckNames.forEach(field=>{
      if (custInfo[field] !== undefined && params[field] !== undefined && custInfo[field] != params[field]) {
        diffrentMap[field] = [custInfo[field], params[field]];
      }
    })
    if (Object.keys(diffrentMap).length > 0){
      _this.handleDiffrent(_this.data.comps, diffrentMap, diffrentRows);
    }
    if (diffrentRows.length > 0){
      _this.setData({
        isShowModal : true,
        diffrentRows: diffrentRows,
        tempParams : params
      })
    } else {
      var _this = this;
      wx.showModal({
        title: '提示',
        content: '证件信息错误可能导致拒签，请仔细核对。确认信息正确并提交？',
        showCancel: true,
        cancelText: '再看看',
        confirmText: '确定',
        success: function (res) {
          if (res.cancel) {
            //点击取消,默认隐藏弹框
          } else {
            _this.saveCardInfo(params);
          }
        }
      })
      
    }
  },

  handleDiffrent: function (comps, diffrentMap, diffrentRows){
    var _this = this;
    comps.forEach(comp => {
      let values = diffrentMap[comp.name]
      if (!!values) {
        // 此组件值 为冲突值 - 无 city 控件
        // select 控件单独处理
        if(comp.type == 'select' || comp.type == 'radio'){
          diffrentRows.push({
            name : comp.name,
            row_label : comp.row_label,
            comps: values.map((value, i)=>{
              var selectItem = comp.items.filter(item=>{
                return item.value == value;
              });
              var selectOne = selectItem.length > 0 ? selectItem[0] : {}
              return {
                name: selectOne.label || '',
                value : value,
                checked : i==values.length-1
              }
            })
          })
        } else {
          // 其他控件
          diffrentRows.push({
            name: comp.name,
            row_label: comp.row_label,
            comps: values.map((value, i) => {
              return {
                name: value,
                value: value,
                checked: i == values.length - 1
              }
            })
          })
        }
      } 
      if (!!comp.items && comp.items.length > 0) {
        comp.items.forEach(item => {
          if (!!item.children && item.children.length > 0) {
            _this.handleDiffrent(item.children, diffrentMap, diffrentRows)
          }
        })
      }
    })
  },

  saveCardInfo: function (params){
    var _this = this;
    _this.formatStringToDate(params);
    // 调用后台保存
    var custInfo = wx.getStorageSync('custInfo:' + _this.data.dbid);
    params.enterprise_order_dbid = custInfo.enterprise_order_dbid;
    params.customer_id = custInfo.dbid;
    console.log('Base64加密前的params：', params)
    httppostjson('mp.customer.save', {
      json_data: new Base64().encode(JSON.stringify(params)),
      is_submit: 0
    }).then(data => {
      if (data.data.code == SUCCESSCODE) {
        // 保存成功，返回上一步
        wx.showToast({
          title: '保存成功'
        })
        _this.refreshPrevPage();
        wx.navigateBack()
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
  },

  refreshPrevPage: function() {
    var pages = getCurrentPages();
    var infoPage = pages[pages.length - 3];
    let src = this.data.src;
    let card_type = this.data.card_type;

    if (card_type == 'idf' || card_type == 'idb') {
      var lastPage = pages.filter(page => {
        return page.route == 'pages/visa/uploadidentity/uploadidentity';
      });
      if (lastPage.length > 0) {
        lastPage[0].init();
      }
    }
    if (card_type == 'ppt') {
      var lastPage = pages.filter(page => {
        return page.route == 'pages/visa/uploadpassport/uploadpassport';
      });
      if (lastPage.length > 0) {
        lastPage[0].init();
      }
    }
    var infoPage = pages.filter(page => {
      return page.route == 'pages/visa/infoform/infoform';
    });
    if (infoPage.length > 0) {
      infoPage[0].reloadPage({
        step: infoPage[0].data.step,
        orderid: infoPage[0].data.orderid, // 订单id
        dbid: infoPage[0].data.dbid, // 客人id
        name: infoPage[0].data.name
      })
    }
  },

  cancelM : function(){
    this.setData({
      isShowModal: false,
      diffrentRows: [],
      tempParams: {}
    })
  },

  confirmM : function(){
    var _this = this;
    var tempParams = _this.data.tempParams;
    var diffrentRows = _this.data.diffrentRows;
    diffrentRows.forEach(row=>{
      var selected = row.comps.filter(comp=>{
        return comp.checked;
      });
      if(!!selected && selected.length > 0){
        var value = selected[0].value;
        tempParams[row.name] = value;        
      }
    })
    _this.saveCardInfo(tempParams);
    this.setData({
      isShowModal: false,
      diffrentRows: [],
      tempParams: {}
    })
  },

  diffrentRadioChange : function(e){
    let value = e.detail.value;
    let row = e.currentTarget.dataset.row;
    var diffrentRows = this.data.diffrentRows;
    for(var i=0; i<diffrentRows.length; i++){
      var item = diffrentRows[i];
      if (item.name == row.name){
        item.comps = row.comps.map(comp=>{
          comp.checked = value == comp.value;
          return comp;
        })
      }
    }
    this.setData({
      diffrentRows: diffrentRows
    })
  }
})