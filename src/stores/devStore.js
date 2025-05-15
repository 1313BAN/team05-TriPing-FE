// src/stores/devStore.js
import { defineStore } from 'pinia'

export const useDevStore = defineStore('dev', {
  state: () => ({
    devMode: false
  }),
  persist: true
})
