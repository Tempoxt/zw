import auth from '@/utils/auth'
const user = {
    namespaced: true,
    state: {
        userInfo: null,
    },
    mutations: {
        login(state, token) {
            token && auth.setToken(token)
            state.token = token
        }
    },
    actions: {
        LogOut() {
            return new Promise((resolve) => {
                auth.removeToken()
                resolve()
            })
        }
    }
}

export default user