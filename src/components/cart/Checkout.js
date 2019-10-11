import React from 'react'
import { Row, Col, Button, Modal } from 'antd'
import { useSelector } from 'react-redux'
import { rupiah } from '../../utils/helpers'

export default props => {
    const checkoutPrice = props.data.reduce((acc, cur) => acc + cur.totalPrice, 0)
    const receipt = props.receipt
    const fee = checkoutPrice * 0.10
    const amount = checkoutPrice + fee
    const user = useSelector(({ auth }) => auth.user)
    const data = {
        amount,
        receipt,
        user_id: user.id,
        orders: props.data.map(item => ({
            product_id: item.id,
            quantity: item.qty,
            price: item.totalPrice
        })), 
    }

    return (
        <Modal
            title="Checkout"
            visible={props.visible}
            onCancel={() => props.onCancel()}
            style={{ top: 20 }}
            footer={[
                <Button key="back" onClick={() => props.onCancel()}>
                    Back
                </Button>,
                <Button key="submit" type="primary" loading={props.loading} onClick={() => props.onCheckout(data)}>
                    Checkout
                </Button>
            ]}
        >
            <Row style={{ marginBottom: 20 }}>
                <Col span={12}>
                    Cashier: <br /> <strong>{user.name}</strong>
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                    Receipt no: <br /> <strong>{`#${receipt}`}</strong>
                </Col>
            </Row>
            {props.data.map(item => (
                <Row key={item.id}>
                    <Col span={16}><b>{item.name}&nbsp;&nbsp;(x{item.qty})</b></Col>
                    <Col style={{ textAlign: 'right' }} span={8}><b>{rupiah(item.totalPrice)}</b></Col>
                </Row>
            ))}
            <Row style={{ marginTop: '10px', color: 'crimson' }}>
                <Col span={16}><b>PPN 10%</b></Col>
                <Col style={{ textAlign: 'right' }} span={8}><b>{rupiah(fee)}</b></Col>
            </Row>
            <hr />
            <Row>
                <Col span={16}><b>Amount:</b></Col>
                <Col style={{ textAlign: 'right' }} span={8}><b>{rupiah(amount)}</b></Col>
            </Row>
        </Modal>
    )
}