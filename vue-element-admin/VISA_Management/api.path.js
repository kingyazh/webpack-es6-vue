'use strict'
module.exports = {
		//    API_ROOT : process.env.NODE_ENV === 'dev'?'"@visacloud.config.context_path@/"':'"@visacloud.config.context_path@"'
		API_ROOT : process.env.NODE_ENV === 'dev'?'"/visacloud/"':'"@visacloud.config.local_server_url@/visacloud/"'
}