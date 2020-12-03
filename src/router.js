import VueRouter from "vue-router"
import Vue from "vue"

import login from './views/login'
import information from "./views/information";
import buyInForm from "@/views/buyInForm";
import listOrder from "@/views/listOrder";
import addUser from "@/views/addUser";

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
            path:'/info',
            name: 'info',
            component: information
        },
        {
            path: '/adduser',
            name:  'addUser',
            component: addUser

        },
        {
            path: '/addOrder',
            name:'buyInForm',
            component: buyInForm
        },
        {
            path: '/listOrder',
            name: listOrder,
            component: listOrder
        }

    ]
})

export default router