import React from 'react';
import { Row, Col, Table, Button, Modal, Form, Card, Input, Select } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import { connect, Loading, Dispatch } from 'umi';
import { IProfessorState } from '../model';

interface CurriculoProps {
  professor: IProfessorState;
  loading: boolean;
  dispatch: Dispatch;
}

interface ICurriculo {
  modalIsOpen: boolean;
  modalType: string;
  curriculo: Record<string, any>;
  deleteId: number | undefined;
  url: string;
}

class Curriculo extends React.Component<CurriculoProps> {
  state: ICurriculo = {
    modalIsOpen: false,
    modalType: 'add',
    curriculo: {},
    deleteId: undefined,
    url: '/api/curriculo/',
  };

  formRef = React.createRef<FormInstance>();

  componentDidMount = () => {
    this.props.dispatch({
      type: 'professor/get',
      payload: { url: this.state.url, field: 'curriculos' },
    });
    this.props.dispatch({
      type: 'professor/get',
      payload: { url: '/api/curso/', field: 'cursos' },
    });
  };

  handleSubmit = (params: any) => {
    if (this.state.modalType === 'add') {
      this.props.dispatch({
        type: 'professor/create',
        payload: { data: params, url: this.state.url, field: 'curriculos' },
      });
    } else {
      this.props.dispatch({
        type: 'professor/edit',
        payload: {
          id: this.state.curriculo.id,
          data: params,
          url: this.state.url,
          field: 'curriculos',
        },
      });
    }
    this.setState({ curriculo: {}, modalIsOpen: false });
  };

  render = () => {
    const columns = [
      {
        title: 'Carga horária (horas)',
        dataIndex: 'carga_horaria',
        key: 'carga_horaria',
        align: 'center',
      },
      {
        title: 'Código',
        dataIndex: 'codigo',
        key: 'codigo',
        align: 'center',
      },
      {
        title: 'Cursos',
        dataIndex: 'cursos',
        key: 'cursos',
        align: 'center',
        render: (value: any) => {
          if (value.length === 0) return '-';
          const cursos = this.props.professor.cursos
            .filter((element: any) => value.includes(element.id))
            .map((element: any) => element.nome);
          return cursos.join('\n ');
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
                    this.setState({ modalIsOpen: true, modalType: 'edit', curriculo: record }, () =>
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
        <Card title="Currículo">
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
                          curriculo: {},
                        },
                        () => this.formRef.current?.resetFields(),
                      );
                    }}
                    icon={<PlusOutlined />}
                  >
                    Adicionar currículo
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
                    dataSource={this.props.professor.curriculos}
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
                payload: { url: this.state.url, id: this.state.deleteId, field: 'curriculos' },
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
          title={`${this.state.modalType === 'add' ? 'Adicionar' : 'Editar'} currículo`}
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
            initialValues={this.state.curriculo}
            onFinish={this.handleSubmit}
          >
            <Row>
              <Col span={24}>
                <Form.Item
                  name="carga_horaria"
                  label="Carga horária"
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
              <Col span={24}>
                <Form.Item
                  name="codigo"
                  label="Código"
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
              <Col span={24}>
                <Form.Item
                  name="cursos"
                  label="Cursos"
                  rules={[
                    {
                      required: true,
                      message: 'Este campo é obrigatório.',
                    },
                  ]}
                >
                  <Select
                    loading={this.props.loading}
                    placeholder="Selecione os cursos"
                    style={{ textAlign: 'left' }}
                    mode="multiple"
                  >
                    {this.props.professor.cursos.map((element: any) => (
                      <Select.Option key={element.id} value={element.id}>
                        {element.nome}
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
}))(Curriculo);
