export default [
  {
    path: '/login',
    component: '@/pages/login',
  },
  {
    path: '/register-student',
    authority: [],
    component: '@/pages/registerStudent',
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
