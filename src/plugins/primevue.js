import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Divider from 'primevue/divider'
import ToggleSwitch from 'primevue/toggleswitch'
import Card from 'primevue/card'
import ConfirmDialog from 'primevue/confirmdialog'
import Panel from 'primevue/panel'
import Image from 'primevue/image'
import Paginator from 'primevue/paginator'
import Skeleton from 'primevue/skeleton'
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
    app.component('Panel', Panel)
    app.component('Image', Image)
    app.component('Paginator', Paginator)
    app.component('Skeleton', Skeleton)
    app.use(ToastService)
    app.use(ConfirmationService)
  }
}
