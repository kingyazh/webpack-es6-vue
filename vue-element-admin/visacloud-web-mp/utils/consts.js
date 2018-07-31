const domain = 'https://ssl.shanvisa.com'

const baseUrl = `${domain}/visacloud/rest/`;

const flagurl = `${domain}/image/flag/`;
const flagsuffix = '.png';

const imageurl = `${domain}/image/`;
const version = '/v1';

const cityjsonurl = `${domain}/public/city.json`;

const SUCCESSCODE = '10000';

function getflagurl(flag) {
  return flagurl + flag + flagsuffix;
}

function getimageurl(src) {
  return imageurl + src;
}

module.exports = {
  baseUrl,
  version,
  SUCCESSCODE,
  getflagurl,
  getimageurl,
  cityjsonurl
}