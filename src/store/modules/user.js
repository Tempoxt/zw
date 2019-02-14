import auth from '@/utils/auth'
import * as api_user from '@/api/user'
const user = {
    namespaced: true,
    state: {
        userInfo: null,
        token:auth.getToken()
    },
    mutations: {
        login(state, token) {
            token && auth.setToken(token)
            state.token = token
        },
        setUserInfo(state,info){
            state.userInfo = info
        }
    },
    actions: {
        async LogOut() {
            await api_user.logout()
            auth.removeToken()
            return 
        },
        async getUserInfo({ commit, state }){
           const userInfo =  await api_user.getUserInfo()
           commit('setUserInfo',userInfo)
           return userInfo
        }
    }
}

export default user