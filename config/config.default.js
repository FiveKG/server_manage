/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1566994071635_5316';

  // add your middleware config here
  config.middleware = [];

  //配置数据库
  config.sequelize = {
    dialect: 'postgres', // support: mysql, mariadb, postgres, mssql
    database: 'yue_manage',
    host: '192.168.1.102',
    port: 5432,
    username: 'postgres',
    password: 'pass@2018',
  };
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
