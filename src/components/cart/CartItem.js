import React, { Component } from 'react'
import { Row, Col, Avatar, Button, InputNumber, notification } from 'antd'
import { connect } from 'react-redux'
import { setCartQty, increaseCartQty, decreaseCartQty, removeCart } from '../../redux/actions/cart'

import { rupiah } from '../../utils/helpers'

const mapState = ({ cart }) => ({ cart })

class CartItem extends Component {

    removeCart(data) {
        this.props.dispatch(removeCart(data.id))
        notification.warning({
            message: `Product ${data.name} was removed to cart`
        })
    }

    render() {
        const { item: data, index: i } = this.props
        return (
            <Row key={i} style={{ padding: '5px 0' }}>
                <Col span={6}>
                    <Avatar shape="square" size={86} src={`${process.env.REACT_APP_API_BASEURL}/files/image/product/${data.image}`} />
                </Col>
                <Col span={18}>
                    <h4>{data.name}</h4>
                    <Button type="danger" icon="minus-circle" onClick={() => this.props.dispatch(decreaseCartQty(i))} />
                    <InputNumber
                        style={{ width: '60px' }}
                        max={data.stock}
                        min={1}
                        value={data.qty}
                        defaultValue={data.qty}
                        onChange={num => this.props.dispatch(setCartQty(i, num))}
                    />
                    <Button type="primary" icon="plus-circle" onClick={() => this.props.dispatch(increaseCartQty(i))} />
                    <span style={{ marginLeft: '15px', fontWeight: 'bold' }}>{rupiah(data.totalPrice)}</span>
                    <Row style={{ textAlign: 'right' }}>
                        <Button type="danger" size="small" icon="close-circle" onClick={() => this.removeCart(data)}>Remove</Button>
                    </Row>
                </Col>
            </Row>
        )
    }
}

export default connect(mapState)(CartItem)