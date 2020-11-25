import { Effect, history } from 'umi';
import { login } from '@/services';
import { notification } from 'antd';
import { omit } from '@/utils/common';
import { setItem, removeItem } from '@/utils/storage';
import { HOUR } from '@/utils/time';

export interface IUserState {
  id?: number;
  email?: string;
  nome?: string;
  is_admin?: boolean;
  authorized: boolean;
}

interface IUserModel {
  namespace: 'user';
  state: IUserState;
  effects: {
    login: Effect;
    logout: Effect;
  };
}

const UserModel: IUserModel = {
  namespace: 'user',
  state: {
    authorized: false,
  },
  effects: {
    *login({ payload }, { call }) {
      const response = yield call(login, omit(payload, ['redirect']));

      if (response.access) {
        setItem('session', { token: `Bearer ${response.access}` }, 12 * HOUR);

        history.replace(payload.redirect || '/');
      } else {
        notification.error({
          message: 'Usuário e/ou senha inválidos!',
          description: response.detail || 'Por favor, verifique os dados informados.',
        });
      }
    },
    *logout(_, { put }) {
      removeItem('session');

      yield put({
        type: 'update',
        payload: {
          authorized: false,
        },
      });

      history.replace('/user/login');
    },
  },
};

export default UserModel;
