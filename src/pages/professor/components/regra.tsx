import React from 'react';
import { Row, Col, Table, Button, Modal, Form, Card, Input, Select, Checkbox } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import { connect, Loading, Dispatch } from 'umi';
import { IProfessorState } from '../model';

interface RegraProps {
  professor: IProfessorState;
  loading: boolean;
  dispatch: Dispatch;
}

interface IRegra {
  modalIsOpen: boolean;
  modalType: string;
  regra: Record<string, any>;
  deleteId: number | undefined;
  url: string;
}

class Regra extends React.Component<RegraProps> {
  state: IRegra = {
    modalIsOpen: false,
    modalType: 'add',
    regra: {},
    deleteId: undefined,
    url: '/api/regra/',
  };

  formRef = React.createRef<FormInstance>();

  componentDidMount = () => {
    this.props.dispatch({
      type: 'professor/get',
      payload: { url: this.state.url, field: 'regras' },
    });
    this.props.dispatch({
      type: 'professor/get',
      payload: { url: '/api/curriculo/', field: 'curriculos' },
    });
    this.props.dispatch({
      type: 'professor/get',
      payload: { url: '/api/atividade/', field: 'atividades' },
    });
  };

  handleSubmit = (params: any) => {
    const newParams = params;
    if (params.ehHora === undefined) newParams.ehHora = false;
    if (!params.ehHora) {
      newParams.hora_praticada = 1;
    }
    if (this.state.modalType === 'add') {
      this.props.dispatch({
        type: 'professor/create',
        payload: { data: newParams, url: this.state.url, field: 'regras' },
      });
    } else {
      this.props.dispatch({
        type: 'professor/edit',
        payload: {
          id: this.state.regra.id,
          data: newParams,
          url: this.state.url,
          field: 'regras',
        },
      });
    }
    this.setState({ regra: {}, modalIsOpen: false });
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
        title: 'Atividade',
        dataIndex: 'atividade',
        key: 'atividade',
        align: 'center',
        render: (value: any) => {
          if (!value) return '-';
          const atividade = this.props.professor.atividades.filter(
            (element: any) => element.id === value,
          );
          if (atividade.length > 0) return atividade[0].nome;
          return '-';
        },
      },
      {
        title: 'Curriculo',
        dataIndex: 'curriculo',
        key: 'curriculo',
        align: 'center',
        render: (value: any) => {
          if (!value) return '-';
          const curriculo = this.props.professor.curriculos.filter(
            (element: any) => element.id === value,
          );
          if (curriculo.length > 0) return curriculo[0].codigo;
          return '-';
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
                <EditOutlined
                  onClick={() => {
                    this.setState({ modalIsOpen: true, modalType: 'edit', regra: record }, () =>
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
        <Card title="Regra">
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
                          regra: {},
                        },
                        () => this.formRef.current?.resetFields(),
                      );
                    }}
                    icon={<PlusOutlined />}
                  >
                    Adicionar regra
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
                    dataSource={this.props.professor.regras}
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
                payload: { url: this.state.url, id: this.state.deleteId, field: 'regras' },
              })
              .then(() => {
                this.setState({ deleteId: undefined });
              });
          }}
          confirmLoading={this.props.loading}
        >
          Tem certeza que deseja excluir o currículo?
        </Modal>
        <Modal
          onCancel={() => {
            this.setState({ modalIsOpen: false });
          }}
          visible={this.state.modalIsOpen}
          cancelText="Cancelar"
          title={`${this.state.modalType === 'add' ? 'Adicionar' : 'Editar'} regra`}
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
            initialValues={this.state.regra}
            onFinish={this.handleSubmit}
          >
            <Row justify="space-between">
              <Col span={24}>
                <Form.Item name="nome" label="Nome">
                  <Input style={{ width: '100%' }} />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item name="ehHora" valuePropName="checked">
                  <Checkbox onClick={() => this.forceUpdate()}>
                    Atividade baseada em horas exercidas?
                  </Checkbox>
                </Form.Item>
              </Col>
              {this.state.regra.ehHora ||
              (Object.keys(this.state.regra).length === 0 &&
                this.formRef.current?.getFieldValue('ehHora')) ? (
                <>
                  <Col span={11}>
                    <Form.Item
                      name="hora_praticada"
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
                  <Col
                    span={2}
                    style={{ textAlign: 'center', marginTop: '35px', fontWeight: 'bold' }}
                  >
                    :
                  </Col>
                  <Col span={11}>
                    <Form.Item
                      name="hora_acg"
                      label="Horas de Acg"
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
                </>
              ) : (
                <>
                  <Col span={24}>
                    <Form.Item
                      name="hora_acg"
                      label="Horas por evento"
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
                </>
              )}

              <Col span={24}>
                <Form.Item name="limite_hora_lancamento" label="Limite de horas">
                  <Input type="number" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="descricao"
                  label="Descrição"
                  rules={[
                    {
                      required: true,
                      message: 'Este campo é obrigatório.',
                    },
                  ]}
                >
                  <Input.TextArea />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="atividade"
                  label="Atividade"
                  rules={[
                    {
                      required: true,
                      message: 'Este campo é obrigatório.',
                    },
                  ]}
                >
                  <Select
                    loading={this.props.loading}
                    placeholder="Selecione a atividade"
                    style={{ textAlign: 'left' }}
                  >
                    {this.props.professor.atividades.map((element: any) => (
                      <Select.Option key={element.id} value={element.id}>
                        {element.nome}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="curriculo"
                  label="Curriculo"
                  rules={[
                    {
                      required: true,
                      message: 'Este campo é obrigatório.',
                    },
                  ]}
                >
                  <Select
                    loading={this.props.loading}
                    placeholder="Selecione o curriculo"
                    style={{ textAlign: 'left' }}
                  >
                    {this.props.professor.curriculos.map((element: any) => (
                      <Select.Option key={element.id} value={element.id}>
                        {element.codigo}
                      </Select.Option>
                    ))}
                  </Select>
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
}))(Regra);
