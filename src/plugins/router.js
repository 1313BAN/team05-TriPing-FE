import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import MyReview from '../pages/MyReview.vue'
import MyPage from '../pages/MyPage.vue'
import Setting from '../pages/Setting.vue'
import Login from '../pages/Login.vue'
import SignUp from '../pages/SignUp.vue'
import ChangePasswordView from '../pages/mypage/ChangePasswordView.vue'
import EditProfileView from '../pages/mypage/EditProfileView.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/signup', component: SignUp },

  // ✅ 로그인 필요
  { path: '/myreview', component: MyReview, meta: { requiresAuth: true } },
  { path: '/mypage', component: MyPage, meta: { requiresAuth: true } },
  { path: '/mypage/edit', component: EditProfileView, meta: { requiresAuth: true } },
  { path: '/mypage/change-password', component: ChangePasswordView, meta: { requiresAuth: true } },

  // ✅ 누구나 접근 가능
  { path: '/setting', component: Setting }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ✅ 로그인 체크 전역 가드
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('accessToken')

  if (to.meta.requiresAuth && !token) {
    console.warn('🔒 로그인 필요 → 로그인 페이지로 이동')
    next('/login')
  } else {
    next()
  }
})

export default router
