import React, { Component } from 'react'
import { Result, Tabs } from 'antd'
import { connect } from 'react-redux'
import axios from '../utils/axios'
import IconText from '../components/base/IconText'
import ManageCatogory from '../components/manage/ManageCategory'
import ManageProduct from '../components/manage/ManageProduct'
import ManageUser from '../components/manage/ManageUser'

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
                <TabPane tab={<IconText type="shop" text="Products" />} key="products">
                    <ManageProduct
                        loading={this.state.loading}
                        data={this.state.products}
                        categories={this.state.categories}
                        onUpdate={products => this.setState({ products })}
                    />
                </TabPane>
                <TabPane tab={<IconText type="profile" text="Categories" />} key="categories">
                    <ManageCatogory
                        loading={this.state.loading}
                        data={this.state.categories}
                        onUpdate={categories => this.setState({ categories })}
                    />
                </TabPane>
                <TabPane tab={<IconText type="user" text="Users" />} key="users">
                    <ManageUser />
                </TabPane>
            </Tabs>
        )
    }
}

export default connect(mapState)(Manage)