import { checkIsBrowser } from './api-adapter';
import btoa from './utils/btoa';
import sha1 from './utils/sha1';
import format from './utils/format.js';

export function getEmasToken(opt) {

  // utitlites
  function defer() {
    var deferred = {};
    var promise = new Promise(function (resolve, reject) {
      deferred.resolve = resolve;
      deferred.reject = reject;
    });
    deferred.promise = promise;
    return deferred;
  }

  function request(options, throwError) {
    var deferred = defer();
    var xhr = new window.XMLHttpRequest();
    function cleanup(type) {
      if (timeoutid) {
        clearTimeout(timeoutid);
      }
      if (type === 'TIMEOUT') {
        xhr.abort();
      }
    }

    function makeSuccResponse(status, headers, data) {
      options.response = {
        success: true,
        status: status,
        headers: headers,
        data: data
      };
      deferred.resolve(options.response);
    }

    function makeErrResponse(status, headers, errType, errCode, errMsg) {
      options.response = {
        success: false,
        status: status,
        headers: headers,
        error: {
          errType: errType,
          errCode: errCode,
          errMsg: decodeURIComponent(errMsg)
        }
      }
      deferred.resolve(options.response);
    }
    var timeout = options.timeout;
    var timeoutid = setTimeout(function () {
      makeErrResponse(null, "NetworkError", "timeout", 'request timeout');
      cleanup('TIMEOUT');
    }, timeout);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        var status = xhr.status;
        var result;
        var headers;
        if ((status >= 200 && status < 300) || status == 304) {
          cleanup();
          result = xhr.responseText;
          headers = xhr.getAllResponseHeaders() || '';

          if (result && typeof result === 'string') {
            result = JSON.parse(result);
          }

          try {
            var arr = headers.trim().split(/[\r\n]+/);
            var headerMap = {};
            arr.forEach(function (line) {
              var parts = line.split(': ');
              var header = parts.shift().toLocaleLowerCase();
              var value = parts.join(': ');
              headerMap[header] = value;
            });
            makeSuccResponse(status, headerMap, result);
          } catch (e) {
            makeErrResponse(status, null, "NetworkError", 'analyseError', 'analyse response error');
          }
        } else {
          cleanup('ABORT');
          // 网络请求超时时，会先走到这里，通过setTimeout调用保持时序
          setTimeout(function () {
            makeErrResponse(status, null, "NetworkError", 'requestError', 'request error');
          });
        }
      }
    };
    var curl = options.path;
    var method = options.method;
    xhr.open(method, curl, true);
    xhr.withCredentials = true;
    xhr.setRequestHeader('Accept', 'application/json');
    if (method === 'post' && options.body) {
      xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    } else {
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }
    if (options.headers) {
      for (var key in options.headers) {
        xhr.setRequestHeader(key, options.headers[key]);
        if(options.debug) {
          console.log(key + " is " + options.headers[key])
        }
      }
    }
    var body = options.body;
    if (body) {
      xhr.send(JSON.stringify(body));
    } else {
      xhr.send();
    }

    return deferred.promise;
  }

  function getSign(value, timestamp, nonce, appSecret) {
    return sha1(appSecret, value + timestamp + nonce)
  }

  /**
   * [generateWinId 根据浏览器物理环境和随机数生成18位windowId]
   * @return {[type]} [description]
   */
  function generateSId() {
    // 生成随机ID
    const sId = Math.floor(Math.random() * 89999999 + 10000000); // 八位随机数
    return `${sId}`;
  }

  function test() {
    var timestamp = '1593689861435'
    var nonce = '4bd43bf4-bb30-4247-9007-0424f26b1bb6'
    var body = '{"appKey":"20000196","appVersion":"1.0","c0":"generic_x86","c1":"Android SDK built for x86","cmd":"register","notifyEnable":true,"packageName":"com.aliyun.ams.demo.accs","sdkVersion":221,"ttid":"600000@DemoApp_Android_1.0.0","utdid":"Xv3D/f4apCEDAFtMviPkB1AK"}'
    body = JSON.parse(body)
    var value = btoa(format.utf16ToUtf8(JSON.stringify(body)))
    console.log("body is " + JSON.stringify(body))
    console.log("value is " + value)
    var sign = getSign(value, timestamp, nonce, 'efd5ea8dec5ed635174f24a0b2db9440')
    console.log("timestamp is " + timestamp)
    console.log("nonce is " + nonce)
    console.log("sign is " + sign)
  }

  return new Promise((resolve, reject) => {
    const {
      deviceId,
      sid,
      appkey,
      aserverProxy,
      ports,
      noSign,
      debug
    } = opt;
    const {
      userId
    } = opt.m_params

    let protocol = 'http:'
    if (checkIsBrowser() && window.location.protocol === 'https:') {
      protocol = 'https:';
    }

    const baseUrl = `${protocol}//${aserverProxy}:${ports}/accs/token`

    if (debug) {
      console.log("appkey is " + appkey)
      console.log("userId is " + userId)
      console.log("baseUrl is " + baseUrl)
      console.log("server deviceId is " + `${sid}${deviceId}`)
    }
    var timestamp = new Date().getTime()
    var nonce = generateSId()
    var body = {
      appKey: appkey,
      windowId: deviceId,
      userId,
      sid
    }
    var value = btoa(format.utf16ToUtf8(JSON.stringify(body)))
    if (debug) {
      console.log("body is " + JSON.stringify(body))
      console.log("value is " + value)
    }
    var sign = getSign(value, timestamp, nonce, '76a1993dd9ab4d3b83a0jsb544a61218')

    // test()

    var headers = {}
    if(noSign) {
      headers = {}
    } else {
      headers = {
        'X-Request-Timestamp': timestamp,
        'X-Request-Nonce': nonce,
        'X-Request-Appkey': appkey,
        'X-Request-Sign': sign
      }
    }
    
    var options = {
      body: body,
      headers: headers,
      method: "post",
      path: baseUrl,
      response: null,
      timeout: 20000,
      debug: debug
    }

    request(options).then(resp => {
      var result = resp.data;
      if (result && result.success) {
        resolve(result.model)
      } else {
        reject({
          type: 'GET_TOKEN_ERROR',
          message: '获取ACCS token时出错',
          error: result
        })
      }
    }, e => {
      reject({
        type: 'GET_TOKEN_ERROR',
        message: '获取ACCS token时出错',
        error: e
      })
    })
  });
}
