import Vue from 'vue'
import Vuex from 'vuex'
// import {use} from "element-ui/src/locale";


Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        token:'',
        userName:'',
        menu:[]
    },
    mutations:{
        tokenSave(state, token){
            state.token = token;
        },
        userNameSave(state, userName){
            state.userName = userName;
        },
        menuSave(state, menu){
            state.menu= menu;
        }
    },
    actions:{

    },
    modules:{

    }
})