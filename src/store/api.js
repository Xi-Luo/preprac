// @ts-ignore
import axios from 'axios'
import element from 'element-ui'
import store from '../store'
import router from "@/router";
export {service}
let service = axios.create({
    baseURL:'http://localhost:8080',
    timeout:5000,
    headers:{
        "Content-Type":'application/json'
    }
})



export function getAxios(auth){
    if(auth) {
        //
    }
    return service
}


service.interceptors.request.use(
    config => {
        const token = store.state.token
        if(token){
            config.headers["Authorization"] = token
        }
        return config
    }
)

service.interceptors.response.use(
    response=>{
        if(response.status===200){
            if(response.data.success===undefined){
                return Promise.resolve(response)
            }else if(response.data.success){
                if (response.headers.authorization!= undefined) {
                    store.commit("tokenSave",response.headers.authorization)
                }
                return Promise.resolve(response)
            }
        }else {
            element.Message({
                type:"error",
                message:response.data.msg,
                duration: 3000
            })
            router.push({path:'/login'}).then()
            return Promise.reject(response)
        }
    },
    error => {
        element.Message({
            type:"error",
            message:error.data.msg,
            duration: 3000
        })
        return Promise.reject(error.response);})