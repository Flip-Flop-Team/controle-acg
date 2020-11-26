import { fetchAPI } from '@/utils/request';

export async function registerUser(payload: any): Promise<any> {
  const url = '/api/register-user/';
  return fetchAPI({
    method: 'POST',
    body: payload,
    url,
    authorization: false,
  });
}

export async function getCursos(): Promise<any> {
  const url = '/api/curso/';
  return fetchAPI({
    method: 'GET',
    url,
    authorization: false,
  });
}
