'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  static: {
    enable: true,
  },
  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },
  ejs : {
    enable: true,
    package: 'egg-view-ejs',
  },
  // static: {
  //   enable: true,
  // }
  // nunjucks:{
  //   enable: true,
  //   package: 'egg-view-nunjucks',
  // }
};

// exports.sequelize={
//   enable: true,
//   package: 'egg-sequelize',
// }