import React from 'react';
import { Row, Col, Table, Button, Modal, Form, Card, Input, Select } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import { connect, Loading, Dispatch } from 'umi';
import { IProfessorState } from '../model';

interface CursoProps {
  professor: IProfessorState;
  loading: boolean;
  dispatch: Dispatch;
}

interface ICurso {
  modalIsOpen: boolean;
  modalType: string;
  curso: Record<string, any>;
  deleteId: number | undefined;
  url: string;
}

class Curso extends React.Component<CursoProps> {
  state: ICurso = {
    modalIsOpen: false,
    modalType: 'add',
    curso: {},
    deleteId: undefined,
    url: '/api/curso/',
  };

  formRef = React.createRef<FormInstance>();

  componentDidMount = () => {
    this.props.dispatch({
      type: 'professor/get',
      payload: { url: this.state.url, field: 'cursos' },
    });
    this.props.dispatch({
      type: 'professor/get',
      payload: { url: '/api/curriculo/', field: 'curriculos' },
    });
  };

  handleSubmit = (params: any) => {
    if (this.state.modalType === 'add') {
      this.props.dispatch({
        type: 'professor/create',
        payload: { data: params, url: this.state.url, field: 'cursos' },
      });
    } else {
      this.props.dispatch({
        type: 'professor/edit',
        payload: {
          id: this.state.curso.id,
          data: params,
          url: this.state.url,
          field: 'cursos',
        },
      });
    }
    this.setState({ curso: {}, modalIsOpen: false });
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
        title: 'Código',
        dataIndex: 'codigo',
        key: 'codigo',
        align: 'center',
      },
      {
        title: 'Curriculos',
        dataIndex: 'curriculos',
        key: 'curriculos',
        align: 'center',
        render: (value: any) => {
          if (value.length === 0) return '-';
          const cursos = this.props.professor.curriculos
            .filter((element: any) => value.includes(element.id))
            .map((element: any) => element.codigo);
          return cursos.join(', ');
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
                    this.setState({ modalIsOpen: true, modalType: 'edit', curso: record }, () =>
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
                          curso: {},
                        },
                        () => this.formRef.current?.resetFields(),
                      );
                    }}
                    icon={<PlusOutlined />}
                  >
                    Adicionar curso
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
                    dataSource={this.props.professor.cursos}
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
                payload: { url: this.state.url, id: this.state.deleteId, field: 'cursos' },
              })
              .then(() => {
                this.setState({ deleteId: undefined });
              });
          }}
          confirmLoading={this.props.loading}
        >
          Tem certeza que deseja excluir o curso?
        </Modal>
        <Modal
          onCancel={() => {
            this.setState({ modalIsOpen: false });
          }}
          visible={this.state.modalIsOpen}
          cancelText="Cancelar"
          title={`${this.state.modalType === 'add' ? 'Adicionar' : 'Editar'} curso`}
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
            initialValues={this.state.curso}
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
                  name="curriculos"
                  label="Curriculos"
                  rules={[
                    {
                      required: true,
                      message: 'Este campo é obrigatório.',
                    },
                  ]}
                >
                  <Select
                    loading={this.props.loading}
                    placeholder="Selecione os curriculos"
                    style={{ textAlign: 'left' }}
                    mode="multiple"
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
}))(Curso);
