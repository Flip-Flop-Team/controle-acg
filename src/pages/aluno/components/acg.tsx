import React from 'react';
import { Row, Col, Table, Button, Modal, Form, Card, Input, Select } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import DatePicker from '@/components/antd/DatePicker';
import { FormInstance } from 'antd/lib/form';
import { connect, Loading, Dispatch } from 'umi';
import dayjs from 'dayjs';
import { IProfessorState } from '../model';

interface AcgProps {
  aluno: IProfessorState;
  loading: boolean;
  dispatch: Dispatch;
}

interface IAcg {
  modalIsOpen: boolean;
  modalType: string;
  lancamento: Record<string, any>;
  deleteId: number | undefined;
  url: string;
  alunoId: number;
}

class Acg extends React.Component<AcgProps> {
  state: IAcg = {
    modalIsOpen: false,
    modalType: 'add',
    lancamento: {},
    deleteId: undefined,
    url: '/api/lancamento/',
    alunoId: JSON.parse(localStorage.getItem('session') || '').object.aluno,
  };

  formRef = React.createRef<FormInstance>();

  componentDidMount = () => {
    this.props.dispatch({
      type: 'aluno/get',
      payload: { url: this.state.url, field: 'lancamentos' },
    });
    this.props.dispatch({
      type: 'aluno/get',
      payload: { url: '/api/regra/', field: 'regras' },
    });
  };

  handleSubmit = (params: any) => {
    const newParams = {
      ...params,
      arquivo: 'teste.txt',
      data_inicio: params.data_inicio.format('YYYY-MM-DD'),
      data_fim: params.data_fim.format('YYYY-MM-DD'),
      aluno: this.state.alunoId,
    };
    if (this.state.modalType === 'add') {
      this.props.dispatch({
        type: 'aluno/create',
        payload: { data: newParams, url: this.state.url, field: 'lancamentos' },
      });
    } else {
      this.props.dispatch({
        type: 'aluno/edit',
        payload: {
          id: this.state.lancamento.id,
          data: newParams,
          url: this.state.url,
          field: 'lancamentos',
        },
      });
    }
    this.setState({ lancamento: {}, modalIsOpen: false });
  };

  render = () => {
    const columns = [
      {
        title: 'Regra',
        dataIndex: 'regra',
        key: 'regra',
        align: 'center',
        render: (value: any) => {
          if (!value) return '-';
          const regra = this.props.aluno.regras.filter((element: any) => element.id === value);
          if (regra.length > 0) return regra[0].nome;
          return '-';
        },
      },
      {
        title: 'Aprovado',
        dataIndex: 'aprovado',
        key: 'aprovado',
        align: 'center',
        render: (value: any) => {
          if (value === true) return <CheckOutlined />;
          if (value === false) return <CloseOutlined />;
          if (value === null) return <span style={{ fontWeight: 'bold' }}>?</span>;
          return '-';
        },
      },
      {
        title: 'Horas',
        dataIndex: 'carga_horaria_acg',
        key: 'carga_horaria_acg',
        align: 'center',
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
          return record.aprovado === null ? (
            <Row gutter={[24, 0]} justify="center">
              <Col>
                <EditOutlined
                  onClick={() => {
                    this.setState(
                      { modalIsOpen: true, modalType: 'edit', lancamento: record },
                      () => this.formRef.current?.resetFields(),
                    );
                  }}
                />
              </Col>
              <Col>
                <DeleteOutlined
                  onClick={() => {
                    this.setState({ deleteId: record.id });
                  }}
                />
              </Col>
            </Row>
          ) : null;
        },
      },
    ];

    return (
      <>
        <Card title="Lançamento">
          <Row>
            <Col span={24}>
              <Row justify="end" gutter={[24, 24]}>
                <Col>
                  <Button
                    onClick={() => {
                      this.setState(
                        {
                          modalIsOpen: true,
                          modalType: 'add',
                          lancamento: {},
                        },
                        () => this.formRef.current?.resetFields(),
                      );
                    }}
                    icon={<PlusOutlined />}
                  >
                    Adicionar lancamento
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row>
                <Col span={24}>
                  <Table
                    loading={this.props.loading}
                    size="small"
                    rowKey="id"
                    dataSource={this.props.aluno.lancamentos.filter((element: any) => {
                      return element.aluno === this.state.alunoId;
                    })}
                    columns={columns}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
        <Modal
          onCancel={() => this.setState({ deleteId: undefined })}
          visible={!!this.state.deleteId}
          cancelText="Cancelar"
          title="Deletar lançamento"
          onOk={() => {
            this.props
              .dispatch({
                type: 'aluno/remove',
                payload: { url: this.state.url, id: this.state.deleteId, field: 'lancamentos' },
              })
              .then(() => {
                this.setState({ deleteId: undefined });
              });
          }}
          confirmLoading={this.props.loading}
        >
          Tem certeza que deseja excluir o lancamento?
        </Modal>
        <Modal
          onCancel={() => {
            this.setState({ modalIsOpen: false });
          }}
          visible={this.state.modalIsOpen}
          cancelText="Cancelar"
          title={`${this.state.modalType === 'add' ? 'Adicionar' : 'Editar'} lancamento`}
          footer={
            <Row justify="space-between">
              <Button onClick={() => this.setState({ modalIsOpen: false })}>Cancelar</Button>
              <Button form="formulario" htmlType="submit">
                Salvar
              </Button>
            </Row>
          }
        >
          <Form
            id="formulario"
            ref={this.formRef}
            layout="vertical"
            initialValues={{
              ...this.state.lancamento,
              data_inicio:
                this.state.lancamento.data_inicio && this.state.modalType === 'edit'
                  ? dayjs(this.state.lancamento.data_inicio)
                  : undefined,
              data_fim:
                this.state.lancamento.data_fim && this.state.modalType === 'edit'
                  ? dayjs(this.state.lancamento.data_fim)
                  : undefined,
            }}
            onFinish={this.handleSubmit}
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
                    {this.props.aluno.regras.map((element: any) => (
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
              {this.state.modalType === 'edit' ? (
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
                    <Input.TextArea disabled style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              ) : null}
            </Row>
          </Form>
        </Modal>
      </>
    );
  };
}

interface IConnect {
  aluno: IProfessorState;
  loading: Loading;
}

export default connect(({ loading, aluno }: IConnect) => ({
  loading: loading.models.aluno,
  aluno,
}))(Acg);
