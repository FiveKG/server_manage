//@ts-check

const { format } = require("date-fns");

module.exports = {

    /** 返回当前时间的 字符串. */
    nowTimeStr() {
      return format(new Date(),"yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
    }
};
  