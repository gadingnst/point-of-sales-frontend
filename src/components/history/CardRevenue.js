import React from 'react'
import IconText from '../base/IconText'

export default props => (
    <div style={{
        width: '100%',
        padding: '10px',
        borderRadius: '8px',
        ...props.style
    }}>
        <h5>{props.title}</h5>
        {
            props.loading
                ? (
                    <>
                        <h1><IconText type="loading" text="Loading..." /></h1>
                        <h5><IconText type="loading" text="Loading..." /></h5>
                    </>
                )
                : (
                    <>
                        <h1><b>{props.result}</b></h1>
                        <h5>{props.subtitle}</h5>
                    </>
                )
        }
    </div>
)