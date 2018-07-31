import Vue from 'vue';
import VueRouter from 'vue-router';

// 引入组件

// import login from './../components/login.vue'
import home from './../views/home.vue';// "./../views/home.vue" == "@/views/home.vue" ,强迫症看不得有下划线

import menutab from './../components/menu/menuTab.vue';
import menutable from './../components/menu/menuTable.vue';

// 要告诉 vue 使用 vueRouter
Vue.use(VueRouter);

// this router test
const Foo = { template: '<div>foo</div>' };
const Bar = { template: '<div>bar</div>' };

const pageA = resolve => {
    require.ensure(['../views/pageA.vue'], () => {
        resolve(require('../views/pageA.vue'));
    });
};
const pageB = resolve => {
    require.ensure(['../views/pageB.vue'], () => {
        resolve(require('../views/pageB.vue'));
    });
};
//  this router test End
export const constantRouterMap = [
    // test
    { path: '/pageA', component: pageA, name: 'page A' },
    { path: '/pageB', component: pageB, name: 'page B' },
    { path: '/foo', component: Foo, name: 'page Foo' },
    { path: '/bar', component: Bar, name: 'page Bar' },
    // end test
    {
        path: '/',
        component: home,
        name: '制表信息管理',
        iconCls: 'el-icon-message', //图标样式class
        children: [
            {
                path: '/menutab',
                component: menutab,
                name: 'Tab'
            }
        ]
    },
    {
        path: '/',
        component: home,
        name: '导航二',
        iconCls: 'fa fa-id-card-o',
        children: [
            {
                path: '/menutable',
                component: menutable,
                name: 'Table'
            }
        ]
    },

    { path: '/', redirect: '/index' }, // 跳转路由，默认显示路由页面
    {
        path: '/VisaList',
        component: () => import('./../views/VisaList.vue')
    },
    {
        name: '个人签证信息补录',
        path: '/VisaInfo/:enterpriseId/:visaOrderNo/:passportNo',
        component: () => import('./../views/VisaInfoForm.vue')
    },
    {
        name: '维护操作单信息',
        path: '/VisaOper/:id',
        component: () => import('./../views/VisaOperForm.vue')
    }
]

export default new VueRouter({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    linkActiveClass: 'active', //为路由匹配激活link-active，方便设置类
    routes: constantRouterMap
})

export const asyncRouterMap = [

]