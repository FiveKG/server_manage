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
};

// exports.sequelize={
//   enable: true,
//   package: 'egg-sequelize',
// }