import { request } from 'umi';
import {SortItemParams} from "../../../../typings/Sort";

export async function querySort(params?: SortItemParams) {
  return request('/api/sort', {
    params,
  });
}

export async function removeSort(params: { sortIds: number[] }) {
  return request('/api/sort', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addSort(params: SortItemParams) {
  return request('/api/sort', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateSort(params: SortItemParams) {
  return request('/api/sort', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
