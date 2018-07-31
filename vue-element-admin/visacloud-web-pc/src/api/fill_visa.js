import request from '@/utils/request'

export function getVisaCenter(country_code) {
    const data = {
        params: { country_code: country_code }
    }
    return request({
        url: 'rest/dict.query.visaCenter/v1',
        method: 'post',
        data
    })
}
// VisaInfoForm
// get optFrom data
export function getUserOrderInit(params) {
    return axios.get(window.API_ROOT + 'rest/customer.update.init/v1', params);
}
// get optFrom form elements
export function getUserOrderModel(params) {
    return axios.get(window.API_ROOT + 'rest/customer.update.model/v1', params);
}

// VisaOperForm
// get optFrom data
export function getOptOrderInit(params) {
    return axios.get(window.API_ROOT + 'rest/optOrder.update.init/v1', params);
}
// get optFrom form elements
export function getOptOrderModel(params) {
    return axios.get(window.API_ROOT + 'rest/optOrder.update.model/v1', params);
}
