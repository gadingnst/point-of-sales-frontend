import React from 'react'
import { Row, Col, Modal, Input } from 'antd'

export default props => (
    <Modal
        title={`${String(props.type).toUpperCase()} Category`}
        style={{ top: 20 }}
        visible={props.visible}
        confirmLoading={props.loading}
        onOk={props.actions.handleOk.bind(this, { name: props.name, id: props.current }, props.type)}
        onCancel={props.actions.handleCancel.bind(this)}
    >
        <Row style={{ padding: '10px' }}>
            <Col span={6}><b>Name</b></Col>
            <Col span={18}>
                <Input
                    value={props.name}
                    onChange={e => props.change.name(e.target.value)}
                    placeholder="Enter category name"
                />
            </Col>
        </Row>
    </Modal>
)