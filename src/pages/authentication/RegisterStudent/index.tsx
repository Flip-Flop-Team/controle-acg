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
        <Form
          layout="vertical"
          style={{ width: '80%', margin: 'auto' }}
          form={form}
          id="register_form"
        >
          <Form.Item
            rules={[{ required: true, message: 'Este campo é obrigatório' }]}
            name="nome"
            style={{ marginTop: '80px' }}
            label="Nome"
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
          <Form.Item
            name="matrícula"
            label="Matrícula"
            rules={[
              { required: true, message: 'Este campo é obrigatório' },
              { pattern: /^[0-9]*$/, message: 'Esse campo só aceita digitos numéricos' },
              { len: 6, message: 'Este campo deve ter exatamente 6 caracteres' },
            ]}
          >
            <Input placeholder="Digite sua matrícula:" />
          </Form.Item>
          <Form.Item
            label="Curso"
            name="curso"
            rules={[{ required: true, message: 'Este campo é obrigatório' }]}
          >
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
