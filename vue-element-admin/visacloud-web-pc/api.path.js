'use strict'
module.exports = {
    API_ROOT : process.env.NODE_ENV === 'dev'?'"//172.16.37.51:8080/visacloud/"':'"@visacloud.config.local_server_url@/visacloud/"'
}