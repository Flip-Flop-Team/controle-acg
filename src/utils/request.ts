import { notification } from 'antd';
import env from '@/../config/env';
import { getItem, setItem } from '@/utils/storage';

interface IFetchAPI {
  method: string;
  url: string;
  body?: any;
  authorization?: boolean;
  cacheLifetime?: number;
}

export async function fetchAPI(props: IFetchAPI): Promise<any> {
  const { method, url, body, authorization, cacheLifetime } = props;

  if (cacheLifetime) {
    const object = getItem(url);
    if (object) {
      return object;
    }
  }

  const headers: any = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  if (authorization) {
    const session = getItem('session');
    if (!session) {
      return null;
    }
    headers.Authorization = session.token;
  }

  return fetch(env.apiUrl + url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  })
    .then((response: Response): any => {
      if (response.status === 204) {
        return response.text();
      }
      return response.json();
    })
    .then((response: any): any => {
      if (response.error && response.message.includes('Dado em uso')) {
        notification.error({
          message: 'Erro',
          description: response.message,
        });
        return new Error('Erro ao deletar');
      }
      if (cacheLifetime) {
        setItem(url, response, cacheLifetime);
      }
      return response;
    })
    .catch(
      (error: any): Response => {
        notification.error({
          message: 'Falha na requisição!',
          description: error.message,
        });
        return error.response;
      },
    );
}
