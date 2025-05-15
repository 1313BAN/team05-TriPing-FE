import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import MyReview from '../pages/MyReview.vue'
import MyPage from '../pages/MyPage.vue'
import Setting from '../pages/Setting.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/myreview', component: MyReview },
  { path: '/mypage', component: MyPage },
  { path: '/setting', component: Setting }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
