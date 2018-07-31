import { cityjsonurl} from 'utils/consts.js'
import { httpstaticget } from 'utils/http.js'
App({
  onLaunch: function (options) {
    var _this = this;
    httpstaticget(cityjsonurl,{}).then(data=>{
      _this.globalData.cityJson = data.data;
    })
  },
  globalData: {
    cityJson : null
  }
})