import React, { Component } from 'react'
import { Card, Tag, Tooltip, Button, notification } from 'antd'
import { connect } from 'react-redux'
import { rupiah } from '../../utils/helpers'
import { addCart, removeCart } from '../../redux/actions/cart'

const cardStyle = {
    width: '100%',
    margin: 'auto',
}

const mapStateToProps = ({ cart, auth }) => ({
    isLoggedIn: auth.loggedIn,
    carts: cart.data
})

notification.config({ duration: 1.25 })

class ProductCard extends Component {

    isExistsOnCart(data) {
        return this.props.carts.find(({ id }) => id === data.id)
    }

    addCart(data) {
        this.props.dispatch(addCart(data))
        notification.info({
            message: `Product ${data.name} was added to cart`
        })
    }

    removeCart(data) {
        this.props.dispatch(removeCart(data.id))
        notification.warning({
            message: `Product ${data.name} was removed to cart`
        })
    }

    render() {
        const { data } = this.props
        
        return (
            <Card
                style={{ ...cardStyle, height: this.props.loading ? '375px' : 'auto' }}
                loading={this.props.loading}
                actions={!!this.props.loading || [
                    <Tag color="purple">Stock: {data.stock}</Tag>,
                    <>
                        {this.props.isLoggedIn
                            ? (
                                <Tooltip title={this.isExistsOnCart(data) ? 'Remove from cart' : data.stock < 1 ? 'Out of stock' : 'Add to cart'}>
                                    <Button
                                        style={{ width: '50%' }}
                                        type={this.isExistsOnCart(data) ? 'danger' : data.stock < 1 ? 'dashed' : 'primary'}
                                        icon={this.isExistsOnCart(data) ? 'minus-circle' : data.stock < 1 ? 'stop' : 'shopping-cart'}
                                        onClick={
                                            this.isExistsOnCart(data)
                                                ? () => this.removeCart(data)
                                                : data.stock < 1 || this.props.loading
                                                    ? () => false
                                                    : () => this.addCart(data)
                                        }
                                    />
                                </Tooltip>
                            ) : (
                                <Tooltip title="You must login first!">
                                    <Button style={{ width: '50%' }} type="dashed" icon="stop" />
                                </Tooltip>
                            )
                        }
                    </>
                ]}
                cover={
                    !this.props.loading
                        ? <img style={{ width: '100%', height: '225px', objectFit: 'contain' }} alt={data.name} src={`${process.env.REACT_APP_API_BASEURL}/files/image/product/${data.image}`} />
                        : ''
                }
            >
                <Card.Meta
                    title={`${data.name} | ${data.Category ? data.Category.name : ''}`}
                    description={rupiah(data.price)}
                />
            </Card>
        )
    }
}

export default connect(mapStateToProps)(ProductCard)