
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/MainPage.vue') },
      { path: 'monitor', component: () => import('pages/Monitor.vue') },
      { path: 'instructor', component: () => import('pages/Instructor.vue') },
      { path: 'media', component: () => import('pages/Media.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
