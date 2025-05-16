import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import ToastService from 'primevue/toastservice'
import Divider from 'primevue/divider'
import { ToggleSwitch } from 'primevue'
import Card from 'primevue/card'

export default {
  install(app) {
    app.component('Button', Button)
    app.component('Dialog', Dialog)
    app.component('InputText', InputText)
    app.component('Divider', Divider)
    app.component('ToggleSwitch', ToggleSwitch)
    app.component('Card', Card)
    app.use(ToastService)
  }
}
