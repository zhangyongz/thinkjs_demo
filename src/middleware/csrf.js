const defaultOptions = {
  consoleExecTime: true // 是否打印执行时间的配置
};
module.exports = (options) => {
  // 合并传递进来的配置
  options = Object.assign({}, defaultOptions, options);
  return (ctx, next) => {
    if (!options.consoleExecTime) {
      return next(); // 如果不需要打印执行时间，直接调用后续执行逻辑
    }
    const startTime = Date.now();
    let err = null;
    // 调用 next 统计后续执行逻辑的所有时间
    return next().catch(e => {
      err = e; // 这里先将错误保存在一个错误对象上，方便统计出错情况下的执行时间
    }).then(() => {
      const endTime = Date.now();
      console.log(`request exec time: ${endTime - startTime}ms`);
      if (err) return Promise.reject(err); // 如果后续执行逻辑有错误，则将错误返回
    });
  };
};
