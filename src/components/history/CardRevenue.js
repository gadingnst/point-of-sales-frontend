import React from 'react'

export default props => (
    <div style={{
        width: '100%',
        padding: '10px',
        borderRadius: '8px',
        ...props.style
    }}>
        <h5>{props.title}</h5>
        <h1><b>{props.result}</b></h1>
        <h5>{props.subtitle}</h5>
    </div>
)