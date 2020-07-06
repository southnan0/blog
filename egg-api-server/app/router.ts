import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);
  router.post('/login/account', controller.login.account);
  router.get('/currentUser', controller.login.currentUser);
  router.get('/login/outLogin', controller.login.outLogin);


  router.get('/sort/:id?', controller.sort.list);
  router.post('/sort', controller.sort.add);
};
