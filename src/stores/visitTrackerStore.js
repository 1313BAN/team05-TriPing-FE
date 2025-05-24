import { defineStore } from 'pinia'

export const useVisitTrackerStore = defineStore('visitTrackerStore', {
  state: () => ({
    attractionId: null,
    entryTime: null,
    totalStayTime: 0,
    isActive: false,
    isPending: false,
    lastExitTime: null,
    confirmStartTime: null,
    pendingAttractionId: null,
    exitedAttractionId: null,
    lastConfirmedId: null,
    lastConfirmedName: null
  }),
  actions: {
    reset() {
      this.attractionId = null
      this.entryTime = null
      this.totalStayTime = 0
      this.isActive = false
      this.isPending = false
      this.lastExitTime = null
      this.confirmStartTime = null
      this.pendingAttractionId = null
      this.exitedAttractionId = null
      this.lastConfirmedId = null
      this.lastConfirmedName = null
    }
  },
  persist: true
})
