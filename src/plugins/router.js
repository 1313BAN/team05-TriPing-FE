import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import MyReview from '../pages/MyReview.vue'
import MyPage from '../pages/MyPage.vue'
import Setting from '../pages/Setting.vue'
import Login from '../pages/Login.vue'
import SignUp from '../pages/SignUp.vue'

// ✅ 경로 변경: /pages/mypage/ChangePasswordView.vue로 이동했다고 가정
import ChangePasswordView from '../pages/mypage/ChangePasswordView.vue'
import EditProfileView from '../pages/mypage/EditProfileView.vue' // ✅ 추가

const routes = [
  { path: '/', component: Home },
  { path: '/myreview', component: MyReview },
  { path: '/mypage', component: MyPage },
  { path: '/mypage/change-password', component: ChangePasswordView }, // ✅ 경로 변경
  { path: '/setting', component: Setting },
  { path: '/login', component: Login },
  { path: '/signup', component: SignUp },
  { path: '/mypage/edit', component: EditProfileView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
