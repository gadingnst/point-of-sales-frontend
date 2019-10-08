const initial = {
    data: []
}

export default (state = initial, action) => {
    let index, carts, value

    switch (action.type) {
        case 'ADD_CART': 
            return {
                ...state,
                data: [...state.data, action.payload]
            }
        case 'REMOVE_CART':
            return {
                ...state,
                data: state.data.filter(cart => cart.id !== action.payload)
            }
        case 'SET_CART_QTY':
            carts = [...state.data]
            index = action.payload.idx
            value = action.payload.qty
            if (value <= carts[index].stock && value > 0) {
                carts[index].qty = value
                carts[index].totalPrice = carts[index].price * value
                return { ...state, data: carts }
            }
            return state
        case 'INCREASE_CART_QTY':
            carts = [...state.data]
            index = action.payload
            if (carts[index].qty < carts[index].stock) {
                carts[index].qty += 1
                carts[index].totalPrice = carts[index].price * carts[index].qty
                return { ...state, data: carts }
            }
            return state
        case 'DECREASE_CART_QTY':
            carts = [...state.data]
            index = action.payload
            if (carts[index].qty > 1) {
                carts[index].qty -= 1
                carts[index].totalPrice = carts[index].price * carts[index].qty
                return { ...state, data: carts }
            }
            return state
        case 'CLEAR_CART':
            return { ...state, data: [] }
        default:
            return state
    }
}