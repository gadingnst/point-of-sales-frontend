const initial = {
    user: {},
    token: null,
    loggedIn: false,
    isLoading: false
}

export default (state = initial, action) => {
    switch (action.type) {
        case 'LOGIN_USER_PENDING':
            return {
                ...state,
                isLoading: true
            }
        case 'LOGIN_USER_FULFILLED':
            return {
                ...state,
                isLoading: false,
                loggedIn: true,
                user: action.payload.data.user,
                token: action.payload.data.token
            }
        case 'LOGIN_USER_REJECTED':
            return {
                ...state,
                isLoading: false
            }
        case 'LOGOUT_USER':
            return {
                ...state,
                loggedIn: false,
                token: null,
                user: {}
            }
        default:
            return state
    }
}