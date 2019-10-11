import React, { Component } from 'react'
import Chart from 'react-apexcharts'
import { Col, Row, Select, notification } from 'antd'
import CardRevenue from './CardRevenue'
import axios from '../../utils/axios'
import { rupiah } from '../../utils/helpers'

class Statistic extends Component {

    constructor(props) {
        super(props)
        this.state = {
            mode: 'week',
            loadingRevenue: true,
            loadingRecent: true,
            totalRecentOrders: 0,
            totalRecentIncome: 0,
            totalLastOrders: 0,
            totalLastIncome: 0,
            options: {
                stroke: {
                    width: [5, 7, 5],
                    curve: 'straight',
                    dashArray: [0, 8, 5]
                },
                tooltip: {
                    y: [
                        {
                            formatter: val => rupiah(val),
                            title: {
                                formatter: val => `${val} Income`
                            }
                        },
                        {
                            formatter: val => rupiah(val),
                            title: {
                                formatter: val => `${val} Income`
                            }
                        }
                    ]
                },
                yaxis: {
                    labels: {
                        formatter: val => rupiah(val)
                    }
                },
                xaxis: {
                    categories: []
                }
            },
            series: [
                {
                    name: `This Week`,
                    data: []
                },
                {
                    name: `Last Week`,
                    data: []
                }
            ]
        }
    }

    componentDidMount() {
        this.fetchRevenue()
    }

    changeRevenueMode(mode) {
        this.setState({ mode })
        this.fetchRevenue(mode)
    }

    calculateImprovePerc(recent, last) {
        const percent = Number.parseInt(((recent - last) / last) * 100)
        return Number.isNaN(percent) ? `+0%` : `${percent < 0 ? '-' : '+'}${percent}%` 
    }

    fetchRevenue(mode = 'week') {
        this.setState({ loadingRevenue: true })
        axios.get(`/api/checkout/statistic?mode=${mode}`)
            .then(({ data: { data } }) => {
                this.setState({
                    totalLastOrders: data.last.reduce((acc, cur) => acc + cur.checkouts, 0),
                    totalLastIncome: data.last.reduce((acc, cur) => acc + cur.income, 0),
                    totalRecentOrders: data.recent.reduce((acc, cur) => acc + cur.checkouts, 0),
                    totalRecentIncome: data.recent.reduce((acc, cur) => acc + cur.income, 0),
                    options: {
                        ...this.state.options,
                        xaxis: {
                            categories: data.labels
                        }
                    },
                    series: [
                        {
                            name: 'This Week',
                            data: data.recent.map(item => item.income)
                        },
                        {
                            name: 'Last Week',
                            data: data.last.map(item => item.income)
                        }
                    ]
                })
            })
            .catch(({ response }) => {
                notification.error({
                    message: `An error occured while fetching revenue!: ${response.data.message}`
                })
            })
            .finally(() => this.setState({ loadingRevenue: false }))
    }

    render() {
        return (
            <>
                <Row>
                    <Col sm={24} md={8} style={{ padding: '10px' }}>
                        <CardRevenue
                            title="Today's income"
                            result="Rp. 1000000"
                            subtitle="Yesterday"
                            style={{
                                background: 'linear-gradient(285.38deg, #FBB2B4 30.05%, rgba(255, 143, 178, 0) 133.19%)',
                                boxShadow: '10px 15px 10px rgba(255, 143, 178, 0.25)'
                            }}
                        />
                    </Col>
                    <Col sm={24} md={8} style={{ padding: '10px' }}>
                        <CardRevenue
                            title={`This ${this.state.mode}'s Orders`}
                            result={`${this.state.totalRecentOrders} Orders`}
                            subtitle={`${this.calculateImprovePerc(this.state.totalRecentOrders, this.state.totalLastOrders)} last ${this.state.mode}`}
                            style={{
                                background: 'linear-gradient(285.38deg, #29DFFF 30.05%, rgba(41, 223, 255, 0) 133.19%)',
                                boxShadow: '10px 15px 10px rgba(41, 223, 255, 0.25)'
                            }}
                        />
                    </Col>
                    <Col sm={24} md={8} style={{ padding: '10px' }}>
                        <CardRevenue
                            title={`This ${this.state.mode}'s Income`}
                            result={rupiah(this.state.totalRecentIncome)}
                            subtitle={`${this.calculateImprovePerc(this.state.totalRecentIncome, this.state.totalLastIncome)} last ${this.state.mode}`}
                            style={{
                                background: 'linear-gradient(285.38deg, #AB84C8 30.05%, rgba(241, 201, 236, 0) 133.19%)',
                                boxShadow: '0px 15px 10px rgba(241, 201, 236, 0.25)'
                            }}
                        />
                    </Col>
                </Row>
                <div
                    id="chart"
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginTop: '45px',
                        boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.25)',
                        borderRadius: '8px'
                    }}
                >
                    <Row style={{ padding: '5px' }}>
                        <Col sm={12} md={20}>
                            <h1 style={{ fontSize: '18pt' }}><b>Revenue</b></h1>
                        </Col>
                        <Col sm={12} md={4}>
                            <Select value={this.state.mode} style={{ width: '100%' }} onChange={value => this.changeRevenueMode(value)}>
                                <Select.Option value="week">Weekly</Select.Option>
                                <Select.Option value="year">Yearly</Select.Option>
                            </Select>
                        </Col>
                    </Row>
                    <Chart
                        width="100%"
                        options={this.state.options}
                        series={this.state.series}
                        type="line"
                        height = "350"
                    />
                </div>
            </>
        )
    }
}

export default Statistic