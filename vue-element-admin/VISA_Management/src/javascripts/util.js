export default class {

    constructor() {
        this.prototypeFn();
    }

    /**
     * 将对象格式为链接参数字符串
     *
     * @returns
     */
    paramsStr(paramsObj){
        let paramsObjKey = Object.keys(paramsObj);
        return encodeURI(paramsObjKey.map(name=>`${name}=${paramsObj[name]}`).join('&'));
    }

    /**
     * 获取查询字符串并组成对象
     *
     * @returns
     */
    getArgs() {
        const args = {}; //声明一个空对象
        const hash = window.location.hash;
        const search = window.location.search;
        const hashSearch = hash.indexOf('?')<0?'':'&'+hash.substring(hash.indexOf('?') + 1);
        const query = search.substring(search.indexOf('?') + 1) + hashSearch;
        const pairs = query.split("&"); // 以 & 符分开成数组
        for (let i = 0; i < pairs.length; i++) {
            const pos = pairs[i].indexOf('='); // 查找 "name=value" 对
            if (pos === -1) continue; // 若不成对，则跳出循环继续下一对
            const argName = pairs[i].substring(0, pos); // 取参数名
            let value = pairs[i].substring(pos + 1); // 取参数值
            value = decodeURIComponent(value); // 若需要，则解码
            args[argName] = value; // 存成对象的一个属性
        }
        args['paramsStr'] = query;
        return args; // 返回此对象
    }


    /**
     * 修改 Date 的 format 方法
     *
     * @returns
     */
    prototypeFn(){
        if (!Date.prototype.format) {
            Date.prototype.format = function (format) {
                let o = {
                    "M+": this.getMonth() + 1,
                    "d+": this.getDate(),
                    "h+": this.getHours(),
                    "m+": this.getMinutes(),
                    "s+": this.getSeconds(),
                    "q+": Math.floor((this.getMonth() + 3) / 3),
                    "S": this.getMilliseconds()
                }
                if (/(y+)/.test(format))
                    format = format.replace(RegExp.$1, (this.getFullYear() + '')
                        .substr(4 - RegExp.$1.length));
                for (let k in o)
                    if (new RegExp("(" + k + ")").test(format))
                        format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                            : ("00" + o[k]).substr(('' + o[k]).length));
                return format;
            }
        }
    }

    /**
     * 格式 Unix 时间戳
     *
     * @returns
     */
    formatUnixTimestamp(time,newDate){
        let fixTime = typeof time === "number" ? time : time.replace(/-/g, "/");
        let now = new Date(fixTime);
        return now.format(newDate);
    }

    /**
     * 将字符串转为正则
     *
     * @returns
     */

    evalTo(str){
        str = !str?'':eval(`\/${str}\/`);
        return str;
    }

    /**
     * Base64 encode / decode
     *
     * @returns
     */
    

    Base64(){
        // private property
        this._keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        // public method for encoding
        this.encode = function (input) {
            var output = '';
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i = 0;
            input = this._utf8_encode(input);
            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
                output = output +
                    this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                    this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
            }
            return output;
        };
        // public method for decoding
        this.decode = function (input) {
            var output = '';
            var chr1, chr2, chr3;
            var enc1, enc2, enc3, enc4;
            var i = 0;
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
            while (i < input.length) {
                enc1 = this._keyStr.indexOf(input.charAt(i++));
                enc2 = this._keyStr.indexOf(input.charAt(i++));
                enc3 = this._keyStr.indexOf(input.charAt(i++));
                enc4 = this._keyStr.indexOf(input.charAt(i++));
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
                output = output + String.fromCharCode(chr1);
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
            }
            output = this._utf8_decode(output);
            return output;
        };
        // private method for UTF-8 encoding
        this._utf8_encode = function (string) {
            string = string.replace(/\r\n/g,'\n');
            var utftext = '';
            for (var n = 0; n < string.length; n++) {
                var c = string.charCodeAt(n);
                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
            }
            return utftext;
        };
        // private method for UTF-8 decoding
        this._utf8_decode = function (utftext) {
            var string = '';
            var i = 0;
            var c = c1 = c2 = 0;
            while ( i < utftext.length ) {
                c = utftext.charCodeAt(i);
                if (c < 128) {
                    string += String.fromCharCode(c);
                    i++;
                }
                else if((c > 191) && (c < 224)) {
                    c2 = utftext.charCodeAt(i+1);
                    string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                    i += 2;
                }
                else {
                    c2 = utftext.charCodeAt(i+1);
                    c3 = utftext.charCodeAt(i+2);
                    string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                    i += 3;
                }
            }
            return string;
        }
        return this;
    }
    
    /**
     * 根据表单 json 生成校验规则
     * 此方法 仅在此项目中用到
     *
     * @returns
     */
    makeRules(obj){
        let eleRules = {};
        if (!!obj || Array.isArray(obj)){
            obj.forEach(function (domain) {
                domain.rows.forEach(function (row) {
                    row.components.forEach(function (component,comIndex) {
                        //  radio、checkbox、select、more select
                        if(Array.isArray(component.items)){
                            component.items.forEach(function (item,itIndex) {

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
        }
        console.log(eleRules);
        return eleRules;
    }


}