import React from 'react';
import { Row, Col, Card } from 'antd';
import { connect, Loading } from 'umi';
import { IProfessorState } from '../model';

// interface CurriculoProps {
//   professor: IProfessorState;
//   loading: boolean;
//   dispatch: Dispatch;
// }

const Acg = () => {
  return (
    <Card title="ACG" style={{ padding: '20px' }}>
      <Row>
        <Col>Acg</Col>
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
