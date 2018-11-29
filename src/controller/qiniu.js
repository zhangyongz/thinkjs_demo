const Base = require('./base.js');
const qiniu = require('qiniu');
module.exports = class extends Base {
  qiniuUploadTokenAction() {
    var accessKey = 'cI4ds-mbHU2VR7hv1nIxReLf6Tyq3LovW2JQUMf_';
    var secretKey = 'm2bOrGrNzU5ty-jA9hhRI_qFDcmuXIHHwoyMj4KJ';
    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    var options = {
      scope: 'blog',
      expires: 7200
    };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken = putPolicy.uploadToken(mac);
    return this.success(uploadToken, '上传成功!');
  }
  qiniuDeleteAction() {
    qiniu.conf.ACCESS_KEY = '_wCcf5wLs-wp2UtoMzHAXn-MUh0SHAqhA281-7A8';
    qiniu.conf.SECRET_KEY = 'EqpP04HZNgHlv-2UhKDPqjEv9ZeHDfOJfLtqo2Si';
    var client = new qiniu.rs.Client();
    var bucket = 'blog';
    let key = this.post('key');
    client.remove(bucket, key, function(err, ret) {
      if (!err) { } else {
        console.log(err);
      }
    });
  }
};
