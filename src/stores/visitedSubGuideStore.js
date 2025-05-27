// stores/visitedSubGuideStore.js
import { defineStore } from 'pinia'

export const useVisitedSubGuideStore = defineStore('visitedSubGuide', {
  state: () => ({
    visitedKeys: []
  }),
  actions: {
    makeKey(title, subtitle) {
      return `${title}::${subtitle}`
    },
    has(title, subtitle) {
      return this.visitedKeys.includes(this.makeKey(title, subtitle))
    },
    add(title, subtitle) {
      const key = this.makeKey(title, subtitle)
      if (!this.visitedKeys.includes(key)) {
        this.visitedKeys.push(key)
      }
    }
  },
  persist: {
    storage: localStorage,
    paths: ['visitedKeys']
  }
})
