import { checkIsBrowser } from './api-adapter';

export function getTokenByMtop(opt, insertMtop) {
  return new Promise((resolve, reject) => {
    let mtop = insertMtop;
    const {
      deviceId,
      appkey
    } = opt;

    if (!mtop) {
      if (!checkIsBrowser() || !window.lib || !window.lib.mtop) {
        reject('Not find lib.mtop!');
      }
      mtop = window.lib.mtop;
    }

    mtop.request(Object.assign({
      api: 'mtop.mediaplatform.live.encryption',
      v: '1.0',
      data: {
        appKey: appkey,
        windowId: deviceId
      },
      AntiCreep: true,
      ecode: 0
    }, opt.m_params)).then(resp => {
      if (resp && resp.data && resp.data.result) {
        const accs_token = resp.data.result;
        resolve(accs_token);
      } else {
        resolve(null);
      }
    })['catch'](e => {
      if (e.ret[0].indexOf('FAIL_SYS_SESSION_EXPIRED') > -1) {
        reject({
          type: 'UESR_NOT_LOGIN',
          message: '用户未登录'
        });
      } else {
        reject({
          type: 'GET_TOKEN_ERROR',
          message: '获取ACCS token时出错',
          error: e
        });
      }
    });
  });
}