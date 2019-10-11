import React, { Component } from 'react'
import { connect } from 'react-redux'
import { 
    Row,
    Col,
    Empty,
    Pagination,
    Input,
    Select,
    Radio,
    Tag,
    Spin
} from 'antd'

import { setProduct } from '../redux/actions/product'
import axios from '../utils/axios'
import ProductCard from '../components/product/ProductCard'

const { Search } = Input
const { Option } = Select
const sorting = ['Name', 'Category', 'Price', 'Created at', 'Updated at']

const mapState = ({ product }) => ({
    products: product.data
})

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            totalProducts: 0,
            totalPage: 0,
            limitProducts: 8,
            page: 1,
            search: '',
            sort: 'updatedat',
            order: 'desc',
            category: undefined,
            categories: []
        }
    }

    componentDidMount() {
        Promise.all([
            this.fetchProducts(),
            axios.get('/api/category')
                .then(({ data: { data } }) => data)
        ]).then(res => {
            this.setState({ categories: res[1], loading: false })
        })
    }

    fetchProducts(opts = {}) {
        const {
            search = this.state.search,
            category = this.state.category,
            sort = this.state.sort,
            order = this.state.order,
            page = 1
        } = opts
        
        this.setState({
            loading: true, category, sort,
            order, page, search
        })
        
        return new Promise((resolve, reject) => {
            axios.get(`/api/product?limit=${this.state.limitProducts}&page=${page}&sort=${sort}-${order}&search=${search}${category ? `&category=${category}` : ''}`)
                .then(({ data: { data } }) => {
                    setTimeout(() => {
                        this.props.dispatch(setProduct(data.rows.map(item => ({
                            ...item,
                            qty: 1,
                            totalPrice: item.price
                        }))))

                        this.setState({
                            loading: false,
                            totalPage: data.totalPage,
                            totalProducts: data.totalRows
                        })
                        resolve(data)
                    }, 800)
                })
                .catch(({ response }) => {
                    reject(response)
                })
        })
    }

    render() {
        const Tools = () => (
            <>
                <Select value={this.state.category || 'default'} onChange={val => this.fetchProducts({ category: val !== 'default' ? val : false })} loading={this.state.loading} style={{ width: 120, margin: '5px' }}>
                    <Option value="default">All Category</Option>
                    {
                        this.state.categories.map((data, i) => (
                            <Option key={i} value={data.id}>{data.name}</Option>
                        ))
                    }
                </Select>
                <Select value={this.state.sort || 'disabled'} style={{ width: 120, margin: '5px' }} onChange={sort => this.fetchProducts({ sort })} loading={this.state.loading}>
                    <Option value="disabled" disabled>--Sort By--</Option>
                    {
                        sorting.map((data, i) => (
                            <Option key={i} value={data.replace(/\s+/g, '').toLowerCase()}>{data}</Option>
                        ))
                    }
                </Select>
                <Search
                    placeholder="Search Products"
                    onSearch={search => this.fetchProducts({ search })}
                    style={{ width: 200, margin: '5px' }}
                />
                <Radio.Group value={this.state.order} onChange={e => this.fetchProducts({ order: e.target.value })}>
                    <Radio value="desc">DESC</Radio>
                    <Radio value="asc">ASC</Radio>
                </Radio.Group>
                {
                    !!!this.state.search.length || 
                    <Tag closable color="geekblue" onClose={() => this.fetchProducts({ search: '' })}>Search key: {this.state.search}</Tag>
                }
            </>
        )
        
        if (!!this.props.products.length) {
            return (
                <>
                    <Tools />
                    <Row>
                    {
                        this.props.products.map((data, i) => (
                            <Col key={i} style={{ padding: '5px' }} xs={24} sm={24} md={8} lg={6}>
                                <ProductCard
                                    key={i}
                                    data={data}
                                    loading={this.state.loading}
                                />
                            </Col>
                        ))
                    }
                    </Row>
                    <div style={{ marginTop: '25px', textAlign: 'right' }}>
                        <Pagination
                            disabled={this.state.loading}
                            current={this.state.page}
                            onChange={page => this.fetchProducts({ page })}
                            style={{ margin: 'auto' }}
                            total={this.state.totalProducts}
                            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} products`}
                            pageSize={this.state.limitProducts}
                        />
                    </div>
                </>
            )
        }
        return (
            <>
                <Tools />
                {
                    this.state.loading
                        ? <Row style={{ textAlign: 'center', marginTop: '135px' }}><Spin size="large" tip="Loading..." /></Row>
                        : <Empty style={{ marginTop: '135px' }} description="No Products available" />
                }
            </>
        )
    }
}

export default connect(mapState)(Home)