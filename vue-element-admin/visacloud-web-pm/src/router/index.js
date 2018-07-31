import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/authredirect', component: () => import('@/views/login/authredirect'), hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }]
  },
  {
    path: '/regist',
    component: () => import('@/views/regist/index'),
    hidden: true,
    children: [{
      path: 'step1',
      component: () => import('@/views/regist/step1'),
      name: 'regist1',
      hidden: true,
      meta: { noCache: true }
    }, {
      path: 'step2',
      component: () => import('@/views/regist/step2'),
      name: 'regist2',
      hidden: true,
      meta: { noCache: true }
    }, {
      path: 'step3',
      component: () => import('@/views/regist/step3'),
      name: 'regist3',
      hidden: true,
      meta: { noCache: true }
    }]
  }
  // ,{
  //   path: '/documentation',
  //   component: Layout,
  //   redirect: '/documentation/index',
  //   children: [{
  //     path: 'index',
  //     component: () => import('@/views/documentation/index'),
  //     name: 'documentation',
  //     meta: { title: 'documentation', icon: 'documentation', noCache: true }
  //   }]
  // },
  // {
  //   path: '/guide',
  //   component: Layout,
  //   redirect: '/guide/index',
  //   children: [{
  //     path: 'index',
  //     component: () => import('@/views/guide/index'),
  //     name: 'guide',
  //     meta: { title: 'guide', icon: 'guide', noCache: true }
  //   }]
  // }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  // 用户管理
  {
    path: '/UserManage',
    component: Layout,
    children: [{
      path: 'index',
      component: () => import('@/views/userManage/index'),
      name: 'UserManage',
      meta: {
        title: 'UserManage',
        icon: 'icon',
        roles: ['admin', 'editor']
      }
    }]
  },
  {
    path: '/OrderManage',
    component: Layout,
    children: [{
      path: 'index',
      component: () => import('@/views/order/orderList'),
      name: 'OrderManage',
      meta: {
        title: 'OrderManage',
        icon: 'icon',
        roles: ['admin', 'editor']
      }
    }, {
      path: 'add',
      component: () => import('@/views/order/orderAdd'),
      name: 'OrderAdd',
      meta: {
        title: 'OrderAdd',
        roles: ['admin', 'editor']
      },
      hidden: true
    }, {
      path: 'imports',
      component: () => import('@/views/order/orderImport'),
      name: 'OrderImport',
      meta: {
        title: 'OrderImport',
        roles: ['admin', 'editor']
      },
      hidden: true
    }, {
      path: 'detail/:order_id',
      component: () => import('@/views/order/orderDetail'),
      name: 'OrderDetail',
      meta: {
        title: 'OrderDetail',
        roles: ['admin', 'editor']
      },
      hidden: true
    }]
  },
  // 填表制件
  {
    path: '/fillVisa',
    component: Layout,
    redirect: '/fillVisa/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'fillVisa',
      icon: 'edit',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    // 填表制件子菜单，冒号（:）后面为参数
    children: [{
      path: 'visaList/Thailand',
      component: () => import('@/views/fillVisa/index'),
      name: 'Thailand',
      // 对应接口中 country_en_name 字段
      params: { country_code: 'TH' },
      meta: {
        title: 'Thailand',
        roles: ['admin'] // or you can only set roles in sub nav
      }
    }, {
      path: 'visaList/Japan',
      component: () => import('@/views/fillVisa/index'),
      name: 'Japan',
      // 对应接口中 country_en_name 字段
      params: { country_code: 'JP' },
      meta: {
        title: 'Japan',
        roles: ['admin'] // or you can only set roles in sub nav
      }
    }, {
      path: 'visaInfo/:enterpriseId/:visaOrderNo/:passportNo',
      component: () => import('@/views/fillVisa/admin/VisaInfoForm'),
      name: 'VisaInfoCustomer',
      meta: {
        title: 'VisaInfoCustomer',
        roles: ['admin']
      },
      hidden: true
    }, {
      path: 'visaOper/:id',
      component: () => import('@/views/fillVisa/admin/VisaOperForm'),
      name: 'VisaOptOrder',
      meta: {
        title: 'VisaOptOrder',
        roles: ['admin']
      },
      hidden: true
    }
      // { path: 'create', component: () => import('@/views/example/create'), name: 'createArticle', meta: { title: 'createArticle', icon: 'edit' }},
      // { path: 'edit/:id(\\d+)', component: () => import('@/views/example/edit'), name: 'editArticle', meta: { title: 'editArticle', noCache: true }, hidden: true },
      // { path: 'list', component: () => import('@/views/example/list'), name: 'articleList', meta: { title: 'articleList', icon: 'list' }}
    ]
  },
  // 办签状态管理
  {
    path: '/visaState',
    component: Layout,
    redirect: '/visaState/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'visaState',
      icon: 'edit',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    // 填表制件子菜单，冒号（:）后面为参数
    children: [{
      path: 'visaList/Thailand',
      component: () => import('@/views/visaState/index'),
      name: 'Thailand Visa State',
      // 对应接口中 country_en_name 字段
      params: { country_code: 'TH' },
      meta: {
        title: 'Thailand',
        roles: ['admin'] // or you can only set roles in sub nav
      }
    }, {
      path: 'visaList/Japan',
      component: () => import('@/views/visaState/index'),
      name: 'Japan Visa State',
      // 对应接口中 country_en_name 字段
      // country_code: 'Japan',
      params: { country_code: 'JP' },
      meta: {
        title: 'Japan',
        roles: ['admin'] // or you can only set roles in sub nav
      }
    }
    ]
  },
  // 签证模板
  {
    path: '/visaTemplate',
    component: Layout,
    redirect: '/visaTemplate/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'visaTemplate',
      icon: 'example',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    // 填表制件子菜单，冒号（:）后面为参数
    children: [{
      path: 'Thailand',
      component: () => import('@/views/visaTemplate/index'),
      name: 'Thailand Visa Template',
      // 对应接口中 country_en_name 字段
      params: { country_code: 'TH' },
      meta: {
        title: 'Thailand',
        roles: ['admin'] // or you can only set roles in sub nav
      }
    }, {
      path: 'Japan',
      component: () => import('@/views/visaTemplate/index'),
      name: 'Japan Visa Template',
      // 对应接口中 country_en_name 字段
      // country_code: 'Japan',
      params: { country_code: 'JP' },
      meta: {
        title: 'Japan',
        roles: ['admin'] // or you can only set roles in sub nav
      }
    }
    ]
  },
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/index',
  //   alwaysShow: true, // will always show the root menu
  //   meta: {
  //     title: 'permission',
  //     icon: 'lock',
  //     roles: ['admin', 'editor'] // you can set roles in root nav
  //   },
  //   children: [{
  //     path: 'page',
  //     component: () => import('@/views/permission/page'),
  //     name: 'pagePermission',
  //     meta: {
  //       title: 'pagePermission',
  //       roles: ['admin'] // or you can only set roles in sub nav
  //     }
  //   }, {
  //     path: 'directive',
  //     component: () => import('@/views/permission/directive'),
  //     name: 'directivePermission',
  //     meta: {
  //       title: 'directivePermission'
  //       // if do not set roles, means: this page does not require permission
  //     }
  //   }]
  // },
  //
  // {
  //   path: '/icon',
  //   component: Layout,
  //   children: [{
  //     path: 'index',
  //     component: () => import('@/views/svg-icons/index'),
  //     name: 'icons',
  //     meta: { title: 'icons', icon: 'icon', noCache: true }
  //   }]
  // },

  // {
  //   path: '/components',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'component-demo',
  //   meta: {
  //     title: 'components',
  //     icon: 'component'
  //   },
  //   children: [
  //     { path: 'tinymce', component: () => import('@/views/components-demo/tinymce'), name: 'tinymce-demo', meta: { title: 'tinymce' }},
  //     { path: 'markdown', component: () => import('@/views/components-demo/markdown'), name: 'markdown-demo', meta: { title: 'markdown' }},
  //     { path: 'json-editor', component: () => import('@/views/components-demo/jsonEditor'), name: 'jsonEditor-demo', meta: { title: 'jsonEditor' }},
  //     { path: 'splitpane', component: () => import('@/views/components-demo/splitpane'), name: 'splitpane-demo', meta: { title: 'splitPane' }},
  //     { path: 'avatar-upload', component: () => import('@/views/components-demo/avatarUpload'), name: 'avatarUpload-demo', meta: { title: 'avatarUpload' }},
  //     { path: 'dropzone', component: () => import('@/views/components-demo/dropzone'), name: 'dropzone-demo', meta: { title: 'dropzone' }},
  //     { path: 'sticky', component: () => import('@/views/components-demo/sticky'), name: 'sticky-demo', meta: { title: 'sticky' }},
  //     { path: 'count-to', component: () => import('@/views/components-demo/countTo'), name: 'countTo-demo', meta: { title: 'countTo' }},
  //     { path: 'mixin', component: () => import('@/views/components-demo/mixin'), name: 'componentMixin-demo', meta: { title: 'componentMixin' }},
  //     { path: 'back-to-top', component: () => import('@/views/components-demo/backToTop'), name: 'backToTop-demo', meta: { title: 'backToTop' }},
  //     { path: 'drag-dialog', component: () => import('@/views/components-demo/dragDialog'), name: 'dragDialog-demo', meta: { title: 'dragDialog' }},
  //     { path: 'dnd-list', component: () => import('@/views/components-demo/dndList'), name: 'dndList-demo', meta: { title: 'dndList' }},
  //     { path: 'drag-kanban', component: () => import('@/views/components-demo/dragKanban'), name: 'dragKanban-demo', meta: { title: 'dragKanban' }}
  //   ]
  // },

  // {
  //   path: '/charts',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'charts',
  //   meta: {
  //     title: 'charts',
  //     icon: 'chart'
  //   },
  //   children: [
  //     { path: 'keyboard', component: () => import('@/views/charts/keyboard'), name: 'keyboardChart', meta: { title: 'keyboardChart', noCache: true }},
  //     { path: 'line', component: () => import('@/views/charts/line'), name: 'lineChart', meta: { title: 'lineChart', noCache: true }},
  //     { path: 'mixchart', component: () => import('@/views/charts/mixChart'), name: 'mixChart', meta: { title: 'mixChart', noCache: true }}
  //   ]
  // },
  //
  // {
  //   path: '/tab',
  //   component: Layout,
  //   children: [{
  //     path: 'index',
  //     component: () => import('@/views/tab/index'),
  //     name: 'tab',
  //     meta: { title: 'tab', icon: 'tab' }
  //   }]
  // },

  // {
  //   path: '/table',
  //   component: Layout,
  //   redirect: '/table/complex-table',
  //   name: 'table',
  //   meta: {
  //     title: 'Table',
  //     icon: 'table'
  //   },
  //   children: [
  //     { path: 'dynamic-table', component: () => import('@/views/table/dynamicTable/index'), name: 'dynamicTable', meta: { title: 'dynamicTable' }},
  //     { path: 'drag-table', component: () => import('@/views/table/dragTable'), name: 'dragTable', meta: { title: 'dragTable' }},
  //     { path: 'inline-edit-table', component: () => import('@/views/table/inlineEditTable'), name: 'inlineEditTable', meta: { title: 'inlineEditTable' }},
  //     { path: 'tree-table', component: () => import('@/views/table/treeTable/treeTable'), name: 'treeTableDemo', meta: { title: 'treeTable' }},
  //     { path: 'custom-tree-table', component: () => import('@/views/table/treeTable/customTreeTable'), name: 'customTreeTableDemo', meta: { title: 'customTreeTable' }},
  //     { path: 'complex-table', component: () => import('@/views/table/complexTable'), name: 'complexTable', meta: { title: 'complexTable' }}
  //   ]
  // },

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/list',
  //   name: 'example',
  //   meta: {
  //     title: 'example',
  //     icon: 'example'
  //   },
  //   children: [
  //     { path: 'create', component: () => import('@/views/example/create'), name: 'createArticle', meta: { title: 'createArticle', icon: 'edit' }},
  //     { path: 'edit/:id(\\d+)', component: () => import('@/views/example/edit'), name: 'editArticle', meta: { title: 'editArticle', noCache: true }, hidden: true },
  //     { path: 'list', component: () => import('@/views/example/list'), name: 'articleList', meta: { title: 'articleList', icon: 'list' }}
  //   ]
  // },

  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/bar/profile',
  //   name: 'nested',
  //   meta: {
  //     title: 'nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: '/nested/bar', // Must write the full path
  //       component: () => import('@/views/nested/bar/index'), // Parent router-view
  //       name: 'bar',
  //       meta: { title: 'bar' },
  //       children: [
  //         {
  //           path: 'profile',
  //           component: () => import('@/views/nested/bar/profile'),
  //           name: 'bar-profile',
  //           meta: { title: 'barProfile' }
  //         },
  //         {
  //           path: 'posts',
  //           component: () => import('@/views/nested/bar/posts'),
  //           name: 'bar-posts',
  //           meta: { title: 'barPosts' }
  //         }
  //       ]
  //     }
  //   ]
  // },

  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'errorPages',
  //   meta: {
  //     title: 'errorPages',
  //     icon: '404'
  //   },
  //   children: [
  //     { path: '401', component: () => import('@/views/errorPage/401'), name: 'page401', meta: { title: 'page401', noCache: true }},
  //     { path: '404', component: () => import('@/views/errorPage/404'), name: 'page404', meta: { title: 'page404', noCache: true }}
  //   ]
  // },

  // {
  //   path: '/error-log',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   children: [{ path: 'log', component: () => import('@/views/errorLog/index'), name: 'errorLog', meta: { title: 'errorLog', icon: 'bug' }}]
  // },
  //
  // {
  //   path: '/excel',
  //   component: Layout,
  //   redirect: '/excel/export-excel',
  //   name: 'excel',
  //   meta: {
  //     title: 'excel',
  //     icon: 'excel'
  //   },
  //   children: [
  //     { path: 'export-excel', component: () => import('@/views/excel/exportExcel'), name: 'exportExcel', meta: { title: 'exportExcel' }},
  //     { path: 'export-selected-excel', component: () => import('@/views/excel/selectExcel'), name: 'selectExcel', meta: { title: 'selectExcel' }},
  //     { path: 'upload-excel', component: () => import('@/views/excel/uploadExcel'), name: 'uploadExcel', meta: { title: 'uploadExcel' }}
  //   ]
  // },
  //
  // {
  //   path: '/zip',
  //   component: Layout,
  //   redirect: '/zip/download',
  //   alwaysShow: true,
  //   meta: { title: 'zip', icon: 'zip' },
  //   children: [{ path: 'download', component: () => import('@/views/zip/index'), name: 'exportZip', meta: { title: 'exportZip' }}]
  // },
  //
  // {
  //   path: '/theme',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   children: [{ path: 'index', component: () => import('@/views/theme/index'), name: 'theme', meta: { title: 'theme', icon: 'theme' }}]
  // },
  //
  // {
  //   path: '/clipboard',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   children: [{ path: 'index', component: () => import('@/views/clipboard/index'), name: 'clipboardDemo', meta: { title: 'clipboardDemo', icon: 'clipboard' }}]
  // },
  //
  // {
  //   path: '/i18n',
  //   component: Layout,
  //   children: [{ path: 'index', component: () => import('@/views/i18n-demo/index'), name: 'i18n', meta: { title: 'i18n', icon: 'international' }}]
  // },

  { path: '*', redirect: '/404', hidden: true }
]
