import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // {
  //   path: '/',
  //   name: 'eCommerce',
  //   component: () => import('@/views/Dashboard/ECommerceView.vue'),
  //   meta: {
  //     title: 'eCommerce Dashboard'
  //   }
  // },
  // {
  //   path: '/calendar',
  //   name: 'calendar',
  //   component: () => import('@/views/CalendarView.vue'),
  //   meta: {
  //     title: 'Calendar'
  //   }
  // },
  // {
  //   path: '/profile',
  //   name: 'profile',
  //   component: () => import('@/views/ProfileView.vue'),
  //   meta: {
  //     title: 'Profile'
  //   }
  // },
  // {
  //   path: '/forms/form-elements',
  //   name: 'formElements',
  //   component: () => import('@/views/Forms/FormElementsView.vue'),
  //   meta: {
  //     title: 'Form Elements'
  //   }
  // },
  // {
  //   path: '/forms/form-layout',
  //   name: 'formLayout',
  //   component: () => import('@/views/Forms/FormLayoutView.vue'),
  //   meta: {
  //     title: 'Form Layout'
  //   }
  // },
  // {
  //   path: '/tables',
  //   name: 'tables',
  //   component: () => import('@/views/TablesView.vue'),
  //   meta: {
  //     title: 'Tables'
  //   }
  // },
  // {
  //   path: '/pages/settings',
  //   name: 'settings',
  //   component: () => import('@/views/Pages/SettingsView.vue'),
  //   meta: {
  //     title: 'Settings'
  //   }
  // },
  // {
  //   path: '/charts/basic-chart',
  //   name: 'basicChart',
  //   component: () => import('@/views/Charts/BasicChartView.vue'),
  //   meta: {
  //     title: 'Basic Chart'
  //   }
  // },
  // {
  //   path: '/ui-elements/alerts',
  //   name: 'alerts',
  //   component: () => import('@/views/UiElements/AlertsView.vue'),
  //   meta: {
  //     title: 'Alerts'
  //   }
  // },
  // {
  //   path: '/ui-elements/buttons',
  //   name: 'buttons',
  //   component: () => import('@/views/UiElements/ButtonsView.vue'),
  //   meta: {
  //     title: 'Buttons'
  //   }
  // },
  // {
  //   path: '/auth/signin',
  //   name: 'signin',
  //   component: () => import('@/views/Authentication/SigninView.vue'),
  //   meta: {
  //     title: 'Signin'
  //   }
  // },
  // {
  //   path: '/auth/signup',
  //   name: 'signup',
  //   component: () => import('@/views/Authentication/SignupView.vue'),
  //   meta: {
  //     title: 'Signup'
  //   }
  // },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Authentication/LoginPage.vue')
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomePage.vue'),
    redirect: () => {
      return { path: '/admins' }
    },
    meta: {
      auth: true
    },
    children: [
      {
        path: '/admins',
        name: 'admins',
        component: () => import('@/views/Admins/ListAdmins.vue'),
        meta: {
          title: 'Admins'
        }
      }
    ]
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/views/Users/ListUsers.vue'),
    meta: {
      title: 'Users'
    }
  },
  {
    path: '/generate',
    name: 'generate',
    component: () => import('@/views/Generate/GenerateForm.vue'),
    meta: {
      title: 'Users'
    }
  },
  {
    path: '/win-or-lose-history',
    name: 'winOrLoseHistory',
    component: () => import('@/views/Histories/WinOrLoseHistory.vue'),
    meta: {
      auth: true,
      title: 'Win Or Lose History'
    }
  },
  {
    path: '/bank-history',
    name: 'bankHistory',
    component: () => import('@/views/Histories/BankHistory.vue'),
    meta: {
      auth: true,
      title: 'Bank History'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  document.title = `Seamless API`
  const token = localStorage.getItem('token')
  const isAuthenticated =
    token !== null && token !== undefined && token !== 'undefined' && token !== ''
  if (to.matched.some((record) => record.meta.auth)) {
    if (!isAuthenticated) next({ name: 'login' })
    else next()
  } else if (to.name === 'login' && isAuthenticated) next({ name: 'home' })
  else next()
})

export default router
