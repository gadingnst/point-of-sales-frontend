import React, { useState } from 'react'
import { Modal, Row, Col, Input, Select, InputNumber } from 'antd'

export default props => {
    let {
        name,
        price,
        stock,
        category,
        description,
    } = props

    const colStyle = { padding: '10px' }
    const [image, setImage] = useState(null)
    const data = {
        name,
        price,
        stock,
        category,
        image,
        description: !!description.length ? description : 'No product description.',
        id: props.current
    }
    return (
        <Modal
            title={`${String(props.type).toUpperCase()} Product`}
            style={{ top: 20 }}
            visible={props.visible}
            confirmLoading={props.loading}
            onOk={props.actions.handleOk.bind(this, { ...data }, props.type)}
            onCancel={props.actions.handleCancel.bind(this)}
            afterClose={() => setImage(null)}
        >
            <Row style={colStyle}>
                <Col span={6}><b>Name</b></Col>
                <Col span={18}>
                    <Input
                        value={name}
                        onChange={e => props.change.name(e.target.value)}
                        placeholder="Enter product name"
                    />
                </Col>
            </Row>
            <Row style={colStyle}>
                <Col span={6}><b>Category</b></Col>
                <Col span={18}>
                    <Select value={category || 'disabled'} style={{ width: '100%' }} onChange={value => props.change.category(value)}>
                        <Select.Option disabled value="disabled">--Select Category--</Select.Option>
                        {
                            props.categories.map(item => (
                                <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                            ))
                        }
                    </Select>
                </Col>
            </Row>
            <Row style={colStyle}>
                <Col span={6}><b>Price</b></Col>
                <Col span={18}>
                    <InputNumber
                        style={{ width: '100%' }}
                        value={price}
                        onChange={value => props.change.price(value)}
                        placeholder="Enter product price"
                    />
                </Col>
            </Row>
            <Row style={colStyle}>
                <Col span={6}><b>Stock</b></Col>        
                <Col span={18}>
                    <InputNumber
                        style={{ width: '100%' }}
                        value={stock}
                        onChange={value => props.change.stock(value)}
                        placeholder="Enter product stock"
                    />
                </Col>
            </Row>
            <Row style={colStyle}>
                <Col span={6}><b>Description</b></Col>
                <Col span={18}>
                    <Input.TextArea
                        value={description}
                        onChange={e => props.change.description(e.target.value)}
                        placeholder="Enter product description"
                    />
                </Col>
            </Row>
            <Row>
                <Col span={6}><b>Image (optional)</b></Col>
                <Col span={18} style={{ ...colStyle, textAlign: 'right' }}>
                    <input accept="image/*" type="file" onChange={({ target: { files } }) => setImage(files[0])} />
                </Col>
            </Row>
        </Modal>
    )
}