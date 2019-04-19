import axios from 'axios'
import qs from 'qs'
import auth from '@/utils/auth'
import { Message, MessageBox } from 'element-ui'
const getTag = () =>{
    return +window.location.port === 8999 ? 'labor' :'erp'
}

const service = axios.create({
    baseURL: process.env.VUE_APP_BASEAPI,
    timeout: 15000, // 请求超时时间
    withCredentials: false,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    transformRequest: [function (data) {
        return qs.stringify(data,{arrayFormat: 'brackets'})
    }],
    validateStatus: function (status) {
        return [200, 201, 204, 422, 401, 404, 429, 403].indexOf(status) !== -1 // 默认的
    }
})

service.interceptors.request.use(config => {
    // 'Authorization': 
    config.headers['Authorization'] = auth.getToken()
    config.headers['proxytag'] = getTag()
    return config
})

service.interceptors.response.use(response => {
    const { status, data } = response
    if (status === 201) {
        Message({
            type: 'success',
            message: '创建成功'
        })
    }
    if (status === 204) {
        Message({
            type: 'success',
            message: '删除成功'
        })
    }
    if ([401].indexOf(status) !== -1) {
        Message({
            type: 'error',
            message: data.info
        })
        auth.removeToken()
        window.location.href = '/account/login'
        return Promise.reject(response)
    }
    if(response.config.method==='put' && response.status===200){
        Message({
            type: 'success',
            message: '修改成功'
        })
    }
    return data
}, error => {
    Message({
        type: 'error',
        message: error.response.data
    })
    return Promise.reject(error)
})

export default service

