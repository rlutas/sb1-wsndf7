import { defineStore } from 'pinia'
import axios from 'axios'

export const useMainStore = defineStore('main', {
  state: () => ({
    user: null,
    exclusionList: [],
  }),
  actions: {
    async login(username: string, password: string) {
      // Implementați logica de autentificare aici
    },
    async fetchExclusionList() {
      // Implementați logica de preluare a listei de excludere de pe server
    },
  },
})