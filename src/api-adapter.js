let SESSION_STORAGE_DATA;
let sysInfo = {};
try {
  if (checkIsAliMiniAPP()) {
    sysInfo = my.getSystemInfoSync && my.getSystemInfoSync() || {};
  }
} catch (e){
  sysInfo = {};
}

function getWebSocket() {
  let UnifyWebSocket;

  if (checkIsBrowser() && window.WebSocket) {
  // 浏览器环境
    UnifyWebSocket = window.WebSocket;
  }

  if (checkIsAliMiniAPP() && my.connectSocket) {
    // 集团小程序环境
    UnifyWebSocket = class {
      constructor(url) {
        my.connectSocket({
          url,
          success() {
            // Do nothing
          },
          fail: (res) => {
            this._onError(res);
          }
        });
        this.readyState = 0;

        my.onSocketOpen((res) => {
          this.onopen(res);
          this.readyState = 1;
        });

        my.onSocketClose(res => {
          this.onclose(res);
          this.readyState = 3;
        });

        my.onSocketError((res) => {
          this._onError(res);
        });

        my.onSocketMessage((res) => {
          if (checkIsAlipayMiniAPP()) {
            this.onmessage(res);
          } else {
            this.onmessage(res.data);
          }
        });
      }

      _onError(res) {
        this.onerror(res);
      }

      close() {
        this.readyState = 2;
        my.closeSocket();
      }

      send(data) {
        my.sendSocketMessage({
          data,
          fail: res => {
            throw res;
          }
        });
      }
  };
  }

  if (!UnifyWebSocket) {
    throw 'Not find WebSocket API!';
  }

  return UnifyWebSocket;
}

function getSessionStorage() {
  if (checkIsBrowser()) {
    return window.sessionStorage;
  } else {
    SESSION_STORAGE_DATA = SESSION_STORAGE_DATA || {};
    return {
      setItem(key, value) {
        SESSION_STORAGE_DATA[key] = value;
      },
      getItem(key) {
        return SESSION_STORAGE_DATA[key];
      }
    };
  }

}

export function checkIsBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined' && !checkIsAliMiniAPP(); // 只判断window和document的话小程序的ide预览、debug模式都会误判
}

export function checkIsAliMiniAPP() {
  return typeof my !== 'undefined';
}

export function checkIsAlipayMiniAPP() {
  return sysInfo && sysInfo.app && sysInfo.app === 'alipay';
}

export function checkIsSupportWS() {
  return (checkIsBrowser() && window.WebSocket) || (checkIsAliMiniAPP() && my.connectSocket);
}

export const WebSocket = getWebSocket();
export const sessionStorage = getSessionStorage();
