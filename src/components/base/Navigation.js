import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { Layout, Menu, Icon, Button } from 'antd'
import { connect } from 'react-redux'

const { Sider } = Layout

const mapStateToProps = ({ auth }) => ({ isLoggedIn: auth.loggedIn })

const MenuNavigation = ({ isLoggedIn }) => {
    if (isLoggedIn) {
        return (
            <Menu defaultSelectedKeys={['0']} mode="inline" style={{ minHeight: '100vh' }}>
                <Menu.Item>
                    <NavLink to="/">
                        <Icon type="shop" />
                        <span>Dashboard</span>
                    </NavLink>
                </Menu.Item>
                <Menu.Item>
                    <NavLink to="/history">
                        <Icon type="credit-card" />
                        <span>History</span>
                    </NavLink>
                </Menu.Item>
                <Menu.Item>
                    <NavLink to="/manage">
                        <Icon type="ordered-list" />
                        <span>Manage Product</span>
                    </NavLink>
                </Menu.Item>
            </Menu>
        )
    }
    
    return (
        <Menu defaultSelectedKeys={['0']} mode="inline" style={{ minHeight: '100vh' }}>
            <Menu.Item>
                <NavLink to="/">
                    <Icon type="shop" />
                    <span>Dashboard</span>
                </NavLink>
            </Menu.Item>
        </Menu>
    )
}

class Navigation extends Component {

    constructor(props) {
        super(props)
        this.state = {
            collapsed: true
        }
    }

    toggleCollapse() {
        this.setState({ collapsed: !this.state.collapsed })
    }

    render() {
        return (
            <Sider collapsible style={{ background: '#fff' }} collapsed={this.state.collapsed} trigger={null}>
                <Button icon={ this.state.collapsed ? 'menu-unfold' : 'menu-fold' } size="large" type="primary" style={{ width: '100%' }} onClick={this.toggleCollapse.bind(this)} />
                <MenuNavigation isLoggedIn={this.props.isLoggedIn} />
            </Sider>
        )
    }
}

export default connect(mapStateToProps)(Navigation)