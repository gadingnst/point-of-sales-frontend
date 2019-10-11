import React, { Component } from 'react'
import { Row, Col, Button, Table, Popconfirm, message } from 'antd'
import ModalInput from './ModalUser'
import IconText from '../../components/base/IconText'

import axios from '../../utils/axios'

class ManageUser extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            email: '',
            password: '',
            current: '',
            users: [],
            modalType: 'create',
            modalLoading: false,
            modalVisible: false,
            loading: true
        }
    }

    componentDidMount() {
        axios.get('/api/user')
            .then(({ data: { data } }) => {
                this.setState({ users: data })
            })
            .finally(() => this.setState({ loading: false }))
    }

    openModal(type, data) {
        this.setState({
            modalVisible: true,
            modalType: type,
            name: data.name || '',
            email: data.email || '',
            password: data.password || '',
            current: data.id || ''
        })
    }

    addUser(data) {
        axios.post('/api/user', data)
            .then(({ data: { data: res } }) => {
                this.setState({
                    users: [res, ...this.state.users],
                    modalLoading: false,
                    modalVisible: false
                })
                message.success(`Success add new user ${res.name}!`)
            })
            .catch(err => {
                this.setState({ modalLoading: false })
                message.error(err.response.data.message)
            })
    }

    deleteUser(data) {
        const hide = message.loading('Deleting in progress..', 0)
        axios.delete(`/api/user/${data.id}`)
            .then(({ data: { data: res } }) => {
                hide()
                this.setState({
                    users: this.state.users.filter(item => item.id !== res.id),
                    modalLoading: false,
                    modalVisible: false
                })
                message.success(`Success deleting user ${res.name}!`)
            })
            .catch(err => {
                hide()
                this.setState({ modalLoading: false })
                message.error(err.response.data.message)
            })
    }

    updateUser(data) {
        window.alert(data)
    }

    handleModalOk(data) {
        this.setState({ modalLoading: true })
        if (this.state.modalType === 'create') {
            this.addUser(data)
        } else {
            this.updateUser(data)
        }
    }

    render() {
        const columns = [
            {
                title: 'No.',
                key: 'id',
                dataIndex: 'id',
                render: (text, record) => (
                    <span>{record.key}</span>
                )
            },
            {
                title: 'Name',
                key: 'name',
                dataIndex: 'name'
            },
            {
                title: 'Email',
                key: 'email',
                dataIndex: 'email'
            },
            {
                title: 'Manage',
                key: 'manage',
                render: (text, record) => (
                    <span>
                        <IconText style={{ padding: 8 }} onClick={this.openModal.bind(this, 'update', record)} type="edit" text="Edit" color="#0000fe" />
                        <Popconfirm
                            title="Are you sure delete this category?"
                            onConfirm={this.deleteUser.bind(this, record)}
                            okText="Delete"
                            cancelText="No"
                        >
                            <IconText style={{ padding: 8 }} type="delete" text="Delete" color="crimson" />
                        </Popconfirm>
                    </span>
                )
            }
        ]
        return (
            <>
                <ModalInput
                    name={this.state.name}
                    email={this.state.email}
                    password={this.state.password}
                    current={this.state.current}
                    visible={this.state.modalVisible}
                    loading={this.state.modalLoading}
                    type={this.state.modalType}
                    change={{
                        name: name => this.setState({ name }),
                        email: email => this.setState({ email }),
                        password: password => this.setState({ password }),
                    }}
                    actions={{
                        handleOk: data => this.handleModalOk(data),
                        handleCancel: () => this.setState({ modalVisible: false })
                    }}
                />
                <Row>
                    <Col style={{ padding: '10px' }} span={24}>
                        <Button type="primary" onClick={this.openModal.bind(this, 'create')}>Add new User</Button>
                    </Col>
                    <Col span={24} style={{ padding: '10px' }}>
                        <Table
                            columns={columns}
                            loading={this.state.loading}
                            pagination={{ position: 'both', pageSize: 8 }}
                            dataSource={this.state.users.map((item, i) => ({ ...item, key: i + 1 }))}
                        />
                    </Col>
                </Row>
            </>
        )
    }

}

export default ManageUser