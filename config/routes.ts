export default [
  {
    path: '/',
  },
  {
    path: '/login',
    component: '@/pages/authentication/Login',
  },
  {
    path: '/register-student',
    authority: [],
    component: '@/pages/authentication/RegisterStudent',
  },
  {
    component: '@/components/not-found',
  },
];
