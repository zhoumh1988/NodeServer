const https = require('https');
const http = require('http');

/**
 * 获取图片并转码成base64
 * @param {String} url 图片链接
 * 
 * @return {Promise} 
 * - success {base64, ext}
 * - error false
 */
module.exports = async url => {
  return new Promise((resolve, reject) => {
    if (url.startsWith('//')) {
      url = `http:${url}`;
    }
    if (!url || typeof url !== 'string' || url.length === 0 || url.indexOf('http') === -1) {
      resolve(false);
    } else {
      try {
        const tmp = url.split('/');
        let filename = tmp.slice(-1)[0];
        let ext = false;
        if (filename.indexOf('!') !== -1) {
          filename = filename.split('!')[0];
        }
        if (filename.indexOf('.') !== -1) {
          ext = filename.split('.')[1];
        }
        const request = url.indexOf('https') !== -1 ? https : http;
        request.get(url, res => {
          let chunks = []; //用于保存网络请求不断加载传输的缓冲数据
          let size = 0; //保存缓冲数据的总长度

          res.on('data', chunk => {
            chunks.push(chunk);
            //累加缓冲数据的长度
            size += chunk.length;
          });
          res.on('error', err => {

            if (err) {
              console.error(`Download image error [${url}] Error：`, err);
              resolve(false);
            }
          });
          res.on('end', err => {
            if (err) {
              console.error(`Download image error [${url}] Error：`, err);
              resolve(false);
            }
            console.info(res.headers['content-type']);
            if (!ext) {
              ext = res.headers['content-type'].split('/')[1];
            }
            //Buffer.concat将chunks数组中的缓冲数据拼接起来，返回一个新的Buffer对象赋值给data
            const data = Buffer.concat(chunks, size);
            //将Buffer对象转换为字符串并以base64编码格式显示
            const base64 = data.toString('base64');
            resolve({ filename, base64, ext })
          });
        });
      } catch (error) {
        console.error(`Download image error [${url}] Error：`, error);
        resolve(false);
      }
    }
  });
}