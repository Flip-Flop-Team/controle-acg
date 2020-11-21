import React, { useState } from 'react';

import './index.less';

import { Form, Input, Select } from 'antd';

const RegisterStudent = () => {
  const [form] = Form.useForm();
  const [curso, setCurso] = useState(false);

  return (
    <>
      <div className="Container">
        <h1 style={{ marginTop: '30px' }}>Entre com seus dados</h1>
        <Form layout="vertical" style={{ width: '80%', margin: 'auto' }} form={form}>
          <Form.Item style={{ marginTop: '90px' }} label="Name">
            <Input placeholder="Digite seu nome" type="text" />
          </Form.Item>
          <Form.Item style={{ marginTop: '45px' }} label="Matrícula">
            <Input placeholder="Digite sua matrícula:" type="number" />
          </Form.Item>
          <Form.Item name="curso">
            <Select onChange={() => setCurso(true)} placeholder="Selecione seu curso">
              {['Ciência da Computação', 'Engenharia de Software'].map((element: any) => (
                <Select.Option key={element} value={element}>
                  {element}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Select
              showSearch
              allowClear
              disabled={!curso}
              filterOption={(input, option: any) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              placeholder="Selecione seu curso"
            >
              {[321312, 1231.1].map((element: any) => (
                <Select.Option key={element} value={element}>
                  {element}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default RegisterStudent;
