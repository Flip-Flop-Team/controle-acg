import React from 'react';
import { Row, Col, Table, Button, Modal, Form, Input, Select } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import DatePicker from '@/components/antd/DatePicker';
import { FormInstance } from 'antd/lib/form';
import { connect, Loading, Dispatch } from 'umi';
import dayjs from 'dayjs';
import { IProfessorState } from '../model';

interface AcgProps {
  professor: IProfessorState;
  loading: boolean;
  dispatch: Dispatch;
}

interface IAcg {
  modalIsOpen: boolean;
  lancamento: Record<string, any>;
  url: string;
}

class AcgNegadas extends React.Component<AcgProps> {
  state: IAcg = {
    modalIsOpen: false,
    lancamento: {},
    url: '/api/lancamento/',
  };

  formRef = React.createRef<FormInstance>();

  componentDidMount = () => {
    this.props.dispatch({
      type: 'professor/get',
      payload: { url: this.state.url, field: 'lancamentos' },
    });
    this.props.dispatch({
      type: 'professor/get',
      payload: { url: '/api/regra/', field: 'regras' },
    });
    this.props.dispatch({
      type: 'professor/get',
      payload: { url: '/api/aluno/', field: 'alunos' },
    });
  };

  render = () => {
    const columns = [
      {
        title: 'Aluno',
        dataIndex: 'aluno',
        key: 'aluno',
        align: 'center',
        render: (value: any) => {
          if (!value) return '-';
          const aluno = this.props.professor.alunos.filter((element: any) => element.id === value);
          return aluno.length > 0 ? aluno[0].nome : '-';
        },
      },
      {
        title: 'Regra',
        dataIndex: 'regra',
        key: 'regra',
        align: 'center',
        render: (value: any) => {
          if (!value) return '-';
          const regra = this.props.professor.regras.filter((element: any) => element.id === value);
          if (regra.length > 0) return regra[0].nome;
          return '-';
        },
      },
      {
        title: 'Data lançamento',
        dataIndex: 'created_at',
        key: 'created_at',
        align: 'center',
        render: (value: any) => {
          const newValue = value.split('.')[0].split('T');
          newValue[0] = newValue[0].split('-').reverse().join('/');
          return newValue.join(' ');
        },
      },
      {
        title: 'Ações',
        dataIndex: 'acao',
        key: 'acoes',
        align: 'center',
        render: (_: any, record: any) => {
          return (
            <Row gutter={[24, 0]} justify="center">
              <Col>
                <InfoCircleOutlined
                  onClick={() => {
                    this.setState({ modalIsOpen: true, lancamento: record }, () =>
                      this.formRef.current?.resetFields(),
                    );
                  }}
                />
              </Col>
            </Row>
          );
        },
      },
    ];

    return (
      <>
        <Row>
          <Col span={24}>
            <Row>
              <Col span={24}>
                <Table
                  loading={this.props.loading}
                  size="small"
                  rowKey="id"
                  dataSource={this.props.professor.lancamentos.filter(
                    (element: any) => element.aprovado === false,
                  )}
                  columns={columns}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Modal
          onCancel={() => {
            this.setState({ modalIsOpen: false });
          }}
          visible={this.state.modalIsOpen}
          cancelText="Cancelar"
          title="Julgar lancamento"
          footer={
            <Row justify="start">
              <Col>
                <Button onClick={() => this.setState({ modalIsOpen: false })}>Cancelar</Button>
              </Col>
            </Row>
          }
        >
          <Form
            id="formulario"
            ref={this.formRef}
            layout="vertical"
            initialValues={{
              ...this.state.lancamento,
              data_inicio: dayjs(this.state.lancamento.data_inicio),
              data_fim: dayjs(this.state.lancamento.data_fim),
            }}
          >
            <Row justify="space-between">
              <Col span={24}>
                <Form.Item
                  name="regra"
                  label="Regra"
                  rules={[
                    {
                      required: true,
                      message: 'Este campo é obrigatório.',
                    },
                  ]}
                >
                  <Select
                    loading={this.props.loading}
                    placeholder="Selecione a regra"
                    style={{ textAlign: 'left' }}
                  >
                    {this.props.professor.regras.map((element: any) => (
                      <Select.Option key={element.id} value={element.id}>
                        {element.nome}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item
                  name="data_inicio"
                  label="Data de início"
                  rules={[
                    {
                      required: true,
                      message: 'Este campo é obrigatório.',
                    },
                  ]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item
                  name="data_fim"
                  label="Data de fim"
                  rules={[
                    {
                      required: true,
                      message: 'Este campo é obrigatório.',
                    },
                  ]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item
                  name="carga_horaria_real"
                  label="Horas exercidas"
                  rules={[
                    {
                      required: true,
                      message: 'Este campo é obrigatório.',
                    },
                  ]}
                >
                  <Input type="number" />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item
                  name="carga_horaria_acg"
                  label="Horas ACG"
                  rules={[
                    {
                      required: true,
                      message: 'Este campo é obrigatório.',
                    },
                  ]}
                >
                  <Input type="number" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="descricao"
                  label="Descricao"
                  rules={[
                    {
                      required: true,
                      message: 'Este campo é obrigatório.',
                    },
                  ]}
                >
                  <Input.TextArea
                    style={{ width: '100%' }}
                    placeholder="Escreva aqui informações extras ou recado para o professor"
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="comentario"
                  label="Comentário do professor"
                  rules={[
                    {
                      required: true,
                      message: 'Este campo é obrigatório.',
                    },
                  ]}
                >
                  <Input.TextArea
                    style={{ width: '100%' }}
                    placeholder="Escreva aqui um comentário para o aluno"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </>
    );
  };
}

interface IConnect {
  professor: IProfessorState;
  loading: Loading;
}

export default connect(({ loading, professor }: IConnect) => ({
  loading: loading.models.professor,
  professor,
}))(AcgNegadas);
