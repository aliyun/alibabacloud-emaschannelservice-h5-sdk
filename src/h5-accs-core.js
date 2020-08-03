'use strict';

import accsMsg from './accs-msg.js';
import { WebSocket, checkIsBrowser } from './api-adapter';

const MAX_RECONNECT_TIMES = 5; // 最多重试重连的次数
const RECONNECT_INTERVAL = 2000; // 默认尝试重连的间隔时间 ms
const DETECT_INTERVAL = 30000; // 心跳探测时间。

class H5AccsCore {
  constructor(resolve, reject, aserverProxy = '', token, ports, timeout = 3000, opt) {
    this._subscribeMap = accsMsg.subscribeMap;
    this._ackMap = accsMsg.ackMap;
    this._msgMap = accsMsg.msgMap;
    this._aserverProxy = aserverProxy;
    this._ports = ports;
    this._token = token;
    this._opt = opt;
    this._reconnectAble = false; // 标示是否可进行重连尝试
    this._closeTimes = 0; // 标记断连次数
    this._detectTimer = null; // 侦测的计时器

    // 检查是否可进行重连，当用户传入 accsToken 不可重连。
    if (opt.reconnect) {
      // 因为 token 来自使用者，不能确定获得途径，重连必须从获取 token 开始。
      if (!opt.accsToken) {
        this._reconnectAble = true;
      } else {
        console.warn(`The custom "accsToken" can't use reconnect mode!`);
      }
    }

    // 初始化
    this._getConnectionUrl();
    this._initConnection(ret => {
      if (ret.isSuccess) {
        this._connection = ret.connection;
        this._sendProbe(); // 增加探测
        this._bindEventHandler();
        // 临时增加上下行心跳
        if (this._opt.accsHeartbeat) {
          this.heartCheck = {
            stopped: false,
            timeoutObj: null,
            serverTimeoutObj: null,
            stop: () => {
              const heartCheck = this.heartCheck;
              clearTimeout(heartCheck.timeoutObj);
              clearTimeout(heartCheck.serverTimeoutObj);
              heartCheck.stopped = true;
            },
            reset: (timeout) => {
              const heartCheck = this.heartCheck;
              clearTimeout(heartCheck.timeoutObj);
              clearTimeout(heartCheck.serverTimeoutObj);
              if (heartCheck.stopped) return;
              heartCheck.start(timeout);
            },
            start: (timeout) => {
              const heartCheck = this.heartCheck;
              const heartCheckTimeout = timeout || DETECT_INTERVAL;
              if (heartCheck.stopped) return;
              heartCheck.timeoutObj = setTimeout(() => {
                const data = {};
                this.send('h5_ping', JSON.stringify(data)).then((resp) => {
                  // 监听心跳下行，发送成功即可认为连接有效（接收到服务端下发的确认消息才会认定发送成功）
                  // 此回调只要服务端收到必会回调，避免类似断网等操作，堆积多个 promise 回调同时执行
                  if (heartCheck.stopped) return;
                  try {
                    // 服务端可能下发新的 时间间隔
                    this.heartCheck.reset(JSON.parse(resp.getText()).timeInterval * 1000);
                  } catch (e) {
                    // ignore
                  }
                }, e => {
                  // ignore
                });
                heartCheck.serverTimeoutObj = setTimeout(() => {
                  this.onHeartbeatError && this.onHeartbeatError();
                  heartCheck.stop();
                }, heartCheckTimeout);
              }, heartCheckTimeout);
            }
          };
          this.heartCheck.start();
        }
        resolve(this);
      } else {
        reject({
          type: 'OPEN_CONNECTION_ERROR',
          message: '开启连接失败',
          error: ret.error
        });
      }
    });

    setTimeout(() => {
      if (!this.getStatus()) {
        // 如果不在连接状态，则返回超时错误，某些android机型webSocket没有具体实现，始终未建联
        reject({
          type: 'OPEN_CONNECTION_TIMEOUT',
          message: '开启连接超时',
          error: ''
        });
      }
    }, timeout);
  }

