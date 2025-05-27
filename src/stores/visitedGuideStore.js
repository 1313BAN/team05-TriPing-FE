// stores/visitedGuideStore.js
import { defineStore } from 'pinia'

export const useVisitedGuideStore = defineStore('visitedGuide', {
  state: () => ({
    visitedIds: []
  }),
  actions: {
    has(id) {
      return this.visitedIds.includes(id)
    },
    add(id) {
      if (!this.has(id)) {
        this.visitedIds.push(id)
      }
    }
  },
  persist: {
    storage: localStorage,
    paths: ['visitedIds']
  }
})
