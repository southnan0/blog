import { Service } from 'egg';
import { objectKeyToCamel } from '../utils';

export default class User extends Service {
  public async currentUser(params: any) {

    const currentUser = await this.app.mysql.query(
      `SELECT * FROM tb_user where user_id = "${params.userId}"`);

    return objectKeyToCamel(currentUser[0]);
  }
}
