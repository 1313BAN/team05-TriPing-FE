import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import MyReview from '../pages/MyReview.vue'
import MyPage from '../pages/MyPage.vue'
import Setting from '../pages/Setting.vue'
import Login from '../pages/Login.vue'
import SignUp from '../pages/SignUp.vue'
import ChangePasswordView from '../pages/mypage/ChangePasswordView.vue'
import EditProfileView from '../pages/mypage/EditProfileView.vue'
import AttractionDetail from '../pages/attraction/[id].vue'
import Guide from '@/pages/guide/[id].vue'

const routes = [
  { path: '/setting', component: Setting },
  { path: '/login', component: Login },
  { path: '/signup', component: SignUp },
  { path: '/attraction/:id', component: AttractionDetail, props: true },
  { path: '/guide/:id', component: Guide, props: true },

  // 로그인 필요
  { path: '/', component: Home, meta: { requiresAuth: true } },
  { path: '/myreview', component: MyReview, meta: { requiresAuth: true } },
  { path: '/mypage', component: MyPage, meta: { requiresAuth: true } },
  { path: '/mypage/edit', component: EditProfileView, meta: { requiresAuth: true } },
  { path: '/mypage/change-password', component: ChangePasswordView, meta: { requiresAuth: true } },

  { path: '/setting', component: Setting }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('accessToken')

  if (to.meta.requiresAuth && !token) {
    console.warn('로그인 필요 → 로그인 페이지로 이동')
    next('/login')
  } else {
    next()
  }
})

export default router
