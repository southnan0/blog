import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1590465765379_2500';

  // add your egg config in here
  config.middleware = [];

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  // cors设置  start
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    domainWhiteList: [ 'http://localhost:8000' ],
  };
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  config.mysql = {
    client: {
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: '11111111',
      database: 'blog_db',
    },
    app: true,
    agent: false,
  };

  config.jwt = {
    secret: 'egg-api-jwt',
  };

  config.middleware = [
    'jwt',
  ];

  config.redis = {
    client: {
      port: 6379, // Redis port
      host: '127.0.0.1', // Redis host
      password: '11111111',
      db: 0,
    },
  };

  config.validate = {
    // convert: false,
    validateRoot: false,
  };

  // cors设置 end

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
