import React, { Component } from 'react'
import { Row, Col, Table, Tag, Modal, List, Avatar, Select, notification } from 'antd'

import IconText from '../base/IconText'
import axios from '../../utils/axios'
import { formatDateID, rupiah } from '../../utils/helpers'

class ListHistory extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            recent: 'daily',
            page: 1,
            totalPage: 1,
            totalRows: 0,
            limit: 10,
            data: []
        }
    }

    componentDidMount() {
        this.fetchOrders()
    }

    changeRecentOrder(recent) {
        this.fetchOrders({ recent })
    }

    fetchOrders({ page = 1, recent = this.state.recent, limit = this.state.limit } = {}) {
        this.setState({ page, recent, limit, loading: true })
        return axios.get(`/api/checkout?limit=${limit}&recent=${recent}&page=${page}`)
            .then(({ data: { data } }) => {
                setTimeout(() => {
                    this.setState({
                        data: data.rows,
                        totalPage: data.totalPage,
                        totalRows: data.totalRows
                    })
                }, 500)
            })
            .catch(({ response }) => {
                notification.error({
                    message: `An error occured during fetching data ${response.data.message}`
                })
            })
            .finally(() => this.setState({ loading: false }))
    }

    handleRowClick(data) {
        Modal.info({
            style: { top: '20px' },
            title: `Detail Invoice #${data.receipt}`,
            width: 700,
            content: (
                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{ pageSize: 1 }}
                    dataSource={data.Orders}
                    footer={<span><strong>Amount:&nbsp;</strong>{rupiah(data.amount)}</span>}
                    renderItem={item => (
                        <List.Item
                            key={item.id}
                            actions={[
                                <IconText type="number" text={item.quantity} key="list-vertical-star-o" />,
                                <IconText type="dollar" text={rupiah(item.Product.price)} key="list-vertical-like-o" />,
                                <span><strong>Total:&nbsp;</strong>{rupiah(item.price)}</span>,
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar size={128} src={`${process.env.REACT_APP_API_BASEURL}/files/image/product/${item.Product.image}`} />}
                                title={<span>{item.Product.name}</span>}
                                description={item.Product.Category.name}
                            />
                            {item.Product.description}
                        </List.Item>
                    )}
                />
            )
        })
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
                title: 'Invoices',
                key: 'receipt',
                dataIndex: 'receipt',
                render: (text, record) => (
                    <span>#{record.receipt}</span>
                )
            },
            {
                title: 'User',
                key: 'user',
                dataIndex: 'User.name'
            },
            {
                title: 'Date',
                key: 'date',
                dataIndex: 'created_at',
                render: (text, record) => (
                    <span>{formatDateID(record.created_at)}</span>
                )
            },
            {
                title: 'Orders',
                key: 'orders',
                dataIndex: 'Orders',
                render: (text, record) => record.Orders.map(data => (
                    <Tag color="purple">{data.Product.name} (x{data.quantity})</Tag>
                ))
            },
            {
                title: 'Amount',
                key: 'amount',
                dataIndex: 'amount',
                render: (text, record) => (
                    <span>{rupiah(record.amount)}</span>
                )
            }
        ]
        return (
            <Row>
                <Col span={6} style={{ padding: '10px' }}>
                    <Select value={this.state.recent} style={{ width: '100%' }} onChange={value => this.changeRecentOrder(value)}>
                        <Select.Option value="daily">Daily</Select.Option>
                        <Select.Option value="weekly">Weekly</Select.Option>
                        <Select.Option value="monthly">Monthly</Select.Option>
                        <Select.Option value="yearly">Yearly</Select.Option>
                    </Select>
                </Col>
                <Col span={24} style={{ padding: '10px' }}>
                    <Table
                        loading={this.state.loading}
                        columns={columns}
                        dataSource={this.state.data.map((item, i) => ({
                            ...item,
                            key: i + 1
                        }))}
                        pagination={{
                            position: 'both',
                            pageSize: this.state.limit,
                            disabled: this.state.loading,
                            total: this.state.totalRows,
                            current: this.state.page,
                            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} orders`,
                            onChange: page => this.fetchOrders({ page })
                        }}
                        onRow={(record, rowIndex) => ({
                            onClick: () => this.handleRowClick(record)
                        })}
                    />
                </Col>
            </Row>
        )
    }
}

export default ListHistory