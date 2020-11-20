import { fetchAPI } from '@/utils/request';

export async function getInTable(url: string): Promise<any> {
  return fetchAPI({
    method: 'GET',
    url,
    authorization: true,
  });
}

export async function createInTable(url: string, params: any): Promise<any> {
  return fetchAPI({
    method: 'POST',
    body: params,
    url,
    authorization: true,
  });
}

export async function deleteInTable(url: string, id: number): Promise<any> {
  const newUrl = `${url}${id}/`;

  return fetchAPI({
    method: 'DELETE',
    url: newUrl,
    authorization: true,
  });
}

export async function editInTable(url: string, data: any, id: number): Promise<any> {
  const newUrl = `${url}${id}/`;

  return fetchAPI({
    method: 'PUT',
    body: data,
    url: newUrl,
    authorization: true,
  });
}

export async function login(payload: any): Promise<any> {
  return fetchAPI({
    method: 'POST',
    url: `/api/login/`,
    body: payload,
  });
}
