
/**
 * 
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  //router.get('/', controller.home.index);

  router.get('/login' , controller.systemPage.login);
  router.get("/login_success", controller.systemPage.login_success);

  router.get(`/server/list` , controller.server.list);

  router.post('/api/qw-hook' , controller.hookApi.gitHook);

  router.post(`/api/build-svr/register`, controller.buildServer.register);

  router.post(`/api/build-svr/notify`, controller.buildServer.notify);
  router.get('/', controller.server.server_info);
  
  router.get('/test', controller.test.index);

  
  router.get('/server',controller.server.server_info);
  router.get('/set_server',controller.server.set_server);

  router.post('/api/set_server',controller.api.serverApi.set_server);

};
