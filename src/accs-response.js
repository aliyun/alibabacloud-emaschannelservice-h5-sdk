'use strict';

import format from './utils/format.js';
import atob from './utils/atob';
import gzip from './utils/gzip';
class accsResponse {

  constructor(jsonStr) {
    var message = JSON.parse(jsonStr);
    for (var k in message) {
      if (message.hasOwnProperty(k)) {
        this[k] = message[k];
      }
    }

  }

  getText() {
    if (!this.data) {
      return '';
    }
    return format.utf8ToUtf16(atob(this.data));
  }
  getBinaryArray() {
    const p = new Promise((resolve) => {
      if (!this.data) {
        resolve([]);
        return;
      }
      const dataTxt = atob(this.data); // 获取转成utf16的字节流
      const compressType = this.compressType || 'COMMON';// COMMON——无压缩，GZIP——gzip压缩，ZLIB——zlib压缩，INVALID——错误的压缩类型
      let uint8arr = format.binaryStringToBinaryArray(dataTxt);
      if (String(compressType) === 'GZIP') {
        // 使用gzip解压
        // gzip压缩，解压消息
        const options = {
          level: 6,
          name: '',
          timestamp: parseInt(Date.now() / 1000, 10)
        };
        // gzip解码
        uint8arr = new Uint8Array(gzip.unzip(uint8arr, options));
        resolve(uint8arr);
      } else {
        resolve(uint8arr);
      }
    });
    return p;
  }
}

export default accsResponse;
