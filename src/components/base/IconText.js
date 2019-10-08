import React from 'react'
import { Icon } from 'antd'

export default ({ type, style, text, color, onClick = () => false }) => (
    <span style={{ ...style, cursor: 'pointer' }} onClick={event => onClick(event)}>
        <Icon type={type} style={{ color, marginRight: 8 }} />
        {text}
    </span>
)