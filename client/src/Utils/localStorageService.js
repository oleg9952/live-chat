export const getUserName = 'GET_USERNAME'
export const setUserName = 'SET_USERNAME'

export default (action, payload) => {
    switch (action) {
        case setUserName:
            localStorage.setItem('username', payload)
            break;
        case getUserName:
            return localStorage.getItem('username')
        default:
            break;
    }
}