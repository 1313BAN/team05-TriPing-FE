import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import MyReview from '../pages/MyReview.vue'
import MyPage from '../pages/MyPage.vue'
import Setting from '../pages/Setting.vue'
import Login from '../pages/Login.vue'
import SignUp from '../pages/SignUp.vue' // ✅ 추가

const routes = [
  { path: '/', component: Home },
  { path: '/myreview', component: MyReview },
  { path: '/mypage', component: MyPage },
  { path: '/setting', component: Setting },
  { path: '/login', component: Login },
  { path: '/signup', component: SignUp } // ✅ 신규 회원가입 경로 추가
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
