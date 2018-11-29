module.exports = class extends think.Logic {
  get scope() {
    return {
      app_id: {
        // required: true
      }
    };
  }
  indexAction() {
    const rules = {
      age: {
        // required: true,
        int: { min: 20, max: 60 } // 20到60之间的整数
      }
    };
    // const msgs = {
    //   app_id: '{name} 不能为空(自定义错误)'
    // };
    // console.log(this.param('age'));
    const flag = this.validate(rules);
    if (!flag) {
      return this.fail(this.validateErrors);
      // 如果校验失败，返回
      // {"errno":1000,"errmsg":"validate error","data":{"username":"username can not be blank"}}
    }
  }
};
