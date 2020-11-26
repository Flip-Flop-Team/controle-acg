import React, { useEffect } from 'react';
import './index.less';
import { history, connect, Dispatch, Loading } from 'umi';
import { Form, Input, Select, Button, notification } from 'antd';
import { IRegisterState } from './model';

interface IRegisterStudentProps {
  register: IRegisterState;
  dispatch: Dispatch;
  loading: boolean;
}

const RegisterStudent = (props: IRegisterStudentProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    props.dispatch({
      type: 'register/init',
    });
  }, []);

  const onFinish = (payload: any) => {
    props
      .dispatch({
        type: 'register/registerAluno',
        payload,
      })
      .then(() => {
        notification.success({
          message: 'Registrado com sucesso',
        });
        setTimeout(() => {
          history.push('/login');
        }, 3000);
      });
  };

  return (
    <>
      <div className="Container">
        <h1 style={{ margin: '30px' }}>Entre com seus dados</h1>
        <Form
          layout="vertical"
          style={{ width: '80%', margin: 'auto' }}
          form={form}
          onFinish={onFinish}
        >
          <Form.Item
            style={{ marginTop: '30px' }}
            label="Nome"
            name="nome"
            extra={
              <div style={{ width: '100%', textAlign: 'left', marginTop: '5px' }}>
                <a onClick={() => history.push('/login')} style={{ color: '#1a73e8' }}>
                  Já possui uma conta?
                </a>
              </div>
            }
          >
            <Input placeholder="Digite seu nome" type="text" />
          </Form.Item>
          <Form.Item label="E-mail" name="email">
            <Input placeholder="Digite seu email" type="email" />
          </Form.Item>
          <Form.Item label="Senha" name="password">
            <Input placeholder="Digite sua senha" type="password" />
          </Form.Item>
          <Form.Item label="Matrícula" name="matricula">
            <Input placeholder="Digite sua matrícula:" type="number" />
          </Form.Item>
          <Form.Item label="Curso" name="curso">
            <Select
              loading={props.loading}
              placeholder="Selecione seu curso"
              style={{ textAlign: 'left' }}
            >
              {props.register.cursos.map((element: any) => (
                <Select.Option key={element.id} value={element.id}>
                  {element.nome}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item style={{ marginTop: '30px' }}>
            <Button type="primary" htmlType="submit">
              Registrar
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

interface IConnect {
  register: IRegisterState;
  loading: Loading;
}

export default connect(({ loading, register }: IConnect) => ({
  loading: loading.models.register,
  register,
}))(RegisterStudent);