  // 获取 Websocket 链接
  _getConnectionUrl() {
    let env = 'm';
    let protocol = this._opt.protocol || 'ws:';
    if (checkIsBrowser() && window.location.protocol === 'https:') {
      protocol = 'wss:';
    }
    // 如果手动设置了aserver的域名，则优先使用
    if (this._aserverProxy) {
      this._url = `${protocol}//${this._aserverProxy}:${this._ports}/accs_ws/auth?token=${this._token}`;
    } else {
      this._url = `${protocol}//msgacs.${env}.taobao.com:${this._ports}/accs_ws/auth?token=${this._token}`;
    }
    return this._url;
  }

  _initConnection(callback) {
    const ws = new WebSocket(this._url);
    ws.onopen = function () {
      ws.onerror = null;
      ws.onopen = null;
      callback && callback({
        isSuccess: true,
        connection: ws
      });
    };
    ws.onerror = function (e) {
      ws.onerror = null;
      ws.onopen = null;
      callback && callback({
        isSuccess: false,
        connection: ws,
        error: e
      });
    };
  }
  _bindEventHandler() {
    this._connection.onerror = (e => {
      console.log('accs_onerror', e);
      this.onError && this.onError(e);
    });
    this._connection.onclose = (code => {
      // 关闭探测
      clearTimeout(this._detectTimer);
      // 判断是进行重连还是进入断连回调
      if (this._reconnectAble) {
        this._reconnect();
      } else {
        console.log('accs_onclose', code);
        this.onClose && this.onClose(code);
      }
    });
    this._connection.onmessage = (evt => {
      //console.log('accs_onmessage', evt);
      this._processDownlinkMsg(evt.data);
    });
  }

  _sendProbe() {
    this._detectTimer = setTimeout(() => {
      if (this._opt.heartbeat === true) {
        this._connection.send(JSON.stringify({
          'type': 'ACK',
          'protocol': "HEARTBEAT_ACCS_H5",
          'data': ''
        }));
        this._sendProbe();
      } else {
        clearTimeout(this._detectTimer);
      }
    }, DETECT_INTERVAL);
  }

  _sendACK(msg) {
    this._connection.send(JSON.stringify({
      'type': 'ACK',
      'protocol': "ACCS_H5",
      'dataId': msg.dataId,
      'serviceId': msg.serviceId,
      'target': msg.source || '',
      'source': msg.target || '',
      'ip': msg.ip || '',
      'data': '',
      'extHeader': msg.extHeader || {}
    }));
  }

  _processDownlinkMsg(str) {
    accsMsg.processDownlinkMsg(str, resp => {
      this._sendACK(resp);
    });
  }

  onMessage(serviceId, callback) {
    if (typeof callback != 'function') {
      return;
    }
    // 下行重启探测
    clearTimeout(this._detectTimer);
    this._sendProbe();
    this._subscribeMap['_' + serviceId] = callback;
  }

  onError(e) {
    console.log(e);
    console.log('webSocket onerror');
  }

  offMessage(serviceId) {
    delete this._subscribeMap['_' + serviceId];
  }

  send(serviceId, data, extHeaderConfig) {
    var _this = this;
    return new Promise(function (resolve, reject) {
      try {
        if (!_this.getStatus()) {
          throw 'websocket not available';
        }

        let message = accsMsg.packMsg(serviceId, data, extHeaderConfig);

        if (resolve) {
          _this._ackMap['_' + message.dataId] = resolve;
          // 增加消息缓存
          _this._msgMap['_' + message.dataId] = message;
          // 缓存用户上传的 binduser 操作
          if (serviceId === 'accs_h5_binduser') {
            _this._msgMap['binduser'] = message;
          }
        }

        // 上行重启探测
        clearTimeout(_this._detectTimer);
        _this._sendProbe();

        _this._connection.send(JSON.stringify(message));
      } catch (e) {
        reject(e);
      }
    });
  }

