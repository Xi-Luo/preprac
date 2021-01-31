import VueRouter from "vue-router"
import Vue from "vue"

import login from './views/login'
import information from "./views/information";
import listOrder from "@/views/listOrder";
import addUser from "@/views/addUser";
import addOrder from "@/views/addOrder";
import orderDetail from "@/views/orderDetail";
import notice from "@/views/notice";

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
            name:'addOrder',
            component: addOrder
        },
        {
            path: '/listOrder',
            name: 'listOrder',
            component: listOrder
        },
        {
            path: '/orderDetail',
            name: 'orderDetail',
            component: orderDetail
        },{
            path: '/notices',
            name: 'notices',
            component: notice
        }


    ]
})

export default router