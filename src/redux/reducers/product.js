const initial = {
    data: [{}, {}, {}, {}, {}, {}]
}

export default (state = initial, action) => {
    switch (action.type) {
        case 'SET_PRODUCT': 
            return {
                ...state,
                data: action.payload
            }
        default:
            return state
    }
}