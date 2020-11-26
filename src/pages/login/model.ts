import { Effect, history, Reducer } from 'umi';
import { login } from '@/services';
import { notification } from 'antd';
import { omit } from '@/utils/common';
import { setItem, removeItem } from '@/utils/storage';
import { HOUR } from '@/utils/time';

export interface IUserState {
  id?: number;
  authorized: boolean;
  tipo?: string;
}

interface IUserModel {
  namespace: 'user';
  state: IUserState;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    update: Reducer<IUserState>;
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
        setItem(
          'session',
          {
            token: `Bearer ${response.access}`,
            id: response.id,
            tipo: response.tipo,
            aluno: response.aluno || null,
            professor: response.professor || null,
          },
          12 * HOUR,
        );

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
  reducers: {
    update(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};

export default UserModel;
