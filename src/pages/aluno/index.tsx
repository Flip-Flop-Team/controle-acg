import React, { useState } from 'react';
import { Menu, Row, Col } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import Acg from './components/acg';

const Aluno = () => {
  const [component] = useState<React.ReactNode>(<Acg />);
  return (
    <>
      <Row>
        <Col span={3}>
          <Menu
            style={{ width: '100%', height: '100vh', paddingTop: '20px' }}
            mode="inline"
            theme="dark"
            defaultSelectedKeys={['1']}
          >
            <Menu.Item key="1" icon={<FileTextOutlined />}>
              ACGs
            </Menu.Item>
          </Menu>
        </Col>
        <Col span={21}>{component}</Col>
      </Row>
    </>
  );
};

export default Aluno;
