import { createApp } from 'vue'
import './main.css'
import App from './App.vue'

import 'primeicons/primeicons.css'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import pinia from './plugins/pinia'
import router from './plugins/router'
import PrimeVueComponents from './plugins/primevue'

const app = createApp(App)

app.config.errorHandler = (err, instance, info) => {
  console.error('[Global Error]', err)
  console.error('Component:', instance)
  console.error('Info:', info)
}

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

app.use(router)
app.use(pinia)
app.mount('#app')
