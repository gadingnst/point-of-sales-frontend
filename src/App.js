import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Layout } from 'antd'

import Navigation from './components/Navigation'
import Header from './components/Header'

export default class extends Component {
    render() {
        return (
            <BrowserRouter>
                <Layout style={{ minHeight: '100vh' }}>
                    <Navigation />
                    <Layout>
                        <Header />
                        <Layout.Content style={{  margin: '20px 24px', minHeight: 280 }}>
                            <h2>Hello World</h2>
                        </Layout.Content>
                    </Layout>
                </Layout>
            </BrowserRouter>
        )
    }
}