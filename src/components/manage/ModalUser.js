import React from 'react'
import { Modal, Row, Col, Input } from 'antd'

export default props => {
    let {
        name,
        email,
        password,        
    } = props

    const colStyle = { padding: '10px' }

    const data = {
        name,
        email,
        password,
        id: props.current
    }
    return (
        <Modal
            title={`${String(props.type).toUpperCase()} User`}
            style={{ top: 20 }}
            visible={props.visible}
            confirmLoading={props.loading}
            onOk={props.actions.handleOk.bind(this, { ...data }, props.type)}
            onCancel={props.actions.handleCancel.bind(this)}
        >
            <Row style={colStyle}>
                <Col span={6}><b>Name</b></Col>
                <Col span={18}>
                    <Input
                        value={name}
                        onChange={e => props.change.name(e.target.value)}
                        placeholder="Enter user name"
                    />
                </Col>
            </Row>
            <Row style={colStyle}>
                <Col span={6}><b>Email</b></Col>
                <Col span={18}>
                    <Input
                        value={email}
                        onChange={e => props.change.email(e.target.value)}
                        placeholder="Enter user email"
                    />
                </Col>
            </Row>
            <Row style={colStyle}>
                <Col span={6}><b>Password</b></Col>
                <Col span={18}>
                    <Input.Password
                        value={password}
                        onChange={e => props.change.password(e.target.value)}
                        placeholder="Enter user password"
                    />
                </Col>
            </Row>
        </Modal>
    )
}