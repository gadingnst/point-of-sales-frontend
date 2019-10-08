import React, { Component } from 'react'
import { Row, Col, Button, Table, Popconfirm, Avatar, message } from 'antd'
import ModalInput from './ModalProduct'
import IconText from '../base/IconText'

import axios from '../../utils/axios'
import { rupiah } from '../../utils/helpers'

class ManageProduct extends Component {

    constructor(props) {
        super(props)
        this.state = {
            name: '',
            price: 0,
            stock: 1,
            category: '',
            description: '',
            current: '',
            modalLoading: false,
            modalVisible: false,
            modalType: 'create',
        }
    }

    openModal(type, data = {}) {
        this.setState({
            modalVisible: true,
            modalType: type,
            name: data.name || '',
            price: data.price || 0,
            stock: data.stock || 1,
            category: data.Category ? data.Category.id : '',
            description: data.description || '',
            current: data.id || ''
        })
    }

    addProduct(data) {
        const fd = new FormData()
        
        for (const key in data) {
            if (key === 'image' && data[key] !== null) {
                fd.append(key, data[key], data[key].name)
            } else if (key !== 'image') {
                fd.append(key, data[key])
            }
        }

        axios.post('/api/product', fd)
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

    updateProduct(data) {
        const fd = new FormData()
        for (const key in data) {
            if (key === 'image' && data[key] !== null) {
                fd.append(key, data[key], data[key].name)
            } else if (key !== 'image') {
                fd.append(key, data[key])
            }
        }

        axios.put(`/api/product/${data.id}`, fd)
            .then(({ data: { data: res } }) => {
                const products = [...this.props.data]
                const idx = products.findIndex(product => product.id === data.id)
                products[idx] = res
                this.props.onUpdate(products)
                this.setState({
                    modalLoading: false,
                    modalVisible: false
                })
                message.success('Success updating product !')
            })
            .catch(err => {
                this.setState({ modalLoading: false })
                message.error(err.response.data.message)
            })
    }

    deleteProduct(data) {
        const hide = message.loading('Deleting in progress..', 0)
        axios.delete(`/api/product/${data.id}`)
            .then(({ data: { data: res } }) => {
                hide()
                this.props.onUpdate(this.props.data.filter(item => item.id !== res.id))
                this.setState({
                    modalLoading: false,
                    modalVisible: false
                })
                message.success(`Success deleting product ${res.name}!`)
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
            this.addProduct(data)
        } else {
            this.updateProduct(data)
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
                title: 'Product Image',
                key: 'image',
                dataIndex: 'image',
                render: (text, record) => (
                    <Avatar
                        shape="square"
                        size={128}
                        src={`${process.env.REACT_APP_API_BASEURL}/files/image/product/${record.image}`}
                    />
                )
            },
            {
                title: 'Product Name',
                key: 'name',
                dataIndex: 'name'
            },
            {
                title: 'Category Name',
                key: 'category',
                dataIndex: 'Category.name'
            },
            {
                title: 'Stock',
                key: 'stock',
                dataIndex: 'stock'
            },
            {
                title: 'Price',
                key: 'price',
                dataIndex: 'price',
                render: (text, record) => rupiah(record.price)
            },
            {
                title: 'Description',
                key: 'description',
                dataIndex: 'description'
            },
            {
                title: 'Manage',
                key: 'manage',
                render: (text, record) => (
                    <span>
                        <IconText style={{ padding: 8 }} onClick={this.openModal.bind(this, 'update', record)} type="edit" text="Edit" color="#0000fe" />
                        <Popconfirm
                            title="Are you sure delete this product?"
                            onConfirm={this.deleteProduct.bind(this, record)}
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
                    current={this.state.current}
                    visible={this.state.modalVisible}
                    name={this.state.name}
                    price={this.state.price}
                    stock={this.state.stock}
                    category={this.state.category}
                    description={this.state.description}
                    categories={this.props.categories}
                    loading={this.state.modalLoading}
                    type={this.state.modalType}
                    change={{
                        name: name => this.setState({ name }),
                        price: price => this.setState({ price }),
                        stock: stock => this.setState({ stock }),
                        category: category => this.setState({ category }),
                        description: description => this.setState({ description })
                    }}
                    actions={{
                        handleOk: data => this.handleModalOk(data),
                        handleCancel: () => this.setState({ modalVisible: false })
                    }}
                />
                <Row>
                    <Col style={{ padding: '10px' }} span={24}>
                        <Button type="primary" onClick={this.openModal.bind(this, 'create')}>Add new Product</Button>
                    </Col>
                    <Col span={24} style={{ padding: '10px' }}>
                        <Table
                            loading={this.props.loading}
                            columns={columns}
                            pagination={{ position: 'both', pageSize: 8 }}
                            dataSource={this.props.data.map((item, i) => ({
                                ...item,
                                key: i + 1
                            }))}
                        />
                    </Col>
                </Row>
            </>
        )
    }
}

export default ManageProduct