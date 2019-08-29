/* eslint valid-jsdoc: "off" */

'use strict';
const path = require("path");

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
  config.middleware = [ 'check' ];

  config.view = {
    defaultViewEngine: 'nunjucks',
    defaultExtension: '.nj',
    mapping: { '.nj': 'nunjucks', },
    root: path.join(appInfo.baseDir, 'app/view')
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    "qywx":{
      "corp_id":"ww14b5a9d19e4f719a",
      "contact_sync_secret": "sIrLSVSFKoBBSM4NDege8u1Vn0VydlS_D5s2G9Oi9WM"   , //企业微信 通讯录 secret
      "agentId": "1000003" ,
      "secret": "w5IlWWXJD8e0-mFv4PibSGInH5mCbhTaZmCeHGbb4F0"
    }
  };

  return {
    ...config,
    ...userConfig,
  };
};
