import React from 'react';
import './index.less';
import { history } from 'umi';
import { Form, Input, Select, Button } from 'antd';

const RegisterStudent = () => {
  const [form] = Form.useForm();

  return (
    <>
      <div className="Container">
        <h1 style={{ marginTop: '30px' }}>Entre com seus dados</h1>
        <Form layout="vertical" style={{ width: '80%', margin: 'auto' }} form={form}>
          <Form.Item
            style={{ marginTop: '80px' }}
            label="Name"
            extra={
              <div style={{ width: '100%', textAlign: 'left', margin: '5px' }}>
                <a onClick={() => history.push('/')} style={{ color: '#1a73e8' }}>
                  Já possui uma conta?
                </a>
              </div>
            }
          >
            <Input placeholder="Digite seu nome" type="text" />
          </Form.Item>
          <Form.Item label="Matrícula">
            <Input placeholder="Digite sua matrícula:" type="number" />
          </Form.Item>
          <Form.Item label="Curso" name="curso">
            <Select placeholder="Selecione seu curso" style={{ textAlign: 'left' }}>
              {['Ciência da Computação', 'Engenharia de Software'].map((element: any) => (
                <Select.Option key={element} value={element}>
                  {element}
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

export default RegisterStudent;
