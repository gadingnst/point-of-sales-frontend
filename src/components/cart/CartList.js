import React, { Component } from 'react'
import { Row, Col, Empty } from 'antd'
import { connect } from 'react-redux'
import CartItem from './CartItem'

const mapState = ({ cart }) => ({
    carts: cart.data
})

class CartList extends Component {
    render() {
        return (
            <Row style={{ height: '400px', overflowY: 'auto'  }}>
                <Col span={24}>
                {
                    !!!this.props.carts.length
                        ? <Empty style={{ marginTop: '35px' }} description="Cart is empty" />
                        : (this.props.carts.map((data, i) => (
                            <CartItem key={i} item={data} index={i} />
                        )))
                }
                </Col>
            </Row>
        )
    }
}

export default connect(mapState)(CartList)