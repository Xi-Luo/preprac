// @ts-ignore
import axios from 'axios'
export function getAxios(auth){
    if(auth) {
        const token = this.$store.state.token;
        return axios.create({
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
    }
    else {
        return axios.create();
    }
}

getAxios().interceptors.response.use(
    response=>{
        if (response.data.success) {
            if (response.headers.authorization!=='') {
                this.$store.commit("tokenSave",response.headers.authorization)
            }
            return Promise.resolve(response)
        } else {
            this.$message.error(response.data.msg)
            return Promise.reject(response)
        }
    },
    error => {
        this.$message.error(error.data.msg)
        return Promise.reject(error.response);
    })