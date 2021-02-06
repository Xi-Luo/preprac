import VueRouter from "vue-router"
import Vue from "vue"

import login from './views/login'
import listOrder from "@/views/listOrder";
import addUser from "@/views/addUser";
import addOrder from "@/views/addOrder";
import orderDetail from "@/views/orderDetail";
import notice from "@/views/notice";
import info from "@/views/info";
import approval from "@/views/approval";

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
            path: '/adduser',
            name:  'adduser',
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
        },{
            path:'/info',
            name: 'info',
            component: info
        },{
            path: '/approval',
            name:'approval',
            component: approval
        }
    ]
})

export default router