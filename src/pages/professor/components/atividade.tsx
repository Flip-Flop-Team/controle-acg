import React from 'react';
import { Row, Col, Table, Button, Modal, Form, Card, Input } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import { connect, Loading, Dispatch } from 'umi';
import { IProfessorState } from '../model';

interface AtividadeProps {
  professor: IProfessorState;
  loading: boolean;
  dispatch: Dispatch;
}

interface IAtividade {
  modalIsOpen: boolean;
  modalType: string;
  atividade: Record<string, any>;
  deleteId: number | undefined;
  url: string;
}

class Atividade extends React.Component<AtividadeProps> {
  state: IAtividade = {
    modalIsOpen: false,
    modalType: 'add',
    atividade: {},
    deleteId: undefined,
    url: '/api/atividade/',
  };

  formRef = React.createRef<FormInstance>();

  componentDidMount = () => {
    this.props.dispatch({
      type: 'professor/get',
      payload: { url: this.state.url, field: 'atividades' },
    });
  };

  handleSubmit = (params: any) => {
    if (this.state.modalType === 'add') {
      this.props.dispatch({
        type: 'professor/create',
        payload: { data: params, url: this.state.url, field: 'atividades' },
      });
    } else {
      this.props.dispatch({
        type: 'professor/edit',
        payload: {
          id: this.state.atividade.id,
          data: params,
          url: this.state.url,
          field: 'atividades',
        },
      });
    }
    this.setState({ atividade: {}, modalIsOpen: false });
  };

  render = () => {
    const columns = [
      {
        title: 'Nome',
        dataIndex: 'nome',
        key: 'nome',
        align: 'center',
      },
      {
        title: 'Limite horas',
        dataIndex: 'limite_hora',
        key: 'limite_hora',
        align: 'center',
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
                <EditOutlined
                  onClick={() => {
                    this.setState({ modalIsOpen: true, modalType: 'edit', atividade: record }, () =>
                      this.formRef.current?.resetFields(),
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
          );
        },
      },
    ];

    return (
      <>
        <Card title="Atividade">
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
                          atividade: {},
                        },
                        () => this.formRef.current?.resetFields(),
                      );
                    }}
                    icon={<PlusOutlined />}
                  >
                    Adicionar atividade
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
                    dataSource={this.props.professor.atividades}
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
          title="Deletar currículo"
          onOk={() => {
            this.props
              .dispatch({
                type: 'professor/remove',
                payload: { url: this.state.url, id: this.state.deleteId, field: 'atividades' },
              })
              .then(() => {
                this.setState({ deleteId: undefined });
              });
          }}
          confirmLoading={this.props.loading}
        >
          Tem certeza que deseja excluir a atividade?
        </Modal>
        <Modal
          onCancel={() => {
            this.setState({ modalIsOpen: false });
          }}
          visible={this.state.modalIsOpen}
          cancelText="Cancelar"
          title={`${this.state.modalType === 'add' ? 'Adicionar' : 'Editar'} atividade`}
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
            initialValues={this.state.atividade}
            onFinish={this.handleSubmit}
          >
            <Row>
              <Col span={24}>
                <Form.Item
                  name="nome"
                  label="Nome"
                  rules={[
                    {
                      required: true,
                      message: 'Este campo é obrigatório.',
                    },
                  ]}
                >
                  <Input style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="limite_hora"
                  label="Limite hora"
                  rules={[
                    {
                      required: true,
                      message: 'Este campo é obrigatório.',
                    },
                  ]}
                >
                  <Input type="number" style={{ width: '100%' }} />
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
}))(Atividade);
