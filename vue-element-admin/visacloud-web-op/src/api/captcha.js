import request from '@/utils/request'

// size 默认值 160x40
export function getCaptcha(size) {
  return request({
    url: 'rest/system.verify.captcha/v1',
    method: 'get',
    params: { size: size }
  })
}

