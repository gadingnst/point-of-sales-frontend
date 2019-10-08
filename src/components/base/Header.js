import React, { Component } from 'react'
import { Layout, Col, Row, Button, Modal, Icon, Input, Popconfirm, notification } from 'antd'
import { connect } from 'react-redux'
import { login, logout } from '../../redux/actions/auth'
import { clearCart } from '../../redux/actions/cart'

import axios from '../../utils/axios'

const mapStateToProps = ({ auth }) => ({ auth })

class Header extends Component {

    constructor(props) {
        super(props)
        this.state = {
            userEmail: '',
            userPassword: '',
            loginModal: false
        }
    }

    clearModal() {
        this.setState({
            userEmail: '',
            userPassword: '',
            loginModal: false
        })
    }

    async onLogin() {
        try {
            const { value: { data } } = await this.props.dispatch(login({
                email: this.state.userEmail,
                password: this.state.userPassword
            }))
            axios.defaults.headers.common['authorization'] = `Bearer ${data.token}`
            notification.success({ message: 'Success logged in' })
            this.clearModal()
        } catch ({ data: response }) {
            notification.error({ message: response.message })
            this.setState({ userPassword: '' })
        }
    }

    onLogout() {
        this.props.dispatch(logout())
        this.props.dispatch(clearCart())
        notification.warning({
            message: 'Logged out!'
        })
    }

    render() {
        return (
            <>
                <Modal
                    title="Login"
                    visible={this.state.loginModal}
                    onOk={() => this.onLogin()}
                    confirmLoading={this.props.auth.isLoading}
                    onCancel={() => this.setState({ loginModal: false })}
                    afterClose={this.clearModal.bind(this)}
                >
                    <Col span={24} style={{  padding: '10px' }}>
                        <Input
                            placeholder="Enter your email"
                            value={this.state.userEmail}
                            prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            onChange={e => this.setState({ userEmail: e.target.value })}
                        />
                    </Col>
                    <Col span={24} style={{  padding: '10px' }}>
                        <Input.Password
                            placeholder="Enter your password"
                            value={this.state.userPassword}
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            onChange={e => this.setState({ userPassword: e.target.value })}
                        />
                    </Col>
                </Modal>
                <Layout.Header style={{ background: '#fff', padding: '0 25px' }}>
                    <Row>
                        <Col xs={0} sm={12} md={18}>
                            <h2>Point of Sales App</h2>
                        </Col>
                        <Col xs={24} sm={12} md={6} style={{ textAlign: 'right' }}>
                        {
                            this.props.auth.loggedIn
                                ? (
                                    <Popconfirm onConfirm={() => this.onLogout()} title="Logout？" okText="Yes" cancelText="No">
                                        <Button type="ghost">Halo, {this.props.auth.user.name}</Button>
                                    </Popconfirm>
                                ) : (
                                    <>
                                        <Button onClick={() => this.setState({ loginModal: true })} style={{ margin: '0 5px' }}>Login</Button>
                                    </>
                                )
                        }
                        </Col>
                    </Row>
                </Layout.Header>
            </>
        )
    }
}

export default connect(mapStateToProps)(Header)