import React, { ReactNode, useState } from 'react';
import { Menu, Row, Col } from 'antd';
import { connect, Loading } from 'umi';
import {
  CheckOutlined,
  FileTextOutlined,
  FormOutlined,
  AppstoreAddOutlined,
  FolderAddOutlined,
} from '@ant-design/icons';
import Acg from './components/acg';
import Curriculo from './components/curriculo';
import Atividade from './components/atividade';
import Curso from './components/curso';
import { IProfessorState } from './model';
import Regra from './components/regra';

const Professor = () => {
  const [components] = useState<Record<string, React.ReactNode>>({
    '1': <Acg />,
    '2': <Curriculo />,
    '3': <Curso />,
    '4': <Regra />,
    '5': <Atividade />,
  });
  const [component, setComponent] = useState<ReactNode>(<Acg />);
  return (
    <>
      <Row>
        <Col xl={4} lg={6}>
          <Menu
            style={{ width: '100%', height: '100vh', paddingTop: '20px' }}
            mode="inline"
            theme="dark"
            onClick={(e: any) => setComponent(components[e.key])}
            defaultSelectedKeys={['1']}
          >
            <Menu.Item key="1" icon={<CheckOutlined />}>
              Aprovação de ACG
            </Menu.Item>
            <Menu.Item key="2" icon={<FileTextOutlined />}>
              Cadastro de currículo
            </Menu.Item>
            <Menu.Item key="3" icon={<AppstoreAddOutlined />}>
              Cadastro de curso
            </Menu.Item>
            <Menu.Item key="4" icon={<FormOutlined />}>
              Cadastro regras ACG
            </Menu.Item>
            <Menu.Item key="5" icon={<FolderAddOutlined />}>
              Cadastro atividades
            </Menu.Item>
          </Menu>
        </Col>
        <Col xl={20} lg={18}>
          {component}
        </Col>
      </Row>
    </>
  );
};

interface IConnect {
  professor: IProfessorState;
  loading: Loading;
}

export default connect(({ loading, professor }: IConnect) => ({
  loading: loading.models.professor,
  professor,
}))(Professor);
