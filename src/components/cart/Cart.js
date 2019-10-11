import React, { Component } from 'react'
import { Row, Col, Button, Drawer, Modal } from 'antd'
import { connect } from 'react-redux'

import axios from '../../utils/axios'
import { clearCart } from '../../redux/actions/cart'
import { setProduct } from '../../redux/actions/product'
import { rupiah } from '../../utils/helpers'

import CartList from './CartList'
import Checkout from './Checkout'
import ToggleCart from './ToggleCart'

const mapState = ({ cart, product, auth }) => ({
    products: product.data,
    carts: cart.data,
    isLoggedIn: auth.loggedIn
})

class Cart extends Component {

    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            loading: false,
            checkoutVisible: false,
            receipt: Date.now()
        }
    }

    onCheckout(data) {
        this.setState({ loading: true })
        axios.post('/api/checkout', data)
            .then(({ data: { data: res } }) => {
                res.orders.forEach(order => {
                    const idx = this.props.products.findIndex(product => product.id === order.product_id)
                    if (idx > -1) {
                        const products = [...this.props.products]
                        products[idx].stock = products[idx].stock - order.quantity
                        this.props.dispatch(setProduct(products))
                    }
                })
                Modal.success({
                    title: `Success Checkout!`,
                    content: (
                        <>
                            <p>Receipt: #{res.checkout.receipt}</p>
                            <p>Amount: {rupiah(res.checkout.amount)}</p>
                        </>
                    ),
                    onOk: () => {
                        this.props.dispatch(clearCart())
                        this.setState({
                            visible: false,
                            checkoutVisible: false,
                            receipt: Date.now()
                        })
                    }
                })
            })
            .catch(({ response }) => {
                Modal.error({
                    title: `Error: ${response.data.code} ${response.data.status}`,
                    content: response.data.message,
                })
            })
            .finally(() => {
                this.setState({ loading: false })
            })
    }

    render() {
        return (
            <>
                <Checkout
                    data={this.props.carts}
                    visible={this.state.checkoutVisible}
                    loading={this.state.loading}
                    receipt={String(this.state.receipt)}
                    onCancel={() => this.setState({ checkoutVisible: false })}
                    onCheckout={(data, amount) => this.onCheckout(data, amount)}
                />
                <ToggleCart
                    isLoggedIn={this.props.isLoggedIn}
                    countCart={this.props.carts.length}
                    onClick={() => this.setState({ visible: true })}
                />
                <Drawer
                    title={`My Cart | ${this.props.carts.length} product`}
                    placement="right"
                    width={435}
                    onClose={() => this.setState({ visible: false })}
                    visible={this.state.visible}
                >
                    <Row>
                        <Col span={24}>
                            <CartList />
                        </Col>
                        <Col span={24}>
                            <Row style={{ marginTop: '10px' }}>
                                <Col span={12}><b>Total:</b></Col>
                                <Col span={12} style={{ textAlign: 'right' }}><b>{rupiah(this.props.carts.reduce((acc, cur) => acc + cur.totalPrice, 0))}</b></Col>
                            </Row>
                            <span>*Belum termasuk PPN</span>
                            <Row style={{ marginTop: '10px' }}>
                                <Col span={8} style={{ padding: '5px' }}>
                                    <Button
                                        type="primary"
                                        style={{ width: '100%' }}
                                        disabled={!!!this.props.carts.length}
                                        onClick={() => this.setState({ checkoutVisible: true })}
                                    >
                                        Checkout
                                    </Button>
                                </Col>  
                                <Col span={8} style={{ padding: '5px' }}>
                                    <Button
                                        type="danger"
                                        style={{ width: '100%' }}
                                        disabled={!!!this.props.carts.length}
                                        onClick={() => this.props.dispatch(clearCart())}
                                    >
                                        Clear all cart
                                    </Button>
                                </Col>
                                <Col span={8} style={{ padding: '5px' }}>
                                    <Button
                                        type="default"
                                        style={{ width: '100%' }}
                                        onClick={() => this.setState({ visible: false })}
                                    >
                                        Close
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Drawer>
            </>
        )
    }

}

export default connect(mapState)(Cart)