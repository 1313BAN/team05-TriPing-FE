import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null
  }),
  actions: {
    setUser(userData) {
      this.user = userData
    },
    clearUser() {
      this.user = null
    }
  },
  getters: {
    isLoggedIn: (state) => state.user !== null
  },
  persist: true // 로컬스토리지에 자동 저장됨
})
