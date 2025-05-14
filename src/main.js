import { createApp } from 'vue'
import './main.css'
import App from './App.vue'
import 'primeicons/primeicons.css'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

import router from './plugins/router' // ✅ 라우터 import
import PrimeVueComponents from './plugins/primevue'

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      cssLayer: {
        name: 'primevue',
        order: 'theme, base, primevue'
      },
      darkModeSelector: '.my-app-dark'
    }
  }
})

app.use(PrimeVueComponents)
app.use(router) // ✅ 반드시 추가
app.mount('#app')
