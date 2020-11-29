import VueRouter from "vue-router"
import Vue from "vue"

import login from './views/login'
import information from "./views/information";
import buyInForm from "@/views/buyInForm";

Vue.use(VueRouter)

const router = new VueRouter({
    routes:[
        {
            path: '/',
            name: 'login',
            component: login
        },
        {
            path: '/login',
            name: 'login',
            component: login
        },
        {
            path:'/information',
            name: 'information',
            component: information
        },
        {
            path:'/buyInForm',
            name:'buyInForm',
            component: buyInForm
        }
    ]
})

export default router