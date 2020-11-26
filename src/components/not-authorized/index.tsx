import React from 'react';
import { history } from 'umi';
import { Result, Button } from 'antd';

export default () => (
  <Result
    status="403"
    title="403"
    style={{
      background: 'none',
    }}
    subTitle="Desculpe, você não tem acesso a esta página."
    extra={
      <Button type="primary" onClick={() => history.goBack()}>
        Voltar
      </Button>
    }
  />
);
