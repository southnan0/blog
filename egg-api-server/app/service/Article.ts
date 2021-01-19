import { Service } from 'egg';
import * as moment from 'moment';
import { failFn, objectKeyToCamel, successFn } from '../utils';
import { ArticleItemParams } from '../../../typings/Article';

export default class Sort extends Service {
  public async list(id: string) {
    let list;
    if (id) {
      list = await this.app.mysql.query(
        `SELECT * FROM tb_article where article_id=${id}`,
      );
    } else {
      list = await this.app.mysql.query(
        'SELECT * FROM tb_article',
      );
    }

    const data = list?.map(item => objectKeyToCamel(item));
    console.info(data);
    return successFn({
      data,
    });
  }

  public async add(params: ArticleItemParams) {

    let result: any;
    try {
      const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      result = await this.app.mysql.query('INSERT INTO ' +
                'tb_article (article_name, description, sort_id, created_time, updated_time, status) ' +
                `VALUES ('${params.title}', '${params.description || ''}', ${params.sortId || 0},'${now}','${now}',0)`);

      console.info('insert result:======>', result);
      return successFn({
        data: result.insertId,
      });
    } catch (e) {
      console.info('insert error', e);
      return failFn({
        errorMessage: e,
      });
    }

  }
}
