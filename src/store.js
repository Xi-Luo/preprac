import Vue from 'vue'
import Vuex from 'vuex'
// import {use} from "element-ui/src/locale";


Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        token:'',
        userName:''
    },
    mutations:{
        tokenSave(state, token){
            state.token = token;
        },
        userNameSave(state, userName){
            state.userName = userName;
        }
    },
    actions:{

    },
    modules:{

    }
})