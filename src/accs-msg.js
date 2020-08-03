import accsResponse from './accs-response.js';
import format from './utils/format.js';
import generateId from './utils/id-generator.js';
import atob from './utils/atob';
import btoa from './utils/btoa';

const maxsl = 50; // 去重的缓存最大缓存数
let accsMsg = {
  ackMap: {},
  msgMap: {}, // 缓存消息
  subscribeMap: {},
  __stack__: {}, // 缓存已经响应的 dataId ,去重防止多次回调
  __sl__: 0, // 当前已缓存的 dataId 数量
  packMsg(serviceId, data, extHeaderConfig) {
    let encodedData;

    if (data.buffer && data instanceof Uint8Array) {
      let binaryStr = format.binaryArrayToBinaryString(data);
      encodedData = btoa(binaryStr);
    } else {
      if (typeof data != 'string') {
        throw 'non-binary data must be string';
      }
      //DOM String 是Utf16编码的, 直接调用浏览器base64会出错, 所以先转成utf8格式
      encodedData = btoa(format.utf16ToUtf8(data));
    }

    // 检验 extHeader 为对象，key 只能为 0~63之间的数字，value 必须是 字符串。不符合则不传输，避免 AServer 解析出错
    const encodedExtHeader = {};
    if (typeof extHeaderConfig === 'object' && extHeaderConfig.headers) {
      const extHeaders = extHeaderConfig.headers;
      Object.keys(extHeaders).forEach((header) => {
        // 1. 检验键值为 0~63 的数字 并且值为字符串
        if ( Number(header) && header >= 0 && header <= 63 && typeof extHeaders[header] === 'string' ) {
          // AServer 接收 base64 处理后的拓展头
          if ( extHeaderConfig.base64Encode !== false ){
            // 用户未设置 base64Encode 时默认 base64 加密
            encodedExtHeader[header] = btoa(extHeaders[header]);
          } else {
            encodedExtHeader[header] = extHeaders[header];
          }
        }
      });
    }

    var message = {
      type: "REQ",
      protocol: "ACCS_H5",
      dataId: generateId(),
      serviceId,
      target: serviceId, // 新增目标服务标示 - 请求的服务
      source: serviceId, // 新增来源服务标示 - 真正响应的服务
      data: encodedData, //数据字段base64编码
      extHeader: encodedExtHeader
    };
    return message;
  },
  processDownlinkMsg(str, dataCb) {
    // try {
    var resp = new accsResponse(str);
    if (resp.protocol != 'ACCS_H5' && resp.protocol != 'ACCS_WV') {
      return;
    }
    if (resp.err == '1') {
      // 如果err字段存在，并且为1，则为报错
      let errJsonStr = atob(resp.data);
      let err = {};
      try {
        err = JSON.parse(errJsonStr);
      } catch (e) {
        console.error(e);
      }
    }
    switch (resp.type) {
      case 'RES':
        // 上行数据的ACK
        let ackHandler = this.ackMap['_' + resp.dataId];
        if (ackHandler) {
          ackHandler(resp);
          delete this.ackMap['_' + resp.dataId];
          delete this.msgMap['_' + resp.dataId];
        }

        break;
      case 'DATA':
        // 服务的主动推送的下行数据
        if (!this.__stack__[resp.dataId]) {
          // 去重 防止多次回调
          this.__stack__[resp.dataId] = true;
          // 大于最大缓存数时，重置缓存
          if (this.__sl__++ >= maxsl){
            this.__sl__ = 0;
            this.__stack__ = {};
          }
          let serviceHandler = this.subscribeMap['_' + resp.serviceId];
          serviceHandler && serviceHandler(resp);
        }

        // 解析 extHeader
        // extHeader 只能为对象，key 只能为 0~63之间的数字，value 必须是 字符串。
        if (resp.extHeader) {
          // AServer 会 base64 加密。 decode 后返回给上层
          resp.decodedExtHeader = {};
          Object.keys(resp.extHeader).forEach((header) => {
            resp.decodedExtHeader[header] = atob(resp.extHeader[header]);
          });
        }

        // 正常回 ack
        dataCb && dataCb(resp);
        break;
      default:

    }
    // } catch (e) {
    // console.log('accs_parse_downlink_msg_error', e);
    // }
  }
};
export default accsMsg;