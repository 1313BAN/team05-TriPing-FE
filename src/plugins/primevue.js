import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Divider from 'primevue/divider'
import { ToggleSwitch } from 'primevue'
import Card from 'primevue/card'
import ConfirmDialog from 'primevue/confirmdialog'

import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'

export default {
  install(app) {
    app.component('Button', Button)
    app.component('Dialog', Dialog)
    app.component('InputText', InputText)
    app.component('Password', Password)
    app.component('Divider', Divider)
    app.component('ToggleSwitch', ToggleSwitch)
    app.component('Card', Card)
    app.component('ConfirmDialog', ConfirmDialog)

    app.use(ToastService)
    app.use(ConfirmationService)
  }
}
