import { Service } from 'egg';
import * as moment from 'moment';
import { failFn, objectKeyToCamel, successFn } from '../utils';
import { SortItemParams } from '../../../typings/Sort';

export default class Sort extends Service {
  public async list(id: string) {
    let list;
    if (id) {
      list = await this.app.mysql.query(
        `SELECT * FROM tb_sort where sort_id=${id}`,
      );
    } else {
      list = await this.app.mysql.query(
        'SELECT * FROM tb_sort',
      );
    }

    const data = list?.map(item => objectKeyToCamel(item));
    console.info(data);
    return successFn({
      data,
    });
  }

  public async add(params: SortItemParams) {

    let result: any;
    try {
      const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      result = await this.app.mysql.query('INSERT INTO ' +
          'tb_sort (sort_name, description, parent_id, created_time, updated_time, status) ' +
          `VALUES ('${params.sortName}', '${params.description || ''}', ${params.parentId || 0},'${now}','${now}',0)`);

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