  close() {
    if (this.getStatus()) {
      // 关闭临时心跳
      this.heartCheck.stop()
      this._reconnectAble = false;
      this._connection.close();
    }
  }

  // 重连。
  // 从获取token开始重新建连，不同的 MTOP 令牌服务可能会使 服务端对应的 deviceId 发生改变，但前端注册的时间和windowId不变
  // 为避免服务端限制 H5 连接，每个实例最多建连5次，期间发生任何错误均执行 Websocket 断连回调事件。
  _reconnect() {
    if ((++this._closeTimes) < MAX_RECONNECT_TIMES) {
      // 等待重试间隔
      setTimeout(() => {
        const aserverProxy = this._opt.aserverProxy || '';
        const ports = this._opt.ports || 80;
        // 重试 从新获取 token
        this._opt.getToken({
          appkey: this._opt.appkey,
          aserverProxy: aserverProxy,
          deviceId: this._opt.__accs_device,
          sid: this._opt.__emas_accs_sid_device,
          ports: ports,
          m_params: this._opt.m_params,
          noSign: this._opt.noSign,
          debug: this._opt.debug
        }).then(token => {
          if (token) {
            this._token = token;
            // 重新初始化 websocket 连接
            this._getConnectionUrl();
            this._initConnection(ret => {
              if (ret.isSuccess) {
                // 更新连接
                this._connection = ret.connection;
                this._sendProbe(); // 增加探测
                this._bindEventHandler();
                // 新增重连成功后的回调
                this.onReconnect && this.onReconnect(this);
              } else {
                // 建连失败有可能是连接到了正在重启的机器，继续下一次重试
                this._reconnect();
              }
            });
          } else {
            this._reconnectAble = false;
            console.log('webSocket reconnect get TOKEN response error');
            this.onClose && this.onClose();
          }
        })['catch'](e => {
          // ACCS 重启也可能会影响到 MTOP ，请求失败有可能是连接到了正在重启的机器，继续下一次重试
          this._reconnect();
        });
      }, this._opt.reconnectInterval || RECONNECT_INTERVAL);
    } else {
      // 重试结束
      this._reconnectAble = false;
      console.log('webSocket reconnect end!');
      this.onClose && this.onClose();
    }
  }

  // 增加手动重连方法，兼容自定 accsToken 方式重连，临时兼容，后续依靠连接保障稳定性
  dangerouslyReconnect(accsToken, successCallback, failureCallback) {
    this._token = accsToken;
    // 重新初始化 websocket 连接
    this._getConnectionUrl();
    this._initConnection(ret => {
      if (ret.isSuccess) {
        // 更新连接
        this._connection = ret.connection;
        this._sendProbe(); // 增加探测
        this._bindEventHandler();
        // 如果有未发送成功的消息，则重新发送
        console.log(this._ackMap);
        console.log(this._msgMap);
        if (this._msgMap['binduser']) {
          this.send('accs_h5_binduser', this._msgMap['binduser']).then(resp => {
            // 补偿重发，没有收到服务端下行的 res 消息
            if (Object.keys(this._ackMap).length > 0) {
              Object.keys(this._ackMap).forEach((dataId) => {
                this._connection.send(JSON.stringify(this._msgMap[dataId]));
              });
            }
          });
        } else {
          // 补偿重发，没有收到服务端下行的 res 消息
          if (Object.keys(this._ackMap).length > 0) {
            Object.keys(this._ackMap).forEach((dataId) => {
              console.log(this._msgMap[dataId]);
              this._connection.send(JSON.stringify(this._msgMap[dataId]));
            });
          }
        }
        // 重连成功后的回调
        successCallback && successCallback(this);
      } else {
        // 建连失败执行回调
        failureCallback && failureCallback();
      }
    });
  }

  getStatus() {
    return this._connection && Number(this._connection.readyState) === 1;
  }

}

export default H5AccsCore;
