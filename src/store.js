import Vue from 'vue'
import Vuex from 'vuex'
// import {use} from "element-ui/src/locale";


Vue.use(Vuex)

export default new Vuex.Store({
    state:{
        token:'',
        userName:'',
        // menu:[],
        loginName:'',
        role:''
    },
    mutations:{
        tokenSave(state, token){
            state.token = token;
        },
        userNameSave(state, userName){
            state.userName = userName;
        },
        // menuSave(state, menu){
        //     state.menu= menu;
        // },
        loginNameSave(state, loginName){
            state.loginName = loginName
        },
        tokenClear(state){
            state.token = ''
        },
        usernameClear(state){
            state.userName= ''
        },
        // menuClear(state){
        //     state.menu = ''
        // },
        loginNameClear(state){
            state.loginName = ''
        }
    },
    actions:{

    },
    modules:{

    }
})