import request from '@/plugins/request'

export function login(data) {
    return request.post('/user/login', data)
}
