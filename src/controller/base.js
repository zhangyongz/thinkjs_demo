import { think } from 'thinkjs';

module.exports = class extends think.Controller {
  async __before() {
    this.header('Access-Control-Allow-Origin', this.header('origin') || '*');
    this.header('Access-Control-Allow-Headers', 'content-type,x-requested-with,accept,token,Authorization');
    this.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE');
    this.header('Access-Control-Allow-Credentials', true);
    let method = this.ctx.method.toLowerCase();
    if (method === 'options') {
      this.ctx.status = 200;
      return false;
    }
    let url = this.ctx.request.url;
    if (url !== '/admin/login' && url !== '/admin/reg') {
      console.log(this.ctx.req.action);
      let userinfo = await this.cache('userinfo');
      if (userinfo) {
        if (this.header('token') !== userinfo.token) {
          return this.fail(this.config('USER_UNEXPECT_CODE'), '用户非法!');
        }
      } else {
        return this.fail(this.config('USER_UNEXPECT_CODE'), '用户非法!');
      }
    }
  }
};
