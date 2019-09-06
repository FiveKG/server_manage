'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.server.server_info);
  
  router.get('/test', controller.test.index);

  router.get('/server',controller.server.server_info);
  router.get('/set_server',controller.server.set_server);

  router.post('/api/set_server',controller.api.serverApi.set_server);

};
