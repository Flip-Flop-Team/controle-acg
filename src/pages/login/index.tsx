import React, { useEffect } from 'react';
import { removeExpired, hasItem } from '@/utils/storage';
import { Form, Input, Button } from 'antd';
import { connect, Loading, history, Dispatch } from 'umi';
import { IUserState } from './model';
import './index.less';

interface ILoginProps {
  dispatch: Dispatch;
}

const Login = (props: ILoginProps) => {
  useEffect(() => {
    const url = `/`;

    removeExpired();

    if (hasItem('session')) {
      history.replace(url);
    }
  }, []);

  const onFinish = (payload: any) => {
    props.dispatch({
      type: 'user/login',
      payload: {
        ...payload,
      },
    });
  };

  return (
    <>
      <div className="loginBox">
        <h1 style={{ marginTop: '30px' }}>Controle de ACGs</h1>
        <Form layout="vertical" style={{ width: '80%', margin: 'auto' }} onFinish={onFinish}>
          <Form.Item
            style={{ marginTop: '90px' }}
            label="E-mail"
            name="username"
            extra={
              <div style={{ width: '100%', textAlign: 'left', margin: '5px' }}>
                <a onClick={() => history.push('/register-student')} style={{ color: '#1a73e8' }}>
                  Não tem uma conta?
                </a>
              </div>
            }
          >
            <Input placeholder="Digite seu e-mail" type="email" />
          </Form.Item>
          <Form.Item style={{ marginTop: '50px' }} label="Senha" name="password">
            <Input placeholder="Digite sua senha" type="password" />
          </Form.Item>
          <Form.Item style={{ marginTop: '50px' }}>
            <Button type="primary" htmlType="submit">
              Entrar
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default connect(({ loading, user }: { loading: Loading; user: IUserState }) => ({
  loading: loading.models.user,
  user,
}))(Login);
