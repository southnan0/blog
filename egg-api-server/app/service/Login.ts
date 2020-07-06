import { Service } from 'egg';
const JWT = require('jsonwebtoken');

interface LoginParams {
  userName?: string;
  password?: string;
  type: string;
  mobile?: string;
  captcha?: string;
}

enum LoginType {
  ACCOUNT='account',
  MOBILE='mobile'
}

const buildToken = (result, jwtSecret) => {
  return JWT.sign({
    userId: result.user_id,
  },
  jwtSecret,
  {
    expiresIn: 60 * 60,
  });
};

export default class Login extends Service {
  public async doLogin(params: LoginParams) {
    console.info(params);

    const successObj = {
      status: 'ok',
      type: params.type,
    };

    const failObj = {
      status: 'error',
      type: params.type,
      errorCode: 401,
    };

    if (params.type === LoginType.ACCOUNT) {
      const currentUser = await this.app.mysql.query(
        `SELECT * FROM tb_user where user_name = "${params.userName}" and password = "${params.password}"`);

      if (currentUser?.length) {
        const token = buildToken(currentUser[0], this.config.jwt.secret);
        return {
          ...successObj,
          currentAuthority: currentUser[0].authority,
          token,
        };
      }
      return {
        ...failObj,
        errorMessage: '账号密码错误',
      };
    } else if (params.type === LoginType.MOBILE) {
      const currentUser = await this.app.mysql.query(
        `SELECT * FROM tb_user where user_name = "${params.userName}" and captcha = 111206`);

      if (currentUser?.length) {
        return {
          ...successObj,
          currentAuthority: currentUser[0].authority,
          token: buildToken(currentUser[0], this.config.jwt.secret),
        };
      }
      return {
        ...failObj,
        errorMessage: '账号密码错误',
      };
    }
    return {
      ...failObj,
      errorMessage: '账号密码错误',
    };
  }

  public async currentUser(params: any) {
    console.info(params);

  }
}
