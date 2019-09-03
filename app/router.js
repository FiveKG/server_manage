
/**
 * 
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  router.get('/login' , controller.systemPage.login);
  router.get("/login_success", controller.systemPage.login_success);

  router.get(`/server/list` , controller.server.list);

  router.post('/api/qw-hook' , controller.hookApi.gitHook);

  router.post(`/api/build-svr/register`, controller.buildServer.register);

  router.post(`/api/build-svr/notify`, controller.buildServer.notify);
};
