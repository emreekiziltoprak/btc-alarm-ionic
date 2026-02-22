import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Ionic
import { IonicVue } from '@ionic/vue'

// Ionic CSS
import '@ionic/vue/css/core.css'
import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/typography.css'
import '@ionic/vue/css/padding.css'
import '@ionic/vue/css/float-elements.css'
import '@ionic/vue/css/text-alignment.css'
import '@ionic/vue/css/text-transformation.css'
import '@ionic/vue/css/flex-utils.css'
import '@ionic/vue/css/display.css'

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faStar, faArrowLeft } from '@fortawesome/free-solid-svg-icons'

// ApexCharts
import VueApexCharts from 'vue3-apexcharts'

// Add icons to library
library.add(faStar, faArrowLeft)

const app = createApp(App)
  .use(IonicVue)
  .use(createPinia())
  .use(router)
  .use(VueApexCharts)

app.component('font-awesome-icon', FontAwesomeIcon)

router.isReady().then(() => {
  app.mount('#app')
})
