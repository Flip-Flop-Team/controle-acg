import React from 'react';
import { Form, Input, Button } from 'antd';
import { connect, Loading } from 'umi';
import { IUserState } from './model';
import './index.less';

// interface ILoginProps {
//   loading: boolean;
//   user: IUserState;
//   dispatch: Dispatch;
// }

const Login = () => {
  return (
    <>
      <div className="loginBox">
        <h1 style={{ marginTop: '30px' }}>Controle de ACGs</h1>
        <Form layout="vertical" style={{ width: '80%', margin: 'auto' }}>
          <Form.Item
            style={{ marginTop: '90px' }}
            label="E-mail"
            extra={
              <div style={{ width: '100%', textAlign: 'left', margin: '5px' }}>
                <a style={{ color: '#1a73e8' }}>Não tem uma conta?</a>
              </div>
            }
          >
            <Input placeholder="Digite seu e-mail" type="email" />
          </Form.Item>
          <Form.Item
            style={{ marginTop: '50px' }}
            label="Senha"
            extra={
              <div style={{ width: '100%', textAlign: 'left', margin: '5px' }}>
                <a style={{ color: '#1a73e8' }}>Esqueceu sua senha?</a>
              </div>
            }
          >
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
