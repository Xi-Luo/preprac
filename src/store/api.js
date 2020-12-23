// @ts-ignore
import axios from 'axios'
export function getAxios(auth){
    if(auth) {
        console.log('store',this.$store.state.token)
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