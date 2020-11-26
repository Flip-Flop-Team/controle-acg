export default [
  {
    path: '/login',
    component: '@/pages/login',
  },
  {
    path: '/register-student',
    component: '@/pages/RegisterStudent',
  },
  {
    path: '/',
    component: '@/layouts/security',
    wrappers: ['@/wrappers/token'],
    routes: [
      {
        path: '/',
        component: '@/pages/router',
      },
      {
        component: '@/components/not-found',
      },
    ],
  },
];
