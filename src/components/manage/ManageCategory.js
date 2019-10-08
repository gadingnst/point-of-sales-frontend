import React, { Component } from 'react'
import { Row, Col, Button, Table, Popconfirm, message } from 'antd'
import ModalInput from './ModalCategory'
import IconText from '../../components/base/IconText'

import axios from '../../utils/axios'

class ManageCategory extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            current: '',
            modalType: 'create',
            modalLoading: false,
            modalVisible: false
        }
    }

    openModal(type, data) {
        this.setState({
            modalVisible: true,
            modalType: type,
            name: data.name || '',
            current: data.id || ''
        })
    }

    addCategory(data) {
        axios.post('/api/category', data)
            .then(({ data: { data: res } }) => {
                this.props.onUpdate([res, ...this.props.data])
                this.setState({
                    modalLoading: false,
                    modalVisible: false
                })
                message.success(`Success add new category ${res.name}!`)
            })
            .catch(err => {
                this.setState({ modalLoading: false })
                message.error(err.response.data.message)
            })
    }

    updateCategory(data) {
        axios.put(`/api/category/${data.id}`, data)
            .then(({ data: { data: res } }) => {
                const categories = [...this.props.data]
                const idx = categories.findIndex(cat => cat.id === data.id)
                categories[idx] = res
                this.props.onUpdate(categories)
                this.setState({
                    modalLoading: false,
                    modalVisible: false
                })
                message.success('Success updating category')
            })
            .catch(err => {
                this.setState({ modalLoading: false })
                message.error(err.response.data.message)
            })
    }

    deleteCategory(data) {
        const hide = message.loading('Deleting in progress..', 0)
        axios.delete(`/api/category/${data.id}`)
            .then(({ data: { data: res } }) => {
                hide()
                this.props.onUpdate(this.props.data.filter(item => item.id !== res.id))
                this.setState({
                    modalLoading: false,
                    modalVisible: false
                })
                message.success(`Success deleting category ${res.name}!`)
            })
            .catch(err => {
                hide()
                this.setState({ modalLoading: false })
                message.error(err.response.data.message)
            })
    }

    handleModalOk(data) {
        this.setState({ modalLoading: true })
        if (this.state.modalType === 'create') {
            this.addCategory(data)
        } else {
            this.updateCategory(data)
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
                title: 'Category Name',
                key: 'name',
                dataIndex: 'name'
            },
            {
                title: 'Manage',
                key: 'manage',
                render: (text, record) => (
                    <span>
                        <IconText style={{ padding: 8 }} onClick={this.openModal.bind(this, 'update', record)} type="edit" text="Edit" color="#0000fe" />
                        <Popconfirm
                            title="Are you sure delete this category?"
                            onConfirm={this.deleteCategory.bind(this, record)}
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
                    current={this.state.current}
                    visible={this.state.modalVisible}
                    loading={this.state.modalLoading}
                    type={this.state.modalType}
                    change={{
                        name: name => this.setState({ name })
                    }}
                    actions={{
                        handleOk: data => this.handleModalOk(data),
                        handleCancel: () => this.setState({ modalVisible: false })
                    }}
                />
                <Row>
                    <Col style={{ padding: '10px' }} span={24}>
                        <Button type="primary" onClick={this.openModal.bind(this, 'create')}>Add new Category</Button>
                    </Col>
                    <Col span={24} style={{ padding: '10px' }}>
                        <Table
                            columns={columns}
                            loading={this.props.loading}
                            pagination={{ position: 'both', pageSize: 8 }}
                            dataSource={this.props.data.map((item, i) => ({ ...item, key: i + 1 }))}
                        />
                    </Col>
                </Row>
            </>
        )
    }

}

export default ManageCategory