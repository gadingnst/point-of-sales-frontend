import React from 'react'
import { Row, Col, Badge, Button } from 'antd'

export default props => {
    if (props.isLoggedIn && props.countCart > 0) {
        return (
            <Row style={{ position: 'fixed', bottom: '22.5px', zIndex: 1 }}>
                <Col span={24}>
                    <Badge count={props.countCart}>
                        <Button
                            style={{ width: '100%' }}
                            type="primary"
                            icon="shopping-cart"
                            size="large"
                            onClick={() => props.onClick()}
                        >
                            Cart
                        </Button>
                    </Badge>
                </Col>
            </Row>
        )
    }
    return false
}