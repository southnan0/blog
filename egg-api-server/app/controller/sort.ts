import { Controller } from 'egg';
import { failFn } from '../utils';

export default class SortController extends Controller {
  public async list() {
    const { ctx } = this;
    const { id } = ctx.params;
    ctx.body = await ctx.service.sort.list(id);
  }

  public async add() {
    const { ctx } = this;

    const rule = {
      sortName: { type: 'string', required: true, message: '分类名称不能为空' },
      description: { type: 'string', required: false, max: 100 },
    };
    const postParams = ctx.request.body;
    const error: ValidateError|any = this.app.validator.validate(rule, postParams); // 验证提交数据是否合法

    if (error !== undefined) {
      ctx.body = failFn({
        errorMessage: 'sort error',
        errors: error,
      });
    } else {
      ctx.body = await ctx.service.sort.add(ctx.request.body);
    }
  }
}
