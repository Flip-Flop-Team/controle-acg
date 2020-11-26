import React from 'react';
import { IUserState } from '@/pages/login/model';
import { Spin } from 'antd';
import Aluno from '@/pages/aluno';
import Professor from '@/pages/professor';
import { Loading, connect } from 'umi';

interface IRouterProps {
  loading: boolean;
}

const Router = (props: IRouterProps) => {
  return (
    <>
      {props.loading ? (
        <Spin />
      ) : (
        <>
          {JSON.parse(localStorage.getItem('session') || '').object.tipo === 'professor' ? (
            <Professor />
          ) : (
            <Aluno />
          )}
        </>
      )}
    </>
  );
};

interface IConnect {
  user: IUserState;
  loading: Loading;
}

export default connect(({ loading, user }: IConnect) => ({
  loading: loading.models.user,
  user,
}))(Router);
