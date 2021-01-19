import { request } from 'umi';
import {ArticleItemParams} from "../../../../typings/Article";

export async function queryArticle(params?: ArticleItemParams) {
  return request('/api/article', {
    params,
  });
}

export async function removeArticle(params: { articleIds: number[] }) {
  return request('/api/article', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addArticle(params: ArticleItemParams) {
  return request('/api/article', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateArticle(params: ArticleItemParams) {
  return request('/api/article', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
