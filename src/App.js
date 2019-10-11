import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Layout } from 'antd'

import Navigation from './components/base/Navigation'
import Header from './components/base/Header'
import Cart from './components/cart/Cart'

// views components
import Home from './views/Home'
import Manage from './views/Manage'
import History from './views/History'

export default class extends Component {
    render() {
        return (
            <BrowserRouter>
                <Layout style={{ minHeight: '100vh' }}>
                    <Navigation />
                    <Layout>
                        <Header />
                        <Layout.Content style={{  margin: '20px 24px', minHeight: 280 }}>
                            <Cart />
                            <Switch>
                                <Route exact path="/" component={Home} />
                                <Route path="/history" component={History} />
                                <Route path="/manage" component={Manage} />
                            </Switch>
                        </Layout.Content>
                    </Layout>
                </Layout>
            </BrowserRouter>
        )
    }
}