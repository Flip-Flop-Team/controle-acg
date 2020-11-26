import { Effect, Reducer } from 'umi';
import { registerUser, getCursos } from './services';

export interface IRegisterState {
  cursos: Record<string, any>[];
}

interface IRegisterModel {
  namespace: 'register';
  state: IRegisterState;
  effects: {
    init: Effect;
    registerAluno: Effect;
  };
  reducers: {
    update: Reducer<IRegisterState>;
  };
}

const RegisterModel: IRegisterModel = {
  namespace: 'register',
  state: {
    cursos: [],
  },
  effects: {
    *init(_, { call, put }) {
      yield put({
        type: 'update',
        payload: {
          cursos: yield call(getCursos),
        },
      });
    },
    *registerAluno({ payload }, { call }) {
      yield call(registerUser, { ...payload, type: 'aluno' });
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

export default RegisterModel;
