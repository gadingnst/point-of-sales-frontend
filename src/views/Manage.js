import React, { Component } from 'react'
import { Result, Tabs, Icon } from 'antd'
import { connect } from 'react-redux'

import axios from '../utils/axios'

import ManageCatogory from '../components/manage/ManageCategory'
import ManageProduct from '../components/manage/ManageProduct'

const { TabPane } = Tabs

const mapState = ({ auth }) => ({
    isLoggedIn: auth.loggedIn
})

class Manage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            products: [],
            categories: []
        }
    }

    componentDidMount() {
        Promise.all([
            axios.get('/api/product')
                .then(({ data: { data } }) => data),
            axios.get('/api/category')
                .then(({ data: { data } }) => data)
        ]).then(([{ rows: products }, categories]) => {
            this.setState({ products, categories, loading: false })
        })
    }

    render() {
        if (!this.props.isLoggedIn) {
            return (
                <Result
                    status="403"
                    title="403"
                    subTitle="Sorry, you are not authorized to access this page."
                />
            )
        }
        return (
            <Tabs defaultActiveKey="products" style={{ background: '#FFF' }}>
                <TabPane tab={<span><Icon type="shop" />Products</span>} key="products">
                    <ManageProduct
                        loading={this.state.loading}
                        data={this.state.products}
                        onUpdate={products => this.setState({ products })}
                    />
                </TabPane>
                <TabPane tab={<span><Icon type="profile" />Categories</span>} key="categories">
                    <ManageCatogory
                        loading={this.state.loading}
                        data={this.state.categories}
                        onUpdate={categories => this.setState({ categories })}
                    />
                </TabPane>
            </Tabs>
        )
    }
}

export default connect(mapState)(Manage)