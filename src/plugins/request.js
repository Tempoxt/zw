import axios from 'axios'
import qs from 'qs'
import auth from '@/utils/auth'
import { Message, MessageBox } from 'element-ui'
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
const getTag = () =>{
    return +window.location.port === 8999 ? 'labor' :'erp'
}
let isFormData = (v) => {
    return Object.prototype.toString.call(v) === '[object FormData]';
}
const service = axios.create({
    baseURL: process.env.VUE_APP_BASEAPI,
    timeout: 15000, // 请求超时时间
    withCredentials: false,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    transformRequest: [function (data) {
        if(isFormData(data))return data
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
    const { status, data,config ,headers } = response
    if (status === 201) {
        if(response.config.alert!==false){
            Message({
                type: 'success',
                message: '创建成功'
            })
        }
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
        if(response.config.alert!==false){
            Message({
                type: 'success',
                message: response.data ||'修改成功'
            })
        }
    }
    if(config.responseType==="arraybuffer"){
        let contentType = headers['content-type'];
        let name
        try {
            name =Base64.decode(headers['content-disposition'].split('?')[3]).split('=')[1]
        }catch(err){
            name = ''
        }
      
        return { data , name , contentType}
    }
    return data
}, error => {
    // 表单错误
    if(error.response.status === 400 && typeof error.response.data === 'object'){  
        return Promise.reject({field:error.response.data,error})
    }else{
        if(error.response.config.alert!==false){
            Message({
                type: 'error',
                dangerouslyUseHTMLString: true,
                message: error.response.data
            })
        }
    }
  
    return Promise.reject(error)
})

export default service

