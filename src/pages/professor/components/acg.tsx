import React from 'react';
import { Row, Col, Card, Tabs } from 'antd';
import { connect, Loading } from 'umi';
import AcgPendente from './acgPendente';
import AcgAprovadas from './acgAprovadas';
import AcgNegadas from './acgNegadas';
import { IProfessorState } from '../model';

const Acg = () => {
  return (
    <Card title="ACG" style={{ padding: '20px' }}>
      <Row>
        <Col span={24}>
          <Tabs>
            <Tabs.TabPane tab="Pendente" key="1">
              <AcgPendente />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Aprovadas" key="2">
              <AcgAprovadas />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Negadas" key="3">
              <AcgNegadas />
            </Tabs.TabPane>
          </Tabs>
        </Col>
      </Row>
    </Card>
  );
};

interface IConnect {
  professor: IProfessorState;
  loading: Loading;
}

export default connect(({ loading, professor }: IConnect) => ({
  loading: loading.models.professor,
  professor,
}))(Acg);
