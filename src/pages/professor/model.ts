import { Effect, Reducer } from 'umi';
import { get, create, update, remove } from './services';

export interface IProfessorState {
  curriculos: Record<string, any>[];
  cursos: Record<string, any>[];
  regras: Record<string, any>[];
  atividades: Record<string, any>[];
}

export interface IProfessor {
  namespace: string;
  state: IProfessorState;
  effects: {
    get: Effect;
    create: Effect;
    edit: Effect;
    remove: Effect;
  };
  reducers: {
    update: Reducer<IProfessorState>;
  };
}

const ProfessorModel: IProfessor = {
  namespace: 'professor',
  state: {
    curriculos: [],
    cursos: [],
    regras: [],
    atividades: [],
  },

  effects: {
    *get({ payload }, { call, put }) {
      yield put({
        type: 'update',
        payload: {
          [payload.field]: yield call(get, payload),
        },
      });
    },
    *create({ payload }, { call, put }) {
      yield call(create, payload);
      yield put({ type: 'get', payload: { url: payload.url, field: payload.field } });
    },
    *edit({ payload }, { call, put }) {
      yield call(update, payload);
      yield put({ type: 'get', payload: { url: payload.url, field: payload.field } });
    },
    *remove({ payload }, { call, put }) {
      yield call(remove, payload);
      yield put({ type: 'get', payload: { url: payload.url, field: payload.field } });
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
export default ProfessorModel;
