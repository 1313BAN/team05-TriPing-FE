import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    isRecommendDrawerOpen: false
  }),
  actions: {
    openRecommendDrawer() {
      this.isRecommendDrawerOpen = true
    },
    closeRecommendDrawer() {
      this.isRecommendDrawerOpen = false
    },
    toggleRecommendDrawer() {
      this.isRecommendDrawerOpen = !this.isRecommendDrawerOpen
    }
  }
})
