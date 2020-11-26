import { fetchAPI } from '@/utils/request';

export async function get(params: any): Promise<any> {
  return fetchAPI({
    method: 'GET',
    url: params.url,
    authorization: true,
  });
}

export async function create(params: any): Promise<any> {
  return fetchAPI({
    method: 'POST',
    body: params.data,
    url: params.url,
    authorization: true,
  });
}

export async function update(params: any): Promise<any> {
  return fetchAPI({
    method: 'PUT',
    body: params.data,
    url: `${params.url}${params.id}/`,
    authorization: true,
  });
}

export async function remove(params: any): Promise<any> {
  return fetchAPI({
    method: 'DELETE',
    url: `${params.url}${params.id}/`,
    authorization: true,
  });
}
