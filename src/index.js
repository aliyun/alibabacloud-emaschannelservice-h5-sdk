'use strict';
import { checkIsSupportWS, checkIsBrowser, sessionStorage } from './api-adapter';
import H5AccsCore from './h5-accs-core.js';
import Fingerprint from 'fingerprintjs';
import { getEmasToken } from './getEmasToken';

const __token = '';
let __appkey = '';

/**
 * [generateWinId 根据浏览器物理环境和随机数生成18位windowId]
 * @return {[type]} [description]
 */
function generateWinId() {
  if (sessionStorage.getItem('__emas_accs_device')) {
    return sessionStorage.getItem('__emas_accs_device');
  }
  // 生成窗口随机ID
  const tabId = Math.floor(Math.random() * 899 + 100); // 三位随机数
  // 生成浏览器唯一ID
  var browserId = checkIsBrowser() ? new Fingerprint({
    screen_resolution: true,
    canvas: true
  }).get() : Math.floor(Math.random() * 1000000000);
  browserId = browserId.toString().substr(0, 11);
  browserId += new Array(11 - browserId.length).join('0'); // 限制browserId长度为11，不够补全，超出则截断
  __accs_device = `${browserId}_${tabId}`;
  sessionStorage.setItem('__emas_accs_device', __accs_device);
  return __accs_device;
}

function getSid(){
  if (sessionStorage.getItem('__emas_accs_sid_device')) {
    return sessionStorage.getItem('__emas_accs_sid_device');
  }
  __emas_accs_sid_device = Math.floor(Math.random() * 89999999 + 10000000); // 八位随机数
  sessionStorage.setItem('__emas_accs_sid_device', __emas_accs_sid_device);
  return __emas_accs_sid_device;
}

let __accs_device = generateWinId();
let __emas_accs_sid_device = getSid();


function connectWS(aserverProxy, accs_token, ports, timeout, resolve, reject, opt) {
  // 浏览器环境通过webSocket通信
  new H5AccsCore(resolve, reject, aserverProxy, accs_token, ports, timeout, opt);
}

function loader(opt) {
  return new Promise(function (resolve, reject) {
    const isSupportWS = checkIsSupportWS();
    const ports = opt.ports || 80;
    const timeout = opt.timeout || 3000; // 超时时间
    const aserverProxy = opt.aserverProxy || ''; // aserverProxy的域名地址
    const getToken = opt.getToken = opt.getToken || getEmasToken;

    __appkey = opt.appkey;
    opt.__accs_device = __accs_device;
    opt.__emas_accs_sid_device = __emas_accs_sid_device;
    if (!opt || !opt.appkey) {
      reject({
        type: 'NO_APPKEY',
        message: '请传入appkey'
      });
    }
    if (isSupportWS) {
      if (!opt.accsToken) {
        // 如果没有传入accs_token, 则获取 ACCS token, 即deviceId
        // 浏览器环境通过webSocket通信
        getToken({
          appkey: opt.appkey,
          deviceId: __accs_device,
          sid: __emas_accs_sid_device,
          aserverProxy: aserverProxy,
          ports: ports,
          m_params: opt.m_params,
          noSign: opt.noSign,
          debug: opt.debug
        }).then((accs_token) => {
          if (!accs_token) {
            return reject({
              type: 'GET_TOKEN_ERROR',
              message: '获取ACCS token时出错',
              error: 'Not get token!'
            });
          }
          connectWS(aserverProxy, accs_token, ports, timeout, resolve, reject, opt);
        }).catch(e => {
          reject({
            type: 'GET_TOKEN_ERROR',
            message: '获取ACCS token时出错',
            error: e
          });
        });
      } else {
        connectWS(aserverProxy, opt.accsToken, ports, timeout, resolve, reject, opt);
      }
    } else {
      reject({
        type: 'NO_WS_SUPPORT',
        message: '浏览器不支持 WebSocket'
      });
    }
  });
}

let lib;
if (checkIsBrowser()) {
  lib = window.lib || (window.lib = {});
} else {
  lib = {};
}
const libAccs = lib.emasAccs = {
  init: loader,
  bindAble: true,
  getToken() {
    return __token || '';
  },
  getAccsDeviceId() {
    return `${__emas_accs_sid_device}${__accs_device}` || '';
  },
  getAppkey() {
    return __appkey || '';
  }
};
export default libAccs;