// 📄 src/store/user.js
import { reactive } from 'vue'

export const userStore = reactive({
  user: null,

  setUser(userData) {
    this.user = userData
  },

  clearUser() {
    this.user = null
  },

  isLoggedIn() {
    return this.user !== null
  }
})
