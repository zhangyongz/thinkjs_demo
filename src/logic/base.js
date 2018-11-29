module.exports = class extends think.Logic {
  __before() {
    this.header('Access-Control-Allow-Origin', this.header('origin') || '*');
    this.header('Access-Control-Allow-Headers', 'content-type,x-requested-with,accept,token,Authorization');
    this.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE');
    this.header('Access-Control-Allow-Credentials', true);
    let method = this.ctx.method.toLowerCase();
    if (method === 'options') {
      this.ctx.status = 200;
      return false;
    }
  }
};
