export const addCart = data => ({
    type: 'ADD_CART',
    payload: data
})

export const removeCart = id => ({
    type: 'REMOVE_CART',
    payload: id
})

export const clearCart = () => ({
    type: 'CLEAR_CART'
})

export const setCartQty = (idx, qty) => ({
    type: 'SET_CART_QTY',
    payload: { idx, qty }
})

export const increaseCartQty = idx => ({
    type: 'INCREASE_CART_QTY',
    payload: idx
})

export const decreaseCartQty = idx => ({
    type: 'DECREASE_CART_QTY',
    payload: idx
})